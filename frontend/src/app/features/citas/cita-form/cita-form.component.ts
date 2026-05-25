import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cita, CitaRequest } from '../../../models/cita.model';
import { Paciente } from '../../../models/paciente.model';
import { Doctor } from '../../../models/doctor.model';

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
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1.5">Paciente</label>
                <select formControlName="idPaciente"
                  class="input-field bg-white">
                  <option value="">Seleccione paciente</option>
                  <option *ngFor="let p of pacientes" [value]="p.id">{{ p.nombres }} {{ p.apellidos }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1.5">Doctor</label>
                <select formControlName="idDoctor"
                  class="input-field bg-white">
                  <option value="">Seleccione doctor</option>
                  <option *ngFor="let d of doctores" [value]="d.id">{{ d.nombres }} {{ d.apellidos }}</option>
                </select>
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
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Tipo</label>
              <select formControlName="tipo"
                class="input-field bg-white">
                <option value="CITA">Cita</option>
                <option value="EVALUACION">Evaluaci&oacute;n</option>
                <option value="REVALORACION">Revaloraci&oacute;n</option>
                <option value="SESION">Sesi&oacute;n</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Observaciones</label>
              <textarea formControlName="observaciones" rows="2" placeholder="Notas adicionales..."
                class="input-field resize-none"></textarea>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
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
  @Input() enviando = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<CitaRequest>();

  form: FormGroup;
  editando = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      idPaciente: ['', Validators.required],
      idDoctor: ['', Validators.required],
      fecha: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      tipo: ['CITA', Validators.required],
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
        tipo: this.cita.tipo,
        observaciones: this.cita.observaciones
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const dto: CitaRequest = {
      idPaciente: +this.form.value.idPaciente,
      idDoctor: +this.form.value.idDoctor,
      fecha: this.form.value.fecha,
      horaInicio: this.form.value.horaInicio + ':00',
      horaFin: this.form.value.horaFin + ':00',
      tipo: this.form.value.tipo,
      observaciones: this.form.value.observaciones || undefined
    };

    this.guardar.emit(dto);
  }
}
