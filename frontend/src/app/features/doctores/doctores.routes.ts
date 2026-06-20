import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const doctoresRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./doctor-list/doctor-list.component').then(m => m.DoctorListComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN', 'ROLE_RECEPCION', 'ROLE_DOCTOR'])]
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./doctor-form/doctor-form.component').then(m => m.DoctorFormComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./doctor-form/doctor-form.component').then(m => m.DoctorFormComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: ':id/horarios',
    loadComponent: () => import('./doctor-horarios/doctor-horarios.component').then(m => m.DoctorHorariosComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN'])]
  },
  {
    path: 'mi-perfil',
    loadComponent: () => import('./doctor-perfil/doctor-perfil.component').then(m => m.DoctorPerfilComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_DOCTOR'])]
  }
];
