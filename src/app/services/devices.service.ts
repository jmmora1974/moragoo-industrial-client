import { Injectable, inject } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable({ providedIn: 'root' })
export class DevicesService {

  private backend = inject(BackendService);

  getFound() {
    return this.backend.get('/api/devices/found');
  }

  getShared() {
    return this.backend.get('/api/devices/shared');
  }

  getAll() {
    return this.backend.get('/api/devices/all');
  }

  getState() {
    return this.backend.get('/api/devices/state');
  }

  writeOutput(payload: any) {
    return this.backend.post('/api/devices/write', payload);
  }
}
