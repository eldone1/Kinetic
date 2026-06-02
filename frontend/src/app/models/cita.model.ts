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
  estado: string;
  observaciones: string;
  idServicio: number | null;
  nombreServicio: string | null;
  precio: number | null;
  createdAt: string;
}

export interface CitaRequest {
  idPaciente: number;
  idDoctor: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  observaciones?: string;
  idServicio: number;
}

export interface CitaEstadoRequest {
  estado: string;
}
