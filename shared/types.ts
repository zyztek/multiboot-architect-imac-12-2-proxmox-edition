export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export type ScriptMode = 'usb' | 'zfs-setup' | 'vm-create' | 'terraform' | 'helm' | 'opencore' | 'ventoy-god' | 'singularity-export' | 'infinity-batch' | 'wiki-gen' | 'project-gen';
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
export interface OracleMetrics {
  chaosProbability: number;
  thermalSaturation: number;
  instabilityWarnings: string[];
  costEstimate: number;
  efficiencyScore: number;
}
export interface AiArchitectResponse {
  recommendedVms: VmConfig[];
  zfsConfig: string;
  cliCommands: string[];
  reasoning: string;
  prediction: string;
  oracleMetrics?: OracleMetrics;
}
export interface TimebendHistory {
  id: string;
  timestamp: string;
  label: string;
  state: string; // JSON stringified state
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
  category: 'Visionary' | 'Robust' | 'VM' | 'AI' | 'Galaxy' | 'Singularity' | 'Quantum' | 'Meta' | 'Bend' | 'Evolved';
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
  checklistState: boolean[] | string;
  label: string;
}
export interface SingularityConfig {
  arEnabled: boolean;
  voiceActive: boolean;
  fleetMode: 'solo' | 'swarm' | 'hive';
  exportProgress: number;
  quantumEntropy: number;
  swarmIntegrity: number;
  lastEndgameSync: string;
  isAlive: boolean;
  lastEvolution: string;
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
  checklist: boolean[]; // Note: Persisted as Base64 string in DO storage, but used as boolean array in runtime
  stepPriorities: Record<number, number>;
  storage: StorageConfig;
  vms: VmConfig[];
  nodes: ClusterNode[];
  fleet: FleetNode[];
  snapshots: Snapshot[];
  timebend: TimebendHistory[];
  oracleLog: string[];
  singularity: SingularityConfig;
  customCodex: CodexItem[];
  evolutionQueue: string[];
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
  pwaState: {
    isSynced: boolean;
    lastOfflineSync: string;
  };
  isDegraded?: boolean;
  lastUpdated: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}