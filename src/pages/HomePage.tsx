import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, HardDrive, ArrowRight, Activity, Network, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, ProjectState } from '@shared/types';
export function HomePage() {
  const { data: state, isLoading } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    }
  });
  const isIommuOn = state?.checklist?.[6] ?? false;
  const isZfsReady = state?.checklist?.[7] ?? false;
  // Storage fallback values
  const winSize = state?.storage?.win11 ?? 200;
  const kaliSize = state?.storage?.kali ?? 100;
  const fydeSize = state?.storage?.fyde ?? 100;
  const sharedSize = state?.storage?.shared ?? 600;
  const totalSize = winSize + kaliSize + fydeSize + sharedSize;
  const getPercent = (val: number) => (val / totalSize) * 100;
  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Booting Mission Control...</div>;
  }
  return (
    <AppLayout container className="bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">Mission Control</h1>
            <p className="text-slate-400 mt-1">MultiBoot Hypervisor Status Dashboard</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={`px-3 py-1 ${isIommuOn ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
              <Zap className="size-3 mr-2" /> IOMMU {isIommuOn ? 'ENABLED' : 'PENDING'}
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1">
              <Activity className="size-3 mr-2" /> System Ready
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-white/10 text-white shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Cpu className="size-20" /></div>
            <CardHeader>
              <CardTitle>Hardware Profile</CardTitle>
              <CardDescription className="text-slate-400">iMac 12,2 (Mid 2011)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">CPU</span><span className="font-mono text-sm">Core i7-2600</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">GPU</span><span className="font-mono text-sm text-orange-400">Radeon 6970M</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">ZFS Pool</span><Badge variant="secondary" className={`text-[10px] ${isZfsReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>{isZfsReady ? 'ONLINE' : 'PENDING'}</Badge></div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-white/10 text-white shadow-2xl">
            <CardHeader>
              <HardDrive className="size-8 text-emerald-500 mb-2" />
              <CardTitle>SSD Allocation</CardTitle>
              <CardDescription className="text-slate-400">Target 1TB ZFS Hierarchy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${getPercent(winSize)}%` }} />
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${getPercent(kaliSize)}%` }} />
                  <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${getPercent(fydeSize)}%` }} />
                  <div className="h-full bg-slate-600 transition-all duration-500" style={{ width: `${getPercent(sharedSize)}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] font-mono">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Win11 ({winSize}GB)</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Kali ({kaliSize}GB)</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /> Fyde ({fydeSize}GB)</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> Shared ({sharedSize}GB)</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-white/10 text-white shadow-2xl">
            <CardHeader>
              <Network className="size-8 text-purple-500 mb-2" />
              <CardTitle>Network Bridge</CardTitle>
              <CardDescription className="text-slate-400">VirtIO Internal Switching</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 leading-relaxed">
                Guest-to-Guest traffic routed via <code className="text-purple-400">vmbr0</code> at virtual 10Gbps line speeds. Hardware Broadcom BCM57765 handling uplink.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/report" className="group">
            <Card className="bg-slate-900/50 border-white/5 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">Intelligence Report <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" /></CardTitle>
                <CardDescription>Driver manuals & EFI workarounds</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/tools" className="group">
            <Card className="bg-slate-900/50 border-white/5 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">Architect Tools <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" /></CardTitle>
                <CardDescription>Multi-mode script generation</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/protocol" className="group">
            <Card className="bg-slate-900/50 border-white/5 hover:border-orange-500/50 hover:bg-slate-900 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">Deployment Protocol <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" /></CardTitle>
                <CardDescription>Interactive 15-step checklist</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}