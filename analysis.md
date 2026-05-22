# ANALYSIS\_TEMPLATE.md — Levantamiento de Requisitos

> Usa esta plantilla ANTES de crear el PROJECT.md.
> Las respuestas en \*cursiva\* son ejemplos — reemplázalas con los datos reales del cliente.
> Marca cada ítem con ✅ cuando tengas la respuesta confirmada.

\---

## 1\. Datos del Cliente y Negocio

* \[x] ¿Cuál es el nombre completo del negocio?

> Kinetic Rehab

* \[x] ¿A qué se dedica? ¿Cuál es su rubro principal?

> Es un centro de rehabilitación, realiza terapias físicas previa cita a pacientes lesionados.

* \[x] ¿Cuántos empleados/usuarios usarán el sistema?

> 4 personas, 2 doctores rehab, 1 recepcionista, y el administrados.

* \[x] ¿Tienen sucursales o es un solo local?

> \*Un solo local por ahora. Planean abrir una segunda sucursal en 2026.\*

* \[x] ¿Tienen algún sistema actual? ¿Qué problemas tiene?

> \*No tienen sistema, Usan cuaderno para ir apuntando los pacientes y sus respectivos tratamientos.

* \[x] ¿Por qué quieren un sistema nuevo ahora?

> \*Es su primer sistema, quieren llevar un control de todos sus pacientes, historias, tratamientos, incluso venden materiales como bandas, pelotas de gym etc.

* \[x] ¿Quién será el usuario principal (administrador) del sistema?

> \*Liz Quintanilla, dueño del negocio.\*

* \[x] ¿Quiénes más lo usarán y con qué permisos?

> \*Recepcionista: Encargada de ver todas las citas de los doctores, agendar citas, vender productos, realizar cobros de tratamientos o citas.
> Doctor: Puede ver toda su agenda del dia, semana, mes, puede crear historias, evaluaciones, terapias y sesiones.
> Administrador: Puede ver todo.

\---

## 2\. Objetivos del Proyecto

* \[x] ¿Cuál es el problema principal que el sistema debe resolver?

> El problema principal es que se están apuntando las citas, historia, tratamientos en un cuaderno, debemos automatizar todo eso.

* \[x] ¿Qué procesos quieren automatizar o mejorar?

> Todo el flujo, desde agendar una cita, hasta el alta de un paciente después de terminar sus sesiones de tratamiento.

* \[x] ¿Qué resultado esperan al tener el sistema funcionando?

> Tenerlo todo documentado y listo, evitando la perdida de datos del cuaderno.

* \[x] ¿Hay un plazo fijo de entrega? ¿Por qué esa fecha?

> \*Sí, 3 meses. Quieren tenerlo listo antes de la campaña de fin de año.\*

* \[x] ¿Tienen un presupuesto definido?

> \*Máximo S/ 5,000. Con posibilidad de negociar si se justifica.\*

* \[x] ¿Es este un proyecto único o habrá fases futuras?

> \*Fase 1 es este sistema. Fase 2 en 2026 incluiría la segunda sucursal y app móvil.\*

**Notas:**

```
El cliente es flexible en funcionalidades pero inflexible en la fecha.
Priorizar los modulos de recepción para agendar citas y sesiones, modulo del doctor para poder crear historia, tratamientos, sesiones, evaluación o revaloración.
```

\---

## 3\. Funcionalidades Requeridas

### 3.1 Módulos principales

* \[x] Listar todos los módulos que el cliente menciona
* \[x] ¿Cuáles son indispensables para el lanzamiento?
* \[x] ¿Cuáles son opcionales o para una segunda fase?

**Lista de módulos:**

```
Módulo 1: Autenticación, Usuarios y Roles → Indispensable

Módulo 2: Gestión de Pacientes → Indispensable

Módulo 3: Gestión de Doctores y Personal Médico → Indispensable

Módulo 4: Agenda, Citas y Sesiones → Indispensable

Módulo 5: Historia Clínica, Evaluaciones y Tratamientos → Indispensable

Módulo 6: Ventas, Caja y Pagos → Indispensable

Módulo 7: Inventario y Productos → Indispensable

Módulo 8: Reportes y Dashboard → Indispensable

Módulo 9: Aplicación móvil para el dueño → Segunda fase

Módulo 10: Multi sucursal → Segunda fase

Módulo 11: Integración WhatsApp/SMS → Segunda fase
```

