import { Component, inject, effect } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonButton,
  IonRange, IonChip, IonLabel, IonItem, IonSelect, IonSelectOption,
  IonRow, IonCol, IonGrid,
  ModalController,
  IonModal,
  IonAccordion
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { LangSelectorComponent } from '../lang-selector/lang-selector.component';
import { RangeCustomEvent } from '@ionic/angular';
import { ThemeService } from '../../../services/theme.service';
import { MoragooService } from '../../../services/moragoo.service';
import { LangService } from '../../../services/lang.service';
import { ModalProvidersComponent } from '../modal-providers/modal-providers.component';
import { IonicModule } from '@ionic/angular';
import { CriticalAlertComponent } from '../critical-alert.component/critical-alert.component';
import { ProvidersService } from 'src/app/services/providers.service';


@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
  CommonModule,
  
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButton,
  IonRange,
  IonChip,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonCol,
  IonRow,
  IonGrid,
  LangSelectorComponent
]
})
export class HeaderComponent {

  moragooService = inject(MoragooService);
  themeService = inject(ThemeService);
  langService = inject(LangService);
  modalCtrl = inject(ModalController);
  providersService=inject(ProvidersService);
  // Valor del slider (0,1,2)
  rangeValue = 0;

  constructor() {

    // 🔥 EFFECT: sincroniza el slider cuando cambia el tema
    effect(() => {
      const theme = this.themeService.currentTheme(); // signal
      this.rangeValue = this.mapThemeToRange(theme);

      // Necesario para que IonRange actualice visualmente
      setTimeout(() => {
        this.rangeValue = this.mapThemeToRange(theme);
      }, 0);
    });

    
    // Estado del servidor
    effect(() => {
      this.moragooService.MoragooServerAlive();
    });

    // Refresco → fuerza repintado del select
    effect(() => {
      this.moragooService.refreshRate();
    });
    
    // Refresco → fuerza repintado del select
    effect(() => {
      this.moragooService.checkServer();
    });
  }

  // Mapea tema → posición del slider
  private mapThemeToRange(theme: string): number {
    if (theme === 'light') return 0;
    if (theme === 'industrial') return 1;
    return 2; // dark
  }

  // Mapea slider → tema
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

  async openLogin() {
    const modal = await this.modalCtrl.create({
      component: ModalProvidersComponent
    });

    await modal.present();

    const result = await modal.onWillDismiss();

    // MODO SEGURO → activar proveedor local PINX
    if (result.data?.safeMode) {
      this.showCriticalAlert();
      this.providersService.forceLocalPINX();
      return;
    }

    if (result.data?.ok) {
      console.log('LOGIN OK:', result.data);
    } else {
      console.warn('LOGIN cancelado o fallido');
    }
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

}
