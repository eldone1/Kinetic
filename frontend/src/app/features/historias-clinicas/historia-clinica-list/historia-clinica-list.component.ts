import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paciente } from '../../../models/paciente.model';
import { HistoriaClinica } from '../../../models/historia-clinica.model';
import { PacienteService } from '../../../core/services/paciente.service';
import { HistoriaClinicaService } from '../../../core/services/historia-clinica.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-historia-clinica-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-4 sm:p-6 animate-fade-in">
      <div class="flex justify-between items-center mb-4 sm:mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 font-heading">Historias Clínicas</h2>
          <p class="text-gray-500 text-xs sm:text-sm mt-0.5">Gestión de historias clínicas de pacientes</p>
        </div>
      </div>

      <div class="mb-4 sm:mb-5">
        <div class="relative max-w-md">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" [(ngModel)]="terminoBusqueda" (input)="buscar()" placeholder="Buscar paciente por nombre o documento..."
            class="input-field pl-8 sm:pl-9" />
        </div>
      </div>

      <div *ngIf="cargando" class="glass-card-strong rounded-2xl p-12 sm:p-16 text-center">
        <div class="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-gray-400 text-sm">Cargando pacientes...</p>
      </div>

      <!-- Desktop Table -->
      <div class="glass-card-strong rounded-2xl overflow-hidden hidden md:block" *ngIf="!cargando && pacientes.length > 0; else empty">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documento</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">HC</th>
                <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let p of pacientes; let i = index" class="hover:bg-gray-50/50 transition-colors stagger-item">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {{ p.nombres.charAt(0) }}{{ p.apellidos.charAt(0) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ p.nombres }} {{ p.apellidos }}</p>
                      <p class="text-xs text-gray-400">{{ p.sexo === 'M' ? 'Masculino' : p.sexo === 'F' ? 'Femenino' : '' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 text-sm text-gray-600 font-mono">{{ p.tipoDocumento }}: {{ p.numeroDocumento }}</td>
                <td class="px-5 py-4 text-sm text-gray-600">{{ p.telefono || '-' }}</td>
                <td class="px-5 py-4">
                  <span class="badge" [class.badge-active]="hcMap[p.id]" [class.badge-inactive]="!hcMap[p.id]">
                    <span class="w-1.5 h-1.5 rounded-full" [class.bg-emerald-500]="hcMap[p.id]" [class.bg-gray-400]="!hcMap[p.id]"></span>
                    {{ hcMap[p.id] ? 'Tiene HC' : 'Sin HC' }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="abrirHC(p.id)"
                      class="btn-primary text-sm">
                      {{ hcMap[p.id] ? 'Ver HC' : 'Aperturar HC' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden space-y-3" *ngIf="!cargando && pacientes.length > 0; else empty">
        <div *ngFor="let p of pacientes; let i = index" class="table-card card-hover stagger-item">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
              {{ p.nombres.charAt(0) }}{{ p.apellidos.charAt(0) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ p.nombres }} {{ p.apellidos }}</p>
              <p class="text-xs text-gray-400">{{ p.sexo === 'M' ? 'Masculino' : p.sexo === 'F' ? 'Femenino' : '' }}</p>
            </div>
            <span class="badge shrink-0" [class.badge-active]="hcMap[p.id]" [class.badge-inactive]="!hcMap[p.id]">
              <span class="w-1.5 h-1.5 rounded-full" [class.bg-emerald-500]="hcMap[p.id]" [class.bg-gray-400]="!hcMap[p.id]"></span>
            </span>
          </div>
          <div class="table-card-row">
            <span class="table-card-label">Documento</span>
            <span class="table-card-value font-mono text-xs">{{ p.tipoDocumento }}: {{ p.numeroDocumento }}</span>
          </div>
          <div class="table-card-row">
            <span class="table-card-label">Teléfono</span>
            <span class="table-card-value">{{ p.telefono || '-' }}</span>
          </div>
          <button (click)="abrirHC(p.id)" class="btn-primary w-full text-center text-xs py-2 mt-1">
            {{ hcMap[p.id] ? 'Ver HC' : 'Aperturar HC' }}
          </button>
        </div>
      </div>

      <ng-template #empty>
        <div class="glass-card-strong rounded-2xl p-12 sm:p-16 text-center animate-fade-in">
          <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl sm:text-3xl text-gray-300">&#128203;</span>
          </div>
          <p class="text-gray-400 text-base sm:text-lg font-medium" *ngIf="terminoBusqueda.length < 2">Busca un paciente para ver o crear su historia clínica</p>
          <p class="text-gray-400 text-base sm:text-lg font-medium" *ngIf="terminoBusqueda.length >= 2">No se encontraron pacientes con "{{ terminoBusqueda }}"</p>
        </div>
      </ng-template>
    </div>
  `
})
export class HistoriaClinicaListComponent implements OnInit {
  pacientes: Paciente[] = [];
  hcMap: Record<number, boolean> = {};
  terminoBusqueda = '';
  cargando = false;

  constructor(
    private pacienteService: PacienteService,
    private hcService: HistoriaClinicaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.cargando = true;
    this.pacienteService.listarTodos().subscribe(data => {
      this.pacientes = data;
      this.verificarHC();
      this.cargando = false;
    });
  }

  verificarHC(): void {
    this.pacientes.forEach(p => {
      this.hcService.existePorPaciente(p.id).subscribe(r => {
        this.hcMap[p.id] = r.existe;
      });
    });
  }

  buscar(): void {
    if (this.terminoBusqueda.trim().length < 2) {
      this.cargarPacientes();
      return;
    }
    this.cargando = true;
    this.pacienteService.buscar(this.terminoBusqueda.trim()).subscribe(data => {
      this.pacientes = data;
      this.verificarHC();
      this.cargando = false;
    });
  }

  abrirHC(pacienteId: number): void {
    this.router.navigate(['/historias-clinicas', pacienteId]);
  }
}
