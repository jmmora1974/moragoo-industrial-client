import { Injectable, inject } from '@angular/core';
import { SessionService } from './session.service';
import { MoragooService } from './moragoo.service';

@Injectable({ providedIn: 'root' })
export class BackendService {

  private session = inject(SessionService);
  private moragoo = inject(MoragooService);

  private get baseUrl() {
    return this.moragoo.MoragooServerUrl();
  }

  private get headers() {
    const s = this.session.session();

    // fingerprint DIOS siempre como string
    const fpObj = s.fingerprint || this.moragoo.fingerprint() || null;

    // TS exige index signature
    const fp = fpObj?.['fingerprint'] ?? '';

    const token = s.token || '';

    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'X-Fingerprint': fp,   // 🔥 SIEMPRE string
    };
    }




  // ---------------------------------------------------------
  // GET
  // ---------------------------------------------------------
  async get(path: string) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.headers
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  // ---------------------------------------------------------
  // POST
  // ---------------------------------------------------------
  async post(path: string, body: any) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}
