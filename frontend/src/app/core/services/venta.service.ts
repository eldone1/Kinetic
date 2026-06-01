import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VentaResponse, VentaRequest } from '../../models/venta.model';

@Injectable({ providedIn: 'root' })
export class VentaService {

  private readonly API_URL = '/api/ventas';

  constructor(private http: HttpClient) {}

  registrar(dto: VentaRequest): Observable<VentaResponse> {
    return this.http.post<VentaResponse>(this.API_URL, dto);
  }

  obtenerPorId(id: number): Observable<VentaResponse> {
    return this.http.get<VentaResponse>(`${this.API_URL}/${id}`);
  }

  listarPorPaciente(pacienteId: number): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(`${this.API_URL}/paciente/${pacienteId}`);
  }

  obtenerPorCita(citaId: number): Observable<VentaResponse | null> {
    return this.http.get<VentaResponse | null>(`${this.API_URL}/cita/${citaId}`);
  }
}
