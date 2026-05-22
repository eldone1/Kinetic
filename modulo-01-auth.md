# Módulo 1 — Autenticación, Usuarios y Roles

> Archivo editable: modifica esta tabla de campos antes de generar código si algo cambia.

---

## Tablas en BD

### `roles`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | |
| `nombre` | `VARCHAR(20)` | NOT NULL, UNIQUE | `ROLE_ADMIN`, `ROLE_RECEPCION`, `ROLE_DOCTOR` |
| `descripcion` | `VARCHAR(255)` | NULL | |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | `DATETIME` | NULL | Soft delete |

**Seed data:**
```sql
INSERT INTO roles (nombre, descripcion) VALUES
    ('ROLE_ADMIN',    'Acceso total al sistema'),
    ('ROLE_RECEPCION','Agenda, ventas y cobros'),
    ('ROLE_DOCTOR',   'Historia clínica y agenda propia');
```

---

### `usuarios`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | |
| `username` | `VARCHAR(50)` | NOT NULL, UNIQUE | Nick de acceso |
| `email` | `VARCHAR(100)` | NOT NULL, UNIQUE | Correo del usuario |
| `password` | `VARCHAR(255)` | NOT NULL | BCrypt hash |
| `nombre` | `VARCHAR(100)` | NOT NULL | |
| `apellidos` | `VARCHAR(100)` | NOT NULL | |
| `telefono` | `VARCHAR(15)` | NULL | |
| `id_rol` | `BIGINT UNSIGNED` | NOT NULL, FK → roles(id) | |
| `activo` | `BOOLEAN` | NOT NULL, DEFAULT TRUE | Para activar/desactivar sin soft delete |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | |
| `deleted_at` | `DATETIME` | NULL | Soft delete |

**Índices:**
- `idx_usuarios_username` UNIQUE sobre `username`
- `idx_usuarios_email` UNIQUE sobre `email`
- `idx_usuarios_id_rol` sobre `id_rol`

---

### `auditoria_log` (opcional en este módulo, global)

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT |
| `id_usuario` | `BIGINT UNSIGNED` | FK → usuarios(id), NOT NULL |
| `accion` | `VARCHAR(100)` | NOT NULL |
| `entidad` | `VARCHAR(50)` | NOT NULL |
| `id_entidad` | `BIGINT UNSIGNED` | NULL |
| `detalle` | `TEXT` | NULL |
| `ip_origen` | `VARCHAR(45)` | NULL |
| `created_at` | `DATETIME` | NOT NULL DEFAULT CURRENT_TIMESTAMP |

Se incluye desde la V1, para ya tenerlo mapeado

---

## Migraciones Flyway (plan)

| Script | Contenido |
|--------|-----------|
| `V1__crear_tabla_roles.sql` | CREATE TABLE roles + seed de 3 roles |
| `V2__crear_tabla_usuarios.sql` | CREATE TABLE usuarios |
| `V3__insertar_admin_inicial.sql` | INSERT del administrador por defecto (username: `admin`, pass temporal: `Kinetic2025`) |
| `V4__crear_tabla_auditoria_log.sql` | CREATE  |

---

## Entidades JPA

### `Role`
- `Long id`
- `String nombre`
- `String descripcion`
- `LocalDateTime createdAt`, `updatedAt`, `deletedAt`

### `Usuario`
- `Long id`
- `String username`
- `String email`
- `String password`
- `String nombre`
- `String apellidos`
- `String telefono`
- `Role rol` (ManyToOne)
- `Boolean activo`
- `LocalDateTime createdAt`, `updatedAt`, `deletedAt`

---

## DTOs

### Request
| DTO | Campos |
|-----|--------|
| `LoginRequestDTO` | `username`, `password` |
| `UsuarioRequestDTO` | `username`, `email`, `password`, `nombre`, `apellidos`, `telefono`, `idRol` |
| `CambioPasswordRequestDTO` | `passwordActual`, `passwordNuevo` |

### Response
| DTO | Campos |
|-----|--------|
| `LoginResponseDTO` | `token`, `refreshToken`, `usuario` (UsuarioResponseDTO) |
| `UsuarioResponseDTO` | `id`, `username`, `email`, `nombre`, `apellidos`, `telefono`, `rol`, `activo`, `createdAt` |
| `ErrorResponseDTO` | `status`, `mensaje`, `timestamp` |

