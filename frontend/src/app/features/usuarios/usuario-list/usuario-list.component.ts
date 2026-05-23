import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 animate-fade-in">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-heading">Usuarios del Sistema</h2>
          <p class="text-gray-500 text-sm mt-0.5">Gestión de accesos y roles</p>
        </div>
        <button routerLink="/usuarios/nuevo"
          class="btn-primary">
          + Nuevo Usuario
        </button>
      </div>

      <div class="glass-card-strong rounded-2xl overflow-hidden" *ngIf="usuarios.length > 0; else empty">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let u of usuarios" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 text-sm font-medium text-gray-900 font-mono">{{ u.username }}</td>
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {{ u.nombre.charAt(0) }}{{ u.apellidos.charAt(0) }}
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ u.nombre }} {{ u.apellidos }}</span>
                  </div>
                </td>
                <td class="px-5 py-4 text-sm text-gray-600">{{ u.email }}</td>
                <td class="px-5 py-4 text-sm">
                  <span class="badge"
                    [class.badge-admin]="u.rol === 'ROLE_ADMIN'"
                    [class.badge-recepcion]="u.rol === 'ROLE_RECEPCION'"
                    [class.badge-doctor]="u.rol === 'ROLE_DOCTOR'">
                    {{ u.rol === 'ROLE_ADMIN' ? 'Admin' : u.rol === 'ROLE_RECEPCION' ? 'Recepción' : 'Doctor' }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <span class="badge" [class.badge-active]="u.activo" [class.badge-inactive]="!u.activo">
                    <span class="w-1.5 h-1.5 rounded-full" [class.bg-emerald-500]="u.activo" [class.bg-red-500]="!u.activo"></span>
                    {{ u.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-1.5">
                    <button [routerLink]="['/usuarios', u.id, 'editar']"
                      class="btn-ghost">
                      Editar
                    </button>
                    <button (click)="toggleEstado(u)"
                      class="relative inline-flex items-center cursor-pointer focus:outline-none bg-transparent border-0 p-0">
                      <span class="w-10 h-5 rounded-full transition-colors duration-200"
                        [class.bg-primary-600]="u.activo" [class.bg-gray-300]="!u.activo"></span>
                      <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                        [class.translate-x-5]="u.activo"></span>
                    </button>
                    <button (click)="eliminar(u)"
                      class="btn-danger ml-1">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ng-template #empty>
        <div class="glass-card-strong rounded-2xl p-16 text-center animate-fade-in">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl text-gray-300">&#128272;</span>
          </div>
          <p class="text-gray-400 text-lg font-medium">No hay usuarios registrados</p>
          <p class="text-gray-300 text-sm mt-1">Comienza agregando un nuevo usuario</p>
        </div>
      </ng-template>
    </div>
  `
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listarTodos().subscribe(data => this.usuarios = data);
  }

  toggleEstado(u: Usuario): void {
    this.usuarioService.cambiarEstado(u.id, !u.activo).subscribe(() => this.cargarUsuarios());
  }

  eliminar(u: Usuario): void {
    if (confirm(`¿Eliminar al usuario ${u.username}?`)) {
      this.usuarioService.eliminar(u.id).subscribe(() => this.cargarUsuarios());
    }
  }
}
