import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Sparkles,
  Star,
  Calendar,
  Clock,
  User,
  Phone,
  Check,
  ArrowRight,
  Heart,
  MapPin
} from 'lucide-angular';
import { CitaService } from '../../core/services/cita.service';

export type CategoriaPublica = 'Pestañas' | 'Cejas' | 'Uñas';

export interface ItemPortafolio {
  id: number;
  titulo: string;
  categoria: CategoriaPublica;
  imagenUrl: string;
}

export interface ServicioPublico {
  id: number;
  categoria: CategoriaPublica;
  nombre: string;
  duracionMinutos: number;
  precio: number;
}

export interface EstilistaPublica {
  id: number; // 0 = Cualquiera disponible
  nombre: string;
  rol: string;
  avatarUrl?: string;
  esGenerica?: boolean;
}

export interface DiaProximo {
  id: string;
  diaSemana: string;
  numeroDia: string;
  mesCorto: string;
  fechaIso: string;
}

export interface HoraSlot {
  etiqueta: string;
  hora24: string;
  disponible: boolean;
}

@Component({
  selector: 'app-client-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CurrencyPipe,
    LucideAngularModule
  ],
  templateUrl: './client-booking.component.html'
})
export class ClientBookingComponent {
  private readonly citaService = inject(CitaService);

  // Íconos Lucide con trazo fino (stroke-width="1.5")
  readonly icons = {
    Sparkles,
    Star,
    Calendar,
    Clock,
    User,
    Phone,
    Check,
    ArrowRight,
    Heart,
    MapPin
  };

  readonly iconStrokeWidth = 1.5;

