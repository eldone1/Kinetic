package com.kineticrehab.controller;

import com.kineticrehab.dto.response.CajaResponseDTO;
import com.kineticrehab.dto.response.ChartDataPoint;
import com.kineticrehab.dto.response.ReporteAtencionesDoctorDTO;
import com.kineticrehab.dto.response.ReporteIngresosServicioDTO;
import com.kineticrehab.dto.response.ReportePacientesDTO;
import com.kineticrehab.dto.response.ReporteVentasPeriodoDTO;
import com.kineticrehab.service.ReporteService;
import com.kineticrehab.util.ReporteExcelGenerator;
import com.kineticrehab.util.ReportePdfGenerator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "Reportes exportables (solo ADMIN)")
@PreAuthorize("hasRole('ADMIN')")
public class ReporteController {

    private final ReporteService reporteService;
    private final ReportePdfGenerator pdfGenerator;
    private final ReporteExcelGenerator excelGenerator;

    @GetMapping("/ventas-periodo")
    @Operation(summary = "Obtener datos de ventas por período")
    public ResponseEntity<List<ReporteVentasPeriodoDTO>> ventasPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(reporteService.ventasPorPeriodo(fechaInicio, fechaFin));
    }

    @GetMapping("/ventas-periodo/pdf")
    @Operation(summary = "Exportar ventas por período a PDF")
    public ResponseEntity<byte[]> ventasPeriodoPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<ReporteVentasPeriodoDTO> data = reporteService.ventasPorPeriodo(fechaInicio, fechaFin);
        BigDecimal total = data.stream().map(ReporteVentasPeriodoDTO::getTotalGeneral)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        byte[] pdf = pdfGenerator.generarVentasPeriodo(data, total);
        return fileResponse(pdf, "ventas-periodo.pdf");
    }

    @GetMapping("/ventas-periodo/xlsx")
    @Operation(summary = "Exportar ventas por período a Excel")
    public ResponseEntity<byte[]> ventasPeriodoExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<ReporteVentasPeriodoDTO> data = reporteService.ventasPorPeriodo(fechaInicio, fechaFin);
        BigDecimal total = data.stream().map(ReporteVentasPeriodoDTO::getTotalGeneral)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        byte[] excel = excelGenerator.generarVentasPeriodo(data, total);
        return fileResponse(excel, "ventas-periodo.xlsx");
    }

    @GetMapping("/ingresos-servicio")
    @Operation(summary = "Obtener ingresos agrupados por servicio")
    public ResponseEntity<List<ReporteIngresosServicioDTO>> ingresosServicio(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(reporteService.ingresosPorServicio(fechaInicio, fechaFin));
    }

    @GetMapping("/ingresos-servicio/pdf")
    @Operation(summary = "Exportar ingresos por servicio a PDF")
    public ResponseEntity<byte[]> ingresosServicioPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        byte[] pdf = pdfGenerator.generarIngresosServicio(
                reporteService.ingresosPorServicio(fechaInicio, fechaFin));
        return fileResponse(pdf, "ingresos-servicio.pdf");
    }

    @GetMapping("/ingresos-servicio/xlsx")
    @Operation(summary = "Exportar ingresos por servicio a Excel")
    public ResponseEntity<byte[]> ingresosServicioExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        byte[] excel = excelGenerator.generarIngresosServicio(
                reporteService.ingresosPorServicio(fechaInicio, fechaFin));
        return fileResponse(excel, "ingresos-servicio.xlsx");
    }

    @GetMapping("/atenciones-doctor")
    @Operation(summary = "Obtener atenciones agrupadas por doctor (incluye ocupación)")
    public ResponseEntity<List<ReporteAtencionesDoctorDTO>> atencionesDoctor(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) Long idDoctor) {
        return ResponseEntity.ok(reporteService.atencionesPorDoctor(fechaInicio, fechaFin, idDoctor));
    }

    @GetMapping("/atenciones-doctor/pdf")
    @Operation(summary = "Exportar atenciones por doctor a PDF")
    public ResponseEntity<byte[]> atencionesDoctorPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) Long idDoctor) {
        byte[] pdf = pdfGenerator.generarAtencionesDoctor(
                reporteService.atencionesPorDoctor(fechaInicio, fechaFin, idDoctor));
        return fileResponse(pdf, "atenciones-doctor.pdf");
    }

    @GetMapping("/atenciones-doctor/xlsx")
    @Operation(summary = "Exportar atenciones por doctor a Excel")
    public ResponseEntity<byte[]> atencionesDoctorExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) Long idDoctor) {
        byte[] excel = excelGenerator.generarAtencionesDoctor(
                reporteService.atencionesPorDoctor(fechaInicio, fechaFin, idDoctor));
        return fileResponse(excel, "atenciones-doctor.xlsx");
    }

    @GetMapping("/cierres-caja")
    @Operation(summary = "Obtener historial de cierres de caja")
    public ResponseEntity<List<CajaResponseDTO>> cierresCaja(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(reporteService.cierresCaja(fechaInicio, fechaFin));
    }

    @GetMapping("/pacientes")
    @Operation(summary = "Obtener reporte de pacientes atendidos")
    public ResponseEntity<ReportePacientesDTO> pacientes(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(reporteService.pacientesAtendidos(fechaInicio, fechaFin));
    }

    @GetMapping("/pacientes/pdf")
    @Operation(summary = "Exportar pacientes atendidos a PDF")
    public ResponseEntity<byte[]> pacientesPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        byte[] pdf = pdfGenerator.generarPacientes(
                reporteService.pacientesAtendidos(fechaInicio, fechaFin));
        return fileResponse(pdf, "pacientes-atendidos.pdf");
    }

    @GetMapping("/pacientes/xlsx")
    @Operation(summary = "Exportar pacientes atendidos a Excel")
    public ResponseEntity<byte[]> pacientesExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        byte[] excel = excelGenerator.generarPacientes(
                reporteService.pacientesAtendidos(fechaInicio, fechaFin));
        return fileResponse(excel, "pacientes-atendidos.xlsx");
    }

    private ResponseEntity<byte[]> fileResponse(byte[] data, String filename) {
        String ext = filename.substring(filename.lastIndexOf('.') + 1);
        MediaType mediaType = "pdf".equals(ext)
                ? MediaType.APPLICATION_PDF
                : MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(mediaType)
                .body(data);
    }
}
