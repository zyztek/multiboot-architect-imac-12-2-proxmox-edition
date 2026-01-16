import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Orbit, Loader2, Activity, Zap, Server, Heart, Infinity as InfinityIcon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { globalVoiceEngine } from '@/lib/voice-engine';
import { OracleCommander } from '@/components/OracleCommander';
import type { ApiResponse, ProjectState } from '@shared/types';
export function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: state } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      if (!res.ok) throw new Error("Network offline");
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data || null;
    },
    refetchInterval: 5000,
  });
  const singularityMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/singularity/one-click', { method: 'POST' });
      return res.json();
    },
    onSuccess: () => {
      toast.success("SINGULARITY THRESHOLD ACHIEVED");
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    }
  });
  useEffect(() => {
    globalVoiceEngine.registerCommand('singularity', () => navigate('/singularity'));
    return () => { globalVoiceEngine.unregisterCommand('singularity'); };
  }, [navigate]);
  const checklist = state?.checklist ?? [];
  const completed = checklist.filter(Boolean).length;
  const progress = (completed / 300) * 100;
  return (
    <AppLayout className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-12">
        <div className="relative h-[450px] w-full flex items-center justify-center overflow-hidden rounded-[40px] border border-white/10 bg-black/60 shadow-glass">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
           <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="size-72 border border-white/5 rounded-full flex items-center justify-center relative"
              >
                <div className="absolute inset-0 border-t-2 border-blue-500/20 rounded-full animate-spin-slow" />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="size-48 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-glow-lg cursor-pointer"
                  onClick={() => navigate('/singularity')}
                >
                  <Orbit className="size-20 text-blue-400 floating" />
                  <div className="absolute -bottom-4 bg-blue-600 text-[8px] font-black uppercase tracking-tighter px-3 py-1 rounded-full">Heartbeat Active</div>
                </motion.div>
              </motion.div>
              <div className="mt-12">
                <h1 className="text-7xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-600">Galaxy Core</h1>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <InfinityIcon className="size-4 text-blue-500" />
                  <p className="text-blue-500 font-mono text-[9px] tracking-[0.6em] uppercase">Eternal Self-Evolving Codex</p>
                </div>
              </div>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-dark border-white/10 text-white col-span-1 md:col-span-2 overflow-hidden">
            <CardHeader className="pb-2 border-b border-white/5">
              <CardTitle className="text-[10px] uppercase text-blue-400 flex items-center justify-between font-black italic">
                <div className="flex items-center gap-2">
                   <Activity className="size-3" /> Swarm & Evolution Ticker
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                   <Heart className="size-3 animate-pulse" /> ALIVE
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-40 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10" />
              <div className="p-4 space-y-2 animate-slide-up-slow">
                {state?.evolutionQueue?.length ? state.evolutionQueue.map((task, i) => (
                  <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-blue-300/60">
                    <span className="text-blue-500">[{new Date().toLocaleTimeString()}]</span>
                    <span>{task}</span>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
                    <Activity className="size-4 animate-ping" />
                    <span className="text-[9px] uppercase font-bold tracking-widest">Ambient Sync in progress...</span>
                  </div>
                )}
                {state?.orchestrationLog?.slice(-5).map((log, i) => (
                   <div key={`log-${i}`} className="flex items-center gap-3 text-[10px] font-mono text-emerald-400/60">
                     <span className="text-emerald-500">{" >> "}</span>
                     <span>{log}</span>
                   </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="glass-dark border-purple-500/20 bg-purple-500/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase text-purple-400 flex items-center gap-2">
                <Sparkles className="size-3" /> Evolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-black font-mono">{state?.customCodex?.length ?? 0}</div>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Custom Primitives Commited</p>
              <Button onClick={() => navigate('/universe')} variant="ghost" className="h-6 text-[9px] uppercase font-black text-purple-400 hover:bg-purple-400/10 w-full p-0">View Codex</Button>
            </CardContent>
          </Card>
          <Card className="glass-dark border-blue-500/20 bg-blue-600/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase text-blue-400 flex items-center gap-2">
                <Server className="size-3" /> Integrity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-black font-mono">{(state?.singularity?.quantumEntropy ? 100 - state.singularity.quantumEntropy : 99.8).toFixed(1)}%</div>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Stable Sync Active</p>
            </CardContent>
          </Card>
        </div>
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-6">
           <div className="glass-dark border border-white/10 p-4 rounded-full flex items-center gap-6 shadow-glow-lg">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase text-slate-500 px-1">
                  <span>Eternal Loop Convergence</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-1 bg-white/5" />
              </div>
              <Button
                onClick={() => singularityMutation.mutate()}
                disabled={singularityMutation.isPending || progress >= 100}
                className="bg-blue-600 hover:bg-blue-500 h-12 px-8 rounded-full text-xs font-black uppercase tracking-widest shadow-blue-500/20 shadow-lg"
              >
                {singularityMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <InfinityIcon className="size-4" />}
              </Button>
           </div>
        </div>
      </div>
      <OracleCommander />
    </AppLayout>
  );
}