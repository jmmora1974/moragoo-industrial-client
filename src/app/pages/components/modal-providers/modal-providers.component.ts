import { Component, effect, inject, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, 
  IonLabel,

  ToastController,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonInput,
  IonItem,
  IonList,
  IonItemDivider
} from '@ionic/angular/standalone';

import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { ProvidersService } from '../../../services/providers.service';
import { MoragooService } from '../../../services/moragoo.service';
import { LangService } from '../../../services/lang.service';
import { ProviderInfo } from 'src/app/types/provider.type';
import { SessionService } from 'src/app/services/session.service';
import {ServerConfigComponent  } from '../server-config/server-config.component';

@Component({
  selector: 'app-modal-providers',
  standalone: true,
  templateUrl: './modal-providers.component.html',
  styleUrls: ['./modal-providers.component.scss'],
  imports: [
    CommonModule,
    ServerConfigComponent,
    
    // Ionic core
    IonContent,
    IonLabel,
    IonButton,
    IonButtons,
    IonInput,
    IonItem,
    IonItemDivider,
    IonList,
    IonHeader,
    IonTitle,
    IonToolbar,
    
    IonSegment,
    IonSegmentButton,
    IonSegmentContent,
    IonSegmentView,
    
    
],

})
export class ModalProvidersComponent {

  modalCtrl = inject(ModalController);
  providersService = inject(ProvidersService);
  moragoo = inject(MoragooService);
  sessionService = inject(SessionService);
  lang = inject(LangService);
  toastCtrl = inject(ToastController);
  
  providers = signal<ProviderInfo[]>([]);  // ← AHORA ES UN ARRAY
  form = signal(this.getForm(this.providers()));    // ← OBJETO dentro de signal
  selectedProvider = 'local';
  isLocalAvailable = signal(true);
  isAdAvailable = signal(false);
  isOdooAvailable = signal(false);
  isUnierpAvailable = signal(false);




  constructor() {
    effect(() => {
      const list = this.providersService.providers();
      console.log('PROVIDERS ACTUALIZADOS:', list);
      this.providers.set(list);              // ← ACTUALIZA EL SIGNAL
      this.form.set(this.getForm(list));     // ← FORM CORRECTO
      this.updateProviderAvailability(list); // ← DISPONIBILIDAD CORRECTA
    });
    console.log('PROVIDERS RECIBIDOS:', this.providersService.providers());

  }


  getForm(list: ProviderInfo[]) {
    const obj: Record<string, Record<string, string>> = {};

    for (const p of list) {
      obj[p.id] = {};

      // Campos normales
      for (const f of p.fields) {
        obj[p.id][f.id!] = '';
      }

      // Campos de domain
      if (p.domain?.value !== undefined) obj[p.id]['domain_url'] = p.domain.value;
      if (p.domain?.port !== undefined) obj[p.id]['domain_port'] = String(p.domain.port);
      if (p.domain?.database !== undefined) obj[p.id]['domain_db'] = p.domain.database;
      
      // Campos de domain
      if (p.domain?.value !== undefined) obj[p.id]['domain_url'] = p.domain.value;
      if (p.domain?.port !== undefined) obj[p.id]['domain_port'] = String(p.domain.port);
      if (p.domain?.database !== undefined) obj[p.id]['domain_db'] = p.domain.database;

      // Campos de capabilities
      if (Array.isArray(p.capabilities?.fields)) {
        for (const f of p.capabilities.fields) {
          obj[p.id][`cap_${f.id}`] = f.value ?? '';
        }
      }

    }
    

    return obj;
  }


  updateServerIp(value: any) {
    const v = value ?? '';
    this.moragoo.MoragooServerIp.set(String(v));
  }

  updateServerPort(value: any) {
    const raw = value ?? '';
    const num = Number(raw);
    this.moragoo.MoragooServerPort.set(isNaN(num) ? 8081 : num);
  }

  updateField(providerId: string, fieldId: string, value: any) {
    const v = value ?? '';
    const current = this.form();
    current[providerId][fieldId] = String(v);
    this.form.set({ ...current });
  }

