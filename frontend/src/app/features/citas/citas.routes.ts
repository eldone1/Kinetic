import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const citasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cita-list/cita-list.component').then(m => m.CitaListComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN', 'ROLE_RECEPCION', 'ROLE_DOCTOR'])]
  }
];
