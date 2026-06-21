# Módulo 7: Reportes y Dashboard ✅ COMPLETADO

> Dashboard por rol + 7 reportes analíticos con exportación PDF (iText 7) y Excel (Apache POI).  
> Solo ADMIN tiene acceso a reportes.

---

## 1. Alcance

### Incluye
- [x] Dashboard con cards, gráficos y tablas adaptado por rol (ADMIN/RECEPCION/DOCTOR)
- [x] 7 tipos de reportes analíticos con filtros (fecha inicio, fecha fin, doctor opcional)
- [x] Exportación a **PDF** con iText 7 (tablas formateadas con fuente bold, encabezados teal)
- [x] Exportación a **Excel** con Apache POI (encabezados con estilo teal + negrita, columnas auto-size)
- [x] Carga automática de datos al entrar al módulo
- [x] Tabs con selector visual para cambiar entre reportes
- [x] Botones de período rápido: Hoy, Esta Semana, Este Mes
- [x] Indicador de carga y estado vacío ("Sin datos para el período seleccionado")

### Excluye
- ❌ Reportes programados (envío automático por correo)
- ❌ Dashboard con gráficos interactivos (Chart.js no se implementó en reportes, solo en dashboard principal)
- ❌ Exportación CSV

---

## 2. Tipos de Reporte

| Reporte | Endpoint (JSON) | Endpoint PDF | Endpoint XLSX | Descripción |
|---|---|---|---|---|
| Ventas por Período | `GET /api/reportes/ventas-periodo` | `GET /api/reportes/ventas-periodo/pdf` | `GET /api/reportes/ventas-periodo/xlsx` | Ventas agrupadas por día |
| Total Ventas Período | `GET /api/reportes/total-ventas` | — | — | Suma total ventas (efectivo + yape/plin) |
| Ingresos por Servicio | `GET /api/reportes/ingresos-servicio` | `GET /api/reportes/ingresos-servicio/pdf` | `GET /api/reportes/ingresos-servicio/xlsx` | Ingresos agrupados por servicio |
| Atenciones por Doctor | `GET /api/reportes/atenciones-doctor` | `GET /api/reportes/atenciones-doctor/pdf` | `GET /api/reportes/atenciones-doctor/xlsx` | Citas completadas/canceladas/no asistió por doctor |
| Estado de Citas | `GET /api/reportes/estado-citas` | `GET /api/reportes/estado-citas/pdf` | `GET /api/reportes/estado-citas/xlsx` | Distribución de citas por estado |
| Cierres de Caja | `GET /api/reportes/cierres-caja` | — | — | Historial de cierres con diferencias |
| Pacientes Atendidos | `GET /api/reportes/pacientes-atendidos` | `GET /api/reportes/pacientes-atendidos/pdf` | `GET /api/reportes/pacientes-atendidos/xlsx` | Nuevos, recurrentes, total, desglose por día |
| Ocupación de Agenda | `GET /api/reportes/ocupacion-agenda` | `GET /api/reportes/ocupacion-agenda/pdf` | `GET /api/reportes/ocupacion-agenda/xlsx` | % ocupación general + por doctor |

**Nota:** Los reportes de "Total Ventas Período" y "Cierres de Caja" solo tienen endpoint JSON (sin PDF/Excel).

---

## 3. Reglas de Negocio

1. Solo **ADMIN** puede ver y exportar reportes (`@PreAuthorize("hasRole('ADMIN')")` + `roleGuard('ROLE_ADMIN')`)
2. Todos los endpoints requieren filtro de fechas (`fechaInicio`, `fechaFin`) como query params
3. El doctor en los filtros es opcional — si no se envía, incluye todos
4. La exportación PDF se genera server-side con iText 7 (no jsPDF en frontend)
5. La exportación Excel se genera server-side con Apache POI (no librerías JS)
6. El frontend descarga el archivo como blob y dispara la descarga nativa del navegador
7. Los datos se cargan automáticamente al entrar al módulo (sin esperar click en "Generar Reporte")
8. Al cambiar de tab, se recarga el reporte correspondiente

---

## 4. Dependencias Nuevas

### Backend (pom.xml)

```xml
<!-- iText 7 para generación de PDF -->
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>kernel</artifactId>
    <version>7.2.6</version>
</dependency>
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>layout</artifactId>
    <version>7.2.6</version>
</dependency>

<!-- Apache POI para generación de Excel -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.6</version>
</dependency>
```

### Frontend
- Sin nuevas dependencias. Usa `HttpClient` nativo para descarga de blobs.

---

## 5. Archivos Creados

### Backend

