import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Activity, Zap, Thermometer, Box, Orbit, Mic, History, Calendar, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { ApiResponse, ProjectState } from '@shared/types';
export function HomePage() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(100);
  const { data: state } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    },
    refetchInterval: 5000
  });
  const vms = state?.vms ?? [];
  const snapshots = state?.snapshots ?? [];
  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) toast.info("Voice Codex Active: Listen for commands...");
    else toast.success("Voice Engine Standby");
  };
  return (
    <AppLayout container className="bg-slate-950 text-slate-100 overflow-hidden">
      <div className="space-y-12 relative">
        <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-glow-lg">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent)]" />
           <div className="relative w-full h-full flex items-center justify-center">
              {vms.map((vm, i) => (
                <motion.div
                  key={vm.vmid}
                  animate={{
                    rotate: 360,
                    x: [150 * Math.cos(i), -150 * Math.cos(i), 150 * Math.cos(i)],
                    y: [100 * Math.sin(i), -100 * Math.sin(i), 100 * Math.sin(i)],
                  }}
                  transition={{
                    rotate: { duration: 15 + i * 2, repeat: Infinity, ease: "linear" },
                    x: { duration: 8 + i, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute"
                >
                  <div className="p-3 glass-dark border-purple-500/20 rounded-xl flex flex-col items-center gap-1 shadow-2xl backdrop-blur-3xl">
                    <Box className="size-5 text-purple-400" />
                    <span className="text-[10px] font-mono text-white/80">{vm.name}</span>
                  </div>
                </motion.div>
              ))}
              <div className="center flex-col z-10 text-center space-y-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="size-32 rounded-full bg-purple-600/20 border-2 border-purple-500/50 flex items-center justify-center backdrop-blur-3xl"
                >
                  <Orbit className="size-16 text-purple-400 animate-spin-slow" />
                </motion.div>
                <h1 className="text-6xl font-display font-black tracking-tighter text-white uppercase italic">Singularity Brain</h1>
                <p className="text-purple-400 font-mono text-xs uppercase tracking-[0.5em]">Post-Human Hive Orchestrator</p>
              </div>
           </div>
           <div className="absolute top-4 right-4">
              <Button 
                variant="outline" 
                onClick={toggleVoice}
                className={`h-10 px-4 gap-2 border-white/10 ${isVoiceActive ? 'bg-purple-600 border-purple-400 animate-pulse' : 'bg-black/40'}`}
              >
                <Mic className={`size-4 ${isVoiceActive ? 'text-white' : 'text-purple-400'}`} />
                <span className="text-[10px] font-bold uppercase">{isVoiceActive ? 'VOICE LISTENING' : 'VOICE CODEX'}</span>
              </Button>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-dark border-white/10 text-white">
            <CardHeader className="pb-2"><CardTitle className="text-xs flex items-center gap-2 text-rose-400"><Thermometer className="size-4" /> Thermal Singularity</CardTitle></CardHeader>
            <CardContent className="space-y-2">
               <div className="text-3xl font-bold font-mono">42.4°C</div>
               <p className="text-[10px] text-slate-500">Cluster Avg. Delta: +1.2C</p>
               <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-rose-500" initial={{ width: 0 }} animate={{ width: '42%' }} />
               </div>
            </CardContent>
          </Card>
          <Card className="glass-dark border-purple-500/30 bg-purple-600/5 text-white">
            <CardHeader className="pb-2"><CardTitle className="text-xs flex items-center gap-2 text-purple-400"><Zap className="size-4" /> Hive Potential</CardTitle></CardHeader>
            <CardContent className="space-y-2">
               <div className="text-3xl font-bold font-mono">94.8%</div>
               <p className="text-[10px] text-slate-500">Cross-Node Throughput: 42 Gbps</p>
               <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold"><ShieldCheck className="size-3" /> SWARM INTEGRITY: HIGH</div>
            </CardContent>
          </Card>
          <Card className="glass-dark border-blue-500/30 bg-blue-600/5 text-white">
            <CardHeader className="pb-2"><CardTitle className="text-xs flex items-center gap-2 text-blue-400"><History className="size-4" /> Time Mirror</CardTitle></CardHeader>
            <CardContent className="space-y-3">
               <div className="text-[10px] text-slate-400 leading-tight bg-black/30 p-2 rounded border border-white/5">
                  Showing Snapshot: <b>{snapshots[0]?.label || 'Initial'}</b>
               </div>
               <Slider value={[timelineIndex]} onValueChange={(v) => setTimelineIndex(v[0])} max={100} className="py-2" />
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
           <Link to="/singularity" className="flex-shrink-0 w-64 p-6 glass-dark border-purple-500/30 rounded-2xl hover:bg-purple-600/10 transition-all group ring-1 ring-purple-500/20 shadow-glow">
              <Orbit className="size-8 text-purple-500 mb-2 group-hover:rotate-180 transition-transform duration-1000" />
              <h3 className="font-bold text-sm text-white">Singularity View</h3>
              <p className="text-[10px] text-purple-400 uppercase mt-1">Swarm & AR Control</p>
           </Link>
           <Link to="/universe" className="flex-shrink-0 w-64 p-6 glass-dark border-blue-500/30 rounded-2xl hover:bg-blue-600/10 transition-all group">
              <Calendar className="size-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-sm text-white">Universe Codex</h3>
              <p className="text-[10px] text-blue-400 uppercase mt-1">300 Technical Primitives</p>
           </Link>
        </div>
      </div>
    </AppLayout>
  );
}