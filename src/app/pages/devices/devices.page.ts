import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonBadge, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol,
  IonSegment, IonSegmentButton, IonLabel,
  IonSegmentView, IonSegmentContent
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';

import { HeaderComponent } from '../components/header/header.component';
import { DevicesService } from '../../services/devices.service';
import { MoragooService } from '../../services/moragoo.service';
import { ThemeService } from '../../services/theme.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonBadge, IonSegment, IonSegmentButton, IonLabel,
    IonSegmentContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonSegmentView, IonGrid, IonRow, IonCol
  ]
})
export class DevicesPage implements OnInit {

  devicesService = inject(DevicesService);
  moragooService = inject(MoragooService);
  themeService = inject(ThemeService);
  toastCtrl = inject(ToastController);
  router = inject(Router);

  detectedDevices = signal<any[]>([]);
  configuredDevices = signal<any[]>([]);
  sharedDevices = signal<any[]>([]);

  ngOnInit() {
    this.refreshDetected();
    this.refreshConfigured();
    this.refreshShared();
  }

  // ---------------------------------------------------------
  // NAVIGATE TO DEVICE ADMIN PAGE
  // ---------------------------------------------------------
  goToDevice(dev: any) {
    this.devicesService.setCurrentDevice(dev);
    this.router.navigate(['/tabs/device', dev.id]);
  }

  // ---------------------------------------------------------
  // REFRESH LISTS
  // ---------------------------------------------------------

  refreshDetected() {
    this.devicesService.getFound()
      .then(data => this.detectedDevices.set(Array.isArray(data) ? data : []))
      .catch(() => this.detectedDevices.set([]));
  }

  refreshConfigured() {
    this.devicesService.getConfigured()
      .then(data => this.configuredDevices.set(Array.isArray(data) ? data : []))
      .catch(() => this.configuredDevices.set([]));
  }

  refreshShared() {
    this.devicesService.getShared()
      .then(data => this.sharedDevices.set(Array.isArray(data) ? data : []))
      .catch(() => this.sharedDevices.set([]));
  }

  // ---------------------------------------------------------
  // ADD TO CONFIGURED
  // ---------------------------------------------------------
  async addToConfigured(dev: any) {
    try {
      const result = await this.devicesService.addConfigured(dev);

      const toast = await this.toastCtrl.create({
        message: result.msg,
        duration: result.ok ? 1000 : 4000,
        color: result.ok ? 'success' : 'danger'
      });

      await toast.present();

      if (result.ok) {
        this.refreshConfigured();
      }

    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: err.message ?? 'Error inesperado',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  // ---------------------------------------------------------
  // REMOVE CONFIGURED
  // ---------------------------------------------------------
  removeConfigured(id: string) {
    this.devicesService.deleteConfigured(id)
      .then(() => this.refreshConfigured())
      .catch(() => {});
  }

  // ---------------------------------------------------------
  // SHARE CONFIGURED
  // ---------------------------------------------------------
  shareConfigured(id: string) {
    this.devicesService.shareDevice(id)
      .then(() => this.refreshShared())
      .catch(() => {});
  }

  // ---------------------------------------------------------
  // REMOVE SHARED
  // ---------------------------------------------------------
  removeShared(id: string) {
    this.devicesService.deleteShared(id)
      .then(() => this.refreshShared())
      .catch(() => {});
  }

  // ---------------------------------------------------------
  // SCAN SAFE / ADVANCED
  // ---------------------------------------------------------
  scanSafe() {
    this.devicesService.scanSafe()
      .then(() => this.refreshDetected())
      .catch(() => {});
  }

  scanAdvanced() {
    this.devicesService.scanAdvanced()
      .then(() => this.refreshDetected())
      .catch(() => {});
  }

  // ---------------------------------------------------------
  // ICONS
  // ---------------------------------------------------------
  iconFor(dev: any) {
    switch (dev.driver) {
      case 's7': return 'assets/icon/plc-module.svg';
      case 'logo': return 'assets/icon/plc-logo.svg';
      case 'modbus': return 'assets/icon/ind-cable.svg';
      case 'snmp': return 'assets/icon/net-router.svg';
      case 'bacnet': return 'assets/icon/ind-hex.svg';
      case 'knx': return 'assets/icon/net-topology.svg';
      case 'excel': return 'assets/icon/adm-doc.svg';
      case 'moradoo': return 'assets/icon/server.svg';
      default: return 'assets/icon/ind-crane.svg';
    }
  }
}
