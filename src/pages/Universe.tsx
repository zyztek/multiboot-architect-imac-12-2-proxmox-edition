import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, LayoutGrid, List, Plus, Activity, Brain, Orbit, Terminal } from 'lucide-react';
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
      toast.success("Protocol Registered");
      setIsDialogOpen(false);
      setNewTitle('');
      setNewDesc('');
    }
  });
  const batches = ['Visionary', 'Robust', 'VM', 'AI', 'Galaxy', 'Singularity', 'Evolved'];
  const allItems = useMemo(() => [...(staticCodex ?? []), ...(state?.customCodex ?? [])], [staticCodex, state?.customCodex]);
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return allItems.filter(i => 
      (i.title.toLowerCase().includes(s) || i.category.toLowerCase().includes(s)) &&
      (!activeBatch || i.category === activeBatch)
    );
  }, [allItems, search, activeBatch]);
  return (
    <AppLayout container className="bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">Universe</h1>
            <p className="text-blue-500 font-mono text-[10px] tracking-[0.4em] uppercase">The Infinite Registry</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
              <Input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search Codex..." 
                className="pl-10 bg-slate-900 border-white/5 h-11 text-xs"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-11 border-blue-500/20 text-blue-400">
                  <Plus className="size-4 mr-2" /> Forge Protocol
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-dark border-white/10 text-white">
                <DialogHeader><DialogTitle className="uppercase italic font-black">Manual Protocol Injection</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-slate-500">Title</Label>
                    <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="bg-black/40 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-slate-500">Description</Label>
                    <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} className="bg-black/40 border-white/10" />
                  </div>
                  <Button onClick={() => customMutation.mutate({ id: `m-${Date.now()}`, title: newTitle, description: newDesc, category: 'Robust', complexity: 'Elite', isUnlocked: true })} className="w-full bg-blue-600 font-black uppercase">Commit</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="h-11 bg-purple-600 hover:bg-purple-500 font-black uppercase text-[10px] tracking-widest">
               <Brain className="size-4 mr-2" /> Self-Evolve
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['All', ...batches].map(b => (
              <Button 
                key={b} 
                variant={activeBatch === b || (!activeBatch && b === 'All') ? 'secondary' : 'outline'}
                onClick={() => setActiveBatch(b === 'All' ? null : b)}
                className="text-[9px] uppercase h-8 px-6"
              >{b}</Button>
            ))}
          </div>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-white/5">
            <Button variant="ghost" size="icon" onClick={() => setDenseMode(true)} className={`size-8 ${denseMode ? 'bg-white/10' : ''}`}><LayoutGrid className="size-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setDenseMode(false)} className={`size-8 ${!denseMode ? 'bg-white/10' : ''}`}><List className="size-4" /></Button>
          </div>
        </div>
        {isStaticLoading || isStateLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
             {Array.from({ length: 18 }).map((_, i) => <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className={`grid gap-4 ${denseMode ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1'}`}>
            {filtered.map((item) => (
              <Card key={item.id} className={`glass-dark border-white/10 transition-all hover:scale-[1.02] ${item.isUnlocked ? 'border-blue-500/40 bg-blue-600/5' : 'opacity-40 grayscale'}`}>
                <CardHeader className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-[7px] border-white/10 uppercase">{item.category}</Badge>
                    {item.isUnlocked && <Activity className="size-3 text-emerald-400" />}
                  </div>
                  <CardTitle className="text-[11px] font-black text-white uppercase line-clamp-1">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {!denseMode && <p className="text-[10px] text-slate-500 italic mb-3">{item.description}</p>}
                  <div className="flex gap-1.5 flex-wrap">
                    <Badge className="bg-blue-600 text-[6px] h-4 uppercase">{item.complexity}</Badge>
                    {item.cmd && <Badge variant="outline" className="text-[6px] h-4 border-emerald-500/20 text-emerald-400">CLI</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <OracleCommander />
    </AppLayout>
  );
}