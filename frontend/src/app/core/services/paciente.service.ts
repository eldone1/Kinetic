import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente, PacienteRequest } from '../../models/paciente.model';

@Injectable({ providedIn: 'root' })
export class PacienteService {

  private readonly API_URL = '/api/pacientes';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.API_URL}/${id}`);
  }

  buscar(termino: string): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.API_URL}/buscar`, { params: new HttpParams().set('q', termino) });
  }

  crear(dto: PacienteRequest): Observable<Paciente> {
    return this.http.post<Paciente>(this.API_URL, dto);
  }

  actualizar(id: number, dto: PacienteRequest): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.API_URL}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
