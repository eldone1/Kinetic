import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardAdmin, DashboardDoctor, DashboardRecepcion } from '../../features/dashboard/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = '/api/dashboard';

  constructor(private http: HttpClient) {}

  obtenerAdmin(): Observable<DashboardAdmin> {
    return this.http.get<DashboardAdmin>(`${this.api}/admin`);
  }

  obtenerDoctor(): Observable<DashboardDoctor> {
    return this.http.get<DashboardDoctor>(`${this.api}/doctor`);
  }

  obtenerRecepcion(): Observable<DashboardRecepcion> {
    return this.http.get<DashboardRecepcion>(`${this.api}/recepcion`);
  }
}
