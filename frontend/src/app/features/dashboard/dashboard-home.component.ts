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
  Award
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
    Award
  };

  readonly iconStrokeWidth = 1.5;

  // Signals para KPIs destacados
  readonly reservasHoy = signal<number>(28);
  readonly crecimientoReservas = signal<string>('+12%');
  readonly ingresosDia = signal<string>('$1,840.000');

  // Signal: Lista de Estilistas del Día (Stylists Today)
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

  // Signal computado para conteo rápido de estilistas disponibles
  readonly estilistasDisponiblesCount = computed(
    () => this.estilistasHoy().filter(e => e.estado === 'Disponible').length
  );

  // Signal: Lista de Servicios Populares con barras de progreso
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

  // Helper para asignar las clases del badge según el estado de la estilista
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

