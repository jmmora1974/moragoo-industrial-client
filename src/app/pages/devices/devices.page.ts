import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonAccordion, IonAccordionGroup, IonBadge, IonButton, IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderComponent } from '../components/header/header.component';
import { MoragooService } from '../../services/moragoo.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule, HeaderComponent, IonToolbar,
    IonLabel, IonItem, IonButton, IonAccordion, IonAccordionGroup, IonBadge
  ]
})
export class DevicesPage implements OnInit {

  moragooService = inject(MoragooService);
  
  constructor() { }

  ngOnInit() {
  }

  // 🔥 Lista reactiva de dispositivos detectados
detectedDevices = signal<any[]>([
  {
    id: 'dev-1',
    name: 'PLC Siemens S7-1200',
    ip: '192.168.1.10',
    port: 102,
    driver: 's7',
    version: '1.0.3'
  },
  {
    id: 'dev-2',
    name: 'Modbus TCP Sensor',
    ip: '192.168.1.20',
    port: 502,
    driver: 'modbus',
    version: '2.1.0'
  }
]);


// 🔥 Lista reactiva de dispositivos configurados
configuredDevices = signal<any[]>([
  {
    id: 'cfg-1',
    name: 'Robot ABB IRB120',
    ip: '192.168.1.50',
    port: 80,
    driver: 'abb',
    version: '3.2.1'
  }
]);

// 🔥 Getter para detectados
detectedDevicesList() {
  return this.detectedDevices();
}

// 🔥 Getter para configurados
configuredDevicesList() {
  return this.configuredDevices();
}

addToConfigured(dev: any) {
  const list = this.configuredDevices();
  this.configuredDevices.set([...list, dev]);
}
removeConfigured(id: string) {
  const list = this.configuredDevices();
  this.configuredDevices.set(list.filter(d => d.id !== id));
}
manageDevice(dev: any) {
  console.log('Administrar dispositivo:', dev);
  // mañana abrimos modal industrial
}
refreshDetected() {
  console.log('Buscando dispositivos...');
  // mañana conectamos con MoradooService.scanDevices()
}
isOnline(dev: any) {
  return true; // mañana lo conectamos al ping real
}


}
