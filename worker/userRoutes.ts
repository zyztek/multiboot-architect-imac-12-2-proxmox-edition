import { Hono } from "hono";
import { Env } from './core-utils';
import type { ApiResponse, ProjectState, VmConfig, AiArchitectRequest, AiArchitectResponse, SensorData } from '@shared/types';
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
    app.get('/api/sensors', async (c) => {
        const sensorData: SensorData = {
          temp_cpu: 45 + Math.random() * 15,
          temp_gpu: 55 + Math.random() * 20,
          fan_speed: 1200 + Math.random() * 400,
          power_draw: 85 + Math.random() * 30,
          timestamp: new Date().toISOString()
        };
        return c.json({ success: true, data: sensorData });
    });
    app.get('/api/cluster', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        return c.json({ success: true, data: { nodes: state.nodes, zfs_grid: state.hostStats.zfs_health } });
    });
    app.post('/api/ai-wizard', async (c) => {
        const req = await c.req.json() as AiArchitectRequest;
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const vmid = 200 + state.vms.length;
        const recommendedVm: VmConfig = {
          vmid,
          name: `${req.goal}-Node-${vmid}`,
          cores: req.goal === 'Workstation' ? 4 : 2,
          memory: Math.floor(req.ramGb * 0.4 * 1024),
          diskId: 'local-zfs',
          hasTpm: req.goal === 'Workstation',
          gpuPassthrough: req.goal === 'Gaming' || req.goal === 'Workstation',
          status: 'stopped',
          node: state.nodes[1]?.name ?? 'pve-imac-02'
        };
        const response: AiArchitectResponse = {
            recommendedVms: [recommendedVm],
            zfsConfig: `zfs create rpool/data/${req.goal.toLowerCase()}-${vmid} -o compression=lz4`,
            cliCommands: [`qm create ${vmid} --name ${recommendedVm.name} --memory ${recommendedVm.memory} --net0 virtio,bridge=vmbr0`],
            reasoning: `Distributed to secondary node to balance thermals.`,
            prediction: `Current trend suggests node-01 will hit thermal limits in 4 hours. Recommend migrating non-GPU VMs to node-02.`
        };
        const newState = { ...state, vms: [...state.vms, recommendedVm], orchestrationLog: [...state.orchestrationLog, `AI Provisioned ${recommendedVm.name}`] };
        await stub.updateProjectState(newState);
        return c.json({ success: true, data: response });
    });
    app.post('/api/proxmox/vm/action', async (c) => {
        const { vmid, action } = await c.req.json() as { vmid: number, action: 'start' | 'stop' };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const updatedVms = state.vms.map(vm => vm.vmid === vmid ? { ...vm, status: action === 'start' ? 'running' as const : 'stopped' as const } : vm);
        const newState = { ...state, vms: updatedVms };
        const data = await stub.updateProjectState(newState);
        return c.json({ success: true, data } satisfies ApiResponse<ProjectState>);
    });
}