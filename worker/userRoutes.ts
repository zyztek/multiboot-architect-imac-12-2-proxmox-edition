import { Hono } from "hono";
import { Env } from './core-utils';
import { MASTER_CODEX } from '@shared/mock-data';
import type { ApiResponse, ProjectState, CodexItem } from '@shared/types';
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
    app.post('/api/export-iso', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        state.singularity.exportProgress = 10;
        state.orchestrationLog.push(`ISO Export Initiated: AppOS-v1.4.iso`);
        await stub.updateProjectState(state);
        return c.json({ success: true, data: state });
    });
    app.post('/api/snapshots', async (c) => {
        const { label } = await c.req.json() as { label: string };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.createSnapshot(label);
        return c.json({ success: true, data });
    });
    app.post('/api/codex/toggle', async (c) => {
        const { id } = await c.req.json() as { id: string };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.toggleCodex(id);
        return c.json({ success: true, data });
    });
    app.post('/api/checklist/batch', async (c) => {
        const { updates } = await c.req.json() as { updates: { id: number, value: boolean }[] };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.batchUpdateChecklist(updates);
        return c.json({ success: true, data });
    });
    app.get('/api/codex', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const items = MASTER_CODEX.map(item => ({
            ...item,
            isUnlocked: state.codexUnlocked.includes(item.id)
        }));
        return c.json({ success: true, data: items } satisfies ApiResponse<CodexItem[]>);
    });
    app.post('/api/auth/login', async (c) => {
        const { username } = await c.req.json() as { username: string };
        const user = { id: 'u1', username: username || 'Architect', role: 'admin' };
        return c.json({ success: true, data: user });
    });
}