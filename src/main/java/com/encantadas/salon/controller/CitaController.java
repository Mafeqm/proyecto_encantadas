package com.encantadas.salon.controller;

import com.encantadas.salon.dto.CitaRequestDTO;
import com.encantadas.salon.dto.CitaResponseDTO;
import com.encantadas.salon.dto.CompletarCitaDTO;
import com.encantadas.salon.service.CitaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService citaService;

    /**
     * Endpoint PÚBLICO: Permite agendar una cita básica sin necesidad de token JWT (reserva sin fricción).
     */
    @PostMapping("/reservar-publica")
    public ResponseEntity<CitaResponseDTO> crearCitaPublica(@Valid @RequestBody CitaRequestDTO requestDTO) {
        CitaResponseDTO nuevaCita = citaService.crearCita(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCita);
    }

    /**
     * Endpoint PRIVADO (Protegido por JWT): Permite al administrador/estilista marcar una cita como completada y registrar el cobro/comisión.
     */
    @PutMapping("/{id}/completar")
    public ResponseEntity<CitaResponseDTO> completarCita(
            @PathVariable Long id,
            @Valid @RequestBody CompletarCitaDTO dto) {
        CitaResponseDTO citaCompletada = citaService.completarCita(id, dto);
        return ResponseEntity.ok(citaCompletada);
    }

    /**
     * Endpoint PRIVADO (Protegido por JWT): Marca la cita como cancelada por retraso excede la tolerancia máxima.
     */
    @PutMapping("/{id}/cancelar-retraso")
    public ResponseEntity<CitaResponseDTO> cancelarPorRetraso(@PathVariable Long id) {
        CitaResponseDTO citaCancelada = citaService.cancelarPorRetraso(id);
        return ResponseEntity.ok(citaCancelada);
    }
}
