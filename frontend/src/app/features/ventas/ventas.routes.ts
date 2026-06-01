import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const ventasRoutes: Routes = [
  {
    path: 'caja-apertura',
    loadComponent: () => import('./caja-apertura/caja-apertura.component').then(m => m.CajaAperturaComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN', 'ROLE_RECEPCION'])]
  },
  {
    path: 'cobro',
    loadComponent: () => import('./cobro/cobro.component').then(m => m.CobroComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN', 'ROLE_RECEPCION'])]
  },
  {
    path: 'cierre/:id',
    loadComponent: () => import('./cierre/cierre.component').then(m => m.CierreComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN', 'ROLE_RECEPCION'])]
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin-cajas/admin-cajas.component').then(m => m.AdminCajasComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () => import('./cobro/cobro.component').then(m => m.CobroComponent)
  }
];
