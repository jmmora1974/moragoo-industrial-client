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
  selector: 'app-admin-plc',
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonLabel,
    
  ],
  templateUrl: './plc-admin.page.html',
  styleUrls: ['./plc-admin.page.scss']
})
export class PlcAdminPage {

  @Input() device: any;

  cpuState = signal('desconocido');
  dbList = signal<any[]>([]);
  ioList = signal<any[]>([]);

  ngOnInit() {
    this.loadPLCInfo();
  }

  loadPLCInfo() {
    if (!this.device) return;

    this.cpuState.set('RUN');
    this.dbList.set([
      { id: 1, name: 'DB1', size: 256 },
      { id: 2, name: 'DB2', size: 128 }
    ]);

    this.ioList.set([
      { id: 'I0.0', value: true },
      { id: 'I0.1', value: false },
      { id: 'Q0.0', value: true },
      { id: 'Q0.1', value: false }
    ]);
  }
}
