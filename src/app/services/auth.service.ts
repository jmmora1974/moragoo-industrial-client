import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  getProviders() {
    return this.http.get('/api/auth/providers');
  }

  loginUnified(payload: any) {
    return this.http.post('/api/auth/login', payload);
  }
}
