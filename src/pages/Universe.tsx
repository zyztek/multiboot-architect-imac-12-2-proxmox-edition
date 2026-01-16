import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, LayoutGrid, List } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { OracleCommander } from '@/components/OracleCommander';
import type { ApiResponse, CodexItem } from '@shared/types';
export function Universe() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeBatch, setActiveBatch] = useState<string | null>(null);
  const [denseMode, setDenseMode] = useState(true);
  const { data: codex, isLoading } = useQuery({
    queryKey: ['codex'],
    queryFn: async () => {
      const res = await fetch('/api/codex');
      const json = await res.json() as ApiResponse<CodexItem[]>;
      return json.data ?? [];
    },
    refetchInterval: 10000
  });
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/codex/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codex'] });
    }
  });
  const batches = ['Visionary', 'Robust', 'VM', 'AI', 'Galaxy', 'Singularity'];
  const filtered = useMemo(() => {
    if (!codex) return [];
    const lowerSearch = search.toLowerCase();
    return codex.filter(item =>
      (item.title.toLowerCase().includes(lowerSearch) ||
       item.category.toLowerCase().includes(lowerSearch)) &&
      (!activeBatch || item.category === activeBatch)
    ).slice(0, 300);
  }, [codex, search, activeBatch]);
  const progress = useMemo(() => {
    if (!codex) return 0;
    return (codex.filter(c => c.isUnlocked).length / codex.length) * 100;
  }, [codex]);
  return (
    <AppLayout container className="bg-slate-950 text-slate-200 min-h-screen">
      <div className="space-y-10 animate-fade-in pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">Universe</h1>
            <p className="text-blue-500 font-mono text-[10px] tracking-[0.4em] uppercase">300 Robust Primitives • Sync {progress.toFixed(1)}%</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Codex Modules..."
                className="pl-10 bg-slate-900 border-white/5 text-[11px] h-11"
              />
            </div>
            <Button
              variant="outline"
              className="border-white/10 text-white font-black text-[10px] uppercase h-11 px-6 tracking-widest hover:bg-white/5"
              onClick={() => {
                const res = fetch('/api/singularity/one-click', { method: 'POST' });
                toast.promise(res, {
                   loading: 'Aligning 300 Primitives...',
                   success: 'Singularity Threshold Met',
                   error: 'Alignment Failed'
                });
              }}
            >
              <Sparkles className="size-4 mr-2 text-blue-400" /> Endgame One-Click
            </Button>
          </div>
        </div>
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
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
             {Array.from({ length: 18 }).map((_, i) => <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className={`grid gap-4 ${denseMode ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1'}`}>
            {filtered.map((item) => (
              <Card 
                key={item.id} 
                className={`glass-dark border-white/10 transition-all group hover:scale-[1.02] cursor-pointer ${item.isUnlocked ? 'border-blue-500/40 bg-blue-600/5' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
                onClick={() => toggleMutation.mutate(item.id)}
              >
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[7px] border-white/10 uppercase py-0 px-1">{item.category}</Badge>
                    <CardTitle className="text-[11px] font-black text-white leading-tight uppercase line-clamp-1">{item.title}</CardTitle>
                  </div>
                  <Switch checked={!!item.isUnlocked} className="scale-75 data-[state=checked]:bg-blue-600" />
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