  // ==================== 1. SIGNAL: GALERÍA / PORTAFOLIO VISUAL ====================
  readonly portafolio = signal<ItemPortafolio[]>([
    {
      id: 1,
      titulo: 'Pestañas Volumen Ruso Sutil',
      categoria: 'Pestañas',
      imagenUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      titulo: 'Manicura Rusa & Soft Gel',
      categoria: 'Uñas',
      imagenUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      titulo: 'Laminado & Diseño de Cejas HD',
      categoria: 'Cejas',
      imagenUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      titulo: 'Nail Art Perla & Cromo',
      categoria: 'Uñas',
      imagenUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  // ==================== 2. SIGNALS: CATEGORÍAS Y SERVICIOS ====================
  readonly categorias = signal<CategoriaPublica[]>(['Uñas', 'Cejas', 'Pestañas']);
  readonly categoriaSeleccionada = signal<CategoriaPublica>('Pestañas');

  readonly catalogoServicios = signal<ServicioPublico[]>([
    { id: 1, categoria: 'Pestañas', nombre: 'Pestañas Volumen Ruso', duracionMinutos: 120, precio: 160000 },
    { id: 2, categoria: 'Pestañas', nombre: 'Lifting de Pestañas + Keratina', duracionMinutos: 60, precio: 95000 },
    { id: 3, categoria: 'Cejas', nombre: 'Micropigmentación Shadow Brows', duracionMinutos: 150, precio: 280000 },
    { id: 4, categoria: 'Cejas', nombre: 'Diseño HD + Laminado Orgánico', duracionMinutos: 45, precio: 65000 },
    { id: 5, categoria: 'Uñas', nombre: 'Uñas Semipermanentes Nivelación', duracionMinutos: 75, precio: 75000 },
    { id: 6, categoria: 'Uñas', nombre: 'Sistema Acrílico Esculpido', duracionMinutos: 120, precio: 135000 }
  ]);

  readonly serviciosDeCategoria = computed(() =>
    this.catalogoServicios().filter(s => s.categoria === this.categoriaSeleccionada())
  );

  readonly servicioSeleccionado = signal<ServicioPublico>({
    id: 1,
    categoria: 'Pestañas',
    nombre: 'Pestañas Volumen Ruso',
    duracionMinutos: 120,
    precio: 160000
  });

  seleccionarCategoria(cat: CategoriaPublica): void {
    this.categoriaSeleccionada.set(cat);
    const primero = this.catalogoServicios().find(s => s.categoria === cat);
    if (primero) {
      this.servicioSeleccionado.set(primero);
    }
  }

  seleccionarServicio(srv: ServicioPublico): void {
    this.servicioSeleccionado.set(srv);
  }

  // ==================== 3. SIGNAL: SELECCIÓN DE ESTILISTA ====================
  readonly estilistas = signal<EstilistaPublica[]>([
    {
      id: 0,
      nombre: 'Cualquiera disponible',
      rol: 'Asignación inteligente',
      esGenerica: true
    },
    {
      id: 1,
      nombre: 'Valentina',
      rol: 'Lashista Senior',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 2,
      nombre: 'Camila',
      rol: 'Nail Artist',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 3,
      nombre: 'Sofía',
      rol: 'Especialista Cejas',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 4,
      nombre: 'Mariana',
      rol: 'Spa & Manicura',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    }
  ]);

  readonly estilistaSeleccionadaId = signal<number>(0);

  seleccionarEstilista(id: number): void {
    this.estilistaSeleccionadaId.set(id);
  }

  // ==================== 4. SIGNALS: PRÓXIMOS 7 DÍAS Y HORAS DISPONIBLES ====================
  readonly proximos7Dias = signal<DiaProximo[]>([
    { id: 'd1', diaSemana: 'Lun', numeroDia: '12', mesCorto: 'Nov', fechaIso: '2026-11-12' },
    { id: 'd2', diaSemana: 'Mar', numeroDia: '13', mesCorto: 'Nov', fechaIso: '2026-11-13' },
    { id: 'd3', diaSemana: 'Mié', numeroDia: '14', mesCorto: 'Nov', fechaIso: '2026-11-14' },
    { id: 'd4', diaSemana: 'Jue', numeroDia: '15', mesCorto: 'Nov', fechaIso: '2026-11-15' },
    { id: 'd5', diaSemana: 'Vie', numeroDia: '16', mesCorto: 'Nov', fechaIso: '2026-11-16' },
    { id: 'd6', diaSemana: 'Sáb', numeroDia: '17', mesCorto: 'Nov', fechaIso: '2026-11-17' },
    { id: 'd7', diaSemana: 'Dom', numeroDia: '18', mesCorto: 'Nov', fechaIso: '2026-11-18' }
  ]);

  readonly diaSeleccionado = signal<DiaProximo>(this.proximos7Dias()[0]);

  readonly horasDisponibles = signal<HoraSlot[]>([
    { etiqueta: '09:00 AM', hora24: '09:00', disponible: true },
    { etiqueta: '10:30 AM', hora24: '10:30', disponible: true },
    { etiqueta: '12:00 PM', hora24: '12:00', disponible: false },
    { etiqueta: '02:00 PM', hora24: '14:00', disponible: true },
    { etiqueta: '03:30 PM', hora24: '15:30', disponible: true },
    { etiqueta: '04:45 PM', hora24: '16:45', disponible: false },
    { etiqueta: '05:30 PM', hora24: '17:30', disponible: true },
    { etiqueta: '06:30 PM', hora24: '18:30', disponible: true }
  ]);

  readonly horaSeleccionada = signal<HoraSlot>(this.horasDisponibles()[0]);

  seleccionarDia(dia: DiaProximo): void {
    this.diaSeleccionado.set(dia);
  }

  seleccionarHora(slot: HoraSlot): void {
    if (!slot.disponible) return;
    this.horaSeleccionada.set(slot);
  }

  // ==================== 5. SIGNALS: FORMULARIO SIN FRICCIÓN Y CONFIRMACIÓN ====================
  readonly nombreClienta = signal<string>('');
  readonly whatsappClienta = signal<string>('');
  readonly reservaConfirmada = signal<boolean>(false);

  confirmarReserva(): void {
    const nombre = this.nombreClienta().trim();
    const whatsapp = this.whatsappClienta().trim();
    if (!nombre || !whatsapp) return;

    const estilistaId = this.estilistaSeleccionadaId() === 0 ? 1 : this.estilistaSeleccionadaId();
    const estilistaObj = this.estilistas().find(e => e.id === estilistaId);
    const srv = this.servicioSeleccionado();
    const dia = this.diaSeleccionado();
    const hora = this.horaSeleccionada();

    const isoOffset = `${dia.fechaIso}T${hora.hora24}:00-05:00`;

    this.citaService.crearCitaPublica(
      {
        idClienta: 1,
        idEstilista: estilistaId,
        idServicio: srv.id,
        fechaHoraInicio: isoOffset,
        observaciones: 'Reserva pública desde vista móvil'
      },
      {
        nombreClienta: nombre,
        numeroWhatsapp: whatsapp,
        nombreEstilista: estilistaObj?.nombre ?? 'Valentina',
        nombreServicio: srv.nombre,
        duracionMinutos: srv.duracionMinutos,
        precioBaseServicio: srv.precio
      }
    ).subscribe(() => {
      this.reservaConfirmada.set(true);
    });
  }

  nuevaReserva(): void {
    this.nombreClienta.set('');
    this.whatsappClienta.set('');
    this.reservaConfirmada.set(false);
  }
}
