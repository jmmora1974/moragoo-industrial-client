import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LangService } from './services/lang.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  
})

export class AppComponent {

  private langSevice = inject(LangService);
  private themeService = inject(ThemeService);

  constructor() {
    this.langSevice.detect();   // 🔥 Detecta idioma del dispositiu
    this.themeService.init();
  }
}
