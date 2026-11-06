import { Component, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  LucideAngularModule,
  Sparkles,
  Clock,
  Tag
} from 'lucide-angular';

export type CategoriaServicio = 'Uñas' | 'Cejas y Rostro' | 'Pestañas';
export type TipoAplicacion = 'Inicial' | 'Retoque' | 'Único';

export interface ServicioCatalogo {
  idServicio: number;
  categoria: CategoriaServicio;
  nombreServicio: string;
  tipoAplicacion: TipoAplicacion;
  precioBase: number;
  duracionMinutos: number;
  activo: boolean;
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, LucideAngularModule],
  template: `
    <section class="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8">

      <!-- Cabecera y Filtros de Categoría (Uñas, Cejas y Rostro, Pestañas) -->
      <div class="md:col-span-12 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold uppercase tracking-widest text-purple-400">
            Catálogo Oficial (Spring Boot Enum)
          </span>
          <h2 class="text-xl font-semibold text-slate-800 mt-0.5">
            Servicios y Tarifas Base
          </h2>
        </div>

        <div class="flex flex-wrap items-center gap-2 bg-white/60 p-1.5 rounded-2xl shadow-soft">
          @for (cat of ['TODOS', 'Pestañas', 'Uñas', 'Cejas y Rostro']; track cat) {
            <button
              type="button"
              (click)="categoriaActiva.set($any(cat))"
              [class.bg-teal-500]="categoriaActiva() === cat"
              [class.text-white]="categoriaActiva() === cat"
              [class.text-slate-600]="categoriaActiva() !== cat"
              class="px-4 py-1.5 rounded-xl text-xs font-medium transition-all">
              {{ cat === 'TODOS' ? 'Todos' : cat }}
            </button>
          }
        </div>
      </div>

      <!-- Tarjetas Bento de Servicios -->
      @for (srv of serviciosFiltrados(); track srv.idServicio) {
        <article class="md:col-span-6 lg:col-span-4 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex flex-col justify-between gap-5">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-3 py-1 rounded-full text-xs font-medium bg-purple-100/80 text-purple-700">
                {{ srv.categoria }}
              </span>

              <span
                [class.bg-teal-100]="srv.tipoAplicacion === 'Inicial'"
                [class.text-teal-700]="srv.tipoAplicacion === 'Inicial'"
                [class.bg-amber-100]="srv.tipoAplicacion === 'Retoque'"
                [class.text-amber-700]="srv.tipoAplicacion === 'Retoque'"
                [class.bg-slate-100]="srv.tipoAplicacion === 'Único'"
                [class.text-slate-700]="srv.tipoAplicacion === 'Único'"
                class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                {{ srv.tipoAplicacion }}
              </span>
            </div>

            <h3 class="text-lg font-semibold text-slate-800">
              {{ srv.nombreServicio }}
            </h3>
          </div>

          <div class="pt-4 border-t border-purple-100/50 flex items-end justify-between">
            <div>
              <span class="block text-[11px] uppercase tracking-wider text-purple-400">Precio Base</span>
              <span class="text-2xl font-bold text-slate-800">
                {{ srv.precioBase | currency:'COP':'symbol-narrow':'1.0-0' }}
              </span>
            </div>

            <div class="flex items-center gap-1.5 text-xs font-medium text-purple-500 bg-purple-50/80 px-3 py-1.5 rounded-xl">
              <lucide-icon [img]="icons.Clock" [strokeWidth]="iconStrokeWidth" class="w-4 h-4"></lucide-icon>
              <span>{{ srv.duracionMinutos }} min</span>
            </div>
          </div>
        </article>
      }

    </section>
  `
})
export class ServiciosComponent {
  readonly icons = { Sparkles, Clock, Tag };
  readonly iconStrokeWidth = 1.5;

  readonly categoriaActiva = signal<'TODOS' | CategoriaServicio>('TODOS');

  readonly servicios = signal<ServicioCatalogo[]>([
    {
      idServicio: 1,
      categoria: 'Pestañas',
      nombreServicio: 'Pestañas Volumen Ruso',
      tipoAplicacion: 'Inicial',
      precioBase: 160000,
      duracionMinutos: 120,
      activo: true
    },
    {
      idServicio: 2,
      categoria: 'Pestañas',
      nombreServicio: 'Pestañas Volumen Ruso',
      tipoAplicacion: 'Retoque',
      precioBase: 95000,
      duracionMinutos: 75,
      activo: true
    },
    {
      idServicio: 3,
      categoria: 'Uñas',
      nombreServicio: 'Uñas Semipermanentes & Nivelación',
      tipoAplicacion: 'Único',
      precioBase: 75000,
      duracionMinutos: 75,
      activo: true
    },
    {
      idServicio: 4,
      categoria: 'Cejas y Rostro',
      nombreServicio: 'Micropigmentación Shadow Brows',
      tipoAplicacion: 'Inicial',
      precioBase: 280000,
      duracionMinutos: 150,
      activo: true
    },
    {
      idServicio: 5,
      categoria: 'Cejas y Rostro',
      nombreServicio: 'Laminado de Cejas + Diseño HD',
      tipoAplicacion: 'Único',
      precioBase: 65000,
      duracionMinutos: 45,
      activo: true
    },
    {
      idServicio: 6,
      categoria: 'Uñas',
      nombreServicio: 'Sistema Acrílico Esculpido',
      tipoAplicacion: 'Inicial',
      precioBase: 135000,
      duracionMinutos: 120,
      activo: true
    }
  ]);

  readonly serviciosFiltrados = computed(() => {
    const cat = this.categoriaActiva();
    if (cat === 'TODOS') return this.servicios();
    return this.servicios().filter(s => s.categoria === cat);
  });
}

