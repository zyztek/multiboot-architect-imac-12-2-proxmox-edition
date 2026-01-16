import { DurableObject } from "cloudflare:workers";
import type { ProjectState, TimebendHistory, VmStatus } from '@shared/types';
import { MOCK_FLEET, MOCK_SNAPSHOTS } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    async getProjectState(): Promise<ProjectState> {
      const state = await this.ctx.storage.get("project_state");
      const defaultState = this.getInitialState();
      if (!state) {
        await this.ctx.storage.put("project_state", defaultState);
        return defaultState;
      }
      const current = state as ProjectState;
      // Consistency check for final phase
      if (!current.checklist || current.checklist.length < 300) {
        const expanded = new Array(300).fill(false);
        current.checklist?.forEach((v, i) => { if(i < 300) expanded[i] = v; });
        current.checklist = expanded;
      }
      if (!current.timebend) current.timebend = [];
      if (!current.oracleLog) current.oracleLog = ["Oracle Core Online"];
      if (!current.pwaState) current.pwaState = { isSynced: true, lastOfflineSync: new Date().toISOString() };
      if (!current.fleet) current.fleet = MOCK_FLEET;
      return current;
    }
    private getInitialState(): ProjectState {
      return {
        checklist: new Array(300).fill(false),
        stepPriorities: {},
        storage: { win11: 200, kali: 100, fyde: 100, shared: 600 },
        vms: [{ vmid: 100, name: 'Win-11-Prod', cores: 4, memory: 8192, diskId: 'local-zfs', hasTpm: true, gpuPassthrough: true, status: 'stopped', node: 'pve-imac-01' }],
        nodes: [{ id: '1', name: 'pve-imac-01', status: 'online', cpu_usage: 12, mem_usage: 45, ip: '10.0.0.10' }],
        fleet: MOCK_FLEET,
        snapshots: MOCK_SNAPSHOTS,
        timebend: [],
        oracleLog: ["Oracle Core Online"],
        singularity: { arEnabled: false, voiceActive: false, fleetMode: 'solo', exportProgress: 0, quantumEntropy: 0.12 },
        apiConfig: { url: '', token: '', node: 'pve-imac-01' },
        hostStats: { cpu_usage: 12, mem_usage: 45, uptime: "4d 2h", zfs_health: 'ONLINE', net_in: 0.5, net_out: 0.2 },
        orchestrationLog: ["Infinity Kernel Initialized"],
        codexUnlocked: [],
        auth: { isAuthenticated: false, user: null },
        pwaState: { isSynced: true, lastOfflineSync: new Date().toISOString() },
        lastUpdated: new Date().toISOString()
      };
    }
    async updateProjectState(state: ProjectState): Promise<ProjectState> {
      // Automatic history recording for Timebend
      const prevState = await this.ctx.storage.get("project_state") as ProjectState;
      if (prevState) {
        const history = prevState.timebend || [];
        const entry: TimebendHistory = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          label: `Auto-Sync ${history.length + 1}`,
          state: JSON.stringify(prevState)
        };
        state.timebend = [entry, ...history].slice(0, 50); // Keep last 50 states
      }
      state.lastUpdated = new Date().toISOString();
      await this.ctx.storage.put("project_state", state);
      return state;
    }
    async updateVmStatus(vmid: number, status: VmStatus): Promise<ProjectState> {
        const state = await this.getProjectState();
        const vm = state.vms.find(v => v.vmid === vmid);
        if (vm) {
            vm.status = status;
            state.orchestrationLog.push(`VM ${vmid} transition: ${status}`);
        }
        return await this.updateProjectState(state);
    }
    async recursiveRevert(historyId: string): Promise<ProjectState> {
      const state = await this.getProjectState();
      const entry = state.timebend.find(h => h.id === historyId);
      if (!entry) throw new Error("History point not found");
      const revertedState = JSON.parse(entry.state) as ProjectState;
      // Preserve the history list itself during revert
      revertedState.timebend = state.timebend;
      revertedState.orchestrationLog.push(`Timebend: Reverted to ${entry.timestamp}`);
      await this.ctx.storage.put("project_state", revertedState);
      return revertedState;
    }
    async batchUpdateChecklist(updates: { id: number, value: boolean }[]): Promise<ProjectState> {
      const state = await this.getProjectState();
      updates.forEach(u => {
        if (u.id >= 0 && u.id < 300) state.checklist[u.id] = u.value;
      });
      return await this.updateProjectState(state);
    }
    async singularityOneClick(): Promise<ProjectState> {
      const state = await this.getProjectState();
      state.checklist = new Array(300).fill(true);
      state.codexUnlocked = Array.from({ length: 300 }).map((_, i) => `cx-${i}`);
      state.orchestrationLog.push("Singularity Threshold: One-Click Batch Deployment Executed");
      return await this.updateProjectState(state);
    }
}