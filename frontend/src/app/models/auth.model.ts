import { Usuario } from './usuario.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  usuario: Usuario;
}
