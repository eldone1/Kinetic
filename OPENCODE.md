# OPENCODE.md — Instrucciones de Desarrollo

> Este archivo define cómo trabajar en TODOS mis proyectos fullstack.
> OpenCode debe leerlo automáticamente al abrir cualquier proyecto.
> No modificar sin autorización del desarrollador principal.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | Angular | 17+ |
| Backend | Java + Spring Boot | 21 / 3.2+ |
| Base de datos | MySQL | 8.0+ |
| ORM | Spring Data JPA + Hibernate | — |
| Migraciones BD | Flyway | — |
| Autenticación | Spring Security + JWT | — |
| Documentación API | Springdoc OpenAPI (Swagger) | — |
| Build frontend | Angular CLI | — |
| Build backend | Maven | — |
| Contenedores | Docker + Docker Compose | — |

---

## Estructura de carpetas

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/project/
│   ├── config/          # Configuración (Security, CORS, Swagger, Flyway, etc.)
│   ├── controller/      # REST Controllers
│   ├── service/         # Lógica de negocio (interfaces + implementaciones)
│   ├── repository/      # JPA Repositories
│   ├── model/           # Entidades JPA
│   ├── dto/             # Data Transfer Objects (request y response separados)
│   ├── mapper/          # Mappers entre entidades y DTOs
│   ├── exception/       # Excepciones personalizadas y GlobalExceptionHandler
│   └── util/            # Clases de utilidad
├── src/main/resources/
│   ├── db/
│   │   └── migration/   # Scripts SQL de Flyway (V1__, V2__, etc.)
│   ├── application.properties
│   └── application-dev.properties
└── pom.xml
```

### Frontend (Angular)
```
frontend/
├── src/
│   ├── app/
│   │   ├── core/            # Guards, interceptors, servicios singleton
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── services/
│   │   ├── shared/          # Componentes, pipes y directivas reutilizables
│   │   │   ├── components/
│   │   │   ├── pipes/
│   │   │   └── directives/
│   │   ├── features/        # Módulos por funcionalidad (lazy loading)
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── [modulo]/
│   │   ├── models/          # Interfaces y tipos TypeScript
│   │   └── app.routes.ts
│   ├── environments/
│   └── assets/
└── angular.json
```

---

## Convenciones de nombres

### Java / Spring
- Clases: `PascalCase` → `PacienteService`, `CitaController`
- Métodos y variables: `camelCase` → `findById`, `fechaAtencion`
- Constantes: `UPPER_SNAKE_CASE` → `MAX_INTENTOS_LOGIN`
- Paquetes: `lowercase` → `com.project.controller`
- Entidades JPA: nombre en singular → `Paciente`, `Cita`
- DTOs: sufijo según uso → `PacienteRequestDTO`, `PacienteResponseDTO`
- Repositorios: sufijo `Repository` → `PacienteRepository`
- Servicios: interfaz + implementación → `PacienteService` + `PacienteServiceImpl`

### Angular / TypeScript
- Componentes: `kebab-case` en archivos → `paciente-list.component.ts`
- Clases e interfaces: `PascalCase` → `Paciente`, `CitaResponse`
- Variables y métodos: `camelCase` → `listaPacientes`, `cargarDatos()`
- Servicios: sufijo `Service` → `PacienteService`
- Módulos de feature: sufijo `Module` → `PacientesModule`
- Rutas: `kebab-case` → `/pacientes`, `/historia-clinica`

### MySQL
- Tablas: `snake_case` en plural → `pacientes`, `detalle_ventas`
- Columnas: `snake_case` → `nombre_paciente`, `fecha_creacion`
- Claves primarias: `id` (BIGINT UNSIGNED AUTO_INCREMENT)
- Claves foráneas: `id_[tabla_referenciada]` → `id_paciente`, `id_usuario`
- Índices: prefijo `idx_` → `idx_pacientes_dni`
- Collation: `utf8mb4_unicode_ci` en todas las tablas

---

## Migraciones con Flyway

### ¿Cómo funciona Flyway?
Flyway es una herramienta de control de versiones para la base de datos. Funciona así:

1. Al arrancar Spring Boot, Flyway escanea la carpeta `src/main/resources/db/migration/`
2. Lee todos los archivos SQL con el prefijo `V{número}__` (doble guion bajo)
3. Compara qué scripts ya ejecutó (los guarda en la tabla `flyway_schema_history`) contra los que hay en disco
4. Ejecuta solo los scripts nuevos, en orden, de forma automática
5. **Si un script ya fue ejecutado, nunca lo vuelve a tocar** — es inmutable

### Regla de oro de Flyway
> **Nunca modifiques un script que ya fue aplicado.** Si necesitas un cambio, crea un nuevo script con el siguiente número de versión.

### Naming de los scripts
```
V1__crear_tabla_usuarios.sql
V2__crear_tabla_pacientes.sql
V3__crear_tabla_citas.sql
V4__agregar_columna_activo_a_doctores.sql
V5__insertar_roles_iniciales.sql
```
Formato: `V{numero}__{descripcion_en_snake_case}.sql`

### Dependencia Maven
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

### Configuración en application.properties
```properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
# NUNCA usar ddl-auto=create o update en producción
spring.jpa.hibernate.ddl-auto=validate
```

### Estructura de un script de migración
```sql
-- V1__crear_tabla_pacientes.sql
CREATE TABLE pacientes (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    dni         VARCHAR(8)      NOT NULL,
    nombres     VARCHAR(100)    NOT NULL,
    apellidos   VARCHAR(100)    NOT NULL,
    telefono    VARCHAR(15),
    correo      VARCHAR(100),
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME        NULL,
    PRIMARY KEY (id),
    UNIQUE KEY idx_pacientes_dni (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Script de datos iniciales (seeds)
```sql
-- V5__insertar_roles_iniciales.sql
INSERT INTO roles (nombre, descripcion) VALUES
    ('ROLE_ADMIN',    'Acceso total al sistema'),
    ('ROLE_RECEPCION','Agenda, ventas y cobros'),
    ('ROLE_DOCTOR',   'Historia clínica y agenda propia');
```

---

## Buenas prácticas obligatorias — Backend

### Entidades JPA con Builder
Usar siempre `@Builder` de Lombok junto con `@NoArgsConstructor` y `@AllArgsConstructor`.
El Builder evita constructores largos y hace el código más legible.

```java
@Entity
@Table(name = "pacientes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 8, unique = true)
    private String dni;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

Uso del Builder en el Service:
```java
// ✅ Correcto — Builder claro y legible
Paciente paciente = Paciente.builder()
        .dni(requestDTO.getDni())
        .nombres(requestDTO.getNombres())
        .apellidos(requestDTO.getApellidos())
        .telefono(requestDTO.getTelefono())
        .build();

// ❌ Incorrecto — constructor largo e ilegible
Paciente paciente = new Paciente(null, "12345678", "Juan", "Pérez", "999000111", null, null, null);
```

### DTOs también con Builder
```java
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteResponseDTO {
    private Long id;
    private String dni;
    private String nombreCompleto;
    private String telefono;
    private String correo;
    private LocalDateTime creadoEn;
}
```

### Mapper entidad ↔ DTO (sin librerías externas)
```java
@Component
public class PacienteMapper {

    public PacienteResponseDTO toDTO(Paciente paciente) {
        return PacienteResponseDTO.builder()
                .id(paciente.getId())
                .dni(paciente.getDni())
                .nombreCompleto(paciente.getNombres() + " " + paciente.getApellidos())
                .telefono(paciente.getTelefono())
                .correo(paciente.getCorreo())
                .creadoEn(paciente.getCreatedAt())
                .build();
    }

    public Paciente toEntity(PacienteRequestDTO dto) {
        return Paciente.builder()
                .dni(dto.getDni())
                .nombres(dto.getNombres())
                .apellidos(dto.getApellidos())
                .telefono(dto.getTelefono())
                .correo(dto.getCorreo())
                .build();
    }
}
```

### Lambdas y Streams en Services
Usar lambdas y Streams de Java para transformaciones de listas. Evitar bucles `for` cuando el Stream es más claro.

```java
// ✅ Correcto — Stream + lambda + método de referencia
public List<PacienteResponseDTO> listarActivos() {
    return pacienteRepository.findAll().stream()
            .filter(p -> p.getDeletedAt() == null)
            .map(pacienteMapper::toDTO)
            .sorted(Comparator.comparing(PacienteResponseDTO::getNombreCompleto))
            .collect(Collectors.toList());
}

// ✅ Correcto — buscar con Optional y lambda
public PacienteResponseDTO buscarPorId(Long id) {
    return pacienteRepository.findById(id)
            .filter(p -> p.getDeletedAt() == null)
            .map(pacienteMapper::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + id));
}

// ✅ Correcto — agrupar con Collectors
public Map<String, Long> contarPacientesPorDoctor() {
    return citaRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                    c -> c.getDoctor().getNombres(),
                    Collectors.counting()
            ));
}

