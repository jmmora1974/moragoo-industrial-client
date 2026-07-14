import { Component, Input, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonButtons, IonIcon, IonText, IonModal
} from '@ionic/angular/standalone';

import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'critical-alert',
  standalone: true,
  templateUrl: './critical-alert.component.html',
  styleUrls: ['./critical-alert.component.scss'],
  imports: [
    
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonText
  ]
})
export class CriticalAlertComponent {

  modalCtrl = inject(ModalController);

  @Input() title: string = 'Error crítico';
  @Input() message: string = 'Ha ocurrido un error grave.';

  close() {
    this.modalCtrl.dismiss();
  }
}
