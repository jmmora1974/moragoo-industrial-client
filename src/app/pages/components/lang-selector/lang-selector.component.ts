import { Component, inject } from '@angular/core';
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { LangService } from '../../../services/lang.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lang-selector',
  standalone: true,
  templateUrl: './lang-selector.component.html',
  imports: [
    CommonModule,
    IonSelect,
    IonSelectOption
  ]
})
export class LangSelectorComponent {
  lang = inject(LangService);

  // 🔥 Reactiu: NO cridem languages()
  languages = this.lang.languages;

  changeLang(code: string) {
    this.lang.setLang(code as any);
  }
}
