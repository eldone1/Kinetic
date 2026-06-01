package com.kineticrehab.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VentaResponseDTO {

    private Long id;
    private Long idCaja;
    private Long idPaciente;
    private String nombrePaciente;
    private String documentoPaciente;
    private Long idCita;
    private String fechaCita;
    private String horaCita;
    private Long idUsuario;
    private String nombreUsuario;
    private LocalDateTime fechaVenta;
    private BigDecimal total;
    private String metodoPago;
    private BigDecimal montoRecibido;
    private BigDecimal cambio;
    private String estado;
}
