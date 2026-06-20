export interface Doctor {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  especialidad: string;
  cmp: string;
  telefono: string;
  correo: string;
  activo: boolean;
  createdAt: string;
}

export interface DoctorRequest {
  nombres: string;
  apellidos: string;
  dni: string;
  especialidad?: string;
  cmp?: string;
  telefono?: string;
  correo?: string;
}

export interface DoctorEstadoRequest {
  activo: boolean;
}

export interface Horario {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

export interface HorarioRequest {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

export interface DoctorHorarios {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  especialidad: string;
  cmp: string;
  telefono: string;
  correo: string;
  activo: boolean;
  horarios: Horario[];
}
