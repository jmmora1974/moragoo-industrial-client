export interface SessionData {
  user: string;
  roles: string[];
  token: string;
  provider: string;
  module: string;
  email?: string;
  avatar?: string;
  permissions?: string[];
}

