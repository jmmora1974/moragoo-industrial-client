import { Component, inject, signal, computed } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonList, IonItem, IonInput, IonAvatar, IonIcon,
  IonLabel, IonBadge, IonModal
} from '@ionic/angular/standalone';

import { ModalController } from '@ionic/angular/standalone';
import { ProvidersService } from '../../../services/providers.service';
import { LangService } from '../../../services/lang.service';
import { effect } from '@angular/core';
import { CriticalAlertComponent } from '../critical-alert.component/critical-alert.component';

@Component({
  selector: 'app-modal-providers',
  standalone: true,
  templateUrl: './modal-providers.component.html',
  styleUrls: ['./modal-providers.component.scss'],
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonAvatar,
    IonIcon,
    IonLabel,
    IonBadge
  ]
})
export class ModalProvidersComponent {

  modalCtrl = inject(ModalController);
  providersService = inject(ProvidersService);
  lang = inject(LangService);

  selectedProvider = signal<string | null>(null);
  formData = signal<Record<string, any>>({});

  // Providers como signal computado
  providers = computed(() => this.providersService.providers());

  constructor() {

    // 🔥 Aquí detectamos proveedores incompletos o fallo del backend
    effect(() => {
      const list = this.providers();

      if (list.length === 0 || list.some(p => !p.fields?.length)) {
        this.showCriticalAlert();
        this.providersService.forceLocalPINX();
      }
    });

  }

  // Campos dinámicos del proveedor seleccionado
  fields = computed(() => {
    const id = this.selectedProvider();
    if (!id) return [];
    const p = this.providers().find(x => x.id === id);
    return p?.fields ?? [];
  });

  selectProvider(id: string) {
    this.selectedProvider.set(id);
    this.formData.set({});
  }

  async showCriticalAlert() {
    
    const alert = await this.modalCtrl.create({
      component: CriticalAlertComponent,
      componentProps: {
        title: 'Error crítico en proveedores',
        message: `
          No se han podido cargar los proveedores de autenticación correctamente.
          Contacte con el administrador del sistema o el departamento de IT.
          Si el problema persiste, escriba a api.moradoo@gmail.com
          o rellene el formulario de contacto.
        `
      }
    });

    await alert.present();
  }

  updateField(name: string, value: any) {
    this.formData.update(f => ({ ...f, [name]: value }));
  }

  async submit() {
    const providerId = this.selectedProvider();
    const credentials = this.formData();

    const result = await this.providersService.connect(providerId!, credentials);

    this.modalCtrl.dismiss(result);
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }


  
}
