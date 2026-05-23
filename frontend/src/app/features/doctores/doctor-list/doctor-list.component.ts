import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Doctor } from '../../../models/doctor.model';
import { DoctorService } from '../../../core/services/doctor.service';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-6 animate-fade-in">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-heading">Doctores</h2>
          <p class="text-gray-500 text-sm mt-0.5">Gestión de personal médico</p>
        </div>
        <button routerLink="/doctores/nuevo"
          class="btn-primary">
          + Nuevo Doctor
        </button>
      </div>

      <div class="mb-5">
        <div class="relative max-w-md">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">&#128269;</span>
          <input type="text" [(ngModel)]="terminoBusqueda" (input)="buscar()" placeholder="Buscar por nombre, DNI o especialidad..."
            class="input-field pl-9" />
        </div>
      </div>

      <div class="glass-card-strong rounded-2xl overflow-hidden" *ngIf="doctores.length > 0; else empty">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">DNI</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Especialidad</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let d of doctores" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {{ d.nombres.charAt(0) }}{{ d.apellidos.charAt(0) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ d.nombres }} {{ d.apellidos }}</p>
                      <p class="text-xs text-gray-400" *ngIf="d.cmp">CMP: {{ d.cmp }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 text-sm text-gray-600 font-mono">{{ d.dni }}</td>
                <td class="px-5 py-4 text-sm text-gray-700">{{ d.especialidad || '-' }}</td>
                <td class="px-5 py-4 text-sm text-gray-600">{{ d.telefono || '-' }}</td>
                <td class="px-5 py-4">
                  <span class="badge" [class.badge-active]="d.activo" [class.badge-inactive]="!d.activo">
                    <span class="w-1.5 h-1.5 rounded-full" [class.bg-emerald-500]="d.activo" [class.bg-red-500]="!d.activo"></span>
                    {{ d.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-1.5">
                    <button [routerLink]="['/doctores', d.id, 'editar']"
                      class="btn-ghost">
                      Editar
                    </button>
                    <button [routerLink]="['/doctores', d.id, 'horarios']"
                      class="btn-ghost">
                      Horarios
                    </button>
                    <button (click)="toggleEstado(d, $event)"
                      class="relative inline-flex items-center cursor-pointer focus:outline-none bg-transparent border-0 p-0"
                      [class.toggle-active]="d.activo">
                      <span class="w-10 h-5 rounded-full transition-colors duration-200"
                        [class.bg-primary-600]="d.activo" [class.bg-gray-300]="!d.activo"></span>
                      <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                        [class.translate-x-5]="d.activo"></span>
                    </button>
                    <button (click)="eliminar(d)"
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
            <span class="text-3xl text-gray-300">&#128104;</span>
          </div>
          <p class="text-gray-400 text-lg font-medium">No hay doctores registrados</p>
          <p class="text-gray-300 text-sm mt-1">Comienza agregando un nuevo doctor</p>
        </div>
      </ng-template>
    </div>
  `
})
export class DoctorListComponent implements OnInit {
  doctores: Doctor[] = [];
  terminoBusqueda = '';

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDoctores();
  }

  cargarDoctores(): void {
    this.doctorService.listarTodos().subscribe(data => this.doctores = data);
  }

  buscar(): void {
    if (this.terminoBusqueda.trim().length < 2) {
      this.cargarDoctores();
      return;
    }
    this.doctorService.buscar(this.terminoBusqueda.trim()).subscribe(data => this.doctores = data);
  }

  toggleEstado(d: Doctor, event?: MouseEvent): void {
    event?.preventDefault();
    const nuevoEstado = !d.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    if (confirm(`¿${accion} al doctor ${d.nombres} ${d.apellidos}?`)) {
      this.doctorService.cambiarEstado(d.id, { activo: nuevoEstado }).subscribe(() => this.cargarDoctores());
    }
  }

  eliminar(d: Doctor): void {
    if (confirm(`¿Eliminar al doctor ${d.nombres} ${d.apellidos}?`)) {
      this.doctorService.eliminar(d.id).subscribe(() => this.cargarDoctores());
    }
  }
}
