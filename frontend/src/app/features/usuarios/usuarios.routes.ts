import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const usuariosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])]
  }
];
