import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  Users,
  Clock,
  ArrowUpRight,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-angular';

export type EstadoEstilista = 'Disponible' | 'En Sesión' | 'En Descanso';

export interface EstilistaHoy {
  id: number;
  nombre: string;
  especialidad: string;
  avatarUrl: string;
  estado: EstadoEstilista;
  proximaHora?: string;
}

export interface ServicioPopular {
  id: number;
  nombre: string;
  reservasMes: number;
  porcentaje: number;
  acento: 'teal' | 'purple';
}

export interface CitaDiaria {
  id: number;
  hora: string;
  duracion: string;
  nombreClienta: string;
  servicio: string;
  nombreEstilista: string;
  avatarEstilista: string;
  dia: number;
}

export interface DiaCalendario {
  numero: number | null;
  tieneCitas?: boolean;
  tipoIndicador?: 'amber' | 'teal';
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard-home.component.html'
})
export class DashboardHomeComponent {
  // Íconos de Lucide con trazo fino (stroke-width="1.5")
  readonly icons = {
    CalendarCheck,
    TrendingUp,
    Sparkles,
    Users,
    Clock,
    ArrowUpRight,
    Award,
    ChevronLeft,
    ChevronRight
  };

  readonly iconStrokeWidth = 1.5;

  // ==================== 1. SIGNALS: KPIs SUPERIORES ====================
  readonly reservasHoy = signal<number>(28);
  readonly crecimientoReservas = signal<string>('+12%');
  readonly ingresosDia = signal<string>('$1,840.000');

  // ==================== 2. SIGNAL: MINI CALENDARIO INTERACTIVO ====================
  readonly mesActual = signal<string>('Noviembre 2026');
  readonly diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  // Signal del Día Seleccionado (por defecto día 6)
  readonly diaSeleccionado = signal<number>(6);

  // Cuadrícula de días del mes con indicadores (dots) de citas agendadas
  readonly diasCalendario = signal<DiaCalendario[]>([
    { numero: 1 },
    { numero: 2, tieneCitas: true, tipoIndicador: 'teal' },
    { numero: 3, tieneCitas: true, tipoIndicador: 'amber' },
    { numero: 4 },
    { numero: 5, tieneCitas: true, tipoIndicador: 'teal' },
    { numero: 6, tieneCitas: true, tipoIndicador: 'amber' },
    { numero: 7, tieneCitas: true, tipoIndicador: 'teal' },
    { numero: 8 },
    { numero: 9, tieneCitas: true, tipoIndicador: 'teal' },
    { numero: 10 },
    { numero: 11, tieneCitas: true, tipoIndicador: 'amber' },
    { numero: 12, tieneCitas: true, tipoIndicador: 'teal' },
    { numero: 13 },
    { numero: 14, tieneCitas: true, tipoIndicador: 'amber' },
    { numero: 15 },
    { numero: 16, tieneCitas: true, tipoIndicador: 'teal' },
    { numero: 17 },
    { numero: 18, tieneCitas: true, tipoIndicador: 'teal' },
    { numero: 19, tieneCitas: true, tipoIndicador: 'amber' },
    { numero: 20, tieneCitas: true, tipoIndicador: 'teal' },
    { numero: 21, tieneCitas: true, tipoIndicador: 'amber' },
    { numero: 22 },
    { numero: 23, tieneCitas: true, tipoIndicador: 'teal' },
    { numero: 24 },
    { numero: 25, tieneCitas: true, tipoIndicador: 'amber' },
    { numero: 26 },
    { numero: 27, tieneCitas: true, tipoIndicador: 'teal' },
    { numero: 28, tieneCitas: true, tipoIndicador: 'amber' },
    { numero: 29 },
    { numero: 30, tieneCitas: true, tipoIndicador: 'teal' },
  ]);

  // Función interactiva para actualizar el Signal del Día Seleccionado
  seleccionarDia(dia: number | null): void {
    if (dia !== null) {
      this.diaSeleccionado.set(dia);
    }
  }

