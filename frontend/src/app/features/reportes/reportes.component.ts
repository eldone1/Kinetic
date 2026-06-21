import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../core/services/reporte.service';
import { DoctorService } from '../../core/services/doctor.service';
import {
  ReporteVentaPeriodo,
  ReporteIngresoServicio,
  ReporteAtencionDoctor,
  ReporteCierresCaja,
  ReportePacientes,
  ReporteOcupacion
} from './reportes.models';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 font-heading">Reportes</h1>
          <p class="text-sm text-gray-500 mt-1">Visualiza y exporta reportes del negocio</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="glass-card-strong rounded-2xl p-5 mb-6">
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Fecha Inicio</label>
            <input type="date" [(ngModel)]="fechaInicio" (ngModelChange)="cargarReporte()"
              class="input-field rounded-xl px-3 py-2 text-sm border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-44">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Fecha Fin</label>
            <input type="date" [(ngModel)]="fechaFin" (ngModelChange)="cargarReporte()"
              class="input-field rounded-xl px-3 py-2 text-sm border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-44">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Doctor (opcional)</label>
            <select [(ngModel)]="idDoctor" (ngModelChange)="cargarReporte()"
              class="input-field rounded-xl px-3 py-2 text-sm border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-44">
              <option [ngValue]="null">Todos los doctores</option>
              <option *ngFor="let d of doctores" [ngValue]="d.id">{{ d.nombres }} {{ d.apellidos }}</option>
            </select>
          </div>
          <button (click)="limpiarFiltros()"
            class="btn-ghost px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-100">
            Limpiar
          </button>
          <button (click)="setPeriodo('hoy')"
            class="btn-ghost px-3 py-2 text-xs rounded-lg">Hoy</button>
          <button (click)="setPeriodo('semana')"
            class="btn-ghost px-3 py-2 text-xs rounded-lg">Esta Semana</button>
          <button (click)="setPeriodo('mes')"
            class="btn-ghost px-3 py-2 text-xs rounded-lg">Este Mes</button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-6 flex-wrap">
        <button *ngFor="let tab of tabs"
          (click)="onTabChange(tab.id)"
          class="px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
          [class.bg-primary-600]="activeTab === tab.id"
          [class.text-white]="activeTab === tab.id"
          [class.shadow-sm]="activeTab === tab.id"
          [class.text-gray-600]="activeTab !== tab.id"
          [class.hover:bg-gray-100]="activeTab !== tab.id"
          [class.bg-white]="activeTab !== tab.id">
          <span class="mr-1.5">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>

      <!-- Contenido -->
      <div class="glass-card-strong rounded-2xl p-6">
        <ng-container [ngSwitch]="activeTab">

          <!-- VENTAS PERIODO -->
          <ng-container *ngSwitchCase="'ventas'">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-800">Ventas por Período</h2>
              <div class="flex gap-2">
                <button (click)="exportar('ventas','pdf')" class="btn-ghost text-xs px-3 py-1.5 rounded-lg">PDF</button>
                <button (click)="exportar('ventas','xlsx')" class="btn-ghost text-xs px-3 py-1.5 rounded-lg">Excel</button>
              </div>
            </div>
            <div *ngIf="!ventasData.length" class="text-center py-10 text-gray-400">Sin datos para el período seleccionado</div>
            <div class="overflow-x-auto" *ngIf="ventasData.length">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-100">
                    <th class="w-8"></th>
                    <th class="text-left py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Fecha</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Cantidad</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Efectivo</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Yape/Plin</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <ng-container *ngFor="let v of ventasData; let i = index">
                    <tr (click)="toggleRow('ventas', i)" class="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                      <td class="py-3 px-3 text-gray-400 text-xs">{{ isRowExpanded('ventas', i) ? '▼' : '▶' }}</td>
                      <td class="py-3 px-3 text-gray-700">{{ v.fecha }}</td>
                      <td class="py-3 px-3 text-right text-gray-600">{{ v.cantidadVentas }}</td>
                      <td class="py-3 px-3 text-right text-gray-600">S/ {{ v.totalEfectivo | number:'1.2-2' }}</td>
                      <td class="py-3 px-3 text-right text-gray-600">S/ {{ v.totalYapePlin | number:'1.2-2' }}</td>
                      <td class="py-3 px-3 text-right font-bold text-primary-600">S/ {{ v.totalGeneral | number:'1.2-2' }}</td>
                    </tr>
                    <tr *ngIf="isRowExpanded('ventas', i)">
                      <td colspan="6" class="bg-gray-50/50 px-6 py-3">
                        <table class="w-full text-xs">
                          <thead>
                            <tr class="border-b border-gray-200">
                              <th class="text-left py-2 px-2 text-gray-500 font-medium">Paciente</th>
                              <th class="text-left py-2 px-2 text-gray-500 font-medium">Servicio</th>
                              <th class="text-left py-2 px-2 text-gray-500 font-medium">Método</th>
                              <th class="text-right py-2 px-2 text-gray-500 font-medium">Monto</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr *ngFor="let d of v.ventas" class="border-b border-gray-100">
                              <td class="py-2 px-2 text-gray-700">{{ d.pacienteNombre }}</td>
                              <td class="py-2 px-2 text-gray-600">{{ d.servicio }}</td>
                              <td class="py-2 px-2">
                                <span class="badge" [class]="'badge-' + colorMetodoPago(d.metodoPago)">{{ d.metodoPago }}</span>
                              </td>
                              <td class="py-2 px-2 text-right text-gray-700">S/ {{ d.monto | number:'1.2-2' }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </ng-container>
                </tbody>
              </table>
            </div>
          </ng-container>

          <!-- INGRESOS SERVICIO -->
          <ng-container *ngSwitchCase="'servicios'">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-800">Ingresos por Servicio</h2>
              <div class="flex gap-2">
                <button (click)="exportar('servicios','pdf')" class="btn-ghost text-xs px-3 py-1.5 rounded-lg">PDF</button>
                <button (click)="exportar('servicios','xlsx')" class="btn-ghost text-xs px-3 py-1.5 rounded-lg">Excel</button>
              </div>
            </div>
            <div *ngIf="!ingresosServicio.length" class="text-center py-10 text-gray-400">Sin datos para el período seleccionado</div>
            <div class="overflow-x-auto" *ngIf="ingresosServicio.length">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-100">
                    <th class="w-8"></th>
                    <th class="text-left py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Servicio</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Cantidad</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <ng-container *ngFor="let s of ingresosServicio; let i = index">
                    <tr (click)="toggleRow('servicios', i)" class="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                      <td class="py-3 px-3 text-gray-400 text-xs">{{ isRowExpanded('servicios', i) ? '▼' : '▶' }}</td>
                      <td class="py-3 px-3 text-gray-700">{{ s.servicio }}</td>
                      <td class="py-3 px-3 text-right text-gray-600">{{ s.cantidad }}</td>
                      <td class="py-3 px-3 text-right font-bold text-primary-600">S/ {{ s.total | number:'1.2-2' }}</td>
                    </tr>
                    <tr *ngIf="isRowExpanded('servicios', i)">
                      <td colspan="4" class="bg-gray-50/50 px-6 py-3">
                        <table class="w-full text-xs">
                          <thead>
                            <tr class="border-b border-gray-200">
                              <th class="text-left py-2 px-2 text-gray-500 font-medium">Fecha</th>
                              <th class="text-left py-2 px-2 text-gray-500 font-medium">Paciente</th>
                              <th class="text-right py-2 px-2 text-gray-500 font-medium">Monto</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr *ngFor="let d of s.detalleCitas" class="border-b border-gray-100">
                              <td class="py-2 px-2 text-gray-600">{{ d.fecha }}</td>
                              <td class="py-2 px-2 text-gray-700">{{ d.pacienteNombre }}</td>
                              <td class="py-2 px-2 text-right text-gray-700">S/ {{ d.monto | number:'1.2-2' }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </ng-container>
                </tbody>
              </table>
            </div>
          </ng-container>

          <!-- ATENCIONES DOCTOR + OCUPACION -->
          <ng-container *ngSwitchCase="'doctores'">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-800">Atenciones y Ocupación por Doctor</h2>
              <div class="flex gap-2">
                <button (click)="exportar('doctores','pdf')" class="btn-ghost text-xs px-3 py-1.5 rounded-lg">PDF</button>
                <button (click)="exportar('doctores','xlsx')" class="btn-ghost text-xs px-3 py-1.5 rounded-lg">Excel</button>
              </div>
            </div>
            <div *ngIf="!atencionesDoctor.length" class="text-center py-10 text-gray-400">Sin datos para el período seleccionado</div>
            <div class="overflow-x-auto" *ngIf="atencionesDoctor.length">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-100">
                    <th class="w-8"></th>
                    <th class="text-left py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Doctor</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Completadas</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Canceladas</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">No Asistió</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Capacidad</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Ocupación</th>
                  </tr>
                </thead>
                <tbody>
                  <ng-container *ngFor="let d of atencionesDoctor; let i = index">
                    <tr (click)="toggleRow('doctores', i)" class="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                      <td class="py-3 px-3 text-gray-400 text-xs">{{ isRowExpanded('doctores', i) ? '▼' : '▶' }}</td>
                      <td class="py-3 px-3 text-gray-700 font-medium">{{ d.nombreDoctor }}</td>
                      <td class="py-3 px-3 text-right text-green-600 font-medium">{{ d.totalCitasCompletadas }}</td>
                      <td class="py-3 px-3 text-right text-red-500">{{ d.totalCitasCanceladas }}</td>
                      <td class="py-3 px-3 text-right text-gray-500">{{ d.totalCitasNoAsistio }}</td>
                      <td class="py-3 px-3 text-right text-gray-600">{{ d.capacidadTotal }}</td>
                      <td class="py-3 px-3 text-right font-medium"
                        [class.text-green-600]="d.porcentajeOcupacion < 80"
                        [class.text-amber-600]="d.porcentajeOcupacion >= 80 && d.porcentajeOcupacion < 95"
                        [class.text-red-500]="d.porcentajeOcupacion >= 95">
                        {{ d.porcentajeOcupacion }}%
                      </td>
                    </tr>
                    <tr *ngIf="isRowExpanded('doctores', i)">
                      <td colspan="7" class="bg-gray-50/50 px-6 py-3">
                        <div class="space-y-4">
                          <div>
                            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Citas</p>
                            <table class="w-full text-xs">
                              <thead>
                                <tr class="border-b border-gray-200">
                                  <th class="text-left py-2 px-2 text-gray-500 font-medium">Fecha</th>
                                  <th class="text-left py-2 px-2 text-gray-500 font-medium">Paciente</th>
                                  <th class="text-left py-2 px-2 text-gray-500 font-medium">Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr *ngFor="let c of d.citas" class="border-b border-gray-100">
                                  <td class="py-2 px-2 text-gray-600">{{ c.fecha }}</td>
                                  <td class="py-2 px-2 text-gray-700">{{ c.pacienteNombre }}</td>
                                  <td class="py-2 px-2">
                                    <span class="badge" [class]="'badge-' + colorEstado(c.estado)">{{ c.estado }}</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div>
                            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Slots Ocupados</p>
                            <table class="w-full text-xs">
                              <thead>
                                <tr class="border-b border-gray-200">
                                  <th class="text-left py-2 px-2 text-gray-500 font-medium">Hora</th>
                                  <th class="text-left py-2 px-2 text-gray-500 font-medium">Paciente</th>
                                  <th class="text-left py-2 px-2 text-gray-500 font-medium">Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr *ngFor="let s of d.slots" class="border-b border-gray-100">
                                  <td class="py-2 px-2 text-gray-600">{{ s.horaInicio }} - {{ s.horaFin }}</td>
                                  <td class="py-2 px-2 text-gray-700">{{ s.pacienteNombre }}</td>
                                  <td class="py-2 px-2">
                                    <span class="badge" [class]="'badge-' + colorEstado(s.estado)">{{ s.estado }}</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </ng-container>
                </tbody>
              </table>
            </div>
          </ng-container>

          <!-- CIERRES CAJA -->
          <ng-container *ngSwitchCase="'caja'">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-800">Cierres de Caja</h2>
            </div>
            <div *ngIf="!cierresCaja.length" class="text-center py-10 text-gray-400">Sin datos para el período seleccionado</div>
            <div class="overflow-x-auto" *ngIf="cierresCaja.length">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-100">
                    <th class="w-8"></th>
                    <th class="text-left py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Usuario</th>
                    <th class="text-left py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Apertura</th>
                    <th class="text-left py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Cierre</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Esperado Efectivo</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Declarado Efectivo</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  <ng-container *ngFor="let c of cierresCaja; let i = index">
                    <tr (click)="toggleRow('caja', i)" class="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                      <td class="py-3 px-3 text-gray-400 text-xs">{{ isRowExpanded('caja', i) ? '▼' : '▶' }}</td>
                      <td class="py-3 px-3 text-gray-700">{{ c.nombreUsuario }}</td>
                      <td class="py-3 px-3 text-gray-600 text-xs">{{ c.fechaApertura | date:'dd/MM/yy HH:mm' }}</td>
                      <td class="py-3 px-3 text-gray-600 text-xs">{{ c.fechaCierre | date:'dd/MM/yy HH:mm' }}</td>
                      <td class="py-3 px-3 text-right text-gray-600">S/ {{ c.esperadoEfectivo | number:'1.2-2' }}</td>
                      <td class="py-3 px-3 text-right text-gray-600">S/ {{ c.montoFinalEfectivo | number:'1.2-2' }}</td>
                      <td class="py-3 px-3 text-right font-medium"
                        [class.text-green-600]="c.diferenciaEfectivo === 0"
                        [class.text-red-500]="c.diferenciaEfectivo !== 0">
                        S/ {{ c.diferenciaEfectivo | number:'1.2-2' }}
                      </td>
                    </tr>
                    <tr *ngIf="isRowExpanded('caja', i)">
                      <td colspan="7" class="bg-gray-50/50 px-6 py-3">
                        <table class="w-full text-xs">
                          <thead>
                            <tr class="border-b border-gray-200">
                              <th class="text-left py-2 px-2 text-gray-500 font-medium">Paciente</th>
                              <th class="text-left py-2 px-2 text-gray-500 font-medium">Servicio</th>
                              <th class="text-left py-2 px-2 text-gray-500 font-medium">Método</th>
                              <th class="text-right py-2 px-2 text-gray-500 font-medium">Monto</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr *ngFor="let d of c.ventasDetalle" class="border-b border-gray-100">
                              <td class="py-2 px-2 text-gray-700">{{ d.pacienteNombre }}</td>
                              <td class="py-2 px-2 text-gray-600">{{ d.servicio }}</td>
                              <td class="py-2 px-2">
                                <span class="badge" [class]="'badge-' + colorMetodoPago(d.metodoPago)">{{ d.metodoPago }}</span>
                              </td>
                              <td class="py-2 px-2 text-right text-gray-700">S/ {{ d.monto | number:'1.2-2' }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </ng-container>
                </tbody>
              </table>
            </div>
          </ng-container>

          <!-- PACIENTES -->
          <ng-container *ngSwitchCase="'pacientes'">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-800">Pacientes Atendidos</h2>
              <div class="flex gap-2">
                <button (click)="exportar('pacientes','pdf')" class="btn-ghost text-xs px-3 py-1.5 rounded-lg">PDF</button>
                <button (click)="exportar('pacientes','xlsx')" class="btn-ghost text-xs px-3 py-1.5 rounded-lg">Excel</button>
              </div>
            </div>
            <div *ngIf="!pacientesData.totalPacientes && !pacientesData.pacientesPorDia.length" class="text-center py-10 text-gray-400">Sin datos para el período seleccionado</div>
            <div *ngIf="pacientesData.totalPacientes > 0 || pacientesData.pacientesPorDia.length > 0" class="grid grid-cols-3 gap-4 mb-6">
              <div class="glass-card rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-primary-600">{{ pacientesData?.pacientesNuevos }}</p>
                <p class="text-xs text-gray-500 mt-1">Nuevos</p>
              </div>
              <div class="glass-card rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-amber-600">{{ pacientesData.pacientesRecurrentes }}</p>
                <p class="text-xs text-gray-500 mt-1">Recurrentes</p>
              </div>
              <div class="glass-card rounded-xl p-4 text-center">
                <p class="text-2xl font-bold text-gray-800">{{ pacientesData.totalPacientes }}</p>
                <p class="text-xs text-gray-500 mt-1">Total</p>
              </div>
            </div>
            <div *ngIf="pacientesData.pacientesPorDia.length" class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-100">
                    <th class="w-8"></th>
                    <th class="text-left py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Fecha</th>
                    <th class="text-right py-3 px-3 text-gray-500 font-medium uppercase tracking-wider text-xs">Pacientes</th>
                  </tr>
                </thead>
                <tbody>
                  <ng-container *ngFor="let d of pacientesData.pacientesPorDia; let i = index">
                    <tr (click)="toggleRow('pacientes', i)" class="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                      <td class="py-3 px-3 text-gray-400 text-xs">{{ isRowExpanded('pacientes', i) ? '▼' : '▶' }}</td>
                      <td class="py-3 px-3 text-gray-700">{{ d.fecha }}</td>
                      <td class="py-3 px-3 text-right font-medium text-gray-700">{{ d.total }}</td>
                    </tr>
                    <tr *ngIf="isRowExpanded('pacientes', i)">
                      <td colspan="3" class="bg-gray-50/50 px-6 py-3">
                        <div class="flex flex-wrap gap-2">
                          <span *ngFor="let p of d.pacientes"
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                            {{ p.nombrePaciente }}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </ng-container>
                </tbody>
              </table>
            </div>
          </ng-container>

        </ng-container>
      </div>
    </div>
  `
})
export class ReportesComponent implements OnInit {
  tabs: Tab[] = [
    { id: 'ventas', label: 'Ventas', icon: '📊' },
    { id: 'servicios', label: 'Servicios', icon: '📋' },
    { id: 'doctores', label: 'Doctores', icon: '👨‍⚕️' },
    { id: 'caja', label: 'Caja', icon: '💰' },
    { id: 'pacientes', label: 'Pacientes', icon: '👥' },
  ];

  activeTab = 'ventas';
  cargando = false;

  fechaInicio: string = this.toDateInput(new Date());
  fechaFin: string = this.toDateInput(new Date());
  idDoctor: number | null = null;

  doctores: any[] = [];

  ventasData: ReporteVentaPeriodo[] = [];
  ingresosServicio: ReporteIngresoServicio[] = [];
  atencionesDoctor: ReporteAtencionDoctor[] = [];
  cierresCaja: ReporteCierresCaja[] = [];
  pacientesData: ReportePacientes = { pacientesNuevos: 0, pacientesRecurrentes: 0, totalPacientes: 0, pacientesPorDia: [] };

  expandedRows: { [key: string]: Set<number> } = {};

  constructor(
    private reporteService: ReporteService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.cargarDoctores();
    this.cargarReporte();
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
    this.cargarReporte();
  }

  toggleRow(tab: string, index: number): void {
    if (!this.expandedRows[tab]) {
      this.expandedRows[tab] = new Set<number>();
    }
    if (this.expandedRows[tab].has(index)) {
      this.expandedRows[tab].delete(index);
    } else {
      this.expandedRows[tab].add(index);
    }
  }

  isRowExpanded(tab: string, index: number): boolean {
    return this.expandedRows[tab]?.has(index) ?? false;
  }

  limpiarFiltros(): void {
    this.fechaInicio = this.toDateInput(new Date());
    this.fechaFin = this.toDateInput(new Date());
    this.idDoctor = null;
    this.cargarReporte();
  }

  cargarDoctores(): void {
    this.doctorService.listarDisponibles().subscribe(d => this.doctores = d);
  }

  setPeriodo(tipo: 'hoy' | 'semana' | 'mes'): void {
    const hoy = new Date();
    this.fechaFin = this.toDateInput(hoy);
    if (tipo === 'hoy') {
      this.fechaInicio = this.toDateInput(hoy);
    } else if (tipo === 'semana') {
      const lunes = new Date(hoy);
      lunes.setDate(hoy.getDate() - hoy.getDay() + 1);
      this.fechaInicio = this.toDateInput(lunes);
    } else {
      const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      this.fechaInicio = this.toDateInput(primero);
    }
    this.cargarReporte();
  }

  cargarReporte(): void {
    if (!this.fechaInicio || !this.fechaFin) return;
    this.cargando = true;

    switch (this.activeTab) {
      case 'ventas':
        this.reporteService.ventasPeriodo(this.fechaInicio, this.fechaFin).subscribe({
          next: d => { this.ventasData = d; this.cargando = false; },
          error: () => this.cargando = false
        });
        break;
      case 'servicios':
        this.reporteService.ingresosServicio(this.fechaInicio, this.fechaFin).subscribe({
          next: d => { this.ingresosServicio = d; this.cargando = false; },
          error: () => this.cargando = false
        });
        break;
      case 'doctores':
        this.reporteService.atencionesDoctor(this.fechaInicio, this.fechaFin, this.idDoctor ?? undefined).subscribe({
          next: d => { this.atencionesDoctor = d; this.cargando = false; },
          error: () => this.cargando = false
        });
        break;
      case 'caja':
        this.reporteService.cierresCaja(this.fechaInicio, this.fechaFin).subscribe({
          next: d => { this.cierresCaja = d; this.cargando = false; },
          error: () => this.cargando = false
        });
        break;
      case 'pacientes':
        this.reporteService.pacientes(this.fechaInicio, this.fechaFin).subscribe({
          next: d => { this.pacientesData = d; this.cargando = false; },
          error: () => this.cargando = false
        });
        break;
    }
  }

  exportar(tipo: string, formato: 'pdf' | 'xlsx'): void {
    const fi = this.fechaInicio;
    const ff = this.fechaFin;
    const ext = formato === 'pdf' ? 'pdf' : 'xlsx';
    let obs;

    switch (tipo) {
      case 'ventas':
        obs = this.reporteService.downloadVentasPeriodo(fi, ff, formato);
        break;
      case 'servicios':
        obs = this.reporteService.downloadIngresosServicio(fi, ff, formato);
        break;
      case 'doctores':
        obs = this.reporteService.downloadAtencionesDoctor(fi, ff, formato, this.idDoctor ?? undefined);
        break;
      case 'pacientes':
        obs = this.reporteService.downloadPacientes(fi, ff, formato);
        break;
      default:
        return;
    }

    obs.subscribe(blob => {
      this.reporteService.downloadBlob(blob, `${tipo}.${ext}`);
    });
  }

  colorEstado(estado: string): string {
    const colores: Record<string, string> = {
      'PROGRAMADA': 'blue',
      'CONFIRMADA': 'teal',
      'EN_PROGRESO': 'amber',
      'COMPLETADA': 'green',
      'CANCELADA': 'red',
      'NO_ASISTIO': 'gray'
    };
    return colores[estado] || 'gray';
  }

  colorMetodoPago(metodo: string): string {
    const colores: Record<string, string> = {
      'EFECTIVO': 'green',
      'YAPE': 'blue',
      'PLIN': 'purple'
    };
    return colores[metodo] || 'gray';
  }

  private toDateInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
