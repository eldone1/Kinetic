# Módulo 7: Reportes y Dashboard

> Dashboard por rol + 5 reportes analíticos (consolidados de 7) con exportación PDF (iText 7) y Excel (Apache POI).  
> Solo ADMIN tiene acceso a reportes.

---

## 1. Estado Actual

### Completado
- [x] Dashboard con cards, gráficos y tablas adaptado por rol (ADMIN/RECEPCION/DOCTOR)
- [x] 5 reportes analíticos (Ventas, Servicios, Doctores+Ocupación, Caja, Pacientes) — consolidado de 7 originales
- [x] Exportación a **PDF** con iText 7 (tablas formateadas con fuente bold, encabezados teal)
- [x] Exportación a **Excel** con Apache POI (encabezados con estilo teal + negrita, columnas auto-size)
- [x] Carga automática de datos (`ngModelChange` en filtros + `onTabChange`)
- [x] Tabs con selector visual para cambiar entre reportes (5 tabs)
- [x] Botón **Limpiar** (reemplaza "Generar Reporte") — resetea fechas a hoy y doctor a null
- [x] Botones de período rápido: Hoy, Esta Semana, Este Mes (con auto-carga)
- [x] Filas expandibles (▼/▶) con sub-tabla de detalle en todos los tabs
- [x] Indicador de carga y estado vacío ("Sin datos para el período seleccionado")
- [x] Login: overlay `bg-black/50` sobre imagen de fondo para mejor contraste con el formulario

### Pendiente
- [ ] Correcciones menores post-deploy si aplica

### Excluye
- ❌ Reportes programados (envío automático por correo)
- ❌ Dashboard con gráficos interactivos (Chart.js no se implementó en reportes, solo en dashboard principal)
- ❌ Exportación CSV

---

## 2. Tipos de Reporte (5 tabs)

| Reporte | Endpoint (JSON) | Endpoint PDF | Endpoint XLSX | Descripción |
|---|---|---|---|---|
| Ventas por Período | `GET /api/reportes/ventas-periodo` | `GET /api/reportes/ventas-periodo/pdf` | `GET /api/reportes/ventas-periodo/xlsx` | Ventas agrupadas por día con detalle |
| Ingresos por Servicio | `GET /api/reportes/ingresos-servicio` | `GET /api/reportes/ingresos-servicio/pdf` | `GET /api/reportes/ingresos-servicio/xlsx` | Ingresos agrupados por servicio con detalle |
| Atenciones por Doctor | `GET /api/reportes/atenciones-doctor` | `GET /api/reportes/atenciones-doctor/pdf` | `GET /api/reportes/atenciones-doctor/xlsx` | Citas completadas/canceladas/no asistió + capacidad/ocupación |
| Cierres de Caja | `GET /api/reportes/cierres-caja` | — | — | Historial de cierres con detalle de ventas |
| Pacientes Atendidos | `GET /api/reportes/pacientes-atendidos` | `GET /api/reportes/pacientes-atendidos/pdf` | `GET /api/reportes/pacientes-atendidos/xlsx` | Nuevos, recurrentes, total, desglose por día |

**Nota:** Estado de Citas y Ocupación de Agenda se eliminaron como tabs independientes. Ocupación se fusionó en el tab Doctores (capacidad/porcentaje). Solo Caja no tiene exportación PDF/Excel.

---

## 3. Reglas de Negocio

1. Solo **ADMIN** puede ver y exportar reportes (`@PreAuthorize("hasRole('ADMIN')")` + `roleGuard('ROLE_ADMIN')`)
2. Todos los endpoints requieren filtro de fechas (`fechaInicio`, `fechaFin`) como query params
3. El doctor en los filtros es opcional — si no se envía, incluye todos
4. La exportación PDF se genera server-side con iText 7 (no jsPDF en frontend)
5. La exportación Excel se genera server-side con Apache POI (no librerías JS)
6. El frontend descarga el archivo como blob y dispara la descarga nativa del navegador
7. Los datos se cargan automáticamente al cambiar filtros (`ngModelChange`) o tabs (`onTabChange`)
8. Cada fila es expandible (▼) con sub-tabla de detalle

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

## 5. Archivos

### Backend

