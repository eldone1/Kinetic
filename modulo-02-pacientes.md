# Módulo 2 — Gestión de Pacientes

> Archivo editable: modifica esta tabla de campos antes de generar código si algo cambia.

---

## Tablas en BD

### `pacientes`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | |
| `tipo_documento` | `VARCHAR(20)` | NOT NULL | DNI, CE, PASAPORTE |
| `numero_documento` | `VARCHAR(12)` | NOT NULL, UNIQUE | |
| `nombres` | `VARCHAR(100)` | NOT NULL | |
| `apellidos` | `VARCHAR(100)` | NOT NULL | |
| `fecha_nacimiento` | `DATE` | NULL | |
| `sexo` | `VARCHAR(1)` | NULL | M o F |
| `telefono` | `VARCHAR(15)` | NULL | |
| `correo` | `VARCHAR(100)` | NULL | |
| `direccion` | `VARCHAR(255)` | NULL | |
| `ocupacion` | `VARCHAR(100)` | NULL | |
| `contacto_emergencia` | `VARCHAR(150)` | NULL | |
| `observaciones` | `TEXT` | NULL | |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | `DATETIME` | NULL | Soft delete |

**Índices:**
- `idx_pacientes_numero_documento` UNIQUE sobre `numero_documento`
- `idx_pacientes_nombres_apellidos` sobre `(nombres, apellidos)`
- `idx_pacientes_telefono` sobre `telefono`

---

## Migraciones Flyway

| Script | Contenido |
|--------|-----------|
| `V4__crear_tabla_pacientes.sql` | CREATE TABLE pacientes |

---

## Entidad JPA

### `Paciente`

- `Long id`
- `String tipoDocumento`
- `String numeroDocumento`
- `String nombres`
- `String apellidos`
- `LocalDate fechaNacimiento`
- `String sexo`
- `String telefono`
- `String correo`
- `String direccion`
- `String ocupacion`
- `String contactoEmergencia`
- `String observaciones`
- `LocalDateTime createdAt`, `updatedAt`, `deletedAt`

---

## DTOs

### Request

| DTO | Campos |
|-----|--------|
| `PacienteRequestDTO` | `tipoDocumento`, `numeroDocumento`, `nombres`, `apellidos`, `fechaNacimiento`, `sexo`, `telefono`, `correo`, `direccion`, `ocupacion`, `contactoEmergencia`, `observaciones` |

### Response

| DTO | Campos |
|-----|--------|
| `PacienteResponseDTO` | `id`, `tipoDocumento`, `numeroDocumento`, `nombres`, `apellidos`, `fechaNacimiento`, `sexo`, `telefono`, `correo`, `direccion`, `ocupacion`, `contactoEmergencia`, `observaciones`, `createdAt` |

---

## Endpoints de la API

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `GET` | `/api/pacientes` | ADMIN, RECEPCION, DOCTOR | Listar pacientes activos |
| `GET` | `/api/pacientes/{id}` | ADMIN, RECEPCION, DOCTOR | Buscar paciente por ID |
| `GET` | `/api/pacientes/buscar?q=` | ADMIN, RECEPCION, DOCTOR | Buscar por nombre, documento o teléfono |
| `POST` | `/api/pacientes` | ADMIN, RECEPCION | Crear paciente |
| `PUT` | `/api/pacientes/{id}` | ADMIN, RECEPCION | Actualizar paciente |
| `DELETE` | `/api/pacientes/{id}` | ADMIN | Soft delete |

---

## Angular (frontend)

### Componentes

| Componente | Ruta | Descripción |
|------------|------|-------------|
| `PacienteListComponent` | `/pacientes` | Tabla con búsqueda por nombre/doc/teléfono |
| `PacienteFormComponent` | `/pacientes/nuevo` / `/pacientes/:id/editar` | Formulario crear/editar paciente |

### Servicios

| Servicio | Métodos principales |
|----------|-------------------|
| `PacienteService` | `listarTodos()`, `buscarPorId()`, `buscar()`, `crear()`, `actualizar()`, `eliminar()` |

### Guards

| Guard | Rutas protegidas |
|-------|------------------|
| `AuthGuard` | Todas las rutas del módulo |
| `RoleGuard` | Listado: ADMIN/RECEPCION/DOCTOR — Crear/Editar: solo ADMIN/RECEPCION |

---

## Árbol de archivos del módulo

```
backend/src/main/java/com/kineticrehab/
├── controller/
│   └── PacienteController.java
├── service/
│   ├── PacienteService.java
│   └── impl/
│       └── PacienteServiceImpl.java
├── repository/
│   └── PacienteRepository.java
├── model/
│   └── Paciente.java
├── dto/
│   ├── request/
│   │   └── PacienteRequestDTO.java
│   └── response/
│       └── PacienteResponseDTO.java
└── mapper/
    └── PacienteMapper.java

backend/src/main/resources/db/migration/
└── V4__crear_tabla_pacientes.sql

frontend/src/app/
├── core/
│   └── services/
│       └── paciente.service.ts
├── features/
│   └── pacientes/
│       ├── pacientes.routes.ts
│       ├── paciente-list/
│       │   └── paciente-list.component.ts
│       └── paciente-form/
│           └── paciente-form.component.ts
└── models/
    └── paciente.model.ts
```

---

> Módulo completado. Siguiente: Módulo 3 — Doctores.
