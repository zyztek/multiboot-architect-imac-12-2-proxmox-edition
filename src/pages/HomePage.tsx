import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Orbit, Mic, History, ShieldAlert, Cpu, Sparkles, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { globalVoiceEngine } from '@/lib/voice-engine';
import type { ApiResponse, ProjectState, OracleMetrics } from '@shared/types';
export function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { data: state } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    },
    refetchInterval: 3000
  });
  const { data: oracle } = useQuery({
    queryKey: ['oracle-predict'],
    queryFn: async () => {
      const res = await fetch('/api/oracle/predict', { method: 'POST' });
      const json = await res.json() as ApiResponse<OracleMetrics>;
      return json.data;
    },
    refetchInterval: 10000
  });
  const singularityMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/singularity/one-click', { method: 'POST' });
      return res.json();
    },
    onSuccess: () => {
      toast.success("SINGULARITY THRESHOLD ACHIEVED: 300 Primitives Online");
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    }
  });
  useEffect(() => {
    globalVoiceEngine.registerCommand('singularity', () => navigate('/singularity'));
    globalVoiceEngine.registerCommand('revert', () => toast.info("Timebend Mirror Initialized"));
  }, [navigate]);
  const checklist = state?.checklist ?? [];
  const completed = checklist.filter(Boolean).length;
  const progress = (completed / 300) * 100;
  return (
    <AppLayout className="bg-slate-950 text-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10 relative">
          {/* GALAXY TREE VISUALIZATION */}
          <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden rounded-[40px] border border-white/10 bg-black/60 shadow-glass">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
             {/* Infinity Nodes */}
             <div className="absolute inset-0">
                {Array.from({ length: 150 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.2, 1],
                      x: Math.random() * 1000 - 500,
                      y: Math.random() * 800 - 400
                    }}
                    transition={{ duration: 10 + Math.random() * 20, repeat: Infinity }}
                    className="absolute size-1 bg-blue-500/40 rounded-full blur-[1px]"
                  />
                ))}
             </div>
             <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="size-80 border border-white/5 rounded-full flex items-center justify-center relative"
                >
                  <div className="absolute inset-0 border-t-2 border-blue-500/30 rounded-full animate-spin" />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="size-48 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-glow-lg cursor-pointer"
                    onClick={() => navigate('/singularity')}
                  >
                    <Orbit className="size-20 text-blue-400 floating" />
                  </motion.div>
                </motion.div>
                <div className="mt-8 space-y-2">
                  <h1 className="text-7xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">Galaxy Core</h1>
                  <p className="text-blue-400 font-mono text-[10px] tracking-[0.6em] uppercase">Infinity Robust Architecture v1.0</p>
                </div>
             </div>
             <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="space-y-4 w-64">
                   <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>Sync Integrity</span>
                      <span>{progress.toFixed(1)}%</span>
                   </div>
                   <Progress value={progress} className="h-1 bg-white/5" />
                </div>
                <Button
                  onClick={() => singularityMutation.mutate()}
                  disabled={singularityMutation.isPending || progress >= 100}
                  className="bg-blue-600 hover:bg-blue-500 h-14 px-8 rounded-full text-xs font-black uppercase tracking-widest shadow-blue-500/20 shadow-lg"
                >
                  <Sparkles className="size-4 mr-2" /> One-Click Singularity
                </Button>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-dark border-white/10 text-white col-span-1">
              <CardHeader className="pb-2"><CardTitle className="text-[10px] uppercase text-slate-500 flex items-center gap-2"><History className="size-3" /> Timebend Mirror</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                 <div className="text-2xl font-black font-mono">-{state?.timebend.length ?? 0}s</div>
                 <p className="text-[9px] text-slate-500 uppercase">Recursion Points Active</p>
                 <Button variant="outline" size="sm" className="w-full h-7 text-[9px] border-white/5 bg-white/5" onClick={() => navigate('/singularity')}>Time-Travel</Button>
              </CardContent>
            </Card>
            <Card className="glass-dark border-orange-500/30 bg-orange-500/5 text-white col-span-2">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] uppercase text-orange-400 flex items-center gap-2"><ShieldAlert className="size-3" /> Oracle Chaos Prediction</CardTitle>
                <Badge variant="outline" className="text-[8px] border-orange-500/30 text-orange-400">STABILITY: {99 - (oracle?.chaosProbability ?? 0) * 100}%</Badge>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                 <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase">Thermal Saturation</span>
                    <div className="text-lg font-bold font-mono text-orange-300">{(oracle?.thermalSaturation ?? 0).toFixed(1)}°C</div>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase">Driver Entropy</span>
                    <div className="text-lg font-bold font-mono text-orange-300">{(oracle?.chaosProbability ?? 0).toFixed(4)}</div>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase">Cloud Cost</span>
                    <div className="text-lg font-bold font-mono text-orange-300">${oracle?.costEstimate ?? 0}/mo</div>
                 </div>
              </CardContent>
            </Card>
            <Card className="glass-dark border-blue-500/30 bg-blue-500/5 text-white col-span-1">
              <CardHeader className="pb-2"><CardTitle className="text-[10px] uppercase text-blue-400 flex items-center gap-2"><Cpu className="size-3" /> Infinity Kernel</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                 <div className="text-2xl font-black font-mono">LOCKED</div>
                 <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold"><Wand2 className="size-3 animate-pulse" /> WAITING FOR SINGULARITY</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}