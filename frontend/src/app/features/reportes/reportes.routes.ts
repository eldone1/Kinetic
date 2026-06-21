import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const reportesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./reportes.component').then(m => m.ReportesComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])],
    data: { roles: ['ROLE_ADMIN'] }
  }
];