| Archivo | Propósito |
|---|---|
| `dto/request/ReporteFiltrosDTO.java` | DTO de filtros (fechaInicio, fechaFin, idDoctor) |
| `dto/response/ReporteVentasPeriodoDTO.java` | DTO ventas por día + `List<VentaDetalleDTO>` |
| `dto/response/ReporteIngresosServicioDTO.java` | DTO ingresos por servicio + `List<IngresoServicioDetalleDTO>` |
| `dto/response/ReporteAtencionesDoctorDTO.java` | DTO atenciones por doctor (con capacidadTotal, porcentajeOcupacion, slots) |
| `dto/response/ReporteEstadoCitasDTO.java` | (sin uso actual) |
| `dto/response/ReportePacientesDTO.java` | DTO pacientes (nuevos/recurrentes/por día + detalle) |
| `dto/response/ReporteOcupacionDTO.java` | (sin uso actual) |
| `dto/response/CajaResponseDTO.java` | DTO cierre caja + `List<VentaDetalleDTO>` |
| `dto/response/VentaDetalleDTO.java` | Detalle de venta individual |
| `dto/response/IngresoServicioDetalleDTO.java` | Detalle de ingreso por servicio |
| `dto/response/AtencionDoctorDetalleDTO.java` | Detalle de atención por doctor |
| `dto/response/EstadoCitaDetalleDTO.java` | Detalle de estado de cita |
| `dto/response/PacienteDetalleDTO.java` | Detalle de paciente |
| `dto/response/OcupacionDetalleDTO.java` | Detalle de slot ocupado |
| `service/ReporteService.java` | Interfaz con 5 métodos |
| `service/impl/ReporteServiceImpl.java` | Implementación con 5 métodos |
| `util/ReportePdfGenerator.java` | Generador PDF con iText 7 |
| `util/ReporteExcelGenerator.java` | Generador Excel con Apache POI |
| `controller/ReporteController.java` | 14 endpoints REST |

### Frontend

| Archivo | Propósito |
|---|---|
| `features/reportes/reportes.models.ts` | Interfaces TypeScript (5 tabs) |
| `core/services/reporte.service.ts` | 12 métodos (datos + descarga + downloadBlob) |
| `features/reportes/reportes.component.ts` | Componente con 5 tabs, filtros, descargas, filas expandibles |
| `features/reportes/reportes.routes.ts` | Ruta protegida con `() => roleGuard(['ROLE_ADMIN'])` |

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

## 7. Bugs Conocidos / Fixes

| Bug | Severidad | Estado |
|---|---|---|
| `Collectors.distinct()` no existe en Java Stream API | Alta | ✅ Fix: reemplazado por `Collectors.toSet()` |
| Método incorrecto en `HorarioDoctorRepository` | Alta | ✅ Fix: `findByDoctorIdAndDeletedAtIsNull` → `findByDoctorIdAndDeletedAtIsNullOrderByDiaSemanaAscHoraInicioAsc` |
| Lambdas en `ReporteExcelGenerator` tenían firma incorrecta (2 params en vez de 1) | Alta | ✅ Fix: reescritas todas las lambdas a `(XSSFWorkbook, Sheet, CellStyle)` |
| `IndexedColors.LIGHT_TEAL` no existe | Media | ✅ Fix: cambiado a `IndexedColors.TEAL` |
| `roleGuard` en `reportes.routes.ts` sin arrow function (no pasaba roles al guard) | Alta | ✅ Fix: `roleGuard` → `() => roleGuard(['ROLE_ADMIN'])` |
| Template: `Object is possibly 'null'` en Angular strict mode | Media | ✅ Fix: `pacientesData` y `ocupacionData` inicializados con objeto vacío en vez de `null` |
| No auto-carga de datos al iniciar el componente | Baja | ✅ Fix: `ngOnInit` ahora llama `this.cargarReporte()` |

---

## 8. Cambios Recientes

### Login — Overlay de fondo
- **Archivo:** `frontend/src/app/features/auth/login/login.component.ts:14`
- Reemplazado `bg-gradient-to-br from-primary-900/30 via-primary-800/10 to-gray-900/30` por `bg-black/50`
- Efecto: la imagen de fondo se ve más suave/transparente, dando contraste con el formulario glass blanco
- El formulario (`.glass-login`) se mantiene sin cambios

### Consolidación 7 → 5 Reportes
- Eliminados tabs: Estado de Citas (operativo, no gerencial) y Ocupación (fusionada con Doctores)
- Doctores ahora incluye capacidad total y % ocupación
- Eliminados endpoints: `total-ventas`, `estado-citas`, `ocupacion-agenda` (y sus PDF/Excel)
- 14 endpoints activos (antes 20)

### Auto-carga y Limpiar
- `(ngModelChange)="cargarReporte()"` en fechaInicio, fechaFin, idDoctor
- `onTabChange(tabId)` recarga al cambiar tab
- Botón "Limpiar" reemplaza "Generar Reporte": resetea fechas a hoy, doctor a null, recarga

### Filas Expandibles
- Cada fila de tabla con ▶/▼ toggle
- `expandedRows: { [tab: string]: Set<number> }` estado por tab
- `toggleRow(tab, index)` / `isRowExpanded(tab, index)` métodos
- Doctores tab: expande en "Citas" y "Slots Ocupados" (sub-secciones)

### Detail DTOs (6 nuevos)
- `VentaDetalleDTO`, `IngresoServicioDetalleDTO`, `AtencionDoctorDetalleDTO`
- `EstadoCitaDetalleDTO`, `PacienteDetalleDTO`, `OcupacionDetalleDTO`
