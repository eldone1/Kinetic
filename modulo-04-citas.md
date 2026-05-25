# Módulo 4 — Agenda, Citas y Sesiones

> Archivo editable: modifica esta tabla de campos antes de generar código si algo cambia.

---

## Tablas en BD

### `citas`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | |
| `id_paciente` | `BIGINT UNSIGNED` | NOT NULL, FK → pacientes(id) | |
| `id_doctor` | `BIGINT UNSIGNED` | NOT NULL, FK → doctores(id) | |
| `fecha` | `DATE` | NOT NULL | |
| `hora_inicio` | `TIME` | NOT NULL | |
| `hora_fin` | `TIME` | NOT NULL | |
| `tipo` | `VARCHAR(20)` | NOT NULL, DEFAULT 'CITA' | CITA, EVALUACION, REVALORACION, SESION |
| `estado` | `VARCHAR(20)` | NOT NULL, DEFAULT 'PROGRAMADA' | PROGRAMADA, CONFIRMADA, EN_PROGRESO, COMPLETADA, CANCELADA, NO_ASISTIO |
| `observaciones` | `TEXT` | NULL | |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | `DATETIME` | NULL | Soft delete |

**Índices:**
- `idx_citas_fecha` sobre `fecha`
- `idx_citas_id_doctor` sobre `id_doctor`
- `idx_citas_id_paciente` sobre `id_paciente`
- `idx_citas_estado` sobre `estado`

---

## Migraciones Flyway

| Script | Contenido |
|--------|-----------|
| `V7__crear_tabla_citas.sql` | CREATE TABLE citas |

---

## Entidad JPA

### `Cita`

- `Long id`
- `Paciente paciente` (ManyToOne)
- `Doctor doctor` (ManyToOne)
- `LocalDate fecha`
- `LocalTime horaInicio`
- `LocalTime horaFin`
- `String tipo`
- `String estado`
- `String observaciones`
- `LocalDateTime createdAt`, `updatedAt`, `deletedAt`

---

## DTOs

### Request

| DTO | Campos |
|-----|--------|
| `CitaRequestDTO` | `idPaciente`, `idDoctor`, `fecha`, `horaInicio`, `horaFin`, `tipo`, `observaciones` |
| `CitaEstadoRequestDTO` | `estado` |

### Response

| DTO | Campos |
|-----|--------|
| `CitaResponseDTO` | `id`, `idPaciente`, `nombrePaciente`, `documentoPaciente`, `idDoctor`, `nombreDoctor`, `especialidadDoctor`, `fecha`, `horaInicio`, `horaFin`, `tipo`, `estado`, `observaciones`, `createdAt` |

---

## Endpoints de la API

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `GET` | `/api/citas` | ADMIN, RECEPCION, DOCTOR | Listar todas las citas activas |
| `GET` | `/api/citas/{id}` | ADMIN, RECEPCION, DOCTOR | Buscar cita por ID |
| `GET` | `/api/citas/doctor/{doctorId}` | ADMIN, RECEPCION, DOCTOR | Listar citas de un doctor |
| `GET` | `/api/citas/paciente/{pacienteId}` | ADMIN, RECEPCION, DOCTOR | Listar citas de un paciente |
| `GET` | `/api/citas/por-fecha?fecha=` | ADMIN, RECEPCION, DOCTOR | Listar citas por fecha |
| `GET` | `/api/citas/calendario?fechaInicio=&fechaFin=` | ADMIN, RECEPCION, DOCTOR | Listar citas en rango de fechas |
| `GET` | `/api/citas/estado/{estado}` | ADMIN, RECEPCION | Listar citas por estado |
| `POST` | `/api/citas` | ADMIN, RECEPCION | Crear nueva cita |
| `PUT` | `/api/citas/{id}` | ADMIN, RECEPCION | Actualizar cita |
| `PATCH` | `/api/citas/{id}/estado` | ADMIN, RECEPCION, DOCTOR | Cambiar estado de cita |
| `DELETE` | `/api/citas/{id}` | ADMIN, RECEPCION | Soft delete |

