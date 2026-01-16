import { Hono } from "hono";
import { Env } from './core-utils';
import type { ApiResponse, ProjectState, VmConfig, AiArchitectRequest, AiArchitectResponse } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/project-state', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getProjectState();
        return c.json({ success: true, data } satisfies ApiResponse<ProjectState>);
    });
    app.post('/api/project-state', async (c) => {
        const body = await c.req.json() as ProjectState;
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.updateProjectState(body);
        return c.json({ success: true, data } satisfies ApiResponse<ProjectState>);
    });
    app.get('/api/proxmox/stats', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.updateHostStats();
        return c.json({ success: true, data: state.hostStats });
    });
    app.post('/api/proxmox/vm/action', async (c) => {
        const { vmid, action } = await c.req.json() as { vmid: number, action: 'start' | 'stop' | 'pause' };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const updatedVms = state.vms.map(vm => {
          if (vm.vmid === vmid) {
            let status: VmConfig['status'] = vm.status;
            if (action === 'start') status = 'running';
            if (action === 'stop') status = 'stopped';
            if (action === 'pause') status = 'paused';
            return { ...vm, status };
          }
          return vm;
        });
        const newState = { ...state, vms: updatedVms };
        const data = await stub.updateProjectState(newState);
        return c.json({ success: true, data } satisfies ApiResponse<ProjectState>);
    });
    app.post('/api/ai-wizard', async (c) => {
        const req = await c.req.json() as AiArchitectRequest;
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const vmid = 100 + state.vms.length;
        const recommendedVm: VmConfig = { 
          vmid, 
          name: `${req.goal}-Node-${vmid}`, 
          cores: req.goal === 'Workstation' ? 4 : 2, 
          memory: Math.floor(req.ramGb * 0.4 * 1024), 
          diskId: 'local-zfs', 
          hasTpm: req.goal === 'Workstation', 
          gpuPassthrough: req.goal === 'Gaming' || req.goal === 'Workstation',
          status: 'stopped'
        };
        const response: AiArchitectResponse = {
            recommendedVms: [recommendedVm],
            zfsConfig: `zfs create rpool/data/${req.goal.toLowerCase()}-${vmid} -o compression=lz4`,
            cliCommands: [`qm create ${vmid} --name ${recommendedVm.name} --memory ${recommendedVm.memory} --net0 virtio,bridge=vmbr0`],
            reasoning: `Based on your goal of ${req.goal}, we allocated resources to a new ${recommendedVm.name} node, optimized for Sandy Bridge CPU limits.`
        };
        // Also add to state so it appears in dashboard
        const newState = { ...state, vms: [...state.vms, recommendedVm] };
        await stub.updateProjectState(newState);
        return c.json({ success: true, data: response });
    });
    app.post('/api/troubleshoot', async (c) => {
        const { logs } = await c.req.json() as { logs: string };
        let suggestion = "No known errors detected. Check Proxmox syslog.";
        if (logs.includes("AMD-Vi: Completion-Wait loop timed out")) suggestion = "CRITICAL: IOMMU Failure. Add 'iommu=pt' and 'intel_iommu=on' to GRUB.";
        if (logs.includes("display not found")) suggestion = "HINT: Radeon 6970M initialization failed. Use 'nomodeset' and install 'firmware-amd-graphics'.";
        return c.json({ success: true, data: { suggestion } });
    });
}