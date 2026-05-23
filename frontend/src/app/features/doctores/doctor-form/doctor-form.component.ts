import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../core/services/doctor.service';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto mt-6 p-8 bg-white rounded-xl shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ editando ? 'Editar Doctor' : 'Nuevo Doctor' }}</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
            <input formControlName="nombres"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            <span class="text-xs text-red-500" *ngIf="form.get('nombres')?.invalid && form.get('nombres')?.touched">
              Nombre obligatorio
            </span>
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
            <input formControlName="apellidos"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            <span class="text-xs text-red-500" *ngIf="form.get('apellidos')?.invalid && form.get('apellidos')?.touched">
              Apellidos obligatorios
            </span>
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">DNI</label>
            <input formControlName="dni" maxlength="8"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              [class.border-red-400]="form.get('dni')?.invalid && form.get('dni')?.touched" />
            <span class="text-xs text-red-500" *ngIf="form.get('dni')?.invalid && form.get('dni')?.touched">
              DNI obligatorio (8 dígitos)
            </span>
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">CMP</label>
            <input formControlName="cmp"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
            <input formControlName="especialidad"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input formControlName="telefono"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="col-span-2 mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input type="email" formControlName="correo"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button type="submit" [disabled]="form.invalid || loading"
            class="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            <span *ngIf="loading" class="inline-block animate-spin mr-2">&#9696;</span>
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
          <button routerLink="/doctores"
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
export class DoctorFormComponent implements OnInit {
  form: FormGroup;
  editando = false;
  doctorId?: number;
  loading = false;
  mensaje = '';
  exito = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      especialidad: [''],
      cmp: [''],
      telefono: [''],
      correo: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editando = true;
        this.doctorId = +params['id'];
        this.doctorService.buscarPorId(this.doctorId).subscribe(d => {
          this.form.patchValue({
            nombres: d.nombres,
            apellidos: d.apellidos,
            dni: d.dni,
            especialidad: d.especialidad,
            cmp: d.cmp,
            telefono: d.telefono,
            correo: d.correo
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
      ? this.doctorService.actualizar(this.doctorId!, dto)
      : this.doctorService.crear(dto);

    request.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Doctor actualizado' : 'Doctor creado';
        this.exito = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/doctores']), 1000);
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al guardar';
        this.exito = false;
        this.loading = false;
      }
    });
  }
}
