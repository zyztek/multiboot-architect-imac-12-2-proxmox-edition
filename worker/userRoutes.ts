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
          tags: [req.goal.toUpperCase(), req.goal === 'Workstation' ? 'GPU-READY' : 'CLOUD-INIT']
        };
        const response: AiArchitectResponse = {
            recommendedVms: [recommendedVm],
            zfsConfig: `zfs create rpool/data/${req.goal.toLowerCase()}-${vmid} -o compression=lz4`,
            cliCommands: [`qm create ${vmid} --name ${recommendedVm.name} --memory ${recommendedVm.memory} --net0 virtio,bridge=vmbr0 --scsihw virtio-scsi-pci`],
            reasoning: `Provisioned for ${req.goal}. CPU core affinity set to optimize for Sandy Bridge 4-core architecture while preserving host background cycles.`
        };
        const newState = { ...state, vms: [...state.vms, recommendedVm] };
        await stub.updateProjectState(newState);
        return c.json({ success: true, data: response });
    });
    app.post('/api/troubleshoot', async (c) => {
        const { logs } = await c.req.json() as { logs: string };
        const lowLogs = logs.toLowerCase();
        let suggestion = "Log pattern unrecognized. Suggest checking Proxmox syslog (/var/log/syslog).";
        if (lowLogs.includes("amd-vi: completion-wait loop timed out")) {
          suggestion = "CRITICAL: IOMMU Failure. The Radeon 6970M reset failed. Check 'iommu=pt' in GRUB and verify the GPU is bound to vfio-pci.";
        } else if (lowLogs.includes("failed to load firmware amdgpu")) {
          suggestion = "FIRMWARE MISSING: Host failed to find Radeon firmware. Run 'apt install firmware-amd-graphics' and 'update-initramfs -u'.";
        } else if (lowLogs.includes("vt-d is not enabled") || lowLogs.includes("iommu not found")) {
          suggestion = "BIOS FAULT: Virtualization features disabled. Ensure VT-x and VT-d are enabled in the iMac hidden BIOS or via OpenCore.";
        } else if (lowLogs.includes("windows 11") && lowLogs.includes("tpm")) {
          suggestion = "VM CONFIG: Windows 11 detected TPM missing. Ensure the VM has a vTPM 2.0 device added in Proxmox Hardware tab.";
        } else if (lowLogs.includes("gpu") && lowLogs.includes("reset")) {
          suggestion = "GPU RESET BUG: Radeon 6000 series often fails to re-initialize without a full host reboot or 'vendor-reset' kernel module.";
        }
        return c.json({ success: true, data: { suggestion } });
    });
}