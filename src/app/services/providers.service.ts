import { Injectable, signal, effect, inject, NgModule } from '@angular/core';
import { MoragooService } from './moragoo.service';
import { ProviderInfo } from '../types/provider.type';
import { LangService } from './lang.service';
import { SessionService } from './session.service';

import { BackendService } from './backend.service';


@Injectable({ providedIn: 'root' })

export class ProvidersService {
  

  providers = signal<ProviderInfo[]>([]);
  moragooService = inject(MoragooService);
  langService = inject(LangService);
  sessionService = inject(SessionService);
  
  backend= inject(BackendService);
  

  constructor() {
    effect(() => {
      const host = this.moragooService.MoragooServerUrl();
      if (host) this.loadProviders(host);
    });
  }

  async loadProviders(host: string) {
    try {
      const res = await fetch(`${host}/api/auth/providers`);
      if (!res.ok) return this.forceLocalPINX();

      const raw = await res.json();
      this.providers.set(this.normalizeProviders(raw));

    } catch {
      this.forceLocalPINX();
    }
  }

  normalizeProviders(raw: any): ProviderInfo[] {
    if (!raw || typeof raw !== 'object') return [];

    const providers = Object.entries(raw).map(([id, p]: any) => ({
      id,
      label: p.name,
      type: p.type,
      activated: p.activated,
      mode: p.mode,
      group: p.group ?? p.mode ?? 'otros',   // 🔥 grupo
      order: p.order ?? 999,                 // 🔥 orden opcional
      fields: Array.isArray(p.credentials)
        ? p.credentials.map((c: any) => ({
            id: c.id,
            name: c.id,
            label: c.label,
            type: c.type,
            placeholder: c.label,
            required: c.required
          }))
        : [],
      domain: p.domain ?? null,
      capabilities: p.capabilities ?? {},
      metadata: p.metadata ?? {}
    }));

    // 🔥 LOCAL SIEMPRE PRIMERO
    providers.sort((a, b) => {
      if (a.id === 'local') return -1;
      if (b.id === 'local') return 1;
      return a.order - b.order;
    });

    return providers;
  }


  async authenticate(providerId: string, credentials: Record<string, string>) {
    const provider = this.providers().find(p => p.id === providerId);
    if (!provider) throw new Error(this.langService.t('providers.error'));

    const user = credentials['login_id'] ?? credentials['alias'] ?? '';
    const pass = credentials['secret_code'] ?? credentials['pinx_code'] ?? '';

    const fingerprint = this.moragooService.fingerprint();

    const payload = {
      domain: provider.domain?.value ?? "local",
      user,
      pass,
      module: this.sessionService.session()?.module ?? 'core',
      provider: providerId ?? 'local',
      fingerprint
    };

    const url = `${this.moragooService.MoragooServerUrl()}/api/auth/login`;
    
  
    
/*
     // 🔥 Actualizar sesión 
    this.sessionService.updateSession({
      mode: 'authenticated',
      sessionName: 'moradoo-session',
      fingerprint: this.moragooService.fingerprint,
      device: '',
      platform: 'web',
      version: 'web',
      server: this.moragooService.MoragooServerUrl(),
      network: navigator.onLine ? 'online' : 'offline',
      user: res.user,
      roles: res.roles,
      token: res.token,
      module: 'industrial',
    });
    this.sessionService.savePersistent();
    */
    
    return await this.backend.post(url, payload);;
    
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
        domain: "local",
        capabilities: { fingerprint: true },
        metadata: { color: "#888888", icon: "shield", group: "core" }
      }
    ]);
  }

   // 🔥 LOGOUT industrial
  logout() {
    const url = `${this.moragooService.MoragooServerUrl()}/api/auth/logout`;
    //this.sessionService.clearPersistent();
    return this.backend.post(url, {}); // POST es más correcto para logout
  }

}
