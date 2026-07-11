export interface ProcessInfo {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  cpu?: number;
  memory?: number;
  deviceId?: string;
}
