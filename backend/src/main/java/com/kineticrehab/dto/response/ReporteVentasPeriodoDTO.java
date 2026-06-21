package com.kineticrehab.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteVentasPeriodoDTO {
    private LocalDate fecha;
    private int cantidadVentas;
    private BigDecimal totalEfectivo;
    private BigDecimal totalYapePlin;
    private BigDecimal totalGeneral;
    private List<VentaDetalleDTO> ventas;
}
