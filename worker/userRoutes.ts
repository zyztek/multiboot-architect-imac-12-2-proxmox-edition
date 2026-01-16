import { Hono } from "hono";
import { Env } from './core-utils';
import { MASTER_CODEX } from '@shared/mock-data';
import type { ApiResponse, ProjectState, CodexItem, OracleMetrics, AuthUser } from '@shared/types';
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
    app.post('/api/oracle/predict', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        // Ensure robust return even if calculations are tricky
        const metrics: OracleMetrics = {
            chaosProbability: Math.random() * 0.1,
            thermalSaturation: (state?.hostStats?.cpu_usage || 0) * 0.8 + 35,
            instabilityWarnings: (state?.hostStats?.cpu_usage || 0) > 85 ? ["Thermal Throttling Imminent"] : [],
            costEstimate: (state?.vms?.length || 0) * 15.5,
            efficiencyScore: 94.8
        };
        if (state) {
            state.oracleLog = (state.oracleLog || []).concat([`Prediction update: entropy level ${metrics.chaosProbability.toFixed(5)}`]).slice(-20);
            await stub.updateProjectState(state);
        }
        return c.json({ success: true, data: metrics } satisfies ApiResponse<OracleMetrics>);
    });
    app.post('/api/cosmos/export', async (c) => {
        const { target } = await c.req.json() as { target: string };
        // Simulation of cloud export
        return c.json({ success: true, data: { status: 'synced', target, timestamp: new Date().toISOString() } });
    });
    app.post('/api/singularity/one-click', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.singularityOneClick();
        return c.json({ success: true, data });
    });
    app.post('/api/timebend/revert', async (c) => {
        const { historyId } = await c.req.json() as { historyId: string };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.recursiveRevert(historyId);
        return c.json({ success: true, data });
    });
    app.get('/api/codex', async (c) => {
        return c.json({ success: true, data: MASTER_CODEX } satisfies ApiResponse<CodexItem[]>);
    });
    app.post('/api/export-iso', async (c) => {
        return c.json({ success: true, data: { status: 'forged', path: '/exports/singularity-v1.iso' } });
    });
    app.post('/api/usb-sim', async (c) => {
        const body = await c.req.json();
        return c.json({ success: true, data: { status: 'simulated', config: body } });
    });
    app.post('/api/proxmox/vm/action', async (c) => {
        const { vmid, action } = await c.req.json() as { vmid: number, action: 'start' | 'stop' };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.updateVmStatus(vmid, action === 'start' ? 'running' : 'stopped');
        return c.json({ success: true, data });
    });
    app.post('/api/auth/login', async (c) => {
        const { username } = await c.req.json() as { username: string };
        const mockUser: AuthUser = { id: crypto.randomUUID(), username, role: 'administrator' };
        return c.json({ success: true, data: mockUser } satisfies ApiResponse<AuthUser>);
    });
    app.post('/api/codex/toggle', async (c) => {
        const { id } = await c.req.json() as { id: string };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const index = state.codexUnlocked.indexOf(id);
        if (index === -1) state.codexUnlocked.push(id);
        else state.codexUnlocked.splice(index, 1);
        const data = await stub.updateProjectState(state);
        return c.json({ success: true, data });
    });
    app.post('/api/checklist/batch', async (c) => {
        const { updates } = await c.req.json() as { updates: { id: number, value: boolean }[] };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.batchUpdateChecklist(updates);
        return c.json({ success: true, data });
    });
}