import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CajaResponse, CajaAperturaRequest, CajaCierreRequest } from '../../models/caja.model';
import { VentaResponse } from '../../models/venta.model';

@Injectable({ providedIn: 'root' })
export class CajaService {

  private readonly API_URL = '/api/caja';

  constructor(private http: HttpClient) {}

  aperturar(dto: CajaAperturaRequest): Observable<CajaResponse> {
    return this.http.post<CajaResponse>(`${this.API_URL}/aperturar`, dto);
  }

  cerrar(id: number, dto: CajaCierreRequest): Observable<CajaResponse> {
    return this.http.post<CajaResponse>(`${this.API_URL}/${id}/cerrar`, dto);
  }

  obtenerActiva(): Observable<CajaResponse | null> {
    return this.http.get<CajaResponse | null>(`${this.API_URL}/activa`);
  }

  listarMias(): Observable<CajaResponse[]> {
    return this.http.get<CajaResponse[]>(`${this.API_URL}/mias`);
  }

  listarTodas(): Observable<CajaResponse[]> {
    return this.http.get<CajaResponse[]>(this.API_URL);
  }

  obtenerPorId(id: number): Observable<CajaResponse> {
    return this.http.get<CajaResponse>(`${this.API_URL}/${id}`);
  }

  obtenerVentas(id: number): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(`${this.API_URL}/${id}/ventas`);
  }
}