| Archivo | Propósito |
|---|---|
| `dto/request/ReporteFiltrosDTO.java` | DTO de filtros (fechaInicio, fechaFin, idDoctor) |
| `dto/response/ReporteVentasPeriodoDTO.java` | DTO ventas por día |
| `dto/response/ReporteIngresosServicioDTO.java` | DTO ingresos por servicio |
| `dto/response/ReporteAtencionesDoctorDTO.java` | DTO atenciones por doctor |
| `dto/response/ReporteEstadoCitasDTO.java` | DTO distribución estados |
| `dto/response/ReportePacientesDTO.java` | DTO pacientes (nuevos/recurrentes/por día) |
| `dto/response/ReporteOcupacionDTO.java` | DTO ocupación de agenda |
| `service/ReporteService.java` | Interfaz del servicio |
| `service/impl/ReporteServiceImpl.java` | Implementación con 8 métodos de consulta |
| `util/ReportePdfGenerator.java` | Generador PDF con iText 7 |
| `util/ReporteExcelGenerator.java` | Generador Excel con Apache POI |
| `controller/ReporteController.java` | 20 endpoints REST |

### Frontend

| Archivo | Propósito |
|---|---|
| `features/reportes/reportes.models.ts` | Interfaces TypeScript (8 DTOs) |
| `core/services/reporte.service.ts` | 14 métodos (datos + descarga + downloadBlob) |
| `features/reportes/reportes.component.ts` | Componente con 7 tabs, filtros, descargas |
| `features/reportes/reportes.routes.ts` | Ruta protegida con guards |

---

## 6. Arquitectura de Exportación

```
[Frontend] --click PDF/Excel--> [ReporteService.download*()] --GET blob-->
[ReporteController] --> [ReportePdfGenerator / ReporteExcelGenerator]
                              |
                              v
                      ResponseEntity<byte[]>
                              |
                              v
[Frontend] downloadBlob() --> a.click() --> Descarga nativa
```

- PDF: `Content-Type: application/pdf`, `Content-Disposition: attachment`
- Excel: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `Content-Disposition: attachment`

---

## 7. Pruebas Manuales

### Backend
1. `GET /api/reportes/ventas-periodo?fechaInicio=2025-08-01&fechaFin=2025-08-31` → JSON con array de ventas
2. `GET /api/reportes/ventas-periodo/pdf?fechaInicio=2025-08-01&fechaFin=2025-08-31` → descarga PDF
3. `GET /api/reportes/ventas-periodo/xlsx?fechaInicio=2025-08-01&fechaFin=2025-08-31` → descarga XLSX
4. `GET /api/reportes/atenciones-doctor?fechaInicio=2025-08-01&fechaFin=2025-08-31&idDoctor=1` → filtrado por doctor
5. `GET /api/reportes/ventas-periodo?fechaInicio=2025-01-01&fechaFin=2025-01-01` → array vacío (sin datos)
6. `GET /api/reportes/ventas-periodo?fechaInicio=2025-08-01` → 400 Bad Request (falta fechaFin)
7. Verificar que recepción/doctor reciban 403 Forbidden

### Frontend
1. Navegar a `/reportes` → ver tabs y filtros cargados
2. Hacer clic en tabs → cambia contenido (Ventas → Servicios → Doctores → etc.)
3. Click "Generar Reporte" → carga datos
4. Click "PDF" → descarga archivo PDF
5. Click "Excel" → descarga archivo XLSX
6. Click "Hoy" / "Esta Semana" / "Este Mes" → cambia fechas y recarga
7. Seleccionar un doctor en el filtro → aplicar
8. Verificar que recepción/doctor no vean el enlace en sidebar

---

## 8. Bugs Conocidos / Fixes

| Bug | Severidad | Estado |
|---|---|---|
| `Collectors.distinct()` no existe en Java Stream API | Alta | ✅ Fix: reemplazado por `Collectors.toSet()` |
| Método incorrecto en `HorarioDoctorRepository` | Alta | ✅ Fix: `findByDoctorIdAndDeletedAtIsNull` → `findByDoctorIdAndDeletedAtIsNullOrderByDiaSemanaAscHoraInicioAsc` |
| Lambdas en `ReporteExcelGenerator` tenían firma incorrecta (2 params en vez de 1) | Alta | ✅ Fix: reescritas todas las lambdas a `(XSSFWorkbook, Sheet, CellStyle)` |
| `IndexedColors.LIGHT_TEAL` no existe | Media | ✅ Fix: cambiado a `IndexedColors.TEAL` |
| `roleGuard` en `reportes.routes.ts` sin arrow function (no pasaba roles al guard) | Alta | ✅ Fix: `roleGuard` → `() => roleGuard(['ROLE_ADMIN'])` |
| Template: `Object is possibly 'null'` en Angular strict mode | Media | ✅ Fix: `pacientesData` y `ocupacionData` inicializados con objeto vacío en vez de `null` |
| No auto-carga de datos al iniciar el componente | Baja | ✅ Fix: `ngOnInit` ahora llama `this.cargarReporte()` |