---

## Endpoints de la API

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/api/auth/login` | Público | Login, devuelve JWT |
| `POST` | `/api/auth/refresh` | Público | Refrescar token |
| `POST` | `/api/auth/logout` | Autenticado | Logout |
| `GET` | `/api/usuarios` | ADMIN | Listar usuarios |
| `GET` | `/api/usuarios/{id}` | ADMIN | Buscar usuario por ID |
| `POST` | `/api/usuarios` | ADMIN | Crear usuario |
| `PUT` | `/api/usuarios/{id}` | ADMIN | Actualizar usuario |
| `PATCH` | `/api/usuarios/{id}/estado` | ADMIN | Activar/desactivar |
| `DELETE` | `/api/usuarios/{id}` | ADMIN | Soft delete |
| `GET` | `/api/usuarios/me` | Autenticado | Perfil del usuario actual |
| `PUT` | `/api/usuarios/me/password` | Autenticado | Cambiar propia contraseña |
| `GET` | `/api/roles` | ADMIN | Listar roles |

---

## Angular (frontend)

### Componentes
| Componente | Ruta | Descripción |
|------------|------|-------------|
| `LoginComponent` | `/login` | Formulario de login |
| `UsuarioListComponent` | `/usuarios` | Tabla de usuarios (Admin) |
| `UsuarioFormComponent` | `/usuarios/nuevo` / `/usuarios/:id/editar` | Crear/editar usuario |
| `CambioPasswordComponent` | `/cambio-password` | Cambiar propia contraseña |

### Servicios
| Servicio | Métodos principales |
|----------|-------------------|
| `AuthService` | `login()`, `refreshToken()`, `logout()`, `isAuthenticated()`, `getToken()`, `getUserRole()` |
| `UsuarioService` | `listar()`, `buscarPorId()`, `crear()`, `actualizar()`, `cambiarEstado()`, `eliminar()` |
| `RoleService` | `listar()` |

### Guards
| Guard | Ruta | Descripción |
|-------|------|-------------|
| `AuthGuard` | Todas las rutas protegidas | Redirige a `/login` si no hay token |
| `RoleGuard` | Por ruta | `hasRole('ADMIN')` para `/usuarios` |

### Interceptors
| Interceptor | Función |
|-------------|---------|
| `AuthInterceptor` | Adjunta JWT en cada request |
| `ErrorInterceptor` | Captura 401 → redirige a login, muestra errores amigables |

---

## Árbol de archivos del módulo

```
backend/src/main/java/com/project/
├── config/
│   ├── SecurityConfig.java
│   ├── JwtAuthenticationFilter.java
│   ├── CorsConfig.java
│   └── OpenApiConfig.java
├── controller/
│   ├── AuthController.java
│   ├── UsuarioController.java
│   └── RolController.java
├── service/
│   ├── AuthService.java + AuthServiceImpl.java
│   ├── UsuarioService.java + UsuarioServiceImpl.java
│   └── RolService.java + RolServiceImpl.java
├── repository/
│   ├── UsuarioRepository.java
│   └── RolRepository.java
├── model/
│   ├── Usuario.java
│   └── Rol.java
├── dto/
│   ├── request/
│   │   ├── LoginRequestDTO.java
│   │   ├── UsuarioRequestDTO.java
│   │   └── CambioPasswordRequestDTO.java
│   └── response/
│       ├── LoginResponseDTO.java
│       ├── UsuarioResponseDTO.java
│       └── ErrorResponseDTO.java
├── mapper/
│   ├── UsuarioMapper.java
│   └── RolMapper.java
├── exception/
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── GlobalExceptionHandler.java
├── security/
│   ├── JwtTokenProvider.java
│   └── CustomUserDetailsService.java
└── util/
    └── ...

frontend/src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   └── services/
│       └── auth.service.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.css
│   │   └── cambio-password/
│   ├── usuarios/
│   │   ├── usuario-list/
│   │   ├── usuario-form/
│   │   └── services/
│   │       ├── usuario.service.ts
│   │       └── rol.service.ts
├── models/
│   ├── usuario.model.ts
│   ├── rol.model.ts
│   └── auth.model.ts
```

---

> Una vez aprobado, sigo el orden del OPENCODE.md: Flyway → Entity → Repository → DTO → Mapper → Service → Controller → Angular Components.
