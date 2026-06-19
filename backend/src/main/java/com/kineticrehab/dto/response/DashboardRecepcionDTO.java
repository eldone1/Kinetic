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
public class DashboardRecepcionDTO {
    private int citasDelDia;
    private int pacientesEnEspera;
    private int citasConfirmadas;
    private int citasCanceladas;
    private BigDecimal ventasDelDia;
    private CajaResponseDTO cajaActual;
    private List<CitaResponseDTO> agendaDelDia;
    private List<CitaResponseDTO> cobrosPendientes;
    private List<VentaResponseDTO> ultimasVentas;
    private BigDecimal totalEfectivo;
    private BigDecimal totalYapePlin;
    private List<ChartDataPoint> cobrosPorMetodoPago;
    private List<ChartDataPoint> serviciosMasVendidos;
}
