import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientasComponent } from './features/clientas/clientas.component';
import { ServiciosComponent } from './features/servicios/servicios.component';
import { EquipoComponent } from './features/equipo/equipo.component';
import { ClientBookingComponent } from './features/booking/client-booking.component';

export const routes: Routes = [
  // Vista pública Mobile-First de reserva para clientas
  {
    path: 'reservar',
    component: ClientBookingComponent
  },
  // Panel de Administración (Layout con Sidebar y Topbar)
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'citas', component: DashboardComponent },
      { path: 'clientas', component: ClientasComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'equipo', component: EquipoComponent },
    ]
  }
];
