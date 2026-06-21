# PROJECT.md — Sistema de Gestión para Centro de Rehabilitación

> Este archivo es el contexto completo del proyecto. Claude Code debe leerlo antes de codear cualquier módulo.

---

## 1. Información General

| Campo | Valor |
|---|---|
| Nombre | Sistema de Gestión para Centro de Rehabilitación |
| Cliente | Kinetic Rehab |
| Contacto | Liz Quintanilla (Administradora/Dueña) |
| Tipo | Sistema Fullstack de Gestión Clínica y POS |
| Inicio | 2025-06-01 |
| Entrega | 2025-09-01 |
| Presupuesto | S/ 5,000.00 |
| Estado actual | Módulo 7 completado — Reportes con exportación PDF/Excel |

**Descripción:**
Sistema web completo para centro de rehabilitación física. Incluye gestión de pacientes, agenda de citas y sesiones, historia clínica, evaluaciones y tratamientos fisioterapéuticos, ventas de productos, inventario, caja y reportes. Funciona en red local (LAN) con acceso remoto por VPN para el dueño. Stack: Angular + Spring Boot + MySQL.

---

## 2. Análisis

### Requisitos Funcionales
- [ ] Registro y login de usuarios con roles (administrador(Solo adm puede registrar o inactivar), recepción, doctor)
- [x] Gestión de pacientes: ficha completa, búsqueda, historial
- [x] Gestión de doctores y personal médico: horarios, especialidades, disponibilidad
- [ ] Agenda, citas y sesiones: calendario diario/semanal/mensual, estados, sin cruces de horario
- [x] Historia clínica: evaluaciones, re-valoraciones, tratamientos, sesiones, evolución del paciente
- [x] Módulo de ventas y caja (MVP): apertura/cierre de caja, cobro de servicios (citas COMPLETADA), efectivo + Yape/Plin
- [ ] Gestión de inventario: stock, lotes, fechas de vencimiento, alertas de bajo stock (escala futura)
- [x] Reportes y dashboard: ventas, pacientes atendidos, sesiones, ingresos, exportación PDF y Excel

### Requisitos No Funcionales
- [ ] Respuesta del sistema menor a 2 segundos en agendado y registro de sesiones
- [ ] Funciona en red local (LAN) sin internet
- [ ] Acceso remoto por VPN (WireGuard) para el administrador
- [ ] Interfaz web responsive para PC de escritorio, tablet y celular
- [ ] Respaldo automático de base de datos diario a las 11pm
- [ ] Auditoría: registro de usuario, fecha y hora en cada acción relevante
- [ ] Compatible con impresora térmica 58mm y lector de código de barras USB
- [ ] Notificaciones de bajo stock por correo (Gmail SMTP)

### Alcance
Sistema para 1 local, máximo 3 usuarios concurrentes (recepción, 2 doctores, administrador). **No incluye** app móvil nativa, segunda sucursal, facturación electrónica SUNAT, integración WhatsApp/SMS ni e-commerce. Estas funcionalidades quedan para la Fase 2 (2026).

### Stakeholders
Liz Quintanilla (dueña/administradora), 1 recepcionista, 2 doctores rehabilitadores.

---

## 3. Diseño y Arquitectura

### Arquitectura
Arquitectura cliente-servidor en red local (LAN). Frontend SPA en Angular, Backend REST API en Spring Boot, Base de datos MySQL. Acceso externo mediante VPN (WireGuard) para el administrador.

``
[Angular SPA] <--HTTP/JSON--> [Spring Boot API] <--JPA/Hibernate--> [MySQL]
                                      |
                                 [Nginx proxy]
                                      |
                              [WireGuard VPN] (acceso del admin desde fuera)
