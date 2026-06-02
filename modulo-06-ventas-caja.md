# Módulo 6: Ventas, Caja e Inventario — MVP (Solo Servicios) ✅ COMPLETADO

> MVP enfocado en cobro de servicios (citas completadas) con catálogo de precios fijos y validación de horarios del doctor.  
> *Escala futura: venta de productos con inventario, lotes, alertas.*

---

## 1. Alcance del MVP

### Incluye
- [x] Apertura y cierre de caja diaria (solo recepción)
- [x] Cobro de servicios (citas con estado `COMPLETADA`)
- [x] Búsqueda de paciente por nombre o DNI para cobrar
- [x] Selección de método de pago: **Efectivo** o **Yape/Plin**
- [x] Cálculo de vuelto para pagos en efectivo
- [x] Validación: solo citas `COMPLETADA` y no facturadas
- [x] Admin puede ver cajas activas/cerradas y sus cobros
- [x] Catálogo de servicios con precios fijos (solo ADMIN gestiona)
- [x] Al crear cita, se selecciona servicio del catálogo y el precio se auto-asigna (snapshot)
- [x] Validación de horario del doctor al crear/editar cita (día laboral + bloque horario)
- [x] Mensajes de error visibles en frontend para validaciones de horario

### Excluye (escala futura)
- ❌ Venta de productos físicos con stock
- ❌ Inventario, lotes, fechas de vencimiento
- ❌ Alertas de bajo stock por correo
- ❌ Múltiples items por venta (detalle_venta)
- ❌ Anulación de ventas
- ❌ Reportes financieros (Módulo 7)

---

## 2. Reglas de Negocio

### Caja
1. La recepcionista **debe** aperturar caja al iniciar el día para poder cobrar
2. Solo puede haber **una caja ABIERTA por usuario** a la vez
3. Al cerrar caja, se registran los montos finales por método de pago
4. El admin puede ver todas las cajas (activas y cerradas)
5. La recepción solo ve su propia caja activa

### Venta (Cobro de Servicios)
1. Solo se pueden cobrar citas en estado `COMPLETADA`
2. Una cita solo puede facturarse **una vez** (control con `id_cita` único en ventas)
3. El paciente se busca por nombre o DNI
4. Se muestran todas las citas completadas del paciente **no facturadas**
5. Métodos de pago:
   - **Efectivo**: se ingresa monto recibido, el sistema calcula el vuelto
   - **Yape/Plin**: se registra el cobro directo (sin vuelto)
6. La venta queda vinculada a la caja activa del usuario

---

## 3. Modelo de Datos

### Migración V10: Tablas `caja` y `ventas`

#### Tabla: `caja`

```sql
CREATE TABLE caja (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario          BIGINT UNSIGNED NOT NULL,
    fecha_apertura      DATETIME        NOT NULL,
    monto_inicial       DECIMAL(10,2)   NOT NULL DEFAULT 0,
    fecha_cierre        DATETIME        NULL,
    monto_final_efectivo DECIMAL(10,2)  NULL,
    monto_final_yapeplin DECIMAL(10,2)  NULL,
    total_ventas        DECIMAL(10,2)   NULL,
    observaciones       TEXT            NULL,
    estado              VARCHAR(20)     NOT NULL DEFAULT 'ABIERTO',
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME        NULL,
    PRIMARY KEY (id),
    INDEX idx_caja_usuario (id_usuario),
    INDEX idx_caja_estado (estado),
    CONSTRAINT fk_caja_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabla: `ventas`

```sql
CREATE TABLE ventas (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_caja         BIGINT UNSIGNED NOT NULL,
    id_paciente     BIGINT UNSIGNED NOT NULL,
    id_cita         BIGINT UNSIGNED NOT NULL,
    id_usuario      BIGINT UNSIGNED NOT NULL,
    fecha_venta     DATETIME        NOT NULL,
    total           DECIMAL(10,2)   NOT NULL,
    metodo_pago     VARCHAR(20)     NOT NULL,
    monto_recibido  DECIMAL(10,2)   NULL,
    cambio          DECIMAL(10,2)   NULL,
    estado          VARCHAR(20)     NOT NULL DEFAULT 'COMPLETADA',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME        NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_ventas_cita (id_cita),
    INDEX idx_ventas_caja (id_caja),
    INDEX idx_ventas_paciente (id_paciente),
    INDEX idx_ventas_usuario (id_usuario),
    INDEX idx_ventas_metodo_pago (metodo_pago),
    INDEX idx_ventas_fecha (fecha_venta),
    CONSTRAINT fk_ventas_caja FOREIGN KEY (id_caja) REFERENCES caja(id),
    CONSTRAINT fk_ventas_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id),
    CONSTRAINT fk_ventas_cita FOREIGN KEY (id_cita) REFERENCES citas(id),
    CONSTRAINT fk_ventas_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Migración V11: Catálogo `servicios` + `id_servicio` en `citas` + `precio`

