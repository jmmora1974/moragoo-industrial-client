
export interface SessionData {
  mode: 'guest' | 'authenticated';

  sessionName: string;

  fingerprint?: string;
  device?: string;
  platform?: string;
  version?: string;
  server?: string;
  network?: 'online' | 'offline';

  user?: string;
  token?: string;
  modules?: string[];
  rolesByModule?: Record<string, string[]>; // 🔥 nuevo
  provider?: string;
  email?: string;
  avatar?: string;
  permissions?: string[];
}