import React, { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { History, Share2, Binary, Radio, KeyRound, ShieldCheck, Globe, Zap, Cpu, Activity, Server } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { CosmosExportPanel } from '@/components/CosmosExportPanel';
import { OracleCommander } from '@/components/OracleCommander';
import type { ApiResponse, ProjectState } from '@shared/types';
export function Singularity() {
  const queryClient = useQueryClient();
  const [isForging, setIsForging] = useState(false);
  const [forgeStep, setForgeStep] = useState(0);
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);
  const { data: state } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data || null;
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
      if (isMounted.current) setIsForging(true);
      for(let i=1; i<=3; i++) {
        if (!isMounted.current) break;
        setForgeStep(i);
        await new Promise(r => setTimeout(r, 1500));
      }
      if (!isMounted.current) return null;
      return fetch('/api/export-iso', { method: 'POST' }).then(r => r.json());
    },
    onSuccess: (data) => {
      if (!data || !isMounted.current) return;
      toast.success("Wormhole Forge Complete: Multi-Format ISO/RAW Ready");
      setIsForging(false);
      setForgeStep(0);
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    },
    onSettled: () => {
      if (isMounted.current) setIsForging(false);
    }
  });
  const timebend = state?.timebend ?? [];
  const entropy = state?.singularity?.quantumEntropy ?? 0;
  const checklist = state?.checklist ?? [];
  const completedCount = checklist.filter(Boolean).length;
  return (
    <AppLayout className="bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 uppercase italic leading-none">Singularity</h1>
              <p className="text-purple-400 font-mono text-xs tracking-[0.4em] uppercase">Post-Human Finality Engine</p>
            </div>
            <div className="flex gap-4">
               <Badge variant="outline" className="h-8 border-rose-500/50 text-rose-400 font-mono animate-pulse uppercase">ENTROPY: {entropy.toFixed(6)}</Badge>
               <Badge variant="outline" className="h-8 border-emerald-500/50 text-emerald-400 font-mono uppercase italic">STATUS: EVOLVING</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3 glass-dark border-white/10 overflow-hidden">
               <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between">
                  <CardTitle className="text-[10px] uppercase tracking-widest text-slate-500">Singularity Matrix (300 Units)</CardTitle>
                  <span className="text-xs font-mono text-blue-400">{completedCount}/300</span>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="grid grid-cols-15 md:grid-cols-30 gap-1">
                     {Array.from({ length: 300 }).map((_, i) => (
                       <motion.div
                         key={i}
                         initial={{ opacity: 0.1 }}
                         animate={{ 
                           opacity: checklist[i] ? 1 : 0.2,
                           backgroundColor: checklist[i] ? '#3b82f6' : '#1e293b',
                           boxShadow: checklist[i] ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
                         }}
                         className="aspect-square rounded-[1px] cursor-help"
                       />
                     ))}
                  </div>
               </CardContent>
            </Card>
            <Card className="glass-dark border-white/10 text-white">
               <CardHeader><CardTitle className="text-[10px] uppercase text-blue-400 flex items-center gap-2"><Activity className="size-3" /> Eternal Heartbeat</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                  <div className="h-32 bg-black/40 rounded border border-white/5 p-3 font-mono text-[8px] overflow-auto space-y-1 text-emerald-400/80">
                     {state?.orchestrationLog?.slice(-8).map((log, i) => (
                       <div key={i} className="flex gap-2"><span>{">>"}</span><span>{log}</span></div>
                     ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500">
                    <span>Cron Oracle</span>
                    <span className="text-blue-400">SYNCED</span>
                  </div>
               </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="cosmos" className="w-full">
            <TabsList className="bg-slate-900/50 border border-white/10 p-1 w-full sm:w-auto overflow-x-auto">
              <TabsTrigger value="cosmos" className="text-[10px] uppercase font-black px-8">GitHub Cosmos</TabsTrigger>
              <TabsTrigger value="timebend" className="text-[10px] uppercase font-black px-8">Timebend</TabsTrigger>
              <TabsTrigger value="wormhole" className="text-[10px] uppercase font-black px-8">Wormhole Forge</TabsTrigger>
              <TabsTrigger value="kyber" className="text-[10px] uppercase font-black px-8">Quantum Kyber</TabsTrigger>
            </TabsList>
            <TabsContent value="cosmos" className="pt-8 animate-fade-in">
              <CosmosExportPanel />
            </TabsContent>
            <TabsContent value="timebend" className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timebend.map((h, i) => (
                  <Card key={h.id} className="glass-dark border-white/10 hover:border-blue-500/40 transition-all group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <History className="size-5 text-blue-500" />
                        <div>
                          <p className="text-xs font-bold text-white uppercase">{h.label}</p>
                          <p className="text-[9px] text-slate-500 font-mono">{new Date(h.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-[9px] uppercase font-black border-blue-500/20" onClick={() => timebendMutation.mutate(h.id)}>Revert</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="wormhole" className="pt-6">
               <Card className="glass-dark border-white/10 p-12 text-center space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <motion.div animate={isForging ? { rotate: 360, scale: [1, 1.1, 1] } : {}} className="size-24 rounded-full bg-blue-600/20 border-2 border-blue-500/50 flex items-center justify-center shadow-glow">
                      <Binary className="size-10 text-blue-400" />
                    </motion.div>
                    <h3 className="text-xl font-black uppercase tracking-tight">AppOS Wormhole Forge</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto uppercase tracking-wide italic">Target formats: .ISO, .QCOW2, .RAW (OCLP Injected)</p>
                  </div>
                  <div className="max-w-lg mx-auto bg-black/40 p-6 rounded-xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 mb-1">
                      <span>{isForging ? `Layer ${forgeStep} Recursive Injection` : "Wormhole Ready"}</span>
                      <span>{isForging ? `${Math.round((forgeStep/3)*100)}%` : "0%"}</span>
                    </div>
                    <Progress value={isForging ? (forgeStep / 3) * 100 : 0} className="h-1 bg-slate-800" />
                    <Button onClick={() => forgeMutation.mutate()} disabled={isForging} className="w-full h-12 bg-blue-600 hover:bg-blue-500 font-black uppercase tracking-widest shadow-lg">
                      {isForging ? "SYNTHESIZING..." : "INITIATE FULL FORMAT FORGE"}
                    </Button>
                  </div>
               </Card>
            </TabsContent>
            <TabsContent value="kyber" className="pt-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="glass-dark border-rose-500/20 p-8 space-y-4 text-center">
                     <KeyRound className="size-8 text-rose-500 mx-auto" />
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-400">Post-Quantum Tunnel</h4>
                     <p className="text-[9px] text-slate-500 italic">Kyber-1024 / AES-NI Hardware Shield Active</p>
                  </Card>
                  <Card className="glass-dark border-emerald-500/20 p-8 space-y-4 text-center">
                     <ShieldCheck className="size-8 text-emerald-500 mx-auto" />
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Integrity Pool</h4>
                     <p className="text-[9px] text-slate-500 italic">Self-Healing Hash Registry: 100% Consistent</p>
                  </Card>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <OracleCommander />
    </AppLayout>
  );
}