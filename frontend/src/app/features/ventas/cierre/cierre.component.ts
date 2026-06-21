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

      <ng-container *ngIf="!loading && caja && !resultadoCierre">
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

        <div class="glass-card-strong rounded-2xl p-5 mb-5" *ngIf="caja.esperadoEfectivo != null || caja.esperadoYapePlin != null">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Totales esperados según ventas registradas</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-400">Efectivo esperado</p>
              <p class="text-lg font-bold text-emerald-700 font-mono">S/ {{ (caja.esperadoEfectivo || 0) | number:'1.2-2' }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-400">Yape/Plin esperado</p>
              <p class="text-lg font-bold text-blue-700 font-mono">S/ {{ (caja.esperadoYapePlin || 0) | number:'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <div class="glass-card-strong rounded-2xl p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Declarar Montos Finales</h3>

          <form [formGroup]="form" (ngSubmit)="cerrar()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Total declarado en Efectivo (S/)
                <span *ngIf="caja.esperadoEfectivo != null" class="text-gray-400 font-normal">— esperado: S/ {{ caja.esperadoEfectivo | number:'1.2-2' }}</span>
              </label>
              <input type="number" formControlName="montoFinalEfectivo" step="0.01" min="0" autofocus
                class="input-field text-lg font-mono"
                [class.input-field-error]="f.montoFinalEfectivo.invalid && f.montoFinalEfectivo.touched" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Total declarado en Yape/Plin (S/)
                <span *ngIf="caja.esperadoYapePlin != null" class="text-gray-400 font-normal">— esperado: S/ {{ caja.esperadoYapePlin | number:'1.2-2' }}</span>
              </label>
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

            <div *ngIf="error" class="p-3 bg-red-50 text-red-700 rounded-xl text-sm">
              {{ error }}
            </div>
          </form>
        </div>
      </ng-container>

      <ng-container *ngIf="resultadoCierre">
        <div class="glass-card-strong rounded-2xl p-6 text-center">
          <div class="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl text-emerald-600">&#10003;</span>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-1">Caja Cerrada</h3>
          <p class="text-sm text-gray-500 mb-5">Caja #{{ resultadoCierre.id }} cerrada exitosamente</p>

          <div class="grid grid-cols-2 gap-3 mb-5">
            <div class="bg-gray-50 rounded-xl p-3">
              <p class="text-xs text-gray-400">Efectivo declarado</p>
              <p class="text-base font-bold text-gray-800 font-mono">S/ {{ resultadoCierre.montoFinalEfectivo | number:'1.2-2' }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-3">
              <p class="text-xs text-gray-400">Yape/Plin declarado</p>
              <p class="text-base font-bold text-gray-800 font-mono">S/ {{ resultadoCierre.montoFinalYapePlin | number:'1.2-2' }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-3">
              <p class="text-xs text-gray-400">Efectivo esperado</p>
              <p class="text-base font-bold text-gray-800 font-mono">S/ {{ (resultadoCierre.esperadoEfectivo || 0) | number:'1.2-2' }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-3">
              <p class="text-xs text-gray-400">Yape/Plin esperado</p>
              <p class="text-base font-bold text-gray-800 font-mono">S/ {{ (resultadoCierre.esperadoYapePlin || 0) | number:'1.2-2' }}</p>
            </div>
          </div>

          <div class="space-y-2 mb-5">
            <div class="flex justify-between items-center px-4 py-3 rounded-xl font-mono text-sm"
              [class.bg-emerald-50]="!tieneDiferenciaEfectivo"
              [class.bg-red-50]="tieneDiferenciaEfectivo">
              <span class="font-medium text-gray-700">Diferencia en efectivo</span>
              <span class="font-bold"
                [class.text-emerald-600]="!tieneDiferenciaEfectivo"
                [class.text-red-600]="tieneDiferenciaEfectivo">
                {{ diferenciaEfectivoTexto }}
              </span>
            </div>
            <div class="flex justify-between items-center px-4 py-3 rounded-xl font-mono text-sm"
              [class.bg-emerald-50]="!tieneDiferenciaYapePlin"
              [class.bg-red-50]="tieneDiferenciaYapePlin">
              <span class="font-medium text-gray-700">Diferencia en Yape/Plin</span>
              <span class="font-bold"
                [class.text-emerald-600]="!tieneDiferenciaYapePlin"
                [class.text-red-600]="tieneDiferenciaYapePlin">
                {{ diferenciaYapePlinTexto }}
              </span>
            </div>
          </div>

          <div *ngIf="tieneDiferenciaEfectivo || tieneDiferenciaYapePlin" class="p-3 bg-amber-50 rounded-xl text-xs text-amber-700 mb-5">
            Hay diferencias entre los montos declarados y los esperados. Verifica que los montos ingresados sean correctos.
          </div>

          <button (click)="volver()"
            class="btn-primary w-full py-3 text-base">
            Volver a Ventas
          </button>
        </div>
      </ng-container>
    </div>
  `
})
export class CierreComponent implements OnInit {
  caja: CajaResponse | null = null;
  resultadoCierre: CajaResponse | null = null;
  loading = true;
  cerrando = false;
  error = '';
  form;

  get tieneDiferenciaEfectivo(): boolean {
    return (this.resultadoCierre?.diferenciaEfectivo ?? 0) !== 0;
  }

  get tieneDiferenciaYapePlin(): boolean {
    return (this.resultadoCierre?.diferenciaYapePlin ?? 0) !== 0;
  }

  get diferenciaEfectivoTexto(): string {
    const dif = this.resultadoCierre?.diferenciaEfectivo ?? 0;
    const signo = dif >= 0 ? '+' : '';
    return `S/ ${signo}${dif.toFixed(2)}`;
  }

  get diferenciaYapePlinTexto(): string {
    const dif = this.resultadoCierre?.diferenciaYapePlin ?? 0;
    const signo = dif >= 0 ? '+' : '';
    return `S/ ${signo}${dif.toFixed(2)}`;
  }

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

  volver(): void {
    this.router.navigate(['/ventas']);
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
      next: (res) => {
        this.resultadoCierre = res;
        this.cerrando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cerrar caja';
        this.cerrando = false;
      }
    });
  }
}
