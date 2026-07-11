import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonButton,
  IonRange, IonChip, IonLabel, IonItem, IonSelect, IonSelectOption,
  IonRow,
  IonCol,
  IonGrid
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { LangSelectorComponent } from '../lang-selector/lang-selector.component';
import { RangeCustomEvent } from '@ionic/angular';

import { ThemeService } from '../../../services/theme.service';
import { MoragooService } from '../../../services/moragoo.service';
import { LangService } from '../../../services/lang.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle,  IonIcon, IonButton,
    IonRange, IonChip, IonLabel, IonItem, IonSelect, IonSelectOption,
    CommonModule, LangSelectorComponent, IonCol, IonRow, IonGrid
  ]
})
export class HeaderComponent {

  moragooService = inject(MoragooService);
  themeService = inject(ThemeService);
    langService = inject(LangService);

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

}
