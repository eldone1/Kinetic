import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CajaService } from '../../../core/services/caja.service';
import { CajaResponse } from '../../../models/caja.model';
import { VentaResponse } from '../../../models/venta.model';

@Component({
  selector: 'app-admin-cajas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-6 animate-fade-in">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 font-heading">Cajas</h2>
        <p class="text-gray-500 text-sm mt-0.5">Administración de cajas y cobros</p>
      </div>

      <div class="mb-5 flex gap-2">
        <button (click)="filtroEstado = 'TODOS'; filtrar()"
          class="px-4 py-2 rounded-xl text-xs font-medium transition-all"
          [class.bg-primary-600!text-white]="filtroEstado === 'TODOS'"
          [class.bg-gray-100!text-gray-600!hover:bg-gray-200]="filtroEstado !== 'TODOS'">
          Todas
        </button>
        <button (click)="filtroEstado = 'ABIERTO'; filtrar()"
          class="px-4 py-2 rounded-xl text-xs font-medium transition-all"
          [class.bg-emerald-600!text-white]="filtroEstado === 'ABIERTO'"
          [class.bg-gray-100!text-gray-600!hover:bg-gray-200]="filtroEstado !== 'ABIERTO'">
          Abiertas
        </button>
        <button (click)="filtroEstado = 'CERRADO'; filtrar()"
          class="px-4 py-2 rounded-xl text-xs font-medium transition-all"
          [class.bg-gray-600!text-white]="filtroEstado === 'CERRADO'"
          [class.bg-gray-100!text-gray-600!hover:bg-gray-200]="filtroEstado !== 'CERRADO'">
          Cerradas
        </button>
      </div>

      <div class="glass-card-strong rounded-2xl overflow-hidden" *ngIf="cajasFiltradas.length > 0; else empty">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Apertura</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cierre</th>
                <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto Ini.</th>
                <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Ventas</th>
                <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ventas</th>
                <th class="text-center px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let caja of cajasFiltradas" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 text-sm text-gray-500 font-mono">{{ caja.id }}</td>
                <td class="px-5 py-4 text-sm text-gray-900 font-medium">{{ caja.nombreUsuario }}</td>
                <td class="px-5 py-4 text-sm text-gray-600">{{ caja.fechaApertura | date:'dd/MM/yy HH:mm' }}</td>
                <td class="px-5 py-4 text-sm text-gray-600">{{ caja.fechaCierre ? (caja.fechaCierre | date:'dd/MM/yy HH:mm') : '-' }}</td>
                <td class="px-5 py-4 text-sm text-right font-mono text-gray-700">S/ {{ caja.montoInicial | number:'1.2-2' }}</td>
                <td class="px-5 py-4 text-sm text-right font-mono text-gray-700">S/ {{ (caja.totalVentas || 0) | number:'1.2-2' }}</td>
                <td class="px-5 py-4 text-sm text-right text-gray-600">{{ caja.cantidadVentas || 0 }}</td>
                <td class="px-5 py-4 text-center">
                  <span class="badge"
                    [class.bg-emerald-50!text-emerald-700]="caja.estado === 'ABIERTO'"
                    [class.bg-gray-100!text-gray-600]="caja.estado === 'CERRADO'">
                    {{ caja.estado }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button (click)="verDetalle(caja)"
                    class="btn-ghost">
                    Ver Ventas
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ng-template #empty>
        <div class="glass-card-strong rounded-2xl p-16 text-center animate-fade-in">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl text-gray-300">&#128179;</span>
          </div>
          <p class="text-gray-400 text-lg font-medium">No hay cajas registradas</p>
        </div>
      </ng-template>

      <!-- Modal de detalle de ventas -->
      <div *ngIf="cajaDetalle" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        (click)="cerrarDetalle()">
        <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl animate-fade-in"
          (click)="$event.stopPropagation()">
          <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <div>
              <h3 class="text-lg font-bold text-gray-800 font-heading">Caja #{{ cajaDetalle.id }}</h3>
              <p class="text-xs text-gray-400">{{ cajaDetalle.nombreUsuario }} &middot; {{ cajaDetalle.fechaApertura | date:'dd/MM/yy HH:mm' }}</p>
            </div>
            <button (click)="cerrarDetalle()" class="btn-ghost text-lg">&times;</button>
          </div>

          <div class="px-6 py-4 border-b border-gray-50 grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-xs text-gray-400">Total Efectivo</p>
              <p class="text-lg font-bold text-gray-800 font-mono">S/ {{ totalEfectivo | number:'1.2-2' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Total Yape/Plin</p>
              <p class="text-lg font-bold text-gray-800 font-mono">S/ {{ totalYapePlin | number:'1.2-2' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Total General</p>
              <p class="text-lg font-bold text-primary-600 font-mono">S/ {{ totalGeneral | number:'1.2-2' }}</p>
            </div>
          </div>

          <div class="px-6 py-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Ventas registradas ({{ ventasDetalle.length }})</h4>
            <div *ngIf="ventasDetalle.length === 0" class="text-center py-6 text-gray-400 text-sm">
              No hay ventas registradas en esta caja
            </div>
            <table class="w-full" *ngIf="ventasDetalle.length > 0">
              <thead>
                <tr class="bg-gray-50/50 border-b border-gray-100">
                  <th class="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Paciente</th>
                  <th class="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Servicio</th>
                  <th class="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Método</th>
                  <th class="text-right px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th class="text-right px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr *ngFor="let v of ventasDetalle" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-3 py-3 text-sm font-medium text-gray-900">{{ v.nombrePaciente }}</td>
                  <td class="px-3 py-3 text-sm text-gray-600">{{ v.fechaCita }} {{ v.horaCita }}</td>
                  <td class="px-3 py-3">
                    <span class="badge text-[10px]"
                      [class.bg-emerald-50!text-emerald-700]="v.metodoPago === 'EFECTIVO'"
                      [class.bg-blue-50!text-blue-700]="v.metodoPago === 'YAPE_PLIN'">
                      {{ v.metodoPago === 'YAPE_PLIN' ? 'Yape/Plin' : v.metodoPago }}
                    </span>
                  </td>
                  <td class="px-3 py-3 text-sm text-right font-mono font-medium text-gray-800">S/ {{ v.total | number:'1.2-2' }}</td>
                  <td class="px-3 py-3 text-sm text-right text-gray-400">{{ v.fechaVenta | date:'HH:mm' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminCajasComponent implements OnInit {
  cajas: CajaResponse[] = [];
  cajasFiltradas: CajaResponse[] = [];
  filtroEstado = 'TODOS';
  cajaDetalle: CajaResponse | null = null;
  ventasDetalle: VentaResponse[] = [];
  totalEfectivo = 0;
  totalYapePlin = 0;
  totalGeneral = 0;

  constructor(private cajaService: CajaService) {}

  ngOnInit(): void {
    this.cargarCajas();
  }

  cargarCajas(): void {
    this.cajaService.listarTodas().subscribe(data => {
      this.cajas = data;
      this.filtrar();
    });
  }

  filtrar(): void {
    if (this.filtroEstado === 'TODOS') {
      this.cajasFiltradas = [...this.cajas];
    } else {
      this.cajasFiltradas = this.cajas.filter(c => c.estado === this.filtroEstado);
    }
  }

  verDetalle(caja: CajaResponse): void {
    this.cajaDetalle = caja;
    this.cajaService.obtenerVentas(caja.id).subscribe(ventas => {
      this.ventasDetalle = ventas;
      this.totalEfectivo = ventas
        .filter(v => v.metodoPago === 'EFECTIVO')
        .reduce((sum, v) => sum + v.total, 0);
      this.totalYapePlin = ventas
        .filter(v => v.metodoPago === 'YAPE_PLIN')
        .reduce((sum, v) => sum + v.total, 0);
      this.totalGeneral = this.totalEfectivo + this.totalYapePlin;
    });
  }

  cerrarDetalle(): void {
    this.cajaDetalle = null;
    this.ventasDetalle = [];
  }
}
