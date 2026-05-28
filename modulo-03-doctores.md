# Módulo 3 — Gestión de Doctores y Personal Médico

> Archivo editable: modifica esta tabla de campos antes de generar código si algo cambia.

---

## Tablas en BD

### `doctores`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | |
| `usuario_id` | `BIGINT UNSIGNED` | NULL, UNIQUE, FK → usuarios(id) | Vinculación opcional con usuario del sistema |
| `nombres` | `VARCHAR(100)` | NOT NULL | |
| `apellidos` | `VARCHAR(100)` | NOT NULL | |
| `dni` | `VARCHAR(8)` | NULL, UNIQUE | NULL para doctores auto-creados desde usuario |
| `especialidad` | `VARCHAR(100)` | NULL | |
| `cmp` | `VARCHAR(20)` | NULL | Colegiatura |
| `telefono` | `VARCHAR(15)` | NULL | |
| `correo` | `VARCHAR(100)` | NULL | |
| `activo` | `BOOLEAN` | NOT NULL, DEFAULT TRUE | Para activar/desactivar sin soft delete |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | `DATETIME` | NULL | Soft delete |

**Índices:**
- `idx_doctores_dni` UNIQUE sobre `dni`
- `idx_doctores_usuario_id` UNIQUE sobre `usuario_id`
- `idx_doctores_nombres_apellidos` sobre `(nombres, apellidos)`
- `idx_doctores_especialidad` sobre `especialidad`

---

### `horarios_doctor`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | |
| `id_doctor` | `BIGINT UNSIGNED` | NOT NULL, FK → doctores(id) | |
| `dia_semana` | `VARCHAR(10)` | NOT NULL | LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO |
| `hora_inicio` | `TIME` | NOT NULL | |
| `hora_fin` | `TIME` | NOT NULL | |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | `DATETIME` | NULL | Soft delete |

**Índices:**
- `idx_horarios_doctor` sobre `id_doctor`
- `UNIQUE KEY` sobre `(id_doctor, dia_semana, hora_inicio)` — evitar cruces de horario

---

## Migraciones Flyway

| Script | Contenido |
|--------|-----------|
| `V5__crear_tabla_doctores.sql` | CREATE TABLE doctores |
| `V6__crear_tabla_horarios_doctor.sql` | CREATE TABLE horarios_doctor |
| `V9__add_usuario_id_to_doctores.sql` | ALTER: agrega `usuario_id` FK, hace `dni` nullable, backfill ROLE_DOCTOR existentes |

---

## Entidades JPA

### `Doctor`

- `Long id`
- `Usuario usuario` (ManyToOne, nullable — vincula con usuario del sistema)
- `String nombres`
- `String apellidos`
- `String dni` (nullable — puede ser null si se auto-creó desde un usuario)
- `String especialidad`
- `String cmp`
- `String telefono`
- `String correo`
- `Boolean activo`
- `LocalDateTime createdAt`, `updatedAt`, `deletedAt`

### `HorarioDoctor`

- `Long id`
- `Doctor doctor` (ManyToOne)
- `String diaSemana`
- `LocalTime horaInicio`
- `LocalTime horaFin`
- `LocalDateTime createdAt`, `updatedAt`, `deletedAt`

---

## DTOs

### Request

| DTO | Campos |
|-----|--------|
| `DoctorRequestDTO` | `nombres`, `apellidos`, `dni`, `especialidad`, `cmp`, `telefono`, `correo` |
| `HorarioRequestDTO` | `diaSemana`, `horaInicio`, `horaFin` |
| `DoctorEstadoRequestDTO` | `activo` |

### Response

| DTO | Campos |
|-----|--------|
| `DoctorResponseDTO` | `id`, `nombres`, `apellidos`, `dni`, `especialidad`, `cmp`, `telefono`, `correo`, `activo`, `createdAt` |
| `DoctorHorariosResponseDTO` | `id`, `nombres`, `apellidos`, `especialidad`, `activo`, `horarios` (List<HorarioResponseDTO>) |
| `HorarioResponseDTO` | `id`, `diaSemana`, `horaInicio`, `horaFin` |

---

