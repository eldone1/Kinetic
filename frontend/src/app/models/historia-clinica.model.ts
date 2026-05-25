export interface HistoriaClinica {
  id: number;
  idPaciente: number;
  nombrePaciente: string;
  documentoPaciente: string;
  fechaApertura: string;
  doctorAsignado?: string;
  especialidad: string;
  procedencia?: string;
  categoria: string;
  motivoConsulta?: string;
  tabaquismo?: string;
  alcoholismo?: string;
  medicamentos?: string;
  deporteActividadFisica?: string;
  enfermedadesActuales?: string;
  enfermedadesPasadas?: string;
  alergias?: string;
  cirugias?: string;
  antecHeredoFamiliares?: string;
  antecHeredoEspecificaciones?: string;
  peso?: number;
  talla?: number;
  paPresionArterial?: string;
  imc?: number;
  createdAt: string;
  updatedAt: string;
}

export interface HistoriaClinicaRequest {
  idPaciente: number;
  fechaApertura: string;
  doctorAsignado?: string;
  especialidad?: string;
  procedencia?: string;
  categoria?: string;
  motivoConsulta?: string;
  tabaquismo?: string;
  alcoholismo?: string;
  medicamentos?: string;
  deporteActividadFisica?: string;
  enfermedadesActuales?: string;
  enfermedadesPasadas?: string;
  alergias?: string;
  cirugias?: string;
  antecHeredoFamiliares?: string;
  antecHeredoEspecificaciones?: string;
  peso?: number;
  talla?: number;
  paPresionArterial?: string;
  imc?: number;
}

export interface Evaluacion {
  id: number;
  idHistoriaClinica: number;
  idDoctor: number;
  nombreDoctor: string;
  fecha: string;
  tipo: string;
  padecimientoActual?: string;
  valoracionSubjetiva?: string;
  evaPuntuacion?: number;
  borgPuntuacion?: number;
  danielsPuntuacion?: number;
  dolorIntensidad?: string;
  dolorFrecuencia?: string;
  dolorOtro?: string;
  signos?: string;
  evaluacionMovilidad?: string;
  evaluacionMuscular?: string;
  evaluacionFuncional?: string;
  sensibilidadPalpacion?: string;
  diagnosticoClinico?: string;
  objetivosTratamiento?: string;
  planCamilla?: string;
  planGym?: string;
  frecuenciaTratamiento?: string;
  cie10?: string;
  motivoControl?: string;
  padecimientoActualHistorial?: string;
  valoracionProgreso?: string;
  evaluacionMovilidadActualizada?: string;
  objetivosModificados?: string;
  planCamillaActualizado?: string;
  planGymActualizado?: string;
  frecuenciaActualizada?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluacionRequest {
  idHistoriaClinica: number;
  idDoctor: number;
  fecha: string;
  tipo: string;
  padecimientoActual?: string;
  valoracionSubjetiva?: string;
  evaPuntuacion?: number;
  borgPuntuacion?: number;
  danielsPuntuacion?: number;
  dolorIntensidad?: string;
  dolorFrecuencia?: string;
  dolorOtro?: string;
  signos?: string;
  evaluacionMovilidad?: string;
  evaluacionMuscular?: string;
  evaluacionFuncional?: string;
  sensibilidadPalpacion?: string;
  diagnosticoClinico?: string;
  objetivosTratamiento?: string;
  planCamilla?: string;
  planGym?: string;
  frecuenciaTratamiento?: string;
  cie10?: string;
  motivoControl?: string;
  padecimientoActualHistorial?: string;
  valoracionProgreso?: string;
  evaluacionMovilidadActualizada?: string;
  objetivosModificados?: string;
  planCamillaActualizado?: string;
  planGymActualizado?: string;
  frecuenciaActualizada?: string;
}

export interface Tratamiento {
  id: number;
  idHistoriaClinica: number;
  idEvaluacion?: number;
  idDoctor: number;
  nombreDoctor: string;
  nombre: string;
  descripcion?: string;
  objetivo?: string;
  frecuencia?: string;
  duracionSemanas?: number;
  planCamilla?: string;
  planGym?: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
}

export interface TratamientoRequest {
  idHistoriaClinica: number;
  idEvaluacion?: number;
  idDoctor: number;
  nombre: string;
  descripcion?: string;
  objetivo?: string;
  frecuencia?: string;
  duracionSemanas?: number;
  planCamilla?: string;
  planGym?: string;
  fechaInicio: string;
  fechaFin?: string;
  estado?: string;
}

export interface TratamientoEstadoRequest {
  estado: string;
}

export interface Sesion {
  id: number;
  idTratamiento: number;
  nombreTratamiento: string;
  idCita?: number;
  numeroSesion: number;
  fecha: string;
  hora?: string;
  evaluacionSubjetiva?: string;
  evaluacionObjetiva?: string;
  tratamientoRealizado?: string;
  indicaciones?: string;
  proximaSesionPlan?: string;
  asistio?: boolean;
  estado: string;
  createdAt: string;
  updatedAt: string;
}

export interface SesionRequest {
  idTratamiento: number;
  idCita?: number;
  numeroSesion: number;
  fecha: string;
  hora?: string;
  evaluacionSubjetiva?: string;
  evaluacionObjetiva?: string;
  tratamientoRealizado?: string;
  indicaciones?: string;
  proximaSesionPlan?: string;
  asistio?: boolean;
  estado?: string;
}

export interface SesionEstadoRequest {
  estado: string;
  asistio?: boolean;
}
