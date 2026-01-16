import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Eye, Maximize2, RefreshCw, Layers, Brain, Zap, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import type { ApiResponse, ProjectState, ConsoleSession } from '@shared/types';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';
export function Visionary() {
  const [activeView, setActiveView] = useState<'grid' | 'neural'>('grid');
  const { data: state } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      if (!json.success || !json.data) throw new Error("State sync failed");
      return json.data;
    }
  });
  const heatmapData = Array.from({ length: 50 }).map((_, i) => ({
    x: Math.floor(i / 10),
    y: i % 10,
    z: Math.random() * 100,
    node: i < 25 ? 'node-01' : 'node-02'
  }));
  const vms = state?.vms ?? [];
  return (
    <AppLayout container className="bg-slate-950 text-slate-100">
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter uppercase">Visionary Control</h1>
            <p className="text-blue-400 font-mono text-[10px] tracking-[0.3em] uppercase">Multiverse Console / Live OS Stream</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveView('grid')}
              variant={activeView === 'grid' ? 'default' : 'outline'}
              className="h-8 text-[10px] uppercase px-4 bg-blue-600 hover:bg-blue-500"
            >
              <Monitor className="size-3 mr-2" /> Live Grid
            </Button>
            <Button
              onClick={() => setActiveView('neural')}
              variant={activeView === 'neural' ? 'default' : 'outline'}
              className="h-8 text-[10px] uppercase px-4"
            >
              <Brain className="size-3 mr-2" /> Neural Map
            </Button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {activeView === 'grid' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {vms.map((vm) => (
                <Card key={vm.vmid} className="glass-dark border-white/10 overflow-hidden group hover:border-blue-500/50 transition-all">
                  <CardHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between bg-black/40">
                    <CardTitle className="text-sm font-mono flex items-center gap-2">
                      <div className={`size-2 rounded-full ${vm.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                      {vm.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-[9px] uppercase border-blue-500/20 text-blue-400">{vm.node}</Badge>
                  </CardHeader>
                  <CardContent className="p-0 aspect-video relative bg-slate-900 flex items-center justify-center overflow-hidden">
                    {vm.status === 'running' ? (
                      <>
                        <img
                          src={`https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800`}
                          className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                          alt="Console Stream"
                        />
                        <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="secondary" className="size-7 bg-black/60"><Maximize2 className="size-3" /></Button>
                          <Button size="icon" variant="secondary" className="size-7 bg-black/60"><RefreshCw className="size-3" /></Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-700">
                        <Monitor className="size-8" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">OFFLINE</span>
                      </div>
                    )}
                  </CardContent>
                  <div className="p-3 bg-black/60 border-t border-white/5 flex justify-between items-center">
                    <div className="flex gap-2 text-[9px] font-mono text-slate-500">
                      <span>FPS: 60</span>
                      <span>LAT: 4ms</span>
                    </div>
                    <Button variant="ghost" className="h-6 text-[9px] uppercase text-blue-400 hover:bg-blue-400/10">Input Sync</Button>
                  </div>
                </Card>
              ))}
              {vms.length === 0 && (
                <div className="col-span-full p-12 text-center text-slate-500 font-mono uppercase tracking-widest border border-dashed border-white/10 rounded-xl">
                  No active virtualizations detected
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="glass-dark border-white/10 text-white p-8 h-[600px]">
                <CardHeader className="px-0">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Brain className="size-6 text-rose-500" /> Synapse Latency Heatmap
                  </CardTitle>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Cross-Node Neural Performance Grid</p>
                </CardHeader>
                <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="80%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <XAxis type="number" dataKey="x" hide />
                      <YAxis type="number" dataKey="y" hide />
                      <ZAxis type="number" dataKey="z" range={[50, 400]} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="glass-dark border-white/10 p-2 text-[10px]">
                                <p className="text-blue-400 font-bold uppercase">{payload[0].payload.node}</p>
                                <p>Latency: {Math.round(payload[0].value as number)}ms</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter name="Heatmap" data={heatmapData} fill="#ef4444" fillOpacity={0.6} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
           <Card className="glass-dark border-emerald-500/20 bg-emerald-500/5 text-emerald-400 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase">Kyber Security</span>
                  <span className="text-xs">Post-Quantum Tunnel Active</span>
                </div>
              </div>
           </Card>
           <Card className="glass-dark border-blue-500/20 bg-blue-500/5 text-blue-400 p-4">
              <div className="flex items-center gap-3">
                <Zap className="size-5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase">I/O Burst Mode</span>
                  <span className="text-xs">Prioritizing Windows-11-Prod</span>
                </div>
              </div>
           </Card>
        </div>
      </div>
    </AppLayout>
  );
}