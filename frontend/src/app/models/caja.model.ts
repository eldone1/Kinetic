export interface CajaResponse {
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
  cantidadVentas: number | null;
}

export interface CajaAperturaRequest {
  montoInicial: number;
  observaciones?: string;
}

export interface CajaCierreRequest {
  montoFinalEfectivo: number;
  montoFinalYapePlin: number;
  observaciones?: string;
}