// ❌ Incorrecto — bucle manual innecesario
List<PacienteResponseDTO> resultado = new ArrayList<>();
for (Paciente p : pacienteRepository.findAll()) {
    if (p.getDeletedAt() == null) {
        resultado.add(pacienteMapper.toDTO(p));
    }
}
```

### Optional — nunca ignorarlo
```java
// ✅ Siempre manejar el caso vacío
pacienteRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

// ❌ Nunca hacer .get() sin verificar
pacienteRepository.findById(id).get(); // Lanza NoSuchElementException si no existe
```

### Service — interfaz + implementación
```java
// PacienteService.java
public interface PacienteService {
    List<PacienteResponseDTO> listarTodos();
    PacienteResponseDTO buscarPorId(Long id);
    PacienteResponseDTO crear(PacienteRequestDTO dto);
    PacienteResponseDTO actualizar(Long id, PacienteRequestDTO dto);
    void eliminar(Long id); // soft delete
}

// PacienteServiceImpl.java
@Service
@RequiredArgsConstructor
@Slf4j
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;
    private final PacienteMapper pacienteMapper;

    @Override
    public List<PacienteResponseDTO> listarTodos() {
        log.info("Listando todos los pacientes activos");
        return pacienteRepository.findAll().stream()
                .filter(p -> p.getDeletedAt() == null)
                .map(pacienteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + id));
        paciente.setDeletedAt(LocalDateTime.now()); // Soft delete
        pacienteRepository.save(paciente);
        log.info("Paciente con id {} marcado como eliminado", id);
    }
}
```

### Controller con Swagger
```java
@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
@Tag(name = "Pacientes", description = "Gestión de pacientes del centro")
public class PacienteController {

