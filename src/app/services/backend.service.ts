import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BackendService {

  private token = "";
  private finger =signal("");

  setToken(t: string) {
     this.token=t; 
     console.log ("token actualizado "+t);  
  }
  clearToken() { 
    this.token="";
     console.log ("token borrado ");  
   }

  setFinger(f: string) {
     this.finger.set(f); 
     console.log ("finger actualizado "+ f);  
  }

  private buildHeaders(extra?: Record<string, string>) {
    return {
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(this.finger() ? { 'X-Fingerprint': this.finger() } : {}),
      ...(extra ?? {})
    };
  }

  async get(url: string, options?: { headers?: Record<string, string> }) {
     console.log("Res GET options: "+options);
     console.log("Res GET token: "+this.token);
     console.log("Res GET finger: "+this.finger());
    const res = await fetch(url, {
      method: 'GET',
      headers: this.buildHeaders(options?.headers)
    });
    console.log("Res GET: "+JSON.stringify(res.json));
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  }

  async post(url: string, body: any, options?: { headers?: Record<string, string> }) {
    console.log("Res POST options: "+options);
    const res = await fetch(url, {
      method: 'POST',
      headers: this.buildHeaders({
        'Content-Type': 'application/json',
        ...(options?.headers ?? {})
      }),
      body: JSON.stringify(body)
    });
     console.log("Res POST: "+JSON.stringify(res.json));
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  }
}
