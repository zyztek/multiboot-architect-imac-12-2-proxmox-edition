import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Square, Terminal, Monitor, MoreVertical, Activity, Cpu, HardDrive, RefreshCcw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, ProjectState } from '@shared/types';
import { toast } from 'sonner';
export function ProxmoxDashboard() {
  const queryClient = useQueryClient();
  const { data: state, isLoading } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
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
      toast.success("Command sent to hypervisor");
    },
    onError: () => toast.error("Failed to send command")
  });
  const refreshStats = () => {
    queryClient.invalidateQueries({ queryKey: ['project-state'] });
    toast.info("Refreshing hypervisor telemetry...");
  };
  if (isLoading) return <div className="p-12 text-center text-slate-500">Connecting to Hypervisor...</div>;
  const vms = state?.vms ?? [];
  return (
    <AppLayout container className="bg-slate-950">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Proxmox Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Node: {state?.apiConfig?.node || 'pve-imac'}</p>
          </div>
          <div className="flex gap-3">
             <Card className="bg-slate-900 border-white/10 p-2 flex items-center gap-4">
                <div className="flex items-center gap-2" title="CPU Load"><Cpu className="size-4 text-blue-500" /><span className="text-xs font-mono text-white">{Math.round(state?.hostStats?.cpu_usage ?? 0)}%</span></div>
                <div className="flex items-center gap-2" title="Memory Used"><Activity className="size-4 text-emerald-500" /><span className="text-xs font-mono text-white">{state?.hostStats?.mem_usage ?? 0}%</span></div>
                <div className="flex items-center gap-2" title="ZFS Health"><HardDrive className="size-4 text-orange-500" /><span className="text-xs font-mono text-white">{state?.hostStats?.zfs_health}</span></div>
             </Card>
             <Button variant="outline" size="icon" onClick={refreshStats} className="bg-slate-900 border-white/10 text-slate-400 hover:text-white">
               <RefreshCcw className="size-4" />
             </Button>
          </div>
        </div>
        <Card className="bg-slate-900 border-white/10 text-white overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-slate-500">ID</TableHead>
                    <TableHead className="text-slate-500">Name</TableHead>
                    <TableHead className="text-slate-500">Status</TableHead>
                    <TableHead className="text-slate-500">Resources</TableHead>
                    <TableHead className="text-slate-500">Network</TableHead>
                    <TableHead className="text-right text-slate-500">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vms.length > 0 ? vms.map((vm) => (
                    <TableRow key={vm.vmid} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-mono text-xs">{vm.vmid}</TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-200">{vm.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{vm.gpuPassthrough ? 'GPU-PASSTHROUGH' : 'VIRTUAL-GFX'}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={vm.status === 'running' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}>
                          {(vm.status ?? 'UNKNOWN').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-[10px] space-y-1">
                          <div className="flex justify-between w-24"><span>CPU</span><span>{vm.cores} vCores</span></div>
                          <div className="flex justify-between w-24"><span>RAM</span><span>{vm.memory / 1024} GB</span></div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="text-xs text-blue-400 font-mono">10.0.0.{vm.vmid}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {vm.status !== 'running' ? (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => vmActionMutation.mutate({ vmid: vm.vmid, action: 'start' })}
                              className="h-8 w-8 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                            >
                              <Play className="size-4" />
                            </Button>
                          ) : (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => vmActionMutation.mutate({ vmid: vm.vmid, action: 'stop' })}
                              className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                            >
                              <Square className="size-4" />
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"><Terminal className="size-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white"><Monitor className="size-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-slate-500">No Virtual Machines configured.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}