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
    <div class="max-w-3xl mx-auto mt-6 p-8 bg-white rounded-xl shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ editando ? 'Editar Paciente' : 'Nuevo Paciente' }}</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Documento</label>
            <select formControlName="tipoDocumento"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
              <option value="">Seleccione</option>
              <option value="DNI">DNI</option>
              <option value="CE">Carné de Extranjería</option>
              <option value="PASAPORTE">Pasaporte</option>
            </select>
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">N° Documento</label>
            <input formControlName="numeroDocumento" maxlength="12"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              [class.border-red-400]="form.get('numeroDocumento')?.invalid && form.get('numeroDocumento')?.touched" />
            <span class="text-xs text-red-500" *ngIf="form.get('numeroDocumento')?.invalid && form.get('numeroDocumento')?.touched">
              Documento obligatorio (máx. 12 caracteres)
            </span>
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
            <input formControlName="nombres"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
            <input formControlName="apellidos"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
            <input type="date" formControlName="fechaNacimiento"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
            <select formControlName="sexo"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
              <option value="">Seleccione</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input formControlName="telefono"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input type="email" formControlName="correo"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="col-span-2 mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input formControlName="direccion"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
            <input formControlName="ocupacion"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contacto de Emergencia</label>
            <input formControlName="contactoEmergencia"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="col-span-2 mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea formControlName="observaciones" rows="3"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button type="submit" [disabled]="form.invalid || loading"
            class="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            <span *ngIf="loading" class="inline-block animate-spin mr-2">&#9696;</span>
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
          <button routerLink="/pacientes"
            class="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
            Cancelar
          </button>
        </div>

        <p *ngIf="mensaje" class="mt-4 text-sm font-medium text-center"
           [class.text-green-600]="exito" [class.text-red-600]="!exito">{{ mensaje }}</p>
      </form>
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
