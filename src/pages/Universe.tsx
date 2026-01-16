import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Search, Globe, ShieldCheck, Terminal, Layers, Box, Zap, Sparkles, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
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
    refetchInterval: 5000
  });
  const singularityMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/singularity/one-click', { method: 'POST' });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codex'] });
      toast.success("Batch Singularity: All 300 Primitives Aligned");
    }
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
  const batches = ['Visionary', 'Robust', 'VM', 'AI', 'Galaxy', 'Singularity', 'Quantum', 'Meta', 'Bend'];
  const filtered = useMemo(() => {
    if (!codex) return [];
    const lowerSearch = search.toLowerCase();
    return codex.filter(item =>
      (item.title.toLowerCase().includes(lowerSearch) ||
       item.category.toLowerCase().includes(lowerSearch)) &&
      (!activeBatch || item.category === activeBatch)
    );
  }, [codex, search, activeBatch]);
  return (
    <AppLayout container className="bg-slate-950 text-slate-200">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">Universe</h1>
            <p className="text-blue-400 font-mono text-[10px] tracking-[0.5em] uppercase">300 Infinity Technical Primitives</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Codex Modules..."
                className="pl-10 bg-slate-900 border-white/10 text-xs h-10"
              />
            </div>
            <Button 
              onClick={() => singularityMutation.mutate()}
              className="bg-blue-600 hover:bg-blue-500 h-10 px-6 uppercase font-black text-[10px] tracking-widest shadow-glow"
            >
              <Sparkles className="size-4 mr-2" /> Batch Singularity
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!activeBatch ? 'secondary' : 'outline'}
              onClick={() => setActiveBatch(null)}
              className="text-[9px] uppercase h-7 px-4"
            >All Units</Button>
            {batches.map(b => (
              <Button
                key={b}
                variant={activeBatch === b ? 'secondary' : 'outline'}
                onClick={() => setActiveBatch(b)}
                className="text-[9px] uppercase h-7 px-4"
              >{b}</Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Dense Grid</span>
            <Switch checked={denseMode} onCheckedChange={setDenseMode} className="scale-75" />
          </div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 opacity-50">
             {Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-40 rounded-xl bg-slate-900 animate-pulse" />)}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${denseMode ? 'md:grid-cols-4 lg:grid-cols-6' : 'md:grid-cols-3'} gap-4`}>
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.1, delay: Math.min(i * 0.005, 0.2) }}
                >
                  <Card className={`glass-dark border-white/10 h-full transition-all group overflow-hidden ${item.isUnlocked ? 'border-blue-500/50 bg-blue-600/10 shadow-glow' : 'hover:border-white/30'}`}>
                    <CardHeader className="p-3 pb-1">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-[7px] border-white/10 uppercase tracking-tighter h-4 px-1">{item.category}</Badge>
                        <Switch
                          checked={!!item.isUnlocked}
                          onCheckedChange={() => toggleMutation.mutate(item.id)}
                          className="scale-[0.6] data-[state=checked]:bg-blue-600"
                        />
                      </div>
                      <CardTitle className={`font-black text-white mt-1 leading-none ${denseMode ? 'text-[10px]' : 'text-xs'}`}>{item.title}</CardTitle>
                    </CardHeader>
                    {!denseMode && (
                      <CardContent className="p-3 pt-2">
                        <p className="text-[9px] text-slate-500 leading-tight line-clamp-2">{item.description}</p>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}