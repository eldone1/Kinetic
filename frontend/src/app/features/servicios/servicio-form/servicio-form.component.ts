import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../../core/services/servicio.service';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 animate-fade-in">
      <div class="max-w-2xl mx-auto glass-card-strong rounded-2xl p-8">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            &#128196;
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800 font-heading">{{ editando ? 'Editar Servicio' : 'Nuevo Servicio' }}</h2>
            <p class="text-gray-400 text-sm">{{ editando ? 'Modifica los datos del servicio' : 'Registra un nuevo servicio en el catálogo' }}</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-2 gap-5">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Nombre del Servicio</label>
              <input formControlName="nombre" placeholder="Ej: Terapia Física"
                class="input-field"
                [class.input-field-error]="form.get('nombre')?.invalid && form.get('nombre')?.touched" />
              <span class="text-xs text-red-500 mt-1 font-medium" *ngIf="form.get('nombre')?.invalid && form.get('nombre')?.touched">
                El nombre es obligatorio
              </span>
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Descripción</label>
              <textarea formControlName="descripcion" rows="3" placeholder="Descripción del servicio"
                class="input-field resize-none"></textarea>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Precio (S/)</label>
              <input type="number" step="0.01" min="0.01" formControlName="precio" placeholder="0.00"
                class="input-field"
                [class.input-field-error]="form.get('precio')?.invalid && form.get('precio')?.touched" />
              <span class="text-xs text-red-500 mt-1 font-medium" *ngIf="form.get('precio')?.invalid && form.get('precio')?.touched">
                Ingresa un precio válido mayor a 0
              </span>
            </div>

            <div class="col-span-1 flex items-end pb-1">
              <label class="flex items-center gap-3 cursor-pointer">
                <span class="text-sm font-medium text-gray-600">Servicio activo</span>
                <input type="checkbox" formControlName="activo"
                  class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              </label>
            </div>
          </div>

          <div class="mt-8 flex gap-3">
            <button type="submit" [disabled]="form.invalid || loading"
              class="btn-primary">
              <span *ngIf="loading" class="inline-block mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
            <button routerLink="/servicios"
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
export class ServicioFormComponent implements OnInit {
  form: FormGroup;
  editando = false;
  servicioId?: number;
  loading = false;
  mensaje = '';
  exito = false;

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editando = true;
        this.servicioId = +params['id'];
        this.servicioService.obtenerPorId(this.servicioId).subscribe(s => {
          this.form.patchValue({
            nombre: s.nombre,
            descripcion: s.descripcion,
            precio: s.precio,
            activo: s.activo
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.mensaje = '';

    const dto = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion || null,
      precio: this.form.value.precio,
      activo: this.form.value.activo
    };

    const request = this.editando
      ? this.servicioService.actualizar(this.servicioId!, dto)
      : this.servicioService.crear(dto);

    request.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Servicio actualizado' : 'Servicio creado';
        this.exito = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/servicios']), 1000);
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al guardar';
        this.exito = false;
        this.loading = false;
      }
    });
  }
}
