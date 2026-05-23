import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const pacientesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./paciente-list/paciente-list.component').then(m => m.PacienteListComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN', 'ROLE_RECEPCION', 'ROLE_DOCTOR'])]
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./paciente-form/paciente-form.component').then(m => m.PacienteFormComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN', 'ROLE_RECEPCION'])]
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./paciente-form/paciente-form.component').then(m => m.PacienteFormComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN', 'ROLE_RECEPCION'])]
  }
];
