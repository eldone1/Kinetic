import { Component, ElementRef, OnDestroy, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Cita, CitaRequest, CitaEstadoRequest } from '../../../models/cita.model';
import { Paciente } from '../../../models/paciente.model';
import { Doctor } from '../../../models/doctor.model';
import { CitaService } from '../../../core/services/cita.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { CitaFormComponent } from '../cita-form/cita-form.component';

const COLORES_ESTADO: Record<string, string> = {
  PROGRAMADA: '#3b82f6',
  CONFIRMADA: '#0d9488',
  EN_PROGRESO: '#f59e0b',
  COMPLETADA: '#10b981',
  CANCELADA: '#ef4444',
  NO_ASISTIO: '#6b7280'
};

interface GrupoCitas {
  titulo: string;
  fecha: string;
  esHoy: boolean;
  esManana: boolean;
  citas: Cita[];
}

const ETIQUETAS_ESTADO: Record<string, string> = {
  PROGRAMADA: 'Programada',
  CONFIRMADA: 'Confirmada',
  EN_PROGRESO: 'En Progreso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
  NO_ASISTIO: 'No Asistió'
};

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CitaFormComponent],
  template: `
    <div class="p-6 animate-fade-in">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-heading">Agenda y Citas</h2>
          <p class="text-gray-500 text-sm mt-0.5">Gesti&oacute;n de agenda de los doctores</p>
        </div>
        <button *ngIf="puedeEditar" (click)="abrirFormularioNuevo()"
          class="btn-primary">
          + Nueva Cita
        </button>
      </div>

      <div class="flex gap-4 mb-5 flex-wrap items-center">
        <div class="flex items-center gap-1.5 text-xs" *ngFor="let e of estados">
          <span class="w-2.5 h-2.5 rounded-full inline-block" [style.background]="e.color"></span>
          <span class="text-gray-500">{{ e.label }}</span>
        </div>
        <div class="ml-auto flex gap-1 bg-gray-100 rounded-xl p-0.5">
          <button (click)="cambiarVista('calendario')"
            class="px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200"
            [class.bg-white]="vista === 'calendario'"
            [class.shadow-sm]="vista === 'calendario'"
            [class.text-gray-700]="vista === 'calendario'"
            [class.text-gray-400]="vista !== 'calendario'">
            Calendario
          </button>
          <button (click)="cambiarVista('lista')"
            class="px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200"
            [class.bg-white]="vista === 'lista'"
            [class.shadow-sm]="vista === 'lista'"
            [class.text-gray-700]="vista === 'lista'"
            [class.text-gray-400]="vista !== 'lista'">
            Lista
          </button>
        </div>
      </div>

      <div *ngIf="cargando" class="glass-card-strong rounded-2xl p-20 flex items-center justify-center">
        <div class="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!cargando && vista === 'calendario'" class="glass-card-strong rounded-2xl p-4 overflow-hidden">
        <div #calendarEl></div>
      </div>

      <div *ngIf="!cargando && vista === 'lista'" class="space-y-6">
        <div class="glass-card-strong rounded-2xl p-5">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Doctor</label>
              <select [(ngModel)]="filtroDoctorId" (ngModelChange)="aplicarFiltros()"
                class="input-field bg-white text-sm">
                <option [value]="null">Todos los doctores</option>
                <option *ngFor="let d of doctores" [value]="d.id">{{ d.nombres }} {{ d.apellidos }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Estado</label>
              <select [(ngModel)]="filtroEstado" (ngModelChange)="aplicarFiltros()"
                class="input-field bg-white text-sm">
                <option [value]="null">Todos los estados</option>
                <option *ngFor="let e of estados" [value]="e.key">{{ e.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Desde</label>
              <input type="date" [(ngModel)]="filtroFechaInicio" (ngModelChange)="aplicarFiltros()"
                class="input-field text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hasta</label>
              <input type="date" [(ngModel)]="filtroFechaFin" (ngModelChange)="aplicarFiltros()"
                class="input-field text-sm" />
            </div>
          </div>
          <div class="flex gap-2 mt-4 flex-wrap">
            <button (click)="irAHoy()"
              class="btn-ghost text-xs">Hoy</button>
            <button (click)="irAManana()"
              class="btn-ghost text-xs">Ma&ntilde;ana</button>
            <button (click)="irAEstaSemana()"
              class="btn-ghost text-xs">Esta semana</button>
            <button (click)="limpiarFiltros()"
              class="btn-ghost text-xs text-red-500 hover:text-red-700">Limpiar filtros</button>
            <span class="text-xs text-gray-400 ml-auto self-center">{{ citasFiltradas.length }} cita(s)</span>
          </div>
        </div>

        <div *ngIf="citasFiltradas.length === 0" class="glass-card-strong rounded-2xl p-12 text-center">
          <div class="text-4xl text-gray-300 mb-3">&#128197;</div>
          <p class="text-gray-400 font-medium">No hay citas en este rango</p>
          <p class="text-gray-300 text-sm mt-1">Prueba con otros filtros o crea una nueva cita</p>
        </div>

        <div *ngFor="let grupo of citasAgrupadas; trackBy: trackByGrupo" class="glass-card-strong rounded-2xl overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 flex items-center gap-3"
            [class.bg-primary-50]="grupo.esHoy"
            [class.bg-amber-50]="grupo.esManana && !grupo.esHoy">
            <span class="w-2 h-2 rounded-full"
              [class.bg-primary-500]="grupo.esHoy"
              [class.bg-amber-500]="grupo.esManana && !grupo.esHoy"
              [class.bg-gray-300]="!grupo.esHoy && !grupo.esManana"></span>
            <span class="font-bold text-sm text-gray-700">{{ grupo.titulo }}</span>
            <span class="text-xs text-gray-400">{{ grupo.fecha }}</span>
            <span class="ml-auto text-xs text-gray-400">{{ grupo.citas.length }} cita(s)</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-xs uppercase tracking-wider text-gray-400 bg-gray-50/50">
                  <th class="px-5 py-3 font-semibold">Hora</th>
                  <th class="px-5 py-3 font-semibold">Paciente</th>
                  <th class="px-5 py-3 font-semibold">Doctor</th>
                  <th class="px-5 py-3 font-semibold">Tipo</th>
                  <th class="px-5 py-3 font-semibold">Estado</th>
                  <th class="px-5 py-3 font-semibold">Observaciones</th>
                  <th class="px-5 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of grupo.citas; trackBy: trackByCita" class="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td class="px-5 py-3 whitespace-nowrap">
                    <span class="font-medium text-gray-800">{{ c.horaInicio.substring(0,5) }} - {{ c.horaFin.substring(0,5) }}</span>
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {{ c.nombrePaciente.charAt(0) }}
                      </div>
                      <div>
                        <span class="font-medium text-gray-700">{{ c.nombrePaciente }}</span>
                        <span class="text-gray-400 text-xs block">{{ c.documentoPaciente }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap text-gray-600">{{ c.nombreDoctor }}</td>
                  <td class="px-5 py-3 whitespace-nowrap">
                    <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {{ c.tipo }}
                    </span>
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap">
                    <select *ngIf="puedeEditar"
                      [ngModel]="c.estado"
                      (ngModelChange)="onChangeEstado(c, $event)"
                      [disabled]="cambiandoEstadoId === c.id"
                      class="text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary-500"
                      [style.background]="COLORES_ESTADO[c.estado] + '20'"
                      [style.color]="COLORES_ESTADO[c.estado]">
                      <option *ngFor="let e of estados" [value]="e.key"
                        [style.background]="'white'"
                        [style.color]="COLORES_ESTADO[e.key]">
                        {{ e.label }}
                      </option>
                    </select>
                    <span *ngIf="!puedeEditar"
                      class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [style.background]="COLORES_ESTADO[c.estado] + '20'"
                      [style.color]="COLORES_ESTADO[c.estado]">
                      {{ ETIQUETAS_ESTADO[c.estado] || c.estado }}
                    </span>
                  </td>
                  <td class="px-5 py-3 max-w-[200px]">
                    <span class="text-gray-500 text-xs truncate block">{{ c.observaciones || '—' }}</span>
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap text-right">
                    <button *ngIf="puedeEditar" (click)="editarCita(c)"
                      class="btn-ghost text-xs mr-1" title="Editar">
                      &#9998;
                    </button>
                    <button *ngIf="esAdmin" (click)="confirmarEliminar(c)"
                      class="btn-danger text-xs" title="Eliminar">
                      &#10005;
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <app-cita-form *ngIf="showForm"
      [cita]="citaSeleccionada"
      [pacientes]="pacientes"
      [doctores]="doctores"
      [enviando]="enviando"
      (cerrar)="cerrarFormulario()"
      (guardar)="onGuardar($event)">
    </app-cita-form>
  `
})
export class CitaListComponent implements OnInit, OnDestroy {
  @ViewChild('calendarEl') calendarEl!: ElementRef;

