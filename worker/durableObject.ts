import { DurableObject } from "cloudflare:workers";
import type { DemoItem, ProjectState, VmConfig } from '@shared/types';
import { MOCK_ITEMS } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    async getProjectState(): Promise<ProjectState> {
      const state = await this.ctx.storage.get("project_state");
      if (state) {
        const current = state as ProjectState;
        // Migration/Consistency Check
        if (!current.apiConfig) current.apiConfig = { url: '', token: '', node: 'pve-imac' };
        if (!current.hostStats) current.hostStats = this.getMockStats();
        if (!current.vms) current.vms = this.getDefaultVms();
        return current;
      }
      const defaultState: ProjectState = {
        checklist: new Array(20).fill(false),
        storage: { win11: 200, kali: 100, fyde: 100, shared: 600 },
        vms: this.getDefaultVms(),
        apiConfig: { url: '', token: '', node: 'pve-imac' },
        hostStats: this.getMockStats(),
        lastUpdated: new Date().toISOString()
      };
      await this.ctx.storage.put("project_state", defaultState);
      return defaultState;
    }
    private getDefaultVms(): VmConfig[] {
      return [
        { vmid: 100, name: 'Windows-11-Prod', cores: 4, memory: 8192, diskId: 'local-zfs', hasTpm: true, gpuPassthrough: true, status: 'stopped' },
        { vmid: 101, name: 'Kali-Security-Lab', cores: 2, memory: 4096, diskId: 'local-zfs', hasTpm: false, gpuPassthrough: false, status: 'stopped' },
        { vmid: 102, name: 'openFyde-OS', cores: 2, memory: 4096, diskId: 'local-zfs', hasTpm: false, gpuPassthrough: false, status: 'stopped' },
      ];
    }
    private getMockStats() {
      return {
        cpu_usage: 12.5,
        mem_usage: 45.2,
        uptime: "0 days, 2 hours",
        zfs_health: 'ONLINE' as const,
        net_in: 0.5,
        net_out: 0.2
      };
    }
    async updateProjectState(state: ProjectState): Promise<ProjectState> {
      const updated = { 
        ...state, 
        lastUpdated: new Date().toISOString() 
      };
      await this.ctx.storage.put("project_state", updated);
      return updated;
    }
    async updateHostStats(): Promise<ProjectState> {
      const state = await this.getProjectState();
      state.hostStats = {
        ...state.hostStats,
        cpu_usage: Math.random() * 40 + 5,
        net_in: state.hostStats.net_in + Math.random() * 2,
        net_out: state.hostStats.net_out + Math.random() * 2
      };
      return await this.updateProjectState(state);
    }
    async getDemoItems(): Promise<DemoItem[]> {
      const items = await this.ctx.storage.get("demo_items");
      if (items) return items as DemoItem[];
      await this.ctx.storage.put("demo_items", MOCK_ITEMS);
      return MOCK_ITEMS;
    }
    async addDemoItem(item: DemoItem): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = [...items, item];
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
}