import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
        localStorage.setItem('user_role', res.usuario.rol);
        localStorage.setItem('user_name', res.usuario.nombre);
      }));
  }

  refreshToken(): Observable<LoginResponse> {
    const refresh = localStorage.getItem(this.REFRESH_KEY);
    return this.http.post<LoginResponse>(`${this.API_URL}/refresh`, {},
      { headers: { Authorization: `Bearer ${refresh}` } }
    ).pipe(tap(res => {
      localStorage.setItem(this.TOKEN_KEY, res.token);
      localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
    }));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }
}
