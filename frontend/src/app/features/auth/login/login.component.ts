import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary-600 font-heading">Kinetic Rehab</h1>
          <p class="text-gray-500 mt-1">Centro de Rehabilitación</p>
        </div>

        <div class="mb-5">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1.5">Usuario</label>
          <input
            id="username"
            type="text"
            formControlName="username"
            placeholder="Ingrese su usuario"
            class="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            [class.border-red-400]="isFieldInvalid('username')"
          />
          <span class="text-xs text-red-500 mt-1 block" *ngIf="isFieldInvalid('username')">
            El usuario es obligatorio
          </span>
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="Ingrese su contraseña"
            class="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            [class.border-red-400]="isFieldInvalid('password')"
          />
          <span class="text-xs text-red-500 mt-1 block" *ngIf="isFieldInvalid('password')">
            La contraseña es obligatoria
          </span>
        </div>

        <button type="submit" [disabled]="loginForm.invalid || loading"
          class="w-full py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <span *ngIf="loading" class="inline-block animate-spin mr-2">&#9696;</span>
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>

        <p class="text-center text-sm text-red-500 mt-4" *ngIf="errorMessage">{{ errorMessage }}</p>
      </form>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/usuarios']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.mensaje || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }
}
