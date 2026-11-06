import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Sparkles,
  CalendarCheck2,
  Clock,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Phone,
  Plus,
  Percent,
  UserCheck,
  Scissors,
  X
} from 'lucide-angular';
import { CitaService } from '../../core/services/cita.service';
import { CitaResponseDTO, EstadoCita } from '../../core/models/cita.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    LucideAngularModule
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  readonly citaService = inject(CitaService);

  readonly icons = {
    Sparkles,
    CalendarCheck2,
    Clock,
    Wallet,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Phone,
    Plus,
    Percent,
    UserCheck,
    Scissors,
    X
  };

  readonly iconStrokeWidth = 1.5;

  // Filtro reactivo de estado en el Bento de Agenda
  readonly filtroEstado = signal<'TODAS' | EstadoCita>('TODAS');

  readonly citasFiltradas = computed(() => {
    const estado = this.filtroEstado();
    const todas = this.citaService.citas();
    if (estado === 'TODAS') return todas;
    return todas.filter(c => c.estado === estado);
  });

  // Resumen de comisiones agrupado por Estilista
  readonly resumenEstilistas = computed(() => {
    const mapa = new Map<string, { nombre: string; citasHoy: number; comisionAcumulada: number }>();

    for (const cita of this.citaService.citas()) {
      const actual = mapa.get(cita.nombreEstilista) ?? {
        nombre: cita.nombreEstilista,
        citasHoy: 0,
        comisionAcumulada: 0
      };
      if (cita.estado !== 'Cancelada_por_retraso') {
        actual.citasHoy += 1;
      }
      if (cita.estado === 'Completada' && cita.gananciaEstilista) {
        actual.comisionAcumulada += cita.gananciaEstilista;
      }
      mapa.set(cita.nombreEstilista, actual);
    }
    return Array.from(mapa.values());
  });

  // ==================== MODAL: COMPLETAR Y LIQUIDAR CITA ====================
  readonly citaSeleccionadaParaLiquidar = signal<CitaResponseDTO | null>(null);
  readonly valorCobradoInput = signal<number>(0);
  readonly esPromocionInput = signal<boolean>(false);

  // Cálculo en vivo de la comisión (45% normal / 50% promoción) igual que en Spring Boot
  readonly previewGananciaEstilista = computed(() => {
    const monto = this.valorCobradoInput() || 0;
    const factor = this.esPromocionInput() ? 0.50 : 0.45;
    return Math.round(monto * factor);
  });

  readonly previewGananciaSalon = computed(() => {
    const monto = this.valorCobradoInput() || 0;
    return monto - this.previewGananciaEstilista();
  });

  abrirModalLiquidar(cita: CitaResponseDTO): void {
    this.citaSeleccionadaParaLiquidar.set(cita);
    this.valorCobradoInput.set(cita.precioBaseServicio);
    this.esPromocionInput.set(false);
  }

  cerrarModalLiquidar(): void {
    this.citaSeleccionadaParaLiquidar.set(null);
  }

  confirmarLiquidacion(): void {
    const cita = this.citaSeleccionadaParaLiquidar();
    if (!cita) return;

    this.citaService.completarCita(cita.idCita, {
      valorFinalCobrado: this.valorCobradoInput(),
      esPromocion: this.esPromocionInput()
    }).subscribe(() => {
      this.cerrarModalLiquidar();
    });
  }

  // ==================== ACCIÓN: CANCELAR POR RETRASO ====================
  cancelarCitaPorRetraso(cita: CitaResponseDTO): void {
    this.citaService.cancelarPorRetraso(cita.idCita).subscribe();
  }

  // ==================== MODAL: NUEVA CITA RÁPIDA ====================
  readonly modalNuevaCitaAbierto = signal<boolean>(false);

  nuevaCitaForm = {
    idClienta: 1,
    nombreClienta: '',
    numeroWhatsapp: '+57 300 ',
    idEstilista: 1,
    idServicio: 1,
    horaInicio: '16:00',
    observaciones: ''
  };

  readonly catalogoEstilistas = [
    { id: 1, nombre: 'Camila Ríos' },
    { id: 2, nombre: 'Sofía Mendoza' },
    { id: 3, nombre: 'Daniela Vargas' }
  ];

  readonly catalogoServicios = [
    { id: 1, nombre: 'Balayage & Hidratación Profunda', duracion: 120, precio: 240000 },
    { id: 2, nombre: 'Lifting de Pestañas + Diseño Cejas', duracion: 60, precio: 95000 },
    { id: 3, nombre: 'Manicura Rusa & Gel Semi-permanente', duracion: 75, precio: 70000 },
    { id: 4, nombre: 'Keratina Orgánica Efecto Espejo', duracion: 150, precio: 210000 }
  ];

  abrirModalNuevaCita(): void {
    this.modalNuevaCitaAbierto.set(true);
  }

  cerrarModalNuevaCita(): void {
    this.modalNuevaCitaAbierto.set(false);
  }

  guardarNuevaCita(): void {
    const estilista = this.catalogoEstilistas.find(e => e.id === Number(this.nuevaCitaForm.idEstilista)) ?? this.catalogoEstilistas[0];
    const servicio = this.catalogoServicios.find(s => s.id === Number(this.nuevaCitaForm.idServicio)) ?? this.catalogoServicios[0];

    const fechaHoy = new Date().toISOString().split('T')[0];
    const isoOffset = `${fechaHoy}T${this.nuevaCitaForm.horaInicio}:00-05:00`;

    this.citaService.crearCitaPublica(
      {
        idClienta: this.nuevaCitaForm.idClienta,
        idEstilista: estilista.id,
        idServicio: servicio.id,
        fechaHoraInicio: isoOffset,
        observaciones: this.nuevaCitaForm.observaciones
      },
      {
        nombreClienta: this.nuevaCitaForm.nombreClienta.trim() || 'Nueva Clienta',
        numeroWhatsapp: this.nuevaCitaForm.numeroWhatsapp,
        nombreEstilista: estilista.nombre,
        nombreServicio: servicio.nombre,
        duracionMinutos: servicio.duracion,
        precioBaseServicio: servicio.precio
      }
    ).subscribe(() => {
      this.nuevaCitaForm.nombreClienta = '';
      this.nuevaCitaForm.observaciones = '';
      this.cerrarModalNuevaCita();
    });
  }
}

