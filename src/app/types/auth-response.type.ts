export interface AuthResponse {
  user: string;
  roles: string[];
  token: string;
  provider: string;
  module: string;
  email?: string;
  avatar?: string;
  permissions?: string[];
}
