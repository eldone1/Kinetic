export interface VentaResponse {
  id: number;
  idCaja: number;
  idPaciente: number;
  nombrePaciente: string;
  documentoPaciente: string;
  idCita: number;
  fechaCita: string;
  horaCita: string;
  idUsuario: number;
  nombreUsuario: string;
  fechaVenta: string;
  total: number;
  metodoPago: string;
  montoRecibido: number | null;
  cambio: number | null;
  estado: string;
}

export interface VentaRequest {
  idPaciente: number;
  idCita: number;
  total: number;
  metodoPago: string;
  montoRecibido?: number;
  cambio?: number;
}
