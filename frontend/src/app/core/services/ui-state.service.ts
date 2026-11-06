import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  // Estado privado mutable con Signals
  private readonly _pageTitle = signal<string>('Dashboard');
  private readonly _isSidebarOpen = signal<boolean>(false); // Para drawer móvil
  private readonly _isSidebarCollapsed = signal<boolean>(false); // Para modo compacto desktop
  private readonly _unreadNotifications = signal<number>(3);

  // Lecturas públicas (Readonly Signals)
  readonly pageTitle = this._pageTitle.asReadonly();
  readonly isSidebarOpen = this._isSidebarOpen.asReadonly();
  readonly isSidebarCollapsed = this._isSidebarCollapsed.asReadonly();
  readonly unreadNotifications = this._unreadNotifications.asReadonly();

  // Signal computado para el punto ámbar de alerta
  readonly hasNotifications = computed(() => this._unreadNotifications() > 0);

  setPageTitle(title: string): void {
    this._pageTitle.set(title);
  }

  toggleMobileSidebar(): void {
    this._isSidebarOpen.update(open => !open);
  }

  closeMobileSidebar(): void {
    this._isSidebarOpen.set(false);
  }

  toggleDesktopCollapse(): void {
    this._isSidebarCollapsed.update(collapsed => !collapsed);
  }

  clearNotifications(): void {
    this._unreadNotifications.set(0);
  }
}

