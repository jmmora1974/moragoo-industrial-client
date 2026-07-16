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

import { PlcAdminPage } from './plc-admin.page';

@Component({
  selector: 'app-plc-admin-card',
  standalone: true,
  imports: [
    CommonModule,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    PlcAdminPage
  ],
  templateUrl: './plc-admin-card.component.html',
  styleUrls: ['./plc-admin-card.component.scss']
})
export class PlcAdminCardComponent {

  device = signal<any>(null);

  @Input() set data(dev: any) {
    this.device.set(dev);
  }
}
