import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonButton, IonChip, IonImg,
  IonSegment, IonSegmentButton
} from '@ionic/angular/standalone';

import { BackendService } from 'src/app/services/backend.service';
import { DeviceItem } from 'src/app/types/device.type';

@Component({
  selector: 'app-admin-plc',
  standalone: true,
  imports: [
    CommonModule,
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonButton, IonChip, IonImg,
    IonSegment, IonSegmentButton, IonCol
  ],
  templateUrl: './plc-admin.page.html',
  styleUrls: ['./plc-admin.page.scss']
})
export class PlcAdminPage {

  @Input() device!: DeviceItem;

  // Segment interno tipo TIA Portal
  segment = signal('cpu');

  // SZL signals
  cpuState = signal<any>(null);
  firmware = signal<any>(null);
  hardware = signal<any>(null);
  network = signal<any>(null);
  diagnostic = signal<any>(null);
  modules = signal<any>(null);
  clock = signal<any>(null);
  language = signal<any>(null);
  lcd = signal<any>(null);
  warnings = signal<any>(null);
  startup = signal<any>(null);

  // IO + DBs
  dbList = signal<any[]>([]);
  ioList = signal<{ inputs: any[], outputs: any[] }>({ inputs: [], outputs: [] });

  backendService = inject(BackendService);

  ngOnInit() {
    this.loadPLCInfo();
  }
  

  changeSegment(ev: any) {
   //this.loadPLCInfo();
    this.segment.set(ev.detail.value || 'cpu');
     
  }

  async loadPLCInfo() {
    if (!this.device) return;

    const ip = this.device.ip;
    const driver = this.device.type;

    const url2 = `/api/device/state?ip=${ip}&driver=${driver}`;

    try {
      const res2 = await this.backendService.get(url2);
      const data2 = res2 as any;
      console.log("State "+JSON.stringify(data2))
      // PINTAR IO REALES DEL PLC
      this.ioList.set({
        inputs: data2.inputs || [],
        outputs: data2.outputs || []
      });

    } catch (err) {
      console.error('Error cargando state IOs PLC:', err);
    }
  }

}
