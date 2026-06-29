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
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

      <!-- Animated decorative elements -->
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl animate-float" style="animation-delay: 1.5s"></div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()"
        class="glass-login rounded-2xl p-6 sm:p-8 w-full max-w-md relative animate-scale-in z-10">
        <div class="text-center mb-6 sm:mb-8">
          <img src="assets/images/ologo.png" alt="Kinetic Rehab" class="h-14 sm:h-16 mx-auto mb-3 sm:mb-4 animate-float" />
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 font-heading">Kinetic Rehab</h1>
          <p class="text-gray-500 mt-1 text-sm">Centro de Rehabilitaci&oacute;n</p>
        </div>

        <div class="mb-4 sm:mb-5">
          <label for="username" class="block text-sm font-medium text-gray-600 mb-1.5">Usuario</label>
          <div class="relative">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              id="username"
              type="text"
              formControlName="username"
              placeholder="Ingrese su usuario"
              class="input-field-icon"
              [class.input-field-error]="isFieldInvalid('username')"
            />
          </div>
          <span class="text-xs text-red-500 mt-1.5 block font-medium animate-slide-up" *ngIf="isFieldInvalid('username')">
            El usuario es obligatorio
          </span>
        </div>

        <div class="mb-5 sm:mb-6">
          <label for="password" class="block text-sm font-medium text-gray-600 mb-1.5">Contraseña</label>
          <div class="relative">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Ingrese su contraseña"
              class="input-field-icon"
              [class.input-field-error]="isFieldInvalid('password')"
            />
          </div>
          <span class="text-xs text-red-500 mt-1.5 block font-medium animate-slide-up" *ngIf="isFieldInvalid('password')">
            La contraseña es obligatoria
          </span>
        </div>

        <button type="submit" [disabled]="loginForm.invalid || loading"
          class="btn-primary w-full py-3 text-sm">
          <span *ngIf="loading" class="inline-block animate-spin mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>

        <p class="text-center text-sm text-red-500 mt-4 font-medium animate-slide-up" *ngIf="errorMessage">{{ errorMessage }}</p>
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
