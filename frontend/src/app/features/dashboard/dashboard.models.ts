export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DashboardAdmin {
  ventasDelDia: number;
  ventasDelMes: number;
  ticketPromedio: number;
  pacientesNuevosHoy: number;
  pacientesActivos: number;
  citasProgramadasHoy: number;
  citasCompletadasHoy: number;
  sesionesRealizadasHoy: number;
  cajasAbiertas: number;
  cajasCerradasHoy: number;
  ventasMensuales: ChartDataPoint[];
  pacientesPorDia: ChartDataPoint[];
  serviciosMasDemandados: ChartDataPoint[];
  rendimientoDoctores: ChartDataPoint[];
  cajasSinCerrar: number;
}

export interface DashboardDoctor {
  pacientesAtendidosHoy: number;
  citasPendientes: number;
  citasCompletadasHoy: number;
  sesionesProgramadasHoy: number;
  pacientesEnTratamientoActivo: number;
  agendaDelDia: any[];
  proximasCitas: any[];
  pacientesRecientes: any[];
  atencionesPorDia: ChartDataPoint[];
  distribucionTratamientos: ChartDataPoint[];
}

export interface DashboardRecepcion {
  citasDelDia: number;
  pacientesEnEspera: number;
  citasConfirmadas: number;
  citasCanceladas: number;
  ventasDelDia: number;
  cajaActual: any;
  agendaDelDia: any[];
  cobrosPendientes: any[];
  ultimasVentas: any[];
  totalEfectivo: number;
  totalYapePlin: number;
  cobrosPorMetodoPago: ChartDataPoint[];
  serviciosMasVendidos: ChartDataPoint[];
}
