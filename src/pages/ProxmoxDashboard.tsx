import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Square, Terminal, Server, LayoutGrid, Fingerprint, ShieldCheck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OracleCommander } from '@/components/OracleCommander';
import type { ApiResponse, ProjectState, ClusterNode } from '@shared/types';
import { toast } from 'sonner';
export function ProxmoxDashboard() {
  const queryClient = useQueryClient();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const { data: state, isLoading } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data || null;
    }
  });
  const vmActionMutation = useMutation({
    mutationFn: async ({ vmid, action }: { vmid: number, action: 'start' | 'stop' }) => {
      const res = await fetch('/api/proxmox/vm/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vmid, action })
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
      toast.success("VM command dispatched to node");
    }
  });
  if (isLoading) return <div className="p-12 text-center text-slate-500 font-mono uppercase italic tracking-widest">Scanning cluster nodes...</div>;
  const nodes = state?.nodes ?? [];
  const vms = state?.vms?.filter(vm => !selectedNode || vm.node === selectedNode) ?? [];
  return (
    <AppLayout container className="bg-slate-950">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Cluster Control</h1>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em]">Tsunami Orchestration Layer v2.0</p>
          </div>
          <div className="flex gap-2">
            {nodes.map((node: ClusterNode) => (
              <Button
                key={node.id}
                onClick={() => setSelectedNode(node.name === selectedNode ? null : node.name)}
                variant={selectedNode === node.name ? 'default' : 'outline'}
                className={`h-9 glass border-white/10 text-[10px] font-bold uppercase transition-all duration-300 ${node.status === 'offline' ? 'opacity-50' : ''}`}
              >
                <Server className={`size-3 mr-2 ${node.status === 'online' ? 'text-emerald-400' : 'text-slate-500'}`} /> {node.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <Card className="lg:col-span-1 glass-dark border-white/10 text-white">
             <CardHeader>
               <CardTitle className="text-[10px] uppercase text-slate-500 tracking-widest flex items-center gap-2 italic">
                 <LayoutGrid className="size-3" /> ZFS Health Grid
               </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded ${i === 7 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'} opacity-80`} />
                  ))}
                </div>
                <div className="mt-4 p-3 bg-black/40 rounded border border-white/5 space-y-2">
                   <div className="flex justify-between text-[9px] uppercase font-bold"><span>POOL</span><span className="text-emerald-400">rpool-01</span></div>
                   <div className="flex justify-between text-[9px] uppercase font-bold"><span>STATUS</span><span className="text-amber-400 italic">SCRUBBING</span></div>
                </div>
             </CardContent>
           </Card>
           <Card className="lg:col-span-3 glass-dark border-white/10 text-white overflow-hidden shadow-2xl">
             <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-slate-500 text-[10px] uppercase">Node & Identity</TableHead>
                    <TableHead className="text-slate-500 text-[10px] uppercase">STATUS</TableHead>
                    <TableHead className="text-slate-500 text-[10px] uppercase">RESOURCES</TableHead>
                    <TableHead className="text-right text-slate-500 text-[10px] uppercase">OPERATIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vms.map((vm) => (
                    <TableRow key={vm.vmid} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell>
                        <div className="font-bold text-slate-200 text-xs uppercase flex items-center gap-2">
                          {vm.name}
                          <Badge variant="outline" className="text-[7px] border-emerald-500/20 text-emerald-400 px-1 flex items-center gap-1">
                            <Fingerprint className="size-2" /> 0x{vm.vmid.toString(16)}...Q
                          </Badge>
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono uppercase">Node: {vm.node} / ID: {vm.vmid}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`size-1.5 rounded-full ${vm.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                          <span className="text-[9px] uppercase font-black italic">{vm.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[9px] font-mono text-slate-400 uppercase">{vm.cores} vCPU / {vm.memory / 1024}GB</div>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => vmActionMutation.mutate({ vmid: vm.vmid, action: vm.status === 'running' ? 'stop' : 'start' })}>
                          {vm.status === 'running' ? <Square className="size-3 text-rose-400" /> : <Play className="size-3 text-emerald-400" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-white"><Terminal className="size-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
           </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-dark border-blue-500/20 bg-blue-500/5 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="size-5 text-blue-400" />
              <h3 className="text-sm font-black uppercase tracking-widest italic">Quantum Identity Active</h3>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-wider">
              All cluster nodes are verified using a distributed NFT registry. Any node instability detected by Oracle AI will trigger an immediate identity re-verification protocol.
            </p>
          </Card>
        </div>
      </div>
      <OracleCommander />
    </AppLayout>
  );
}