**Ya no usamos un precio libre.** En V11 creamos un catálogo de servicios con precios predefinidos.
Al agendar una cita, la recepcionista selecciona el tipo de servicio y el precio se auto-asigna.

```sql
-- Tabla: servicios (catálogo de servicios con precios)
CREATE TABLE servicios (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(100)    NOT NULL,
    descripcion     TEXT            NULL,
    precio          DECIMAL(10,2)   NOT NULL,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME        NULL,
    PRIMARY KEY (id),
    INDEX idx_servicios_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales (servicios predeterminados)
INSERT INTO servicios (nombre, descripcion, precio) VALUES
    ('Cita de Evaluación', 'Primera consulta o evaluación inicial del paciente', 50.00),
    ('Sesión de Tratamiento', 'Sesión regular de terapia física o rehabilitación', 40.00),
    ('Re-valoración', 'Control de evolución y re-evaluación del paciente', 45.00);

-- Agregar id_servicio + precio snapshot a citas
ALTER TABLE citas
    ADD COLUMN id_servicio BIGINT UNSIGNED NULL AFTER observaciones,
    ADD COLUMN precio      DECIMAL(10,2)   NULL AFTER id_servicio,
    ADD INDEX idx_citas_id_servicio (id_servicio),
    ADD CONSTRAINT fk_citas_servicio FOREIGN KEY (id_servicio) REFERENCES servicios(id);
```

> `precio` en `citas` funciona como **snapshot**: guarda el precio del servicio al momento de crear la cita.
> Si el precio del servicio cambia después, las citas existentes conservan su precio original.  
> `id_servicio` es nullable para no romper citas existentes.

---

## 4. Backend — Estructura

### Nuevos archivos a crear (Módulo Ventas)

```
src/main/java/com/kineticrehab/
├── model/
│   ├── Caja.java              # Entidad JPA
│   ├── Venta.java             # Entidad JPA
│   └── Servicio.java          # Entidad JPA (catálogo)
├── repository/
│   ├── CajaRepository.java
│   ├── VentaRepository.java
│   └── ServicioRepository.java
├── dto/
│   ├── request/
│   │   ├── CajaAperturaRequestDTO.java
│   │   ├── CajaCierreRequestDTO.java
│   │   └── VentaRequestDTO.java
│   └── response/
│       ├── CajaResponseDTO.java
│       ├── VentaResponseDTO.java
│       └── ServicioResponseDTO.java
├── mapper/
│   ├── CajaMapper.java
│   ├── VentaMapper.java
│   └── ServicioMapper.java
├── service/
│   ├── CajaService.java
│   ├── VentaService.java
│   ├── ServicioService.java
│   └── impl/
│       ├── CajaServiceImpl.java
│       ├── VentaServiceImpl.java
│       └── ServicioServiceImpl.java
└── controller/
    ├── CajaController.java
    ├── VentaController.java
    └── ServicioController.java
```

### Archivos a modificar

- `model/Cita.java` — agregar campo `precio` (BigDecimal) + `servicio` (ManyToOne)
- `dto/request/CitaRequestDTO.java` — agregar `idServicio` (remplaza `precio` manual)
- `dto/response/CitaResponseDTO.java` — agregar `idServicio`, `nombreServicio`, `precio`
- `mapper/CitaMapper.java` — mapear servicio + precio
- `service/impl/CitaServiceImpl.java` — al crear/editar: buscar Servicio → auto-asignar `precio`
- `service/CitaService.java` — sin cambios (solo el impl cambia)

### Endpoints

#### Caja (`/api/caja`)
| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| POST | `/api/caja/aperturar` | RECEPCION, ADMIN | Abrir caja (monto inicial) |
| POST | `/api/caja/{id}/cerrar` | RECEPCION, ADMIN | Cerrar caja (montos finales) |
| GET | `/api/caja/activa` | RECEPCION, ADMIN | Obtener caja activa del usuario |
| GET | `/api/caja/mias` | RECEPCION | Listar cajas del usuario logueado |
| GET | `/api/caja` | ADMIN | Listar todas las cajas |
| GET | `/api/caja/{id}` | ADMIN, RECEPCION | Ver detalle de caja + ventas |
| GET | `/api/caja/{id}/ventas` | ADMIN, RECEPCION | Ventas de una caja específica |

