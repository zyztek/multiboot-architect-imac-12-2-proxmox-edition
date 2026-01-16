import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { History, ShieldAlert, Cpu, Sparkles, Orbit, Loader2, Activity, Zap, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { globalVoiceEngine } from '@/lib/voice-engine';
import { OracleCommander } from '@/components/OracleCommander';
import type { ApiResponse, ProjectState, OracleMetrics } from '@shared/types';
export function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: state, isError: stateError } = useQuery({
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
        <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden rounded-[40px] border border-white/10 bg-black/60 shadow-glass">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
           <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="size-64 border border-white/5 rounded-full flex items-center justify-center relative"
              >
                <div className="absolute inset-0 border-t-2 border-blue-500/20 rounded-full animate-spin" />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="size-40 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-glow-lg cursor-pointer"
                  onClick={() => navigate('/singularity')}
                >
                  <Orbit className="size-16 text-blue-400 floating" />
                </motion.div>
              </motion.div>
              <div className="mt-8">
                <h1 className="text-6xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-600">Galaxy Core</h1>
                <p className="text-blue-500 font-mono text-[9px] tracking-[0.6em] uppercase mt-2">Infinity Robust End-Game v1.0</p>
              </div>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-dark border-white/10 text-white col-span-1 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase text-blue-400 flex items-center gap-2 font-black italic">
                <Activity className="size-3" /> Swarm Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {state?.fleet?.slice(0, 4).map(node => (
                  <div key={node.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400">{node.name}</span>
                      <span className="text-[8px] font-mono text-blue-500">{node.ip}</span>
                    </div>
                    <Badge variant="outline" className={`text-[7px] border-emerald-500/20 text-emerald-400 ${node.status === 'online' ? 'animate-pulse' : 'opacity-30'}`}>
                      {node.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="glass-dark border-emerald-500/20 bg-emerald-500/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase text-emerald-400 flex items-center gap-2">
                <Zap className="size-3" /> Integrity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-black font-mono">99.8%</div>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Robust-X Ready</p>
            </CardContent>
          </Card>
          <Card className="glass-dark border-blue-500/20 bg-blue-600/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase text-blue-400 flex items-center gap-2">
                <Server className="size-3" /> Nodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-black font-mono">{state?.fleet?.length ?? 0}</div>
              <Button onClick={() => navigate('/proxmox')} variant="ghost" className="h-6 text-[9px] uppercase font-black text-blue-400 hover:bg-blue-400/10 w-full">Control Stack</Button>
            </CardContent>
          </Card>
        </div>
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-6">
           <div className="glass-dark border border-white/10 p-4 rounded-full flex items-center gap-6 shadow-glow-lg">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase text-slate-500 px-1">
                  <span>Singularity Alignment</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-1 bg-white/5" />
              </div>
              <Button
                onClick={() => singularityMutation.mutate()}
                disabled={singularityMutation.isPending || progress >= 100}
                className="bg-blue-600 hover:bg-blue-500 h-12 px-8 rounded-full text-xs font-black uppercase tracking-widest shadow-blue-500/20 shadow-lg"
              >
                {singularityMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              </Button>
           </div>
        </div>
      </div>
      <OracleCommander />
    </AppLayout>
  );
}