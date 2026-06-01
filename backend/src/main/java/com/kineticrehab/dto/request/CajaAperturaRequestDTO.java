package com.kineticrehab.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CajaAperturaRequestDTO {

    @NotNull(message = "El monto inicial es obligatorio")
    @DecimalMin(value = "0.00", message = "El monto inicial no puede ser negativo")
    private BigDecimal montoInicial;

    private String observaciones;
}
