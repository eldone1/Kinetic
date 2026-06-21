import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const serviciosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./servicio-list/servicio-list.component').then(m => m.ServicioListComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./servicio-form/servicio-form.component').then(m => m.ServicioFormComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./servicio-form/servicio-form.component').then(m => m.ServicioFormComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])]
  }
];
