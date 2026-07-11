export interface AlertInfo {
  id: string;
  message: string;
  level: 'info' | 'warning' | 'critical';
  deviceId?: string;
  timestamp: string;
}
