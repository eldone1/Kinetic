import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio, ServicioRequest } from '../../models/servicio.model';

@Injectable({ providedIn: 'root' })
export class ServicioService {

  private readonly API_URL = '/api/servicios';

  constructor(private http: HttpClient) {}

  listarActivos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.API_URL}/activos`);
  }

  listarTodos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.API_URL);
  }

  obtenerPorId(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.API_URL}/${id}`);
  }

  crear(dto: ServicioRequest): Observable<Servicio> {
    return this.http.post<Servicio>(this.API_URL, dto);
  }

  actualizar(id: number, dto: ServicioRequest): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.API_URL}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
