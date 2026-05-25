import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const historiasClinicasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./historia-clinica-list/historia-clinica-list.component').then(m => m.HistoriaClinicaListComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN', 'ROLE_DOCTOR'])]
  },
  {
    path: ':pacienteId',
    loadComponent: () => import('./historia-clinica-detalle/historia-clinica-detalle.component').then(m => m.HistoriaClinicaDetalleComponent),
    canActivate: [authGuard, () => roleGuard(['ROLE_ADMIN', 'ROLE_DOCTOR'])]
  }
];
