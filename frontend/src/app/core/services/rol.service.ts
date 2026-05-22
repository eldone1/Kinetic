import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../../models/rol.model';

@Injectable({ providedIn: 'root' })
export class RolService {

  private readonly API_URL = '/api/roles';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.API_URL);
  }
}
