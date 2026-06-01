import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CajaService } from '../../../core/services/caja.service';
import { VentaService } from '../../../core/services/venta.service';
import { CitaService } from '../../../core/services/cita.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { CajaResponse } from '../../../models/caja.model';
import { Cita } from '../../../models/cita.model';
import { Paciente } from '../../../models/paciente.model';

@Component({
  selector: 'app-cobro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-6 animate-fade-in">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-heading">Cobro de Servicios</h2>
          <p class="text-gray-500 text-sm mt-0.5">Registra los cobros de citas completadas</p>
        </div>
        <div class="flex items-center gap-3">
          <div *ngIf="cajaActiva" class="text-right">
            <p class="text-xs text-gray-400">Caja #{{ cajaActiva.id }}</p>
            <p class="text-xs font-medium text-emerald-600">ABIERTO</p>
          </div>
          <button (click)="irACerrarCaja()" class="btn-secondary text-sm">
            Cerrar Caja
          </button>
        </div>
      </div>

      <!-- Caja info / No caja -->
      <div *ngIf="!cajaActiva && !loadingCaja" class="glass-card-strong rounded-2xl p-8 text-center mb-6">
        <div class="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl text-amber-500">&#128179;</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-700 mb-1">No tienes una caja abierta</h3>
        <p class="text-gray-400 text-sm mb-4">Apertura una caja para comenzar a cobrar</p>
        <button routerLink="/ventas/caja-apertura" class="btn-primary">
          Aperturar Caja
        </button>
      </div>

      <ng-container *ngIf="cajaActiva">
        <!-- Buscar paciente -->
        <div class="glass-card-strong rounded-2xl p-5 mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Paciente</label>
          <div class="relative">
            <input type="text" [(ngModel)]="terminoBusqueda" (input)="buscarPaciente()" placeholder="Buscar por nombre o DNI..."
              class="input-field pl-9" />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">&#128269;</span>
          </div>

          <div *ngIf="pacientes.length > 0" class="mt-3 border border-gray-100 rounded-xl overflow-hidden">
            <button *ngFor="let p of pacientes" (click)="seleccionarPaciente(p)"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between border-b border-gray-50 last:border-0">
              <div>
                <span class="text-sm font-medium text-gray-900">{{ p.nombres }} {{ p.apellidos }}</span>
                <span class="text-xs text-gray-400 ml-2">{{ p.numeroDocumento }}</span>
              </div>
              <span class="text-xs text-primary-600 font-medium">Seleccionar</span>
            </button>
          </div>
        </div>

        <!-- Citas pendientes de pago -->
        <div *ngIf="pacienteSeleccionado" class="glass-card-strong rounded-2xl p-5 mb-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">{{ pacienteSeleccionado.nombres }} {{ pacienteSeleccionado.apellidos }}</h3>
              <p class="text-xs text-gray-400">{{ pacienteSeleccionado.tipoDocumento }}: {{ pacienteSeleccionado.numeroDocumento }}</p>
            </div>
            <button (click)="limpiarSeleccion()" class="btn-ghost text-xs">Cambiar</button>
          </div>

          <div *ngIf="citasPendientes.length === 0" class="text-center py-6 text-gray-400 text-sm">
            No hay citas completadas pendientes de cobro para este paciente.
          </div>

          <div *ngFor="let cita of citasPendientes" (click)="seleccionarCita(cita)"
            class="border border-gray-100 rounded-xl p-4 mb-3 cursor-pointer transition-all hover:border-primary-200"
            [class.border-primary-500!bg-primary-50]="citaSeleccionada?.id === cita.id">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-800">{{ cita.fecha }} &middot; {{ cita.horaInicio }} - {{ cita.horaFin }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ cita.tipo }} &middot; Dr. {{ cita.nombreDoctor }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-gray-800">S/ {{ cita.precio || 0 | number:'1.2-2' }}</p>
                <span class="badge bg-emerald-50 text-emerald-700 text-[10px]">COMPLETADA</span>
              </div>
            </div>
          </div>

          <!-- Formulario de cobro -->
          <div *ngIf="citaSeleccionada" class="border-t border-gray-100 pt-5 mt-3">
            <h4 class="text-sm font-semibold text-gray-700 mb-4">Detalle del Cobro</h4>

            <div class="space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-600">Servicio</span>
                <span class="text-sm text-gray-900">{{ citaSeleccionada.tipo }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-50">
                <span class="text-sm text-gray-600">Total a Cobrar</span>
                <span class="text-lg font-bold text-gray-900">S/ {{ montoTotal | number:'1.2-2' }}</span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Método de Pago</label>
                <div class="flex gap-3">
                  <button (click)="seleccionarMetodoPago('EFECTIVO')"
                    class="flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all"
                    [class.border-primary-500!bg-primary-50!text-primary-700]="metodoPago === 'EFECTIVO'"
                    [class.border-gray-200!text-gray-600!hover:border-gray-300]="metodoPago !== 'EFECTIVO'">
                    Efectivo
                  </button>
                  <button (click)="seleccionarMetodoPago('YAPE_PLIN')"
                    class="flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all"
                    [class.border-primary-500!bg-primary-50!text-primary-700]="metodoPago === 'YAPE_PLIN'"
                    [class.border-gray-200!text-gray-600!hover:border-gray-300]="metodoPago !== 'YAPE_PLIN'">
                    Yape / Plin
                  </button>
                </div>
              </div>

              <div *ngIf="metodoPago === 'EFECTIVO'">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Monto Recibido (S/)</label>
                <input type="number" [(ngModel)]="montoRecibido" (input)="calcularVuelto()" step="0.01" min="0"
                  class="input-field text-lg font-mono" placeholder="0.00" />
                <div *ngIf="vuelto !== null && vuelto >= 0" class="mt-2 p-3 bg-emerald-50 rounded-xl text-center">
                  <span class="text-xs text-emerald-600 font-medium">VUELTO</span>
                  <p class="text-2xl font-bold text-emerald-700">S/ {{ vuelto | number:'1.2-2' }}</p>
                </div>
                <div *ngIf="montoRecibido !== null && montoRecibido > 0 && montoRecibido < montoTotal" class="mt-2 text-xs text-red-500">
                  El monto recibido es menor al total
                </div>
              </div>

              <button (click)="cobrar()" [disabled]="!puedeCobrar || cobrando"
                class="btn-primary w-full py-3 text-base">
                <span *ngIf="!cobrando">Cobrar S/ {{ montoTotal | number:'1.2-2' }}</span>
                <span *ngIf="cobrando">Procesando...</span>
              </button>

              <div *ngIf="mensajeExito" class="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm text-center">
                {{ mensajeExito }}
              </div>
              <div *ngIf="error" class="p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class CobroComponent implements OnInit {
  cajaActiva: CajaResponse | null = null;
  loadingCaja = true;
  terminoBusqueda = '';
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente | null = null;
  citasPendientes: Cita[] = [];
  citaSeleccionada: Cita | null = null;
  metodoPago = '';
  montoRecibido: number | null = null;
  vuelto: number | null = null;
  cobrando = false;
  mensajeExito = '';
  error = '';

  constructor(
    private cajaService: CajaService,
    private ventaService: VentaService,
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  get montoTotal(): number {
    return this.citaSeleccionada?.precio || 0;
  }

  get puedeCobrar(): boolean {
    if (!this.citaSeleccionada || !this.metodoPago) return false;
    if (this.metodoPago === 'EFECTIVO') {
      return this.montoRecibido !== null && this.montoRecibido >= this.montoTotal;
    }
    return true;
  }

  ngOnInit(): void {
    this.cargarCajaActiva();
  }

  cargarCajaActiva(): void {
    this.loadingCaja = true;
    this.cajaService.obtenerActiva().subscribe({
      next: (caja) => {
        this.cajaActiva = caja;
        this.loadingCaja = false;
      },
      error: () => this.loadingCaja = false
    });
  }

  buscarPaciente(): void {
    const termino = this.terminoBusqueda.trim();
    if (termino.length < 2) {
      this.pacientes = [];
      return;
    }
    this.pacienteService.buscar(termino).subscribe(data => {
      this.pacientes = data;
    });
  }

  seleccionarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = paciente;
    this.pacientes = [];
    this.terminoBusqueda = `${paciente.nombres} ${paciente.apellidos}`;
    this.citasPendientes = [];
    this.citaSeleccionada = null;
    this.metodoPago = '';
    this.montoRecibido = null;
    this.vuelto = null;
    this.error = '';
    this.mensajeExito = '';
    this.cargarCitasPendientes(paciente.id);
  }

  cargarCitasPendientes(pacienteId: number): void {
    this.citaService.listarPendientesPago(pacienteId).subscribe({
      next: (data) => {
        this.citasPendientes = data;
      },
      error: () => {
        this.error = 'Error al cargar citas pendientes';
      }
    });
  }

  limpiarSeleccion(): void {
    this.pacienteSeleccionado = null;
    this.terminoBusqueda = '';
    this.pacientes = [];
    this.citasPendientes = [];
    this.citaSeleccionada = null;
    this.metodoPago = '';
    this.montoRecibido = null;
    this.vuelto = null;
    this.error = '';
    this.mensajeExito = '';
  }

  seleccionarCita(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.metodoPago = '';
    this.montoRecibido = null;
    this.vuelto = null;
    this.error = '';
    this.mensajeExito = '';
  }

  seleccionarMetodoPago(metodo: string): void {
    this.metodoPago = metodo;
    this.error = '';
    if (metodo === 'YAPE_PLIN') {
      this.montoRecibido = null;
      this.vuelto = null;
    }
  }

  calcularVuelto(): void {
    if (this.montoRecibido !== null && this.montoRecibido >= this.montoTotal) {
      this.vuelto = this.montoRecibido - this.montoTotal;
    } else {
      this.vuelto = null;
    }
  }

  cobrar(): void {
    if (!this.puedeCobrar || !this.pacienteSeleccionado || !this.citaSeleccionada) return;

    this.cobrando = true;
    this.error = '';
    this.mensajeExito = '';

    const dto = {
      idPaciente: this.pacienteSeleccionado.id,
      idCita: this.citaSeleccionada.id,
      total: this.montoTotal,
      metodoPago: this.metodoPago,
      montoRecibido: this.metodoPago === 'EFECTIVO' ? this.montoRecibido! : undefined,
      cambio: this.metodoPago === 'EFECTIVO' ? this.vuelto! : undefined
    };

    this.ventaService.registrar(dto).subscribe({
      next: () => {
        this.mensajeExito = 'Cobro registrado exitosamente';
        this.cobrando = false;
        this.citaSeleccionada = null;
        this.metodoPago = '';
        this.montoRecibido = null;
        this.vuelto = null;
        if (this.pacienteSeleccionado) {
          this.cargarCitasPendientes(this.pacienteSeleccionado.id);
        }
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al registrar cobro';
        this.cobrando = false;
      }
    });
  }

  irACerrarCaja(): void {
    if (this.cajaActiva) {
      this.router.navigate(['/ventas/cierre', this.cajaActiva.id]);
    }
  }
}
