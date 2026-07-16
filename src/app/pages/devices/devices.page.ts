import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';


import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton,  IonBadge, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSegmentView,
  IonSegmentContent
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

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
    IonButton, IonBadge, IonSegment, IonSegmentButton, IonLabel,IonSegmentContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSegmentButton, IonSegmentView,
    IonGrid, IonRow, IonCol, RouterLink
  ]
})
export class DevicesPage implements OnInit {

  devicesService = inject(DevicesService);
  moragooService = inject(MoragooService);
 
  detectedDevices = signal<any[]>([]);
  configuredDevices = signal<any[]>([]);
   themeService = inject(ThemeService);
  toastCtrl = inject(ToastController);

  ngOnInit() {
    this.refreshDetected();
    this.refreshConfigured();
  }

  refreshDetected() {
    this.devicesService.getFound().then(res => {
      this.detectedDevices.set(Array.isArray(res) ? res : []);
    });
  }

  refreshConfigured() {
    this.devicesService.getAll().then(res => {
      this.configuredDevices.set(Array.isArray(res) ? res : []);
    });
  }

  addToConfigured(dev: any) {
  const newDev = {
    ...dev,
    id: crypto.randomUUID()
  };

  const url = `${this.moragooService.MoragooServerUrl()}/api/devices/shared/add`;
  this.devicesService.backendService.post(url, newDev)
    .then(() => this.refreshConfigured());
}

  
  removeConfigured(id: number) {
    const url = `${this.moragooService.MoragooServerUrl()}/api/devices/shared/delete`;
    this.devicesService.backendService.post(url, { index: id })
      .then(() => this.refreshConfigured());
  }


  iconFor(dev: any) {
    switch (dev.driver) {
      case 'plc': return 'assets/icon/plc-module.svg';
      case 'modbus': return 'assets/icon/ind-cable.svg';
      case 'snmp': return 'assets/icon/net-router.svg';
      case 'bacnet': return 'assets/icon/ind-hex.svg';
      case 'knx': return 'assets/icon/net-topology.svg';
      case 'excel': return 'assets/icon/adm-doc.svg';
      default: return 'assets/icon/ind-crane.svg';
    }
  }

  // ⭐ Estado visual industrial
  statusClass(dev: any) {
    switch (dev.status) {
      case 'online': return 'st-online';
      case 'configured': return 'st-configured';
      case 'error': return 'st-error';
      default: return 'st-offline';
    }
  }

  async shareConfigured(id: number) {
    const toast = await this.toastCtrl.create({
      message: 'Función en construcción',
      duration: 2000,
      color: 'warning',
      position: 'bottom'
    });

    await toast.present();
  }


}


