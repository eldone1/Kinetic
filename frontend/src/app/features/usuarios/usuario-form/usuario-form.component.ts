import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/services/usuario.service';
import { RolService } from '../../../core/services/rol.service';
import { Rol } from '../../../models/rol.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 animate-fade-in">
      <div class="max-w-2xl mx-auto glass-card-strong rounded-2xl p-8">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            &#128272;
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800 font-heading">{{ editando ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
            <p class="text-gray-400 text-sm">{{ editando ? 'Modifica los datos del usuario' : 'Registra un nuevo usuario en el sistema' }}</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Username</label>
              <input formControlName="username" placeholder="Nombre de usuario"
                class="input-field"
                [class.input-field-error]="form.get('username')?.invalid && form.get('username')?.touched" />
              <span class="text-xs text-red-500 mt-1 font-medium" *ngIf="form.get('username')?.invalid && form.get('username')?.touched">
                Username obligatorio (3-50 caracteres)
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input type="email" formControlName="email" placeholder="correo@clinica.com"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Nombre</label>
              <input formControlName="nombre" placeholder="Nombres"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Apellidos</label>
              <input formControlName="apellidos" placeholder="Apellidos"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Teléfono</label>
              <input formControlName="telefono" placeholder="999 999 999"
                class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Rol</label>
              <select formControlName="idRol"
                class="input-field bg-white">
                <option value="">Seleccione un rol</option>
                <option *ngFor="let r of roles" [value]="r.id">{{ r.descripcion }}</option>
              </select>
            </div>

            <div class="col-span-2" *ngIf="!editando">
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Contraseña</label>
              <input type="password" formControlName="password" placeholder="Mín. 6 caracteres"
                class="input-field"
                [class.input-field-error]="form.get('password')?.invalid && form.get('password')?.touched" />
              <span class="text-xs text-red-500 mt-1 font-medium" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
                Contraseña obligatoria (mín. 6 caracteres)
              </span>
            </div>
          </div>

          <div class="mt-8 flex gap-3">
            <button type="submit" [disabled]="form.invalid || loading"
              class="btn-primary">
              <span *ngIf="loading" class="inline-block mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
            <button routerLink="/usuarios"
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
export class UsuarioFormComponent implements OnInit {
  form: FormGroup;
  editando = false;
  usuarioId?: number;
  roles: Rol[] = [];
  loading = false;
  mensaje = '';
  exito = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: [''],
      idRol: ['', Validators.required],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.rolService.listarTodos().subscribe(data => this.roles = data);

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editando = true;
        this.usuarioId = +params['id'];
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
        this.usuarioService.buscarPorId(this.usuarioId).subscribe(u => {
          this.form.patchValue({
            username: u.username,
            email: u.email,
            nombre: u.nombre,
            apellidos: u.apellidos,
            telefono: u.telefono,
            idRol: this.roles.find(r => r.nombre === u.rol)?.id || ''
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
      ? this.usuarioService.actualizar(this.usuarioId!, dto)
      : this.usuarioService.crear(dto);

    request.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Usuario actualizado' : 'Usuario creado';
        this.exito = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/usuarios']), 1000);
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al guardar';
        this.exito = false;
        this.loading = false;
      }
    });
  }
}
