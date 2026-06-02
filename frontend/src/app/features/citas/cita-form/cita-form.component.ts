import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cita, CitaRequest } from '../../../models/cita.model';
import { Paciente } from '../../../models/paciente.model';
import { Doctor } from '../../../models/doctor.model';
import { Servicio } from '../../../models/servicio.model';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      (click)="cerrar.emit()">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in"
        (click)="$event.stopPropagation()">
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            &#128197;
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800 font-heading">{{ editando ? 'Editar Cita' : 'Nueva Cita' }}</h3>
            <p class="text-gray-400 text-sm">{{ editando ? 'Modifica los datos de la cita' : 'Registra una nueva cita en la agenda' }}</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="relative">
                <label class="block text-sm font-medium text-gray-600 mb-1.5">Paciente</label>
                <input #pacienteInput type="text"
                  [value]="pacienteDisplay"
                  (input)="onPacienteInput($event)"
                  (focus)="onPacienteFocus()"
                  (keydown)="onPacienteKeydown($event)"
                  placeholder="Buscar paciente..."
                  class="input-field"
                  autocomplete="off" />
                <input type="hidden" formControlName="idPaciente" />
                <div *ngIf="showPacienteDropdown && filteredPacientes.length > 0"
                  class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  <button type="button" *ngFor="let p of filteredPacientes; let i = index"
                    (click)="seleccionarPaciente(p)"
                    class="w-full text-left px-3 py-2.5 text-sm hover:bg-primary-50 transition-colors"
                    [class.bg-primary-50]="i === pacienteHighlightIndex">
                    <span class="font-medium text-gray-800">{{ p.nombres }} {{ p.apellidos }}</span>
                    <span class="text-gray-400 ml-2 text-xs">{{ p.numeroDocumento }}</span>
                  </button>
                </div>
                <div *ngIf="showPacienteDropdown && filteredPacientes.length === 0 && pacienteSearchText"
                  class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm text-gray-400">
                  Sin resultados
                </div>
              </div>
              <div class="relative">
                <label class="block text-sm font-medium text-gray-600 mb-1.5">Doctor</label>
                <input #doctorInput type="text"
                  [value]="doctorDisplay"
                  (input)="onDoctorInput($event)"
                  (focus)="onDoctorFocus()"
                  (keydown)="onDoctorKeydown($event)"
                  placeholder="Buscar doctor..."
                  class="input-field"
                  autocomplete="off" />
                <input type="hidden" formControlName="idDoctor" />
                <div *ngIf="showDoctorDropdown && filteredDoctores.length > 0"
                  class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  <button type="button" *ngFor="let d of filteredDoctores; let i = index"
                    (click)="seleccionarDoctor(d)"
                    class="w-full text-left px-3 py-2.5 text-sm hover:bg-primary-50 transition-colors"
                    [class.bg-primary-50]="i === doctorHighlightIndex">
                    <span class="font-medium text-gray-800">{{ d.nombres }} {{ d.apellidos }}</span>
                    <span class="text-gray-400 ml-2 text-xs">{{ d.especialidad || 'Sin especialidad' }}</span>
                  </button>
                </div>
                <div *ngIf="showDoctorDropdown && filteredDoctores.length === 0 && doctorSearchText"
                  class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm text-gray-400">
                  Sin resultados
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Fecha</label>
              <input type="date" formControlName="fecha"
                class="input-field" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1.5">Hora Inicio</label>
                <input type="time" formControlName="horaInicio"
                  class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1.5">Hora Fin</label>
                <input type="time" formControlName="horaFin"
                  class="input-field" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Servicio</label>
              <select formControlName="idServicio"
                class="input-field bg-white">
                <option [ngValue]="null" disabled>Seleccionar servicio...</option>
                <option *ngFor="let s of servicios" [ngValue]="s.id">
                  {{ s.nombre }} — S/ {{ s.precio }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Observaciones</label>
              <textarea formControlName="observaciones" rows="2" placeholder="Notas adicionales..."
                class="input-field resize-none"></textarea>
            </div>
          </div>

          <div *ngIf="errorMessage"
            class="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {{ errorMessage }}
          </div>

          <div class="mt-4 flex gap-3">
            <button type="submit" [disabled]="form.invalid || enviando"
              class="btn-primary">
              <span *ngIf="enviando" class="inline-block mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ enviando ? 'Guardando...' : 'Guardar' }}
            </button>
            <button type="button" (click)="cerrar.emit()" [disabled]="enviando"
              class="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CitaFormComponent implements OnInit {
  @Input() cita?: Cita;
  @Input() pacientes: Paciente[] = [];
  @Input() doctores: Doctor[] = [];
  @Input() servicios: Servicio[] = [];
  @Input() enviando = false;
  @Input() errorMessage: string | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<CitaRequest>();

  form: FormGroup;
  editando = false;

  pacienteSearchText = '';
  doctorSearchText = '';
  pacienteDisplay = '';
  doctorDisplay = '';
  showPacienteDropdown = false;
  showDoctorDropdown = false;
  pacienteHighlightIndex = -1;
  doctorHighlightIndex = -1;
  selectedPaciente: Paciente | null = null;
  selectedDoctor: Doctor | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      idPaciente: ['', Validators.required],
      idDoctor: ['', Validators.required],
      fecha: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      idServicio: [null, Validators.required],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    if (this.cita) {
      this.editando = true;
      this.form.patchValue({
        idPaciente: this.cita.idPaciente,
        idDoctor: this.cita.idDoctor,
        fecha: this.cita.fecha,
        horaInicio: this.cita.horaInicio.substring(0, 5),
        horaFin: this.cita.horaFin.substring(0, 5),
        idServicio: this.cita.idServicio,
        observaciones: this.cita.observaciones
      });
      const p = this.pacientes.find(x => x.id === this.cita!.idPaciente);
      if (p) {
        this.selectedPaciente = p;
        this.pacienteDisplay = `${p.nombres} ${p.apellidos}`;
      }
      const d = this.doctores.find(x => x.id === this.cita!.idDoctor);
      if (d) {
        this.selectedDoctor = d;
        this.doctorDisplay = `${d.nombres} ${d.apellidos}`;
      }
    }
  }

  @HostListener('document:click')
  cerrarDropdowns(): void {
    this.showPacienteDropdown = false;
    this.showDoctorDropdown = false;
  }

  get filteredPacientes(): Paciente[] {
    const t = this.pacienteSearchText.toLowerCase().trim();
    if (!t) return this.pacientes;
    return this.pacientes.filter(p =>
      p.nombres.toLowerCase().includes(t) ||
      p.apellidos.toLowerCase().includes(t) ||
      p.numeroDocumento.includes(t)
    );
  }

  get filteredDoctores(): Doctor[] {
    const t = this.doctorSearchText.toLowerCase().trim();
    if (!t) return this.doctores;
    return this.doctores.filter(d =>
      d.nombres.toLowerCase().includes(t) ||
      d.apellidos.toLowerCase().includes(t) ||
      (d.especialidad && d.especialidad.toLowerCase().includes(t))
    );
  }

  onPacienteInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.pacienteSearchText = v;
    this.selectedPaciente = null;
    this.form.patchValue({ idPaciente: '' });
    this.pacienteDisplay = v;
    this.showPacienteDropdown = true;
    this.pacienteHighlightIndex = -1;
  }

  onPacienteFocus(): void {
    if (!this.selectedPaciente) {
      this.showPacienteDropdown = true;
    }
  }

  onPacienteKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.pacienteHighlightIndex = Math.min(this.pacienteHighlightIndex + 1, this.filteredPacientes.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.pacienteHighlightIndex = Math.max(this.pacienteHighlightIndex - 1, -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.pacienteHighlightIndex >= 0 && this.filteredPacientes[this.pacienteHighlightIndex]) {
        this.seleccionarPaciente(this.filteredPacientes[this.pacienteHighlightIndex]);
      }
    } else if (e.key === 'Escape') {
      this.showPacienteDropdown = false;
    }
  }

  seleccionarPaciente(p: Paciente): void {
    this.selectedPaciente = p;
    this.pacienteDisplay = `${p.nombres} ${p.apellidos}`;
    this.pacienteSearchText = '';
    this.form.patchValue({ idPaciente: p.id });
    this.showPacienteDropdown = false;
    this.pacienteHighlightIndex = -1;
  }

  onDoctorInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.doctorSearchText = v;
    this.selectedDoctor = null;
    this.form.patchValue({ idDoctor: '' });
    this.doctorDisplay = v;
    this.showDoctorDropdown = true;
    this.doctorHighlightIndex = -1;
  }

  onDoctorFocus(): void {
    if (!this.selectedDoctor) {
      this.showDoctorDropdown = true;
    }
  }

  onDoctorKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.doctorHighlightIndex = Math.min(this.doctorHighlightIndex + 1, this.filteredDoctores.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.doctorHighlightIndex = Math.max(this.doctorHighlightIndex - 1, -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.doctorHighlightIndex >= 0 && this.filteredDoctores[this.doctorHighlightIndex]) {
        this.seleccionarDoctor(this.filteredDoctores[this.doctorHighlightIndex]);
      }
    } else if (e.key === 'Escape') {
      this.showDoctorDropdown = false;
    }
  }

  seleccionarDoctor(d: Doctor): void {
    this.selectedDoctor = d;
    this.doctorDisplay = `${d.nombres} ${d.apellidos}`;
    this.doctorSearchText = '';
    this.form.patchValue({ idDoctor: d.id });
    this.showDoctorDropdown = false;
    this.doctorHighlightIndex = -1;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const v = this.form.value;
    const dto: CitaRequest = {
      idPaciente: +v.idPaciente,
      idDoctor: +v.idDoctor,
      fecha: v.fecha,
      horaInicio: v.horaInicio + ':00',
      horaFin: v.horaFin + ':00',
      idServicio: +v.idServicio,
      observaciones: v.observaciones || undefined
    };

    this.guardar.emit(dto);
  }
}
