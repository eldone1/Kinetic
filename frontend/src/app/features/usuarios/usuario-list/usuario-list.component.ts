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
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Usuarios del Sistema</h2>
        <button routerLink="/usuarios/nuevo"
          class="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Nuevo Usuario
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden" *ngIf="usuarios.length > 0; else empty">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b">
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Usuario</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Nombre</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Rol</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Estado</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of usuarios" class="border-b last:border-0 hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ u.username }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ u.nombre }} {{ u.apellidos }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ u.email }}</td>
              <td class="px-4 py-3 text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-medium"
                  [class.bg-primary-100]="u.rol === 'ROLE_ADMIN'"
                  [class.bg-blue-100]="u.rol === 'ROLE_RECEPCION'"
                  [class.bg-amber-100]="u.rol === 'ROLE_DOCTOR'"
                  [class.text-primary-700]="u.rol === 'ROLE_ADMIN'"
                  [class.text-blue-700]="u.rol === 'ROLE_RECEPCION'"
                  [class.text-amber-700]="u.rol === 'ROLE_DOCTOR'">
                  {{ u.rol === 'ROLE_ADMIN' ? 'Admin' : u.rol === 'ROLE_RECEPCION' ? 'Recepción' : 'Doctor' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">
                <span class="inline-flex items-center gap-1" [class.text-green-600]="u.activo" [class.text-red-600]="!u.activo">
                  <span class="w-2 h-2 rounded-full" [class.bg-green-500]="u.activo" [class.bg-red-500]="!u.activo"></span>
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm space-x-2">
                <button [routerLink]="['/usuarios', u.id, 'editar']"
                  class="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-xs font-medium hover:bg-sky-100 transition-colors">
                  Editar
                </button>
                <button (click)="toggleEstado(u)"
                  class="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors">
                  {{ u.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button (click)="eliminar(u)"
                  class="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #empty>
        <div class="bg-white rounded-xl shadow-sm p-12 text-center">
          <p class="text-gray-400 text-lg">No hay usuarios registrados.</p>
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
