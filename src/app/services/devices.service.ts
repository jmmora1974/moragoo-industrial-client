import { Injectable, inject, signal } from '@angular/core';
import { BackendService } from './backend.service';
import { LangService } from './lang.service';
import { SessionService } from './session.service';

export interface DeviceResponse {
  ok: boolean;
  msg?: string;
  error?: string | null;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class DevicesService {

  backend = inject(BackendService);
  lang = inject(LangService);
  session = inject(SessionService);

  currentDevice = signal<any | null>(null);

  // ---------------------------------------------------------
  // MÓDULO ACTUAL
  // ---------------------------------------------------------

  currentModule = signal<string>('core'); // por defecto

  setCurrentModule(mod: string) {
    console.log("Módulo activo:", mod);
    this.currentModule.set(mod);
  }

  private moduleHeader() {
    return { 'X-Module': this.currentModule() };
  }

  // ---------------------------------------------------------
  // CURRENT DEVICE
  // ---------------------------------------------------------

  setCurrentDevice(dev: any) {
    this.currentDevice.set(dev);
  }

  getCurrentDevice() {
    return this.currentDevice();
  }

  // ---------------------------------------------------------
  // DEVICES FOUND
  // ---------------------------------------------------------

  getFound() {
    return this.backend.get('/api/devices/found', {
      headers: this.moduleHeader()
    });
  }

  // ---------------------------------------------------------
  // DEVICES SHARED
  // ---------------------------------------------------------

  getShared() {
    return this.backend.get('/api/devices/shared', {
      headers: this.moduleHeader()
    });
  }

  // ---------------------------------------------------------
  // DEVICES CONFIGURED
  // ---------------------------------------------------------

  getConfigured() {
    return this.backend.get('/api/devices/configured', {
      headers: this.moduleHeader()
    });
  }

  // ---------------------------------------------------------
  // DEVICES ALL
  // ---------------------------------------------------------

  getAll() {
    return this.backend.get('/api/devices/all', {
      headers: this.moduleHeader()
    });
  }

  // ---------------------------------------------------------
  // REALTIME STATE
  // ---------------------------------------------------------

  getState(ip: string, driver: string) {
    return this.backend.get(`/api/devices/state?ip=${ip}&driver=${driver}`, {
      headers: this.moduleHeader()
    });
  }

  // ---------------------------------------------------------
  // WRITE OUTPUT
  // ---------------------------------------------------------

  writeOutput(ip: string, bit: number, value: boolean) {
    return this.backend.post(`/api/devices/write?ip=${ip}&bit=${bit}&value=${value}`, {}, {
      headers: this.moduleHeader()
    });
  }

  // ---------------------------------------------------------
  // ADD CONFIGURED
  // ---------------------------------------------------------

  async addConfigured(dev: any): Promise<DeviceResponse> {

    const payload = {
      device: dev,
      owner: this.session.session().user
    };

    try {
      const data = await this.backend.post('/api/devices/configured/add', payload, {
        headers: this.moduleHeader()
      });

      return {
        ok: true,
        msg: this.lang.t('device.add_ok'),
        data
      };

    } catch (err: any) {

      let msg = this.lang.t('device.add_failed');

      if (err.message === 'already_configured') {
        msg = this.lang.t('device.already_configured');
      }

      if (err.message === 'missing_owner') {
        msg = "Falta el propietario (owner)";
      }

      return { ok: false, msg, error: err.message };
    }
  }

  // ---------------------------------------------------------
  // DELETE CONFIGURED
  // ---------------------------------------------------------

  deleteConfigured(id: string) {
    return this.backend.post('/api/devices/configured/delete', { id }, {
      headers: this.moduleHeader()
    });
  }

  // ---------------------------------------------------------
  // SHARE DEVICE
  // ---------------------------------------------------------

  shareDevice(id: string) {
    const payload = {
      id,
      owner: this.session.session().user
    };

    return this.backend.post('/api/devices/shared/add', payload, {
      headers: this.moduleHeader()
    });
  }

  // ---------------------------------------------------------
  // DELETE SHARED
  // ---------------------------------------------------------

  deleteShared(id: string) {
    return this.backend.post('/api/devices/shared/delete', { id }, {
      headers: this.moduleHeader()
    });
  }

  // ---------------------------------------------------------
  // MANAGE DEVICE
  // ---------------------------------------------------------

  manageDevice(id: string) {
    return this.backend.post('/api/devices/manage', { id }, {
      headers: this.moduleHeader()
    });
  }

  // ---------------------------------------------------------
  // SCAN SAFE / PRO
  // ---------------------------------------------------------

  scanSafe() {
    return this.backend.get('/api/scan/safe', {
      headers: this.moduleHeader()
    });
  }

  scanAdvanced() {
    return this.backend.get('/api/scan/pro', {
      headers: this.moduleHeader()
    });
  }
}
