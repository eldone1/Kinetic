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
    <div class="p-6 animate-fade-in">
      <div class="max-w-lg mx-auto glass-card-strong rounded-2xl p-8">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            &#128273;
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800 font-heading">Cambiar Contraseña</h2>
            <p class="text-gray-400 text-sm">Actualiza tu contraseña de acceso</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Contraseña actual</label>
            <input type="password" formControlName="passwordActual" placeholder="Ingrese su contraseña actual"
              class="input-field" />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Nueva contraseña</label>
            <input type="password" formControlName="passwordNuevo" placeholder="Mín. 6 caracteres"
              class="input-field" />
          </div>
          <button type="submit" [disabled]="form.invalid || loading"
            class="btn-primary w-full py-3">
            <span *ngIf="loading" class="inline-block mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ loading ? 'Cambiando...' : 'Cambiar contraseña' }}
          </button>
          <p *ngIf="mensaje" class="mt-4 text-sm font-medium text-center animate-fade-in"
             [class.text-green-600]="exito" [class.text-red-600]="!exito">{{ mensaje }}</p>
        </form>
      </div>
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
