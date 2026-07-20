import { inject, Injectable, signal } from '@angular/core';
import { SessionData } from '../types/session.type';
import { MoragooService } from './moragoo.service';
import { LangService } from './lang.service';
import { BackendService } from './backend.service';

@Injectable({ providedIn: 'root' })
export class SessionService {

  moragooService = inject(MoragooService);
  lang = inject(LangService);
  backendService = inject(BackendService);

  session = signal<SessionData>({
    mode: 'guest',
    sessionName: 'guest-session',
    fingerprint: this.moragooService.fingerprint()?.fingerprint,
    device: 'web-browser',
    platform: 'web',
    version: 'web',
    server: '',
    network: navigator.onLine ? 'online' : 'offline',
    user: '',
    token: '',
    modules: [],
    rolesByModule: {},
    provider: undefined,
    email: undefined,
    avatar: undefined,
    permissions: []
  });

  constructor() {
    this.loadPersistent();
  }

  // ---------------------------------------------------------
  // PERSISTENCIA SEGURA
  // ---------------------------------------------------------

  savePersistent() {
    const s = this.session();
    const safe = {
      mode: s.mode,
      fingerprint: this.moragooService.fingerprint()?.fingerprint ?? 'N/A',
      server: s.server,
      user: s.user,
      token: s.token,
      modules: s.modules,
      rolesByModule: s.rolesByModule,
      provider: s.provider
    };

    localStorage.setItem('moragoo-session', JSON.stringify(safe));

    this.moragooService.addLog(this.lang.t('log.session_saved'));
  }

  loadPersistent() {
    const raw = localStorage.getItem('moragoo-session');
    if (!raw) {
      this.moragooService.addLog(this.lang.t('log.session_not_found'));
      return;
    }

    try {
      const saved = JSON.parse(raw);

      if (saved.server) {
        const url = new URL(saved.server);
        const host = url.hostname;
        const port = Number(url.port) || 8081;

        // Sincronizar MoragooService
        this.moragooService.MoragooServerIp.set(host);
        this.moragooService.MoragooServerPort.set(port);

        // Actualizar sesión
        const updated: SessionData = {
          ...this.session(),
          ...saved,
          server: `${url.protocol}//${host}:${port}`
        };

        this.session.set(updated);

        this.moragooService.addLog(
          this.lang.t('log.session_loaded') + ` (${host}:${port})`
        );
      } else {
        this.moragooService.addLog(this.lang.t('log.session_invalid'));
      }
    } catch (err) {
      console.error('Error cargando sesión persistida:', err);
      this.moragooService.addLog(this.lang.t('log.session_load_error'));
    }
  }

  clearPersistent() {
    localStorage.removeItem('moragoo-session');
    this.moragooService.addLog(this.lang.t('log.session_cleared'));
  }

  resetSession() {
    const current = this.session();

    const reset: SessionData = {
      ...current,
      mode: 'guest',
      user: '',
      token: '',
      modules: [],
      rolesByModule: {},
      provider: undefined,
      email: undefined,
      avatar: undefined,
      permissions: [],
    };

    this.session.set(reset);
    this.clearPersistent();
    this.startSession();
  }

  // ---------------------------------------------------------
  // SETTERS
  // ---------------------------------------------------------

  setSession(data: SessionData) {
    this.session.set(data);
    this.savePersistent();
  }

  logout() {
    const url = `/api/auth/logout`;
    return this.backendService.post(url, {});
  }

  // ---------------------------------------------------------
  // INICIO DE SESIÓN
  // ---------------------------------------------------------

  async startSession() {
    const fingerprint = await this.moragooService.fingerprint;
    const updated: SessionData = {
      ...this.session(),
      mode: this.session().mode || 'guest',
      fingerprint: fingerprint()?.fingerprint ?? 'N/A',
      server: this.moragooService.MoragooServerUrl()
    };

    this.session.set(updated);
    this.savePersistent();
    this.moragooService.addLog(this.lang.t('log.session_started'));
  }

  // ---------------------------------------------------------
  // ACTUALIZACIÓN TRAS LOGIN
  // ---------------------------------------------------------

  updateSession(authData: SessionData) {
    const current = this.session();

    const updated: SessionData = {
      ...current,
      mode: 'authenticated',
      sessionName: current.sessionName,
      user: authData.user,
      token: authData.token,
      provider: authData.provider,
      modules: authData.modules ?? current.modules,
      rolesByModule: authData.rolesByModule ?? current.rolesByModule,
      email: authData.email,
      avatar: authData.avatar,
      permissions: authData.permissions
    };

    this.session.set(updated);
    this.savePersistent();

    this.moragooService.addLog(
      this.lang.t('log.login_ok') + ` (${authData.user})`
    );
  }

  updateServer(host: string, port: number) {
    const current = this.session();
    const serverUrl = `http://${host}:${port}`;

    const updated: SessionData = {
      ...current,
      server: serverUrl
    };

    this.session.set(updated);
    this.savePersistent();

    this.moragooService.addLog(
      this.lang.t('log.session_server_changed') + ` (${host}:${port})`
    );
  }
}
