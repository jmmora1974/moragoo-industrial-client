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
    // Proveïdor
    'provider.select': 'Seleccionar proveïdor',
    'provider.name': 'Proveïdor',
    'provider.credentials': 'Credencials',
    'provider.module': 'Mòdul',
    'provider.submit': 'Connectar',
    'provider.cancel': 'Cancel·lar',
    'providers.error.load': 'No s’ha pogut carregar la llista de proveïdors.',
    'providers.error.server': 'El servidor no respon. Activant mode PINX local.',
    'providers.loaded.ok': 'Proveïdors carregats correctament.',
    'providers.loaded.count': 'S’han carregat {count} proveïdors.',
    'providers.loaded.fallback': 'Mode PINX local activat correctament.',
    

    // Header
    'header.title': 'Moragoo Industrial Administrador de Dispositius',
    'header.refresh': 'Refrescar',
    'header.connect': 'Connectar',
    'header.login': 'Login',

    // Missatges d’autenticació i sessió
    'auth.error.response': 'Resposta d’autenticació no vàlida.',
    'auth.success': 'Autenticació completada correctament.',
    'auth.success.welcome': 'Benvingut/da, {user}.',
    'auth.success.roles': 'Rols assignats correctament.',

    'session.error.not_started': 'La sessió no s’ha iniciat.',
    
    'session.started': 'Sessió iniciada en mode consulta.',
    'session.started.fingerprint': 'Fingerprint generat correctament.',
    'session.started.device': 'Informació del dispositiu carregada.',

    'general.success.operation': 'Operació completada correctament.',
    'general.success.saved': 'Dades guardades correctament.',
    'general.success.updated': 'Actualització completada.',


    // Dispositius
    'device.fingerprint.generated': 'Fingerprint generat',
    'device.info.loaded': 'Dispositiu carregat',

    // Estat general
    'status': 'Estat',

    // Estat del servidor
    'server.status': 'Estat del servidor',
    'server.status.online': 'En línia',
    'server.status.offline': 'Fora de línia',
    'server.status.checking': 'Comprovant',
    'server.status.unknown': 'Desconegut',
    'server.config.saved': 'Configuració del servidor guardada correctament.',
    'server.config.detected': 'Servidor detectat correctament.',
    'server.config.scanned': 'Escaneig de xarxa completat.',
    'server.config': 'Configuració del servidor',
    'server.host': 'Adreça del servidor',
    'server.port': 'Port',
    'server.search': 'Cercar servidor',
    'server.connect': 'Connectar',

    // Xarxa
    'network.online': 'En línia',
    'network.offline': 'Fora de línia',

    // General
    'general.close': 'Tancar',
    'general.error': 'Error',
    'general.success': 'Èxit'
},

    // Castellà
    es: {
      //Genericas
      "generic.ok": "OK",
      "generic.ko": "Error",
      "generic.status": "Estado",
      "generic.name": "Nombre",
      "generic.user": "Usuario",
      "generic.role": "Rol",
      "generic.provider": "Proveedor",
      "generic.server": "Servidor",
      "generic.connected": "Conectado",
      "generic.disconnected": "Desconectado",
      "generic.login": "Login",
      "generic.logout": "Logout",

      //Login
      "log.login_ok": "Login correcto",
      "log.login_fail": "Login fallido",
      "log.provider_selected": "Proveedor seleccionado",
      "log.server_connected": "Servidor conectado",
      "log.server_disconnected": "Servidor desconectado",
      "log.provider_fail": "Error con el proveedor",
      "log.server_fail": "Error de conexión con el servidor",
      "log.credentials_invalid": "Credenciales inválidas",
      "log.unexpected_error": "Error inesperado",

      //Logs
      "log.session_saved": "Sesión guardada",
      "log.session_loaded": "Sesión cargada",
      "log.session_not_found": "No hay sesión persistida",
      "log.session_invalid": "Sesión persistida inválida",
      "log.session_load_error": "Error cargando la sesión persistida",
      "log.session_cleared": "Sesión eliminada",
      "log.session_reset": "Sesión reiniciada",
      "log.session_started": "Sesión iniciada",


      // Proveedor
      'provider.select': 'Seleccionar proveedor',
      'provider.name': 'Proveedor',
      'provider.credentials': 'Credenciales',
      'provider.module': 'Módulo',
      'provider.submit': 'Conectar',
      'provider.cancel': 'Cancelar',
      'providers.error.load': 'No se pudo cargar la lista de proveedores.',
      'providers.error.server': 'El servidor no responde. Activando modo PINX local.',
      'providers.loaded.ok': 'Proveedores cargados correctamente.',
      'providers.loaded.count': 'Se han cargado {count} proveedores.',
      'providers.loaded.fallback': 'Modo PINX local activado correctamente.',


      // Header
      'header.title': 'Moragoo Industrial Device Manager',
      'header.refresh': 'Refresco',
      'header.connect': 'Conectar',
      'header.login': 'Login',

      // Mensajes de autenticación y sesión
      'auth.error.response': 'Respuesta de autenticación inválida.',
      'auth.success': 'Autenticación completada correctamente.',
      'auth.success.welcome': 'Bienvenido, {user}.',
      'auth.success.roles': 'Roles asignados correctamente.',

      'session.error.not_started': 'La sesión no ha sido iniciada.',
      'session.started': 'Sesión iniciada en modo consulta.',
      'session.started.fingerprint': 'Fingerprint generado correctamente.',
      'session.started.device': 'Información del dispositivo cargada.',

      'general.success.operation': 'Operación completada correctamente.',
      'general.success.saved': 'Datos guardados correctamente.',
      'general.success.updated': 'Actualización completada.',


      // Dispositivos
      'device.fingerprint.generated': 'Fingerprint generado',
      'device.info.loaded': 'Dispositivo cargado',

      // Estado general
      'status': 'Estado',

      // Estado del servidor
      'server.status': 'Estado del servidor',
      'server.status.online': 'En línea',
      'server.status.offline': 'Fuera de línea',
      'server.status.checking': 'Comprobando',
      'server.status.unknown': 'Desconocido',
      'server.config.saved': 'Configuración del servidor guardada correctamente.',
      'server.config.detected': 'Servidor detectado correctamente.',
      'server.config.scanned': 'Escaneo de red completado.',
      'server.config': 'Configuración del servidor',
      'server.host': 'Dirección del servidor',
      'server.port': 'Puerto',
      'server.search': 'Buscar servidor',
      'server.connect': 'Conectar',


      // Red
      'network.online': 'En línea',
      'network.offline': 'Fuera de línea',

      // General
      'general.close': 'Cerrar',
      'general.error': 'Error',
      'general.success': 'Éxito'
    },


    // Anglès (fallback universal)
    en: {
      // Provider
      'provider.select': 'Select provider',
      'provider.name': 'Provider',
      'provider.credentials': 'Credentials',
      'provider.module': 'Module',
      'provider.submit': 'Connect',
      'provider.cancel': 'Cancel',
      'providers.error.load': 'Unable to load provider list.',
      'providers.error.server': 'Server not responding. Activating local PINX mode.',
      'providers.loaded.ok': 'Providers loaded successfully.',
      'providers.loaded.count': '{count} providers loaded.',
      'providers.loaded.fallback': 'Local PINX mode activated successfully.',


      // Header
      'header.title': 'Moragoo Industrial Device Manager',
      'header.refresh': 'Refresh',
      'header.connect': 'Connect',
      'header.login': 'Login',

      // Messages
      'auth.error.response': 'Invalid authentication response.',
      'session.error.not_started': 'Session not started.',
      'auth.success': 'Authentication completed successfully.',
      'auth.success.welcome': 'Welcome, {user}.',
      'auth.success.roles': 'Roles assigned successfully.',
      'session.started': 'Session started in guest mode.',
      'session.started.fingerprint': 'Fingerprint generated successfully.',
      'session.started.device': 'Device information loaded.',
      'general.success.operation': 'Operation completed successfully.',
      'general.success.saved': 'Data saved successfully.',
      'general.success.updated': 'Update completed.',
      

      // Devices
      'device.fingerprint.generated': 'Fingerprint generated',
      'device.info.loaded': 'Device loaded',

      // Status
      'status': 'Status',

      // Server status
      'server.status': 'Server status',
      'server.status.online': 'Online',
      'server.status.offline': 'Offline',
      'server.status.checking': 'Checking',
      'server.status.conecting': 'Connecting',
      'server.status.unknown': 'Unknown',
      'server.config.saved': 'Server configuration saved successfully.',
      'server.config.detected': 'Server detected successfully.',
      'server.config.scanned': 'Network scan completed.',
      'server.config': 'Server configuration',
      'server.host': 'Server address',
      'server.port': 'Port',
      'server.search': 'Search server',
      'server.connect': 'Connect',

      // Network
      'network.online': 'Online',
      'network.offline': 'Offline',

      // General
      'general.close': 'Close',
      'general.error': 'Error',
      'general.success': 'Success'
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
