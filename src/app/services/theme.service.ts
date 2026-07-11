import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'industrial';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {

  current = signal<Theme>('industrial');
setTheme(theme: Theme) {
  this.current.set(theme);
  document.documentElement.setAttribute('data-theme', theme);


  const meta = document.querySelector("meta[name='theme-color']");
  if (meta) {
    if (theme === 'light') meta.setAttribute('content', '#f8f8f8');
    if (theme === 'industrial') meta.setAttribute('content', '#1e1e1e');
    if (theme === 'dark') meta.setAttribute('content', '#000000');
  }
}

 

  init() {
    this.setTheme(this.current());
  }
}
