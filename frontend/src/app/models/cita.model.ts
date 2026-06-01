export interface Cita {
  id: number;
  idPaciente: number;
  nombrePaciente: string;
  documentoPaciente: string;
  idDoctor: number;
  nombreDoctor: string;
  especialidadDoctor: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: string;
  estado: string;
  observaciones: string;
  precio: number | null;
  createdAt: string;
}

export interface CitaRequest {
  idPaciente: number;
  idDoctor: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: string;
  observaciones?: string;
  precio?: number | null;
}

export interface CitaEstadoRequest {
  estado: string;
}
