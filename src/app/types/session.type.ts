export interface SessionData {
  mode: 'guest' | 'authenticated';

  // Identidad de la sesión
  sessionName: string;     // 🔥 SIEMPRE existe

  // Datos base
  fingerprint: Record<string, any>;
  device?: string;
  platform?: string;
  version?: string;
  server?: string;
  network?: 'online' | 'offline';

  // Datos de autenticación
  user?: string;
  roles?: string[];
  token?: string;
  provider?: string;
  module?: string;
  email?: string;
  avatar?: string;
  permissions?: string[];
}