    private final PacienteService pacienteService;

    @GetMapping
    @Operation(summary = "Listar todos los pacientes activos")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<List<PacienteResponseDTO>> listarTodos() {
        return ResponseEntity.ok(pacienteService.listarTodos());
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo paciente")
    @ApiResponse(responseCode = "201", description = "Paciente creado correctamente")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<PacienteResponseDTO> crear(@Valid @RequestBody PacienteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pacienteService.crear(dto));
    }
}
```

### GlobalExceptionHandler
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Recurso no encontrado: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponseDTO.builder()
                        .status(404)
                        .mensaje(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(MethodArgumentNotValidException ex) {
        String errores = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponseDTO.builder()
                        .status(400)
                        .mensaje(errores)
                        .timestamp(LocalDateTime.now())
                        .build());
    }
}
```

---

## Buenas prácticas obligatorias — Frontend (Angular)

- **Siempre** usar `HttpClient` dentro de Services, nunca directamente en componentes
- **Siempre** desuscribirse de Observables — preferir `async pipe` o `takeUntilDestroyed()`
- **Nunca** usar `any` como tipo en TypeScript — definir interfaces correctas en `/models`
- Usar `standalone components` y lazy loading por módulo de feature
- Manejar errores de HTTP en un `HttpInterceptor` global
- El token JWT se guarda en `localStorage` y se adjunta automáticamente en el interceptor
- **Nunca** mostrar errores técnicos al usuario — mostrar mensajes amigables
- Usar `ReactiveFormsModule` para todos los formularios — no `FormsModule`
- **Siempre** mostrar feedback visual: loading spinners, mensajes de éxito/error

---

## Buenas prácticas obligatorias — Base de datos (MySQL)

