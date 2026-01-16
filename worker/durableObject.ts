import { DurableObject } from "cloudflare:workers";
import type { ProjectState, ClusterNode, FleetNode, Snapshot } from '@shared/types';
import { MOCK_FLEET, MOCK_SNAPSHOTS } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    async getProjectState(): Promise<ProjectState> {
      const state = await this.ctx.storage.get("project_state");
      const defaultState = this.getInitialState();
      if (state) {
        const current = state as ProjectState;
        // Migration logic for 300 checklist items
        if (!current.checklist || current.checklist.length < 300) {
          const newChecklist = new Array(300).fill(false);
          (current.checklist || []).forEach((v, i) => { if(i < 300) newChecklist[i] = v; });
          current.checklist = newChecklist;
        }
        if (!current.fleet) current.fleet = MOCK_FLEET;
        if (!current.snapshots) current.snapshots = MOCK_SNAPSHOTS;
        if (!current.singularity) current.singularity = defaultState.singularity;
        return current;
      }
      await this.ctx.storage.put("project_state", defaultState);
      return defaultState;
    }
    private getInitialState(): ProjectState {
      return {
        checklist: new Array(300).fill(false),
        stepPriorities: {},
        storage: { win11: 200, kali: 100, fyde: 100, shared: 600 },
        vms: [
          { vmid: 100, name: 'Win-11-Prod', cores: 4, memory: 8192, diskId: 'local-zfs', hasTpm: true, gpuPassthrough: true, status: 'stopped', node: 'pve-imac-01' }
        ],
        nodes: [
          { id: '1', name: 'pve-imac-01', status: 'online', cpu_usage: 12, mem_usage: 45, ip: '10.0.0.10' }
        ],
        fleet: MOCK_FLEET,
        snapshots: MOCK_SNAPSHOTS,
        singularity: { arEnabled: false, voiceActive: false, fleetMode: 'solo', exportProgress: 0 },
        apiConfig: { url: '', token: '', node: 'pve-imac-01' },
        hostStats: { cpu_usage: 12, mem_usage: 45, uptime: "4d 2h", zfs_health: 'ONLINE', net_in: 0.5, net_out: 0.2 },
        orchestrationLog: ["Singularity Kernel Initialized"],
        codexUnlocked: [],
        auth: { isAuthenticated: false, user: null },
        lastUpdated: new Date().toISOString()
      };
    }
    async updateProjectState(state: ProjectState): Promise<ProjectState> {
      const updated = { ...state, lastUpdated: new Date().toISOString() };
      await this.ctx.storage.put("project_state", updated);
      return updated;
    }
    async createSnapshot(label: string): Promise<ProjectState> {
      const state = await this.getProjectState();
      const newSnapshot: Snapshot = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        checklistState: [...state.checklist],
        label
      };
      state.snapshots.push(newSnapshot);
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
    async batchUpdateChecklist(updates: { id: number, value: boolean }[]): Promise<ProjectState> {
      const state = await this.getProjectState();
      updates.forEach(u => {
        if (u.id >= 0 && u.id < 300) state.checklist[u.id] = u.value;
      });
      state.lastUpdated = new Date().toISOString();
      await this.ctx.storage.put("project_state", state);
      return state;
    }
}