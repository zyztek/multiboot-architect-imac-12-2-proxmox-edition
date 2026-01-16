import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, Activity, Zap, ShieldCheck, Thermometer, Box, TrendingUp, Sparkles, Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ApiResponse, ProjectState, SensorData } from '@shared/types';
export function HomePage() {
  const { data: state } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    },
    refetchInterval: 5000
  });
  const { data: sensors } = useQuery({
    queryKey: ['sensors'],
    queryFn: async () => {
      const res = await fetch('/api/sensors');
      const json = await res.json() as ApiResponse<SensorData>;
      return json.data;
    },
    refetchInterval: 2000
  });
  const vms = state?.vms ?? [];
  return (
    <AppLayout container className="bg-slate-950 text-slate-100 overflow-hidden">
      <div className="space-y-12 relative">
        {/* Galaxy Brain Hero Section */}
        <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-glow-lg">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
           {/* Simulated 3D VM Orbits */}
           <div className="relative w-full h-full flex items-center justify-center">
              {vms.map((vm, i) => (
                <motion.div
                  key={vm.vmid}
                  animate={{
                    rotate: 360,
                    x: [100 * Math.cos(i), -100 * Math.cos(i), 100 * Math.cos(i)],
                    y: [50 * Math.sin(i), -50 * Math.sin(i), 50 * Math.sin(i)],
                  }}
                  transition={{
                    rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
                    x: { duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 8 + i * 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute"
                >
                  <div className="p-3 glass-dark border-white/20 rounded-xl flex flex-col items-center gap-1 shadow-2xl backdrop-blur-xl">
                    <Box className="size-5 text-blue-400" />
                    <span className="text-[10px] font-mono text-white/80">{vm.name}</span>
                  </div>
                </motion.div>
              ))}
              <div className="center flex-col z-10 text-center space-y-2">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="size-24 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center backdrop-blur-3xl"
                >
                  <Orbit className="size-10 text-blue-400 animate-spin-slow" />
                </motion.div>
                <h1 className="text-5xl font-display font-black tracking-tighter text-white">GALAXY BRAIN</h1>
                <p className="text-blue-400 font-mono text-xs uppercase tracking-widest">Autonomous Cluster Orchestrator</p>
              </div>
           </div>
        </div>
        {/* Real-time Sensors & ML Prediction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-dark border-white/10 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2 text-rose-400">
                <Thermometer className="size-4" /> Thermal Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="text-2xl font-bold font-mono">{Math.round(sensors?.temp_cpu ?? 0)}°C</div>
                  <div className="text-[10px] text-slate-500 uppercase">CPU Die Temp</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-2xl font-bold font-mono text-rose-500">{Math.round(sensors?.temp_gpu ?? 0)}°C</div>
                  <div className="text-[10px] text-slate-500 uppercase">Radeon 6970M</div>
                </div>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-rose-500" 
                  animate={{ width: `${(sensors?.temp_cpu ?? 0)}%` }}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-dark border-white/10 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2 text-emerald-400">
                <Zap className="size-4" /> Power Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold font-mono text-emerald-400">{Math.round(sensors?.power_draw ?? 0)}W</div>
              <p className="text-[10px] text-slate-500">Sandy Bridge Idle Efficiency: 82%</p>
              <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold">
                <TrendingUp className="size-3" /> STABLE LOAD
              </div>
            </CardContent>
          </Card>
          <Card className="glass-dark border-blue-500/30 bg-blue-600/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2 text-blue-400">
                <Sparkles className="size-4" /> Predictive Scale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-slate-300 leading-tight bg-black/30 p-3 rounded-lg border border-white/5">
                "Thermal creep detected on pve-imac-01. Recommend migrating <b>Kali-Lab</b> to pve-imac-02 within 2 hours."
              </div>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-[10px] h-7">
                Execute Migration
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/orchestrator" className="p-6 glass-dark border-white/10 rounded-2xl hover:border-blue-500/50 transition-all group">
            <Box className="size-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-sm">Orchestrator</h3>
            <p className="text-[10px] text-slate-500 uppercase mt-1">Helm & K8s</p>
          </Link>
          <Link to="/proxmox" className="p-6 glass-dark border-white/10 rounded-2xl hover:border-emerald-500/50 transition-all group">
            <Activity className="size-8 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-sm">Cluster View</h3>
            <p className="text-[10px] text-slate-500 uppercase mt-1">Multi-Node Hub</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}