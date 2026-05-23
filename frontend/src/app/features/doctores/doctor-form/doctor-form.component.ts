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
    <div class="p-6 animate-fade-in">
      <div class="max-w-2xl mx-auto glass-card-strong rounded-2xl p-8">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            &#128137;
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800 font-heading">{{ editando ? 'Editar Doctor' : 'Nuevo Doctor' }}</h2>
            <p class="text-gray-400 text-sm">{{ editando ? 'Modifica los datos del doctor' : 'Registra un nuevo doctor en el sistema' }}</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Nombres</label>
              <input formControlName="nombres" placeholder="Nombres"
                class="input-field" />
              <span class="text-xs text-red-500 mt-1 font-medium" *ngIf="form.get('nombres')?.invalid && form.get('nombres')?.touched">
                Nombre obligatorio
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Apellidos</label>
              <input formControlName="apellidos" placeholder="Apellidos"
                class="input-field" />
              <span class="text-xs text-red-500 mt-1 font-medium" *ngIf="form.get('apellidos')?.invalid && form.get('apellidos')?.touched">
                Apellidos obligatorios
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">DNI</label>
              <input formControlName="dni" maxlength="8" placeholder="12345678"
                class="input-field"
                [class.input-field-error]="form.get('dni')?.invalid && form.get('dni')?.touched" />
              <span class="text-xs text-red-500 mt-1 font-medium" *ngIf="form.get('dni')?.invalid && form.get('dni')?.touched">
                DNI obligatorio (8 dígitos)
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">CMP</label>
              <input formControlName="cmp" placeholder="N° colegiatura"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Especialidad</label>
              <input formControlName="especialidad" placeholder="Ej: Traumatología"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Teléfono</label>
              <input formControlName="telefono" placeholder="999 999 999"
                class="input-field" />
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Correo</label>
              <input type="email" formControlName="correo" placeholder="doctor@clinica.com"
                class="input-field" />
            </div>
          </div>

          <div class="mt-8 flex gap-3">
            <button type="submit" [disabled]="form.invalid || loading"
              class="btn-primary">
              <span *ngIf="loading" class="inline-block mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
            <button routerLink="/doctores"
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
