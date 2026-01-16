export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export type ScriptMode = 'usb' | 'zfs-setup' | 'vm-create' | 'terraform' | 'helm' | 'opencore' | 'ventoy-god' | 'singularity-export';
export type VmStatus = 'running' | 'stopped' | 'paused' | 'unknown';
export interface AuthUser {
  id: string;
  username: string;
  role: string;
}
export interface IsoMetadata {
  id: string;
  filename: string;
  size: number;
  detectedOs: string;
  architecture: string;
  format: 'iso' | 'qcow2' | 'vmdk' | 'raw' | 'ova';
  status: 'available' | 'downloading' | 'corrupt';
}
export interface AiArchitectRequest {
  goal: 'Workstation' | 'Server' | 'Lab';
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
export interface ConsoleSession {
  id: string;
  vmid: number;
  protocol: 'vnc' | 'spice' | 'rdp';
  token: string;
  resolution: string;
}
export interface CodexItem {
  id: string;
  category: 'Visionary' | 'Robust' | 'VM' | 'AI' | 'Galaxy' | 'Singularity';
  title: string;
  description: string;
  complexity: 'Standard' | 'Advanced' | 'Elite' | 'God' | 'Singularity';
  cmd?: string;
  isUnlocked?: boolean;
}
export interface DeploymentStep {
  id: number;
  title: string;
  category: string;
  desc: string;
  requires?: number[];
  priority?: number;
}
export interface FleetNode {
  id: string;
  name: string;
  ip: string;
  load: number;
  status: 'online' | 'syncing' | 'offline';
  isLeader: boolean;
}
export interface Snapshot {
  id: string;
  timestamp: string;
  checklistState: boolean[];
  label: string;
}
export interface SingularityConfig {
  arEnabled: boolean;
  voiceActive: boolean;
  fleetMode: 'solo' | 'swarm' | 'hive';
  exportProgress: number;
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
export interface ProjectState {
  checklist: boolean[];
  stepPriorities: Record<number, number>;
  storage: StorageConfig;
  vms: VmConfig[];
  nodes: ClusterNode[];
  fleet: FleetNode[];
  snapshots: Snapshot[];
  singularity: SingularityConfig;
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
  orchestrationLog: string[];
  codexUnlocked: string[];
  auth: {
    isAuthenticated: boolean;
    user: AuthUser | null;
  };
  lastUpdated: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}