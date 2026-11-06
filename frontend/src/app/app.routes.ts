import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientasComponent } from './features/clientas/clientas.component';
import { ServiciosComponent } from './features/servicios/servicios.component';
import { EquipoComponent } from './features/equipo/equipo.component';

export const routes: Routes = [
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
