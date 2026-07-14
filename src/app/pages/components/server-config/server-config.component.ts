import { Component, inject } from '@angular/core';
import { IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonIcon } from '@ionic/angular/standalone';
import { LangService } from '../../../services/lang.service';
import { ProvidersService } from '../../../services/providers.service';
import { MoragooService } from '../../../services/moragoo.service';
import { SessionService } from 'src/app/services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-server-config',
  standalone: true,
  imports: [IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonIcon,CommonModule],
  templateUrl: './server-config.component.html',
  styleUrls: ['./server-config.component.scss']
})
export class ServerConfigComponent {

  lang = inject(LangService);
  providersService = inject(ProvidersService);
  moragooService = inject(MoragooService);
  sessionService = inject(SessionService);

  // ✔ CORRECTO: signals, no valores
  host = this.moragooService.MoragooServerIp;
  port = this.moragooService.MoragooServerPort;

  updateHost(v: string) {
    this.moragooService.MoragooServerIp.set(v || '');
    this.connect();
  }

  updatePort(v: string) {
    const n = parseInt(v || '8081', 10);
    this.moragooService.MoragooServerPort.set(isNaN(n) ? 8081 : n);
    this.connect();
  }

  async searchServer() {
    const full = this.moragooService.MoragooServerUrl();
    this.moragooService.addLog('Searching server: ' + full);

    await this.providersService.loadProviders(full);
  }

  
  updateRate(ev: any) {
    const rate = ev.detail.value;
    this.moragooService.updateRate(rate);
  }

  compareRefresh(a: any, b: any) {
    return Number(a) === Number(b);
  }


  async connect() {
    const ip = this.moragooService.MoragooServerIp();
    const port = this.moragooService.MoragooServerPort();

    const hostWithPort = `${ip}:${port}`;
    this.moragooService.addLog(this.lang.t('server.status.conecting') + ' ' + hostWithPort);

    // 🔥 1. Logout completo de la sesión actual
    await this.providersService.logout();

    // 🔥 2. Reconstruir sesión desde cero (fingerprint, módulo, server)
    this.sessionService.startSession();

    // 🔥 3. Actualizar server en sesión/persistencia
    this.sessionService.updateServer(ip, port);

    // 🔥 4. Recargar proveedores del nuevo servidor
    await this.providersService.loadProviders(this.moragooService.MoragooServerUrl());

    // 🔥 5. Log
    this.moragooService.addLog(`Servidor cambiado a ${ip}:${port}`);
  }


}
