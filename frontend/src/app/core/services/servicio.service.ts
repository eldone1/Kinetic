import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../../models/servicio.model';

@Injectable({ providedIn: 'root' })
export class ServicioService {

  private readonly API_URL = '/api/servicios';

  constructor(private http: HttpClient) {}

  listarActivos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.API_URL}/activos`);
  }
}
