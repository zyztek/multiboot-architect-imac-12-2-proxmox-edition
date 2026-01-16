import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, HardDrive, Activity, Network, Zap, ShieldCheck, LifeBuoy } from 'lucide-react';
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
    refetchInterval: 5000
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
  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Booting Mission Control...</div>;
  const chartData = [
    { time: '10:00', cpu: 25, mem: 40 },
    { time: '10:05', cpu: 45, mem: 42 },
    { time: '10:10', cpu: 30, mem: 45 },
    { time: '10:15', cpu: state?.hostStats?.cpu_usage ?? 35, mem: state?.hostStats?.mem_usage ?? 48 },
  ];
  return (
    <AppLayout container className="bg-slate-950">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">Mission Control</h1>
            <p className="text-slate-400 mt-1">iMac 12,2 Sandy Bridge Hypervisor</p>
          </div>
          <div className="flex gap-2">
             <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-slate-900 border-white/10 text-slate-300">
                  <LifeBuoy className="size-4 mr-2" /> Troubleshoot Logs
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Analyze System Logs</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Textarea
                    placeholder="Paste dmesg or journalctl output here..."
                    className="bg-black/50 border-white/10 h-40 font-mono text-xs"
                    value={logs}
                    onChange={(e) => setLogs(e.target.value)}
                  />
                  {troubleshootResult && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
                      {troubleshootResult}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button onClick={handleTroubleshoot} className="bg-blue-600 hover:bg-blue-500">Analyze</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <ShieldCheck className="size-3 mr-2" /> Tailscale Active
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-slate-900 border-white/10 text-white shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Host Performance</CardTitle>
                <CardDescription>Real-time Telemetry</CardDescription>
              </div>
              <div className="flex gap-4 font-mono">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">CPU</div>
                  <div className="text-lg text-blue-400">{Math.round(state?.hostStats?.cpu_usage ?? 0)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">MEM</div>
                  <div className="text-lg text-emerald-400">{state?.hostStats?.mem_usage ?? 0}%</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[250px] w-full pt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                    <YAxis stroke="#475569" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', color: '#fff' }} />
                    <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" />
                    <Area type="monotone" dataKey="mem" stroke="#10b981" fillOpacity={0} />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-white/10 text-white">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <Activity className="size-5 text-blue-500" />
                  <span className="text-sm">Proxmox PVE</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">ONLINE</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <HardDrive className="size-5 text-emerald-500" />
                  <span className="text-sm">ZFS Pool</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">{state?.hostStats?.zfs_health ?? 'ONLINE'}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <Network className="size-5 text-purple-500" />
                  <span className="text-sm">PBS Backups</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Last: 2h ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/proxmox" className="p-6 bg-slate-900 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all group">
            <Activity className="size-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold">VM Dashboard</h3>
            <p className="text-xs text-slate-500 mt-1">Manage running guests</p>
          </Link>
          <Link to="/tools" className="p-6 bg-slate-900 border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all group">
            <Zap className="size-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold">AI Architect</h3>
            <p className="text-xs text-slate-500 mt-1">Smart VM Provisioning</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}