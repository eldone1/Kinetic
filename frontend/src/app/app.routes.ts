import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./core/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'usuarios',
        loadChildren: () => import('./features/usuarios/usuarios.routes').then(m => m.usuariosRoutes)
      },
      {
        path: 'pacientes',
        loadChildren: () => import('./features/pacientes/pacientes.routes').then(m => m.pacientesRoutes)
      },
      {
        path: 'doctores',
        loadChildren: () => import('./features/doctores/doctores.routes').then(m => m.doctoresRoutes)
      },
      {
        path: 'agenda',
        loadChildren: () => import('./features/citas/citas.routes').then(m => m.citasRoutes)
      },
      {
        path: 'historias-clinicas',
        loadChildren: () => import('./features/historias-clinicas/historias-clinicas.routes').then(m => m.historiasClinicasRoutes)
      },
      {
        path: 'ventas',
        loadChildren: () => import('./features/ventas/ventas.routes').then(m => m.ventasRoutes)
      },
      {
        path: 'cambio-password',
        loadComponent: () => import('./features/auth/cambio-password/cambio-password.component').then(m => m.CambioPasswordComponent)
      },
      { path: '', redirectTo: '/pacientes', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
