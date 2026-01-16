export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export type ScriptMode = 'usb' | 'zfs-setup' | 'vm-create';
export type VmStatus = 'running' | 'stopped' | 'paused' | 'unknown';
export interface ProxmoxHostStats {
  cpu_usage: number;
  mem_usage: number;
  uptime: string;
  zfs_health: 'ONLINE' | 'DEGRADED' | 'FAULTED';
  net_in: number;
  net_out: number;
}
export interface StorageConfig {
  win11: number;
  kali: number;
  fyde: number;
  shared: number;
}
export interface ApiConfig {
  url: string;
  token: string;
  node: string;
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
  ipAddress?: string;
  tags?: string[];
}
export interface AiArchitectRequest {
  goal: 'Workstation' | 'Server' | 'Gaming';
  ramGb: number;
  storageGb: number;
  extraNeeds: string[];
}
export interface AiArchitectResponse {
  recommendedVms: VmConfig[];
  zfsConfig: string;
  cliCommands: string[];
  reasoning: string;
}
export interface ProjectState {
  checklist: boolean[];
  storage: StorageConfig;
  vms: VmConfig[];
  apiConfig: ApiConfig;
  hostStats: ProxmoxHostStats;
  lastUpdated: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}