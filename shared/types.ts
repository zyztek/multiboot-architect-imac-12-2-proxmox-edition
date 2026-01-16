export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export type ScriptMode = 'usb' | 'zfs-setup' | 'vm-create' | 'terraform' | 'helm' | 'opencore' | 'ventoy-god';
export type VmStatus = 'running' | 'stopped' | 'paused' | 'unknown';
export interface CodexItem {
  id: string;
  category: 'Robust' | 'USB' | 'VM' | 'Visionary' | 'AI' | 'Galaxy';
  title: string;
  description: string;
  complexity: 'Standard' | 'Advanced' | 'Elite' | 'God';
  cmd?: string;
}
export interface AuthUser {
  id: string;
  username: string;
  role: 'admin' | 'guest';
  token?: string;
}
export interface StorageConfig {
  win11: number;
  kali: number;
  fyde: number;
  shared: number;
}
export interface VmConfig {
  vmid: number;
  name: string;
  cores: number;
  memory: number;
  diskId: string;
  hasTpm: boolean;
  gpuPassthrough: boolean;
  status?: VmStatus;
  node?: string;
  tags?: string[];
}
export interface ProjectState {
  checklist: boolean[];
  storage: StorageConfig;
  vms: VmConfig[];
  nodes: any[];
  apiConfig: any;
  hostStats: any;
  sensors: any[];
  orchestrationLog: string[];
  codexUnlocked: string[];
  isSimulatingUsb: boolean;
  auth: {
    isAuthenticated: boolean;
    user: AuthUser | null;
  };
  usbLabel?: string;
  isoPath?: string;
  lastUpdated: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}