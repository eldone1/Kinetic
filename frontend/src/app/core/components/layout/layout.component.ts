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
    <div class="flex h-screen overflow-hidden bg-gray-50">
      <aside class="w-64 flex flex-col shrink-0 border-r border-gray-200/60"
        style="background: linear-gradient(180deg, #0d9488 0%, #115e59 30%, #134e4a 70%, #0f172a 100%);">
        <div class="p-5 border-b border-white/10">
          <div class="flex items-center gap-3">
            <img src="assets/images/logo.png" alt="Kinetic Rehab" class="w-9 h-9 rounded-xl" />
            <div>
              <h1 class="text-base font-bold font-heading text-white">Kinetic Rehab</h1>
              <p class="text-white/50 text-[10px] leading-tight">Centro de Rehabilitaci&oacute;n</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto py-3 px-3 scrollbar-thin">
          <div *ngFor="let item of menuItems">
            <a *ngIf="tieneRol(item.roles) && !item.children"
              [routerLink]="item.route"
              routerLinkActive="bg-white/15 text-white shadow-sm"
              [routerLinkActiveOptions]="{exact:true}"
              class="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium"
              [class.rounded-xl]="true">
              <span class="w-5 h-5 flex items-center justify-center text-base shrink-0" [innerHTML]="item.icon"></span>
              <span>{{ item.label }}</span>
            </a>

            <div *ngIf="tieneRol(item.roles) && item.children" class="mb-2">
              <div class="px-3 pt-4 pb-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                {{ item.label }}
              </div>
              <a *ngFor="let child of item.children"
                [routerLink]="child.route"
                routerLinkActive="bg-white/15 text-white shadow-sm"
                class="flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium">
                <span class="w-5 h-5 flex items-center justify-center text-xs shrink-0" [innerHTML]="child.icon"></span>
                <span>{{ child.label }}</span>
              </a>
            </div>
          </div>
        </nav>

        <div class="p-4 border-t border-white/10" style="background: rgba(0,0,0,0.2);">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-300 to-teal-600 flex items-center justify-center text-sm font-bold shadow-lg text-white">
              {{ usuarioInicial }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate text-white/90">{{ nombreUsuario }}</p>
              <p class="text-[11px] text-white/40 truncate">{{ rolUsuario }}</p>
            </div>
          </div>
          <button (click)="cerrarSesion()"
            class="w-full py-2 text-sm text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 font-medium">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main class="flex-1 overflow-y-auto bg-gray-50/80">
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
