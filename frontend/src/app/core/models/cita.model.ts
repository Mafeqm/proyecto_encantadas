export type EstadoCita =
  | 'Pendiente'
  | 'Confirmada'
  | 'Completada'
  | 'Cancelada_por_retraso';

export interface CitaRequestDTO {
  idClienta: number;
  idEstilista: number;
  idServicio: number;
  fechaHoraInicio: string; // ISO-8601 OffsetDateTime
  observaciones?: string;
}

export interface CompletarCitaDTO {
  valorFinalCobrado: number;
  esPromocion: boolean;
}

export interface CitaResponseDTO {
  idCita: number;
  idClienta: number;
  nombreClienta: string;
  numeroWhatsapp: string;
  idEstilista: number;
  nombreEstilista: string;
  idServicio: number;
  nombreServicio: string;
  duracionMinutos: number;
  precioBaseServicio: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: EstadoCita;
  observaciones?: string;
  valorFinalCobrado?: number | null;
  esPromocion?: boolean | null;
  gananciaEstilista?: number | null;
  gananciaSalon?: number | null;
}