  private calendar: Calendar | null = null;
  citas: Cita[] = [];
  pacientes: Paciente[] = [];
  doctores: Doctor[] = [];
  cargando = true;
  showForm = false;
  enviando = false;
  citaSeleccionada?: Cita;
  puedeEditar = false;
  esAdmin = false;
  vista: 'calendario' | 'lista' = 'calendario';
  cambiandoEstadoId: number | null = null;
  citasFiltradas: Cita[] = [];
  citasAgrupadas: GrupoCitas[] = [];

  filtroDoctorId: number | null = null;
  filtroEstado: string | null = null;
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';

  readonly COLORES_ESTADO = COLORES_ESTADO;
  readonly ETIQUETAS_ESTADO = ETIQUETAS_ESTADO;

  estados = [
    { key: 'PROGRAMADA', label: 'Programada', color: COLORES_ESTADO['PROGRAMADA'] },
    { key: 'CONFIRMADA', label: 'Confirmada', color: COLORES_ESTADO['CONFIRMADA'] },
    { key: 'EN_PROGRESO', label: 'En Progreso', color: COLORES_ESTADO['EN_PROGRESO'] },
    { key: 'COMPLETADA', label: 'Completada', color: COLORES_ESTADO['COMPLETADA'] },
    { key: 'CANCELADA', label: 'Cancelada', color: COLORES_ESTADO['CANCELADA'] },
    { key: 'NO_ASISTIO', label: 'No Asistió', color: COLORES_ESTADO['NO_ASISTIO'] },
  ];

