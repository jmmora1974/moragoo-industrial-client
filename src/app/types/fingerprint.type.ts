export interface FingerprintDios {
  machine: string;
  mac: string;
  uuid: string;
  cpu: string;
  disk: string;
  bios: string;
  motherboard: string;
  tpm: string;
  gpu: string;
  ram: string;
  os: string;
  arch: string;
  fingerprint: string;   // hash DIOS
  signature: string;     // firma RSA
  certificate: string;   // X.509 PEM
}




export interface LoginPayload {
    user: string;
  pass: string;
  provider: string;
  module?: string[];        // ← ARRAY
  domain: string;
  db?: string;
  url?: string;
  fingerprint: FingerprintDios;
}
