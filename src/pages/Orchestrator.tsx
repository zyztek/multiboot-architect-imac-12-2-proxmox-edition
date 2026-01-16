import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Box, Terminal, Zap, ShieldCheck, Cpu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, ProjectState } from '@shared/types';
import { generateScript } from '@/lib/script-generator';
export function Orchestrator() {
  const { data: state } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    }
  });
  const helmYaml = generateScript({ mode: 'helm', vms: state?.vms });
  return (
    <AppLayout container className="bg-slate-950">
      <div className="space-y-8 animate-fade-in">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Orchestration Layer</h1>
          <p className="text-slate-500 text-xs font-mono tracking-widest mt-1 uppercase">Kubernetes • Helm • Cloud-Init</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-dark border-white/10 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-400">
                  <Layers className="size-5" /> Helm Provisioner
                </CardTitle>
                <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase border-white/10">Rebuild values.yaml</Button>
              </CardHeader>
              <CardContent>
                 <div className="relative group">
                    <pre className="bg-black/60 p-6 rounded-xl border border-white/5 text-blue-300/90 font-mono text-xs overflow-auto h-[400px]">
                      {helmYaml}
                    </pre>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-blue-600 h-8">Apply Cluster</Button>
                    </div>
                 </div>
              </CardContent>
            </Card>
            <Card className="glass-dark border-white/10 text-white">
              <CardHeader><CardTitle className="text-sm uppercase text-slate-500">Live Kubectl Apply Preview</CardTitle></CardHeader>
              <CardContent>
                 <div className="bg-black p-4 rounded-lg font-mono text-[10px] space-y-1">
                    <div className="text-emerald-400">$ kubectl apply -f imac-tsunami.yaml</div>
                    <div className="text-slate-500">namespace/tsunami-prod created</div>
                    <div className="text-slate-500">deployment.apps/win11-gateway created</div>
                    <div className="text-slate-500">service/fyde-internal-lb created</div>
                    <div className="text-emerald-400 cursor-blink">_</div>
                 </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="glass-dark border-white/10 text-white">
              <CardHeader><CardTitle className="text-xs uppercase text-slate-500">K8s Resource Map</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Box className="size-4 text-blue-500" /><span className="text-xs">Pods Active</span></div>
                    <span className="font-mono text-xs">12 / 12</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Cpu className="size-4 text-emerald-500" /><span className="text-xs">CPU Reservation</span></div>
                    <span className="font-mono text-xs">850m</span>
                 </div>
                 <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[65%]" />
                 </div>
              </CardContent>
            </Card>
            <Card className="glass-dark border-white/10 text-white bg-blue-600/5">
              <CardHeader><CardTitle className="text-sm text-blue-400">Tsunami Synergy</CardTitle></CardHeader>
              <CardContent className="text-[10px] text-slate-400 space-y-3">
                 <p>Automated persistent volume claims are currently bound to <b>ZFS Pool rpool/data</b> via the Proxmox-CSI driver.</p>
                 <div className="flex items-center gap-2 text-emerald-400 font-bold">
                   <ShieldCheck className="size-3" /> CSI-DRIVER ONLINE
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}