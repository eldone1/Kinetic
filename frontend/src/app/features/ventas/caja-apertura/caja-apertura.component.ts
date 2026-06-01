import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CajaService } from '../../../core/services/caja.service';

@Component({
  selector: 'app-caja-apertura',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 animate-fade-in max-w-lg mx-auto">
      <div class="flex items-center gap-3 mb-6">
        <a routerLink="/ventas" class="btn-ghost px-2 py-1">&larr; Volver</a>
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-heading">Aperturar Caja</h2>
          <p class="text-gray-500 text-sm mt-0.5">Registra la apertura de caja para iniciar cobros</p>
        </div>
      </div>

      <div class="glass-card-strong rounded-2xl p-6">
        <form [formGroup]="form" (ngSubmit)="aperturar()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Monto Inicial (S/)</label>
            <input type="number" formControlName="montoInicial" step="0.01" min="0" autofocus
              class="input-field text-lg font-mono"
              [class.input-field-error]="form.get('montoInicial')?.invalid && form.get('montoInicial')?.touched" />
            <p class="text-xs text-red-500 mt-1" *ngIf="form.get('montoInicial')?.invalid && form.get('montoInicial')?.touched">
              Ingresa un monto válido
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Observaciones (opcional)</label>
            <textarea formControlName="observaciones" rows="3"
              class="input-field" placeholder="Notas adicionales..."></textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" [disabled]="form.invalid || loading"
              class="btn-primary flex-1">
              <span *ngIf="!loading">Aperturar Caja</span>
              <span *ngIf="loading">Aperturando...</span>
            </button>
            <button type="button" routerLink="/ventas" class="btn-secondary">
              Cancelar
            </button>
          </div>

          <div *ngIf="error" class="p-3 bg-red-50 text-red-700 rounded-xl text-sm">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  `
})
export class CajaAperturaComponent {
  form;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private cajaService: CajaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      montoInicial: [0, [Validators.required, Validators.min(0)]],
      observaciones: ['']
    });
  }

  aperturar(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const dto = {
      montoInicial: this.form.value.montoInicial!,
      observaciones: this.form.value.observaciones || undefined
    };
    this.cajaService.aperturar(dto).subscribe({
      next: () => {
        this.router.navigate(['/ventas/cobro']);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al aperturar caja';
        this.loading = false;
      }
    });
  }
}