  constructor(
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private doctorService: DoctorService,
    private authService: AuthService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.puedeEditar = role === 'ROLE_ADMIN' || role === 'ROLE_RECEPCION';
    this.esAdmin = role === 'ROLE_ADMIN';
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.calendar?.destroy();
  }

  private cargarDatos(): void {
    this.cargando = true;
    this.pacienteService.listarTodos().subscribe({
      next: p => this.pacientes = p,
      error: () => this.pacientes = []
    });
    this.doctorService.listarDisponibles().subscribe({
      next: d => this.doctores = d,
      error: () => this.doctores = []
    });
    this.citaService.listarTodas().subscribe({
      next: (data) => {
        this.citas = data;
        this.cargando = false;
        this.inicializarFiltros();
        this.cdr.detectChanges();
        setTimeout(() => this.inicializarCalendar());
      },
      error: () => {
        this.citas = [];
        this.cargando = false;
        this.cdr.detectChanges();
        setTimeout(() => this.inicializarCalendar());
      }
    });
  }

  cambiarVista(v: 'calendario' | 'lista'): void {
    this.vista = v;
    if (v === 'calendario') {
      this.cdr.detectChanges();
      setTimeout(() => this.inicializarCalendar());
    }
  }

  private inicializarFiltros(): void {
    const hoy = new Date();
    this.filtroFechaInicio = this.dateToString(hoy);
    const fin = new Date(hoy);
    fin.setDate(fin.getDate() + 7);
    this.filtroFechaFin = this.dateToString(fin);
    this.aplicarFiltros();
  }

