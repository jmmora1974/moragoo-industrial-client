import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LangService } from './services/lang.service';
import { ThemeService } from './services/theme.service';
import { ProvidersService } from './services/providers.service';
import { SessionService } from './services/session.service';
import { MoragooService } from './services/moragoo.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  
})

export class AppComponent {

  private langSevice = inject(LangService);
  private themeService = inject(ThemeService);
  private sessionService = inject(SessionService);
  private providersService = inject(ProvidersService);
  private moragooService = inject(MoragooService);

  private hostMoragoo = this.moragooService.MoragooServerUrl();

  constructor() {
    this.langSevice.detect();   // 🔥 Detecta idioma del dispositiu
    this.themeService.init();
    
    this.sessionService.startSession();   // fingerprint + device + version
    this.providersService.loadProviders(this.hostMoragoo); // carga AD, Local, Odoo...

  }
}
