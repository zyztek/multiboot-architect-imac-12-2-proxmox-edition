import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { History, Binary, KeyRound, ShieldCheck, Activity, Zap, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { CosmosExportPanel } from '@/components/CosmosExportPanel';
import { OracleCommander } from '@/components/OracleCommander';
import type { ApiResponse, ProjectState } from '@shared/types';
const SingularityNode = React.memo(({ isActive, index, isGlitching }: { isActive: boolean; index: number; isGlitching: boolean }) => (
  <motion.div
    initial={false}
    animate={{
      opacity: isActive ? 1 : 0.2,
      backgroundColor: isActive ? (index % 2 === 0 ? '#00ffff' : '#ff00ff') : '#1e293b',
      boxShadow: isActive ? `0 0 10px ${index % 2 === 0 ? '#00ffff' : '#ff00ff'}` : 'none',
      x: isGlitching ? [0, Math.random() * 2 - 1, 0] : 0,
      y: isGlitching ? [0, Math.random() * 2 - 1, 0] : 0,
    }}
    transition={{ duration: 0.3, x: { repeat: Infinity, duration: 0.1 } }}
    className="aspect-square rounded-[1px] min-h-[4px]"
  />
));
SingularityNode.displayName = 'SingularityNode';
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
    },
    refetchInterval: 5000,
  });
  const checklist = useMemo(() => state?.checklist ?? [], [state?.checklist]);
  const completedCount = useMemo(() => checklist.filter(Boolean).length, [checklist]);
  const isComplete = completedCount >= 300;
  const forgeMutation = useMutation({
    mutationFn: async () => {
      if (isMounted.current) setIsForging(true);
      for(let i = 1; i <= 3; i++) {
        if (!isMounted.current) break;
        setForgeStep(i);
        await new Promise(r => setTimeout(r, 1000));
      }
      return fetch('/api/singularity/one-click', { method: 'POST' }).then(r => r.json());
    },
    onSuccess: (data) => {
      if (!data || !isMounted.current) return;
      toast.success("SINGULARITY THRESHOLD REALIZED");
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ffff', '#ff00ff', '#ffd700']
      });
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    },
    onSettled: () => {
      if (isMounted.current) {
        setIsForging(false);
        setForgeStep(0);
      }
    }
  });
  return (
    <AppLayout container className="bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-rose-400 uppercase italic">Singularity</h1>
            <p className="text-purple-400 font-mono text-xs tracking-[0.5em] uppercase">Post-Human Deployment Hub</p>
          </div>
          <div className="flex gap-3">
             <Badge variant="outline" className={`h-8 border-rose-500/50 text-rose-400 font-mono uppercase ${isComplete ? 'animate-pulse' : ''}`}>
               ENTROPY: {state?.singularity?.quantumEntropy.toFixed(6) ?? '0.000000'}
             </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-3 glass-dark border-white/10 overflow-hidden relative">
            {isComplete && <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />}
            <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] uppercase tracking-widest text-slate-500 italic">Central Matrix</CardTitle>
              <span className="text-xs font-mono text-blue-400">{completedCount}/300 Nodes</span>
            </CardHeader>
            <CardContent className="p-8">
               <div className="grid grid-cols-15 md:grid-cols-30 gap-2">
                  {Array.from({ length: 300 }).map((_, i) => (
                    <SingularityNode key={i} index={i} isActive={!!checklist[i]} isGlitching={isComplete} />
                  ))}
               </div>
            </CardContent>
          </Card>
          <Card className="glass-dark border-white/10 text-white flex flex-col">
            <CardHeader>
              <CardTitle className="text-[10px] uppercase text-blue-400 flex items-center gap-2 italic">
                <Activity className="size-3" /> Eternal Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
               <div className="h-48 bg-black/60 rounded-xl border border-white/5 p-4 font-mono text-[9px] overflow-auto space-y-1 text-emerald-400/80">
                  {state?.orchestrationLog?.slice(-12).map((log, i) => (
                    <div key={i} className="truncate">
                      <span className="opacity-40">{" >> "}</span> {log}
                    </div>
                  ))}
               </div>
               <div className="pt-4 space-y-2">
                 <div className="flex justify-between text-[9px] font-black uppercase text-slate-500"><span>Integrity</span><span>99.9%</span></div>
                 <Progress value={99.9} className="h-1 bg-slate-900" />
               </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="cosmos" className="w-full">
          <TabsList className="bg-slate-900/50 border border-white/10 p-1 w-full sm:w-auto h-12">
            <TabsTrigger value="cosmos" className="px-10 text-[10px] uppercase font-black">GitHub Cosmos</TabsTrigger>
            <TabsTrigger value="wormhole" className="px-10 text-[10px] uppercase font-black">Wormhole Forge</TabsTrigger>
          </TabsList>
          <TabsContent value="cosmos" className="pt-10"><CosmosExportPanel /></TabsContent>
          <TabsContent value="wormhole" className="pt-10">
             <Card className="glass-dark border-white/10 p-20 text-center">
                <div className="max-w-md mx-auto space-y-8">
                  <motion.div animate={isForging ? { rotate: 360, scale: [1, 1.2, 1] } : {}} className="size-32 rounded-full border-2 border-blue-500/30 flex items-center justify-center mx-auto bg-blue-600/5 shadow-glow">
                    <Binary className="size-12 text-blue-400" />
                  </motion.div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Full Stack Forge</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest leading-relaxed">Synthesize all 300 technical primitives into a single production deployment archive.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] uppercase font-black text-slate-400">
                      <span>{isForging ? `Level ${forgeStep} Recursion` : "Idle"}</span>
                      <span>{isForging ? `${Math.round((forgeStep/3)*100)}%` : "0%"}</span>
                    </div>
                    <Progress value={isForging ? (forgeStep/3)*100 : 0} className="h-1.5 bg-slate-900" />
                    <Button
                      onClick={() => forgeMutation.mutate()}
                      disabled={isForging || isComplete}
                      className="w-full h-14 bg-blue-600 hover:bg-blue-500 font-black uppercase tracking-widest shadow-glow text-xs"
                    >
                      {isForging ? "FORGING INFINITY..." : isComplete ? "SINGULARITY REACHED" : "INITIATE ENDGAME FORGE"}
                    </Button>
                  </div>
                </div>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
      <OracleCommander />
    </AppLayout>
  );
}