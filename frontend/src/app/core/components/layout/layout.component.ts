import { Component, HostListener } from '@angular/core';
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
    <!-- Overlay for mobile sidebar -->
    <div *ngIf="sidebarOpen" class="sidebar-overlay lg:hidden" (click)="sidebarOpen = false"></div>

    <div class="flex h-screen overflow-hidden bg-gray-50">
      <!-- Desktop Sidebar (always visible on lg+) -->
      <aside class="hidden lg:flex lg:flex-col lg:w-64 shrink-0 border-r border-white/10"
        style="background: linear-gradient(180deg, #0d9488 0%, #115e59 30%, #134e4a 70%, #0f172a 100%);">
        <div class="p-5 border-b border-white/10">
          <div class="flex items-center gap-3">
            <img src="assets/images/ologo.png" alt="Kinetic Rehab" class="w-9 h-9 rounded-xl" />
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
              class="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium">
              <span class="w-5 h-5 flex items-center justify-center text-base shrink-0" [innerHTML]="item.icon"></span>
              <span>{{ item.label }}</span>
            </a>

            <div *ngIf="tieneRol(item.roles) && item.children" class="mb-2">
              <div class="px-3 pt-4 pb-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                {{ item.label }}
              </div>
              <ng-container *ngFor="let child of item.children">
                <a *ngIf="tieneRol(child.roles)"
                  [routerLink]="child.route"
                  routerLinkActive="bg-white/15 text-white shadow-sm"
                  class="flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium">
                  <span class="w-5 h-5 flex items-center justify-center text-xs shrink-0" [innerHTML]="child.icon"></span>
                  <span>{{ child.label }}</span>
                </a>
              </ng-container>
            </div>
          </div>
        </nav>

        <div class="p-4 border-t border-white/10 shrink-0" style="background: rgba(0,0,0,0.2);">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-300 to-teal-600 flex items-center justify-center text-sm font-bold shadow-lg text-white">
              {{ usuarioInicial }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate text-white/90">{{ nombreUsuario }}</p>
              <p class="text-[11px] text-white/40 truncate">{{ rolUsuario }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Mobile Sidebar (overlay drawer) -->
      <aside *ngIf="sidebarOpen"
        class="fixed inset-y-0 left-0 z-40 flex flex-col w-72 max-w-[85vw] border-r border-white/10 animate-slide-right lg:hidden"
        style="background: linear-gradient(180deg, #0d9488 0%, #115e59 30%, #134e4a 70%, #0f172a 100%);">
        <div class="p-5 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="assets/images/ologo.png" alt="Kinetic Rehab" class="w-9 h-9 rounded-xl" />
            <div>
              <h1 class="text-base font-bold font-heading text-white">Kinetic Rehab</h1>
              <p class="text-white/50 text-[10px] leading-tight">Centro de Rehabilitaci&oacute;n</p>
            </div>
          </div>
          <button (click)="sidebarOpen = false" class="w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto py-3 px-3 scrollbar-thin">
          <div *ngFor="let item of menuItems" (click)="sidebarOpen = false">
            <a *ngIf="tieneRol(item.roles) && !item.children"
              [routerLink]="item.route"
              routerLinkActive="bg-white/15 text-white shadow-sm"
              [routerLinkActiveOptions]="{exact:true}"
              class="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium">
              <span class="w-5 h-5 flex items-center justify-center text-base shrink-0" [innerHTML]="item.icon"></span>
              <span>{{ item.label }}</span>
            </a>

            <div *ngIf="tieneRol(item.roles) && item.children" class="mb-2">
              <div class="px-3 pt-4 pb-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                {{ item.label }}
              </div>
              <ng-container *ngFor="let child of item.children">
                <a *ngIf="tieneRol(child.roles)"
                  [routerLink]="child.route"
                  routerLinkActive="bg-white/15 text-white shadow-sm"
                  class="flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium">
                  <span class="w-5 h-5 flex items-center justify-center text-xs shrink-0" [innerHTML]="child.icon"></span>
                  <span>{{ child.label }}</span>
                </a>
              </ng-container>
            </div>
          </div>
        </nav>

        <div class="p-4 border-t border-white/10 shrink-0" style="background: rgba(0,0,0,0.2);">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-300 to-teal-600 flex items-center justify-center text-sm font-bold shadow-lg text-white">
              {{ usuarioInicial }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate text-white/90">{{ nombreUsuario }}</p>
              <p class="text-[11px] text-white/40 truncate">{{ rolUsuario }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <header class="h-14 shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center gap-3 px-4 lg:px-6">
          <!-- Hamburger button (mobile only) -->
          <button (click)="sidebarOpen = !sidebarOpen"
            class="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 -ml-1 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

          <div class="flex-1"></div>

          <span class="hidden sm:inline text-xs text-gray-400 font-medium">{{ rolUsuario }}</span>
          <div class="relative">
            <button (click)="toggleDropdown()" class="flex items-center gap-2 focus:outline-none">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                {{ usuarioInicial }}
              </div>
            </button>

            <div *ngIf="dropdownOpen"
              class="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-scale-in origin-top-right">
              <div class="px-4 py-2 border-b border-gray-50">
                <p class="text-sm font-medium text-gray-800 truncate">{{ nombreUsuario }}</p>
                <p class="text-xs text-gray-400">{{ rolUsuario }}</p>
              </div>
              <a *ngIf="esDoctor" routerLink="/doctores/mi-perfil" (click)="dropdownOpen = false"
                class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <span class="text-teal-600">&#128100;</span>
                Mi Perfil
              </a>
              <a routerLink="/cambio-password" (click)="dropdownOpen = false"
                class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <span class="text-teal-600">&#128274;</span>
                Cambiar Contraseña
              </a>
              <div class="border-t border-gray-50 my-1"></div>
              <button (click)="cerrarSesion()"
                class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <span>&#10140;</span>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto bg-gray-50/80">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {
  sidebarOpen = false;
  nombreUsuario = '';
  rolUsuario = '';
  usuarioInicial = '';
  dropdownOpen = false;
  esDoctor = false;

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
        { label: 'Servicios', icon: '&#9632;', route: '/servicios', roles: ['ROLE_ADMIN'] },
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
    this.esDoctor = role === 'ROLE_DOCTOR';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative') && this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
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
