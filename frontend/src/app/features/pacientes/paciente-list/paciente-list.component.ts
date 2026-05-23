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
    <div class="p-6 animate-fade-in">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-heading">Pacientes</h2>
          <p class="text-gray-500 text-sm mt-0.5">Gestión de pacientes</p>
        </div>
        <button routerLink="/pacientes/nuevo"
          class="btn-primary">
          + Nuevo Paciente
        </button>
      </div>

      <div class="mb-5">
        <div class="relative max-w-md">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">&#128269;</span>
          <input type="text" [(ngModel)]="terminoBusqueda" (input)="buscar()" placeholder="Buscar por nombre, documento o teléfono..."
            class="input-field pl-9" />
        </div>
      </div>

      <div class="glass-card-strong rounded-2xl overflow-hidden" *ngIf="pacientes.length > 0; else empty">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documento</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo</th>
                <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let p of pacientes" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-gray-400 uppercase bg-gray-50 px-1.5 py-0.5 rounded">{{ p.tipoDocumento }}</span>
                    <span class="text-sm text-gray-700 font-mono">{{ p.numeroDocumento }}</span>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {{ p.nombres.charAt(0) }}{{ p.apellidos.charAt(0) }}
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ p.nombres }} {{ p.apellidos }}</span>
                  </div>
                </td>
                <td class="px-5 py-4 text-sm text-gray-600">{{ p.telefono || '-' }}</td>
                <td class="px-5 py-4 text-sm text-gray-600">{{ p.correo || '-' }}</td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-1.5">
                    <button [routerLink]="['/pacientes', p.id, 'editar']"
                      class="btn-ghost">
                      Editar
                    </button>
                    <button (click)="eliminar(p)"
                      class="btn-danger">
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
            <span class="text-3xl text-gray-300">&#128100;</span>
          </div>
          <p class="text-gray-400 text-lg font-medium">No hay pacientes registrados</p>
          <p class="text-gray-300 text-sm mt-1">Comienza agregando un nuevo paciente</p>
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
