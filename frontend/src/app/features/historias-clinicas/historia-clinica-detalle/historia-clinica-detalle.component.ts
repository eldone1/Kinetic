import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Paciente } from '../../../models/paciente.model';
import { PacienteService } from '../../../core/services/paciente.service';
import { Doctor } from '../../../models/doctor.model';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  HistoriaClinica, HistoriaClinicaRequest,
  Evaluacion, EvaluacionRequest,
  Tratamiento, TratamientoRequest,
  Sesion, SesionRequest
} from '../../../models/historia-clinica.model';
import { HistoriaClinicaService } from '../../../core/services/historia-clinica.service';

type Tab = 'general' | 'evaluaciones' | 'tratamientos' | 'sesiones';

@Component({
  selector: 'app-historia-clinica-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="p-6 animate-fade-in" *ngIf="!cargando; else loading">
  <button (click)="volver()" class="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
    &larr; Volver a Historias Clínicas
  </button>

  <div class="glass-card-strong rounded-2xl p-5 mb-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
          {{ paciente?.nombres?.charAt(0) }}{{ paciente?.apellidos?.charAt(0) }}
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-800 font-heading">{{ paciente?.nombres }} {{ paciente?.apellidos }}</h2>
          <p class="text-sm text-gray-500">{{ paciente?.tipoDocumento }}: {{ paciente?.numeroDocumento }} | {{ paciente?.telefono || 'Sin teléfono' }}</p>
        </div>
      </div>
      <span class="badge" [class.badge-active]="hc" [class.badge-inactive]="!hc">
        {{ hc ? 'Historia Clínica Activa' : 'Sin Historia Clínica' }}
      </span>
    </div>
  </div>

  <!-- ========== CREAR HC ========== -->
  <div *ngIf="!hc" class="glass-card-strong rounded-2xl p-8">
    <h3 class="text-lg font-bold text-gray-800 font-heading mb-6">Aperturar Historia Clínica</h3>

    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">A. Información de Control Administrativo</div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Doctor / Consultor</label>
        <input type="text" [(ngModel)]="nuevaHc.doctorAsignado" class="input-field" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Especialidad</label>
        <input type="text" [(ngModel)]="nuevaHc.especialidad" class="input-field" placeholder="Fisioterapia" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Procedencia</label>
        <input type="text" [(ngModel)]="nuevaHc.procedencia" class="input-field" placeholder="Médico traumatólogo, recomendación..." />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
        <input type="text" [(ngModel)]="nuevaHc.categoria" class="input-field" placeholder="Valoración / Evaluación Inicial" />
      </div>
    </div>

    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">B. Anamnesis General</div>
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-600 mb-1">Motivo de Consulta</label>
      <textarea [(ngModel)]="nuevaHc.motivoConsulta" rows="3" class="input-field" placeholder="Descripción del paciente sobre su afección y tiempo de evolución..."></textarea>
    </div>

    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">C. Antecedentes No Patológicos</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Tabaquismo</label>
        <input type="text" [(ngModel)]="nuevaHc.tabaquismo" class="input-field" placeholder="Frecuencia de consumo" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Alcoholismo</label>
        <input type="text" [(ngModel)]="nuevaHc.alcoholismo" class="input-field" placeholder="Frecuencia de consumo" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Medicamentos</label>
        <textarea [(ngModel)]="nuevaHc.medicamentos" rows="2" class="input-field" placeholder="Fármacos de consumo diario..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Deporte / Actividad Física</label>
        <input type="text" [(ngModel)]="nuevaHc.deporteActividadFisica" class="input-field" placeholder="Gimnasio, pilates, yoga, natación..." />
      </div>
    </div>

    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">D. Antecedentes Personales Patológicos</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Enfermedades Actuales</label>
        <textarea [(ngModel)]="nuevaHc.enfermedadesActuales" rows="2" class="input-field" placeholder="Condromalacia, hiperlaxitud, varices..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Enfermedades Pasadas</label>
        <textarea [(ngModel)]="nuevaHc.enfermedadesPasadas" rows="2" class="input-field" placeholder="Lesiones previas resueltas..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Alergias</label>
        <textarea [(ngModel)]="nuevaHc.alergias" rows="2" class="input-field" placeholder="Medicamentos, materiales, alimentos..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Cirugías</label>
        <textarea [(ngModel)]="nuevaHc.cirugias" rows="2" class="input-field" placeholder="Intervenciones previas con fecha..."></textarea>
      </div>
    </div>

    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">E. Antecedentes Heredo-Familiares</div>
    <div class="mb-6">
      <div class="flex flex-wrap gap-4 mb-3">
        <label class="flex items-center gap-2 text-sm" *ngFor="let opt of heredoOptions">
          <input type="checkbox" [checked]="heredoSeleccion[opt.key]" (change)="toggleHeredo(opt.key)" class="rounded" />
          {{ opt.label }}
        </label>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Especificaciones</label>
        <textarea [(ngModel)]="nuevaHc.antecHeredoEspecificaciones" rows="2" class="input-field" placeholder="Detalle de familiares que padecen las condiciones marcadas..."></textarea>
      </div>
    </div>

    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">F. Signos Vitales</div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Peso (kg)</label>
        <input type="number" [(ngModel)]="nuevaHc.peso" step="0.1" class="input-field" (input)="calcularIMC()" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Talla (cm)</label>
        <input type="number" [(ngModel)]="nuevaHc.talla" step="0.1" class="input-field" (input)="calcularIMC()" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">PA (mmHg)</label>
        <input type="text" [(ngModel)]="nuevaHc.paPresionArterial" class="input-field" placeholder="120/80" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">IMC</label>
        <input type="number" [(ngModel)]="nuevaHc.imc" step="0.1" class="input-field bg-gray-50" readonly />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Fecha de Apertura</label>
        <input type="date" [(ngModel)]="nuevaHc.fechaApertura" class="input-field" />
      </div>
    </div>

    <button (click)="guardarNuevaHc()" [disabled]="!nuevaHc.fechaApertura || guardando"
      class="btn-primary">
      {{ guardando ? 'Guardando...' : 'Aperturar Historia Clínica' }}
    </button>
  </div>

  <!-- ========== TABS ========== -->
  <div *ngIf="hc">
    <div class="flex gap-1 mb-6 border-b border-gray-200">
      <button *ngFor="let t of tabs" (click)="tabActivo = t.key"
        class="px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors"
        [class.text-primary-600]="tabActivo === t.key"
        [class.text-gray-400]="tabActivo !== t.key"
        [class.border-b-2]="tabActivo === t.key"
        [class.border-primary-500]="tabActivo === t.key">
        {{ t.label }}
      </button>
    </div>

    <!-- ========== TAB: GENERAL ========== -->
    <div *ngIf="tabActivo === 'general'" class="glass-card-strong rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 font-heading">Datos Generales</h3>
        <button *ngIf="!editandoGeneral" (click)="editandoGeneral = true" class="btn-ghost">Editar</button>
      </div>

      <div *ngIf="!editandoGeneral" class="space-y-4 text-sm">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><span class="text-gray-400">Doctor:</span> <span class="text-gray-700 font-medium">{{ hc.doctorAsignado || '-' }}</span></div>
          <div><span class="text-gray-400">Especialidad:</span> <span class="text-gray-700 font-medium">{{ hc.especialidad }}</span></div>
          <div><span class="text-gray-400">Procedencia:</span> <span class="text-gray-700 font-medium">{{ hc.procedencia || '-' }}</span></div>
          <div><span class="text-gray-400">Categoría:</span> <span class="text-gray-700 font-medium">{{ hc.categoria }}</span></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><span class="text-gray-400">Peso:</span> <span class="text-gray-700">{{ hc.peso ? hc.peso + ' kg' : '-' }}</span></div>
          <div><span class="text-gray-400">Talla:</span> <span class="text-gray-700">{{ hc.talla ? hc.talla + ' cm' : '-' }}</span></div>
          <div><span class="text-gray-400">PA:</span> <span class="text-gray-700">{{ hc.paPresionArterial || '-' }}</span></div>
          <div><span class="text-gray-400">IMC:</span> <span class="text-gray-700">{{ hc.imc || '-' }}</span></div>
        </div>
        <div class="border-t border-gray-100 pt-3">
          <p><span class="text-gray-400">Motivo de Consulta:</span></p>
          <p class="text-gray-700 whitespace-pre-wrap">{{ hc.motivoConsulta || '-' }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
          <div><span class="text-gray-400">Tabaquismo:</span> <span class="text-gray-700">{{ hc.tabaquismo || '-' }}</span></div>
          <div><span class="text-gray-400">Alcoholismo:</span> <span class="text-gray-700">{{ hc.alcoholismo || '-' }}</span></div>
          <div><span class="text-gray-400">Medicamentos:</span> <span class="text-gray-700">{{ hc.medicamentos || '-' }}</span></div>
          <div><span class="text-gray-400">Deporte/Act. Física:</span> <span class="text-gray-700">{{ hc.deporteActividadFisica || '-' }}</span></div>
        </div>
        <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
          <div><span class="text-gray-400">Enf. Actuales:</span> <span class="text-gray-700">{{ hc.enfermedadesActuales || '-' }}</span></div>
          <div><span class="text-gray-400">Enf. Pasadas:</span> <span class="text-gray-700">{{ hc.enfermedadesPasadas || '-' }}</span></div>
          <div><span class="text-gray-400">Alergias:</span> <span class="text-gray-700">{{ hc.alergias || '-' }}</span></div>
          <div><span class="text-gray-400">Cirugías:</span> <span class="text-gray-700">{{ hc.cirugias || '-' }}</span></div>
        </div>
        <div class="border-t border-gray-100 pt-3">
          <p><span class="text-gray-400">Antec. Heredo-Familiares:</span>
            <span class="text-gray-700">{{ heredoLabels(hc.antecHeredoFamiliares) || '-' }}</span></p>
          <p *ngIf="hc.antecHeredoEspecificaciones" class="text-gray-600 text-xs mt-1">{{ hc.antecHeredoEspecificaciones }}</p>
        </div>
      </div>

      <div *ngIf="editandoGeneral">
        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">A. Control Administrativo</div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Doctor</label>
            <input type="text" [(ngModel)]="hcEdit.doctorAsignado" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Especialidad</label>
            <input type="text" [(ngModel)]="hcEdit.especialidad" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Procedencia</label>
            <input type="text" [(ngModel)]="hcEdit.procedencia" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
            <input type="text" [(ngModel)]="hcEdit.categoria" class="input-field" />
          </div>
        </div>

        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">B-C-D. Antecedentes</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Motivo de Consulta</label>
            <textarea [(ngModel)]="hcEdit.motivoConsulta" rows="2" class="input-field"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Tabaquismo</label>
            <input type="text" [(ngModel)]="hcEdit.tabaquismo" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Alcoholismo</label>
            <input type="text" [(ngModel)]="hcEdit.alcoholismo" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Medicamentos</label>
            <textarea [(ngModel)]="hcEdit.medicamentos" rows="2" class="input-field"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Deporte / Act. Física</label>
            <input type="text" [(ngModel)]="hcEdit.deporteActividadFisica" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Enfermedades Actuales</label>
            <textarea [(ngModel)]="hcEdit.enfermedadesActuales" rows="2" class="input-field"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Enfermedades Pasadas</label>
            <textarea [(ngModel)]="hcEdit.enfermedadesPasadas" rows="2" class="input-field"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Alergias</label>
            <textarea [(ngModel)]="hcEdit.alergias" rows="2" class="input-field"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Cirugías</label>
            <textarea [(ngModel)]="hcEdit.cirugias" rows="2" class="input-field"></textarea>
          </div>
        </div>

        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">E. Heredo-Familiares</div>
        <div class="flex flex-wrap gap-4 mb-3">
          <label class="flex items-center gap-2 text-sm" *ngFor="let opt of heredoOptions">
            <input type="checkbox" [checked]="heredoEdit[opt.key]" (change)="toggleHeredoEdit(opt.key)" class="rounded" />
            {{ opt.label }}
          </label>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600 mb-1">Especificaciones</label>
          <textarea [(ngModel)]="hcEdit.antecHeredoEspecificaciones" rows="2" class="input-field"></textarea>
        </div>

        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">F. Signos Vitales</div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Peso (kg)</label>
            <input type="number" [(ngModel)]="hcEdit.peso" step="0.1" class="input-field" (input)="calcularIMCEdit()" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Talla (cm)</label>
            <input type="number" [(ngModel)]="hcEdit.talla" step="0.1" class="input-field" (input)="calcularIMCEdit()" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">PA (mmHg)</label>
            <input type="text" [(ngModel)]="hcEdit.paPresionArterial" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">IMC</label>
            <input type="number" [(ngModel)]="hcEdit.imc" step="0.1" class="input-field bg-gray-50" readonly />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Fecha de Apertura</label>
            <input type="date" [(ngModel)]="hcEdit.fechaApertura" class="input-field" />
          </div>
        </div>

        <div class="flex gap-2">
          <button (click)="guardarGeneral()" class="btn-primary">Guardar</button>
          <button (click)="cancelarEdicionGeneral()" class="btn-ghost">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- ========== TAB: EVALUACIONES ========== -->
    <div *ngIf="tabActivo === 'evaluaciones'" class="glass-card-strong rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 font-heading">Evaluaciones</h3>
        <div class="flex gap-2">
          <button (click)="abrirModalEvaluacion('VALORACION')" class="btn-primary text-sm">+ Valoración</button>
          <button (click)="abrirModalEvaluacion('REVALORACION')" class="btn-ghost text-sm">+ Re-valoración</button>
        </div>
      </div>

      <div *ngIf="evaluaciones.length === 0" class="text-center py-8 text-gray-400">No hay evaluaciones registradas.</div>

      <div *ngFor="let e of evaluaciones" class="border-b border-gray-100 py-4 last:border-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="badge"
                [class.bg-blue-100]="e.tipo === 'VALORACION'"
                [class.text-blue-700]="e.tipo === 'VALORACION'"
                [class.bg-purple-100]="e.tipo === 'REVALORACION'"
                [class.text-purple-700]="e.tipo === 'REVALORACION'">
                {{ e.tipo === 'VALORACION' ? 'Valoración' : 'Re-valoración' }}
              </span>
              <span class="text-sm text-gray-500">{{ e.fecha }}</span>
              <span class="text-xs text-gray-400">por {{ e.nombreDoctor }}</span>
            </div>
            <div *ngIf="e.diagnosticoClinico" class="text-sm text-gray-700 mt-1">
              <span class="font-medium">Dx:</span> {{ e.diagnosticoClinico }}
              <span *ngIf="e.cie10" class="text-gray-400 ml-2">CIE-10: {{ e.cie10 }}</span>
            </div>
            <div class="flex gap-3 mt-1 text-xs text-gray-500" *ngIf="e.evaPuntuacion !== null || e.borgPuntuacion !== null">
              <span *ngIf="e.evaPuntuacion !== null">EVA: <strong>{{ e.evaPuntuacion }}</strong>/10</span>
              <span *ngIf="e.borgPuntuacion !== null">BORG: <strong>{{ e.borgPuntuacion }}</strong>/10</span>
              <span *ngIf="e.danielsPuntuacion !== null">Daniels: <strong>{{ e.danielsPuntuacion }}</strong>/5</span>
            </div>
          </div>
          <div class="flex gap-1">
            <button (click)="verEvaluacion(e)" class="btn-ghost text-xs">Ver</button>
            <button (click)="editarEvaluacion(e)" class="btn-ghost text-xs">Editar</button>
            <button (click)="eliminarEvaluacion(e)" class="btn-danger text-xs">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== TAB: TRATAMIENTOS ========== -->
    <div *ngIf="tabActivo === 'tratamientos'" class="glass-card-strong rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 font-heading">Tratamientos</h3>
        <button (click)="abrirModalTratamiento()" class="btn-primary text-sm">+ Nuevo Tratamiento</button>
      </div>
      <div *ngIf="tratamientos.length === 0" class="text-center py-8 text-gray-400">No hay tratamientos registrados.</div>
      <div *ngFor="let t of tratamientos" class="border-b border-gray-100 py-4 last:border-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-gray-800">{{ t.nombre }}</span>
              <span class="badge" [class.badge-active]="t.estado === 'ACTIVO'" [class.badge-inactive]="t.estado !== 'ACTIVO'">{{ t.estado }}</span>
            </div>
            <p class="text-sm text-gray-500">{{ t.fechaInicio }} | {{ t.frecuencia || 'Sin frecuencia' }} | {{ t.duracionSemanas || '-' }} semanas</p>
            <p class="text-xs text-gray-400">Dr. {{ t.nombreDoctor }}</p>
          </div>
          <div class="flex gap-1">
            <button (click)="verTratamiento(t)" class="btn-ghost text-xs">Ver</button>
            <button (click)="abrirSesiones(t)" class="btn-ghost text-xs">Sesiones</button>
            <button (click)="editarTratamiento(t)" class="btn-ghost text-xs">Editar</button>
            <button (click)="cambiarEstadoTratamiento(t)" class="btn-ghost text-xs">{{ t.estado === 'ACTIVO' ? 'Completar' : 'Reactivar' }}</button>
            <button (click)="eliminarTratamiento(t)" class="btn-danger text-xs">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== TAB: SESIONES ========== -->
    <div *ngIf="tabActivo === 'sesiones'" class="glass-card-strong rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 font-heading">Sesiones</h3>
        <button (click)="abrirModalSesion()" class="btn-primary text-sm" *ngIf="tratamientos.length > 0">+ Nueva Sesión</button>
      </div>
      <div class="mb-4" *ngIf="tratamientos.length > 0">
        <label class="block text-sm font-medium text-gray-600 mb-1">Filtrar por tratamiento</label>
        <select [(ngModel)]="sesionFiltroTratamientoId" (change)="cargarSesiones()" class="input-field max-w-md">
          <option [value]="0">Todos los tratamientos</option>
          <option *ngFor="let t of tratamientos" [value]="t.id">{{ t.nombre }}</option>
        </select>
      </div>
      <div *ngIf="sesiones.length === 0" class="text-center py-8 text-gray-400">No hay sesiones registradas.</div>
      <div *ngFor="let s of sesiones" class="border-b border-gray-100 py-4 last:border-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-gray-800">Sesión #{{ s.numeroSesion }}</span>
              <span class="text-sm text-gray-500">{{ s.fecha }} {{ s.hora ? '(' + s.hora.substring(0,5) + ')' : '' }}</span>
              <span class="badge" [class.badge-active]="s.estado === 'REALIZADA'"
                [class]="s.estado === 'NO_ASISTIO' ? 'bg-red-100 text-red-700' : s.estado === 'PROGRAMADA' ? 'bg-amber-100 text-amber-700' : 'badge-active'">{{ s.estado }}</span>
              <span *ngIf="s.asistio !== null && s.asistio !== undefined" class="text-xs"
                [class.text-emerald-600]="s.asistio" [class.text-red-500]="!s.asistio">{{ s.asistio ? 'Asistió' : 'No asistió' }}</span>
            </div>
            <p class="text-xs text-gray-400">{{ s.nombreTratamiento }}</p>
          </div>
          <div class="flex gap-1">
            <button (click)="verSesion(s)" class="btn-ghost text-xs">Ver</button>
            <button (click)="editarSesion(s)" class="btn-ghost text-xs">Editar</button>
            <button (click)="cambiarEstadoSesion(s)" class="btn-ghost text-xs">{{ s.estado === 'PROGRAMADA' ? 'Realizar' : s.estado === 'REALIZADA' ? 'Reprogramar' : 'Reabrir' }}</button>
            <button (click)="eliminarSesion(s)" class="btn-danger text-xs">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ========== MODAL EVALUACIÓN (Valoración / Re-valoración) ========== -->
<div *ngIf="showModalEvaluacion" class="fixed inset-0 bg-black/30 flex items-start justify-center pt-6 z-50 overflow-y-auto" (click.self)="cerrarModalEvaluacion()">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4 p-6 animate-fade-in mb-6">
    <h3 class="text-lg font-bold text-gray-800 font-heading mb-4">{{ evaluacionVer ? 'Ver Evaluación' : evalEditando ? 'Editar Evaluación' : evalForm.tipo === 'VALORACION' ? 'Nueva Valoración Fisioterapéutica' : 'Nueva Re-valoración' }}</h3>

    <fieldset [disabled]="evaluacionVer">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Fecha *</label>
        <input type="date" [(ngModel)]="evalForm.fecha" class="input-field" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
        <select [(ngModel)]="evalForm.tipo" class="input-field">
          <option value="VALORACION">Valoración Fisioterapéutica</option>
          <option value="REVALORACION">Re-valoración (Control)</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">CIE-10</label>
        <input type="text" [(ngModel)]="evalForm.cie10" class="input-field" placeholder="M54.5" />
      </div>
    </div>

    <!-- Sección A: Padecimiento Actual -->
    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">A. Padecimiento Actual y Síntomas</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Padecimiento Actual</label>
        <textarea [(ngModel)]="evalForm.padecimientoActual" rows="2" class="input-field" placeholder="Diagnóstico médico de ingreso o descripción de la lesión..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Valoración (Subjetiva)</label>
        <textarea [(ngModel)]="evalForm.valoracionSubjetiva" rows="2" class="input-field" placeholder="Relato del paciente: mecánica de lesión, actividades que agravan..."></textarea>
      </div>
    </div>

    <!-- Sección B: Evaluación del Dolor -->
    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">B. Evaluación del Dolor</div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">EVA (0-10)</label>
        <div class="flex items-center gap-2">
          <input type="range" min="0" max="10" [(ngModel)]="evalForm.evaPuntuacion" class="w-full" />
          <span class="text-sm font-bold w-6 text-center" [style.color]="evaColor(evalForm.evaPuntuacion)">{{ evalForm.evaPuntuacion ?? '-' }}</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">BORG (0-10)</label>
        <div class="flex items-center gap-2">
          <input type="range" min="0" max="10" [(ngModel)]="evalForm.borgPuntuacion" class="w-full" />
          <span class="text-sm font-bold w-6 text-center">{{ evalForm.borgPuntuacion ?? '-' }}</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Daniels (0-5)</label>
        <div class="flex items-center gap-2">
          <input type="range" min="0" max="5" [(ngModel)]="evalForm.danielsPuntuacion" class="w-full" />
          <span class="text-sm font-bold w-6 text-center">{{ evalForm.danielsPuntuacion ?? '-' }}</span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Intensidad</label>
        <input type="text" [(ngModel)]="evalForm.dolorIntensidad" class="input-field" placeholder="Moderado, agudo, punzante" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Frecuencia</label>
        <input type="text" [(ngModel)]="evalForm.dolorFrecuencia" class="input-field" placeholder="Permanente, intermitente..." />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Otro</label>
        <input type="text" [(ngModel)]="evalForm.dolorOtro" class="input-field" placeholder="Desencadenantes..." />
      </div>
    </div>

    <!-- Sección C: Parámetros de Evaluación -->
    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">C. Parámetros de Evaluación Fisioterapéutica</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Signos</label>
        <textarea [(ngModel)]="evalForm.signos" rows="2" class="input-field" placeholder="Hallazgos visuales o palpables..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Evaluación Muscular</label>
        <textarea [(ngModel)]="evalForm.evaluacionMuscular" rows="2" class="input-field" placeholder="Acortamientos, contracturas..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Evaluación de Movilidad (ROM)</label>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-xs text-gray-500 uppercase">
                <th class="text-left py-1 pr-2">Nombre del Movimiento</th>
                <th class="text-left py-1 pr-2">Rango de Movimiento</th>
                <th class="w-8"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of romRows; let i = index; trackBy: trackByIndex">
                <td class="py-1 pr-2">
                  <input type="text" [(ngModel)]="row.nombre" class="input-field text-xs py-1" placeholder="Flexión lumbar" [disabled]="evaluacionVer" [attr.name]="'rom-nombre-' + i" />
                </td>
                <td class="py-1 pr-2">
                  <input type="text" [(ngModel)]="row.rango" class="input-field text-xs py-1" placeholder="60°" [disabled]="evaluacionVer" [attr.name]="'rom-rango-' + i" />
                </td>
                <td class="py-1 text-center">
                  <button *ngIf="!evaluacionVer" type="button" (click)="eliminarFilaROM(i)" class="text-red-400 hover:text-red-600 text-sm leading-none">&times;</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button *ngIf="!evaluacionVer" type="button" (click)="agregarFilaROM()" class="text-xs text-teal-600 hover:text-teal-700 mt-1">+ Agregar fila</button>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Evaluación Funcional y Pruebas</label>
        <div class="text-xs text-gray-500 mb-1">Pruebas Especiales</div>
        <div class="overflow-x-auto mb-2">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-xs text-gray-500 uppercase">
                <th class="text-left py-1 pr-2">Nombre de la Prueba</th>
                <th class="text-left py-1 pr-2">Resultado</th>
                <th class="w-8"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of pruebasRows; let i = index; trackBy: trackByIndex">
                <td class="py-1 pr-2">
                  <input type="text" [(ngModel)]="row.nombre" class="input-field text-xs py-1" placeholder="Trendelenburg" [disabled]="evaluacionVer" [attr.name]="'prueba-nombre-' + i" />
                </td>
                <td class="py-1 pr-2">
                  <input type="text" [(ngModel)]="row.resultado" class="input-field text-xs py-1" placeholder="Positivo bilateral" [disabled]="evaluacionVer" [attr.name]="'prueba-resultado-' + i" />
                </td>
                <td class="py-1 text-center">
                  <button *ngIf="!evaluacionVer" type="button" (click)="eliminarFilaPrueba(i)" class="text-red-400 hover:text-red-600 text-sm leading-none">&times;</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button *ngIf="!evaluacionVer" type="button" (click)="agregarFilaPrueba()" class="text-xs text-teal-600 hover:text-teal-700 mt-1">+ Agregar prueba</button>
        <div class="mt-2">
          <label class="block text-xs text-gray-500 mb-1">Análisis Dinámico</label>
          <textarea [(ngModel)]="analisisDinamico" rows="2" class="input-field text-xs" placeholder="Sentadilla, Apoyo Unipodal, Salto, FMS..." [disabled]="evaluacionVer"></textarea>
        </div>
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-600 mb-1">Sensibilidad / Palpación</label>
        <textarea [(ngModel)]="evalForm.sensibilidadPalpacion" rows="2" class="input-field" placeholder="Puntos de dolor específicos..."></textarea>
      </div>
    </div>

    <!-- Sección D: Diagnóstico, Objetivos y Tratamiento -->
    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">D. Diagnóstico, Objetivos y Tratamiento</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Diagnóstico Clínico/Fisioterapéutico</label>
        <textarea [(ngModel)]="evalForm.diagnosticoClinico" rows="2" class="input-field" placeholder="Síndrome cruzado superior, Tendinitis..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Objetivos del Tratamiento</label>
        <textarea [(ngModel)]="evalForm.objetivosTratamiento" rows="2" class="input-field" placeholder="Disminuir dolor, mejorar estabilidad..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Plan de Tratamiento (Camilla)</label>
        <textarea [(ngModel)]="evalForm.planCamilla" rows="3" class="input-field" placeholder="TECA, TENS, ventosas, liberación por cadenas..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Plan de Tratamiento (Gym)</label>
        <textarea [(ngModel)]="evalForm.planGym" rows="3" class="input-field" placeholder="Flexibilidad cadena posterior, fuerza progresiva MI..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Frecuencia del Tratamiento</label>
        <input type="text" [(ngModel)]="evalForm.frecuenciaTratamiento" class="input-field" placeholder="Diario, Interdiario, 2 veces/semana" />
      </div>
    </div>

    <!-- ========== CAMPOS ESPECÍFICOS REVALORACION ========== -->
    <div *ngIf="evalForm.tipo === 'REVALORACION'" class="border-t border-purple-100 pt-4 mt-4">
      <div class="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-3">Campos específicos de Re-valoración</div>

      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">A. Control de Avance</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Motivo de Control</label>
          <input type="text" [(ngModel)]="evalForm.motivoControl" class="input-field" placeholder="Control mensual, re-valoración de alta..." />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Padecimiento Actual (Historial)</label>
          <textarea [(ngModel)]="evalForm.padecimientoActualHistorial" rows="2" class="input-field" placeholder="Recordatorio diagnóstico base..."></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Valoración (Progreso Subjetivo)</label>
          <textarea [(ngModel)]="evalForm.valoracionProgreso" rows="2" class="input-field" placeholder="Impresión del paciente sobre su mejora..."></textarea>
        </div>
      </div>

      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">B. Re-evaluación Física</div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-600 mb-1">Evaluación de Movilidad Actualizada</label>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-xs text-gray-500 uppercase">
                <th class="text-left py-1 pr-2">Nombre del Movimiento</th>
                <th class="text-left py-1 pr-2">Rango</th>
                <th class="text-left py-1 pr-2">Evolución</th>
                <th class="w-8"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of romActualizadaRows; let i = index; trackBy: trackByIndex">
                <td class="py-1 pr-2">
                  <input type="text" [(ngModel)]="row.nombre" class="input-field text-xs py-1" placeholder="Flex posterior" [disabled]="evaluacionVer" [attr.name]="'rom-act-nombre-' + i" />
                </td>
                <td class="py-1 pr-2">
                  <input type="text" [(ngModel)]="row.rango" class="input-field text-xs py-1" placeholder="40°" [disabled]="evaluacionVer" [attr.name]="'rom-act-rango-' + i" />
                </td>
                <td class="py-1 pr-2">
                  <input type="text" [(ngModel)]="row.evolucion" class="input-field text-xs py-1" placeholder="Mejorado" [disabled]="evaluacionVer" [attr.name]="'rom-act-evol-' + i" />
                </td>
                <td class="py-1 text-center">
                  <button *ngIf="!evaluacionVer" type="button" (click)="eliminarFilaROMActualizada(i)" class="text-red-400 hover:text-red-600 text-sm leading-none">&times;</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button *ngIf="!evaluacionVer" type="button" (click)="agregarFilaROMActualizada()" class="text-xs text-teal-600 hover:text-teal-700 mt-1">+ Agregar fila</button>
      </div>

      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">C. Re-ajuste de Metas</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Objetivos Modificados</label>
          <textarea [(ngModel)]="evalForm.objetivosModificados" rows="2" class="input-field" placeholder="Mejorar patrón de trote, amortiguación..."></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Plan Camilla Actualizado</label>
          <textarea [(ngModel)]="evalForm.planCamillaActualizado" rows="2" class="input-field" placeholder="Técnicas modificadas según tolerancia..."></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Plan Gym Actualizado</label>
          <textarea [(ngModel)]="evalForm.planGymActualizado" rows="2" class="input-field" placeholder="Ejercicios con mayor carga/complejidad..."></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Frecuencia Actualizada</label>
          <input type="text" [(ngModel)]="evalForm.frecuenciaActualizada" class="input-field" placeholder="Ratificación o reducción de visitas" />
        </div>
      </div>
    </div>

    </fieldset>

    <div class="flex gap-2 justify-end mt-4">
      <button (click)="cerrarModalEvaluacion()" class="btn-ghost">{{ evaluacionVer ? 'Cerrar' : 'Cancelar' }}</button>
      <button *ngIf="!evaluacionVer" (click)="guardarEvaluacion()" [disabled]="!evalForm.fecha || !evalForm.tipo || guardando" class="btn-primary">{{ guardando ? 'Guardando...' : 'Guardar' }}</button>
    </div>
  </div>
</div>

<!-- Modal Tratamiento -->
<div *ngIf="showModalTratamiento" class="fixed inset-0 bg-black/30 flex items-start justify-center pt-10 z-50 overflow-y-auto" (click.self)="cerrarModalTratamiento()">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6 animate-fade-in">
    <h3 class="text-lg font-bold text-gray-800 font-heading mb-4">{{ tratamientoVer ? 'Ver Tratamiento' : tratEditando ? 'Editar Tratamiento' : 'Nuevo Tratamiento' }}</h3>

    <fieldset [disabled]="tratamientoVer">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-600 mb-1">Nombre del Tratamiento *</label>
        <input type="text" [(ngModel)]="tratForm.nombre" class="input-field" placeholder="Ej: Terapia física para lumbalgia" />
      </div>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
      <textarea [(ngModel)]="tratForm.descripcion" rows="2" class="input-field"></textarea>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600 mb-1">Objetivo Terapéutico</label>
      <textarea [(ngModel)]="tratForm.objetivo" rows="2" class="input-field"></textarea>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Plan de Camilla</label>
        <textarea [(ngModel)]="tratForm.planCamilla" rows="2" class="input-field" placeholder="TECA, TENS, electroterapia..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Plan de Gym</label>
        <textarea [(ngModel)]="tratForm.planGym" rows="2" class="input-field" placeholder="Ejercicio terapéutico programado..."></textarea>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Frecuencia</label>
        <input type="text" [(ngModel)]="tratForm.frecuencia" class="input-field" placeholder="3 veces/semana" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Duración (semanas)</label>
        <input type="number" [(ngModel)]="tratForm.duracionSemanas" class="input-field" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Evaluación relacionada</label>
        <select [(ngModel)]="tratForm.idEvaluacion" class="input-field">
          <option [value]="null">- Sin evaluación -</option>
          <option *ngFor="let e of evaluaciones" [value]="e.id">{{ e.fecha }} - {{ e.diagnosticoClinico || e.tipo }}</option>
        </select>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Fecha de Inicio *</label>
        <input type="date" [(ngModel)]="tratForm.fechaInicio" class="input-field" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Fecha de Fin</label>
        <input type="date" [(ngModel)]="tratForm.fechaFin" class="input-field" />
      </div>
    </div>
    <div class="mb-4" *ngIf="tratEditando">
      <label class="block text-sm font-medium text-gray-600 mb-1">Estado</label>
      <select [(ngModel)]="tratForm.estado" class="input-field max-w-xs">
        <option value="ACTIVO">Activo</option>
        <option value="COMPLETADO">Completado</option>
        <option value="SUSPENDIDO">Suspendido</option>
      </select>
    </div>
    </fieldset>

    <div class="flex gap-2 justify-end">
      <button (click)="cerrarModalTratamiento()" class="btn-ghost">{{ tratamientoVer ? 'Cerrar' : 'Cancelar' }}</button>
      <button *ngIf="!tratamientoVer" (click)="guardarTratamiento()" [disabled]="!tratForm.nombre || !tratForm.fechaInicio || guardando" class="btn-primary">{{ guardando ? 'Guardando...' : 'Guardar' }}</button>
    </div>
  </div>
</div>

<!-- Modal Sesión -->
<div *ngIf="showModalSesion" class="fixed inset-0 bg-black/30 flex items-start justify-center pt-10 z-50 overflow-y-auto" (click.self)="cerrarModalSesion()">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6 animate-fade-in">
    <h3 class="text-lg font-bold text-gray-800 font-heading mb-4">{{ sesionVer ? 'Ver Sesión' : sesEditando ? 'Editar Sesión' : 'Nueva Sesión' }}</h3>
    <fieldset [disabled]="sesionVer">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Tratamiento *</label>
        <select [(ngModel)]="sesForm.idTratamiento" class="input-field"><option *ngFor="let t of tratamientos" [value]="t.id">{{ t.nombre }}</option></select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">N° de Sesión *</label>
        <input type="number" [(ngModel)]="sesForm.numeroSesion" class="input-field" min="1" />
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Fecha *</label>
        <input type="date" [(ngModel)]="sesForm.fecha" class="input-field" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Hora</label>
        <input type="time" [(ngModel)]="sesForm.hora" class="input-field" />
      </div>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600 mb-1">Evaluación Subjetiva</label>
      <textarea [(ngModel)]="sesForm.evaluacionSubjetiva" rows="2" class="input-field"></textarea>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600 mb-1">Evaluación Objetiva</label>
      <textarea [(ngModel)]="sesForm.evaluacionObjetiva" rows="2" class="input-field"></textarea>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600 mb-1">Tratamiento Realizado</label>
      <textarea [(ngModel)]="sesForm.tratamientoRealizado" rows="2" class="input-field"></textarea>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Indicaciones</label>
        <textarea [(ngModel)]="sesForm.indicaciones" rows="2" class="input-field"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Plan Próxima Sesión</label>
        <textarea [(ngModel)]="sesForm.proximaSesionPlan" rows="2" class="input-field"></textarea>
      </div>
    </div>
    <div class="flex gap-4 items-center mb-4" *ngIf="sesEditando">
      <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="sesForm.asistio" class="rounded" /> Asistió</label>
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Estado</label>
        <select [(ngModel)]="sesForm.estado" class="input-field">
          <option value="PROGRAMADA">Programada</option>
          <option value="REALIZADA">Realizada</option>
          <option value="NO_ASISTIO">No Asistió</option>
        </select>
      </div>
    </div>
    </fieldset>

    <div class="flex gap-2 justify-end">
      <button (click)="cerrarModalSesion()" class="btn-ghost">{{ sesionVer ? 'Cerrar' : 'Cancelar' }}</button>
      <button *ngIf="!sesionVer" (click)="guardarSesion()" [disabled]="!sesForm.idTratamiento || !sesForm.numeroSesion || !sesForm.fecha || guardando" class="btn-primary">{{ guardando ? 'Guardando...' : 'Guardar' }}</button>
    </div>
  </div>
</div>

<ng-template #loading>
  <div class="p-6 text-center text-gray-400">Cargando...</div>
</ng-template>
`
})
export class HistoriaClinicaDetalleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  pacienteId = 0;
  paciente?: Paciente;
  hc?: HistoriaClinica;
  cargando = true;
  guardando = false;
  editandoGeneral = false;
  puedeEditar = false;

  tabs = [
    { key: 'general' as Tab, label: 'General' },
    { key: 'evaluaciones' as Tab, label: 'Evaluaciones' },
    { key: 'tratamientos' as Tab, label: 'Tratamientos' },
    { key: 'sesiones' as Tab, label: 'Sesiones' },
  ];
  tabActivo: Tab = 'general';

  // Heredo checkbox options
  heredoOptions = [
    { key: 'cronico_degenerativas', label: 'Enf. Crónico-degenerativas' },
    { key: 'respiratorias', label: 'Enf. Respiratorias' },
    { key: 'cancer', label: 'Cáncer' },
    { key: 'cardiopatias', label: 'Cardiopatías' },
  ];
  heredoSeleccion: Record<string, boolean> = {};
  heredoEdit: Record<string, boolean> = {};

  // Nueva HC
  nuevaHc: HistoriaClinicaRequest = {
    idPaciente: 0,
    fechaApertura: new Date().toISOString().substring(0, 10),
    especialidad: 'Fisioterapia',
    categoria: 'Valoración / Evaluación Inicial',
  };

  // HC edit
  hcEdit: HistoriaClinicaRequest = { ...this.nuevaHc };

  // Evaluaciones
  evaluaciones: Evaluacion[] = [];
  showModalEvaluacion = false;
  evaluacionVer = false;
  evalEditando = false;
  evalEditId?: number;
  evalForm: EvaluacionRequest = {
    idHistoriaClinica: 0,
    idDoctor: 0,
    fecha: '',
    tipo: 'VALORACION',
  };

  // Tablas dinámicas para Evaluación de Movilidad y Funcional
  romRows: { nombre: string; rango: string }[] = [];
  pruebasRows: { nombre: string; resultado: string }[] = [];
  analisisDinamico = '';
  romActualizadaRows: { nombre: string; rango: string; evolucion: string }[] = [];

  // Tratamientos
  tratamientos: Tratamiento[] = [];
  showModalTratamiento = false;
  tratamientoVer = false;
  tratEditando = false;
  tratEditId?: number;
  tratForm: TratamientoRequest = {
    idHistoriaClinica: 0,
    idDoctor: 0,
    nombre: '',
    fechaInicio: '',
    estado: 'ACTIVO'
  };

  // Sesiones
  sesiones: Sesion[] = [];
  sesionFiltroTratamientoId = 0;
  showModalSesion = false;
  sesionVer = false;
  sesEditando = false;
  sesEditId?: number;
  sesForm: SesionRequest = {
    idTratamiento: 0,
    numeroSesion: 1,
    fecha: '',
    estado: 'PROGRAMADA'
  };

  doctores: Doctor[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private doctorService: DoctorService,
    private hcService: HistoriaClinicaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.puedeEditar = ['ROLE_ADMIN', 'ROLE_DOCTOR'].includes(this.authService.getUserRole() || '');

    this.route.paramMap.pipe(
      switchMap(params => {
        this.pacienteId = Number(params.get('pacienteId'));
        this.nuevaHc.idPaciente = this.pacienteId;
        this.cargando = true;
        return combineLatest({
          paciente: this.pacienteService.buscarPorId(this.pacienteId),
          doctores: this.doctorService.listarTodos()
        });
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ paciente, doctores }) => {
        this.paciente = paciente;
        this.doctores = doctores;
        this.cargarHc();
      },
      error: () => this.router.navigate(['/historias-clinicas'])
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==================== HC LOADING ====================

  cargarHc(): void {
    this.hcService.existePorPaciente(this.pacienteId).subscribe(r => {
      if (r.existe) {
        this.hcService.buscarPorPaciente(this.pacienteId).subscribe(hc => {
          this.hc = hc;
          this.nuevaHc = { ...this.nuevaHc, idPaciente: hc.idPaciente };
          this.prepareEditGeneral();
          this.cargarEvaluaciones();
          this.cargarTratamientos();
          this.cargarSesiones();
          this.cargando = false;
        });
      } else {
        this.cargando = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/historias-clinicas']);
  }

  // ==================== IMC ====================

  calcularIMC(): void {
    if (this.nuevaHc.peso && this.nuevaHc.talla && this.nuevaHc.talla > 0) {
      const tallaM = this.nuevaHc.talla / 100;
      this.nuevaHc.imc = Math.round((this.nuevaHc.peso / (tallaM * tallaM)) * 10) / 10;
    }
  }

  calcularIMCEdit(): void {
    if (this.hcEdit.peso && this.hcEdit.talla && this.hcEdit.talla > 0) {
      const tallaM = this.hcEdit.talla / 100;
      this.hcEdit.imc = Math.round((this.hcEdit.peso / (tallaM * tallaM)) * 10) / 10;
    }
  }

  // ==================== HEREDO FAMILIAR ====================

  toggleHeredo(key: string): void {
    this.heredoSeleccion[key] = !this.heredoSeleccion[key];
    this.nuevaHc.antecHeredoFamiliares = JSON.stringify(
      Object.keys(this.heredoSeleccion).filter(k => this.heredoSeleccion[k])
    );
  }

  toggleHeredoEdit(key: string): void {
    this.heredoEdit[key] = !this.heredoEdit[key];
    this.hcEdit.antecHeredoFamiliares = JSON.stringify(
      Object.keys(this.heredoEdit).filter(k => this.heredoEdit[k])
    );
  }

  heredoLabels(json?: string): string {
    if (!json) return '';
    try {
      const keys = JSON.parse(json);
      const map: Record<string, string> = {
        cronico_degenerativas: 'Crónico-degenerativas',
        respiratorias: 'Respiratorias',
        cancer: 'Cáncer',
        cardiopatias: 'Cardiopatías'
      };
      return keys.map((k: string) => map[k] || k).join(', ');
    } catch {
      return json;
    }
  }

  // ==================== GENERAL ====================

  prepareEditGeneral(): void {
    if (!this.hc) return;
    this.hcEdit = {
      idPaciente: this.hc.idPaciente,
      fechaApertura: this.hc.fechaApertura,
      doctorAsignado: this.hc.doctorAsignado || '',
      especialidad: this.hc.especialidad,
      procedencia: this.hc.procedencia || '',
      categoria: this.hc.categoria,
      motivoConsulta: this.hc.motivoConsulta || '',
      tabaquismo: this.hc.tabaquismo || '',
      alcoholismo: this.hc.alcoholismo || '',
      medicamentos: this.hc.medicamentos || '',
      deporteActividadFisica: this.hc.deporteActividadFisica || '',
      enfermedadesActuales: this.hc.enfermedadesActuales || '',
      enfermedadesPasadas: this.hc.enfermedadesPasadas || '',
      alergias: this.hc.alergias || '',
      cirugias: this.hc.cirugias || '',
      antecHeredoFamiliares: this.hc.antecHeredoFamiliares || '',
      antecHeredoEspecificaciones: this.hc.antecHeredoEspecificaciones || '',
      peso: this.hc.peso,
      talla: this.hc.talla,
      paPresionArterial: this.hc.paPresionArterial || '',
      imc: this.hc.imc,
    };
    try {
      const keys = JSON.parse(this.hcEdit.antecHeredoFamiliares || '[]');
      this.heredoEdit = {};
      this.heredoOptions.forEach(o => this.heredoEdit[o.key] = keys.includes(o.key));
    } catch {
      this.heredoEdit = {};
    }
  }

  guardarNuevaHc(): void {
    this.guardando = true;
    this.hcService.crear(this.nuevaHc).subscribe({
      next: hc => {
        this.hc = hc;
        this.prepareEditGeneral();
        this.cargando = false;
        this.guardando = false;
      },
      error: () => this.guardando = false
    });
  }

  guardarGeneral(): void {
    if (!this.hc) return;
    this.guardando = true;
    this.hcService.actualizar(this.hc.id, this.hcEdit).subscribe({
      next: hc => {
        this.hc = hc;
        this.editandoGeneral = false;
        this.guardando = false;
      },
      error: () => this.guardando = false
    });
  }

  cancelarEdicionGeneral(): void {
    this.editandoGeneral = false;
    this.prepareEditGeneral();
  }

  // ==================== EVALUACIONES ====================

  cargarEvaluaciones(): void {
    if (!this.hc) return;
    this.hcService.listarEvaluaciones(this.hc.id).subscribe(data => this.evaluaciones = data);
  }

  private resetEvalForm(pacienteId: number, tipo: string): void {
    this.evalForm = {
      idHistoriaClinica: this.hc?.id ?? pacienteId,
      idDoctor: this.doctores[0]?.id || 0,
      fecha: new Date().toISOString().substring(0, 10),
      tipo,
    };
    this.romRows = [];
    this.pruebasRows = [];
    this.analisisDinamico = '';
    this.romActualizadaRows = [];
  }

  // ==================== TABLAS DINÁMICAS ====================

  trackByIndex(index: number): number { return index; }

  agregarFilaROM(): void { this.romRows.push({ nombre: '', rango: '' }); }
  eliminarFilaROM(i: number): void { this.romRows.splice(i, 1); }

  agregarFilaPrueba(): void { this.pruebasRows.push({ nombre: '', resultado: '' }); }
  eliminarFilaPrueba(i: number): void { this.pruebasRows.splice(i, 1); }

  agregarFilaROMActualizada(): void { this.romActualizadaRows.push({ nombre: '', rango: '', evolucion: '' }); }
  eliminarFilaROMActualizada(i: number): void { this.romActualizadaRows.splice(i, 1); }

  private serializarROM(): void {
    this.evalForm.evaluacionMovilidad = this.romRows.length > 0 ? JSON.stringify(this.romRows) : undefined;
  }

  private deserializarROM(): void {
    try { this.romRows = JSON.parse(this.evalForm.evaluacionMovilidad || '[]'); }
    catch { this.romRows = []; }
  }

  private serializarFuncional(): void {
    const data: Record<string, unknown> = { pruebas: this.pruebasRows };
    if (this.analisisDinamico) data['analisisDinamico'] = this.analisisDinamico;
    this.evalForm.evaluacionFuncional = this.pruebasRows.length > 0 || this.analisisDinamico
      ? JSON.stringify(data) : undefined;
  }

  private deserializarFuncional(): void {
    try {
      const parsed = JSON.parse(this.evalForm.evaluacionFuncional || '{}');
      this.pruebasRows = Array.isArray(parsed.pruebas) ? parsed.pruebas : [];
      this.analisisDinamico = parsed.analisisDinamico || '';
    } catch {
      this.pruebasRows = [];
      this.analisisDinamico = '';
    }
  }

  private serializarROMActualizada(): void {
    this.evalForm.evaluacionMovilidadActualizada = this.romActualizadaRows.length > 0
      ? JSON.stringify(this.romActualizadaRows) : undefined;
  }

  private deserializarROMActualizada(): void {
    try { this.romActualizadaRows = JSON.parse(this.evalForm.evaluacionMovilidadActualizada || '[]'); }
    catch { this.romActualizadaRows = []; }
  }

  abrirModalEvaluacion(tipo: string): void {
    if (!this.hc) return;
    this.evalEditando = false;
    this.evaluacionVer = false;
    this.resetEvalForm(this.hc.id, tipo);
    this.showModalEvaluacion = true;
  }

  verEvaluacion(e: Evaluacion): void {
    this.evalEditando = false;
    this.evaluacionVer = true;
    this.evalEditId = e.id;
    this.evalForm = { ...e, idHistoriaClinica: e.idHistoriaClinica, idDoctor: e.idDoctor } as EvaluacionRequest;
    this.deserializarROM();
    this.deserializarFuncional();
    this.deserializarROMActualizada();
    this.showModalEvaluacion = true;
  }

  editarEvaluacion(e: Evaluacion): void {
    this.evalEditando = true;
    this.evaluacionVer = false;
    this.evalEditId = e.id;
    this.evalForm = { ...e, idHistoriaClinica: e.idHistoriaClinica, idDoctor: e.idDoctor } as EvaluacionRequest;
    this.deserializarROM();
    this.deserializarFuncional();
    this.deserializarROMActualizada();
    this.showModalEvaluacion = true;
  }

  cerrarModalEvaluacion(): void {
    this.showModalEvaluacion = false;
  }

  guardarEvaluacion(): void {
    if (!this.hc) return;
    this.serializarROM();
    this.serializarFuncional();
    this.serializarROMActualizada();
    this.guardando = true;
    const obs = this.evalEditando
      ? this.hcService.actualizarEvaluacion(this.evalEditId!, this.evalForm)
      : this.hcService.crearEvaluacion(this.evalForm);
    obs.subscribe({
      next: () => {
        this.cargarEvaluaciones();
        this.cerrarModalEvaluacion();
        this.guardando = false;
      },
      error: () => this.guardando = false
    });
  }

  eliminarEvaluacion(e: Evaluacion): void {
    if (confirm('¿Eliminar esta evaluación?')) {
      this.hcService.eliminarEvaluacion(e.id).subscribe(() => this.cargarEvaluaciones());
    }
  }

  evaColor(val?: number): string {
    if (val == null) return '#9ca3af';
    if (val <= 3) return '#22c55e';
    if (val <= 6) return '#eab308';
    return '#ef4444';
  }

  // ==================== TRATAMIENTOS ====================

  cargarTratamientos(): void {
    if (!this.hc) return;
    this.hcService.listarTratamientos(this.hc.id).subscribe(data => this.tratamientos = data);
  }

  abrirModalTratamiento(t?: Tratamiento): void {
    if (!this.hc) return;
    this.tratamientoVer = false;
    const doctor = this.doctores[0];
    if (t) {
      this.tratEditando = true;
      this.tratEditId = t.id;
      this.tratForm = {
        idHistoriaClinica: this.hc.id,
        idEvaluacion: t.idEvaluacion,
        idDoctor: t.idDoctor,
        nombre: t.nombre,
        descripcion: t.descripcion || '',
        objetivo: t.objetivo || '',
        frecuencia: t.frecuencia || '',
        duracionSemanas: t.duracionSemanas,
        planCamilla: t.planCamilla || '',
        planGym: t.planGym || '',
        fechaInicio: t.fechaInicio,
        fechaFin: t.fechaFin || undefined,
        estado: t.estado,
      };
    } else {
      this.tratEditando = false;
      this.tratEditId = undefined;
      this.tratForm = {
        idHistoriaClinica: this.hc.id,
        idEvaluacion: undefined,
        idDoctor: doctor?.id || 0,
        nombre: '',
        descripcion: '',
        objetivo: '',
        frecuencia: '',
        duracionSemanas: undefined,
        planCamilla: '',
        planGym: '',
        fechaInicio: new Date().toISOString().substring(0, 10),
        fechaFin: undefined,
        estado: 'ACTIVO',
      };
    }
    this.showModalTratamiento = true;
  }

  cerrarModalTratamiento(): void {
    this.showModalTratamiento = false;
  }

  guardarTratamiento(): void {
    if (!this.hc) return;
    this.guardando = true;
    const obs = this.tratEditando
      ? this.hcService.actualizarTratamiento(this.tratEditId!, this.tratForm)
      : this.hcService.crearTratamiento(this.tratForm);
    obs.subscribe({
      next: () => {
        this.cargarTratamientos();
        this.cerrarModalTratamiento();
        this.guardando = false;
      },
      error: () => this.guardando = false
    });
  }

  cambiarEstadoTratamiento(t: Tratamiento): void {
    const nuevoEstado = t.estado === 'ACTIVO' ? 'COMPLETADO' : 'ACTIVO';
    this.hcService.cambiarEstadoTratamiento(t.id, { estado: nuevoEstado }).subscribe(() => this.cargarTratamientos());
  }

  verTratamiento(t: Tratamiento): void {
    this.tratamientoVer = true;
    this.tratEditando = false;
    this.tratEditId = t.id;
    this.tratForm = {
      idHistoriaClinica: t.idHistoriaClinica,
      idEvaluacion: t.idEvaluacion,
      idDoctor: t.idDoctor,
      nombre: t.nombre,
      descripcion: t.descripcion || '',
      objetivo: t.objetivo || '',
      frecuencia: t.frecuencia || '',
      duracionSemanas: t.duracionSemanas,
      planCamilla: t.planCamilla || '',
      planGym: t.planGym || '',
      fechaInicio: t.fechaInicio,
      fechaFin: t.fechaFin || undefined,
      estado: t.estado,
    };
    this.showModalTratamiento = true;
  }

  editarTratamiento(t: Tratamiento): void {
    this.abrirModalTratamiento(t);
  }

  eliminarTratamiento(t: Tratamiento): void {
    if (confirm('¿Eliminar este tratamiento?')) {
      this.hcService.eliminarTratamiento(t.id).subscribe(() => this.cargarTratamientos());
    }
  }

  abrirSesiones(t: Tratamiento): void {
    this.tabActivo = 'sesiones';
    this.sesionFiltroTratamientoId = t.id;
    this.cargarSesiones();
  }

  // ==================== SESIONES ====================

  cargarSesiones(): void {
    if (this.sesionFiltroTratamientoId > 0) {
      this.hcService.listarSesiones(this.sesionFiltroTratamientoId).subscribe(data => this.sesiones = data);
    } else {
      if (!this.hc) return;
      this.hcService.listarTratamientos(this.hc.id).subscribe(trats => {
        const all: Sesion[] = [];
        let count = 0;
        if (trats.length === 0) { this.sesiones = []; return; }
        trats.forEach(t => {
          this.hcService.listarSesiones(t.id).subscribe(data => {
            all.push(...data);
            count++;
            if (count === trats.length) {
              all.sort((a, b) => a.numeroSesion - b.numeroSesion);
              this.sesiones = all;
            }
          });
        });
      });
    }
  }

  abrirModalSesion(s?: Sesion): void {
    this.sesionVer = false;
    const doctor = this.doctores[0];
    if (s) {
      this.sesEditando = true;
      this.sesEditId = s.id;
      this.sesForm = {
        idTratamiento: s.idTratamiento,
        idCita: s.idCita,
        numeroSesion: s.numeroSesion,
        fecha: s.fecha,
        hora: s.hora || '',
        evaluacionSubjetiva: s.evaluacionSubjetiva || '',
        evaluacionObjetiva: s.evaluacionObjetiva || '',
        tratamientoRealizado: s.tratamientoRealizado || '',
        indicaciones: s.indicaciones || '',
        proximaSesionPlan: s.proximaSesionPlan || '',
        asistio: s.asistio,
        estado: s.estado,
      };
    } else {
      this.sesEditando = false;
      this.sesEditId = undefined;
      this.sesForm = {
        idTratamiento: this.tratamientos[0]?.id || 0,
        idCita: undefined,
        numeroSesion: 1,
        fecha: new Date().toISOString().substring(0, 10),
        hora: '',
        evaluacionSubjetiva: '',
        evaluacionObjetiva: '',
        tratamientoRealizado: '',
        indicaciones: '',
        proximaSesionPlan: '',
        asistio: undefined,
        estado: 'PROGRAMADA',
      };
    }
    this.showModalSesion = true;
  }

  cerrarModalSesion(): void {
    this.showModalSesion = false;
  }

  guardarSesion(): void {
    this.guardando = true;
    const obs = this.sesEditando
      ? this.hcService.actualizarSesion(this.sesEditId!, this.sesForm)
      : this.hcService.crearSesion(this.sesForm);
    obs.subscribe({
      next: () => {
        this.cargarSesiones();
        this.cerrarModalSesion();
        this.guardando = false;
      },
      error: () => this.guardando = false
    });
  }

  cambiarEstadoSesion(s: Sesion): void {
    if (s.estado === 'PROGRAMADA') {
      this.hcService.cambiarEstadoSesion(s.id, { estado: 'REALIZADA', asistio: true }).subscribe(() => this.cargarSesiones());
    } else if (s.estado === 'REALIZADA' || s.estado === 'NO_ASISTIO') {
      this.hcService.cambiarEstadoSesion(s.id, { estado: 'PROGRAMADA', asistio: undefined }).subscribe(() => this.cargarSesiones());
    }
  }

  verSesion(s: Sesion): void {
    this.sesionVer = true;
    this.sesEditando = false;
    this.sesEditId = s.id;
    this.sesForm = {
      idTratamiento: s.idTratamiento,
      idCita: s.idCita,
      numeroSesion: s.numeroSesion,
      fecha: s.fecha,
      hora: s.hora || '',
      evaluacionSubjetiva: s.evaluacionSubjetiva || '',
      evaluacionObjetiva: s.evaluacionObjetiva || '',
      tratamientoRealizado: s.tratamientoRealizado || '',
      indicaciones: s.indicaciones || '',
      proximaSesionPlan: s.proximaSesionPlan || '',
      asistio: s.asistio,
      estado: s.estado,
    };
    this.showModalSesion = true;
  }

  editarSesion(s: Sesion): void {
    this.abrirModalSesion(s);
  }

  eliminarSesion(s: Sesion): void {
    if (confirm('¿Eliminar esta sesión?')) {
      this.hcService.eliminarSesion(s.id).subscribe(() => this.cargarSesiones());
    }
  }
}