#### Ventas (`/api/ventas`)
| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| POST | `/api/ventas` | RECEPCION, ADMIN | Registrar cobro (vinculado a caja activa) |
| GET | `/api/ventas/{id}` | ADMIN, RECEPCION | Ver detalle de venta |
| GET | `/api/ventas/paciente/{pacienteId}` | RECEPCION, ADMIN | Historial de ventas de un paciente |
| GET | `/api/ventas/cita/{citaId}` | RECEPCION, ADMIN | Ver si una cita ya fue facturada |

#### Servicios (`/api/servicios`)
| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/servicios` | ADMIN, RECEPCION, DOCTOR | Listar servicios activos del catálogo |
| GET | `/api/servicios/{id}` | ADMIN, RECEPCION, DOCTOR | Obtener un servicio por ID |
| POST | `/api/servicios` | ADMIN | Crear un nuevo servicio |
| PUT | `/api/servicios/{id}` | ADMIN | Actualizar un servicio |
| DELETE | `/api/servicios/{id}` | ADMIN | Soft delete de un servicio |

> Los servicios son gestionados solo por ADMIN. Recepción y Doctor solo leen el catálogo.

#### Citas (modificaciones)
| Método | Ruta | Cambio | Descripción |
|--------|------|--------|-------------|
| GET | `/api/citas/pendientes-pago/{pacienteId}` | NUEVO | Citas COMPLETADA no facturadas del paciente |

### Endpoints públicos para /api/caja y /api/ventas

En `SecurityConfig.java` no requieren cambios (ya están cubiertos por `.anyRequest().authenticated()`).  
Los roles se controlan con `@PreAuthorize` en cada método del controller.

---

## 5. Frontend — Estructura

### Nuevos archivos a crear

```
src/app/
├── models/
│   ├── caja.model.ts
│   ├── venta.model.ts
│   └── servicio.model.ts
├── core/services/
│   ├── caja.service.ts
│   ├── venta.service.ts
│   └── servicio.service.ts
└── features/ventas/
    ├── ventas.routes.ts
    ├── caja-apertura/
    │   └── caja-apertura.component.ts
    ├── caja-cierre/
    │   └── caja-cierre.component.ts
    ├── cobro/
    │   └── cobro.component.ts
    └── admin-cajas/
        └── admin-cajas.component.ts
```

### Archivos a modificar

- `app.routes.ts` — agregar rutas de ventas
- `core/components/layout/layout.component.ts` — el menú Ventas y Caja ya existe (solo verificar)
- `models/cita.model.ts` — agregar `idServicio`, `nombreServicio`, `precio`
- `features/citas/cita-form.component.ts` — agregar selector de servicio (select con precio auto-asignado)

### Rutas

| Ruta | Componente | Roles | Descripción |
|------|-----------|-------|-------------|
| `/ventas` | redirección | RECEPCION, ADMIN | Según rol: recepción → cobro, admin → admin-cajas |
| `/ventas/caja-apertura` | CajaAperturaComponent | RECEPCION | Formulario apertura de caja |
| `/ventas/cobro` | CobroComponent | RECEPCION | Pantalla de cobro |
| `/ventas/admin` | AdminCajasComponent | ADMIN | Listado de cajas |

### Flujo de pantallas

#### Recepción
1. **Dashboard** → Si no tiene caja activa → botón "Aperturar Caja" → redirige a `/ventas/caja-apertura`
2. **Caja Apertura** → Ingresa monto inicial → Confirma → Redirige a `/ventas/cobro`
3. **Cobro**:
   - Busca paciente por nombre o DNI (autocomplete)
   - Muestra lista de citas completadas NO facturadas
   - Selecciona una cita → se carga el `total` (precio de la cita)
   - Elige método de pago (Efectivo / Yape/Plin)
   - Si es **Efectivo**: ingresa monto recibido → muestra vuelto calculado
   - Si es **Yape/Plin**: confirma el cobro directo
   - Botón "Cobrar" → registra venta
4. **Cierre**:
   - Botón "Cerrar Caja" en la barra superior
   - Muestra resumen: total efectivo, total yape/plin, cantidad de ventas
   - Confirma cierre

#### Administrador
1. **Ventas / Admin Cajas** → `/ventas/admin`
   - Lista de cajas (activas y cerradas)
   - Filtro por estado (ABIERTO/CERRADO)
   - Al hacer clic en una caja → detalle con lista de ventas
   - Cada venta muestra: paciente, servicio, método pago, total

---

## 6. Modelos TypeScript

### `caja.model.ts`

```typescript
export interface CajaRequest {
  montoInicial: number;
  observaciones?: string;
}

export interface CajaCierreRequest {
  montoFinalEfectivo: number;
  montoFinalYapePlin: number;
  observaciones?: string;
}

