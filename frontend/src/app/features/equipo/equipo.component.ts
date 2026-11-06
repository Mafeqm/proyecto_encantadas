import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  UserCheck,
  Phone,
  Sparkles,
  ShieldCheck
} from 'lucide-angular';

export interface MiembroEquipo {
  idEstilista: number;
  nombre: string;
  especialidad: string;
  telefono: string;
  avatarUrl: string;
  activo: boolean;
  porcentajeBase: number;
}

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8">

      <!-- Cabecera Bento -->
      <div class="md:col-span-12 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold uppercase tracking-widest text-purple-400">
            Talento Encantadas
          </span>
          <h2 class="text-xl font-semibold text-slate-800 mt-0.5">
            Equipo de Estilistas & Comisiones
          </h2>
        </div>

        <div class="px-4 py-2 rounded-2xl bg-amber-50/80 border border-amber-200/50 text-xs text-amber-800 font-medium flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Esquema: 45% servicio estándar • 50% en promoción</span>
        </div>
      </div>

      <!-- Tarjetas de Estilistas -->
      @for (est of equipo(); track est.idEstilista) {
        <article class="md:col-span-6 lg:col-span-4 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex flex-col justify-between gap-5">
          <div class="flex items-center gap-4">
            <img
              [src]="est.avatarUrl"
              [alt]="est.nombre"
              class="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm" />
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-semibold text-slate-800">{{ est.nombre }}</h3>
                <span
                  [class.bg-teal-100]="est.activo"
                  [class.text-teal-700]="est.activo"
                  [class.bg-slate-200]="!est.activo"
                  [class.text-slate-600]="!est.activo"
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                  {{ est.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
              <p class="text-xs text-purple-400 mt-0.5">{{ est.especialidad }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ est.telefono }}</p>
            </div>
          </div>

          <div class="pt-4 border-t border-purple-100/50 flex items-center justify-between">
            <span class="text-xs text-purple-400">Comisión Base: <strong class="text-slate-700">{{ est.porcentajeBase }}%</strong></span>
            <button
              type="button"
              (click)="toggleEstado(est.idEstilista)"
              class="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/80 hover:bg-white text-purple-500 shadow-soft transition-all">
              {{ est.activo ? 'Pausar Turnos' : 'Reactivar' }}
            </button>
          </div>
        </article>
      }

    </section>
  `
})
export class EquipoComponent {
  readonly icons = { UserCheck, Phone, Sparkles, ShieldCheck };
  readonly iconStrokeWidth = 1.5;

  readonly equipo = signal<MiembroEquipo[]>([
    {
      idEstilista: 1,
      nombre: 'Valentina Morales',
      especialidad: 'Especialista en Mirada & Pestañas',
      telefono: '+57 301 440 1290',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      activo: true,
      porcentajeBase: 45
    },
    {
      idEstilista: 2,
      nombre: 'Camila Restrepo',
      especialidad: 'Nail Artist Senior',
      telefono: '+57 312 889 4512',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      activo: true,
      porcentajeBase: 45
    },
    {
      idEstilista: 3,
      nombre: 'Sofía Mendoza',
      especialidad: 'Micropigmentación & Cejas',
      telefono: '+57 315 223 9981',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
      activo: true,
      porcentajeBase: 45
    }
  ]);

  toggleEstado(idEstilista: number): void {
    this.equipo.update(list =>
      list.map(e => (e.idEstilista === idEstilista ? { ...e, activo: !e.activo } : e))
    );
  }
}

