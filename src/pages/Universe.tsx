import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, LayoutGrid, List, Plus, Activity, Zap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { OracleCommander } from '@/components/OracleCommander';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ApiResponse, CodexItem, ProjectState } from '@shared/types';
export function Universe() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeBatch, setActiveBatch] = useState<string | null>(null);
  const [denseMode, setDenseMode] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: state, isLoading: isStateLoading } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    }
  });
  const { data: staticCodex, isLoading: isStaticLoading } = useQuery({
    queryKey: ['codex'],
    queryFn: async () => {
      const res = await fetch('/api/codex');
      const json = await res.json() as ApiResponse<CodexItem[]>;
      return json.data ?? [];
    }
  });
  const customMutation = useMutation({
    mutationFn: async (item: CodexItem) => {
      const res = await fetch('/api/codex/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
      toast.success("Protocol Forged in Custom Codex");
      setIsDialogOpen(false);
      setNewTitle('');
      setNewDesc('');
    }
  });
  const singularityMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/singularity/one-click', { method: 'POST' });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Singularity Threshold Met: 300 Primitives Aligned");
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    }
  });
  const batches = ['Visionary', 'Robust', 'VM', 'AI', 'Galaxy', 'Singularity', 'Evolved'];
  const allCodexItems = useMemo(() => {
    const combined = [...(staticCodex ?? []), ...(state?.customCodex ?? [])];
    return combined;
  }, [staticCodex, state?.customCodex]);
  const filtered = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return allCodexItems.filter(item =>
      (item.title.toLowerCase().includes(lowerSearch) ||
       item.category.toLowerCase().includes(lowerSearch)) &&
      (!activeBatch || item.category === activeBatch)
    );
  }, [allCodexItems, search, activeBatch]);
  const progress = useMemo(() => {
    if (allCodexItems.length === 0) return 0;
    return (allCodexItems.filter(c => c.isUnlocked).length / allCodexItems.length) * 100;
  }, [allCodexItems]);
  const handleCreate = () => {
    if (!newTitle) return;
    const item: CodexItem = {
      id: `manual-${Date.now()}`,
      category: 'Robust',
      title: newTitle,
      description: newDesc,
      complexity: 'Elite',
      isUnlocked: true
    };
    customMutation.mutate(item);
  };
  return (
    <AppLayout container className="bg-slate-950 text-slate-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">Universe</h1>
            <p className="text-blue-500 font-mono text-[10px] tracking-[0.4em] uppercase">Infinite Robust Codex ��� Sync {progress.toFixed(1)}%</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Infinite Registry..."
                className="pl-10 bg-slate-900 border-white/5 text-[11px] h-11"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-11 border-blue-500/20 text-blue-400 hover:bg-blue-500/10">
                  <Plus className="size-4 mr-2" /> New Protocol
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-dark border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">Forge Custom Primitive</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-slate-500">Protocol Title</Label>
                    <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Kyber-Shield-X" className="bg-black/40 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-slate-500">Technical payload description</Label>
                    <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Define the logical implementation..." className="bg-black/40 border-white/10" />
                  </div>
                  <Button onClick={handleCreate} disabled={customMutation.isPending} className="w-full bg-blue-600 hover:bg-blue-500 font-black uppercase tracking-widest">
                    Commit to Infinite Registry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="border-white/10 text-white font-black text-[10px] uppercase h-11 px-6 tracking-widest hover:bg-white/5"
              onClick={() => singularityMutation.mutate()}
              disabled={singularityMutation.isPending}
            >
              <Sparkles className="size-4 mr-2 text-blue-400" /> Singularity
            </Button>
          </div>
        </div>
        {state?.evolutionQueue && state.evolutionQueue.length > 0 && (
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <Activity className="size-5 text-blue-400" />
              <div>
                <p className="text-[10px] font-black uppercase text-blue-400">Evolution Engine Active</p>
                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Hydrating Queue: {state.evolutionQueue.length} Pending Actions</p>
              </div>
            </div>
            <Zap className="size-4 text-blue-400" />
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['All', ...batches].map(b => (
              <Button
                key={b}
                variant={activeBatch === b || (!activeBatch && b === 'All') ? 'secondary' : 'outline'}
                onClick={() => setActiveBatch(b === 'All' ? null : b)}
                className="text-[9px] uppercase h-8 px-5 border-white/5"
              >{b}</Button>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-slate-900 rounded-lg p-1 border border-white/5">
                <Button variant="ghost" size="icon" onClick={() => setDenseMode(true)} className={`size-8 ${denseMode ? 'bg-white/10' : ''}`}><LayoutGrid className="size-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDenseMode(false)} className={`size-8 ${!denseMode ? 'bg-white/10' : ''}`}><List className="size-4" /></Button>
             </div>
          </div>
        </div>
        {(isStaticLoading || isStateLoading) ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
             {Array.from({ length: 18 }).map((_, i) => <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className={`grid gap-4 ${denseMode ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1'}`}>
            {filtered.map((item) => (
              <Card
                key={item.id}
                className={`glass-dark border-white/10 transition-all group hover:scale-[1.02] cursor-pointer ${item.isUnlocked ? 'border-blue-500/40 bg-blue-600/5' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
              >
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <Badge variant="outline" className={`text-[7px] border-white/10 uppercase py-0 px-1 ${item.id.startsWith('evolved') ? 'border-purple-500 text-purple-400' : ''}`}>{item.category}</Badge>
                    <CardTitle className="text-[11px] font-black text-white leading-tight uppercase line-clamp-1">{item.title}</CardTitle>
                  </div>
                  <Switch checked={!!item.isUnlocked} disabled className="scale-75 data-[state=checked]:bg-blue-600" />
                </CardHeader>
                {!denseMode && (
                  <CardContent className="px-4 pb-4">
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 italic">{item.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      <OracleCommander />
    </AppLayout>
  );
}