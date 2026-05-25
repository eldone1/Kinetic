# Formatos de Registro Clínico en Fisioterapia

Este documento detalla la estructura de datos y campos requeridos en la plataforma de gestión clínica para cada uno de los tres escenarios de atención: **Primera Evaluación (Historia Clínica)**, **Valoración Fisioterapéutica** y **Re-valoración (Control de Evolución)**.

---

## 1. Primera Evaluación (Historia Clínica Inicial)
Este bloque se completa exclusivamente cuando el paciente ingresa por primera vez al centro. Su objetivo es recolectar el historial médico, hábitos y antecedentes antes de la exploración física.

### A. Información de Control Administrativo
* **Doctor / Consultor:** Nombre del fisioterapeuta o médico evaluador. (Se completa cuando con el doctor que esta logeado)
* **Especialidad:** Área de atención (*Fisioterapia*).
* **Procedencia:** Origen de la derivación del paciente (ej. *Médico traumatólogo, recomendación, etc.*).
* **Categoría:** Tipo de registro (Seleccionado: *Valoración / Evaluación Inicial*).

### B. Anamnesis General
* **Motivo de Consulta:** Descripción libre por parte del paciente sobre su afección y el tiempo que lleva con ella (ej. *Hace 3 años sufrió lesión jugando fútbol, se le trabó la rodilla izquierda*).

### C. Antecedentes No Patológicos
* **Tabaquismo:** (Campo de texto con indicador de frecuencia por si consume).
* **Alcoholismo:** (Campo de texto comn indicador de frecuencia por si consume).
* **Medicamentos:** Fármacos de consumo diario o analgésicos tomados recientemente (ej. *Celebrex*).
* **Deporte o Actividad Física:** Disciplinas y frecuencia con la que entrena (ej. *Gimnasio, pilates, yoga, natación*).

### D. Antecedentes Personales Patológicos
* **Enfermedades Actuales:** Patologías sistémicas activas (ej. *Condromalacia, hiperlaxitud, varices, resistencia a la insulina*).
* **Enfermedades Pasadas:** Lesiones o condiciones resueltas (ej. *Esguince antiguo de tobillo izquierdo*).
* **Alergias:** Reacciones a medicamentos, materiales o alimentos.
* **Cirugías:** Intervenciones previas con fecha aproximada (ej. *Varices en marzo*).

### E. Antecedentes Heredo-Familiares (Padre, Madre, Hermanos, Abuelos)
* *Checkboxes de selección:*
    * [ ] Enfermedades Crónico-degenerativas
    * [ ] Enfermedades respiratorias
    * [ ] Cáncer
    * [ ] Cardiopatías
* **Especificaciones:** Detalle de los familiares que padecen las opciones marcadas.

### F. Signos Vitales
* **Peso:** En kilogramos (kg).
* **Talla:** En centímetros o metros (cm/m).
* **PA (Presión Arterial):** En mmHg.
* **IMC:** Índice de Masa Corporal (calculado de forma automática o manual).

---

## 2. Valoración (Evaluación Fisioterapéutica)
Este formato se utiliza para registrar la primera exploración física del paciente o para abrir un nuevo episodio clínico por una lesión distinta. Se enfoca en el examen físico objetivo del sistema musculoesquelético.

### A. Padecimiento Actual y Síntomas
* **Padecimiento Actual:** Diagnóstico médico de ingreso o descripción exacta de la lesión estructural (ej. *Desgarro 80% LCP, Hoffitis y tendinopatía rotuliana de rodilla izquierda*).
* **Valoración (Subjetiva):** Relato de la mecánica de la lesión, actividades que agravan el síntoma y evolución (ej. *Paciente refiere realizando skate generó una lesión... dolor al subir escaleras*).

### B. Evaluación del Dolor (Escala EVA)
* **EVA:** Escala Visual Análoga (Puntuación numérica del 0 al 10 con colores)
* **BORG:** Escala Visual de Esfuerzo percibido. (Puntuacion de 0 a 10 con colores y datos)
* **DANIELS:** Escala Muscular, para evaluar la fuerza (Puntuacion de 0 a 5 con datos)
* **Intensidad:** Descripción cualitativa (ej. *Moderado, agudo, punzante*).
* **Frecuencia:** Periodicidad del dolor (ej. *Permanente, intermitente, solo al esfuerzo*).
* **Otro:** Detalles adicionales sobre los desencadenantes del dolor.

