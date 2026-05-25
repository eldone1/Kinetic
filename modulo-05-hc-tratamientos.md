# Módulo 5 — Historia Clínica y Tratamientos

## Estado: ✅ Completado (v2 - Campos expandidos)

## Fecha
2025-07-21 → 2025-08-05 (v1) | 2025-08-06 (v2 - campos HistorialClinico.md)

## Descripción
Gestión completa de la historia clínica de pacientes con los 3 escenarios clínicos definidos en `HistorialClinico.md`:
1. **Primera Evaluación (HC Inicial)** — Apertura de HC con secciones A-F
2. **Valoración Fisioterapéutica** — Evaluación SOAP + escalas EVA/BORG/Daniels + exploración física
3. **Re-valoración (Control de Evolución)** — Seguimiento comparativo mensual

Solo accesible por ADMIN y DOCTOR; RECEPCION bloqueado (403).

---

## Estructura de Datos (Backend)

### Tablas (V8 migration)

#### `historias_clinicas` — Secciones A-F completas

| Columna | Sección | Descripción |
|---------|---------|-------------|
| `id_paciente` | — | FK → pacientes |
| `doctor_asignado` | A | Nombre del fisioterapeuta evaluador |
| `especialidad` | A | Área de atención (default: Fisioterapia) |
| `procedencia` | A | Origen de la derivación |
| `categoria` | A | Tipo de registro (default: Valoración / Evaluación Inicial) |
| `motivo_consulta` | B | Anamnesis general |
| `tabaquismo` | C | Frecuencia de consumo |
| `alcoholismo` | C | Frecuencia de consumo |
| `medicamentos` | C | Fármacos de consumo diario |
| `deporte_actividad_fisica` | C | Disciplinas y frecuencia |
| `enfermedades_actuales` | D | Patologías sistémicas activas |
| `enfermedades_pasadas` | D | Lesiones o condiciones resueltas |
| `alergias` | D | Reacciones adversas |
| `cirugias` | D | Intervenciones previas |
| `antec_heredo_familiares` | E | JSON array de checkboxes |
| `antec_heredo_especificaciones` | E | Detalle de familiares afectados |
| `peso` | F | kg |
| `talla` | F | cm |
| `pa_presion_arterial` | F | mmHg |
| `imc` | F | Calculado automáticamente |

#### `evaluaciones` — Valoración + Re-valoración

| Columna | Escenario | Descripción |
|---------|-----------|-------------|
| `id_historia_clinica` | Ambos | FK |
| `id_doctor` | Ambos | FK |
| `tipo` | Ambos | `VALORACION` / `REVALORACION` |
| `padecimiento_actual` | V | Diagnóstico médico de ingreso |
| `valoracion_subjetiva` | V | Relato del paciente |
| `eva_puntuacion` | V | EVA 0-10 (slider con color) |
| `borg_puntuacion` | V | BORG 0-10 |
| `daniels_puntuacion` | V | Daniels 0-5 |
| `dolor_intensidad` | V | Moderado, agudo, punzante |
| `dolor_frecuencia` | V | Permanente, intermitente |
| `signos` | V | Hallazgos visuales/palpables |
| `evaluacion_movilidad` | V | JSON: ROM table [{nombre, rango}] |
| `evaluacion_muscular` | V | Hallazgos tejido blando |
| `evaluacion_funcional` | V | JSON: pruebas especiales + análisis dinámico |
| `sensibilidad_palpacion` | V | Puntos de dolor |
| `diagnostico_clinico` | V | Conclusión kinésica |
| `objetivos_tratamiento` | V | Metas terapéuticas |
| `plan_camilla` | V | Agentes físicos y terapia manual |
| `plan_gym` | V | Ejercicio terapéutico |
| `frecuencia_tratamiento` | V | Regularidad sugerida |
| `cie10` | V | Código CIE-10 |
| `motivo_control` | R | Especificación del control |
| `padecimiento_actual_historial` | R | Recordatorio diagnóstico base |
| `valoracion_progreso` | R | Progreso subjetivo del paciente |
| `evaluacion_movilidad_actualizada` | R | JSON con evolución [{nombre, rango, evolucion}] |
| `objetivos_modificados` | R | Transición a objetivos funcionales |
| `plan_camilla_actualizado` | R | Técnicas modificadas |
| `plan_gym_actualizado` | R | Ejercicios actualizados |
| `frecuencia_actualizada` | R | Ratificación o reducción |

(V = Valoración, R = Re-valoración)

#### `tratamientos`

| Columna | Descripción |
|---------|-------------|
| ... | (campos anteriores) |
| `plan_camilla` | Plan de camilla específico |
| `plan_gym` | Plan de gym específico |

#### `sesiones` — Sin cambios

---

## Frontend

### Componente detalle
- **Formulario HC**: Secciones A-F completas con checkboxes heredo-familiares, cálculo automático de IMC
- **Modal Valoración**: SOAP completo + escalas EVA/BORG/Daniels con sliders + ROM table + Pruebas especiales + Plan Camilla/Gym
- **Modal Re-valoración**: Campos específicos de control de evolución (motivo, progreso, movilidad actualizada, objetivos modificados)
- **Modal Tratamiento**: Plan Camilla + Plan Gym
- **Modal Sesión**: Sin cambios

---

## Dependencias
- Sin nuevas dependencias externas

---

## Pruebas Manuales

### Crear Historia Clínica Completa
1. Ir a `/historias-clinicas`, buscar paciente, click "Aperturar HC"
2. Llenar todas las secciones A-F (Control Adm, Anamnesis, Antecedentes, Heredo, Signos Vitales)
3. ✅ IMC calculado automáticamente al ingresar peso y talla
4. ✅ HC creada con todos los campos visibles en pestaña General

### Crear Valoración Fisioterapéutica
1. Pestaña Evaluaciones → "+ Valoración"
2. Llenar: Padecimiento Actual, Valoración Subjetiva
3. Ajustar sliders EVA/BORG/Daniels
4. Llenar Signos, Movilidad (JSON), Muscular, Pruebas Funcionales (JSON)
5. Llenar Diagnóstico, Objetivos, Plan Camilla, Plan Gym, Frecuencia, CIE-10
6. ✅ Evaluación guardada con todos los campos

### Crear Re-valoración
1. Pestaña Evaluaciones → "+ Re-valoración"
2. Llenar campos específicos: Motivo Control, Padecimiento Historial, Progreso
3. Llenar Movilidad Actualizada (JSON), Objetivos Modificados, Planes Actualizados
4. ✅ Re-valoración guardada con campos específicos visibles

### Crear Tratamiento
1. Pestaña Tratamientos → "+ Nuevo Tratamiento"
2. Llenar Plan Camilla y Plan Gym
3. ✅ Tratamiento guardado con planes

### Demás pruebas: sin cambios respecto a v1
