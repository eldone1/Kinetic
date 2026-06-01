import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita, CitaRequest, CitaEstadoRequest } from '../../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {

  private readonly API_URL = '/api/citas';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.API_URL}/${id}`);
  }

  listarPorDoctor(doctorId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.API_URL}/doctor/${doctorId}`);
  }

  listarPorPaciente(pacienteId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.API_URL}/paciente/${pacienteId}`);
  }

  listarPorFecha(fecha: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.API_URL}/por-fecha`, {
      params: new HttpParams().set('fecha', fecha)
    });
  }

  listarPorRangoFechas(fechaInicio: string, fechaFin: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.API_URL}/calendario`, {
      params: new HttpParams().set('fechaInicio', fechaInicio).set('fechaFin', fechaFin)
    });
  }

  crear(dto: CitaRequest): Observable<Cita> {
    return this.http.post<Cita>(this.API_URL, dto);
  }

  actualizar(id: number, dto: CitaRequest): Observable<Cita> {
    return this.http.put<Cita>(`${this.API_URL}/${id}`, dto);
  }

  cambiarEstado(id: number, dto: CitaEstadoRequest): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/estado`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  listarPendientesPago(pacienteId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.API_URL}/pendientes-pago/${pacienteId}`);
  }
}