  // ==================== 3. SIGNAL: CITAS DIARIAS (Daily Appointments) ====================
  readonly citasDiarias = signal<CitaDiaria[]>([
    {
      id: 1,
      hora: '09:30 AM',
      duracion: '120 min',
      nombreClienta: 'Lucía Fernández',
      servicio: 'Balayage',
      nombreEstilista: 'Isabela Vargas',
      avatarEstilista: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      dia: 6
    },
    {
      id: 2,
      hora: '10:30 AM',
      duracion: '75 min',
      nombreClienta: 'Paula Andrea Gómez',
      servicio: 'Manicure Semipermanente',
      nombreEstilista: 'Camila Restrepo',
      avatarEstilista: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      dia: 6
    },
    {
      id: 3,
      hora: '11:45 AM',
      duracion: '90 min',
      nombreClienta: 'Daniela Ospina',
      servicio: 'Pestañas Volumen Ruso',
      nombreEstilista: 'Valentina Morales',
      avatarEstilista: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      dia: 6
    },
    {
      id: 4,
      hora: '02:15 PM',
      duracion: '150 min',
      nombreClienta: 'Carolina Jaramillo',
      servicio: 'Micropigmentación',
      nombreEstilista: 'Sofía Mendoza',
      avatarEstilista: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
      dia: 6
    },
    {
      id: 5,
      hora: '04:00 PM',
      duracion: '60 min',
      nombreClienta: 'Natalia Echeverri',
      servicio: 'Laminado de Cejas',
      nombreEstilista: 'Mariana Duarte',
      avatarEstilista: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      dia: 6
    }
  ]);

  // ==================== 4. SIGNAL: ESTADO DE ESTILISTAS (Stylists Today) ====================
  readonly estilistasHoy = signal<EstilistaHoy[]>([
    {
      id: 1,
      nombre: 'Valentina Morales',
      especialidad: 'Especialista en Mirada & Pestañas',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      estado: 'En Sesión',
      proximaHora: 'Libre 11:30 AM'
    },
    {
      id: 2,
      nombre: 'Camila Restrepo',
      especialidad: 'Nail Artist Senior',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      estado: 'Disponible',
      proximaHora: 'Recepción inmediata'
    },
    {
      id: 3,
      nombre: 'Sofía Mendoza',
      especialidad: 'Micropigmentación & Cejas',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
      estado: 'En Sesión',
      proximaHora: 'Libre 12:15 PM'
    },
    {
      id: 4,
      nombre: 'Isabela Vargas',
      especialidad: 'Colorimetría & Balayage',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      estado: 'En Descanso',
      proximaHora: 'Regresa 02:00 PM'
    },
    {
      id: 5,
      nombre: 'Mariana Duarte',
      especialidad: 'Manicura Rusa & Spa',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      estado: 'Disponible',
      proximaHora: 'Recepción inmediata'
    }
  ]);

  readonly estilistasDisponiblesCount = computed(
    () => this.estilistasHoy().filter(e => e.estado === 'Disponible').length
  );

  // ==================== 5. SIGNAL: SERVICIOS POPULARES ====================
  readonly serviciosPopulares = signal<ServicioPopular[]>([
    {
      id: 1,
      nombre: 'Pestañas Volumen Ruso',
      reservasMes: 142,
      porcentaje: 88,
      acento: 'teal'
    },
    {
      id: 2,
      nombre: 'Uñas Semipermanentes',
      reservasMes: 118,
      porcentaje: 74,
      acento: 'purple'
    },
    {
      id: 3,
      nombre: 'Micropigmentación',
      reservasMes: 86,
      porcentaje: 56,
      acento: 'teal'
    }
  ]);

  getEstadoBadgeClasses(estado: EstadoEstilista): string {
    switch (estado) {
      case 'Disponible':
        return 'bg-teal-100/80 text-teal-700 ring-1 ring-teal-500/15';
      case 'En Sesión':
        return 'bg-purple-100/80 text-purple-700 ring-1 ring-purple-500/15';
      case 'En Descanso':
        return 'bg-amber-100/80 text-amber-700 ring-1 ring-amber-500/15';
    }
  }

  getEstadoDotClasses(estado: EstadoEstilista): string {
    switch (estado) {
      case 'Disponible':
        return 'bg-teal-500';
      case 'En Sesión':
        return 'bg-purple-500';
      case 'En Descanso':
        return 'bg-amber-400';
    }
  }
}
