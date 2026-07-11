import { MoragooDeviceInfo } from './device-info.type';
import { DeviceItem } from './device.type';
import { ProcessInfo } from './process.type';
import { TaskInfo } from './task.type';
import { AlertInfo } from './alert.type';

export interface MoragooState {
  status: 'ready' | 'loading' | 'error';
  provider: string | null;
  module: string;
  theme: 'industrial' | 'dark' | 'light';

  fingerprint: string;
  deviceInfo: MoragooDeviceInfo | null;
  networkStatus: 'online' | 'offline';

  devicesFound: DeviceItem[];
  devicesManaged: DeviceItem[];
  devicesShared: DeviceItem[];

  processes: ProcessInfo[];
  alerts: AlertInfo[];
  tasks: TaskInfo[];

  logs: string[];
}
