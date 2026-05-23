import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { Horario, HorarioRequest } from '../../../models/doctor.model';

@Component({
  selector: 'app-doctor-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto mt-6 p-8 bg-white rounded-xl shadow-md">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Horarios del Doctor</h2>
          <p class="text-gray-500 text-sm mt-1" *ngIf="doctorNombre">{{ doctorNombre }}</p>
        </div>
        <button routerLink="/doctores"
          class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
          Volver
        </button>
      </div>

      <div class="space-y-4 mb-6">
        <div *ngFor="let dia of dias; let i = index" class="border rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-semibold text-gray-700 w-32">{{ dia.nombre }}</label>
            <button (click)="agregarBloque(i)"
              class="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded hover:bg-primary-100 transition-colors">
              + Agregar bloque
            </button>
          </div>

          <div *ngFor="let bloque of dia.bloques; let j = index" class="flex items-center gap-3 mb-2">
            <input type="time" [(ngModel)]="bloque.horaInicio"
              class="w-32 px-2 py-1.5 border rounded text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            <span class="text-gray-400 text-sm">a</span>
            <input type="time" [(ngModel)]="bloque.horaFin"
              class="w-32 px-2 py-1.5 border rounded text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            <button (click)="quitarBloque(i, j)"
              class="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
          </div>

          <p *ngIf="dia.bloques.length === 0" class="text-xs text-gray-400 italic">Sin horario este día</p>
        </div>
      </div>

      <div class="flex gap-3">
        <button (click)="guardar()" [disabled]="loading"
          class="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
          <span *ngIf="loading" class="inline-block animate-spin mr-2">&#9696;</span>
          {{ loading ? 'Guardando...' : 'Guardar Horarios' }}
        </button>
      </div>

      <p *ngIf="mensaje" class="mt-4 text-sm font-medium text-center"
         [class.text-green-600]="exito" [class.text-red-600]="!exito">{{ mensaje }}</p>
    </div>
  `
})
export class DoctorHorariosComponent implements OnInit {
  doctorId!: number;
  doctorNombre = '';

  dias = [
    { clave: 'LUNES', nombre: 'Lunes', bloques: [] as HorarioRequest[] },
    { clave: 'MARTES', nombre: 'Martes', bloques: [] as HorarioRequest[] },
    { clave: 'MIERCOLES', nombre: 'Miércoles', bloques: [] as HorarioRequest[] },
    { clave: 'JUEVES', nombre: 'Jueves', bloques: [] as HorarioRequest[] },
    { clave: 'VIERNES', nombre: 'Viernes', bloques: [] as HorarioRequest[] },
    { clave: 'SABADO', nombre: 'Sábado', bloques: [] as HorarioRequest[] }
  ];

  loading = false;
  mensaje = '';
  exito = false;

  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = +params['id'];
      this.cargarHorarios();
    });
  }

  cargarHorarios(): void {
    this.doctorService.obtenerHorarios(this.doctorId).subscribe(data => {
      this.doctorNombre = `${data.nombres} ${data.apellidos}`;

      this.dias.forEach(dia => dia.bloques = []);

      data.horarios.forEach(h => {
        const dia = this.dias.find(d => d.clave === h.diaSemana);
        if (dia) {
          dia.bloques.push({
            diaSemana: h.diaSemana,
            horaInicio: h.horaInicio.substring(0, 5),
            horaFin: h.horaFin.substring(0, 5)
          });
        }
      });
    });
  }

  agregarBloque(diaIndex: number): void {
    const dia = this.dias[diaIndex];
    dia.bloques.push({
      diaSemana: dia.clave,
      horaInicio: '08:00',
      horaFin: '09:00'
    });
  }

  quitarBloque(diaIndex: number, bloqueIndex: number): void {
    this.dias[diaIndex].bloques.splice(bloqueIndex, 1);
  }

  guardar(): void {
    this.loading = true;
    this.mensaje = '';

    const horarios: HorarioRequest[] = [];
    this.dias.forEach(dia => {
      dia.bloques.forEach(b => {
        horarios.push({
          diaSemana: dia.clave,
          horaInicio: b.horaInicio + ':00',
          horaFin: b.horaFin + ':00'
        });
      });
    });

    this.doctorService.actualizarHorarios(this.doctorId, horarios).subscribe({
      next: () => {
        this.mensaje = 'Horarios guardados correctamente';
        this.exito = true;
        this.loading = false;
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al guardar horarios';
        this.exito = false;
        this.loading = false;
      }
    });
  }
}
