package com.encantadas.salon.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitaRequestDTO {

    @NotNull(message = "El ID de la clienta es obligatorio")
    private Long idClienta;

    @NotNull(message = "El ID de la estilista es obligatorio")
    private Long idEstilista;

    @NotNull(message = "El ID del servicio es obligatorio")
    private Long idServicio;

    @NotNull(message = "La fecha y hora de inicio es obligatoria")
    private OffsetDateTime fechaHoraInicio;

    private String observaciones;
}