  private inicializarCalendar(): void {
    if (!this.calendarEl?.nativeElement) return;
    this.calendar?.destroy();

    this.calendar = new Calendar(this.calendarEl.nativeElement, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      firstDay: 1,
      locale: esLocale,
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      buttonText: {
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día'
      },
      slotMinTime: '07:00:00',
      slotMaxTime: '22:00:00',
      slotDuration: '00:30:00',
      allDaySlot: false,
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false
      },
      dateClick: () => {
        if (this.puedeEditar) {
          this.ngZone.run(() => {
            this.citaSeleccionada = undefined;
            this.showForm = true;
          });
        }
      },
      eventClick: (info: EventClickArg) => {
        this.ngZone.run(() => {
          const cita = info.event.extendedProps['cita'] as Cita;
          if (cita) {
            this.citaSeleccionada = cita;
            this.showForm = true;
          }
        });
      },
      eventDidMount: (info) => {
        const cita = info.event.extendedProps['cita'] as Cita;
        if (cita) {
          info.el.setAttribute('title', `${cita.nombrePaciente} - ${cita.tipo} (${cita.estado})`);
          info.el.style.cursor = 'pointer';
        }
      }
    });

    this.calendar.render();
    this.actualizarEventos();
  }

  private actualizarEventos(): void {
    if (!this.calendar) return;

    this.calendar.removeAllEvents();
    this.citas.forEach(cita => {
      this.calendar?.addEvent({
        id: String(cita.id),
        title: `${cita.nombrePaciente} [${cita.tipo}]`,
        start: `${cita.fecha}T${cita.horaInicio}`,
        end: `${cita.fecha}T${cita.horaFin}`,
        backgroundColor: COLORES_ESTADO[cita.estado] || '#3b82f6',
        borderColor: 'transparent',
        textColor: '#ffffff',
        extendedProps: { cita }
      });
    });
  }

  aplicarFiltros(): void {
    let filtradas = [...this.citas];

    if (this.filtroDoctorId) {
      filtradas = filtradas.filter(c => c.idDoctor === this.filtroDoctorId);
    }
    if (this.filtroEstado) {
      filtradas = filtradas.filter(c => c.estado === this.filtroEstado);
    }
    if (this.filtroFechaInicio) {
      filtradas = filtradas.filter(c => c.fecha >= this.filtroFechaInicio!);
    }
    if (this.filtroFechaFin) {
      filtradas = filtradas.filter(c => c.fecha <= this.filtroFechaFin!);
    }

    filtradas.sort((a, b) => {
      if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
      return a.horaInicio.localeCompare(b.horaInicio);
    });

    this.citasFiltradas = filtradas;
    this.citasAgrupadas = this.agruparCitas(filtradas);
  }

  private agruparCitas(citas: Cita[]): GrupoCitas[] {
    const grupos: GrupoCitas[] = [];
    const hoy = this.dateToString(new Date());
    const manana = this.dateToString(this.addDays(new Date(), 1));
    let currentDate = '';
    let currentGroup: GrupoCitas | null = null;

    for (const c of citas) {
      if (c.fecha !== currentDate) {
        currentDate = c.fecha;
        const esHoy = c.fecha === hoy;
        const esManana = c.fecha === manana;
        let titulo: string;
        if (esHoy) {
          titulo = 'Hoy';
        } else if (esManana) {
          titulo = 'Mañana';
        } else {
          titulo = this.formatearFecha(c.fecha);
        }
        currentGroup = { titulo, fecha: c.fecha, esHoy, esManana, citas: [] };
        grupos.push(currentGroup);
      }
      currentGroup!.citas.push(c);
    }
    return grupos;
  }

  trackByGrupo(_: number, g: GrupoCitas): string {
    return g.fecha;
  }

  trackByCita(_: number, c: Cita): number {
    return c.id;
  }

  irAHoy(): void {
    const hoy = new Date();
    this.filtroFechaInicio = this.dateToString(hoy);
    this.filtroFechaFin = this.dateToString(hoy);
    this.aplicarFiltros();
  }

  irAManana(): void {
    const manana = this.addDays(new Date(), 1);
    this.filtroFechaInicio = this.dateToString(manana);
    this.filtroFechaFin = this.dateToString(manana);
    this.aplicarFiltros();
  }

  irAEstaSemana(): void {
    const hoy = new Date();
    const diaSem = hoy.getDay();
    const lunes = this.addDays(hoy, -((diaSem + 6) % 7));
    const domingo = this.addDays(lunes, 6);
    this.filtroFechaInicio = this.dateToString(lunes);
    this.filtroFechaFin = this.dateToString(domingo);
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.filtroDoctorId = null;
    this.filtroEstado = null;
    const hoy = new Date();
    this.filtroFechaInicio = this.dateToString(hoy);
    const fin = this.addDays(hoy, 7);
    this.filtroFechaFin = this.dateToString(fin);
    this.aplicarFiltros();
  }

  onChangeEstado(cita: Cita, nuevoEstado: string): void {
    if (cita.estado === nuevoEstado) return;
    this.cambiandoEstadoId = cita.id;
    const dto: CitaEstadoRequest = { estado: nuevoEstado };
    this.citaService.cambiarEstado(cita.id, dto).subscribe({
      next: () => {
        cita.estado = nuevoEstado;
        this.cambiandoEstadoId = null;
        this.aplicarFiltros();
        if (this.calendar) this.actualizarEventos();
      },
      error: () => {
        this.cambiandoEstadoId = null;
      }
    });
  }

  editarCita(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.showForm = true;
  }

  confirmarEliminar(cita: Cita): void {
    if (confirm(`¿Eliminar la cita de ${cita.nombrePaciente} el ${cita.fecha}?`)) {
      this.citaService.eliminar(cita.id).subscribe({
        next: () => {
          this.citas = this.citas.filter(c => c.id !== cita.id);
          this.aplicarFiltros();
          if (this.calendar) this.actualizarEventos();
        }
      });
    }
  }

  abrirFormularioNuevo(): void {
    this.citaSeleccionada = undefined;
    this.showForm = true;
  }

  cerrarFormulario(): void {
    this.showForm = false;
    this.citaSeleccionada = undefined;
  }

  onGuardar(dto: CitaRequest): void {
    this.enviando = true;
    const request = this.citaSeleccionada
      ? this.citaService.actualizar(this.citaSeleccionada.id, dto)
      : this.citaService.crear(dto);

    request.subscribe({
      next: () => {
        this.enviando = false;
        this.cerrarFormulario();
        this.cargarDatos();
      },
      error: () => {
        this.enviando = false;
      }
    });
  }

  private dateToString(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private addDays(d: Date, days: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
  }

  private formatearFecha(fecha: string): string {
    const [y, m, d] = fecha.split('-');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`;
  }
}
