import { Hono } from "hono";
import { Env } from './core-utils';
import type { 
  ApiResponse, 
  ProjectState, 
  VmConfig, 
  AiArchitectRequest, 
  AiArchitectResponse, 
  SensorData,
  AuthUser,
  CodexItem
} from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/project-state', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getProjectState();
        // Simplified return to avoid excessively deep type instantiation in Hono c.json
        const response: ApiResponse<ProjectState> = { success: true, data };
        return c.json(response);
    });
    app.post('/api/project-state', async (c) => {
        const body = await c.req.json() as ProjectState;
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.updateProjectState(body);
        return c.json({ success: true, data } satisfies ApiResponse<ProjectState>);
    });
    app.post('/api/auth/login', async (c) => {
        const { username } = await c.req.json() as { username: string };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const user: AuthUser = { id: 'u1', username: username || 'Architect', role: 'admin', token: 'mock-jwt-infinity' };
        await stub.updateProjectState({ ...state, auth: { isAuthenticated: true, user } });
        return c.json({ success: true, data: user } satisfies ApiResponse<AuthUser>);
    });
    app.get('/api/codex', async (c) => {
        const items: CodexItem[] = [
            { id: 'c1', category: 'Robust', title: 'Zod Validation Fortress', description: 'Deep recursive schema validation for all API inputs.', complexity: 'Elite' },
            { id: 'c2', category: 'USB', title: 'Ventoy Multi-ISO God Mode', description: 'Automated injection of OpenCore drivers into VTOY_EFI.', complexity: 'God', cmd: 'ventoy-inject --imac-12-2' },
            { id: 'c3', category: 'Galaxy', title: 'Terraform Cluster Provider', description: 'HCL definitions for Sandy Bridge VM pools.', complexity: 'Advanced' },
            { id: 'c4', category: 'Visionary', title: 'PiP Neural Stream', description: 'Picture-in-Picture mode for concurrent VM monitoring.', complexity: 'Elite' },
            { id: 'c5', category: 'VM', title: 'VHD-to-ZFS Atomic Porter', description: 'Zero-copy conversion of legacy Windows disks.', complexity: 'God' }
        ];
        return c.json({ success: true, data: items } satisfies ApiResponse<CodexItem[]>);
    });
    app.post('/api/usb-sim', async (c) => {
        const body = await c.req.json() as { partitions: any[] };
        const isValid = body.partitions.length > 0;
        await new Promise(r => setTimeout(r, 1000));
        return c.json({
            success: isValid,
            data: { message: isValid ? "Geometry Validated" : "Overlap Detected", log: ["Checking GPT tables...", "EFI partition alignment OK"] }
        });
    });
    app.get('/api/sensors', async (c) => {
        const sensorData: SensorData = {
          temp_cpu: 45 + Math.random() * 15,
          temp_gpu: 55 + Math.random() * 20,
          fan_speed: 1200 + Math.random() * 400,
          power_draw: 85 + Math.random() * 30,
          timestamp: new Date().toISOString()
        };
        return c.json({ success: true, data: sensorData } satisfies ApiResponse<SensorData>);
    });
    app.get('/api/visionary/consoles', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const sessions = (state.vms ?? []).map(vm => ({
            vmid: vm.vmid,
            name: vm.name,
            type: 'noVNC' as const,
            url: `https://pve.internal:8006/?console=kvm&vmid=${vm.vmid}`,
            token: `vnc-${Math.random().toString(36).substring(7)}`
        }));
        return c.json({ success: true, data: sessions } satisfies ApiResponse);
    });
    app.post('/api/ai-wizard', async (c) => {
        const req = await c.req.json() as AiArchitectRequest;
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const vmid = 200 + (state.vms ?? []).length;
        const recommendedVm: VmConfig = {
          vmid,
          name: `${req.goal}-Node-${vmid}`,
          cores: req.goal === 'Workstation' ? 4 : 2,
          memory: Math.floor(req.ramGb * 0.4 * 1024),
          diskId: 'local-zfs',
          hasTpm: req.goal === 'Workstation',
          gpuPassthrough: req.goal === 'Gaming' || req.goal === 'Workstation',
          status: 'stopped',
          node: (state.nodes[1]?.name ?? state.nodes[0]?.name ?? 'pve-imac-02')
        };
        const response: AiArchitectResponse = {
            recommendedVms: [recommendedVm],
            zfsConfig: `zfs create rpool/data/${req.goal.toLowerCase()}-${vmid} -o compression=lz4`,
            cliCommands: [`qm create ${vmid} --name ${recommendedVm.name} --memory ${recommendedVm.memory} --net0 virtio,bridge=vmbr0`],
            reasoning: `Distributed to secondary node to balance thermals.`,
            prediction: `Current trend suggests node-01 will hit thermal limits in 4 hours. Recommend migrating non-GPU VMs to node-02.`
        };
        const newState = { ...state, vms: [...(state.vms ?? []), recommendedVm], orchestrationLog: [...(state.orchestrationLog ?? []), `AI Provisioned ${recommendedVm.name}`] };
        await stub.updateProjectState(newState);
        return c.json({ success: true, data: response } satisfies ApiResponse<AiArchitectResponse>);
    });
    app.post('/api/proxmox/vm/action', async (c) => {
        const { vmid, action } = await c.req.json() as { vmid: number, action: 'start' | 'stop' };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const updatedVms = (state.vms ?? []).map(vm => vm.vmid === vmid ? { ...vm, status: action === 'start' ? 'running' as const : 'stopped' as const } : vm);
        const newState = { ...state, vms: updatedVms };
        const data = await stub.updateProjectState(newState);
        return c.json({ success: true, data } satisfies ApiResponse<ProjectState>);
    });
}