import { inject, Injectable, signal } from '@angular/core';
import { SessionData } from '../types/session.type';
import { MoragooService } from './moragoo.service';
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  moragooService = inject(MoragooService);
  lang = inject(LangService);

  session = signal<SessionData>({
    mode: 'guest',
    sessionName: 'guest-session',
    fingerprint: {},
    device: 'web-browser',
    platform: 'web',
    version: 'web',
    server: '',
    network: navigator.onLine ? 'online' : 'offline',
    user: '',
    roles: [],
    token: ''
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
      server: s.server,
      user: s.user,
      roles: s.roles,
      provider: s.provider,
      module: s.module
    };

    localStorage.setItem('moragoo-session', JSON.stringify(safe));

    // Log traducido
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

        // 🔥 Sincronizar MoragooService
        this.moragooService.MoragooServerIp.set(host);
        this.moragooService.MoragooServerPort.set(port);

        // 🔥 Actualizar sesión
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

  // ---------------------------------------------------------
  // SETTERS
  // ---------------------------------------------------------

  setSession(data: SessionData) {
    this.session.set(data);
    this.savePersistent();
  }

  clear() {
    this.clearPersistent();
/*
    const guest: SessionData = {
      mode: 'guest',
      sessionName: 'guest-session',
      fingerprint: {},
      device: 'web-browser',
      module: 'core',
      platform: 'web',
      version: 'web',
      server: '',
      network: navigator.onLine ? 'online' : 'offline',
      user: '',
      roles: [],
      token: ''
    };

    this.session.set(guest);
*/
    this.moragooService.addLog(this.lang.t('log.session_reset'));
  }

  // ---------------------------------------------------------
  // INICIO DE SESIÓN
  // ---------------------------------------------------------

  async startSession() {
    const fingerprint = this.moragooService.fingerprint() ?? {};

    const updated: SessionData = {
      ...this.session(),
      mode: 'guest',
      module: 'core',
      fingerprint,
      server: this.moragooService.MoragooServerUrl()
    };

    this.session.set(updated);
    this.savePersistent();

    this.moragooService.addLog(this.lang.t('log.session_started'));
  }

  // ---------------------------------------------------------
  // ACTUALIZACIÓN TRAS LOGIN
  // ---------------------------------------------------------

  updateSession(authData: any) {
    const current = this.session();

    const updated: SessionData = {
      ...current,
      mode: 'authenticated',
      user: authData.user,
      roles: authData.roles,
      token: authData.token,
      provider: authData.provider,
      module: authData.module,
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
