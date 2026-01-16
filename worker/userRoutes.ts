import { Hono } from "hono";
import { Env } from './core-utils';
import { MASTER_CODEX } from '@shared/mock-data';
import type { ApiResponse, ProjectState, CodexItem, OracleMetrics } from '@shared/types';
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
        const metrics: OracleMetrics = {
            chaosProbability: Math.random() * 0.15,
            thermalSaturation: state.hostStats.cpu_usage * 0.8 + 20,
            instabilityWarnings: state.hostStats.cpu_usage > 80 ? ["AMD Driver Latency Spike Detected"] : [],
            costEstimate: state.vms.length * 45,
            efficiencyScore: 94.2
        };
        state.oracleLog.push(`Prediction @ ${new Date().toLocaleTimeString()}: ${metrics.chaosProbability.toFixed(4)} Entropy`);
        await stub.updateProjectState(state);
        return c.json({ success: true, data: metrics });
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
    app.get('/api/health/deep', async (c) => {
        const checks = Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            component: `Kernel_Module_${i}`,
            status: Math.random() > 0.01 ? 'PASS' : 'WARN'
        }));
        return c.json({ success: true, data: checks });
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