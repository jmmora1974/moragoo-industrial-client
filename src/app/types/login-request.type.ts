export interface LoginRequest {
  user: string;
  pass: string;
  provider: string;
  module?: string[];        // ← ARRAY
  domain: string;
  db?: string;
  url?: string;
  fingerprint: Record<string, any>;
}
