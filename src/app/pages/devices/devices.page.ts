import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  IonAccordion, IonAccordionGroup, IonBadge, IonButton, IonContent,
  IonHeader, IonItem, IonLabel, IonTitle, IonToolbar
} from '@ionic/angular/standalone';

import { HeaderComponent } from '../components/header/header.component';
import { DevicesService } from '../../services/devices.service';
import { MoragooService } from '../../services/moragoo.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, ReactiveFormsModule, HeaderComponent,
    IonToolbar, IonLabel, IonItem, IonButton,
    IonAccordion, IonAccordionGroup, IonBadge
  ]
})
export class DevicesPage implements OnInit {

  devicesService = inject(DevicesService);
  moragooService = inject(MoragooService);

  detectedDevices = signal<any[]>([]);
  configuredDevices = signal<any[]>([]);

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
    const url = `${this.moragooService.MoragooServerUrl()}/api/devices/shared/add`;
    this.devicesService.backendService.post(url, dev)
      .then(() => this.refreshConfigured());
  }

  removeConfigured(index: number) {
    const url = `${this.moragooService.MoragooServerUrl()}/api/devices/shared/delete`;
    this.devicesService.backendService.post(url, { index })
      .then(() => this.refreshConfigured());
  }

  manageDevice(dev: any) {
    console.log('Administrar dispositivo:', dev);
  }

  isOnline(dev: any) {
    return true;
  }
}
