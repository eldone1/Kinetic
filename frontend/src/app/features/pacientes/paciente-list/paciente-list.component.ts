import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paciente } from '../../../models/paciente.model';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Pacientes</h2>
        <button routerLink="/pacientes/nuevo"
          class="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Nuevo Paciente
        </button>
      </div>

      <div class="mb-4">
        <input type="text" [(ngModel)]="terminoBusqueda" (input)="buscar()" placeholder="Buscar por nombre, documento o teléfono..."
          class="w-full max-w-md px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden" *ngIf="pacientes.length > 0; else empty">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b">
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Documento</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Nombre Completo</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Teléfono</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Correo</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of pacientes" class="border-b last:border-0 hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-sm text-gray-700">
                <span class="text-xs text-gray-400 mr-1">{{ p.tipoDocumento }}</span>
                {{ p.numeroDocumento }}
              </td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ p.nombres }} {{ p.apellidos }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ p.telefono || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ p.correo || '-' }}</td>
              <td class="px-4 py-3 text-sm space-x-2">
                <button [routerLink]="['/pacientes', p.id, 'editar']"
                  class="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-xs font-medium hover:bg-sky-100 transition-colors">
                  Editar
                </button>
                <button (click)="eliminar(p)"
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
          <p class="text-gray-400 text-lg">No hay pacientes registrados.</p>
        </div>
      </ng-template>
    </div>
  `
})
export class PacienteListComponent implements OnInit {
  pacientes: Paciente[] = [];
  terminoBusqueda = '';

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacienteService.listarTodos().subscribe(data => this.pacientes = data);
  }

  buscar(): void {
    if (this.terminoBusqueda.trim().length < 2) {
      this.cargarPacientes();
      return;
    }
    this.pacienteService.buscar(this.terminoBusqueda.trim()).subscribe(data => this.pacientes = data);
  }

  eliminar(p: Paciente): void {
    if (confirm(`¿Eliminar al paciente ${p.nombres} ${p.apellidos}?`)) {
      this.pacienteService.eliminar(p.id).subscribe(() => this.cargarPacientes());
    }
  }
}
