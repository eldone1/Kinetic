import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { DashboardAdminComponent } from './dashboard-admin.component';
import { DashboardDoctorComponent } from './dashboard-doctor.component';
import { DashboardRecepcionComponent } from './dashboard-recepcion.component';

@Component({
  selector: 'app-dashboard-wrapper',
  standalone: true,
  imports: [CommonModule, DashboardAdminComponent, DashboardDoctorComponent, DashboardRecepcionComponent],
  template: `
    <app-dashboard-admin *ngIf="rol === 'ROLE_ADMIN'"></app-dashboard-admin>
    <app-dashboard-doctor *ngIf="rol === 'ROLE_DOCTOR'"></app-dashboard-doctor>
    <app-dashboard-recepcion *ngIf="rol === 'ROLE_RECEPCION'"></app-dashboard-recepcion>
  `
})
export class DashboardWrapperComponent {
  rol: string;

  constructor(auth: AuthService) {
    this.rol = auth.getUserRole() || '';
  }
}
