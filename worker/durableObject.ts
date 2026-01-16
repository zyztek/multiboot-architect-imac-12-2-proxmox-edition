import { DurableObject } from "cloudflare:workers";
import type { DemoItem, ProjectState } from '@shared/types';
import { MOCK_ITEMS } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    async getCounterValue(): Promise<number> {
      const value = (await this.ctx.storage.get("counter_value")) || 0;
      return value as number;
    }
    async increment(amount = 1): Promise<number> {
      let value: number = (await this.ctx.storage.get("counter_value")) || 0;
      value += amount;
      await this.ctx.storage.put("counter_value", value);
      return value;
    }
    async getProjectState(): Promise<ProjectState> {
      const state = await this.ctx.storage.get("project_state");
      if (state) return state as ProjectState;
      const defaultState: ProjectState = {
        checklist: new Array(12).fill(false),
        storage: { win11: 200, kali: 100, fyde: 100, shared: 600 },
        lastUpdated: new Date().toISOString()
      };
      await this.ctx.storage.put("project_state", defaultState);
      return defaultState;
    }
    async updateProjectState(state: ProjectState): Promise<ProjectState> {
      const updated = { ...state, lastUpdated: new Date().toISOString() };
      await this.ctx.storage.put("project_state", updated);
      return updated;
    }
    async getDemoItems(): Promise<DemoItem[]> {
      const items = await this.ctx.storage.get("demo_items");
      if (items) return items as DemoItem[];
      await this.ctx.storage.put("demo_items", MOCK_ITEMS);
      return MOCK_ITEMS;
    }
    async addDemoItem(item: DemoItem): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = [...items, item];
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async updateDemoItem(id: string, updates: Partial<Omit<DemoItem, 'id'>>): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = items.map(item => item.id === id ? { ...item, ...updates } : item);
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async deleteDemoItem(id: string): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = items.filter(item => item.id !== id);
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
}