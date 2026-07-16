import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-modbus-admin-card',
  standalone: true,
  imports: [
    CommonModule,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    
  ],
  templateUrl: './modbus-admin-card.component.html',
  styleUrls: ['./modbus-admin-card.component.scss']
})
export class ModbusAdminCardComponent {

  device = signal<any>(null);

  @Input() set data(dev: any) {
    this.device.set(dev);
  }
}
