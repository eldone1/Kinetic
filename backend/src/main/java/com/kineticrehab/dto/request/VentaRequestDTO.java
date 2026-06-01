package com.kineticrehab.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VentaRequestDTO {

    @NotNull(message = "El paciente es obligatorio")
    private Long idPaciente;

    @NotNull(message = "La cita es obligatoria")
    private Long idCita;

    @NotNull(message = "El total es obligatorio")
    @DecimalMin(value = "0.01", message = "El total debe ser mayor a cero")
    private BigDecimal total;

    @NotBlank(message = "El método de pago es obligatorio")
    private String metodoPago;

    @DecimalMin(value = "0.00", message = "El monto recibido no puede ser negativo")
    private BigDecimal montoRecibido;

    private BigDecimal cambio;
}
