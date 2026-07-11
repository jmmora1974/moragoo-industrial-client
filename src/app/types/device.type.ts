export interface DeviceItem {
  id: string;
  name: string;
  type: string;
  ip?: string;
  mac?: string;
  status: 'online' | 'offline' | 'unknown';
  owner?: string;
  shared?: boolean;
}