export interface CajaResponse {
  id: number;
  idUsuario: number;
  nombreUsuario: string;
  fechaApertura: string;
  montoInicial: number;
  fechaCierre: string | null;
  montoFinalEfectivo: number | null;
  montoFinalYapePlin: number | null;
  totalVentas: number | null;
  observaciones: string | null;
  estado: string;
  cantidadVentas?: number;
}
```

### `venta.model.ts`

```typescript
export interface VentaRequest {
  idPaciente: number;
  idCita: number;
  total: number;
  metodoPago: 'EFECTIVO' | 'YAPE_PLIN';
  montoRecibido?: number;
  cambio?: number;
}

export interface VentaResponse {
  id: number;
  idCaja: number;
  idPaciente: number;
  nombrePaciente: string;
  documentoPaciente: string;
  idCita: number;
  idUsuario: number;
  nombreUsuario: string;
  fechaVenta: string;
  total: number;
  metodoPago: string;
  montoRecibido: number | null;
  cambio: number | null;
  estado: string;
}
```

---

## 7. Consideraciones de Seguridad

| Recurso | Acceso |
|---------|--------|
| Apertura/cierre de caja | RECEPCION, ADMIN |
| Registrar cobro | RECEPCION, ADMIN (debe tener caja activa) |
| Ver cajas propias | RECEPCION |
| Ver todas las cajas | ADMIN |
| Ver ventas por caja | RECEPCION (solo su caja), ADMIN (todas) |
| Listar citas pendientes de pago | RECEPCION, ADMIN |

**Validaciones importantes:**
- No se puede cobrar sin caja activa → 400 BadRequest
- No se puede cobrar una cita ya facturada → 409 Conflict
- No se puede cerrar una caja que no es propia (recepción)
- El monto recibido en efectivo debe ser >= total

---

## 8. Orden de Implementación

Siguiendo el orden definido en OPENCODE.md:

### Backend (1-18)
1. **Migración Flyway → V10**: `crear_tabla_caja_y_ventas.sql`
2. **Migración Flyway → V11**: `crear_tabla_servicios.sql` (servicios + seeds + id_servicio en citas + precio)
3. **Entidades**: `Caja.java`, `Venta.java`, `Servicio.java`
4. **Modificar entidad**: `Cita.java` (servicio ManyToOne + precio)
5. **Repositories**: `CajaRepository`, `VentaRepository`, `ServicioRepository`
6. **DTOs Caja/Venta**: request + response
7. **DTO Servicio**: `ServicioResponseDTO`
8. **Modificar DTOs**: `CitaRequestDTO` (idServicio), `CitaResponseDTO` (idServicio, nombreServicio, precio)
9. **Mappers**: `CajaMapper`, `VentaMapper`, `ServicioMapper`
10. **Modificar mapper**: `CitaMapper` (servicio + precio)
11. **Services Caja/Venta**: interfaces + implementaciones
12. **Service Servicio**: `ServicioService` + `ServicioServiceImpl`
13. **Modificar service**: `CitaServiceImpl` (auto-asignar precio desde Servicio)
14. **Controllers**: `CajaController`, `VentaController`
15. **Controller Servicio**: `ServicioController` (CRUD solo ADMIN, lectura todos)
16. **Nuevo endpoint** en `CitaController`: `GET /pendientes-pago/{pacienteId}`
17. **Actualizar** `CitaController`, `CitaService`, `CitaServiceImpl` con idServicio en crear/editar

### Frontend (18-25)
18. **Models TS**: `caja.model.ts`, `venta.model.ts`, `servicio.model.ts`
19. **Modificar model**: `cita.model.ts` (idServicio, nombreServicio, precio)
20. **Services TS**: `caja.service.ts`, `venta.service.ts`, `servicio.service.ts`
21. **Modificar service**: `cita.service.ts` (listarPendientesPago)
22. **Modificar componente**: `cita-form.component.ts` (selector de servicio, precio auto-asignado)
23. **Nuevos componentes**: CajaApertura, Cobro, Cierre, AdminCajas
24. **Rutas**: `ventas.routes.ts`
25. **Actualizar**: `app.routes.ts` (agregar rutas de ventas)

---

## 9. Última Sesión — Mensajes de Error en Frontend

Al final de la implementación se agregó:

- **Backend**: `GlobalExceptionHandler` retorna `ErrorResponseDTO { status, mensaje, timestamp }` para `BadRequestException`
- **Frontend `cita-form.component.ts`**: nuevo `@Input() errorMessage: string | null` + banner rojo (`bg-red-50 border-red-200`) entre campos y botones
- **Frontend `cita-list.component.ts`**: extrae `err.error.mensaje` del error HTTP y lo pasa al form; se limpia al cerrar o guardar exitosamente

### Próximo módulo sugerido: Módulo 7 — Reportes y Dashboard
