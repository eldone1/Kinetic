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
    <div class="p-6 animate-fade-in">
      <div class="max-w-3xl mx-auto glass-card-strong rounded-2xl p-8">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              &#128197;
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800 font-heading">Horarios del Doctor</h2>
              <p class="text-gray-400 text-sm" *ngIf="doctorNombre">{{ doctorNombre }}</p>
            </div>
          </div>
          <button routerLink="/doctores"
            class="btn-secondary text-sm">
            Volver
          </button>
        </div>

        <div class="space-y-4 mb-8">
          <div *ngFor="let dia of dias; let i = index" class="glass-card rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-semibold text-gray-700 font-heading">{{ dia.nombre }}</label>
              <button (click)="agregarBloque(i)"
                class="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-all duration-200 font-medium">
                + Agregar bloque
              </button>
            </div>

            <div *ngFor="let bloque of dia.bloques; let j = index" class="flex items-center gap-3 mb-2 last:mb-0">
              <input type="time" [(ngModel)]="bloque.horaInicio"
                class="w-32 px-3 py-1.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" />
              <span class="text-gray-300 text-sm">—</span>
              <input type="time" [(ngModel)]="bloque.horaFin"
                class="w-32 px-3 py-1.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" />
              <button (click)="quitarBloque(i, j)"
                class="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-lg">&times;</button>
            </div>

            <p *ngIf="dia.bloques.length === 0" class="text-xs text-gray-300 italic">Sin horario este día</p>
          </div>
        </div>

        <div class="flex gap-3">
          <button (click)="guardar()" [disabled]="loading"
            class="btn-primary">
            <span *ngIf="loading" class="inline-block mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ loading ? 'Guardando...' : 'Guardar Horarios' }}
          </button>
          <button routerLink="/doctores" class="btn-secondary">Cancelar</button>
        </div>

        <p *ngIf="mensaje" class="mt-4 text-sm font-medium text-center animate-fade-in"
           [class.text-green-600]="exito" [class.text-red-600]="!exito">{{ mensaje }}</p>
      </div>
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
