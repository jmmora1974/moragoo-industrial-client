export interface ProviderConfig {
  name: string;
  label: string;
  color?: string;
  icon?: string;
}


export interface ProviderField {
  id?: string;
  name: string;
  label?: string;
  type: string;
  placeholder?: string;
  required: boolean;
}

export interface ProviderInfo {
  id: string;
  label: string;
  type: string;
  activated: boolean;
  mode: string;
  fields: ProviderField[];
  domain: any;
  capabilities: any;
  metadata: any;
}