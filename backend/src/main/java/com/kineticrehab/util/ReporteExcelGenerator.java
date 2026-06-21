package com.kineticrehab.util;

import com.kineticrehab.dto.response.ReporteAtencionesDoctorDTO;
import com.kineticrehab.dto.response.ReporteIngresosServicioDTO;
import com.kineticrehab.dto.response.ReportePacientesDTO;
import com.kineticrehab.dto.response.ReporteVentasPeriodoDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.util.List;

@Component
@Slf4j
public class ReporteExcelGenerator {

    public byte[] generarVentasPeriodo(List<ReporteVentasPeriodoDTO> data, BigDecimal totalGeneral) {
        return generarExcel("Ventas por Período", new String[]{"Fecha", "Cantidad", "Efectivo", "Yape/Plin", "Total"},
                (wb, sheet, bold) -> {
                    int i = 0;
                    for (var r : data) {
                        Row row = sheet.createRow(++i);
                        row.createCell(0).setCellValue(r.getFecha().toString());
                        row.createCell(1).setCellValue(r.getCantidadVentas());
                        row.createCell(2).setCellValue(r.getTotalEfectivo().doubleValue());
                        row.createCell(3).setCellValue(r.getTotalYapePlin().doubleValue());
                        row.createCell(4).setCellValue(r.getTotalGeneral().doubleValue());
                    }
                    Row totalRow = sheet.createRow(++i);
                    totalRow.createCell(0).setCellValue("TOTAL");
                    totalRow.getCell(0).setCellStyle(bold);
                    totalRow.createCell(4).setCellValue(totalGeneral.doubleValue());
                    totalRow.getCell(4).setCellStyle(bold);
                });
    }

    public byte[] generarIngresosServicio(List<ReporteIngresosServicioDTO> data) {
        BigDecimal total = data.stream().map(ReporteIngresosServicioDTO::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return generarExcel("Ingresos por Servicio", new String[]{"Servicio", "Cantidad", "Total"},
                (wb, sheet, bold) -> {
                    int i = 0;
                    for (var r : data) {
                        Row row = sheet.createRow(++i);
                        row.createCell(0).setCellValue(r.getServicio());
                        row.createCell(1).setCellValue(r.getCantidad());
                        row.createCell(2).setCellValue(r.getTotal().doubleValue());
                    }
                    Row totalRow = sheet.createRow(++i);
                    totalRow.createCell(0).setCellValue("TOTAL");
                    totalRow.getCell(0).setCellStyle(bold);
                    totalRow.createCell(2).setCellValue(total.doubleValue());
                    totalRow.getCell(2).setCellStyle(bold);
                });
    }

    public byte[] generarAtencionesDoctor(List<ReporteAtencionesDoctorDTO> data) {
        return generarExcel("Atenciones y Ocupación por Doctor",
                new String[]{"Doctor", "Completadas", "Canceladas", "No Asistió", "Capacidad", "Ocupación"},
                (wb, sheet, bold) -> {
                    int i = 0;
                    for (var r : data) {
                        Row row = sheet.createRow(++i);
                        row.createCell(0).setCellValue(r.getNombreDoctor());
                        row.createCell(1).setCellValue(r.getTotalCitasCompletadas());
                        row.createCell(2).setCellValue(r.getTotalCitasCanceladas());
                        row.createCell(3).setCellValue(r.getTotalCitasNoAsistio());
                        row.createCell(4).setCellValue(r.getCapacidadTotal());
                        row.createCell(5).setCellValue(r.getPorcentajeOcupacion() + "%");
                    }
                });
    }

    public byte[] generarPacientes(ReportePacientesDTO data) {
        return generarExcel("Pacientes Atendidos", new String[]{"Tipo", "Cantidad"},
                (wb, sheet, bold) -> {
                    sheet.createRow(1).createCell(0).setCellValue("Nuevos");
                    sheet.getRow(1).createCell(1).setCellValue(data.getPacientesNuevos());
                    sheet.createRow(2).createCell(0).setCellValue("Recurrentes");
                    sheet.getRow(2).createCell(1).setCellValue(data.getPacientesRecurrentes());
                    Row totalRow = sheet.createRow(3);
                    totalRow.createCell(0).setCellValue("Total");
                    totalRow.getCell(0).setCellStyle(bold);
                    totalRow.createCell(1).setCellValue(data.getTotalPacientes());
                    totalRow.getCell(1).setCellStyle(bold);
                });
    }

    @FunctionalInterface
    private interface ExcelFiller {
        void fill(XSSFWorkbook wb, Sheet sheet, CellStyle boldStyle);
    }

    private byte[] generarExcel(String titulo, String[] headers, ExcelFiller filler) {
        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet(titulo);

            CellStyle headerStyle = wb.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.TEAL.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = wb.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);

            CellStyle boldStyle = wb.createCellStyle();
            Font boldFont = wb.createFont();
            boldFont.setBold(true);
            boldStyle.setFont(boldFont);

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            filler.fill(wb, sheet, boldStyle);

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                wb.write(baos);
                return baos.toByteArray();
            }
        } catch (Exception e) {
            log.error("Error generando Excel", e);
            throw new RuntimeException("Error al generar Excel", e);
        }
    }
}