- **Siempre** usar migraciones Flyway — nunca modificar la BD a mano en producción
- **Nunca** usar `ddl-auto=create` o `update` en producción — solo `validate`
- Toda tabla debe tener `created_at`, `updated_at` y `deleted_at` (nullable para soft delete)
- **Nunca** borrar registros con datos históricos — usar soft delete (`deleted_at`)
- **Siempre** declarar `ENGINE=InnoDB` y `CHARSET=utf8mb4` en cada tabla
- Usar `BIGINT UNSIGNED` para todas las claves primarias y foráneas
- Crear índices en columnas usadas frecuentemente en WHERE o JOIN

---

## Seguridad

- JWT con expiración de 8 horas para access token
- Refresh token con expiración de 7 días
- CORS configurado solo para el origen del frontend (`http://localhost:4200` en dev)
- Endpoints públicos: `/api/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`
- Todo lo demás requiere autenticación
- Roles definidos como enum: `ROLE_ADMIN`, `ROLE_RECEPCION`, `ROLE_DOCTOR`
- Usar `@PreAuthorize("hasRole('ADMIN')")` para proteger endpoints por rol
- Las contraseñas **siempre** se hashean con `BCryptPasswordEncoder` — nunca en texto plano

---

## Docker y entornos

### docker-compose.yml (desarrollo)
```yaml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: kinetic_db
      MYSQL_USER: dev_user
      MYSQL_PASSWORD: dev_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/kinetic_db?useSSL=false&serverTimezone=America/Lima
      SPRING_DATASOURCE_USERNAME: dev_user
      SPRING_DATASOURCE_PASSWORD: dev_pass
      JWT_SECRET: ${JWT_SECRET}

  frontend:
    build: ./frontend
    ports:
      - "4200:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

### Variables de entorno requeridas (nunca en el código)
```
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
JWT_EXPIRATION=28800000
MAIL_USERNAME=
MAIL_PASSWORD=
```

---

## Flujo de trabajo con Git

- Rama principal: `main` (solo código estable)
- Rama de desarrollo: `develop`
- Ramas de feature: `feature/nombre-modulo`
- Ramas de fix: `fix/descripcion-del-bug`
- Commits en español, en imperativo: `Agregar módulo de pacientes`, `Corregir validación de stock`
- **Nunca** hacer push directo a `main`
- Hacer PR de `develop` → `main` solo cuando el módulo esté probado

---

## Qué NO hacer (nunca)

- ❌ No usar `var` en Java de forma ambigua — usar tipos explícitos o `var` solo en contextos locales claros
- ❌ No usar `any` en TypeScript
- ❌ No hardcodear URLs, claves o contraseñas
- ❌ No mezclar lógica de negocio en Controllers o Componentes
- ❌ No hacer consultas SQL directas — usar JPA/Hibernate o JPQL
- ❌ No omitir manejo de errores en ninguna capa
- ❌ No exponer stack traces al frontend
- ❌ No usar `console.log` en producción — usar SLF4J (`@Slf4j`)
- ❌ No crear un endpoint sin documentarlo en Swagger
- ❌ No usar `.get()` en un Optional sin verificar primero — siempre `.orElseThrow()`
- ❌ No modificar un script de Flyway que ya fue aplicado — crear uno nuevo
- ❌ No usar `ddl-auto=create` o `update` en producción
- ❌ No borrar registros con historial — usar soft delete

---

## Orden para implementar un nuevo módulo

Cuando se te pida implementar un módulo, seguir este orden siempre:

1. **Script Flyway** → `db/migration/V{n}__crear_tabla_{nombre}.sql`
2. **Entidad JPA** con `@Builder` → `model/`
3. **Repository** → `repository/`
4. **DTOs** (request y response) con `@Builder` → `dto/`
5. **Mapper** entidad ↔ DTO → `mapper/`
6. **Service** (interfaz + implementación con lambdas/streams) → `service/`
7. **Controller** REST con Swagger y `@PreAuthorize` → `controller/`
8. **Componente Angular** (listado + formulario + funcionalidades del modulo) → `features/[modulo]/`
9. **Service Angular** con HttpClient → `features/[modulo]/services/`
10. **Ruta** en el router → `app.routes.ts`

---

> Para el contexto específico del proyecto activo, leer también el archivo `PROJECT.md`.