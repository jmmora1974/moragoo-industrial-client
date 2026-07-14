import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BackendService {

  private token: string | null = null;
  private finger: string | null = null;

  setToken(t: string) { this.token = t; }
  clearToken() { this.token = null; }

  setFinger(f: string) { this.finger = f; }

  private buildHeaders(extra?: Record<string, string>) {
    return {
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(this.finger ? { 'x-finger': this.finger } : {}),
      ...(extra ?? {})
    };
  }

  async get(url: string, options?: { headers?: Record<string, string> }) {
    const res = await fetch(url, {
      method: 'GET',
      headers: this.buildHeaders(options?.headers)
    });
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  }

  async post(url: string, body: any, options?: { headers?: Record<string, string> }) {
    const res = await fetch(url, {
      method: 'POST',
      headers: this.buildHeaders({
        'Content-Type': 'application/json',
        ...(options?.headers ?? {})
      }),
      body: JSON.stringify(body)
    });
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  }
}
