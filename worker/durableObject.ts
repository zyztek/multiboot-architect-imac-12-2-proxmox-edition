import { DurableObject } from "cloudflare:workers";
import type { ProjectState, VmConfig, ClusterNode } from '@shared/types';
export class GlobalDurableObject extends DurableObject {
    async getProjectState(): Promise<ProjectState> {
      const state = await this.ctx.storage.get("project_state");
      if (state) {
        const current = state as ProjectState;
        if (!current.nodes) current.nodes = this.getDefaultNodes();
        if (!current.sensors) current.sensors = [];
        if (!current.orchestrationLog) current.orchestrationLog = ["Cluster initialized"];
        if (!current.isoLibrary) current.isoLibrary = [];
        if (!current.visionarySessions) current.visionarySessions = [];
        if (!current.kyber) current.kyber = { enabled: false, keyStrength: 'Level1', lastRotation: new Date().toISOString() };
        return current;
      }
      const defaultState: ProjectState = {
        checklist: new Array(20).fill(false),
        storage: { win11: 200, kali: 100, fyde: 100, shared: 600 },
        vms: this.getDefaultVms(),
        nodes: this.getDefaultNodes(),
        apiConfig: { url: '', token: '', node: 'pve-imac-01' },
        hostStats: this.getMockStats(),
        sensors: [],
        orchestrationLog: ["First boot successful"],
        isoLibrary: [],
        visionarySessions: [],
        kyber: { enabled: false, keyStrength: 'Level1', lastRotation: new Date().toISOString() },
        usbLabel: 'PROXMOX',
        isoPath: 'C:\\ISOs',
        lastUpdated: new Date().toISOString()
      };
      await this.ctx.storage.put("project_state", defaultState);
      return defaultState;
    }
    private getDefaultNodes(): ClusterNode[] {
      return [
        { id: '1', name: 'pve-imac-01', status: 'online', cpu_usage: 12, mem_usage: 45, ip: '10.0.0.10' },
        { id: '2', name: 'pve-imac-02', status: 'online', cpu_usage: 5, mem_usage: 20, ip: '10.0.0.11' }
      ];
    }
    private getDefaultVms(): VmConfig[] {
      return [
        { vmid: 100, name: 'Windows-11-Prod', cores: 4, memory: 8192, diskId: 'local-zfs', hasTpm: true, gpuPassthrough: true, status: 'stopped', node: 'pve-imac-01' },
        { vmid: 101, name: 'Kali-Security-Lab', cores: 2, memory: 4096, diskId: 'local-zfs', hasTpm: false, gpuPassthrough: false, status: 'stopped', node: 'pve-imac-01' },
        { vmid: 102, name: 'openFyde-OS', cores: 2, memory: 4096, diskId: 'local-zfs', hasTpm: false, gpuPassthrough: false, status: 'stopped', node: 'pve-imac-02' },
      ];
    }
    private getMockStats() {
      return {
        cpu_usage: 12.5,
        mem_usage: 45.2,
        uptime: "4 days, 2 hours",
        zfs_health: 'ONLINE' as const,
        net_in: 0.5,
        net_out: 0.2
      };
    }
    async updateProjectState(state: ProjectState): Promise<ProjectState> {
      const updated = { ...state, lastUpdated: new Date().toISOString() };
      await this.ctx.storage.put("project_state", updated);
      return updated;
    }
}