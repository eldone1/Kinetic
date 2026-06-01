import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CajaService } from '../../../core/services/caja.service';
import { CajaResponse } from '../../../models/caja.model';

@Component({
  selector: 'app-cierre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 animate-fade-in max-w-lg mx-auto">
      <div class="flex items-center gap-3 mb-6">
        <a routerLink="/ventas/cobro" class="btn-ghost px-2 py-1">&larr; Volver</a>
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-heading">Cerrar Caja</h2>
          <p class="text-gray-500 text-sm mt-0.5">Registra el cierre de caja con los montos finales</p>
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-8 text-gray-400">Cargando...</div>

      <ng-container *ngIf="!loading && caja">
        <div class="glass-card-strong rounded-2xl p-5 mb-5">
          <div class="grid grid-cols-2 gap-4 text-center">
            <div>
              <p class="text-xs text-gray-400">Caja #</p>
              <p class="text-lg font-bold text-gray-800">{{ caja.id }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Estado</p>
              <span class="badge bg-emerald-50 text-emerald-700">ABIERTO</span>
            </div>
            <div>
              <p class="text-xs text-gray-400">Apertura</p>
              <p class="text-sm font-medium text-gray-700">{{ caja.fechaApertura | date:'dd/MM/yy HH:mm' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Ventas realizadas</p>
              <p class="text-lg font-bold text-gray-800">{{ caja.cantidadVentas || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="glass-card-strong rounded-2xl p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Montos Finales</h3>

          <form [formGroup]="form" (ngSubmit)="cerrar()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Total en Efectivo (S/)</label>
              <input type="number" formControlName="montoFinalEfectivo" step="0.01" min="0" autofocus
                class="input-field text-lg font-mono"
                [class.input-field-error]="f.montoFinalEfectivo.invalid && f.montoFinalEfectivo.touched" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Total en Yape/Plin (S/)</label>
              <input type="number" formControlName="montoFinalYapePlin" step="0.01" min="0"
                class="input-field text-lg font-mono"
                [class.input-field-error]="f.montoFinalYapePlin.invalid && f.montoFinalYapePlin.touched" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Observaciones (opcional)</label>
              <textarea formControlName="observaciones" rows="2"
                class="input-field" placeholder="Notas adicionales..."></textarea>
            </div>

            <div class="p-4 bg-amber-50 rounded-xl">
              <p class="text-xs text-amber-700 font-medium">Al cerrar la caja no podrás registrar más cobros hasta aperturar una nueva.</p>
            </div>

            <button type="submit" [disabled]="form.invalid || cerrando"
              class="btn-primary w-full py-3 text-base">
              <span *ngIf="!cerrando">Cerrar Caja</span>
              <span *ngIf="cerrando">Cerrando...</span>
            </button>

            <div *ngIf="mensajeExito" class="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm text-center">
              {{ mensajeExito }}
            </div>
            <div *ngIf="error" class="p-3 bg-red-50 text-red-700 rounded-xl text-sm">
              {{ error }}
            </div>
          </form>
        </div>
      </ng-container>
    </div>
  `
})
export class CierreComponent implements OnInit {
  caja: CajaResponse | null = null;
  loading = true;
  cerrando = false;
  mensajeExito = '';
  error = '';
  form;

  constructor(
    private fb: FormBuilder,
    private cajaService: CajaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      montoFinalEfectivo: [0, [Validators.required, Validators.min(0)]],
      montoFinalYapePlin: [0, [Validators.required, Validators.min(0)]],
      observaciones: ['']
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cajaService.obtenerPorId(id).subscribe({
      next: (caja) => {
        this.caja = caja;
        this.loading = false;
      },
      error: () => {
        this.error = 'Caja no encontrada';
        this.loading = false;
      }
    });
  }

  cerrar(): void {
    if (this.form.invalid || !this.caja) return;
    this.cerrando = true;
    this.error = '';

      const dto = {
        montoFinalEfectivo: this.form.value.montoFinalEfectivo!,
        montoFinalYapePlin: this.form.value.montoFinalYapePlin!,
        observaciones: this.form.value.observaciones || undefined
      };
      this.cajaService.cerrar(this.caja.id, dto).subscribe({
      next: () => {
        this.mensajeExito = 'Caja cerrada exitosamente';
        this.cerrando = false;
        setTimeout(() => this.router.navigate(['/ventas']), 2000);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cerrar caja';
        this.cerrando = false;
      }
    });
  }
}
