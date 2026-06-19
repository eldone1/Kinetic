import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardRecepcion } from './dashboard.models';

@Component({
  selector: 'app-dashboard-recepcion',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 font-heading">Dashboard Recepción</h2>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Citas del Día</p>
          <p class="text-2xl font-bold text-teal-600 mt-1">{{data?.citasDelDia}}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Pacientes en Espera</p>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{data?.pacientesEnEspera}}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Citas Canceladas</p>
          <p class="text-2xl font-bold text-red-600 mt-1">{{data?.citasCanceladas}}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Ventas del Día</p>
          <p class="text-2xl font-bold text-green-600 mt-1">S/ {{data?.ventasDelDia | number:'1.2-2'}}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Caja</p>
          <p class="text-2xl font-bold mt-1" [class.text-green-600]="data?.cajaActual" [class.text-gray-400]="!data?.cajaActual">
            {{data?.cajaActual ? 'Abierta' : 'Cerrada'}}
          </p>
        </div>
      </div>

      <!-- Resumen Caja -->
      <div *ngIf="data?.cajaActual" class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div><p class="text-xs text-gray-500">Apertura</p><p class="text-sm font-semibold mt-1">S/ {{data?.cajaActual?.montoInicial | number:'1.2-2'}}</p></div>
        <div><p class="text-xs text-gray-500">Efectivo</p><p class="text-sm font-semibold mt-1 text-green-600">S/ {{data?.totalEfectivo | number:'1.2-2'}}</p></div>
        <div><p class="text-xs text-gray-500">Yape/Plin</p><p class="text-sm font-semibold mt-1 text-blue-600">S/ {{data?.totalYapePlin | number:'1.2-2'}}</p></div>
        <div><p class="text-xs text-gray-500">Total</p><p class="text-sm font-semibold mt-1">S/ {{(data!.totalEfectivo + data!.totalYapePlin) | number:'1.2-2'}}</p></div>
      </div>

      <!-- Agenda del Día -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Agenda del Día</h3>
        <div class="overflow-x-auto max-h-64 overflow-y-auto">
          <table class="w-full text-sm">
            <thead><tr class="text-left text-gray-500 border-b">
              <th class="pb-2 font-medium">Hora</th><th class="pb-2 font-medium">Paciente</th><th class="pb-2 font-medium">Doctor</th><th class="pb-2 font-medium">Estado</th>
            </tr></thead>
            <tbody>
              <tr *ngFor="let c of data?.agendaDelDia" class="border-b border-gray-50 hover:bg-gray-50">
                <td class="py-2">{{c.horaInicio | slice:0:5}}</td>
                <td class="py-2">{{c.nombrePaciente}}</td>
                <td class="py-2">{{c.nombreDoctor}}</td>
                <td class="py-2">
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                    [class.bg-yellow-100]="c.estado==='PROGRAMADA'" [class.text-yellow-700]="c.estado==='PROGRAMADA'"
                    [class.bg-green-100]="c.estado==='COMPLETADA'" [class.text-green-700]="c.estado==='COMPLETADA'"
                    [class.bg-red-100]="c.estado==='CANCELADA'" [class.text-red-700]="c.estado==='CANCELADA'">{{c.estado}}</span>
                </td>
              </tr>
              <tr *ngIf="!data?.agendaDelDia?.length"><td colspan="4" class="py-4 text-center text-gray-400">Sin citas para hoy</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cobros Pendientes y Últimas Ventas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Cobros Pendientes</h3>
          <div class="overflow-x-auto max-h-48 overflow-y-auto">
            <table class="w-full text-sm">
              <thead><tr class="text-left text-gray-500 border-b">
                <th class="pb-2 font-medium">Paciente</th><th class="pb-2 font-medium">Fecha</th><th class="pb-2 font-medium">Acción</th>
              </tr></thead>
              <tbody>
                <tr *ngFor="let c of data?.cobrosPendientes" class="border-b border-gray-50 hover:bg-gray-50">
                  <td class="py-2">{{c.nombrePaciente}}</td>
                  <td class="py-2">{{c.fecha}}</td>
                  <td class="py-2"><span class="text-xs text-red-600 font-medium">Pendiente</span></td>
                </tr>
                <tr *ngIf="!data?.cobrosPendientes?.length"><td colspan="3" class="py-4 text-center text-gray-400">Sin cobros pendientes</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Últimas Ventas</h3>
          <div class="overflow-x-auto max-h-48 overflow-y-auto">
            <table class="w-full text-sm">
              <thead><tr class="text-left text-gray-500 border-b">
                <th class="pb-2 font-medium">Paciente</th><th class="pb-2 font-medium">Total</th><th class="pb-2 font-medium">Método</th>
              </tr></thead>
              <tbody>
                <tr *ngFor="let v of data?.ultimasVentas" class="border-b border-gray-50 hover:bg-gray-50">
                  <td class="py-2">{{v.nombrePaciente}}</td>
                  <td class="py-2">S/ {{v.total | number:'1.2-2'}}</td>
                  <td class="py-2"><span class="text-xs font-medium">{{v.metodoPago}}</span></td>
                </tr>
                <tr *ngIf="!data?.ultimasVentas?.length"><td colspan="3" class="py-4 text-center text-gray-400">Sin ventas</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Cobros por Método de Pago</h3>
          <canvas baseChart [data]="metodosPagoData" [options]="doughnutOptions" type="doughnut"></canvas>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Servicios Más Vendidos</h3>
          <canvas baseChart [data]="serviciosData" [options]="barOptions" type="bar"></canvas>
        </div>
      </div>
    </div>
  `
})
export class DashboardRecepcionComponent implements OnInit {
  data?: DashboardRecepcion;

  metodosPagoData!: ChartData<'doughnut'>;
  serviciosData!: ChartData<'bar'>;

  barOptions: ChartOptions<'bar'> = {
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
    this.svc.obtenerRecepcion().subscribe(d => {
      this.data = d;
      this.metodosPagoData = {
        labels: d.cobrosPorMetodoPago.map(p => p.label),
        datasets: [{ data: d.cobrosPorMetodoPago.map(p => p.value), backgroundColor: ['#0d9488', '#f59e0b'] }]
      };
      this.serviciosData = {
        labels: d.serviciosMasVendidos.map(p => p.label),
        datasets: [{ data: d.serviciosMasVendidos.map(p => p.value), backgroundColor: '#2563eb' }]
      };
    });
  }
}
