import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CodexItem, ProjectState } from '@shared/types';
export function useEvolution() {
  const queryClient = useQueryClient();
  const evolveMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch('/api/evolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) throw new Error("Evolution handshake failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
      toast.success("Vision committed to Oracle Evolution Engine");
    }
  });
  const customCodexMutation = useMutation({
    mutationFn: async (item: CodexItem) => {
      const res = await fetch('/api/codex/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error("Forge commitment failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
      toast.success("Protocol permanently archived in Universe");
    }
  });
  const triggerEvolution = (text: string) => {
    evolveMutation.mutate(text);
  };
  const addPrimitive = (title: string, description: string) => {
    const item: CodexItem = {
      id: `manual-${Date.now()}`,
      category: 'Robust',
      title,
      description,
      complexity: 'Elite',
      isUnlocked: true
    };
    customCodexMutation.mutate(item);
  };
  return {
    triggerEvolution,
    addPrimitive,
    isEvolving: evolveMutation.isPending,
    isForging: customCodexMutation.isPending
  };
}