```

### Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Angular 17+, Tailwind CSS, Angular Router, HttpClient, FullCalendar |
| Backend | Spring Boot 3, Spring Security, JWT, BCrypt |
| Base de datos | MySQL, JPA / Hibernate |
| Infraestructura | Ubuntu 22.04, Nginx, WireGuard VPN, Docker (dev) |
| Notificaciones | JavaMailSender + Gmail SMTP |
| Hardware | Impresora térmica 58mm (ESC/POS), lector de barras USB |

### Tablas principales de la BD
`usuarios` · `roles` · `pacientes` · `doctores` · `horarios_doctor` · `citas` · `sesiones` · `historias_clinicas` · `evaluaciones` · `tratamientos` · `productos` · `categorias_producto` · `lotes` · `inventario_movimientos` · `ventas` · `detalle_ventas` · `caja_sesiones` · `auditoria_log`

---

## 4. Planificación de Fases

| # | Fase | Inicio | Fin | Estado |
|---|---|---|---|---|---|
| 1 | Setup y Auth | 2025-06-01 | 2025-06-14 | ✅ Completado |
| 2 | Pacientes | 2025-06-15 | 2025-06-20 | ✅ Completado |
| 3 | Doctores | 2025-06-21 | 2025-06-30 | ✅ Completado |
| 4 | Agenda, Citas y Sesiones | 2025-07-01 | 2025-07-20 | ✅ Completado |
| 5 | Historia Clínica y Tratamientos | 2025-07-21 | 2025-08-05 | ✅ Completado |
| 6 | Ventas, Caja e Inventario — MVP Servicios | 2025-08-06 | 2025-08-20 | ✅ Completado |
| 7 | Reportes y Dashboard | 2025-08-21 | 2025-08-31 | ✅ Completado — Dashboard por rol + 7 reportes con PDF/Excel |
| 8 | Pruebas y Ajustes | 2025-09-01 | 2025-09-15 | ⏳ Pendiente |
| 9 | Despliegue y Capacitación | 2025-09-16 | 2025-09-30 | ⏳ Pendiente |

---

## 5. Módulos de Desarrollo

| Módulo | Tecnologías | Estado | Notas |
|---|---|---|---|
| Autenticación y Roles | Spring Security + JWT + BCrypt | ✅ Completado | 3 roles: admin, recepción, doctor |
| Gestión de Pacientes | Angular + Spring Boot + JPA | ✅ Completado | Ficha completa, búsqueda por nombre/doc/tel, soft delete |
| Gestión de Doctores | Angular + Spring Boot + JPA | ✅ Completado | CRUD, horarios semanales, activar/desactivar, soft delete. Auto-creación desde Usuario ROLE_DOCTOR (V9). DNI nullable. |
| Agenda, Citas y Sesiones | FullCalendar + Spring Boot | ✅ Completado | Vista diaria/semanal/mensual, sin cruces, modal crear/editar con autocomplete para paciente/doctor, cambio de estado. **Vista Lista v2:** tabla agrupada por fecha, filtros por doctor/estado/rango, cambio de estado inline |
| Historia Clínica y Tratamientos | Angular + Spring Boot + JPA | ✅ Completado | HC expandida (secciones A-F: control adm, anamnesis, antecedentes, heredo-familiares, signos vitales). Evaluaciones: Valoración SOAP + escalas EVA/BORG/Daniels + ROM + pruebas especiales + plan camilla/gym. Re-valoración con control de evolución. IMC automático. Solo ADMIN/DOCTOR |
| Ventas y Caja (MVP Servicios) | Angular + Spring Boot + JPA | ✅ Completado | MVP: apertura/cierre caja, cobro citas COMPLETADA, Efectivo+Yape/Plin, catálogo servicios con precios fijos, validación horario doctor. Escala futura: venta productos |
| Inventario y Productos | Angular + Spring Boot + JPA | ⏳ Pendiente | Lotes, vencimiento, alertas por correo (escala futura) |
| Reportes y Dashboard | Angular + Chart.js + iText/Apache POI | ✅ Completado | Dashboard por rol. 7 reportes (Ventas, Servicios, Doctores, Estados, Caja, Pacientes, Ocupación) con filtros fecha/doctor y exportación PDF/Excel. Solo ADMIN. |
| Auditoría y Logs | Spring Boot AOP / Interceptors | ⏳ Pendiente | Registro de usuario, fecha y hora |

---

## 6. Pruebas / QA

### Casos de prueba

| Caso | Resultado | Notas |
|---|---|---|
| Login con credenciales válidas | ✅ OK | JWT generado, usuario y rol retornados |
| Login con credenciales inválidas | ✅ OK | 401 Unauthorized con mensaje |
| Login con usuario inactivo | ✅ OK | 401 Unauthorized |
| Crear usuario con username duplicado | ✅ OK | 409 Conflict |
| Admin lista usuarios | ✅ OK | Solo ADMIN puede acceder |
| Recepción intenta acceder a /api/usuarios | ❌ Pendiente | Debe ser bloqueado (403) |
| Agendar cita con horario ya ocupado | ✅ OK | Validación backend: 400 BadRequest con mensaje |
| Doctor crea historia clínica de paciente | ✅ OK | HC creada con campos expandidos: control adm, antecedentes, heredo-familiares, signos vitales, IMC automático |
| Vista Lista de citas con filtros (toggle Calendario/Lista) | ✅ OK | Vista lista con filtros por doctor, estado, rango de fechas |
| Cambio de estado inline desde la lista (select) | ✅ OK | Select coloreado, PATCH /estado, refresh automático |
| Eliminar cita desde la lista (solo ADMIN) | ✅ OK | Confirmación + soft delete |
| Recepción intenta acceder a /api/historias-clinicas | ✅ OK | 403 Forbidden (solo ADMIN/DOCTOR) |
| Doctor crea valoración fisioterapéutica | ✅ OK | Evaluación guardada con tipo VALORACION, escalas EVA/BORG/Daniels, ROM table, pruebas especiales, plan camilla/gym, CIE-10 |
| Doctor crea re-valoración (control evolución) | ✅ OK | Evaluación con tipo REVALORACION, motivo control, progreso, movilidad actualizada, objetivos modificados, planes actualizados |
| Doctor crea tratamiento vinculado a evaluación | ✅ OK | Tratamiento creado con frecuencia, duración, plan camilla, plan gym, estado ACTIVO |
| Registrar sesión de tratamiento | ✅ OK | Sesión creada con evaluación subjetiva/objetiva y tratamiento realizado |
| Marcar sesión como REALIZADA/NO_ASISTIO | ✅ OK | Estado actualizado con flag de asistencia |
| Cambiar estado de tratamiento a COMPLETADO | ✅ OK | Estado actualizado vía PATCH |
| Aperturar caja con monto inicial | ✅ OK | — |
| Cobrar cita completada con efectivo (mostrar vuelto) | ✅ OK | — |
| Cobrar cita completada con Yape/Plin (sin vuelto) | ✅ OK | — |
| Buscar paciente por nombre/DNI en cobro | ✅ OK | — |
| Intentar cobrar cita ya facturada | ✅ OK | Error 409 Conflict |
| Intentar cobrar sin caja activa | ✅ OK | Error 400 BadRequest |
| Cerrar caja con resumen de ventas | ✅ OK | — |
| Cierre de caja muestra montos esperados (efectivo + yape/plin) antes de declarar | ✅ OK | — |
| Cierre de caja calcula diferencias declarado vs esperado (faltante/sobrante) | ✅ OK | Muestra verde si cero, rojo con advertencia si hay diferencia |
| Cierre de caja loggea advertencia si hay diferencias no cero | ✅ OK | — |
| Admin ve lista de cajas (activas/cerradas) con ventas | ✅ OK | — |
| Intentar cobrar cita en estado no COMPLETADA | ✅ OK | Se filtra en backend |
| Recepción ve solo sus propias cajas | ✅ OK | — |
| Crear cita con servicio del catálogo (precio auto-asignado) | ✅ OK | Snapshot de precio al agendar |
| Crear cita fuera del horario del doctor | ✅ OK | Error 400 con mensaje visible en frontend |
| Editar cita y que valide el horario del doctor | ✅ OK | Misma validación que al crear |
| Mensaje de error de horario se muestra en el formulario | ✅ OK | Banner rojo en modal de cita |
| Venta con stock insuficiente | ⏳ Pendiente | — |
| Alerta de stock bajo por correo | ⏳ Pendiente | — |
| Exportar reporte de ventas mensual en PDF | ✅ OK | iText 7.2.6 + Apache POI 5.2.6 |
| Backup automático a las 11pm | ⏳ Pendiente | — |

### Bugs registrados

| Bug | Severidad | Estado |
|---|---|---|
| Doctores registrados como usuarios (ROLE_DOCTOR) no aparecían en selector de citas | Alta | ✅ Fix: V9 migración + auto-creación Doctor desde Usuario |
| NullPointerException al editar doctor sin DNI | Alta | ✅ Fix: validación null-safe en DoctorServiceImpl.actualizar() |
| Calendario no se inicializa (DOM oculto por *ngIf al momento de ngAfterViewInit) | Alta | ✅ Fix: inicializar Calendar tras cargar datos, cuando el DOM existe |
| Falta vista de lista de citas con filtros y cambio de estado inline | Media | ✅ Fix: agregada vista Lista con toggle Calendario/Lista en cita-list.component.ts |
| Doctor (ROLE_DOCTOR) no podía cargar lista de doctores (403 en `/disponibles`) ni preseleccionar su perfil | Alta | ✅ Fix: agregado DOCTOR a `@PreAuthorize` de `/disponibles`, nuevo endpoint `GET /api/doctores/yo`, frontend preselecciona doctor logueado |
| Recepción usaba `listarDisponibles` (solo activos) en vez de `listarTodos` (todos los registrados) | Baja | ✅ Fix: cambiado a `listarTodos()` para ADMIN/RECEPCION en cita-list.component.ts |
| Doctor veía pestaña "Doctores" en sidebar y al hacer clic cerraba sesión (roleGuard redirigía a login) | Alta | ✅ Fix: hijos del menú ahora filtran por `tieneRol(child.roles)`. DOCTOR redirigido a `/doctores/mi-perfil`. Nuevo dropdown en header con "Mi Perfil". |

---

## 7. Usuarios y Roles

| Rol | Permisos |
|---|---|---|
| Administrador | Acceso total al sistema. Crea y gestiona usuarios. Ve todos los reportes financieros. |
| Recepción | Agenda citas, gestiona pacientes (datos personales), realiza ventas y cobros, apertura/cierre de caja. No ve reportes financieros ni datos clínicos. |
| Doctor | Ve su agenda, crea y edita historia clínica, evaluaciones, tratamientos y sesiones de sus pacientes. Ve su perfil personal con horarios. No accede a ventas ni reportes financieros. |

> Solo el administrador puede crear, modificar o desactivar usuarios. Toda acción queda registrada en el log de auditoría con usuario, fecha y hora.

---

## 8. Entrega y Despliegue

- **Servidor:** PC del cliente — Intel Core i3, 8GB RAM, 500GB HDD → instalar Ubuntu 22.04. Evaluar upgrade a SSD.
- **Servicios:** MySQL + Spring Boot + Nginx configurados. WireGuard VPN para acceso remoto del administrador.
- **URL local:** http://192.168.56.1 (IP asignada en la red del local)
- **Acceso externo:** VPN WireGuard (solo administrador)
- **Credenciales:** Entregadas en documento sellado
- **Capacitación:** 4 sesiones — Administrador (2h), Recepción (1h), Doctores (1h)
- **Documentación:** Manual de usuario PDF, manual técnico, diagrama ER, colección Postman, guía de backup y recuperación
- **Estado:** ⏳ Pendiente de despliegue final

---

## 9. Post-venta

- **Garantía:** 3 meses por bugs. Soporte correctivo gratuito. Cambios de alcance se cotizan aparte.
- **Soporte:** WhatsApp en horario laboral. Respuesta máx. 24 horas.
- **Contrato de mantenimiento:** No activo
- **Observaciones:** Cliente interesado en segunda sucursal en 2026. Fase 2 incluiría multi-sucursal, app móvil, integración WhatsApp y facturación electrónica SUNAT.

---

## 10. Exclusiones (aclaradas con el cliente)

**Fuera del alcance de esta fase:**
- App móvil nativa
- Segunda sucursal / multi-sede
- Integración con SUNAT / facturación electrónica (queda para Fase 2)
- E-commerce o venta online
- Integración WhatsApp/SMS (requiere API de pago)
- Soporte de hardware (impresora, PC del servidor)
- Cambios de funcionalidad post-entrega (se cotizan aparte)

---

## Instrucciones para OpenCode

Cuando trabajes en este proyecto, sigue estas reglas:

1. **Lee este archivo primero** antes de generar cualquier código.
2. **Respeta el stack definido** — Angular + Spring Boot + MySQL. No cambies tecnologías sin consultarlo.
3. **Trabaja por fases** — pregunta en qué fase y módulo empezar.
4. **Genera código listo para usar** — con estructura de carpetas, nombres de archivos y comentarios claros.
5. **Al terminar cada módulo**, indica qué pruebas manuales hacer para validarlo.
6. **Si encuentras un conflicto** con los requisitos, pregunta antes de asumir.
7. **Respeta los permisos por rol** — recepción nunca ve datos clínicos ni reportes financieros; solo el doctor edita historia clínica.
8. **Todo dato clínico es sensible** — aplicar buenas prácticas de seguridad en todo endpoint relacionado.