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
    <div class="max-w-2xl mx-auto mt-6 p-8 bg-white rounded-xl shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ editando ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input formControlName="username"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              [class.border-red-400]="form.get('username')?.invalid && form.get('username')?.touched" />
            <span class="text-xs text-red-500" *ngIf="form.get('username')?.invalid && form.get('username')?.touched">
              Username obligatorio (3-50 caracteres)
            </span>
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" formControlName="email"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input formControlName="nombre"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
            <input formControlName="apellidos"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input formControlName="telefono"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="mb-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select formControlName="idRol"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
              <option value="">Seleccione un rol</option>
              <option *ngFor="let r of roles" [value]="r.id">{{ r.descripcion }}</option>
            </select>
          </div>

          <div class="mb-1" *ngIf="!editando">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" formControlName="password"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              [class.border-red-400]="form.get('password')?.invalid && form.get('password')?.touched" />
            <span class="text-xs text-red-500" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
              Contraseña obligatoria (mín. 6 caracteres)
            </span>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button type="submit" [disabled]="form.invalid || loading"
            class="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            <span *ngIf="loading" class="inline-block animate-spin mr-2">&#9696;</span>
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
          <button routerLink="/usuarios"
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
