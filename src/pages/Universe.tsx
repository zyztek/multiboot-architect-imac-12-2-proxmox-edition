import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Search, Globe, ShieldCheck, Terminal, Layers, Box, Zap, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { ApiResponse, CodexItem, ProjectState } from '@shared/types';
export function Universe() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeBatch, setActiveBatch] = useState<string | null>(null);
  const { data: codex, isLoading } = useQuery({
    queryKey: ['codex'],
    queryFn: async () => {
      const res = await fetch('/api/codex');
      const json = await res.json() as ApiResponse<CodexItem[]>;
      return json.data ?? [];
    },
    refetchInterval: 5000
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
      toast.success("Codex frequency aligned");
    }
  });
  const batches = ['Visionary', 'Robust', 'VM', 'AI', 'Galaxy'];
  const filtered = codex?.filter(item =>
    (item.title.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase())) &&
    (!activeBatch || item.category === activeBatch)
  );
  const getIcon = (cat: string) => {
    switch(cat) {
      case 'Robust': return <ShieldCheck className="size-4 text-emerald-400" />;
      case 'Visionary': return <Globe className="size-4 text-purple-400" />;
      case 'VM': return <Box className="size-4 text-blue-400" />;
      case 'AI': return <Zap className="size-4 text-orange-400" />;
      default: return <Layers className="size-4 text-slate-400" />;
    }
  };
  return (
    <AppLayout container className="bg-slate-950 text-slate-200">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase">Universe Codex</h1>
            <p className="text-blue-400 font-mono text-xs tracking-widest uppercase">150 Infinity Robust Primatives</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Codex..."
                className="pl-10 bg-slate-900 border-white/10 text-xs h-10"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pb-4">
          <Button
            variant={!activeBatch ? 'secondary' : 'outline'}
            onClick={() => setActiveBatch(null)}
            className="text-[10px] uppercase h-8"
          >All Units</Button>
          {batches.map(b => (
            <Button
              key={b}
              variant={activeBatch === b ? 'secondary' : 'outline'}
              onClick={() => setActiveBatch(b)}
              className="text-[10px] uppercase h-8"
            >{b}</Button>
          ))}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50">
             {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-48 rounded-xl bg-slate-900 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered?.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.01 }}
                >
                  <Card className={`glass-dark border-white/10 h-full transition-all group overflow-hidden ${item.isUnlocked ? 'border-blue-500/40 ring-1 ring-blue-500/20 shadow-glow' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getIcon(item.category)}
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{item.category}</span>
                        </div>
                        <Switch
                          checked={item.isUnlocked}
                          onCheckedChange={() => toggleMutation.mutate(item.id)}
                          className="scale-75 data-[state=checked]:bg-blue-600"
                        />
                      </div>
                      <CardTitle className="text-sm font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                      {item.cmd && (
                        <div className="bg-black/60 p-2 rounded border border-white/5 flex items-center gap-2">
                          <Terminal className="size-3 text-emerald-400" />
                          <code className="text-[9px] font-mono text-emerald-300/80">{item.cmd}</code>
                        </div>
                      )}
                    </CardContent>
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
import { Button } from '@/components/ui/button';