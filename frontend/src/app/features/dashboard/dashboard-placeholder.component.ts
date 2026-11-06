import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 bg-white/65 backdrop-blur-lg rounded-4xl shadow-soft border border-white/80 p-8">
        <span class="text-xs font-semibold uppercase tracking-widest text-purple-400">Resumen del Día</span>
        <h2 class="text-2xl font-semibold text-slate-800 mt-1">Bento Box — Próximas Citas</h2>
        <p class="text-sm text-slate-500 mt-2">
          Área lista para inyectar los widgets del salón Encantadas conectados a tu API en Spring Boot.
        </p>
      </div>
      <div class="bg-white/65 backdrop-blur-lg rounded-4xl shadow-soft border border-white/80 p-8 flex flex-col justify-between">
        <div>
          <span class="text-xs font-semibold uppercase tracking-widest text-purple-400">Destacado</span>
          <h3 class="text-xl font-semibold text-slate-800 mt-1">Estado del Salón</h3>
        </div>
        <div class="mt-6 flex items-center gap-2 text-amber-500 text-sm font-medium">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span>3 alertas pendientes de revisión</span>
        </div>
      </div>
    </div>
  `
})
export class DashboardPlaceholderComponent {}

