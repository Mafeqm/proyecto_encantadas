import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Users,
  Search,
  Phone,
  Plus,
  CalendarHeart,
  Sparkles,
  X
} from 'lucide-angular';

export interface ClientaDTO {
  idClienta: number;
  nombre: string;
  numeroWhatsapp: string;
  fechaRegistro: string;
  visitasTotales: number;
  servicioFavorito: string;
}

@Component({
  selector: 'app-clientas',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, LucideAngularModule],
  template: `
    <section class="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8">

      <!-- Barra superior Bento: Buscador + Botón Nueva Clienta -->
      <div class="md:col-span-8 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold uppercase tracking-widest text-purple-400">
            Directorio del Estudio
          </span>
          <h2 class="text-xl font-semibold text-slate-800 mt-0.5">
            Clientas Registradas ({{ clientasFiltradas().length }})
          </h2>
        </div>

        <div class="relative w-full sm:w-72">
          <lucide-icon
            [img]="icons.Search"
            [strokeWidth]="iconStrokeWidth"
            class="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2">
          </lucide-icon>
          <input
            type="text"
            [ngModel]="busqueda()"
            (ngModelChange)="busqueda.set($event)"
            placeholder="Buscar por nombre o WhatsApp..."
            class="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 text-sm text-slate-700 placeholder:text-slate-400 shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      </div>

      <!-- KPI Destacado + Acción -->
      <div class="md:col-span-4 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold uppercase tracking-widest text-purple-400">
            Fidelización
          </span>
          <p class="text-2xl font-semibold text-slate-800 mt-1">
            {{ clientas().length }} Clientas
          </p>
          <span class="text-xs text-purple-400">Contacto directo vía WhatsApp</span>
        </div>

        <button
          type="button"
          (click)="modalAbierto.set(true)"
          class="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold shadow-teal-glow transition-all">
          <lucide-icon [img]="icons.Plus" [strokeWidth]="iconStrokeWidth" class="w-4 h-4"></lucide-icon>
          <span>Registrar</span>
        </button>
      </div>

      <!-- Grid de Tarjetas de Clientas -->
      @for (clienta of clientasFiltradas(); track clienta.idClienta) {
        <article class="md:col-span-6 lg:col-span-4 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex flex-col justify-between gap-4 hover:bg-white/75 transition-all">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-100 to-teal-50 text-purple-600 font-semibold text-sm flex items-center justify-center shadow-inner">
                {{ clienta.nombre.slice(0, 2).toUpperCase() }}
              </div>
              <div>
                <h3 class="text-base font-semibold text-slate-800">{{ clienta.nombre }}</h3>
                <p class="text-xs text-purple-400 flex items-center gap-1 mt-0.5">
                  <lucide-icon [img]="icons.Phone" [strokeWidth]="iconStrokeWidth" class="w-3.5 h-3.5"></lucide-icon>
                  {{ clienta.numeroWhatsapp }}
                </p>
              </div>
            </div>

            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100/80 text-teal-700">
              {{ clienta.visitasTotales }} citas
            </span>
          </div>

          <div class="p-3.5 rounded-2xl bg-white/60 flex items-center justify-between text-xs">
            <span class="text-purple-400">Servicio preferido:</span>
            <strong class="text-slate-700 font-medium">{{ clienta.servicioFavorito }}</strong>
          </div>

          <div class="pt-2 border-t border-purple-100/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>ID #{{ clienta.idClienta }}</span>
            <span>Miembro desde {{ clienta.fechaRegistro | date:'MMM yyyy' }}</span>
          </div>
        </article>
      }

    </section>

    <!-- Modal Registrar Clienta -->
    @if (modalAbierto()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
        <div class="w-full max-w-md bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white">
          <div class="flex items-center justify-between mb-6">
            <div>
              <span class="text-xs font-semibold uppercase tracking-widest text-purple-400">Nueva Clienta</span>
              <h3 class="text-lg font-semibold text-slate-800 mt-0.5">Registro Rápido</h3>
            </div>
            <button type="button" (click)="modalAbierto.set(false)" class="p-2 rounded-2xl text-purple-400 hover:bg-purple-50">
              <lucide-icon [img]="icons.X" [strokeWidth]="iconStrokeWidth" class="w-5 h-5"></lucide-icon>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1.5">Nombre Completo</label>
              <input
                type="text"
                [(ngModel)]="nuevoNombre"
                placeholder="Ej. Natalia Echeverri"
                class="w-full px-4 py-2.5 rounded-2xl bg-white shadow-soft text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1.5">Número de WhatsApp (Único)</label>
              <input
                type="text"
                [(ngModel)]="nuevoWhatsapp"
                placeholder="+57 300 000 0000"
                class="w-full px-4 py-2.5 rounded-2xl bg-white shadow-soft text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button type="button" (click)="modalAbierto.set(false)" class="px-4 py-2 rounded-2xl text-xs font-semibold text-slate-500">
              Cancelar
            </button>
            <button type="button" (click)="agregarClienta()" class="px-5 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold shadow-teal-glow">
              Guardar Clienta
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ClientasComponent {
  readonly icons = { Users, Search, Phone, Plus, CalendarHeart, Sparkles, X };
  readonly iconStrokeWidth = 1.5;

  readonly busqueda = signal<string>('');
  readonly modalAbierto = signal<boolean>(false);

  nuevoNombre = '';
  nuevoWhatsapp = '+57 310 ';

  readonly clientas = signal<ClientaDTO[]>([
    {
      idClienta: 1,
      nombre: 'Valentina Gómez',
      numeroWhatsapp: '+57 300 412 8890',
      fechaRegistro: '2026-02-14T10:00:00-05:00',
      visitasTotales: 14,
      servicioFavorito: 'Pestañas Volumen Ruso'
    },
    {
      idClienta: 2,
      nombre: 'Mariana Restrepo',
      numeroWhatsapp: '+57 311 590 2341',
      fechaRegistro: '2026-04-02T15:30:00-05:00',
      visitasTotales: 9,
      servicioFavorito: 'Micropigmentación'
    },
    {
      idClienta: 3,
      nombre: 'Isabela Torres',
      numeroWhatsapp: '+57 315 821 3319',
      fechaRegistro: '2026-06-19T11:20:00-05:00',
      visitasTotales: 6,
      servicioFavorito: 'Uñas Semipermanentes'
    },
    {
      idClienta: 4,
      nombre: 'Gabriela Duarte',
      numeroWhatsapp: '+57 320 994 1020',
      fechaRegistro: '2026-08-08T09:15:00-05:00',
      visitasTotales: 4,
      servicioFavorito: 'Lifting de Pestañas'
    }
  ]);

  readonly clientasFiltradas = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    if (!q) return this.clientas();
    return this.clientas().filter(
      c => c.nombre.toLowerCase().includes(q) || c.numeroWhatsapp.toLowerCase().includes(q)
    );
  });

  agregarClienta(): void {
    if (!this.nuevoNombre.trim()) return;
    const nueva: ClientaDTO = {
      idClienta: this.clientas().length + 1,
      nombre: this.nuevoNombre.trim(),
      numeroWhatsapp: this.nuevoWhatsapp.trim(),
      fechaRegistro: new Date().toISOString(),
      visitasTotales: 1,
      servicioFavorito: 'Pestañas Volumen Ruso'
    };
    this.clientas.update(list => [nueva, ...list]);
    this.nuevoNombre = '';
    this.modalAbierto.set(false);
  }
}

