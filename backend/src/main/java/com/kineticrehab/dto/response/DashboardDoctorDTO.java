package com.kineticrehab.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDoctorDTO {
    private int pacientesAtendidosHoy;
    private int citasPendientes;
    private int citasCompletadasHoy;
    private int sesionesProgramadasHoy;
    private int pacientesEnTratamientoActivo;
    private List<CitaResponseDTO> agendaDelDia;
    private List<CitaResponseDTO> proximasCitas;
    private List<PacienteResponseDTO> pacientesRecientes;
    private List<ChartDataPoint> atencionesPorDia;
    private List<ChartDataPoint> distribucionTratamientos;
}
