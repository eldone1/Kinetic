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
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Doctores</h2>
        <button routerLink="/doctores/nuevo"
          class="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Nuevo Doctor
        </button>
      </div>

      <div class="mb-4">
        <input type="text" [(ngModel)]="terminoBusqueda" (input)="buscar()" placeholder="Buscar por nombre, DNI o especialidad..."
          class="w-full max-w-md px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden" *ngIf="doctores.length > 0; else empty">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b">
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Doctor</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">DNI</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Especialidad</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Teléfono</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Estado</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of doctores" class="border-b last:border-0 hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ d.nombres }} {{ d.apellidos }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ d.dni }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ d.especialidad || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ d.telefono || '-' }}</td>
              <td class="px-4 py-3 text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-medium"
                  [class.bg-green-50]="d.activo" [class.text-green-700]="d.activo"
                  [class.bg-red-50]="!d.activo" [class.text-red-700]="!d.activo">
                  {{ d.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm space-x-2">
                <button [routerLink]="['/doctores', d.id, 'editar']"
                  class="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-xs font-medium hover:bg-sky-100 transition-colors">
                  Editar
                </button>
                <button [routerLink]="['/doctores', d.id, 'horarios']"
                  class="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-medium hover:bg-violet-100 transition-colors">
                  Horarios
                </button>
                <button (click)="toggleEstado(d)"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  [class.bg-yellow-50]="d.activo" [class.text-yellow-700]="d.activo"
                  [class.bg-green-50]="!d.activo" [class.text-green-700]="!d.activo"
                  [class.hover:bg-yellow-100]="d.activo" [class.hover:bg-green-100]="!d.activo">
                  {{ d.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button (click)="eliminar(d)"
                  class="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #empty>
        <div class="bg-white rounded-xl shadow-sm p-12 text-center">
          <p class="text-gray-400 text-lg">No hay doctores registrados.</p>
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

  toggleEstado(d: Doctor): void {
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
