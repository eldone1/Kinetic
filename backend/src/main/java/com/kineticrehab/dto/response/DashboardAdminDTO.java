package com.kineticrehab.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAdminDTO {
    private BigDecimal ventasDelDia;
    private BigDecimal ventasDelMes;
    private BigDecimal ticketPromedio;
    private int pacientesNuevosHoy;
    private int pacientesActivos;
    private int citasProgramadasHoy;
    private int citasCompletadasHoy;
    private int sesionesRealizadasHoy;
    private int cajasAbiertas;
    private int cajasCerradasHoy;
    private List<ChartDataPoint> ventasMensuales;
    private List<ChartDataPoint> pacientesPorDia;
    private List<ChartDataPoint> serviciosMasDemandados;
    private List<ChartDataPoint> rendimientoDoctores;
    private int cajasSinCerrar;
}
