import {
  Component,
  inject,
  signal,
  ViewChild,
  ViewContainerRef,
  AfterViewInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';

import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { MoragooService } from '../../services/moragoo.service';

@Component({
  selector: 'app-device-admin',
  standalone: true,
  templateUrl: './device-admin.page.html',
  styleUrls: ['./device-admin.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class DeviceAdminPage implements AfterViewInit {

  route = inject(ActivatedRoute);
  backendService = inject(BackendService);
  moragooService = inject(MoragooService);

  @ViewChild('driverContainer', { read: ViewContainerRef })
  driverContainer!: ViewContainerRef;

  deviceId = this.route.snapshot.paramMap.get('id');
  device = signal<any>(null);

  segment = signal('info');

  ngAfterViewInit() {
    this.loadDevice();
  }

  changeSegment(ev: any) {
    this.segment.set(ev.detail.value);

    if (ev.detail.value === 'driver') {
      this.loadDriverComponent();
    }
  }

  loadDevice() {
    const url = `${this.moragooService.MoragooServerUrl()}/api/devices/shared/get`;

    this.backendService.post(url, { id: this.deviceId })
      .then(res => {
        this.device.set(res);
        this.loadDriverComponent();
      });
  }

  async loadDriverComponent() {
    if (!this.driverContainer) return;

    this.driverContainer.clear();

    const driver = this.device()?.driver;

    switch (driver) {

      case 'plc': {
        const { PlcAdminCardComponent } =
          await import('./plc/plc-admin-card.component');

        const cmp = this.driverContainer.createComponent(PlcAdminCardComponent);
        cmp.instance.data = this.device();
        break;
      }

      case 'modbus': {
        const { ModbusAdminCardComponent } =
          await import('./modbus/modbus-admin-card.component');

        const cmp = this.driverContainer.createComponent(ModbusAdminCardComponent);
        cmp.instance.data = this.device();
        break;
      }

      // Añadir más drivers aquí…

      default:
        console.warn('Driver no soportado:', driver);
    }
  }
}
