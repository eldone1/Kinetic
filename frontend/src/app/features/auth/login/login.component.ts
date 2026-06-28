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
    <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style="background-image: url('assets/images/referencia-login.png'); background-size: cover; background-position: center;">
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()"
        class="glass-login rounded-2xl p-8 w-full max-w-md relative animate-fade-in">
        <div class="text-center mb-8">
          <img src="assets/images/ologo.png" alt="Kinetic Rehab" class="h-16 mx-auto mb-4" />
          <h1 class="text-3xl font-bold text-gray-800 font-heading">Kinetic Rehab</h1>
          <p class="text-gray-500 mt-1 text-sm">Centro de Rehabilitación</p>
        </div>

        <div class="mb-5">
          <label for="username" class="block text-sm font-medium text-gray-600 mb-1.5">Usuario</label>
          <input
            id="username"
            type="text"
            formControlName="username"
            placeholder="Ingrese su usuario"
            class="input-field"
            [class.input-field-error]="isFieldInvalid('username')"
          />
          <span class="text-xs text-red-500 mt-1.5 block font-medium" *ngIf="isFieldInvalid('username')">
            El usuario es obligatorio
          </span>
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-600 mb-1.5">Contraseña</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="Ingrese su contraseña"
            class="input-field"
            [class.input-field-error]="isFieldInvalid('password')"
          />
          <span class="text-xs text-red-500 mt-1.5 block font-medium" *ngIf="isFieldInvalid('password')">
            La contraseña es obligatoria
          </span>
        </div>

        <button type="submit" [disabled]="loginForm.invalid || loading"
          class="btn-primary w-full py-3 text-sm">
          <span *ngIf="loading" class="inline-block animate-spin mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>

        <p class="text-center text-sm text-red-500 mt-4 font-medium" *ngIf="errorMessage">{{ errorMessage }}</p>
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