  async connect(providerId: string) {
    const credentials = this.form()[providerId];

    try {
      const res = await this.providersService.authenticate(providerId, credentials);

      // Log
      this.moragoo.addLog(this.lang.t('log.login_ok'));

      // Toast
      const toast = await this.toastCtrl.create({
        message: this.lang.t('log.login_ok'),
        duration: 3000,
        color: 'success'
      });
      toast.present();

      // 🔥 Actualizar sesión directamente
      this.sessionService.updateSession({
        ...res,
        provider: providerId
      });

      // 🔥 Cerrar modal SOLO si login OK
      this.modalCtrl.dismiss({ ok: true });

    } catch (err) {

      this.moragoo.addLog(this.lang.t('log.login_fail'));

      const toast = await this.toastCtrl.create({
        message: this.lang.t('log.login_fail'),
        duration: 2500,
        color: 'danger'
      });
      toast.present();

      // ❌ NO cerrar modal
    }
  }

  updateProviderAvailability(list: ProviderInfo[]) {

    // LOCAL siempre disponible
    this.isLocalAvailable.set(true);

    // Reset de los demás
    this.isAdAvailable.set(false);
    this.isOdooAvailable.set(false);
    this.isUnierpAvailable.set(false);

    for (const p of list) {
      switch (p.id) {
        case 'ad':
          this.isAdAvailable.set(true);
          break;
        case 'odoo':
          this.isOdooAvailable.set(true);
          break;
        case 'unierp':
          this.isUnierpAvailable.set(true);
          break;
      }
    }
  }
  
  get localFields() {
    return this.providers().find(p => p.id === 'local')?.fields ?? [];
  }
  get adFields() {
    return this.providers().find(p => p.id === 'ad')?.fields ?? [];
  }
  get odooFields() {
    return this.providers().find(p => p.id === 'odoo')?.fields ?? [];
  }
  get unierpFields() {
    return this.providers().find(p => p.id === 'unierp')?.fields ?? [];
  }

  get odooFullFields() {
    const p = this.providers().find(p => p.id === 'odoo');
    if (!p) return [];

    const domainFields = [
      { id: 'domain_url', label: 'URL', type: 'text', value: p.domain?.value ?? '' },
      { id: 'domain_port', label: 'Puerto', type: 'number', value: p.domain?.port ?? '' },
      { id: 'domain_db', label: 'Base de datos', type: 'text', value: p.domain?.database ?? '' },
    ];

    return [...p.fields, ...domainFields];
  }
  get adFullFields() {
    const p = this.providers().find(p => p.id === 'ad');
    if (!p) return [];

    const domainFields = [];

    if (p.domain?.value) {
      domainFields.push({ id: 'domain_url', label: 'URL', type: 'text', value: p.domain.value });
    }
    if (p.domain?.port) {
      domainFields.push({ id: 'domain_port', label: 'Puerto', type: 'number', value: p.domain.port });
    }
    if (p.domain?.database) {
      domainFields.push({ id: 'domain_db', label: 'Base de datos', type: 'text', value: p.domain.database });
    }

    return [...p.fields, ...domainFields];
  }

  get unierpFullFields() {
    const p = this.providers().find(p => p.id === 'unierp');
    if (!p) return [];

    const domainFields = [];

    // Si el backend empieza a enviar domain.value
    if (p.domain?.value !== undefined) {
      domainFields.push({
        id: 'domain_url',
        label: 'URL',
        type: 'text',
        value: p.domain.value
      });
    }

    // Si el backend empieza a enviar domain.port
    if (p.domain?.port !== undefined) {
      domainFields.push({
        id: 'domain_port',
        label: 'Puerto',
        type: 'number',
        value: p.domain.port
      });
    }

    // Si el backend empieza a enviar domain.database
    if (p.domain?.database !== undefined) {
      domainFields.push({
        id: 'domain_db',
        label: 'Base de datos',
        type: 'text',
        value: p.domain.database
      });
    }

    // Si algún día UNIERP tiene capabilities con campos
    if (Array.isArray(p.capabilities?.fields)) {
      for (const f of p.capabilities.fields) {
        domainFields.push({
          id: `cap_${f.id}`,
          label: f.label ?? f.name,
          type: f.type ?? 'text',
          value: f.value ?? ''
        });
      }
    }

    return [...p.fields, ...domainFields];
  }



  close() {
    this.modalCtrl.dismiss();
  }
}
