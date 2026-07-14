import { Component, inject, effect } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonButton,
  IonRange, IonChip, IonLabel, IonItem, IonSelect, IonSelectOption,
  IonRow, IonCol, IonGrid, ModalController, ToastController
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { LangSelectorComponent } from '../lang-selector/lang-selector.component';
import { RangeCustomEvent } from '@ionic/angular';

import { ThemeService } from '../../../services/theme.service';
import { MoragooService } from '../../../services/moragoo.service';
import { LangService } from '../../../services/lang.service';
import { ModalProvidersComponent } from '../modal-providers/modal-providers.component';
import { ProvidersService } from 'src/app/services/providers.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonIcon, IonButton,
    IonRange, IonChip, IonLabel, IonItem, IonSelect, IonSelectOption,
    IonCol, IonRow, IonGrid,
    LangSelectorComponent
  ]
})
export class HeaderComponent {

  moragooService = inject(MoragooService);
  themeService = inject(ThemeService);
  langService = inject(LangService);
  modalCtrl = inject(ModalController);
  providersService = inject(ProvidersService);
  sessionService = inject(SessionService);
  toastCtrl = inject(ToastController);

  rangeValue = 0;

  constructor() {

    // Sincronización de tema
    effect(() => {
      const theme = this.themeService.currentTheme();
      this.rangeValue = this.mapThemeToRange(theme);
      setTimeout(() => {
        this.rangeValue = this.mapThemeToRange(theme);
      }, 0);
    });

    // Estado del servidor
    effect(() => this.moragooService.MoragooServerAlive());
    effect(() => this.moragooService.refreshRate());
    effect(() => this.moragooService.checkServer());
  }

  private mapThemeToRange(theme: string): number {
    if (theme === 'light') return 0;
    if (theme === 'industrial') return 1;
    return 2;
  }

  changeTheme(ev: RangeCustomEvent) {
    const value = ev.detail.value as number;
    if (value === 0) this.themeService.setTheme('light');
    if (value === 1) this.themeService.setTheme('industrial');
    if (value === 2) this.themeService.setTheme('dark');
  }

  connect() {
    this.moragooService.checkServer();
  }

  updateRate(ev: any) {
    const rate = ev.detail.value;
    this.moragooService.updateRate(rate);
  }

  compareRefresh(a: any, b: any) {
    return Number(a) === Number(b);
  }

  // 🔥 LOGIN / LOGOUT industrial
  async openLogin() {

    const session = this.sessionService.session();

    // ---------------------------------------------------------
    // LOGOUT
    // ---------------------------------------------------------
    if (session.mode === 'authenticated') {
      this.logout();
      return;
    }
   

    // ---------------------------------------------------------
    // LOGIN
    // ---------------------------------------------------------
    const modal = await this.modalCtrl.create({
          component: ModalProvidersComponent
        });

        await modal.present();
    }

    async logout() {

      // 1. Llamar al backend
      await this.providersService.logout(); // si no existe, te lo preparo

      // 2. Actualizar sesión sin borrar fingerprint ni server
      this.sessionService.startSession();

      // 3. Log
      this.moragooService.addLog(this.langService.t('generic.logout'));

      // 4. Toast
      const toast = await this.toastCtrl.create({
        message: this.langService.t('generic.logout'),
        duration: 2000,
        color: 'medium'
      });
      toast.present();
    }

}
