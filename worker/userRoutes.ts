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
    app.post('/api/ai-wizard', async (c) => {
        const req = await c.req.json() as AiArchitectRequest;
        // Mock rule-based AI logic
        const response: AiArchitectResponse = {
            recommendedVms: [
                { vmid: 100, name: `${req.goal}-Main`, cores: 4, memory: Math.floor(req.ramGb * 0.5 * 1024), diskId: 'local-zfs', hasTpm: true, gpuPassthrough: true }
            ],
            zfsConfig: `zfs create rpool/data/${req.goal.toLowerCase()} -o compression=lz4`,
            cliCommands: [`qm create 100 --name ${req.goal}-Primary --memory 4096 --net0 virtio,bridge=vmbr0`],
            reasoning: `Based on your goal of ${req.goal}, we allocated 50% of your ${req.ramGb}GB RAM to a primary high-performance node with GPU passthrough enabled for the iMac's Radeon 6970M.`
        };
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