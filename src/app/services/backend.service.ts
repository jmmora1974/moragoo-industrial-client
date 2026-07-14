import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BackendService {

  async get(url: string, options?: { headers?: Record<string, string> }) {
    const res = await fetch(url, {
      method: 'GET',
      headers: options?.headers ?? {}
    });

    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  
  async post(url: string, body: any, options?: { headers?: Record<string, string> }) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {})
      },
      body: JSON.stringify(body)
    });

    const text = await res.text();

    try {
      return JSON.parse(text);   // 🔥 si es JSON, lo parsea
    } catch {
      return text;               // 🔥 si no es JSON, devuelve texto plano
    }
  }

}
