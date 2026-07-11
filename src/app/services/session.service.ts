import { Injectable, signal } from '@angular/core';
import { SessionData } from '../types/session.type';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  session = signal<SessionData | null>(null);

  setSession(data: SessionData) {
    this.session.set(data);
  }

  clear() {
    this.session.set(null);
  }
}
