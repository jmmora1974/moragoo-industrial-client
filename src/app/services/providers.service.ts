import { Injectable, signal } from '@angular/core';

export interface ProviderInfo {
  id: string;
  label: string;
  fields: Array<{ name: string; type: string; placeholder: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class ProvidersService {

  // Host del backend (se puede mover a SessionService luego)
  host = signal('http://localhost:8081');

  // Lista de proveedores (dinámica)
  providers = signal<ProviderInfo[]>([]);

  constructor() {
    // Cargar proveedores al iniciar
    this.loadProviders();
  }

  // Obtener proveedores del backend
  async loadProviders() {
    try {
      const res = await fetch(`${this.host()}/providers`);
      const data = await res.json();
      this.providers.set(data);
    } catch (err) {
      console.error('Error cargando proveedores:', err);
      this.providers.set([]);
    }
  }

  // Validar credenciales y obtener token
  async connect(providerId: string, credentials: any) {
    try {
      const res = await fetch(`${this.host()}/connect/${providerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      return data; // token, module, provider, roles...
    } catch (err) {
      console.error('Error conectando:', err);
      return null;
    }
  }
}
