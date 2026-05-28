import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor, DoctorRequest, DoctorEstadoRequest, DoctorHorarios, Horario, HorarioRequest } from '../../models/doctor.model';

@Injectable({ providedIn: 'root' })
export class DoctorService {

  private readonly API_URL = '/api/doctores';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.API_URL}/${id}`);
  }

  buscar(termino: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.API_URL}/buscar`, { params: new HttpParams().set('q', termino) });
  }

  listarDisponibles(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.API_URL}/disponibles`);
  }

  obtenerMiPerfil(): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.API_URL}/yo`);
  }

  crear(dto: DoctorRequest): Observable<Doctor> {
    return this.http.post<Doctor>(this.API_URL, dto);
  }

  actualizar(id: number, dto: DoctorRequest): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.API_URL}/${id}`, dto);
  }

  cambiarEstado(id: number, dto: DoctorEstadoRequest): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/estado`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  obtenerHorarios(id: number): Observable<DoctorHorarios> {
    return this.http.get<DoctorHorarios>(`${this.API_URL}/${id}/horarios`);
  }

  actualizarHorarios(id: number, horarios: HorarioRequest[]): Observable<Horario[]> {
    return this.http.put<Horario[]>(`${this.API_URL}/${id}/horarios`, horarios);
  }
}
