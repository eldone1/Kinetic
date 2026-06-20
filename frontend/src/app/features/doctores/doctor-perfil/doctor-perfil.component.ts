import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../core/services/doctor.service';
import { DoctorHorarios, Horario } from '../../../models/doctor.model';

const DIAS_ORDEN: Record<string, string> = {
  LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado'
};

@Component({
  selector: 'app-doctor-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 animate-fade-in max-w-5xl mx-auto">
      <div class="glass-card-strong rounded-2xl overflow-hidden mb-6">
        <div class="relative h-32 bg-gradient-to-r from-teal-600 to-teal-400">
          <div class="absolute -bottom-12 left-8">
            <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
              {{ iniciales }}
            </div>
          </div>
        </div>
        <div class="pt-16 pb-6 px-8">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 font-heading">{{ perfil?.nombres }} {{ perfil?.apellidos }}</h2>
              <p class="text-teal-600 font-medium text-sm mt-0.5">{{ perfil?.especialidad || 'Fisioterapia' }}</p>
              <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                <span *ngIf="perfil?.cmp">CMP: <strong>{{ perfil?.cmp }}</strong></span>
                <span *ngIf="perfil?.dni">DNI: <strong>{{ perfil?.dni }}</strong></span>
                <span *ngIf="perfil?.telefono">Tel: <strong>{{ perfil?.telefono }}</strong></span>
                <span *ngIf="perfil?.correo">Email: <strong>{{ perfil?.correo }}</strong></span>
              </div>
            </div>
            <div class="flex gap-2">
              <a routerLink="/agenda" class="btn-primary text-sm flex items-center gap-1.5">
                Ir a mi Agenda
              </a>
              <a routerLink="/pacientes" class="btn-secondary text-sm flex items-center gap-1.5">
                Ver Pacientes
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="glass-card-strong rounded-2xl p-6">
            <h3 class="text-lg font-bold text-gray-800 font-heading mb-4">Horarios de Atención</h3>
            <div *ngIf="horariosAgrupados.length > 0; else sinHorarios" class="space-y-3">
              <div *ngFor="let dia of horariosAgrupados"
                class="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span class="font-medium text-gray-700 w-24">{{ dia.label }}</span>
                </div>
                <div class="text-sm text-gray-600 font-mono">
                  <ng-container *ngFor="let h of dia.horarios; let last = last">
                    {{ h.horaInicio | slice:0:5 }} - {{ h.horaFin | slice:0:5 }}<ng-container *ngIf="!last">, </ng-container>
                  </ng-container>
                </div>
              </div>
            </div>
            <ng-template #sinHorarios>
              <div class="text-center py-8">
                <p class="text-gray-400">No tiene horarios configurados</p>
                <p class="text-gray-300 text-sm mt-1">Consulte con el administrador</p>
              </div>
            </ng-template>
          </div>
        </div>

        <div class="space-y-4">
          <div class="glass-card-strong rounded-2xl p-6">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Acceso Rápido</h3>
            <div class="space-y-2">
              <a routerLink="/agenda"
                class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-all text-sm font-medium">
                <span class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">&#128197;</span>
                Mi Agenda
              </a>
              <a routerLink="/historias-clinicas"
                class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-all text-sm font-medium">
                <span class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">&#128221;</span>
                Historias Clínicas
              </a>
              <a routerLink="/cambio-password"
                class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-all text-sm font-medium">
                <span class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">&#128274;</span>
                Cambiar Contraseña
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DoctorPerfilComponent implements OnInit {
  perfil: DoctorHorarios | null = null;
  horariosAgrupados: { label: string; horarios: Horario[] }[] = [];

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  get iniciales(): string {
    if (!this.perfil) return 'DR';
    return (this.perfil.nombres.charAt(0) + this.perfil.apellidos.charAt(0)).toUpperCase();
  }

  ngOnInit(): void {
    this.doctorService.obtenerMiPerfilCompleto().subscribe({
      next: (data) => {
        this.perfil = data;
        this.agruparHorarios(data.horarios);
      },
      error: () => this.router.navigate(['/dashboard'])
    });
  }

  private agruparHorarios(horarios: Horario[]): void {
    const map = new Map<string, Horario[]>();
    const orden = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

    for (const h of horarios) {
      if (!map.has(h.diaSemana)) map.set(h.diaSemana, []);
      map.get(h.diaSemana)!.push(h);
    }

    this.horariosAgrupados = orden
      .filter(d => map.has(d))
      .map(d => ({ label: DIAS_ORDEN[d] || d, horarios: map.get(d)! }));
  }
}
