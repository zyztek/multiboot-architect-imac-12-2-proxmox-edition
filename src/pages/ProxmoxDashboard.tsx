import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Square, Terminal, Monitor, MoreVertical, Activity, Cpu, HardDrive } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, ProjectState, VmConfig } from '@shared/types';
export function ProxmoxDashboard() {
  const { data: state, isLoading } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    }
  });
  const vms: VmConfig[] = state?.vms ?? [
    { vmid: 100, name: 'Windows-11-Prod', cores: 4, memory: 8192, diskId: 'local-zfs', hasTpm: true, gpuPassthrough: true, status: 'running' },
    { vmid: 101, name: 'Kali-Linux-Node', cores: 4, memory: 4096, diskId: 'local-zfs', hasTpm: false, gpuPassthrough: false, status: 'stopped' },
    { vmid: 102, name: 'openFyde-OS', cores: 2, memory: 4096, diskId: 'local-zfs', hasTpm: false, gpuPassthrough: false, status: 'running' },
  ];
  if (isLoading) return <div className="p-12 text-center text-slate-500">Connecting to Hypervisor...</div>;
  return (
    <AppLayout container className="bg-slate-950">
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Proxmox Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Node: {state?.apiConfig?.node || 'pve-imac'}</p>
          </div>
          <div className="flex gap-3">
             <Card className="bg-slate-900 border-white/10 p-2 flex items-center gap-4">
                <div className="flex items-center gap-2"><Cpu className="size-4 text-blue-500" /><span className="text-xs font-mono text-white">24%</span></div>
                <div className="flex items-center gap-2"><Activity className="size-4 text-emerald-500" /><span className="text-xs font-mono text-white">4.2GB</span></div>
                <div className="flex items-center gap-2"><HardDrive className="size-4 text-orange-500" /><span className="text-xs font-mono text-white">92GB Free</span></div>
             </Card>
          </div>
        </div>
        <Card className="bg-slate-900 border-white/10 text-white">
          <CardContent className="p-0">
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
                {vms.map((vm) => (
                  <TableRow key={vm.vmid} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-mono text-xs">{vm.vmid}</TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-200">{vm.name}</div>
                      <div className="text-[10px] text-slate-500">{vm.gpuPassthrough ? 'GPU-PASSTHROUGH' : 'VIRTUAL-GFX'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={vm.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}>
                        {vm.status?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between w-24"><span>CPU</span><span>{vm.cores} vCores</span></div>
                        <div className="flex justify-between w-24"><span>RAM</span><span>{vm.memory / 1024} GB</span></div>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="text-xs text-blue-400 font-mono">10.0.0.{vm.vmid}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-emerald-500"><Play className="size-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-500"><Square className="size-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white"><Terminal className="size-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400"><MoreVertical className="size-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}