### 3.2 Detalle por módulo

**Módulo de Autenticación, Usuarios y Roles**

\[x] ¿Quién puede usarlo? → Administrador

\[x] ¿Qué datos ingresa? → Usuarios, contraseñas, roles, permisos y estado del usuario

\[x] ¿Qué datos ve? → Lista de usuarios, roles asignados, accesos y actividad básica

\[x] ¿Genera documentos? → No

\[x] ¿Reglas especiales? → Solo el administrador puede crear o modificar usuarios

\[x] ¿Se conecta con otro módulo? → Sí, con todos los módulos del sistema


**Módulo de Pacientes**

* \[x] ¿Quién puede usarlo? → Recepción, Doctor y Administrador
* \[x] ¿Qué datos ingresa? → - Nombres y apellidos
* \- DNI/documento
* \- Fecha de nacimiento
* \- Sexo
* \- Teléfono
* \- Correo
* \- Dirección
* \- Ocupación
* \- Contacto de emergencia
* \- Observaciones generales(puede estar vacio)
* \[x] ¿Qué datos ve? → Recepción:
- Datos personales
- Historial de citas
- Sesiones pendientes
- Estado de pagos
* 
* Doctor:
* - Datos completos del paciente
* - Historial clínico
* - Tratamientos y sesiones
* 
* Administrador:
* - Acceso total

* \[x] ¿Genera documentos? → Ficha del paciente e historial básico en PDF
* \[x] ¿Reglas especiales? → - No se puede eliminar pacientes con historial clínico*
* - Recepción no puede editar diagnósticos médicos
* - Toda modificación debe registrar usuario y fecha

\[x] ¿Se conecta con otro módulo? → 
- Agenda y citas
- Historia clínica
- Ventas*
- Reportes


**Módulo de Gestión de Doctores y Personal Médico**
 ¿Quién puede usarlo? → Administrador y Recepción
 ¿Qué datos ingresa? →- Nombre completo
- Especialidad
- CMP/colegiatura
- DNI
- Teléfono
- Correo
- Horario laboral
- Disponibilidad
- Estado activo/inactivo
¿Qué datos ve? →
Recepción:
- Horarios disponibles
- Especialidades
- Disponibilidad

Doctor:
- Su agenda
- Sus pacientes

Administrador:
- Acceso completo
 ¿Genera documentos? → Agenda médica y reporte de citas
 ¿Reglas especiales? →- No se pueden cruzar horarios del mismo doctor
- Un doctor inactivo no aparece para nuevas citas
¿Se conecta con otro módulo? →
- Agenda y citas
- Historia clínica
- Reportes

**Módulo de Agenda, Citas y Sesiones**
 ¿Quién puede usarlo? → Recepción, Doctor y Administrador
 ¿Qué datos ingresa? →- Paciente
- Doctor asignado
- Fecha y hora
- Tipo:
  - Cita
  - Evaluación
  - Revaloración
  - Sesión
- Observaciones
- Estado de la cita
¿Qué datos ve? →
- Calendario diario/semanal/mensual
- Estado de citas
- Pacientes agendados
- Horarios disponibles
 ¿Genera documentos? →
- Confirmación de cita
- Recordatorio por correo (si aplica)
¿Reglas especiales? →
- No se puede registrar dos citas para el mismo doctor en el mismo horario
- No permitir sesiones fuera del horario del doctor
- Las sesiones realizadas deben quedar registradas
 ¿Se conecta con otro módulo? →
- Pacientes
- Doctores
- Historia clínica
- Reportes

**Módulo de Historia Clínica, Evaluaciones y Tratamientos**
 ¿Quién puede usarlo? → Doctor y Administrador
 ¿Qué datos ingresa? →
 Datos generales de la sesión:
