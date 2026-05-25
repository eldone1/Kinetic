import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  HistoriaClinica, HistoriaClinicaRequest,
  Evaluacion, EvaluacionRequest,
  Tratamiento, TratamientoRequest, TratamientoEstadoRequest,
  Sesion, SesionRequest, SesionEstadoRequest
} from '../../models/historia-clinica.model';

@Injectable({ providedIn: 'root' })
export class HistoriaClinicaService {

  private readonly HC_URL = '/api/historias-clinicas';
  private readonly EVAL_URL = '/api/evaluaciones';
  private readonly TRAT_URL = '/api/tratamientos';
  private readonly SES_URL = '/api/sesiones';

  constructor(private http: HttpClient) {}

  // ==================== HISTORIAS CLÍNICAS ====================

  listarTodas(): Observable<HistoriaClinica[]> {
    return this.http.get<HistoriaClinica[]>(this.HC_URL);
  }

  buscarPorId(id: number): Observable<HistoriaClinica> {
    return this.http.get<HistoriaClinica>(`${this.HC_URL}/${id}`);
  }

  buscarPorPaciente(pacienteId: number): Observable<HistoriaClinica> {
    return this.http.get<HistoriaClinica>(`${this.HC_URL}/paciente/${pacienteId}`);
  }

  existePorPaciente(pacienteId: number): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(`${this.HC_URL}/paciente/${pacienteId}/existe`);
  }

  crear(dto: HistoriaClinicaRequest): Observable<HistoriaClinica> {
    return this.http.post<HistoriaClinica>(this.HC_URL, dto);
  }

  actualizar(id: number, dto: HistoriaClinicaRequest): Observable<HistoriaClinica> {
    return this.http.put<HistoriaClinica>(`${this.HC_URL}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.HC_URL}/${id}`);
  }

  // ==================== EVALUACIONES ====================

  listarEvaluaciones(historiaClinicaId: number): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(this.EVAL_URL, {
      params: new HttpParams().set('historiaClinicaId', historiaClinicaId)
    });
  }

  buscarEvaluacion(id: number): Observable<Evaluacion> {
    return this.http.get<Evaluacion>(`${this.EVAL_URL}/${id}`);
  }

  crearEvaluacion(dto: EvaluacionRequest): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(this.EVAL_URL, dto);
  }

  actualizarEvaluacion(id: number, dto: EvaluacionRequest): Observable<Evaluacion> {
    return this.http.put<Evaluacion>(`${this.EVAL_URL}/${id}`, dto);
  }

  eliminarEvaluacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.EVAL_URL}/${id}`);
  }

  // ==================== TRATAMIENTOS ====================

  listarTratamientos(historiaClinicaId: number): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(this.TRAT_URL, {
      params: new HttpParams().set('historiaClinicaId', historiaClinicaId)
    });
  }

  buscarTratamiento(id: number): Observable<Tratamiento> {
    return this.http.get<Tratamiento>(`${this.TRAT_URL}/${id}`);
  }

  crearTratamiento(dto: TratamientoRequest): Observable<Tratamiento> {
    return this.http.post<Tratamiento>(this.TRAT_URL, dto);
  }

  actualizarTratamiento(id: number, dto: TratamientoRequest): Observable<Tratamiento> {
    return this.http.put<Tratamiento>(`${this.TRAT_URL}/${id}`, dto);
  }

  cambiarEstadoTratamiento(id: number, dto: TratamientoEstadoRequest): Observable<void> {
    return this.http.patch<void>(`${this.TRAT_URL}/${id}/estado`, dto);
  }

  eliminarTratamiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.TRAT_URL}/${id}`);
  }

  // ==================== SESIONES ====================

  listarSesiones(tratamientoId: number): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(this.SES_URL, {
      params: new HttpParams().set('tratamientoId', tratamientoId)
    });
  }

  buscarSesion(id: number): Observable<Sesion> {
    return this.http.get<Sesion>(`${this.SES_URL}/${id}`);
  }

  crearSesion(dto: SesionRequest): Observable<Sesion> {
    return this.http.post<Sesion>(this.SES_URL, dto);
  }

  actualizarSesion(id: number, dto: SesionRequest): Observable<Sesion> {
    return this.http.put<Sesion>(`${this.SES_URL}/${id}`, dto);
  }

  cambiarEstadoSesion(id: number, dto: SesionEstadoRequest): Observable<void> {
    return this.http.patch<void>(`${this.SES_URL}/${id}/estado`, dto);
  }

  eliminarSesion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.SES_URL}/${id}`);
  }
}
