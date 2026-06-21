package com.kineticrehab.service;

import com.kineticrehab.dto.response.CajaResponseDTO;
import com.kineticrehab.dto.response.ChartDataPoint;
import com.kineticrehab.dto.response.ReporteAtencionesDoctorDTO;
import com.kineticrehab.dto.response.ReporteIngresosServicioDTO;
import com.kineticrehab.dto.response.ReportePacientesDTO;
import com.kineticrehab.dto.response.ReporteVentasPeriodoDTO;

import java.time.LocalDate;
import java.util.List;

public interface ReporteService {

    List<ReporteVentasPeriodoDTO> ventasPorPeriodo(LocalDate fechaInicio, LocalDate fechaFin);

    List<ReporteIngresosServicioDTO> ingresosPorServicio(LocalDate fechaInicio, LocalDate fechaFin);

    List<ReporteAtencionesDoctorDTO> atencionesPorDoctor(LocalDate fechaInicio, LocalDate fechaFin, Long idDoctor);

    List<CajaResponseDTO> cierresCaja(LocalDate fechaInicio, LocalDate fechaFin);

    ReportePacientesDTO pacientesAtendidos(LocalDate fechaInicio, LocalDate fechaFin);

    List<ChartDataPoint> tratamientosEstado();
}
