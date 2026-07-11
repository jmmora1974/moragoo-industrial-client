import { Component, inject, signal, computed } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonModal
} from '@ionic/angular/standalone';

import { ModalController } from '@ionic/angular';
import { ProvidersService } from '../../../services/providers.service';
import { LangService } from '../../../services/lang.service';

@Component({
  selector: 'app-modal-providers',
  standalone: true,
  templateUrl: './modal-providers.component.html',
  styleUrls: ['./modal-providers.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonInput
    
  ]
})
export class ModalProvidersComponent {

  modalCtrl = inject(ModalController);
  providersService = inject(ProvidersService);
  lang = inject(LangService);

  selectedProvider = signal<string | null>(null);
  formData = signal<any>({});

  providers = computed(() => this.providersService.providers());

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
