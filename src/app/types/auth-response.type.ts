export interface AuthResponse {
  status: string;
  user: string;
  token: string;
  modules: string[];
  roles: Record<string, string[]>;
  provider?: string;
  email?: string;
  avatar?: string;
  permissions?: string[];
}

