package com.kineticrehab.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CajaCierreRequestDTO {

    @NotNull(message = "El monto final en efectivo es obligatorio")
    @DecimalMin(value = "0.00", message = "El monto final en efectivo no puede ser negativo")
    private BigDecimal montoFinalEfectivo;

    @NotNull(message = "El monto final en Yape/Plin es obligatorio")
    @DecimalMin(value = "0.00", message = "El monto final en Yape/Plin no puede ser negativo")
    private BigDecimal montoFinalYapePlin;

    private String observaciones;
}
