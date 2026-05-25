import { Component, ElementRef, OnDestroy, OnInit, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Cita, CitaRequest } from '../../../models/cita.model';
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

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, CitaFormComponent],
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

      <div class="flex gap-4 mb-5 flex-wrap">
        <div class="flex items-center gap-1.5 text-xs" *ngFor="let e of estados">
          <span class="w-2.5 h-2.5 rounded-full inline-block" [style.background]="e.color"></span>
          <span class="text-gray-500">{{ e.label }}</span>
        </div>
      </div>

      <div *ngIf="cargando" class="glass-card-strong rounded-2xl p-20 flex items-center justify-center">
        <div class="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!cargando" class="glass-card-strong rounded-2xl p-4 overflow-hidden">
        <div #calendarEl></div>
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

  estados = [
    { label: 'Programada', color: COLORES_ESTADO['PROGRAMADA'] },
    { label: 'Confirmada', color: COLORES_ESTADO['CONFIRMADA'] },
    { label: 'En Progreso', color: COLORES_ESTADO['EN_PROGRESO'] },
    { label: 'Completada', color: COLORES_ESTADO['COMPLETADA'] },
    { label: 'Cancelada', color: COLORES_ESTADO['CANCELADA'] },
    { label: 'No Asistió', color: COLORES_ESTADO['NO_ASISTIO'] },
  ];

  constructor(
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private doctorService: DoctorService,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.puedeEditar = role === 'ROLE_ADMIN' || role === 'ROLE_RECEPCION';
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.inicializarCalendar(), 100);
    });
  }

  ngOnDestroy(): void {
    this.calendar?.destroy();
  }

  private cargarDatos(): void {
    this.cargando = true;
    this.pacienteService.listarTodos().subscribe(p => this.pacientes = p);
    this.doctorService.listarDisponibles().subscribe(d => this.doctores = d);
    this.citaService.listarTodas().subscribe({
      next: (data) => {
        this.citas = data;
        this.cargando = false;
        setTimeout(() => this.actualizarEventos(), 50);
      },
      error: () => this.cargando = false
    });
  }

  private inicializarCalendar(): void {
    if (!this.calendarEl?.nativeElement) return;

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
}