- Fecha de la sesión
- Categoría de la sesión (Evaluación, Valoración, Re-valoración)
- Motivo de consulta
- Doctor responsable

Antecedentes:
- Antecedentes no patológicos:
  - Tabaquismo
  - Alcoholismo
  - Medicamentos
  - Deporte o actividad física
- Antecedentes personales patológicos
- Enfermedades actuales y pasadas

Evaluación fisioterapéutica:
- Padecimiento actual
- Valoración subjetiva (dolor, molestias, estabilidad)
- Evaluación de dolor (EVA u otra escala)
- Evaluación de movilidad (flexión/extensión de articulaciones, cadera, rodilla, tobillo)
- Evaluación funcional:
  - Puntas de pie, unipodal, CCC, step down, trote, saltos, control de rodillas/cadera, frenos
- Evaluación muscular:
  - Contracturas, acortamientos, fuerza, desbalances

Objetivos del tratamiento:
- Mejorar movilidad
- Mejorar fuerza
- Mejorar patrones funcionales
- Reducir dolor

Plan de tratamiento:
- Terapias CAM (Tecar, TENS, movilización)
- Ejercicios funcionales/GYM (fuerza, control, amortiguación)
- Frecuencia del tratamiento (Diario, Interdiario, Semanal)
- Observaciones adicionales

¿Qué datos ve? →
- Historial clínico completo del paciente
- Evolución del paciente
- objetivos y Tratamientos activos
- Sesiones realizadas y proximas programadas
- Evaluaciones anteriores y comparativas
 ¿Genera documentos? →
- PDF de la historia clínica completa
- Reporte de evolución del paciente
- PDF por sesión individual
- Indicaciones y objetivos terapéuticos
¿Reglas especiales? →
- Solo el doctor puede modificar información clínica
- Cada cambio debe registrar:
  - Fecha
  - Hora
  - Doctor responsable
- No se elimina historial clínico
- Se debe poder enlazar cada registro a la cita correspondiente
- Permitir búsqueda por paciente, doctor, fecha o tipo de sesión
 ¿Se conecta con otro módulo? →
- Pacientes
- Agenda y sesiones
- Reportes

**Módulo de Ventas, Caja y Pagos**
 ¿Quién puede usarlo? → Recepción y Administrador
 ¿Qué datos ingresa? →
- Venta de productos
- Cobro de servicio(sesion, evaluacion, e)
- Métodos de pago(Efectivo, yape/plin)
- Descuentos
- Observaciones
 ¿Qué datos ve? →
- Historial de ventas
- Caja diaria
- Pagos pendientes
- Comprobantes
¿Genera documentos? →
- Ticket
- Comprobante
- Reporte de caja
 ¿Reglas especiales? →
- Toda venta debe registrar usuario responsable
- No se puede modificar una venta cerrada sin permisos
 ¿Se conecta con otro módulo? →
 - Inventario
- Pacientes
- Reportes
**Módulo de Inventario y Productos**
 ¿Quién puede usarlo? → Administrador y Recepción
 ¿Qué datos ingresa? →
- Producto
- Categoría
- Stock
- Precio
- Lotes(controla las fechas, el stock, precios)
- Fecha de vencimiento(Solo para productos consumibles)
- Stock mínimo
 ¿Qué datos ve? →
- Stock actual
- Historial de movimientos
- Alertas de bajo stock
- Productos vencidos o próximos a vencer
¿Genera documentos? →
- Reporte de inventario
- Kardex
- Movimientos de stock
 ¿Reglas especiales? →
- Alertar cuando el stock llegue al mínimo
- No permitir stock negativo
- Descontar stock automáticamente en ventas4
¿Se conecta con otro módulo? →
- Ventas
- Reportes
**Módulo de Reportes y Dashboard**
 ¿Quién puede usarlo? → Administrador
 ¿Qué datos ingresa? → Filtros de fechas, doctores y tipos de reporte
 ¿Qué datos ve? →
- Ventas diarias/mensuales
- Pacientes atendidos
- Sesiones realizadas
- Ingresos
- Productos más vendidos
- Doctores con más atenciones
- Ocupación de agenda
 ¿Genera documentos? →
