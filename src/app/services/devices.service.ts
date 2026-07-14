import { Injectable, inject } from '@angular/core';
import { BackendService } from './backend.service';
import { MoragooService } from './moragoo.service';

@Injectable({ providedIn: 'root' })
export class DevicesService {

  backendService = inject(BackendService);
  moragooService = inject(MoragooService);

  // ---------------------------------------------------------
  // DEVICES FOUND
  // ---------------------------------------------------------
  getFound() {
    const url = `${this.moragooService.MoragooServerUrl()}/api/devices/found`;
    return this.backendService.get(url);
  }

  // ---------------------------------------------------------
  // DEVICES SHARED
  // ---------------------------------------------------------
  getShared() {
    const url = `${this.moragooService.MoragooServerUrl()}/api/devices/shared`;
    return this.backendService.get(url);
  }

  // ---------------------------------------------------------
  // DEVICES ALL
  // ---------------------------------------------------------
  getAll() {
    const url = `${this.moragooService.MoragooServerUrl()}/api/devices/all`;
    return this.backendService.get(url);
  }

  // ---------------------------------------------------------
  // REALTIME STATE (Entradas / Salidas)
  // ---------------------------------------------------------
  getState(ip: string, driver: string) {
    const url = `${this.moragooService.MoragooServerUrl()}/api/devices/state?ip=${ip}&driver=${driver}`;
    return this.backendService.get(url);
  }

  // ---------------------------------------------------------
  // WRITE OUTPUT (PLC)
  // ---------------------------------------------------------
  writeOutput(ip: string, bit: number, value: boolean) {
    const url = `${this.moragooService.MoragooServerUrl()}/api/devices/write?ip=${ip}&bit=${bit}&value=${value}`;
    return this.backendService.post(url, {});
  }
}
