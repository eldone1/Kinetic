import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen overflow-hidden">
      <aside class="w-64 bg-primary-900 text-white flex flex-col shrink-0">
        <div class="p-5 border-b border-primary-700">
          <h1 class="text-xl font-bold font-heading">Kinetic Rehab</h1>
          <p class="text-primary-300 text-xs mt-0.5">Centro de Rehabilitaci&oacute;n</p>
        </div>

        <nav class="flex-1 overflow-y-auto py-2">
          <div *ngFor="let item of menuItems">
            <a *ngIf="tieneRol(item.roles) && !item.children"
              [routerLink]="item.route"
              routerLinkActive="bg-primary-700 text-white"
              class="flex items-center gap-3 px-5 py-2.5 text-sm text-primary-200 hover:bg-primary-800 hover:text-white transition-colors">
              <span class="text-lg w-5 text-center" [innerHTML]="item.icon"></span>
              {{ item.label }}
            </a>

            <div *ngIf="tieneRol(item.roles) && item.children">
              <div class="px-5 pt-4 pb-1 text-xs font-semibold text-primary-400 uppercase tracking-wider">
                {{ item.label }}
              </div>
              <a *ngFor="let child of item.children"
                [routerLink]="child.route"
                routerLinkActive="bg-primary-700 text-white"
                class="flex items-center gap-3 pl-10 pr-5 py-2 text-sm text-primary-200 hover:bg-primary-800 hover:text-white transition-colors">
                <span class="text-base w-4 text-center" [innerHTML]="child.icon"></span>
                {{ child.label }}
              </a>
            </div>
          </div>
        </nav>

        <div class="p-4 border-t border-primary-700">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold">
              {{ usuarioInicial }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ nombreUsuario }}</p>
              <p class="text-xs text-primary-300 truncate">{{ rolUsuario }}</p>
            </div>
          </div>
          <button (click)="cerrarSesion()"
            class="w-full py-2 text-sm text-primary-300 hover:text-white bg-primary-800 hover:bg-primary-700 rounded-lg transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main class="flex-1 overflow-y-auto bg-gray-50">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class LayoutComponent {
  nombreUsuario = '';
  rolUsuario = '';
  usuarioInicial = '';

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: '&#9632;',
      route: '/dashboard',
      roles: ['ROLE_ADMIN', 'ROLE_RECEPCION', 'ROLE_DOCTOR']
    },
    {
      label: 'Gestión',
      icon: '',
      route: '',
      roles: ['ROLE_ADMIN', 'ROLE_RECEPCION', 'ROLE_DOCTOR'],
      children: [
        { label: 'Pacientes', icon: '&#9632;', route: '/pacientes', roles: ['ROLE_ADMIN', 'ROLE_RECEPCION', 'ROLE_DOCTOR'] },
        { label: 'Doctores', icon: '&#9632;', route: '/doctores', roles: ['ROLE_ADMIN', 'ROLE_RECEPCION'] },
        { label: 'Agenda y Citas', icon: '&#9632;', route: '/agenda', roles: ['ROLE_ADMIN', 'ROLE_RECEPCION', 'ROLE_DOCTOR'] },
      ]
    },
    {
      label: 'Clínico',
      icon: '',
      route: '',
      roles: ['ROLE_ADMIN', 'ROLE_DOCTOR'],
      children: [
        { label: 'Historias Clínicas', icon: '&#9632;', route: '/historias-clinicas', roles: ['ROLE_ADMIN', 'ROLE_DOCTOR'] },
      ]
    },
    {
      label: 'Ventas',
      icon: '',
      route: '',
      roles: ['ROLE_ADMIN', 'ROLE_RECEPCION'],
      children: [
        { label: 'Ventas y Caja', icon: '&#9632;', route: '/ventas', roles: ['ROLE_ADMIN', 'ROLE_RECEPCION'] },
        { label: 'Inventario', icon: '&#9632;', route: '/inventario', roles: ['ROLE_ADMIN', 'ROLE_RECEPCION'] },
      ]
    },
    {
      label: 'Reportes',
      icon: '&#9632;',
      route: '/reportes',
      roles: ['ROLE_ADMIN']
    },
    {
      label: 'Usuarios',
      icon: '&#9632;',
      route: '/usuarios',
      roles: ['ROLE_ADMIN']
    },
    {
      label: 'Cambiar Contraseña',
      icon: '&#9632;',
      route: '/cambio-password',
      roles: ['ROLE_ADMIN', 'ROLE_RECEPCION', 'ROLE_DOCTOR']
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const role = this.authService.getUserRole() || '';
    const name = localStorage.getItem('user_name') || 'Usuario';
    this.nombreUsuario = name;
    this.usuarioInicial = name.charAt(0).toUpperCase();
    this.rolUsuario = this.formatearRol(role);
  }

  formatearRol(rol: string): string {
    const roles: Record<string, string> = {
      'ROLE_ADMIN': 'Administrador',
      'ROLE_RECEPCION': 'Recepción',
      'ROLE_DOCTOR': 'Doctor'
    };
    return roles[rol] || rol;
  }

  tieneRol(roles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return !!userRole && roles.includes(userRole);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