## Endpoints de la API

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `GET` | `/api/doctores` | ADMIN, RECEPCION, DOCTOR | Listar doctores activos |
| `GET` | `/api/doctores/{id}` | ADMIN, RECEPCION, DOCTOR | Buscar doctor por ID |
| `GET` | `/api/doctores/buscar?q=` | ADMIN, RECEPCION | Buscar por nombre, DNI o especialidad |
| `GET` | `/api/doctores/disponibles` | ADMIN, RECEPCION, DOCTOR | Listar solo doctores activos (para combos) |
| `GET` | `/api/doctores/yo` | DOCTOR | Obtener perfil del doctor del usuario autenticado |
| `POST` | `/api/doctores` | ADMIN | Crear doctor |
| `PUT` | `/api/doctores/{id}` | ADMIN | Actualizar doctor |
| `PATCH` | `/api/doctores/{id}/estado` | ADMIN | Activar/desactivar doctor |
| `DELETE` | `/api/doctores/{id}` | ADMIN | Soft delete |
| `GET` | `/api/doctores/{id}/horarios` | ADMIN, RECEPCION, DOCTOR | Obtener horarios del doctor |
| `PUT` | `/api/doctores/{id}/horarios` | ADMIN | Actualizar horarios del doctor |

---

## Reglas de negocio

- Un doctor inactivo no aparece en combos de nuevas citas
- No se pueden crear horarios con cruces (mismo doctor, mismo día, horario solapado)
- Un doctor con citas/sesiones futuras no puede desactivarse sin confirmación
- Solo ADMIN puede crear, editar o desactivar doctores
- RECEPCION solo visualiza horarios y disponibilidad
- **Auto-creación desde Usuario:** Al crear un `Usuario` con rol `ROLE_DOCTOR`, se genera automáticamente un registro en `doctores` vinculado por `usuario_id`. El DNI queda `NULL` hasta que se edite manualmente desde el formulario de doctores.
- **Migración V9:** Los usuarios existentes con `ROLE_DOCTOR` se backfillean a la tabla `doctores` al ejecutar la migración Flyway.

---

## Angular (frontend)

### Componentes

| Componente | Ruta | Descripción |
|------------|------|-------------|
| `DoctorListComponent` | `/doctores` | Tabla con búsqueda, activar/desactivar |
| `DoctorFormComponent` | `/doctores/nuevo` / `/doctores/:id/editar` | Crear/editar doctor |
| `DoctorHorariosComponent` | `/doctores/:id/horarios` | Gestión de horarios semanales |

### Servicios

| Servicio | Métodos principales |
|----------|-------------------|
| `DoctorService` | `listarTodos()`, `buscarPorId()`, `buscar()`, `listarDisponibles()`, `crear()`, `actualizar()`, `cambiarEstado()`, `eliminar()`, `obtenerHorarios()`, `actualizarHorarios()` |

### Guards

| Guard | Rutas protegidas |
|-------|------------------|
| `AuthGuard` | Todas las rutas del módulo |
| `RoleGuard` | Listado: ADMIN/RECEPCION — Crear/Editar/Horarios: solo ADMIN |

---

## Árbol de archivos del módulo

```
backend/src/main/java/com/kineticrehab/
├── controller/
│   └── DoctorController.java
├── service/
│   ├── DoctorService.java
│   └── impl/
│       └── DoctorServiceImpl.java
├── repository/
│   ├── DoctorRepository.java
│   └── HorarioDoctorRepository.java
├── model/
│   ├── Doctor.java
│   └── HorarioDoctor.java
├── dto/
│   ├── request/
│   │   ├── DoctorRequestDTO.java
│   │   ├── DoctorEstadoRequestDTO.java
│   │   └── HorarioRequestDTO.java
│   └── response/
│       ├── DoctorResponseDTO.java
│       ├── DoctorHorariosResponseDTO.java
│       └── HorarioResponseDTO.java
└── mapper/
    └── DoctorMapper.java

backend/src/main/resources/db/migration/
├── V5__crear_tabla_doctores.sql
├── V6__crear_tabla_horarios_doctor.sql
└── V9__add_usuario_id_to_doctores.sql

frontend/src/app/
├── core/
│   └── services/
│       └── doctor.service.ts
├── features/
│   └── doctores/
│       ├── doctores.routes.ts
│       ├── doctor-list/
│       │   └── doctor-list.component.ts
│       ├── doctor-form/
│       │   └── doctor-form.component.ts
│       └── doctor-horarios/
│           └── doctor-horarios.component.ts
└── models/
    └── doctor.model.ts
```

---

> Pendiente de implementación. Siguiente: Módulo 4 — Agenda, Citas y Sesiones.
