import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Servicio } from '../../../models/servicio.model';
import { ServicioService } from '../../../core/services/servicio.service';

@Component({
  selector: 'app-servicio-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 animate-fade-in">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-heading">Servicios</h2>
          <p class="text-gray-500 text-sm mt-0.5">Catálogo de servicios con precios</p>
        </div>
        <button routerLink="/servicios/nuevo"
          class="btn-primary">
          + Nuevo Servicio
        </button>
      </div>

      <div class="glass-card-strong rounded-2xl overflow-hidden" *ngIf="servicios.length > 0; else empty">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Servicio</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let s of servicios" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 text-sm font-medium text-gray-900">{{ s.nombre }}</td>
                <td class="px-5 py-4 text-sm text-gray-500 max-w-xs truncate">{{ s.descripcion || '—' }}</td>
                <td class="px-5 py-4 text-sm font-medium text-gray-900">S/ {{ s.precio | number:'1.2-2' }}</td>
                <td class="px-5 py-4">
                  <span class="badge" [class.badge-active]="s.activo" [class.badge-inactive]="!s.activo">
                    <span class="w-1.5 h-1.5 rounded-full" [class.bg-emerald-500]="s.activo" [class.bg-red-500]="!s.activo"></span>
                    {{ s.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-1.5">
                    <button [routerLink]="['/servicios', s.id, 'editar']"
                      class="btn-ghost">
                      Editar
                    </button>
                    <button (click)="toggleEstado(s)"
                      class="relative inline-flex items-center cursor-pointer focus:outline-none bg-transparent border-0 p-0">
                      <span class="w-10 h-5 rounded-full transition-colors duration-200"
                        [class.bg-primary-600]="s.activo" [class.bg-gray-300]="!s.activo"></span>
                      <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                        [class.translate-x-5]="s.activo"></span>
                    </button>
                    <button (click)="eliminar(s)"
                      class="btn-danger ml-1">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ng-template #empty>
        <div class="glass-card-strong rounded-2xl p-16 text-center animate-fade-in">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl text-gray-300">&#128196;</span>
          </div>
          <p class="text-gray-400 text-lg font-medium">No hay servicios registrados</p>
          <p class="text-gray-300 text-sm mt-1">Comienza agregando un nuevo servicio</p>
        </div>
      </ng-template>
    </div>
  `
})
export class ServicioListComponent implements OnInit {
  servicios: Servicio[] = [];

  constructor(
    private servicioService: ServicioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.servicioService.listarTodos().subscribe(data => this.servicios = data);
  }

  toggleEstado(s: Servicio): void {
    const dto = {
      nombre: s.nombre,
      descripcion: s.descripcion,
      precio: s.precio,
      activo: !s.activo
    };
    this.servicioService.actualizar(s.id, dto).subscribe(() => this.cargarServicios());
  }

  eliminar(s: Servicio): void {
    if (confirm(`¿Eliminar el servicio "${s.nombre}"?`)) {
      this.servicioService.eliminar(s.id).subscribe(() => this.cargarServicios());
    }
  }
}