- Reportes PDF
- Exportación Excel
¿Reglas especiales? →
- Los reportes financieros solo los ve el administrador
 ¿Se conecta con otro módulo? →
- Todos los módulos principales

**Priorizar para el MVP**
Modulos:
1. Autenticación y roles
2. Pacientes
3. Doctores
4. Agenda y citas
5. Historia clínica básica
6. Ventas
7. Inventario básico
8. Dashboard básico

La aplicación móvil, WhatsApp y multi sucursal quedan para segunda fase.

Se recomienda separar:
- Datos del paciente
- Agenda
- Historia clínica
- Ventas
- Inventario

para mantener una arquitectura limpia y escalable en Spring Boot y Angular.

## 4\. Usuarios y Roles

* \[x] ¿Cuántos tipos de usuario habrá? → *3 roles*
* \[x] ¿Habrá superadmin? → *Sí, el administrador tiene acceso total*
* \[x] ¿Los usuarios se crean desde el sistema? → *Sí, solo el admin puede crear usuarios*
* \[x] ¿Se necesita auditoría? → *Sí, el dueño quiere saber quién hizo cada venta, cada cita, etc*

**Roles definidos:**

```
Rol 1 — Administrador  | Acceso total al sistema
Rol 2 — Recepcion      | Agenda, ventas, cobros
Rol 3 — Doctor/P. medico| Gestion de pacientes, agenda, tratamiento, etc
```

\---

## 5\. Datos e Información

* \[x] ¿Qué datos manejan actualmente? → *cuaderno para ventas e inventario*
* \[x] ¿Se necesita migrar datos? → *No*
* \[x] ¿Qué datos son críticos? → *Historial clinico de paciente, datos de tratamiento y sesiones*
* \[x] ¿Hay datos sensibles? → *Datos del paciente, datos del tratamiento, datos de la citas, datos de los doctores*
* \[x] ¿Con qué frecuencia se generan datos? → *Diario habran mas de 10 pacientes*
* \[x] ¿Necesitan exportar datos? → *Sí, reportes en PDF y Excel*

\---

## 6\. Integraciones y Conexiones Externas

* \[x] ¿Conexión con otro software? → *No*
* \[x] ¿Pasarela de pagos? → *No, solo pagos en efectivo y bitelleteras digitales(yape,plin)*
* \[x] ¿Hardware especial? → *Sí: Lector de barras, y impresora termica 50mm*
* \[x] ¿Notificaciones? → *Alertas de stock bajo por correo (Gmail del dueño)*
* \[x] ¿API externa? → *Consulta de RUC/DNI a SUNAT para clientes (opcional, no por ahora)*
* \[x] ¿Funciona offline? → *Sí, debe funcionar sin internet en red local*

**Integraciones identificadas:**

```
1. Impresora térmica — tickets de venta
2. Lector de código de barras USB — búsqueda de productos
3. Notificaciones por correo — alertas de stock (Gmail SMTP)
4. API SUNAT — consulta de RUC (segunda fase, No por ahora.)
```

\---

## 7\. Requisitos No Funcionales

### Rendimiento

* \[x] ¿Usuarios simultáneos? → *Máximo 3 al mismo tiempo*
* \[x] ¿Volumen de datos estimado? → *de 10 a 20 pacientes diarios*
* \[x] ¿Procesos críticos de velocidad? → *Al momento de agendar, de registrar los datos de la cita o sesion*

### Disponibilidad

* \[x] ¿Horario de funcionamiento? → *Lunes a viernes 7am a 10pm, sabados 7am a 1pm*
* \[x] ¿Tolerancia a caídas? → *Mínima — si cae el sistema no se registra nada*
* \[x] ¿Respaldo automático? → *Sí, backup diario a las 11pm, al terminar el turno*

### Seguridad

* \[x] ¿Restricciones de información? → *Recepcion no ve reportes de nada, ni ganancias ni nada*
* \[x] ¿Logs de actividad? → *Sí, registro de quién hizo cada venta y modificación de datos*
* \[x] ¿Requisitos legales? → *Ninguno especial por ahora*

### Usabilidad

