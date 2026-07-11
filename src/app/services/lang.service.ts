import { Injectable, signal } from '@angular/core';

type LangCode =
  | 'ca' | 'es' | 'en' | 'fr' | 'jp' | 'ru'
  | 'de' | 'nl' | 'kr' | 'it' | 'pt';
  
@Injectable({
  providedIn: 'root',
})
export class LangService {

  // Idioma actual

  currentLang = signal<LangCode>('ca');


  // 🔥 Llista d’idiomes centralitzada
    
  languages = signal([
    { code: 'ca', label: 'Català' },
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'jp', label: '日本語' },
    { code: 'ru', label: 'Русский' },
    { code: 'de', label: 'Deutsch' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'kr', label: '한국어' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' }
  ]);
    
  // Diccionaris (estructura completa)
  private dictionaries: Record<string, Record<string, string>> = {

    // Català
    ca: {
      'provider.select': 'Seleccionar proveïdor',
      'provider.name': 'Proveïdor',
      'provider.credentials': 'Credencials',
      'provider.module': 'Mòdul',
      'provider.submit': 'Connectar',
      'provider.cancel': 'Cancel·lar',
    },

    // Castellà
    es: {
      // Proveedor
      'provider.select': 'Seleccionar proveedor',
      'provider.name': 'Proveedor',
      'provider.credentials': 'Credenciales',
      'provider.module': 'Módulo',
      'provider.submit': 'Conectar',
      'provider.cancel': 'Cancelar',

      // Header
      'header.title': 'Moradoo Industrial Device Manager',
      'header.refresh': 'Refresco',
      'header.connect': 'Conectar',
      'header.login': 'Login'
    },


    // Anglès (fallback universal)
    en: {
      'provider.select': 'Select provider',
      'provider.name': 'Provider',
      'provider.credentials': 'Credentials',
      'provider.module': 'Module',
      'provider.submit': 'Connect',
      'provider.cancel': 'Cancel',
    },

    // Francès
    fr: {
      'provider.select': 'Sélectionner un fournisseur',
      'provider.name': 'Fournisseur',
      'provider.credentials': 'Identifiants',
      'provider.module': 'Module',
      'provider.submit': 'Connecter',
      'provider.cancel': 'Annuler',
    },

    // Japonès
    jp: {
      'provider.select': 'プロバイダーを選択',
      'provider.name': 'プロバイダー',
      'provider.credentials': '認証情報',
      'provider.module': 'モジュール',
      'provider.submit': '接続',
      'provider.cancel': 'キャンセル',
    },

    // Rus
    ru: {
      'provider.select': 'Выбрать провайдера',
      'provider.name': 'Провайдер',
      'provider.credentials': 'Данные',
      'provider.module': 'Модуль',
      'provider.submit': 'Подключиться',
      'provider.cancel': 'Отмена',
    },

    // Alemany
    de: {
      'provider.select': 'Anbieter auswählen',
      'provider.name': 'Anbieter',
      'provider.credentials': 'Zugangsdaten',
      'provider.module': 'Modul',
      'provider.submit': 'Verbinden',
      'provider.cancel': 'Abbrechen',
    },

    // Neerlandès (holandès)
    nl: {
      'provider.select': 'Provider selecteren',
      'provider.name': 'Provider',
      'provider.credentials': 'Inloggegevens',
      'provider.module': 'Module',
      'provider.submit': 'Verbinden',
      'provider.cancel': 'Annuleren',
    },

    // Coreà
    kr: {
      'provider.select': '공급자 선택',
      'provider.name': '공급자',
      'provider.credentials': '자격 증명',
      'provider.module': '모듈',
      'provider.submit': '연결',
      'provider.cancel': '취소',
    },

    // Italià
    it: {
      'provider.select': 'Seleziona fornitore',
      'provider.name': 'Fornitore',
      'provider.credentials': 'Credenziali',
      'provider.module': 'Modulo',
      'provider.submit': 'Connetti',
      'provider.cancel': 'Annulla',
    },

    // Portuguès
    pt: {
      'provider.select': 'Selecionar fornecedor',
      'provider.name': 'Fornecedor',
      'provider.credentials': 'Credenciais',
      'provider.module': 'Módulo',
      'provider.submit': 'Conectar',
      'provider.cancel': 'Cancelar',
    }
  };

  // Traducció
  t(key: string) {
  const current = this.currentLang();
  return (
    this.dictionaries[current][key] ??
    this.dictionaries['en'][key] ??
    key
  );
}


  // Canviar idioma
  setLang(code: LangCode) {
  this.currentLang.set(code);
}

  // Detectar idioma del dispositiu
  
detect() {
  const browserLang = navigator.language.split('-')[0];
  const available = Object.keys(this.dictionaries);

  if (available.includes(browserLang)) {
    this.currentLang.set(browserLang as LangCode);
  } else {
    this.currentLang.set('en');
  }
}

}
