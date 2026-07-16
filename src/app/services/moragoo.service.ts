import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import { LangService } from './lang.service';
import { Capacitor } from '@capacitor/core';
import { FingerprintDios } from '../types/fingerprint.type';
import { BackendService } from './backend.service';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class MoragooService {
  

  status = signal<'ready' | 'loading' | 'error'>('ready');
  provider = signal<string | null>(null);
  module = signal<string>('dashboard');
  theme = signal<'industrial' | 'dark' | 'light'>('industrial');

  fingerprint = signal<FingerprintDios | null>(null);// 🔥 fingerprint DIOS
  deviceInfo = signal<any>(null);
  networkStatus = signal<'online' | 'offline'>('online');
  logs = signal<string[]>([]);

  MoragooServerIp = signal('localhost');
  MoragooServerPort = signal(8081);

  MoragooServerUrl = computed(() =>
    `http://${this.MoragooServerIp()}:${this.MoragooServerPort()}`
  );

  keepAliveTimer: any;
  MoragooServerAlive = signal(false);
  refreshRate = signal(5000);

  langService = inject(LangService);
  backendSercice= inject(BackendService);

  
  constructor() {   

    // 🔥 Cargar fingerprint DIOS   
    this.loadFingerprintFromServer();
    this.updateRate(this.refreshRate());
  }

  // ---------------------------------------------------------
  // FINGERPRINT DIOS
  // ---------------------------------------------------------

  async loadFingerprintFromServer() {
    const url = `${this.MoragooServerUrl()}/api/auth/fingerprint`;

    try {
      const res = await fetch(url);
      if (!res.ok) return;

      const fp = await res.json();
      this.fingerprint.set(fp);   // 🔥 OBJETO COMPLETO

      // 🔥 INTEGRACIÓN CRÍTICA
      this.backendSercice.setFinger(fp.fingerprint);

      this.addLog('Fingerprint DIOS cargado');

    } catch {
      this.addLog('Fingerprint DIOS no disponible');
    }
  }

  
  // ---------------------------------------------------------
  // KEEPALIVE
  // ---------------------------------------------------------

  async checkServer() {
    const url = `${this.MoragooServerUrl()}`;
    try {
      await fetch(url, { method: 'GET' });
      this.MoragooServerAlive.set(true);
    } catch {
      this.MoragooServerAlive.set(false);
    }
  }

  updateRate(rate: number) {
    this.refreshRate.set(rate);

    if (this.keepAliveTimer) clearInterval(this.keepAliveTimer);

    this.keepAliveTimer = setInterval(() => this.checkServer(), rate);
  }

  // ---------------------------------------------------------
  // DEVICE INFO
  // ---------------------------------------------------------

  async initDeviceInfo() {
    const info = await Device.getInfo();
    const id = await Device.getId();

    this.deviceInfo.set({
      model: info.model,
      platform: info.platform,
      osVersion: info.osVersion,
      uuid: id.identifier
    });
  }

  async initNetworkMonitor() {
    const st = await Network.getStatus();
    this.networkStatus.set(st.connected ? 'online' : 'offline');

    Network.addListener('networkStatusChange', (st) => {
      this.networkStatus.set(st.connected ? 'online' : 'offline');
    });
  }

  async getAppVersion() {
    if (Capacitor.getPlatform() === 'web') return 'web-dev';
    const info = await App.getInfo();
    return info.version;
  }

  // ---------------------------------------------------------
  // SETTERS
  // ---------------------------------------------------------

  setServer(hostWithPort: string) {
    const [hostPart, portPart] = hostWithPort.split(':');

    const host = hostPart?.trim() ?? '127.0.0.1';
    const port = portPart ? parseInt(portPart.trim(), 10) : 8081;

    this.MoragooServerIp.set(host);
    this.MoragooServerPort.set(isNaN(port) ? 8081 : port);
  }

  addLog(msg: string) {
    const ts = new Date().toISOString();
    this.logs.update(l => [...l, `[${ts}] ${msg}`]);
  }
}
