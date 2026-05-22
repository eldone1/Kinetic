import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cambio-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
          <input type="password" formControlName="passwordActual"
            class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
          <input type="password" formControlName="passwordNuevo"
            class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <button type="submit" [disabled]="form.invalid || loading"
          class="w-full py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
          Cambiar contraseña
        </button>
        <p *ngIf="mensaje" class="mt-4 text-sm font-medium text-center"
           [class.text-green-600]="exito" [class.text-red-600]="!exito">{{ mensaje }}</p>
      </form>
    </div>
  `
})
export class CambioPasswordComponent {
  form: FormGroup;
  loading = false;
  mensaje = '';
  exito = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      passwordActual: ['', Validators.required],
      passwordNuevo: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.mensaje = '';

    this.authService.refreshToken().subscribe({
      next: () => {
        this.usuarioService.cambiarPassword(0, this.form.value).subscribe({
          next: () => {
            this.mensaje = 'Contraseña actualizada exitosamente';
            this.exito = true;
            this.loading = false;
            this.form.reset();
          },
          error: () => {
            this.mensaje = 'Error al cambiar la contraseña';
            this.exito = false;
            this.loading = false;
          }
        });
      },
      error: () => {
        this.mensaje = 'Error al cambiar la contraseña';
        this.exito = false;
        this.loading = false;
      }
    });
  }
}