### C. Parámetros de Evaluación Fisioterapéutica (Exploración Objetiva)
* **Signos:** Hallazgos visuales o palpables inmediatos (ej. *No signos inflamatorios, cepilleo positivo en rótula*).
* **Evaluación de Movilidad:** Restricciones de rangos de movimiento (ROM) o hiperlaxitudes encontradas (ej. *Falta movilidad lumbar, falta de extensión y rotación dorsal*). Tabla de titulo: Rango de Movimiento, dividido en 2, 1: Nombre del movimiento, 2: Rango de Movimiento
* **Evaluación Muscular:** Hallazgos en el tejido blando (ej. *Acortamiento de cadena posterior, contracturas glúteas, gemelos, banda e hipoactividad de psoas*).
* **Evaluación Funcional y Pruebas Especiales:** Resultados de pruebas ortopédicas específicas o de movimiento dinámico.
    * *Tabla de Pruebas:* Nombre de la prueba y resultado (ej. *Prueba: Trendelenburg / Positivo: Bilateral*).
    * *Análisis Dinámico:* Comportamiento en gestos como Sentadilla (Squat), Apoyo Unipodal, Salto (Squat Jump) o FMS (Functional Movement Screen).
* **Sensibilidad / Palpación:** Localización exacta de puntos de dolor (ej. *Punto gatillo poplíteo, dolor en trocánter derecho*).

### D. Diagnóstico, Objetivos y Tratamiento
* **Diagnóstico Clínico / Fisioterapéutico:** Conclusión del estado kinésico del paciente (ej. *Síndrome cruzado superior, Tendinitis de glúteo medio*).
* **Objetivos del Tratamiento:** Metas a conseguir con la terapia (ej. *Disminuir dolor, mejorar estabilidad lumbopélvica, controlar edema*).
* **Plan de Tratamiento (Camilla):** Agentes físicos y terapia manual en box (ej. *TECA/Tecar, TENS, electroterapia, ventosas, liberación por cadenas, movilización de rótula*).
* **Plan de Tratamiento (Gym):** Ejercicio terapéutico programado (ej. *Flexibilidad de cadena posterior, fuerza progresiva de miembros inferiores, estabilidad unipodal*).
* **Frecuencia del Tratamiento:** Regularidad sugerida (ej. *Diario, Interdiario, 2 veces por semana*).
* *El tratamiento se crea en base a la frecuencia y el plan y se puede agendar automaticamente en fechas para sus sesiones*
---

## 3. Re-valoración (Control de Evolución / Mensual)
Formato abreviado de seguimiento periódico (habitualmente cada 10 a 12 sesiones o mensualmente). Su función principal es netamente **comparativa**.

### A. Control de Avance
* **Motivo de Consulta:** Especificación del control (ej. *Control mensual, re-valoración de alta parcial*).
* **Padecimiento Actual (Historial):** Recordatorio de la base de la que se parte (ej. *Post QX LCA anterior y sutura meniscal derecha el 03/04/2025*).
* **Valoración (Progreso Subjetivo del Paciente):** Impresión del paciente respecto a su mejora (ej. *Se siente mejor, más estable. Refiere que se ha activado un pequeño dolor en cara anterior EVA 2 que se pasa rápido*).

### B. Re-evaluación Física Enfocada
* **Evaluación de Movilidad y Funcional Actualizada:** Se listan únicamente los déficits que estaban alterados en la valoración inicial para comprobar su evolución (ej. *Falta flex posterior [Mejorado], Trote [Falta control de cadera], Apoyo unipodal [Estable]*). Se re-evalúa el nivel de la escala EVA.
* *Tabla de titulo: Rango de Movimiento, dividido en 2, 1: Nombre del movimiento, 2: Rango de Movimiento*

### C. Re-ajuste de Metas y Programación
* **Objetivos del Tratamiento (Modificados):** Transición de objetivos analíticos a funcionales (ej. *Mejorar patrón de trote, amortiguación y frenos*).
* **Plan de Tratamiento Actualizado (Camilla & Gym):** Modificación de las técnicas en base a la tolerancia actual, disminuyendo progresivamente la camilla y aumentando la carga y complejidad en gimnasio (ej. *Se añade trabajo excéntrico de cuádriceps, saltos y gestos deportivos*).
* **Frecuencia del Tratamiento:** Ratificación o reducción de la cantidad de visitas semanales según la evolución.