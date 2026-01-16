export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export interface StorageConfig {
  win11: number;
  kali: number;
  fyde: number;
  shared: number;
}
export interface ProjectState {
  checklist: boolean[];
  storage: StorageConfig;
  lastUpdated: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}