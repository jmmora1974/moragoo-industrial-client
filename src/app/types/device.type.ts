export interface DeviceItem {
  id: string;
  name: string;
  type: string;
  ip?: string;
  mac?: string;
  status: 'online' | 'offline' | 'unknown';
  owner?: string;
  shared?: boolean;
  
  // nuevas para PLCs 
  //  SZL (todos son objetos)
  cpu?: any;
  firmware?: any;
  hardware?: any;
  network?: any;
  diagnostic?: any;
  modules?: any;
  clock?: any;
  language?: any;
  lcd?: any;
  warnings?: any;
  startup?: any;
  io?:  any[] ;
  dbs?: any[];

}
