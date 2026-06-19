import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardDoctor } from './dashboard.models';

@Component({
  selector: 'app-dashboard-doctor',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 font-heading">Dashboard Doctor</h2>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Pacientes Atendidos Hoy</p>
          <p class="text-2xl font-bold text-teal-600 mt-1">{{data?.pacientesAtendidosHoy}}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Citas Pendientes</p>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{data?.citasPendientes}}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Citas Completadas Hoy</p>
          <p class="text-2xl font-bold text-green-600 mt-1">{{data?.citasCompletadasHoy}}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Sesiones Programadas Hoy</p>
          <p class="text-2xl font-bold text-blue-600 mt-1">{{data?.sesionesProgramadasHoy}}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Pacientes en Tratamiento</p>
          <p class="text-2xl font-bold text-indigo-600 mt-1">{{data?.pacientesEnTratamientoActivo}}</p>
        </div>
      </div>

      <!-- Agenda del Día -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Agenda del Día</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr class="text-left text-gray-500 border-b">
              <th class="pb-2 font-medium">Hora</th><th class="pb-2 font-medium">Paciente</th><th class="pb-2 font-medium">Estado</th>
            </tr></thead>
            <tbody>
              <tr *ngFor="let c of data?.agendaDelDia" class="border-b border-gray-50 hover:bg-gray-50">
                <td class="py-2">{{c.horaInicio | slice:0:5}}</td>
                <td class="py-2">{{c.nombrePaciente}}</td>
                <td class="py-2">
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                    [class.bg-yellow-100]="c.estado==='PROGRAMADA'" [class.text-yellow-700]="c.estado==='PROGRAMADA'"
                    [class.bg-green-100]="c.estado==='COMPLETADA'" [class.text-green-700]="c.estado==='COMPLETADA'"
                    [class.bg-red-100]="c.estado==='CANCELADA'" [class.text-red-700]="c.estado==='CANCELADA'">{{c.estado}}</span>
                </td>
              </tr>
              <tr *ngIf="!data?.agendaDelDia?.length"><td colspan="3" class="py-4 text-center text-gray-400">Sin citas para hoy</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Atenciones por Día (30d)</h3>
          <canvas baseChart [data]="atencionesData" [options]="lineOptions" type="line"></canvas>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Distribución de Tratamientos</h3>
          <canvas baseChart [data]="tratamientosData" [options]="doughnutOptions" type="doughnut"></canvas>
        </div>
      </div>
    </div>
  `
})
export class DashboardDoctorComponent implements OnInit {
  data?: DashboardDoctor;

  atencionesData!: ChartData<'line'>;
  tratamientosData!: ChartData<'doughnut'>;

  lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(private svc: DashboardService) {}

  ngOnInit(): void {
    this.svc.obtenerDoctor().subscribe(d => {
      this.data = d;
      this.atencionesData = {
        labels: d.atencionesPorDia.map(p => p.label),
        datasets: [{ data: d.atencionesPorDia.map(p => p.value), borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true }]
      };
      this.tratamientosData = {
        labels: d.distribucionTratamientos.map(p => p.label),
        datasets: [{ data: d.distribucionTratamientos.map(p => p.value), backgroundColor: ['#0d9488','#2563eb','#f59e0b','#ef4444','#8b5cf6'] }]
      };
    });
  }
}
