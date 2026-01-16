import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, HardDrive, Activity, Network, Zap, ShieldCheck, LifeBuoy, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { ApiResponse, ProjectState } from '@shared/types';
import { toast } from 'sonner';
export function HomePage() {
  const [logs, setLogs] = useState('');
  const [troubleshootResult, setTroubleshootResult] = useState('');
  const { data: state, isLoading } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    },
    refetchInterval: 10000
  });
  const handleTroubleshoot = async () => {
    try {
      const res = await fetch('/api/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs })
      });
      const json = await res.json();
      setTroubleshootResult(json.data.suggestion);
      toast.info("Analysis complete");
    } catch (e) {
      toast.error("Analysis failed");
    }
  };
  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono">BOOTING MULTIBOOT_ARCH...</div>;
  const chartData = [
    { time: '10:00', cpu: 15, mem: 35 },
    { time: '10:05', cpu: 28, mem: 38 },
    { time: '10:10', cpu: 22, mem: 40 },
    { time: '10:15', cpu: Math.round(state?.hostStats?.cpu_usage ?? 35), mem: state?.hostStats?.mem_usage ?? 48 },
  ];
  return (
    <AppLayout container className="bg-slate-950 text-slate-100">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tighter">MISSION CONTROL</h1>
            <p className="text-slate-400 mt-1 font-mono text-xs uppercase tracking-widest">iMac 12,2 Sandy Bridge • Proxmox v8.1</p>
          </div>
          <div className="flex gap-2">
             <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="glass border-white/10 text-slate-300 hover:bg-white/10">
                  <LifeBuoy className="size-4 mr-2" /> Debug logs
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="font-display tracking-tight">System Log Intelligence</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Textarea
                    placeholder="Paste dmesg or pve logs..."
                    className="bg-black/50 border-white/10 h-40 font-mono text-xs placeholder:text-slate-700"
                    value={logs}
                    onChange={(e) => setLogs(e.target.value)}
                  />
                  {troubleshootResult && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300 animate-in fade-in slide-in-from-top-2">
                      <Zap className="size-4 inline mr-2" /> {troubleshootResult}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button onClick={handleTroubleshoot} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">Analyze Fault</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Badge variant="outline" className="glass text-emerald-400 border-emerald-500/20 px-3">
              <ShieldCheck className="size-3 mr-2" /> Tailscale
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 glass-dark border-white/10 text-white shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-white/5 border-b border-white/5">
              <div>
                <CardTitle className="text-lg">Host Telemetry</CardTitle>
                <CardDescription className="text-[10px] uppercase font-mono">Live Node Performance</CardDescription>
              </div>
              <div className="flex gap-6 font-mono">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">CPU LOAD</div>
                  <div className="text-xl text-blue-400 font-bold">{Math.round(state?.hostStats?.cpu_usage ?? 0)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">MEM USED</div>
                  <div className="text-xl text-emerald-400 font-bold">{state?.hostStats?.mem_usage ?? 0}%</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[280px] w-full pt-8">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                    <Area type="monotone" dataKey="mem" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card className="glass-dark border-white/10 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="size-4 text-orange-500" /> Disk Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>WINDOWS 11</span>
                    <span>{state?.storage?.win11}GB</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(state?.storage?.win11 ?? 0) / 10}%` }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>KALI LAB</span>
                    <span>{state?.storage?.kali}GB</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(state?.storage?.kali ?? 0) / 10}%` }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>SHARED DATA</span>
                    <span>{state?.storage?.shared}GB</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500" style={{ width: `${(state?.storage?.shared ?? 0) / 10}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-dark border-white/10 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Health Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="size-3 text-emerald-500" /> PVE Kernel
                  </div>
                  <span className="text-emerald-500 font-bold">READY</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <HardDrive className="size-3 text-emerald-500" /> ZFS Health
                  </div>
                  <span className="text-emerald-500 font-bold">ONLINE</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Network className="size-3" /> Backups
                  </div>
                  <span className="text-slate-500">2H AGO</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/proxmox" className="p-6 glass-dark border-white/10 rounded-xl hover:border-blue-500/50 transition-all group shadow-lg">
            <Activity className="size-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white">VM Management</h3>
            <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">Control Guest Lifecycle</p>
          </Link>
          <Link to="/tools" className="p-6 glass-dark border-white/10 rounded-xl hover:border-emerald-500/50 transition-all group shadow-lg">
            <Zap className="size-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white">Architect Tools</h3>
            <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">AI Script Engine</p>
          </Link>
          <Link to="/protocol" className="p-6 glass-dark border-white/10 rounded-xl hover:border-orange-500/50 transition-all group shadow-lg">
            <ShieldCheck className="size-8 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white">Deployment</h3>
            <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">20-Step Checklist</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}