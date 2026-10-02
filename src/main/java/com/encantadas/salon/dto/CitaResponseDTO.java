package com.encantadas.salon.dto;

import com.encantadas.salon.model.enums.EstadoCita;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitaResponseDTO {
    private Long idCita;
    private Long idClienta;
    private String nombreClienta;
    private String numeroWhatsapp;
    private Long idEstilista;
    private String nombreEstilista;
    private Long idServicio;
    private String nombreServicio;
    private Integer duracionMinutos;
    private BigDecimal precioBaseServicio;
    private OffsetDateTime fechaHoraInicio;
    private OffsetDateTime fechaHoraFin;
    private EstadoCita estado;
    private String observaciones;
    private BigDecimal valorFinalCobrado;
    private Boolean esPromocion;
    private BigDecimal gananciaEstilista;
    private BigDecimal gananciaSalon;
}
