import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardAdmin } from './dashboard.models';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 font-heading">Dashboard Administrador</h2>

      <!-- KPIs Financieros -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <p class="text-xs sm:text-sm text-gray-500 font-medium">Ventas del Día</p>
          <p class="text-lg sm:text-2xl font-bold text-teal-600 mt-0.5 sm:mt-1">S/ {{data?.ventasDelDia | number:'1.2-2'}}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <p class="text-xs sm:text-sm text-gray-500 font-medium">Ventas del Mes</p>
          <p class="text-lg sm:text-2xl font-bold text-teal-600 mt-0.5 sm:mt-1">S/ {{data?.ventasDelMes | number:'1.2-2'}}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <p class="text-xs sm:text-sm text-gray-500 font-medium">Ticket Promedio</p>
          <p class="text-lg sm:text-2xl font-bold text-teal-600 mt-0.5 sm:mt-1">S/ {{data?.ticketPromedio | number:'1.2-2'}}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <p class="text-xs sm:text-sm text-gray-500 font-medium">Pacientes Activos</p>
          <p class="text-lg sm:text-2xl font-bold text-teal-600 mt-0.5 sm:mt-1">{{data?.pacientesActivos}}</p>
        </div>
      </div>

      <!-- KPIs Operativos -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <p class="text-xs sm:text-sm text-gray-500 font-medium">Citas Programadas Hoy</p>
          <p class="text-lg sm:text-2xl font-bold text-blue-600 mt-0.5 sm:mt-1">{{data?.citasProgramadasHoy}}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <p class="text-xs sm:text-sm text-gray-500 font-medium">Citas Completadas Hoy</p>
          <p class="text-lg sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">{{data?.citasCompletadasHoy}}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <p class="text-xs sm:text-sm text-gray-500 font-medium">Sesiones Realizadas Hoy</p>
          <p class="text-lg sm:text-2xl font-bold text-indigo-600 mt-0.5 sm:mt-1">{{data?.sesionesRealizadasHoy}}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <p class="text-xs sm:text-sm text-gray-500 font-medium">Cajas Abiertas</p>
          <p class="text-lg sm:text-2xl font-bold text-amber-600 mt-0.5 sm:mt-1">{{data?.cajasAbiertas}}</p>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Ventas Mensuales</h3>
          <canvas baseChart [data]="ventasMensualesData" [options]="barOptions" type="bar"></canvas>
        </div>
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Pacientes por Día (30d)</h3>
          <canvas baseChart [data]="pacientesPorDiaData" [options]="lineOptions" type="line"></canvas>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Servicios Más Demandados</h3>
          <canvas baseChart [data]="serviciosData" [options]="doughnutOptions" type="doughnut"></canvas>
        </div>
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 card-hover-static">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Rendimiento por Doctor</h3>
          <canvas baseChart [data]="doctoresData" [options]="barOptions" type="bar"></canvas>
        </div>
      </div>
    </div>
  `
})
export class DashboardAdminComponent implements OnInit {
  data?: DashboardAdmin;

  ventasMensualesData!: ChartData<'bar'>;
  pacientesPorDiaData!: ChartData<'line'>;
  serviciosData!: ChartData<'doughnut'>;
  doctoresData!: ChartData<'bar'>;

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

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
    this.svc.obtenerAdmin().subscribe(d => {
      this.data = d;
      this.ventasMensualesData = {
        labels: d.ventasMensuales.map(p => p.label),
        datasets: [{ data: d.ventasMensuales.map(p => p.value), backgroundColor: '#0d9488' }]
      };
      this.pacientesPorDiaData = {
        labels: d.pacientesPorDia.map(p => p.label),
        datasets: [{ data: d.pacientesPorDia.map(p => p.value), borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true }]
      };
      this.serviciosData = {
        labels: d.serviciosMasDemandados.map(p => p.label),
        datasets: [{ data: d.serviciosMasDemandados.map(p => p.value), backgroundColor: ['#0d9488','#2563eb','#f59e0b','#ef4444','#8b5cf6'] }]
      };
      this.doctoresData = {
        labels: d.rendimientoDoctores.map(p => p.label),
        datasets: [{ data: d.rendimientoDoctores.map(p => p.value), backgroundColor: '#2563eb' }]
      };
    });
  }
}
