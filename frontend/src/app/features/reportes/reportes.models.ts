export interface VentaDetalle {
  pacienteNombre: string;
  servicio: string;
  metodoPago: string;
  monto: number;
}

export interface ReporteVentaPeriodo {
  fecha: string;
  cantidadVentas: number;
  totalEfectivo: number;
  totalYapePlin: number;
  totalGeneral: number;
  ventas: VentaDetalle[];
}

export interface IngresoServicioDetalle {
  fecha: string;
  pacienteNombre: string;
  monto: number;
}

export interface ReporteIngresoServicio {
  servicio: string;
  cantidad: number;
  total: number;
  detalleCitas: IngresoServicioDetalle[];
}

export interface AtencionDoctorDetalle {
  fecha: string;
  pacienteNombre: string;
  estado: string;
}

export interface ReporteAtencionDoctor {
  idDoctor: number;
  nombreDoctor: string;
  totalCitasCompletadas: number;
  totalCitasCanceladas: number;
  totalCitasNoAsistio: number;
  capacidadTotal: number;
  porcentajeOcupacion: number;
  citas: AtencionDoctorDetalle[];
  slots: OcupacionDetalle[];
}

export interface ReporteCierresCaja {
  id: number;
  idUsuario: number;
  nombreUsuario: string;
  fechaApertura: string;
  montoInicial: number;
  fechaCierre: string | null;
  montoFinalEfectivo: number | null;
  montoFinalYapePlin: number | null;
  totalVentas: number | null;
  observaciones: string | null;
  estado: string;
  cantidadVentas: number;
  esperadoEfectivo: number;
  esperadoYapePlin: number;
  diferenciaEfectivo: number;
  diferenciaYapePlin: number;
  ventasDetalle: VentaDetalle[];
}

export interface PacienteDetalle {
  nombrePaciente: string;
}

export interface ReportePacientes {
  pacientesNuevos: number;
  pacientesRecurrentes: number;
  totalPacientes: number;
  pacientesPorDia: PacientePorDia[];
}

export interface PacientePorDia {
  fecha: string;
  total: number;
  pacientes: PacienteDetalle[];
}

export interface OcupacionDetalle {
  horaInicio: string;
  horaFin: string;
  pacienteNombre: string;
  estado: string;
}

export interface ReporteOcupacion {
  porcentajeOcupacion: number;
  totalCitas: number;
  totalDisponible: number;
  doctores: DoctorOcupacion[];
}

export interface DoctorOcupacion {
  idDoctor: number;
  nombreDoctor: string;
  citasAtendidas: number;
  capacidadTotal: number;
  porcentaje: number;
  slots: OcupacionDetalle[];
}
