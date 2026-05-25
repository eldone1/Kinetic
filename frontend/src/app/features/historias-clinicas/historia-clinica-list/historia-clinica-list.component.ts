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
    <div class="p-6 animate-fade-in">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-heading">Historias Clínicas</h2>
          <p class="text-gray-500 text-sm mt-0.5">Gestión de historias clínicas de pacientes</p>
        </div>
      </div>

      <div class="mb-5">
        <div class="relative max-w-md">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">&#128269;</span>
          <input type="text" [(ngModel)]="terminoBusqueda" (input)="buscar()" placeholder="Buscar paciente por nombre o documento..."
            class="input-field pl-9" />
        </div>
      </div>

      <div *ngIf="cargando" class="glass-card-strong rounded-2xl p-16 text-center">
        <p class="text-gray-400">Cargando pacientes...</p>
      </div>

      <div class="glass-card-strong rounded-2xl overflow-hidden" *ngIf="!cargando && pacientes.length > 0; else empty">
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
              <tr *ngFor="let p of pacientes" class="hover:bg-gray-50/50 transition-colors">
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

      <ng-template #empty>
        <div class="glass-card-strong rounded-2xl p-16 text-center animate-fade-in">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl text-gray-300">&#128203;</span>
          </div>
          <p class="text-gray-400 text-lg font-medium" *ngIf="terminoBusqueda.length < 2">Busca un paciente para ver o crear su historia clínica</p>
          <p class="text-gray-400 text-lg font-medium" *ngIf="terminoBusqueda.length >= 2">No se encontraron pacientes con "{{ terminoBusqueda }}"</p>
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
