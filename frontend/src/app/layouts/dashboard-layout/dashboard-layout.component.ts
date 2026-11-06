import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  LayoutGrid,
  CalendarHeart,
  Users,
  Sparkles,
  UserCheck,
  Bell,
  Menu,
  X,
  Plus,
  LogOut
} from 'lucide-angular';
import { UiStateService } from '../../core/services/ui-state.service';

export interface NavItem {
  label: string;
  route: string;
  icon: any;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent {
  readonly uiState = inject(UiStateService);

  // Registro de íconos Lucide para el template
  readonly icons = {
    LayoutGrid,
    CalendarHeart,
    Users,
    Sparkles,
    UserCheck,
    Bell,
    Menu,
    X,
    Plus,
    LogOut
  };

  // Grosor de línea fino estilo Cupertino
  readonly iconStrokeWidth = 1.5;

  // Menú de navegación principal
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutGrid },
    { label: 'Citas', route: '/citas', icon: CalendarHeart },
    { label: 'Clientas', route: '/clientas', icon: Users },
    { label: 'Servicios', route: '/servicios', icon: Sparkles },
    { label: 'Equipo', route: '/equipo', icon: UserCheck },
  ];

  // Fecha actual formateada en español
  readonly formattedDate = computed(() => {
    const formatter = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const rawDate = formatter.format(new Date());
    return rawDate.charAt(0).toUpperCase() + rawDate.slice(1);
  });

  onSelectNav(item: NavItem): void {
    this.uiState.setPageTitle(item.label);
    this.uiState.closeMobileSidebar();
  }
}

