import { Injectable, signal, effect, inject, NgModule } from '@angular/core';
import { MoragooService } from './moragoo.service';
import { ProviderInfo } from '../types/provider.type';
import { LangService } from './lang.service';
import { SessionService } from './session.service';

import { BackendService } from './backend.service';
import { AuthResponse } from '../types/auth-response.type';
import { LoginRequest } from '../types/login-request.type';
import { LoginPayload } from '../types/fingerprint.type';


@Injectable({ providedIn: 'root' })

export class ProvidersService {
  

  providers = signal<ProviderInfo[]>([]);
  moragooService = inject(MoragooService);
  langService = inject(LangService);
  sessionService = inject(SessionService);
  
  backendService= inject(BackendService);
  

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

  const dblg  = credentials['database']   ?? credentials['db']        ?? credentials['domain_db']  ?? '';
  const urllg = credentials['odoourl']    ?? credentials['url']       ?? credentials['domain_url'] ?? '';

  const fingerprintd = this.moragooService.fingerprint; // signal

  const payload: LoginPayload = {
    user,
    pass,
    module: ['core'],
    provider: providerId,
    domain: provider.domain?.value ?? 'local',
    db: dblg,
    url: urllg,
    fingerprint: fingerprintd() 
  };

  const url = `/api/auth/login`;
  const res = await this.backendService.post<AuthResponse>(url, payload);
  console.log('RESP AUTH :', res);

  // ✅ Validar respuesta SIN status (tu backend no lo manda)
  if (!res || !res.token) {
      //Actualizamos el token del backend por seguridad
  this.backendService.setToken("")
    throw new Error('auth_failed');
  }

  // ✅ Actualizar sesión industrial
  this.sessionService.updateSession({
    sessionName: this.sessionService.session().sessionName,
    mode: 'authenticated',
    user: res.user,
    token: res.token,
    provider: providerId,
    modules: res.modules,
    rolesByModule: res.roles,
    email: res.email,
    avatar: res.avatar,
    permissions: res.permissions,
    fingerprint: fingerprintd()?.fingerprint
  });
  //Actualizamos el token del backend
  this.backendService.setToken(res.token)
  // ✅ Log centralizado
  this.moragooService.addLog(this.langService.t('log.login_ok'));

  return res;
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
    const url = `/api/auth/logout`;
    //this.sessionService.clearPersistent();
    return this.backendService.post(url, {}); // POST es más correcto para logout
  }

}
