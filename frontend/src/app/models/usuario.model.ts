export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  rol: string;
  activo: boolean;
  createdAt: string;
}

export interface UsuarioRequest {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  idRol: number;
}

export interface CambioPasswordRequest {
  passwordActual: string;
  passwordNuevo: string;
}
