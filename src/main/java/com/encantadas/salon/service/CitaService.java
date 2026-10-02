package com.encantadas.salon.service;

import com.encantadas.salon.dto.CitaRequestDTO;
import com.encantadas.salon.dto.CitaResponseDTO;
import com.encantadas.salon.dto.CompletarCitaDTO;
import com.encantadas.salon.exception.HorarioNoDisponibleException;
import com.encantadas.salon.exception.ResourceNotFoundException;
import com.encantadas.salon.model.*;
import com.encantadas.salon.model.enums.EstadoCita;
import com.encantadas.salon.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;
    private final ClientaRepository clientaRepository;
    private final EstilistaRepository estilistaRepository;
    private final ServicioRepository servicioRepository;
    private final BloqueoHorarioRepository bloqueoHorarioRepository;
    private final PagoComisionRepository pagoComisionRepository;

    private static final LocalTime HORA_INICIO_LOCAL = LocalTime.of(9, 0);
    private static final LocalTime HORA_MAX_INICIO_LOCAL = LocalTime.of(18, 30);
    private static final LocalTime HORA_FIN_LOCAL = LocalTime.of(19, 0);

    /**
     * a) Busca la duración del servicio y calcula automáticamente la hora_fin.
     * b) Valida que la cita no se cruce con otra cita existente de esa estilista.
     * c) Valida que no choque con ningún bloqueo de horario/ausencia de la estilista.
     */
    @Transactional
    public CitaResponseDTO crearCita(CitaRequestDTO dto) {
        // 1. Obtener Entidades asociadas
        Clienta clienta = clientaRepository.findById(dto.getIdClienta())
                .orElseThrow(() -> new ResourceNotFoundException("Clienta no encontrada con ID: " + dto.getIdClienta()));

        Estilista estilista = estilistaRepository.findById(dto.getIdEstilista())
                .orElseThrow(() -> new ResourceNotFoundException("Estilista no encontrada con ID: " + dto.getIdEstilista()));

        if (!Boolean.TRUE.equals(estilista.getActivo())) {
            throw new IllegalArgumentException("La estilista seleccionada no se encuentra activa.");
        }

        Servicio servicio = servicioRepository.findById(dto.getIdServicio())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con ID: " + dto.getIdServicio()));

        // 2. a) Calcular automáticamente fechaHoraFin
        OffsetDateTime inicio = dto.getFechaHoraInicio();
        OffsetDateTime fin = inicio.plusMinutes(servicio.getDuracionMinutos());

        // 3. Validar horario comercial del salón (09:00 a 19:00, última cita a las 18:30)
        validarHorarioComercial(inicio, fin);

        // 4. c) Validar bloqueos de horario / ausencias de la estilista
        boolean tieneBloqueo = bloqueoHorarioRepository.existeBloqueoHorario(
                estilista.getIdEstilista(), inicio, fin
        );
        if (tieneBloqueo) {
            throw new HorarioNoDisponibleException("La estilista no está disponible debido a un bloqueo de horario o ausencia.");
        }

        // 5. b) Validar que no exista cruce con otras citas activas de la estilista
        List<EstadoCita> estadosActivos = List.of(EstadoCita.Pendiente, EstadoCita.Confirmada, EstadoCita.Completada);
        boolean tieneCruce = citaRepository.existeCruceCita(
                estilista.getIdEstilista(), inicio, fin, estadosActivos, null
        );
        if (tieneCruce) {
            throw new HorarioNoDisponibleException("La estilista ya tiene otra cita agendada en esa franja horaria.");
        }

        // 6. Construir y guardar la nueva Cita
        Cita cita = Cita.builder()
                .clienta(clienta)
                .estilista(estilista)
                .servicio(servicio)
                .fechaHoraInicio(inicio)
                .fechaHoraFin(fin)
                .estado(EstadoCita.Pendiente)
                .observaciones(dto.getObservaciones())
                .build();

        Cita citaGuardada = citaRepository.save(cita);
        return mapToResponseDTO(citaGuardada, null);
    }

    /**
     * Marca la cita como 'Completada' y liquida la comisión de la estilista:
     * - 45% del valor final cobrado en condiciones normales.
     * - 50% si el booleano esPromocion es true.
     */
    @Transactional
    public CitaResponseDTO completarCita(Long idCita, CompletarCitaDTO dto) {
        Cita cita = citaRepository.findById(idCita)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + idCita));

        if (cita.getEstado() == EstadoCita.Cancelada_por_retraso) {
            throw new IllegalArgumentException("No se puede completar una cita previamente cancelada por retraso.");
        }

        // Cambiar estado a Completada
        cita.setEstado(EstadoCita.Completada);
        citaRepository.save(cita);

        // Registrar o actualizar Pago y Comisión
        PagoComision pago = pagoComisionRepository.findByCitaIdCita(idCita)
                .orElse(PagoComision.builder().cita(cita).build());

        pago.setValorFinalCobrado(dto.getValorFinalCobrado());
        pago.setEsPromocion(dto.getEsPromocion());
        PagoComision pagoGuardado = pagoComisionRepository.save(pago);

        return mapToResponseDTO(cita, pagoGuardado);
    }

    /**
     * Cambia el estado de la cita a Cancelada_por_retraso por política estricta de 15 a 20 min.
     */
    @Transactional
    public CitaResponseDTO cancelarPorRetraso(Long idCita) {
        Cita cita = citaRepository.findById(idCita)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + idCita));

        cita.setEstado(EstadoCita.Cancelada_por_retraso);
        Cita citaActualizada = citaRepository.save(cita);
        return mapToResponseDTO(citaActualizada, null);
    }

    private void validarHorarioComercial(OffsetDateTime inicio, OffsetDateTime fin) {
        LocalTime horaInicio = inicio.toLocalTime();
        LocalTime horaFin = fin.toLocalTime();

        if (horaInicio.isBefore(HORA_INICIO_LOCAL) || horaInicio.isAfter(HORA_MAX_INICIO_LOCAL)) {
            throw new HorarioNoDisponibleException("La cita debe iniciar entre las 09:00 y las 18:30.");
        }
        if (horaFin.isAfter(HORA_FIN_LOCAL) && !horaFin.equals(LocalTime.MIDNIGHT)) {
            throw new HorarioNoDisponibleException("La cita excede el horario de cierre del salón (19:00).");
        }
    }

    private CitaResponseDTO mapToResponseDTO(Cita cita, PagoComision pago) {
        BigDecimal porcentaje = null;
        BigDecimal gananciaEstilista = null;
        BigDecimal gananciaSalon = null;

        if (pago != null) {
            BigDecimal factorComision = pago.getEsPromocion() ? new BigDecimal("0.50") : new BigDecimal("0.45");
            porcentaje = pago.getEsPromocion() ? new BigDecimal("50.00") : new BigDecimal("45.00");
            gananciaEstilista = pago.getValorFinalCobrado().multiply(factorComision).setScale(2, RoundingMode.HALF_UP);
            gananciaSalon = pago.getValorFinalCobrado().subtract(gananciaEstilista);
        }

        return CitaResponseDTO.builder()
                .idCita(cita.getIdCita())
                .idClienta(cita.getClienta().getIdClienta())
                .nombreClienta(cita.getClienta().getNombre())
                .numeroWhatsapp(cita.getClienta().getNumeroWhatsapp())
                .idEstilista(cita.getEstilista().getIdEstilista())
                .nombreEstilista(cita.getEstilista().getNombre())
                .idServicio(cita.getServicio().getIdServicio())
                .nombreServicio(cita.getServicio().getNombreServicio())
                .duracionMinutos(cita.getServicio().getDuracionMinutos())
                .precioBaseServicio(cita.getServicio().getPrecioBase())
                .fechaHoraInicio(cita.getFechaHoraInicio())
                .fechaHoraFin(cita.getFechaHoraFin())
                .estado(cita.getEstado())
                .observaciones(cita.getObservaciones())
                .valorFinalCobrado(pago != null ? pago.getValorFinalCobrado() : null)
                .esPromocion(pago != null ? pago.getEsPromocion() : null)
                .gananciaEstilista(gananciaEstilista)
                .gananciaSalon(gananciaSalon)
                .build();
    }
}
