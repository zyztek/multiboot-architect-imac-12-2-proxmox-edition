export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export type ScriptMode = 'usb' | 'zfs-setup' | 'vm-create' | 'terraform' | 'helm' | 'opencore' | 'ventoy-god';
export type VmStatus = 'running' | 'stopped' | 'paused' | 'unknown';
export interface CodexItem {
  id: string;
  category: 'Visionary' | 'Robust' | 'VM' | 'AI' | 'Galaxy';
  title: string;
  description: string;
  complexity: 'Standard' | 'Advanced' | 'Elite' | 'God';
  cmd?: string;
  isUnlocked?: boolean;
}
export interface DeploymentStep {
  id: number;
  title: string;
  category: string;
  desc: string;
  requires?: number[]; // Array of step IDs that must be completed first
  priority?: number; // User priority score
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
export interface ClusterNode {
  id: string;
  name: string;
  status: 'online' | 'offline';
  cpu_usage: number;
  mem_usage: number;
  ip: string;
}
export interface SensorData {
  temp_cpu: number;
  temp_gpu: number;
  fan_speed: number;
  power_draw: number;
  timestamp: string;
}
export interface IsoMetadata {
  id: string;
  filename: string;
  size: number;
  detectedOs: string;
  architecture: 'amd64' | 'arm64';
  format: 'iso' | 'qcow2' | 'vmdk' | 'raw' | 'ova';
  status: 'available' | 'downloading' | 'failed';
}
export interface ConsoleSession {
  vmid: number;
  name: string;
  type: 'noVNC' | 'spice' | 'xtermjs';
  url: string;
  token: string;
}
export interface KyberConfig {
  enabled: boolean;
  keyStrength: 'Level1' | 'Level2' | 'Level3';
  lastRotation: string;
}
export interface AiArchitectRequest {
  goal: 'Workstation' | 'Gaming' | 'Server' | 'Lab';
  ramGb: number;
  storageGb: number;
}
export interface AiArchitectResponse {
  recommendedVms: VmConfig[];
  zfsConfig: string;
  cliCommands: string[];
  reasoning: string;
  prediction: string;
}
export interface ProjectState {
  checklist: boolean[];
  stepPriorities: Record<number, number>;
  storage: StorageConfig;
  vms: VmConfig[];
  nodes: ClusterNode[];
  apiConfig: {
    url: string;
    token: string;
    node: string;
  };
  hostStats: {
    cpu_usage: number;
    mem_usage: number;
    uptime: string;
    zfs_health: 'ONLINE' | 'DEGRADED' | 'FAULTED';
    net_in: number;
    net_out: number;
  };
  sensors: SensorData[];
  orchestrationLog: string[];
  codexUnlocked: string[];
  isoLibrary: IsoMetadata[];
  visionarySessions: ConsoleSession[];
  kyber: KyberConfig;
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