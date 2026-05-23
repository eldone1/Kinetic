import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 animate-fade-in">
      <div class="max-w-3xl mx-auto glass-card-strong rounded-2xl p-8">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            &#128100;
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800 font-heading">{{ editando ? 'Editar Paciente' : 'Nuevo Paciente' }}</h2>
            <p class="text-gray-400 text-sm">{{ editando ? 'Modifica los datos del paciente' : 'Registra un nuevo paciente en el sistema' }}</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Tipo Documento</label>
              <select formControlName="tipoDocumento"
                class="input-field bg-white">
                <option value="">Seleccione</option>
                <option value="DNI">DNI</option>
                <option value="CE">Carné de Extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">N° Documento</label>
              <input formControlName="numeroDocumento" maxlength="12" placeholder="N° de documento"
                class="input-field"
                [class.input-field-error]="form.get('numeroDocumento')?.invalid && form.get('numeroDocumento')?.touched" />
              <span class="text-xs text-red-500 mt-1 font-medium" *ngIf="form.get('numeroDocumento')?.invalid && form.get('numeroDocumento')?.touched">
                Documento obligatorio (máx. 12 caracteres)
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Nombres</label>
              <input formControlName="nombres" placeholder="Nombres"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Apellidos</label>
              <input formControlName="apellidos" placeholder="Apellidos"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Fecha de Nacimiento</label>
              <input type="date" formControlName="fechaNacimiento"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Sexo</label>
              <select formControlName="sexo"
                class="input-field bg-white">
                <option value="">Seleccione</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Teléfono</label>
              <input formControlName="telefono" placeholder="999 999 999"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Correo</label>
              <input type="email" formControlName="correo" placeholder="paciente@correo.com"
                class="input-field" />
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Dirección</label>
              <input formControlName="direccion" placeholder="Dirección completa"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Ocupación</label>
              <input formControlName="ocupacion" placeholder="Ocupación"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Contacto de Emergencia</label>
              <input formControlName="contactoEmergencia" placeholder="Nombre y teléfono"
                class="input-field" />
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Observaciones</label>
              <textarea formControlName="observaciones" rows="3" placeholder="Observaciones médicas..."
                class="input-field resize-none"></textarea>
            </div>
          </div>

          <div class="mt-8 flex gap-3">
            <button type="submit" [disabled]="form.invalid || loading"
              class="btn-primary">
              <span *ngIf="loading" class="inline-block mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
            <button routerLink="/pacientes"
              class="btn-secondary">
              Cancelar
            </button>
          </div>

          <p *ngIf="mensaje" class="mt-4 text-sm font-medium text-center animate-fade-in"
             [class.text-green-600]="exito" [class.text-red-600]="!exito">{{ mensaje }}</p>
        </form>
      </div>
    </div>
  `
})
export class PacienteFormComponent implements OnInit {
  form: FormGroup;
  editando = false;
  pacienteId?: number;
  loading = false;
  mensaje = '';
  exito = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.maxLength(12)]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: [''],
      sexo: [''],
      telefono: [''],
      correo: [''],
      direccion: [''],
      ocupacion: [''],
      contactoEmergencia: [''],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editando = true;
        this.pacienteId = +params['id'];
        this.pacienteService.buscarPorId(this.pacienteId).subscribe(p => {
          this.form.patchValue({
            tipoDocumento: p.tipoDocumento,
            numeroDocumento: p.numeroDocumento,
            nombres: p.nombres,
            apellidos: p.apellidos,
            fechaNacimiento: p.fechaNacimiento,
            sexo: p.sexo,
            telefono: p.telefono,
            correo: p.correo,
            direccion: p.direccion,
            ocupacion: p.ocupacion,
            contactoEmergencia: p.contactoEmergencia,
            observaciones: p.observaciones
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.mensaje = '';

    const dto = this.form.value;

    const request = this.editando
      ? this.pacienteService.actualizar(this.pacienteId!, dto)
      : this.pacienteService.crear(dto);

    request.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Paciente actualizado' : 'Paciente creado';
        this.exito = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/pacientes']), 1000);
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al guardar';
        this.exito = false;
        this.loading = false;
      }
    });
  }
}
