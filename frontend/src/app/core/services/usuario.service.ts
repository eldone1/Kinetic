import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, UsuarioRequest } from '../../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly API_URL = '/api/usuarios';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`);
  }

  crear(dto: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_URL, dto);
  }

  actualizar(id: number, dto: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, dto);
  }

  cambiarEstado(id: number, activo: boolean): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/estado`, null, { params: { activo } });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  buscarPorUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/me`);
  }

  cambiarPassword(id: number, dto: { passwordActual: string; passwordNuevo: string }): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/me/password`, dto);
  }
}