* \[x] ¿Nivel técnico de los usuarios? → *Bajo — algunos usuarios nunca han usado un sistema*
* \[x] ¿Dispositivos? → *PC de escritorio en caja, tablet para consultorios, celular para el dueño*
* \[x] ¿Tipo de aplicación? → *Web responsive — funciona en navegador en todos los dispositivos*
* \[x] ¿Preferencias visuales? → *Logo de la empresa, colores Verde agua(adjunto imagen de un flyer), interfaz simple y elegante*



\---

## 8\. Infraestructura y Despliegue

* \[x] ¿Dónde vivirá el sistema? → *Servidor local en el mismo local (LAN)*
* \[x] ¿El cliente tiene servidor? → *Tienen una PC vieja: Intel Core i3, 8GB RAM, 500GB HDD. Se instalará Ubuntu.*
* \[x] ¿Necesita dominio? → *No, solo acceso por IP local. El dueño accede por VPN desde afuera.*
* \[x] ¿Quién administra el servidor? → *El desarrollador deja todo configurado. El cliente no toca el servidor.*
* \[x] ¿SSL? → *No necesario en red local. Sí si se accede desde internet.*
* \[x] ¿Cuántos entornos? → *Desarrollo (local del dev) y Producción (servidor del cliente)*

**Notas:**

```
Evaluar si el HDD de 500GB es suficiente a largo plazo. Recomendarle SSD al cliente.
Configurar acceso remoto por VPN (WireGuard) para que el dueño vea reportes desde fuera.
```

\---

## 9\. Entrega y Capacitación

* \[x] ¿Capacitación? → *Sí, 3 sesiones: admin (2h), vendedores (1h), almacenero (1h)*
* \[x] ¿Documentación? → *Manual de usuario en PDF, manual técnico, guía de backup*
* \[x] ¿Acceso al código fuente? → *No, el cliente no lo solicita*
* \[x] ¿Garantía? → *3 meses por bugs. Cambios de alcance se cotizan aparte.*
* \[x] ¿Soporte post-entrega? → *Soporte por WhatsApp en horario laboral. Respuesta en 24h.*

**Notas:**

```
Grabar las sesiones de capacitación como respaldo para el cliente.
Dejar manual de "qué hacer si el sistema no enciende" para el administrador.
```

\---

## 10\. Alcance y Exclusiones

### Está DENTRO del alcance:

```
- Sistema web responsive (PC, tablet, celular)
- Módulos: auth, productos, inventario, ventas, reportes
- Impresión de tickets en térmica
- Alertas de stock por correo
- Importación inicial de productos desde Excel
- Capacitación y manuales
- 3 meses de garantía por bugs
```

### Está FUERA del alcance (aclarar al cliente):

```
- App móvil nativa
- Segunda sucursal
- Integración con SUNAT / facturación electrónica
- E-commerce o venta online
- Soporte de hardware (impresora, PC del servidor)
- Cambios de funcionalidad después de la entrega (se cotizan aparte)
```

### Puntos ambiguos que necesitan definición:

```
- ¿Las alertas de stock son por correo o también por WhatsApp? (WhatsApp requiere API de pago)
- Solo correo sin necesidad de pago, si es de pago se implementa despues
- ¿El administrador puede exportar reportes de cualquier período o solo del mes actual?
- El Administrador puede descargar todos los reportes necesarios para ver el progreso del negocio
- ¿Se necesita factura electrónica ahora o en una segunda fase?
-La Facturacion electronica sera para la fase 2
```

\---

## 11\. Checklist Final antes de cerrar el análisis

* \[x] El cliente firmó o confirmó el alcance por escrito
* \[x] Todos los módulos tienen sus reglas de negocio definidas
* \[x] Los roles y permisos están claros
* \[x] Las integraciones externas están identificadas
* \[x] El presupuesto y la fecha de entrega están acordados
* \[x] Se definió qué pasa si hay cambios de alcance durante el proyecto
* \[x] El cliente tiene claro qué NO incluye el sistema

\---

> Una vez completada esta plantilla, traspasa la información al PROJECT.md del proyecto.

