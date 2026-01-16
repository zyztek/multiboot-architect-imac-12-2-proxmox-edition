import { Hono } from "hono";
import { Env } from './core-utils';
import type { ApiResponse, ProjectState, VmConfig } from '@shared/types';
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
    app.post('/api/vms', async (c) => {
        const vms = await c.req.json() as VmConfig[];
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const state = await stub.getProjectState();
        const updated = await stub.updateProjectState({ ...state, vms });
        return c.json({ success: true, data: updated } satisfies ApiResponse<ProjectState>);
    });
    app.get('/api/health', (c) => c.json({ success: true, status: 'online' }));
}