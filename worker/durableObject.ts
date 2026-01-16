import { DurableObject } from "cloudflare:workers";
import type { ProjectState, TimebendHistory, VmStatus, CodexItem } from '@shared/types';
import { MOCK_FLEET, MOCK_SNAPSHOTS } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    private packChecklist(checklist: boolean[]): string {
        try {
            const bits = new Uint8Array(38);
            for (let i = 0; i < 300; i++) {
                const byte = Math.floor(i / 8);
                const bit = i % 8;
                if (checklist[i]) {
                    bits[byte] |= (1 << bit);
                }
            }
            return btoa(String.fromCharCode(...bits));
        } catch (e) {
            console.error("[DO ERROR] packChecklist failed", e);
            return "";
        }
    }
    private unpackChecklist(packed: string): boolean[] {
        try {
            if (!packed) return new Array(300).fill(false);
            const binaryString = atob(packed);
            const bits = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bits[i] = binaryString.charCodeAt(i);
            }
            const checklist = new Array(300).fill(false);
            for (let i = 0; i < 300; i++) {
                const byte = Math.floor(i / 8);
                const bit = i % 8;
                if (byte < bits.length) {
                    checklist[i] = !!(bits[byte] & (1 << bit));
                }
            }
            return checklist;
        } catch (e) {
            console.error("[DO ERROR] unpackChecklist failed, falling back to empty state", e);
            return new Array(300).fill(false);
        }
    }
    async getProjectState(): Promise<ProjectState> {
      try {
        const state = await this.ctx.storage.get("project_state");
        const defaultState = this.getInitialState();
        if (!state) {
          console.warn("[DO INFO] No state found, initializing default kernel.");
          await this.ctx.storage.put("project_state", defaultState);
          return defaultState;
        }
        const current = state as ProjectState;
        if (typeof current.checklist === 'string') {
          current.checklist = this.unpackChecklist(current.checklist);
        }
        if (current.snapshots) {
          for (const snap of current.snapshots) {
            if (typeof snap.checklistState === 'string') {
              snap.checklistState = this.unpackChecklist(snap.checklistState);
            }
          }
        }
        if (!current.checklist || !Array.isArray(current.checklist)) {
          current.checklist = new Array(300).fill(false);
        }
        current.timebend = current.timebend?.slice(-10) ?? [];
        current.oracleLog = current.oracleLog?.slice(-15) ?? ["Oracle Core Online"];
        current.evolutionQueue = current.evolutionQueue ?? [];
        current.customCodex = current.customCodex ?? [];
        current.isDegraded = false;
        return current;
      } catch (e) {
        console.error("[DO FATAL] getProjectState crashed", e);
        const fallback = this.getInitialState();
        fallback.isDegraded = true;
        return fallback;
      }
    }
    private getInitialState(): ProjectState {
      return {
        checklist: new Array(300).fill(false),
        stepPriorities: {},
        storage: { win11: 200, kali: 100, fyde: 100, shared: 600 },
        vms: [{ vmid: 100, name: 'Win-11-Prod', cores: 4, memory: 8192, diskId: 'local-zfs', hasTpm: true, gpuPassthrough: true, status: 'stopped', node: 'pve-imac-01' }],
        nodes: [{ id: '1', name: 'pve-imac-01', status: 'online', cpu_usage: 12, mem_usage: 45, ip: '10.0.0.10' }],
        fleet: MOCK_FLEET.slice(0, 10),
        snapshots: MOCK_SNAPSHOTS.slice(0, 5),
        timebend: [],
        oracleLog: ["Oracle Core Online"],
        singularity: { arEnabled: false, voiceActive: false, fleetMode: 'solo', exportProgress: 0, quantumEntropy: 0.12, swarmIntegrity: 1.0, lastEndgameSync: new Date().toISOString(), isAlive: true, lastEvolution: new Date().toISOString() },
        customCodex: [],
        evolutionQueue: [],
        apiConfig: { url: '', token: '', node: 'pve-imac-01' },
        hostStats: { cpu_usage: 12, mem_usage: 45, uptime: "4d 2h", zfs_health: 'ONLINE', net_in: 0.5, net_out: 0.2 },
        orchestrationLog: ["Infinity Kernel Initialized"],
        codexUnlocked: [],
        auth: { isAuthenticated: false, user: null },
        pwaState: { isSynced: true, lastOfflineSync: new Date().toISOString() },
        isDegraded: false,
        lastUpdated: new Date().toISOString()
      };
    }
    async updateProjectState(state: ProjectState): Promise<ProjectState> {
      try {
        const prevState = await this.ctx.storage.get("project_state") as ProjectState;
        if (prevState) {
          const entry: TimebendHistory = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            label: `Auto-Sync ${prevState.timebend?.length || 0}`,
            state: JSON.stringify({ ...prevState, timebend: [], snapshots: [] })
          };
          state.timebend = [entry, ...(prevState.timebend || [])].slice(0, 10);
        }
        state.lastUpdated = new Date().toISOString();
        const storedState = structuredClone(state) as any;
        storedState.checklist = this.packChecklist(state.checklist);
        await this.ctx.storage.put("project_state", storedState);
        return state;
      } catch (e) {
        console.error("[DO ERROR] updateProjectState failed", e);
        return state;
      }
    }
    async addCustomCodexItem(item: CodexItem): Promise<ProjectState> {
      const state = await this.getProjectState();
      state.customCodex.push({ ...item, isUnlocked: true });
      state.orchestrationLog.push(`New Protocol Forged: ${item.title}`);
      return await this.updateProjectState(state);
    }
    async triggerEvolution(prompt: string): Promise<ProjectState> {
      const state = await this.getProjectState();
      state.evolutionQueue.push(`Processing: ${prompt}`);
      state.oracleLog.push(`Oracle parsing vision: ${prompt}`);
      // Start the "Life" loop if not already running
      await this.ctx.storage.setAlarm(Date.now() + 5000);
      return await this.updateProjectState(state);
    }
    async alarm() {
      const state = await this.getProjectState();
      if (state.evolutionQueue.length > 0) {
        const task = state.evolutionQueue.shift();
        const evolvedItem: CodexItem = {
          id: `evolved-${Date.now()}`,
          category: 'Evolved',
          title: `Synthesis: ${task?.split(': ')[1]?.slice(0, 20)}...`,
          description: `Automatically generated protocol from vision: ${task}. Integrated at ${new Date().toLocaleTimeString()}.`,
          complexity: 'God',
          isUnlocked: true
        };
        state.customCodex.push(evolvedItem);
        state.orchestrationLog.push(`Evolution Cycle Complete: ${evolvedItem.title}`);
        state.singularity.lastEvolution = new Date().toISOString();
        state.singularity.quantumEntropy += 0.001;
        await this.updateProjectState(state);
      }
      // Keep breathing if items remain or periodically to show "Life"
      if (state.evolutionQueue.length > 0) {
        await this.ctx.storage.setAlarm(Date.now() + 10000);
      } else {
        // Ambient heartbeat every 2 minutes
        await this.ctx.storage.setAlarm(Date.now() + 120000);
      }
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
      revertedState.timebend = state.timebend;
      return await this.updateProjectState(revertedState);
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
      return await this.updateProjectState(state);
    }
}