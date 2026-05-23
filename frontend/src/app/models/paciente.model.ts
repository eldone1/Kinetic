export interface Paciente {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string | null;
  sexo: string | null;
  telefono: string;
  correo: string;
  direccion: string;
  ocupacion: string;
  contactoEmergencia: string;
  observaciones: string;
  createdAt: string;
}

export interface PacienteRequest {
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string | null;
  sexo: string | null;
  telefono?: string;
  correo?: string;
  direccion?: string;
  ocupacion?: string;
  contactoEmergencia?: string;
  observaciones?: string;
}
