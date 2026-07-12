import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'industrial';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  // Signal con el tema actual
  currentTheme = signal<Theme>('industrial');

  constructor() {
    // Cargar tema guardado si existe
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) {
      this.currentTheme.set(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);

    // Aplicar al HTML (Ionic usa <html>)
    document.documentElement.setAttribute('data-theme', theme);

    // Persistencia
    localStorage.setItem('theme', theme);

    // Actualizar meta theme-color
    const meta = document.querySelector("meta[name='theme-color']");
    if (meta) {
      if (theme === 'light') meta.setAttribute('content', '#f8f8f8');
      if (theme === 'industrial') meta.setAttribute('content', '#1e1e1e');
      if (theme === 'dark') meta.setAttribute('content', '#000000');
    }
  }

  // Para inicializar desde el componente root si quieres
  init() {
    this.setTheme(this.currentTheme());
  }
}