---

## Reglas de negocio

- No se pueden registrar dos citas para el mismo doctor en el mismo horario (validación backend con cruce de horarios)
- La hora de inicio debe ser anterior a la hora de fin
- No permitir sesiones fuera del horario del doctor (07:00 - 22:00 configurado en calendario)
- Solo ADMIN y RECEPCION pueden crear, editar o eliminar citas
- DOCTOR solo puede cambiar el estado de las citas
- Soft delete en lugar de borrado físico

---

## Angular (frontend)

### Componentes

| Componente | Ruta | Descripción |
|------------|------|-------------|
| `CitaListComponent` | `/agenda` | Calendario FullCalendar con vistas mensual/semanal/diaria |
| `CitaFormComponent` | Modal | Formulario modal para crear/editar citas. **Paciente/Doctor:** autocomplete con búsqueda inline (filtra mientras escribes por nombres, apellidos, documento o especialidad). Navegación por teclado (↑↓→ Enter/Escape). |

### Servicios

| Servicio | Métodos principales |
|----------|-------------------|
| `CitaService` | `listarTodas()`, `listarPorDoctor()`, `listarPorPaciente()`, `listarPorFecha()`, `listarPorRangoFechas()`, `crear()`, `actualizar()`, `cambiarEstado()`, `eliminar()` |

### Guards

| Guard | Rutas protegidas |
|-------|------------------|
| `AuthGuard` | `/agenda` |
| `RoleGuard` | ADMIN, RECEPCION, DOCTOR |

---

## FullCalendar

- **Plugins:** dayGrid, timeGrid, interaction
- **Vistas:** dayGridMonth (mes), timeGridWeek (semana), timeGridDay (día)
- **Horario:** 07:00 - 22:00, slots de 30 min
- **Colores por estado:**
  - PROGRAMADA: azul (#3b82f6)
  - CONFIRMADA: teal (#0d9488)
  - EN_PROGRESO: ámbar (#f59e0b)
  - COMPLETADA: verde (#10b981)
  - CANCELADA: rojo (#ef4444)
  - NO_ASISTIO: gris (#6b7280)
- Click en fecha/slot → abre modal crear cita
- Click en evento → abre modal editar cita
- **Inicialización:** El contenedor `#calendarEl` está dentro de un `*ngIf="!cargando"`. El Calendar se crea en `inicializarCalendar()` llamada desde el subscribe de `cargarDatos()`. Se usa `ChangeDetectorRef.detectChanges()` **antes** de iniciar el Calendar para forzar la evaluación del `*ngIf` y la actualización de `@ViewChild`, garantizando que el nodo DOM exista. Al recargar datos (ej. tras guardar), se destruye y recrea limpiamente.

---

## Árbol de archivos del módulo

```
backend/src/main/java/com/kineticrehab/
├── controller/
│   └── CitaController.java
├── service/
│   ├── CitaService.java
│   └── impl/
│       └── CitaServiceImpl.java
├── repository/
│   └── CitaRepository.java
├── model/
│   └── Cita.java
├── dto/
│   ├── request/
│   │   ├── CitaRequestDTO.java
│   │   └── CitaEstadoRequestDTO.java
│   └── response/
│       └── CitaResponseDTO.java
└── mapper/
    └── CitaMapper.java

backend/src/main/resources/db/migration/
└── V7__crear_tabla_citas.sql

frontend/src/app/
├── core/
│   └── services/
│       └── cita.service.ts
├── features/
│   └── citas/
│       ├── citas.routes.ts
│       ├── cita-list/
│       │   └── cita-list.component.ts
│       └── cita-form/
│           └── cita-form.component.ts
├── models/
│   └── cita.model.ts
└── package.json  ← agregadas dependencias @fullcalendar/*
```

---

> Módulo completado — backend + frontend. Siguiente: Módulo 5 — Historia Clínica y Tratamientos.
