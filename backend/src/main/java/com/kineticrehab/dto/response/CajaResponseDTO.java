package com.kineticrehab.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CajaResponseDTO {

    private Long id;
    private Long idUsuario;
    private String nombreUsuario;
    private LocalDateTime fechaApertura;
    private BigDecimal montoInicial;
    private LocalDateTime fechaCierre;
    private BigDecimal montoFinalEfectivo;
    private BigDecimal montoFinalYapePlin;
    private BigDecimal totalVentas;
    private String observaciones;
    private String estado;
    private Integer cantidadVentas;
    private BigDecimal esperadoEfectivo;
    private BigDecimal esperadoYapePlin;
    private BigDecimal diferenciaEfectivo;
    private BigDecimal diferenciaYapePlin;
}
