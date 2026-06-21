import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReporteVentaPeriodo,
  ReporteIngresoServicio,
  ReporteAtencionDoctor,
  ReporteCierresCaja,
  ReportePacientes,
  ReporteOcupacion
} from '../../features/reportes/reportes.models';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private api = '/api/reportes';

  constructor(private http: HttpClient) {}

  ventasPeriodo(fechaInicio: string, fechaFin: string): Observable<ReporteVentaPeriodo[]> {
    return this.http.get<ReporteVentaPeriodo[]>(`${this.api}/ventas-periodo`, {
      params: { fechaInicio, fechaFin }
    });
  }

  downloadVentasPeriodo(fechaInicio: string, fechaFin: string, formato: 'pdf' | 'xlsx'): Observable<Blob> {
    return this.http.get(`${this.api}/ventas-periodo/${formato}`, {
      params: { fechaInicio, fechaFin },
      responseType: 'blob'
    });
  }

  ingresosServicio(fechaInicio: string, fechaFin: string): Observable<ReporteIngresoServicio[]> {
    return this.http.get<ReporteIngresoServicio[]>(`${this.api}/ingresos-servicio`, {
      params: { fechaInicio, fechaFin }
    });
  }

  downloadIngresosServicio(fechaInicio: string, fechaFin: string, formato: 'pdf' | 'xlsx'): Observable<Blob> {
    return this.http.get(`${this.api}/ingresos-servicio/${formato}`, {
      params: { fechaInicio, fechaFin },
      responseType: 'blob'
    });
  }

  atencionesDoctor(fechaInicio: string, fechaFin: string, idDoctor?: number): Observable<ReporteAtencionDoctor[]> {
    let params = new HttpParams().set('fechaInicio', fechaInicio).set('fechaFin', fechaFin);
    if (idDoctor) params = params.set('idDoctor', idDoctor);
    return this.http.get<ReporteAtencionDoctor[]>(`${this.api}/atenciones-doctor`, { params });
  }

  downloadAtencionesDoctor(fechaInicio: string, fechaFin: string, formato: 'pdf' | 'xlsx', idDoctor?: number): Observable<Blob> {
    let params = new HttpParams().set('fechaInicio', fechaInicio).set('fechaFin', fechaFin);
    if (idDoctor) params = params.set('idDoctor', idDoctor);
    return this.http.get(`${this.api}/atenciones-doctor/${formato}`, {
      params,
      responseType: 'blob'
    });
  }

  cierresCaja(fechaInicio: string, fechaFin: string): Observable<ReporteCierresCaja[]> {
    return this.http.get<ReporteCierresCaja[]>(`${this.api}/cierres-caja`, {
      params: { fechaInicio, fechaFin }
    });
  }

  pacientes(fechaInicio: string, fechaFin: string): Observable<ReportePacientes> {
    return this.http.get<ReportePacientes>(`${this.api}/pacientes`, {
      params: { fechaInicio, fechaFin }
    });
  }

  downloadPacientes(fechaInicio: string, fechaFin: string, formato: 'pdf' | 'xlsx'): Observable<Blob> {
    return this.http.get(`${this.api}/pacientes/${formato}`, {
      params: { fechaInicio, fechaFin },
      responseType: 'blob'
    });
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
