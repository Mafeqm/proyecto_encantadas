package com.encantadas.salon.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompletarCitaDTO {

    @NotNull(message = "El valor final cobrado es obligatorio")
    @PositiveOrZero(message = "El valor final cobrado debe ser mayor o igual a cero")
    private BigDecimal valorFinalCobrado;

    @NotNull(message = "Debe indicar si aplica o no la promoción")
    private Boolean esPromocion;
}
