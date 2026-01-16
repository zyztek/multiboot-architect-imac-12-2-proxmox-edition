import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, HardDrive, Monitor, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export function HomePage() {
  return (
    <AppLayout container className="bg-slate-950">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">Mission Control</h1>
            <p className="text-slate-400 mt-1">iMac 12,2 Virtualization Strategy Hub</p>
          </div>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1">
            <Activity className="size-3 mr-2" /> System Ready
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-white/10 text-white shadow-2xl">
            <CardHeader>
              <Cpu className="size-8 text-blue-500 mb-2" />
              <CardTitle>Hardware Profile</CardTitle>
              <CardDescription className="text-slate-400">iMac 12,2 (Mid 2011)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">CPU</span>
                <span className="font-mono">Intel Core i7-2600</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">GPU</span>
                <span className="font-mono text-orange-400">AMD Radeon HD 6970M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">RAM</span>
                <span className="font-mono">32GB DDR3</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-white/10 text-white shadow-2xl">
            <CardHeader>
              <HardDrive className="size-8 text-emerald-500 mb-2" />
              <CardTitle>Storage Plan</CardTitle>
              <CardDescription className="text-slate-400">1TB SSD + ZFS Pool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-500" style={{ width: '25%' }} />
                  <div className="h-full bg-emerald-500" style={{ width: '15%' }} />
                  <div className="h-full bg-orange-500" style={{ width: '10%' }} />
                  <div className="h-full bg-slate-600" style={{ width: '50%' }} />
                </div>
                <div className="flex flex-wrap gap-3 mt-4 text-[10px] font-mono">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500" /> Win11</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500" /> Kali</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500" /> openFyde</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-600" /> Shared</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-white/10 text-white shadow-2xl">
            <CardHeader>
              <ShieldCheck className="size-8 text-purple-500 mb-2" />
              <CardTitle>Hypervisor Status</CardTitle>
              <CardDescription className="text-slate-400">Proxmox VE 8.x</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sandy Bridge support verified. KVM hardware virtualization enabled. EFI booting requires custom GRUB parameters.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/report" className="group">
            <Card className="bg-slate-900 border-white/10 hover:border-blue-500/50 transition-all group-hover:bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Intelligence Report <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>Driver links & GPU passthrough guides</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/tools" className="group">
            <Card className="bg-slate-900 border-white/10 hover:border-emerald-500/50 transition-all group-hover:bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Architect Tools <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>Partition calculator & script generator</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/protocol" className="group">
            <Card className="bg-slate-900 border-white/10 hover:border-orange-500/50 transition-all group-hover:bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Deployment Protocol <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>Interactive step-by-step checklist</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}