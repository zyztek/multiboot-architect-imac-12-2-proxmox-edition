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
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data || null;
    },
    refetchInterval: 10000,
  });
  const singularityMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/singularity/one-click', { method: 'POST' });
      return res.json();
    },
    onSuccess: () => {
      toast.success("SINGULARITY THRESHOLD ACHIEVED: 300/300 NODES ALIGNED");
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
  const isComplete = completed >= 300;
  return (
    <AppLayout className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-16 pb-32">
        <div className="relative h-[540px] w-full flex items-center justify-center overflow-hidden rounded-[50px] border border-white/10 bg-black/40 shadow-2xl glass3d">
           <div className={`absolute inset-0 transition-opacity duration-1000 ${isComplete ? 'opacity-30' : 'opacity-10'} bg-[radial-gradient(circle_at_50%_50%,#3b82f6,transparent)]`} />
           <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                transition={{ 
                  opacity: { duration: 1 },
                  rotate: { duration: 180, repeat: Infinity, ease: "linear" } 
                }}
                className="size-80 border border-white/5 rounded-full flex items-center justify-center relative"
              >
                <div className={`absolute inset-0 border-t-2 ${isComplete ? 'border-purple-500' : 'border-blue-500/20'} rounded-full animate-spin-slow`} />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`size-56 rounded-full bg-gradient-to-br from-cyanNeon/5 to-magentaPulse/5 border border-white/10 flex items-center justify-center backdrop-blur-3xl cursor-pointer transition-shadow duration-1000 ${isComplete ? 'shadow-[0_0_80px_rgba(255,0,255,0.4)]' : 'shadow-glow-lg'}`}
                  onClick={() => navigate('/singularity')}
                >
                  <Orbit className={`size-24 transition-colors duration-1000 ${isComplete ? 'text-purple-400 animate-float' : 'text-blue-400 floating'}`} />
                  <div className={`absolute -bottom-4 ${isComplete ? 'bg-magentaPulse' : 'bg-cyanNeon text-black'} text-[8px] font-black uppercase tracking-tighter px-4 py-1.5 rounded-full shadow-neonGlow`}>
                    {isComplete ? 'Singularity Stabilized' : 'Eternal Heartbeat Active'}
                  </div>
                </motion.div>
              </motion.div>
              <div className="mt-16 space-y-4">
                <h1 className="text-9xl font-black tracking-tighter uppercase italic text-gold drop-shadow-2xl">Galaxy Core</h1>
                <div className="flex items-center justify-center gap-4">
                  <InfinityIcon className="size-4 text-blue-500" />
                  <p className="text-blue-500 font-mono text-[9px] tracking-[0.8em] uppercase">iMac 12,2 Self-Evolving Architect</p>
                </div>
              </div>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-dark border-white/10 text-white col-span-1 md:col-span-2 overflow-hidden">
            <CardHeader className="pb-2 border-b border-white/5">
              <CardTitle className="text-[10px] uppercase text-blue-400 flex items-center justify-between font-black italic">
                <div className="flex items-center gap-2"><Activity className="size-3" /> Evolution Ticker</div>
                <div className="flex items-center gap-2 text-emerald-400"><Heart className="size-3 animate-pulse" /> ETERNAL SELF</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-48 overflow-hidden relative">
              <div className="space-y-2 font-mono text-[9px]">
                {state?.orchestrationLog?.slice(-10).map((log, i) => (
                   <div key={i} className={`flex items-center gap-3 ${log.includes('CRITICAL') ? 'text-purple-400' : 'text-emerald-400/60'}`}>
                     <span className="text-emerald-500/30">{" >> "}</span>
                     <span className="truncate">{log}</span>
                   </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="glass-dark border-purple-500/20 bg-purple-500/5 text-white">
            <CardHeader className="pb-2"><CardTitle className="text-[10px] uppercase text-purple-400 flex items-center gap-2"><Sparkles className="size-3" /> Evolved</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="text-4xl font-black font-mono">{state?.customCodex?.length ?? 0}</div>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Autonomous Primitives Forged</p>
              <Button onClick={() => navigate('/universe')} variant="ghost" className="h-6 text-[9px] uppercase font-black text-purple-400 w-full p-0">Access Archive</Button>
            </CardContent>
          </Card>
          <Card className="glass-dark border-blue-500/20 bg-blue-600/5 text-white">
            <CardHeader className="pb-2"><CardTitle className="text-[10px] uppercase text-blue-400 flex items-center gap-2"><Server className="size-3" /> Stability</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="text-4xl font-black font-mono">100.0%</div>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">ZFS Integrity Verified</p>
            </CardContent>
          </Card>
        </div>
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl px-6">
           <div className={`glass-dark border p-5 rounded-full flex items-center gap-8 shadow-2xl transition-all duration-1000 ${isComplete ? 'border-purple-500/50 shadow-purple-500/20' : 'border-white/10'}`}>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 px-1 italic">
                  <span>Singularity Alignment</span>
                  <span className={isComplete ? 'text-purple-400' : 'text-blue-400'}>{progress.toFixed(2)}%</span>
                </div>
                <Progress value={progress} className={`h-1.5 transition-all ${isComplete ? 'bg-purple-900' : 'bg-white/5'}`} />
              </div>
              <Button
                onClick={() => singularityMutation.mutate()}
                disabled={singularityMutation.isPending || isComplete}
                className={`h-14 px-10 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all ${isComplete ? 'bg-purple-600 text-white' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                {singularityMutation.isPending ? <Loader2 className="size-5 animate-spin" /> : (isComplete ? <Sparkles className="size-5" /> : <InfinityIcon className="size-5" />)}
                <span className="ml-3">{isComplete ? "ENDGAME REACHED" : "INITIATE"}</span>
              </Button>
           </div>
        </div>
      </div>
      <OracleCommander />
    </AppLayout>
  );
}