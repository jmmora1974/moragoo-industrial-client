import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BackendService {

  private token = "";
  private finger = "";
  private baseUrl = "";   // ⭐ Aquí guardamos la URL base

  // ---------------------------------------------------------
  // BASE URL
  // ---------------------------------------------------------

  setBaseUrl(url: string) {
    this.baseUrl = url;
    console.log("Backend base URL configurada: " + url);
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  // ---------------------------------------------------------
  // TOKEN / FINGERPRINT
  // ---------------------------------------------------------

  setToken(t: string) {
    this.token = t;
    console.log("token actualizado " + t);
  }

  clearToken() {
    this.token = "";
    console.log("token borrado");
  }

  setFinger(f: string) {
    this.finger = f;
    console.log("finger actualizado " + f);
  }

  // ---------------------------------------------------------
  // HEADERS
  // ---------------------------------------------------------

  private buildHeaders(extra?: Record<string, string>) {
    return {
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(this.finger ? { 'X-Fingerprint': this.finger } : {}),
      ...(extra ?? {})
    };
  }

  // ---------------------------------------------------------
  // GET
  // ---------------------------------------------------------

  async get<T>(path: string, options?: { headers?: Record<string, string> }): Promise<T> {
    const url = this.baseUrl + path;
    console.log("GET url : "+JSON.stringify(url));

    const res = await fetch(url, {
      method: 'GET',
      headers: this.buildHeaders(options?.headers)
    });

    const text = await res.text();
    let data: any;
    console.log("GET res : "+JSON.stringify(res));
    try { data = JSON.parse(text); }
    catch { data = text; }

    if (!res.ok) {
      throw new Error(data?.error ?? 'backend_error');
    }
    console.log("GET data : "+JSON.stringify(data));
    return data as T;
  }

  // ---------------------------------------------------------
  // POST
  // ---------------------------------------------------------

  async post<T>(path: string, body: any, options?: { headers?: Record<string, string> }): Promise<T> {
    const url = this.baseUrl + path;

    console.log("PL Body: " + JSON.stringify(body));
    console.log("PL options: " + JSON.stringify(options));
    console.log("PL finger: " + this.finger);
    console.log("PL token: " + this.token);

    const headers = this.buildHeaders({
      'Content-Type': 'application/json',
      ...(options?.headers ?? {})
    });

    console.log("PL headers: " + JSON.stringify(headers));

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const text = await res.text();
    let data: any;

    try { data = JSON.parse(text); }
    catch { data = text; }

    console.log("RESPUEST POST : " + JSON.stringify(data));

    if (!res.ok) {
      throw new Error(data?.error ?? 'backend_error');
    }

    if (data?.status === 'error') {
      throw new Error(data?.error ?? 'auth_failed');
    }

    return data as T;
  }
}
