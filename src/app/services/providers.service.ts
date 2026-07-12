import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { MoragooService } from './moragoo.service';
import {ProviderInfo} from '../types/provider.type';

@Injectable({ providedIn: 'root' })
export class ProvidersService {

  providers = signal<ProviderInfo[]>([]);
  moragooService = inject(MoragooService);

  constructor() {
    effect(() => {
      const host = `${this.moragooService.MoragooServerUrl()}:${this.moragooService.MoragooServerPort()}`;
      if (host) this.loadProviders(host);
    });
  }

  async loadProviders(host: string) {
    try {
      const res = await fetch(`${host}/api/auth/providers`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = await res.json();

      const normalized = this.normalizeProviders(raw);
      this.providers.set(normalized);

    } catch (err) {
      console.error('Error cargando proveedores:', err);
      this.providers.set([]);
    }
  }

  normalizeProviders(raw: any[]): ProviderInfo[] {
    if (!Array.isArray(raw)) return [];

    return raw.map((p: any) => ({
      id: p.id,
      label: p.name,
      type: p.type,
      activated: true,
      mode: 'basic',          // porque tu backend no devuelve mode
      fields: [],             // tu backend no devuelve credentials
      domain: null,
      capabilities: {},
      metadata: {}
    }));
  }

  async connect(providerId: string, credentials: any) {
    const host = `${this.moragooService.MoragooServerUrl()}:${this.moragooService.MoragooServerPort()}`;

    try {
      const res = await fetch(`${host}/api/auth/connect/${providerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!res.ok) {
        return { ok: false, error: `Error ${res.status}: ${res.statusText}` };
      }

      const data = await res.json();
      return { ok: true, data };

    } catch (err) {
      console.error('Error conectando:', err);
      return { ok: false, error: 'No se pudo conectar al servidor' };
    }
  }

  forceLocalPINX() {
  this.providers.set([
    {
      id: "local",
      label: "Acceso Local PINX",
      type: "local",
      activated: true,
      mode: "local",
      fields: [
        { id: "alias", name: "alias", label: "Alias", type: "text", required: true },
        { id: "pinx_code", name: "pinx_code", label: "PINX", type: "password", required: true }
      ],
      domain: null,
      capabilities: {
        fingerprint: true,
        mfa: false,
        totp: false,
        webauthn: false,
        passkeys: false,
        firebase: false,
        oauth2: false,
        refresh_token: false
      },
      metadata: {
        color: "#888888",
        icon: "shield",
        group: "core"
      }
    }
  ]);
}

}

