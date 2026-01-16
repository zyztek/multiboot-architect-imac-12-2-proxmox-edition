import { Hono } from "hono";
import { Env } from './core-utils';
import { MASTER_CODEX } from '@shared/mock-data';
import * as templates from '@shared/cosmos-templates';
import type { ApiResponse, ProjectState, CodexItem, OracleMetrics, AuthUser, ForgeJob } from '@shared/types';
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
    app.post('/api/singularity/one-click', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.singularityOneClick();
        return c.json({ success: true, data } satisfies ApiResponse<ProjectState>);
    });
    app.post('/api/codex/custom', async (c) => {
        const body = await c.req.json() as CodexItem;
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.addCustomCodexItem(body);
        return c.json({ success: true, data } satisfies ApiResponse<ProjectState>);
    });
    app.post('/api/evolve', async (c) => {
        const { prompt } = await c.req.json() as { prompt: string };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.triggerEvolution(prompt);
        return c.json({ success: true, data } satisfies ApiResponse<ProjectState>);
    });
    app.post('/api/usb/forge', async (c) => {
        const { os, components } = await c.req.json() as { os: string[], components: string[] };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const newJob: ForgeJob = {
            id: crypto.randomUUID(),
            status: 'processing' as const,
            progress: 0,
            targetOs: os,
            components,
            timestamp: new Date().toISOString()
        };
        state.activeForgeJobs = [newJob, ...(state.activeForgeJobs || [])].slice(0, 5);
        await stub.updateProjectState(state);
        return c.json({ success: true, data: newJob } satisfies ApiResponse<ForgeJob>);
    });
    app.get('/api/cosmos/usb-workflow', (c) => {
        return c.json({ success: true, data: templates.GITHUB_USB_BUILD_WORKFLOW });
    });
    app.get('/api/cosmos/wiki', (c) => {
        return c.json({ success: true, data: templates.GITHUB_WIKI_TEMPLATE });
    });
    app.get('/api/cosmos/dependabot', (c) => {
        return c.json({ success: true, data: templates.DEPENDABOT_CONFIG });
    });
    app.get('/api/cosmos/secrets', (c) => {
        return c.json({ success: true, data: templates.GITHUB_SECRETS_GUIDE });
    });
    app.get('/api/cosmos/projects', (c) => {
        return c.json({ success: true, data: templates.GITHUB_PROJECTS_CONFIG });
    });
    app.post('/api/oracle/predict', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const metrics: OracleMetrics = {
            chaosProbability: Math.random() * 0.05,
            thermalSaturation: (state?.hostStats?.cpu_usage || 0) * 0.5 + 40,
            instabilityWarnings: [],
            costEstimate: (state?.vms?.length || 0) * 12.0,
            efficiencyScore: 100.0
        };
        return c.json({ success: true, data: metrics } satisfies ApiResponse<OracleMetrics>);
    });
    app.get('/api/codex', async (c) => {
        return c.json({ success: true, data: MASTER_CODEX } satisfies ApiResponse<CodexItem[]>);
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
    app.post('/api/checklist/batch', async (c) => {
        const { updates } = await c.req.json() as { updates: { id: number, value: boolean }[] };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.batchUpdateChecklist(updates);
        return c.json({ success: true, data });
    });
}