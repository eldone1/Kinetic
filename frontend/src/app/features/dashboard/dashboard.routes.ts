import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-wrapper.component').then(m => m.DashboardWrapperComponent),
  }
];
