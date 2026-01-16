import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { History, Share2, Binary, Radio, KeyRound, ShieldCheck, Globe } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { CosmosExportPanel } from '@/components/CosmosExportPanel';
import type { ApiResponse, ProjectState } from '@shared/types';
export function Singularity() {
  const queryClient = useQueryClient();
  const [isForging, setIsForging] = useState(false);
  const [forgeStep, setForgeStep] = useState(0);
  const { data: state } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      if (!json.success || !json.data) throw new Error("Sync failure");
      return json.data;
    }
  });
  const timebendMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/timebend/revert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId: id })
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("State Recursion Successful");
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    }
  });
  const forgeMutation = useMutation({
    mutationFn: async () => {
      setIsForging(true);
      for(let i=1; i<=3; i++) {
        setForgeStep(i);
        await new Promise(r => setTimeout(r, 1500));
      }
      return fetch('/api/export-iso', { method: 'POST' }).then(r => r.json());
    },
    onSuccess: () => {
      toast.success("AppOS Wormhole: ISO Forged");
      setIsForging(false);
      setForgeStep(0);
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    }
  });
  const timebend = state?.timebend ?? [];
  const entropy = state?.singularity?.quantumEntropy ?? 0;
  return (
    <AppLayout className="bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 uppercase italic leading-none">Singularity</h1>
              <p className="text-purple-400 font-mono text-xs tracking-[0.4em] uppercase">Threshold Crossing Active</p>
            </div>
            <div className="flex gap-4">
               <Badge variant="outline" className="h-8 border-rose-500/50 text-rose-400 font-mono animate-pulse uppercase">ENTROPY: {entropy.toFixed(4)}</Badge>
            </div>
          </div>
          <Tabs defaultValue="cosmos" className="w-full">
            <TabsList className="bg-slate-900/50 border border-white/10 p-1 w-full sm:w-auto">
              <TabsTrigger value="cosmos" className="text-[10px] uppercase font-black px-8">GitHub Cosmos</TabsTrigger>
              <TabsTrigger value="timebend" className="text-[10px] uppercase font-black px-8">Timebend Mirror</TabsTrigger>
              <TabsTrigger value="wormhole" className="text-[10px] uppercase font-black px-8">AppOS Wormhole</TabsTrigger>
              <TabsTrigger value="kyber" className="text-[10px] uppercase font-black px-8">Kyber Quantum</TabsTrigger>
            </TabsList>
            <TabsContent value="cosmos" className="pt-8 animate-fade-in">
              <CosmosExportPanel />
            </TabsContent>
            <TabsContent value="timebend" className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timebend.map((h) => (
                  <Card key={h.id} className="glass-dark border-white/10 hover:border-blue-500/40 transition-all group">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <History className="size-5 text-blue-500" />
                        <div>
                          <p className="text-xs font-bold text-white uppercase">{h.label}</p>
                          <p className="text-[9px] text-slate-500 font-mono">{new Date(h.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-[9px] uppercase font-black border-blue-500/20 hover:bg-blue-600"
                        onClick={() => timebendMutation.mutate(h.id)}
                        disabled={timebendMutation.isPending}
                      >Revert</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="wormhole" className="pt-6">
               <Card className="glass-dark border-white/10 p-12 text-center space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      animate={isForging ? { rotate: 360, scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="size-24 rounded-full bg-blue-600/20 border-2 border-blue-500/50 flex items-center justify-center shadow-glow"
                    >
                      <Binary className="size-10 text-blue-400" />
                    </motion.div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Wormhole Forge</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto uppercase tracking-wide">Generate a singularity-level AppOS ISO for immediate multi-node deployment.</p>
                  </div>
                  <div className="max-w-lg mx-auto bg-black/40 p-6 rounded-xl border border-white/5 space-y-4">
                    <Progress value={isForging ? (forgeStep / 3) * 100 : 0} className="h-1 bg-slate-800" />
                    <Button
                      onClick={() => forgeMutation.mutate()}
                      disabled={isForging}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-500 font-black uppercase tracking-widest mt-4"
                    >
                      {isForging ? "FORGING..." : "INITIATE FORGE"}
                    </Button>
                  </div>
               </Card>
            </TabsContent>
            <TabsContent value="kyber" className="pt-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="glass-dark border-rose-500/20 p-8 space-y-4">
                     <div className="flex items-center gap-2 text-rose-400"><KeyRound className="size-5" /><span className="text-xs font-bold uppercase tracking-widest">Quantum Tunnel</span></div>
                     <div className="h-24 bg-black/60 rounded flex items-center justify-center relative overflow-hidden">
                        <motion.div animate={{ x: [-200, 200] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute w-12 h-full bg-rose-500/10 blur-2xl" />
                        <span className="text-[10px] font-mono text-rose-300">AES-NI ACCELERATED</span>
                     </div>
                  </Card>
                  <Card className="glass-dark border-emerald-500/20 p-8 space-y-4">
                     <div className="flex items-center gap-2 text-emerald-400"><ShieldCheck className="size-5" /><span className="text-xs font-bold uppercase tracking-widest">Integrity Pool</span></div>
                     <div className="h-24 bg-black/60 rounded flex items-center justify-center">
                        <Radio className="size-8 text-emerald-500/30 animate-pulse" />
                     </div>
                  </Card>
               </div>
            </TabsContent>
          </Tabs>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
             <Card className="glass-dark border-white/10 text-white p-6">
                <CardHeader className="p-0 mb-4"><CardTitle className="text-[10px] uppercase text-slate-500 tracking-widest">Neural Stream</CardTitle></CardHeader>
                <div className="h-24 flex items-center justify-center bg-black/40 rounded-xl overflow-hidden">
                   {Array.from({ length: 12 }).map((_, i) => (
                     <motion.div
                       key={i}
                       animate={{ height: [10, 60, 20], opacity: [0.1, 0.3, 0.1] }}
                       transition={{ duration: 1 + i*0.1, repeat: Infinity }}
                       className="w-2 bg-purple-500 mx-0.5 rounded-full"
                     />
                   ))}
                </div>
             </Card>
             <Card className="glass-dark border-blue-500/20 bg-blue-600/5 p-6 space-y-4 col-span-2">
                 <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-blue-400 italic">Singularity Export Engine</h4>
                    <Globe className="size-4 text-blue-500 animate-pulse" />
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                       <span className="text-[8px] text-slate-500 uppercase font-bold">Node Sync</span>
                       <div className="text-xs font-mono text-blue-400">100.0%</div>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[8px] text-slate-500 uppercase font-bold">Entropy Pool</span>
                       <div className="text-xs font-mono text-blue-400">ALIGNING</div>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[8px] text-slate-500 uppercase font-bold">PWA Sync</span>
                       <div className="text-xs font-mono text-emerald-400">ACTIVE</div>
                    </div>
                 </div>
                 <Button className="w-full h-10 bg-white/5 border border-white/10 text-[10px] uppercase font-black tracking-widest mt-2">
                    <Share2 className="size-3 mr-2" /> Broadcast Config to Cosmos
                 </Button>
             </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}