import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonItem,
  IonLabel,
  IonButton,
  IonList,
  IonBadge
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-modbus',
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonLabel,
    IonButton,
    
    IonBadge
  ],
  templateUrl: './modbus-admin.page.html',
  styleUrls: ['./modbus-admin.page.scss']
})
export class ModbusAdminPage {

  device = signal<any>(null);

  @Input() set deviceInput(dev: any) {
    this.device.set(dev);
    this.loadModbusInfo();
  }

  registers = signal<any[]>([]);
  coils = signal<any[]>([]);

  loadModbusInfo() {
    const dev = this.device();

    // Aquí llamas al backend real
    // Simulación temporal:
    this.registers.set([
      { addr: 0, value: 123 },
      { addr: 1, value: 456 },
      { addr: 2, value: 789 }
    ]);

    this.coils.set([
      { addr: 0, value: true },
      { addr: 1, value: false },
      { addr: 2, value: true }
    ]);
  }
}
