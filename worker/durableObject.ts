import { DurableObject } from "cloudflare:workers";
import type { ProjectState, VmConfig, ClusterNode } from '@shared/types';
export class GlobalDurableObject extends DurableObject {
    async getProjectState(): Promise<ProjectState> {
      const state = await this.ctx.storage.get("project_state");
      const defaultState = this.getInitialState();
      if (state) {
        const current = state as ProjectState;
        // Migration logic for 150 checklist items
        if (!current.checklist || current.checklist.length < 150) {
          const newChecklist = new Array(150).fill(false);
          (current.checklist || []).forEach((v, i) => { if(i < 150) newChecklist[i] = v; });
          current.checklist = newChecklist;
        }
        if (!current.stepPriorities) current.stepPriorities = {};
        if (!current.codexUnlocked) current.codexUnlocked = [];
        return current;
      }
      await this.ctx.storage.put("project_state", defaultState);
      return defaultState;
    }
    private getInitialState(): ProjectState {
      return {
        checklist: new Array(150).fill(false),
        stepPriorities: {},
        storage: { win11: 200, kali: 100, fyde: 100, shared: 600 },
        vms: this.getDefaultVms(),
        nodes: this.getDefaultNodes(),
        apiConfig: { url: '', token: '', node: 'pve-imac-01' },
        hostStats: this.getMockStats(),
        sensors: [],
        orchestrationLog: ["System Initialized"],
        codexUnlocked: [],
        auth: { isAuthenticated: false, user: null },
        isoLibrary: [],
        visionarySessions: [],
        kyber: { enabled: false, keyStrength: 'Level1', lastRotation: new Date().toISOString() },
        usbLabel: 'PROXMOX',
        isoPath: 'C:\\ISOs',
        lastUpdated: new Date().toISOString()
      };
    }
    async batchUpdateChecklist(updates: { id: number, value: boolean }[]): Promise<ProjectState> {
      const state = await this.getProjectState();
      updates.forEach(u => {
        if (u.id >= 0 && u.id < 150) state.checklist[u.id] = u.value;
      });
      state.lastUpdated = new Date().toISOString();
      await this.ctx.storage.put("project_state", state);
      return state;
    }
    async toggleCodex(id: string): Promise<ProjectState> {
      const state = await this.getProjectState();
      const index = state.codexUnlocked.indexOf(id);
      if (index === -1) state.codexUnlocked.push(id);
      else state.codexUnlocked.splice(index, 1);
      state.lastUpdated = new Date().toISOString();
      await this.ctx.storage.put("project_state", state);
      return state;
    }
    private getDefaultNodes(): ClusterNode[] {
      return [
        { id: '1', name: 'pve-imac-01', status: 'online', cpu_usage: 12, mem_usage: 45, ip: '10.0.0.10' },
        { id: '2', name: 'pve-imac-02', status: 'online', cpu_usage: 5, mem_usage: 20, ip: '10.0.0.11' }
      ];
    }
    private getDefaultVms(): VmConfig[] {
      return [
        { vmid: 100, name: 'Win-11-Prod', cores: 4, memory: 8192, diskId: 'local-zfs', hasTpm: true, gpuPassthrough: true, status: 'stopped', node: 'pve-imac-01' },
      ];
    }
    private getMockStats() {
      return { cpu_usage: 12, mem_usage: 45, uptime: "4d 2h", zfs_health: 'ONLINE' as const, net_in: 0.5, net_out: 0.2 };
    }
    async updateProjectState(state: ProjectState): Promise<ProjectState> {
      const updated = { ...state, lastUpdated: new Date().toISOString() };
      await this.ctx.storage.put("project_state", updated);
      return updated;
    }
}