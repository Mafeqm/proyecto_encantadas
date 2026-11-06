import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import {
  CitaRequestDTO,
  CitaResponseDTO,
  CompletarCitaDTO,
  EstadoCita
} from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/citas';

  // Estado reactivo con Signals para alimentar el Bento Box
  private readonly _citas = signal<CitaResponseDTO[]>([
    {
      idCita: 101,
      idClienta: 1,
      nombreClienta: 'Valentina Gómez',
      numeroWhatsapp: '+57 300 412 8890',
      idEstilista: 1,
      nombreEstilista: 'Camila Ríos',
      idServicio: 1,
      nombreServicio: 'Balayage & Hidratación Profunda',
      duracionMinutos: 120,
      precioBaseServicio: 240000,
      fechaHoraInicio: '2026-11-06T09:30:00-05:00',
      fechaHoraFin: '2026-11-06T11:30:00-05:00',
      estado: 'Completada',
      observaciones: 'Tono caramelo cálido, alérgica a amoníaco fuerte.',
      valorFinalCobrado: 240000,
      esPromocion: false,
      gananciaEstilista: 108000, // 45%
      gananciaSalon: 132000 // 55%
    },
    {
      idCita: 102,
      idClienta: 2,
      nombreClienta: 'Mariana Restrepo',
      numeroWhatsapp: '+57 311 590 2341',
      idEstilista: 2,
      nombreEstilista: 'Sofía Mendoza',
      idServicio: 2,
      nombreServicio: 'Lifting de Pestañas + Diseño Cejas',
      duracionMinutos: 60,
      precioBaseServicio: 95000,
      fechaHoraInicio: '2026-11-06T11:00:00-05:00',
      fechaHoraFin: '2026-11-06T12:00:00-05:00',
      estado: 'Confirmada',
      observaciones: 'Cliente frecuente VIP.'
    },
    {
      idCita: 103,
      idClienta: 3,
      nombreClienta: 'Isabela Torres',
      numeroWhatsapp: '+57 315 821 3319',
      idEstilista: 1,
      nombreEstilista: 'Camila Ríos',
      idServicio: 3,
      nombreServicio: 'Manicura Rusa & Gel Semi-permanente',
      duracionMinutos: 75,
      precioBaseServicio: 70000,
      fechaHoraInicio: '2026-11-06T13:30:00-05:00',
      fechaHoraFin: '2026-11-06T14:45:00-05:00',
      estado: 'Pendiente',
      observaciones: 'Aplica promoción de jueves/viernes.'
    },
    {
      idCita: 104,
      idClienta: 4,
      nombreClienta: 'Gabriela Duarte',
      numeroWhatsapp: '+57 320 994 1020',
      idEstilista: 3,
      nombreEstilista: 'Daniela Vargas',
      idServicio: 4,
      nombreServicio: 'Keratina Orgánica Efecto Espejo',
      duracionMinutos: 150,
      precioBaseServicio: 210000,
      fechaHoraInicio: '2026-11-06T15:00:00-05:00',
      fechaHoraFin: '2026-11-06T17:30:00-05:00',
      estado: 'Confirmada'
    }
  ]);

  readonly citas = this._citas.asReadonly();

  // KPIs Computados automáticamente desde el Signal de citas
  readonly totalRecaudadoHoy = computed(() =>
    this._citas()
      .filter(c => c.estado === 'Completada')
      .reduce((acc, c) => acc + (c.valorFinalCobrado ?? 0), 0)
  );

  readonly totalGananciaSalon = computed(() =>
    this._citas()
      .filter(c => c.estado === 'Completada')
      .reduce((acc, c) => acc + (c.gananciaSalon ?? 0), 0)
  );

  readonly totalComisionEstilistas = computed(() =>
    this._citas()
      .filter(c => c.estado === 'Completada')
      .reduce((acc, c) => acc + (c.gananciaEstilista ?? 0), 0)
  );

  readonly citasActivasCount = computed(() =>
    this._citas().filter(c => c.estado === 'Pendiente' || c.estado === 'Confirmada').length
  );

  readonly citasCompletadasCount = computed(() =>
    this._citas().filter(c => c.estado === 'Completada').length
  );

  /**
   * POST /api/citas/reservar-publica
   */
  crearCitaPublica(dto: CitaRequestDTO, meta?: {
    nombreClienta: string;
    numeroWhatsapp: string;
    nombreEstilista: string;
    nombreServicio: string;
    duracionMinutos: number;
    precioBaseServicio: number;
  }): Observable<CitaResponseDTO> {
    return this.http.post<CitaResponseDTO>(`${this.apiUrl}/reservar-publica`, dto).pipe(
      tap(nueva => this._citas.update(list => [nueva, ...list])),
      catchError(() => {
        // Fallback reactivo en memoria si el backend local aún no está levantado
        const inicio = new Date(dto.fechaHoraInicio);
        const duracion = meta?.duracionMinutos ?? 60;
        const fin = new Date(inicio.getTime() + duracion * 60000);
        const fallback: CitaResponseDTO = {
          idCita: Math.floor(Math.random() * 900) + 200,
          idClienta: dto.idClienta,
          nombreClienta: meta?.nombreClienta ?? `Clienta #${dto.idClienta}`,
          numeroWhatsapp: meta?.numeroWhatsapp ?? '+57 300 000 0000',
          idEstilista: dto.idEstilista,
          nombreEstilista: meta?.nombreEstilista ?? 'Camila Ríos',
          idServicio: dto.idServicio,
          nombreServicio: meta?.nombreServicio ?? 'Servicio de Salón',
          duracionMinutos: duracion,
          precioBaseServicio: meta?.precioBaseServicio ?? 85000,
          fechaHoraInicio: dto.fechaHoraInicio,
          fechaHoraFin: fin.toISOString(),
          estado: 'Pendiente',
          observaciones: dto.observaciones
        };
        this._citas.update(list => [fallback, ...list]);
        return of(fallback);
      })
    );
  }

  /**
   * PUT /api/citas/{id}/completar
   * Calcula comisión 45% normal o 50% si es promoción.
   */
  completarCita(idCita: number, dto: CompletarCitaDTO): Observable<CitaResponseDTO> {
    return this.http.put<CitaResponseDTO>(`${this.apiUrl}/${idCita}/completar`, dto).pipe(
      tap(actualizada => {
        this._citas.update(list =>
          list.map(c => (c.idCita === idCita ? actualizada : c))
        );
      }),
      catchError(() => {
        // Fallback con la misma regla de negocio de CitaService.java (45% normal, 50% promoción)
        const factor = dto.esPromocion ? 0.5 : 0.45;
        const gananciaEstilista = Math.round(dto.valorFinalCobrado * factor);
        const gananciaSalon = dto.valorFinalCobrado - gananciaEstilista;

        let updatedCita!: CitaResponseDTO;
        this._citas.update(list =>
          list.map(c => {
            if (c.idCita === idCita) {
              updatedCita = {
                ...c,
                estado: 'Completada',
                valorFinalCobrado: dto.valorFinalCobrado,
                esPromocion: dto.esPromocion,
                gananciaEstilista,
                gananciaSalon
              };
              return updatedCita;
            }
            return c;
          })
        );
        return of(updatedCita);
      })
    );
  }

  /**
   * PUT /api/citas/{id}/cancelar-retraso
   */
  cancelarPorRetraso(idCita: number): Observable<CitaResponseDTO> {
    return this.http.put<CitaResponseDTO>(`${this.apiUrl}/${idCita}/cancelar-retraso`, {}).pipe(
      tap(actualizada => {
        this._citas.update(list =>
          list.map(c => (c.idCita === idCita ? actualizada : c))
        );
      }),
      catchError(() => {
        let updatedCita!: CitaResponseDTO;
        this._citas.update(list =>
          list.map(c => {
            if (c.idCita === idCita) {
              updatedCita = { ...c, estado: 'Cancelada_por_retraso' };
              return updatedCita;
            }
            return c;
          })
        );
        return of(updatedCita);
      })
    );
  }
}

