import { Injectable, signal, computed, effect } from '@angular/core';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class MoragooService {

  // ---------------------------------------------------------
  // ESTADO GLOBAL
  // ---------------------------------------------------------

  status = signal<'ready' | 'loading' | 'error'>('ready');
  provider = signal<string | null>(null);
  module = signal<string>('dashboard');
  theme = signal<'industrial' | 'dark' | 'light'>('industrial');

  fingerprint = signal<string>('unknown');
  deviceInfo = signal<any>(null);
  networkStatus = signal<'online' | 'offline'>('online');

  logs = signal<string[]>([]);

  // Variables globales fijas por ahora
  MoragooServerUrl = signal('http://127.0.0.1');
  MoragooServerPort = signal('8081');
  keepAliveTimer: any;
  MoragooServerAlive = signal(false);
  refreshRate = signal(5000); // default 5s

  // Estado del servidor
  

  updateRate(rate: number) {
    this.refreshRate.set(rate);

    clearInterval(this.keepAliveTimer);
    this.keepAliveTimer = setInterval(() => this.checkServer(), rate);

    this.addLog(`Nueva tasa de refresco: ${rate}ms`);
  }

  get fullUrl() {
    return `${this.MoragooServerUrl()}:${this.MoragooServerPort()}`;
  }

  startKeepAlive() {
    // cada 5 segundos (luego será configurable)
    setInterval(() => {
      this.checkServer();
    }, 5000);
  }

  async checkServer() {
    const url = `${this.fullUrl}/json/connector`;

    try {
      const res = await fetch(url, { method: 'GET' });
      this.MoragooServerAlive.set(res.ok);
    } catch {
      this.MoragooServerAlive.set(false);
    }
  }

  // ---------------------------------------------------------
  // DISPOSITIVOS Y PROCESOS INDUSTRIALES
  // ---------------------------------------------------------

  devicesFound = signal<any[]>([]);
  devicesManaged = signal<any[]>([]);
  devicesShared = signal<any[]>([]);
  processes = signal<any[]>([]);
  alerts = signal<any[]>([]);
  tasks = signal<any[]>([]);

  // ---------------------------------------------------------
  // COMPUTED
  // ---------------------------------------------------------

  isOnline = computed(() => this.networkStatus() === 'online');
  isReady = computed(() => this.status() === 'ready');

  constructor() {
    this.initDeviceInfo();
    this.initNetworkMonitor();
    this.generateFingerprint();
    this.startKeepAlive();
    effect(() => {
      this.addLog(`Estado: ${this.status()}`);
    });
  }

  // ---------------------------------------------------------
  // INIT
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

    this.addLog('Device info cargado');
  }

  async initNetworkMonitor() {
    const st = await Network.getStatus();
    this.networkStatus.set(st.connected ? 'online' : 'offline');

    Network.addListener('networkStatusChange', (st) => {
      this.networkStatus.set(st.connected ? 'online' : 'offline');
      this.addLog(`Network: ${this.networkStatus()}`);
    });
  }

  generateFingerprint() {
    const fp = `fp-${Math.random().toString(36).substring(2, 12)}`;
    this.fingerprint.set(fp);
    this.addLog(`Fingerprint generado: ${fp}`);
  }

  // ---------------------------------------------------------
  // SETTERS
  // ---------------------------------------------------------

  setProvider(p: string | null) {
    this.provider.set(p);
  }

  setModule(m: string) {
    this.module.set(m);
  }

  setTheme(t: 'industrial' | 'dark' | 'light') {
    this.theme.set(t);
    this.addLog(`Theme cambiado: ${t}`);
  }

  setStatus(s: 'ready' | 'loading' | 'error') {
    this.status.set(s);
  }

  // ---------------------------------------------------------
  // DISPOSITIVOS
  // ---------------------------------------------------------

  setDevicesFound(list: any[]) {
    this.devicesFound.set(list);
  }

  setDevicesManaged(list: any[]) {
    this.devicesManaged.set(list);
  }

  setDevicesShared(list: any[]) {
    this.devicesShared.set(list);
  }

  setProcesses(list: any[]) {
    this.processes.set(list);
  }

  setAlerts(list: any[]) {
    this.alerts.set(list);
  }

  setTasks(list: any[]) {
    this.tasks.set(list);
  }

  // ---------------------------------------------------------
  // LOGS
  // ---------------------------------------------------------

  addLog(msg: string) {
    const ts = new Date().toISOString();
    this.logs.update(l => [...l, `[${ts}] ${msg}`]);
  }

  clearLogs() {
    this.logs.set([]);
  }
}
