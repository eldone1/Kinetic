package com.kineticrehab.util;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.kineticrehab.dto.response.ReporteAtencionesDoctorDTO;
import com.kineticrehab.dto.response.ReporteIngresosServicioDTO;
import com.kineticrehab.dto.response.ReportePacientesDTO;
import com.kineticrehab.dto.response.ReporteVentasPeriodoDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.util.List;

@Component
@Slf4j
public class ReportePdfGenerator {

    public byte[] generarVentasPeriodo(List<ReporteVentasPeriodoDTO> data, BigDecimal totalGeneral) {
        return generarPDF("Reporte de Ventas por Período",
                new String[]{"Fecha", "Cantidad", "Efectivo", "Yape/Plin", "Total"},
                data.size() + 2,
                (table, font) -> {
                    for (var r : data) {
                        table.addCell(new Cell().add(new Paragraph(r.getFecha().toString()).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph(String.valueOf(r.getCantidadVentas())).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph("S/ " + r.getTotalEfectivo()).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph("S/ " + r.getTotalYapePlin()).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph("S/ " + r.getTotalGeneral()).setFont(font)));
                    }
                    addTotalRow(table, font, totalGeneral, 4);
                });
    }

    public byte[] generarIngresosServicio(List<ReporteIngresosServicioDTO> data) {
        BigDecimal total = data.stream().map(ReporteIngresosServicioDTO::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return generarPDF("Reporte de Ingresos por Servicio",
                new String[]{"Servicio", "Cantidad", "Total"},
                data.size() + 2,
                (table, font) -> {
                    for (var r : data) {
                        table.addCell(new Cell().add(new Paragraph(r.getServicio()).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph(String.valueOf(r.getCantidad())).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph("S/ " + r.getTotal()).setFont(font)));
                    }
                    addTotalRow(table, font, total, 2);
                });
    }

    public byte[] generarAtencionesDoctor(List<ReporteAtencionesDoctorDTO> data) {
        return generarPDF("Reporte de Atenciones y Ocupación por Doctor",
                new String[]{"Doctor", "Completadas", "Canceladas", "No Asistió", "Capacidad", "Ocupación"},
                data.size() + 1,
                (table, font) -> {
                    for (var r : data) {
                        table.addCell(new Cell().add(new Paragraph(r.getNombreDoctor()).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph(String.valueOf(r.getTotalCitasCompletadas())).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph(String.valueOf(r.getTotalCitasCanceladas())).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph(String.valueOf(r.getTotalCitasNoAsistio())).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph(String.valueOf(r.getCapacidadTotal())).setFont(font)));
                        table.addCell(new Cell().add(new Paragraph(r.getPorcentajeOcupacion() + "%").setFont(font)));
                    }
                });
    }

    public byte[] generarPacientes(ReportePacientesDTO data) {
        return generarPDF("Reporte de Pacientes Atendidos",
                new String[]{"Tipo", "Cantidad"},
                4,
                (table, font) -> {
                    table.addCell(new Cell().add(new Paragraph("Nuevos").setFont(font)));
                    table.addCell(new Cell().add(new Paragraph(String.valueOf(data.getPacientesNuevos())).setFont(font)));
                    table.addCell(new Cell().add(new Paragraph("Recurrentes").setFont(font)));
                    table.addCell(new Cell().add(new Paragraph(String.valueOf(data.getPacientesRecurrentes())).setFont(font)));
                    table.addCell(new Cell().add(new Paragraph("Total").setFont(font).setBold()));
                    table.addCell(new Cell().add(new Paragraph(String.valueOf(data.getTotalPacientes())).setFont(font).setBold()));
                });
    }

    private byte[] generarPDF(String titulo, String[] headers, int rows, PdfTableFiller filler) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            PdfFont font = PdfFontFactory.createFont();
            document.add(new Paragraph(titulo)
                    .setFont(font).setFontSize(16).setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            Table table = new Table(UnitValue.createPercentArray(headers.length)).useAllAvailableWidth();

            for (String header : headers) {
                table.addHeaderCell(new Cell().add(new Paragraph(header).setFont(font).setBold())
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                        .setTextAlignment(TextAlignment.CENTER));
            }

            filler.fill(table, font);

            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generando PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Error al generar PDF", e);
        }
    }

    private void addTotalRow(Table table, PdfFont font, BigDecimal total, int colspan) {
        Cell labelCell = new Cell(1, colspan)
                .add(new Paragraph("Total General").setFont(font).setBold())
                .setTextAlignment(TextAlignment.RIGHT);
        table.addCell(labelCell);
        table.addCell(new Cell().add(new Paragraph("S/ " + total).setFont(font).setBold())
                .setTextAlignment(TextAlignment.CENTER));
    }

    @FunctionalInterface
    private interface PdfTableFiller {
        void fill(Table table, PdfFont font);
    }
}
