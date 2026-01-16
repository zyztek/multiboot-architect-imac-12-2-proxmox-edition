import React, { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { generateScript } from '@/lib/script-generator';
import { Copy, Terminal, Download, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, ProjectState, ScriptMode, VmConfig } from '@shared/types';
export function ArchitectTools() {
  const queryClient = useQueryClient();
  const { data: projectState } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    }
  });
  const mutation = useMutation({
    mutationFn: async (newState: ProjectState) => {
      const res = await fetch('/api/project-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newState)
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
      toast.success("Architectural state persisted to cloud");
    }
  });
  const [win11, setWin11] = useState(200);
  const [kali, setKali] = useState(100);
  const [fyde, setFyde] = useState(100);
  const [mode, setMode] = useState<ScriptMode>('usb');
  const [usbDrive, setUsbDrive] = useState("E:");
  const [isoPath, setIsoPath] = useState("C:\\ISOs\\proxmox-ve-8.iso");
  const [diskId, setDiskId] = useState("local-zfs");
  useEffect(() => {
    if (projectState?.storage) {
      setWin11(projectState.storage.win11);
      setKali(projectState.storage.kali);
      setFyde(projectState.storage.fyde);
    }
  }, [projectState]);
  const total = 1000;
  const shared = Math.max(0, total - win11 - kali - fyde);
  const vms: VmConfig[] = useMemo(() => [
    { vmid: 100, name: 'Windows11-Prod', cores: 4, memory: 8192, diskId, hasTpm: true, gpuPassthrough: true },
    { vmid: 101, name: 'Kali-Security', cores: 4, memory: 4096, diskId, hasTpm: false, gpuPassthrough: false },
    { vmid: 102, name: 'openFyde-Cloud', cores: 2, memory: 4096, diskId, hasTpm: false, gpuPassthrough: false },
  ], [diskId]);
  const chartData = useMemo(() => [
    { name: 'Windows 11', value: win11, color: '#3b82f6' },
    { name: 'Kali Linux', value: kali, color: '#10b981' },
    { name: 'openFyde', value: fyde, color: '#f59e0b' },
    { name: 'Shared Data', value: shared, color: '#64748b' },
  ], [win11, kali, fyde, shared]);
  const script = useMemo(() => generateScript({
    mode,
    usbDrive,
    isoPath,
    storage: { win11, kali, fyde, shared },
    diskId,
    vms
  }), [mode, usbDrive, isoPath, win11, kali, fyde, shared, diskId, vms]);
  const copyScript = () => {
    navigator.clipboard.writeText(script);
    toast.success("Script copied to clipboard");
  };
  const handleSave = () => {
    if (!projectState) return;
    mutation.mutate({
      ...projectState,
      storage: { win11, kali, fyde, shared }
    });
  };
  return (
    <AppLayout container className="bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
        <div className="space-y-8">
          <Card className="bg-slate-900 border-white/10 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calculator className="size-5 text-blue-500" /> Partition Architect</CardTitle>
              <CardDescription>Allocate the 1TB iMac SSD</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label>Windows 11 ({win11}GB)</Label></div>
                <Slider value={[win11]} onValueChange={(v) => setWin11(v[0])} max={500} step={10} className="[&>span]:bg-blue-500" />
                <div className="flex justify-between items-center"><Label>Kali Linux ({kali}GB)</Label></div>
                <Slider value={[kali]} onValueChange={(v) => setKali(v[0])} max={300} step={5} className="[&>span]:bg-emerald-500" />
                <div className="flex justify-between items-center"><Label>openFyde ({fyde}GB)</Label></div>
                <Slider value={[fyde]} onValueChange={(v) => setFyde(v[0])} max={200} step={5} className="[&>span]:bg-orange-500" />
              </div>
              <div className="pt-4 border-t border-white/5 text-center">
                <div className="h-[200px] w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} stroke="none">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm font-bold text-slate-400">Available Shared Pool: <span className="text-emerald-400">{shared} GB</span></p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card className="bg-slate-900 border-white/10 text-white shadow-xl h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Terminal className="size-5 text-emerald-500" /> Script Forge</CardTitle>
              <CardDescription>Generate Proxmox & Provisioning Scripts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col">
              <Tabs value={mode} onValueChange={(v) => setMode(v as ScriptMode)} className="w-full">
                <TabsList className="bg-slate-800 border-white/5 w-full">
                  <TabsTrigger value="usb" className="flex-1">USB</TabsTrigger>
                  <TabsTrigger value="zfs-setup" className="flex-1">ZFS</TabsTrigger>
                  <TabsTrigger value="vm-create" className="flex-1">VMs</TabsTrigger>
                </TabsList>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {mode === 'usb' && (
                    <>
                      <div className="space-y-2"><Label>Drive Letter</Label><Input value={usbDrive} onChange={e => setUsbDrive(e.target.value)} className="bg-slate-800 border-white/10" /></div>
                      <div className="space-y-2"><Label>ISO Path</Label><Input value={isoPath} onChange={e => setIsoPath(e.target.value)} className="bg-slate-800 border-white/10" /></div>
                    </>
                  )}
                  {(mode === 'zfs-setup' || mode === 'vm-create') && (
                    <div className="col-span-2 space-y-2"><Label>Storage ID (Proxmox)</Label><Input value={diskId} onChange={e => setDiskId(e.target.value)} className="bg-slate-800 border-white/10" /></div>
                  )}
                </div>
              </Tabs>
              <div className="relative mt-4 flex-1 min-h-[300px]">
                <pre className="absolute inset-0 bg-black/50 p-4 rounded-lg text-[11px] font-mono text-emerald-400/90 overflow-auto border border-white/5 whitespace-pre-wrap">
                  {script}
                </pre>
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-white" onClick={copyScript}><Copy className="size-4" /></Button>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 mt-4" onClick={handleSave} disabled={mutation.isPending}>
                <Download className="size-4 mr-2" /> {mutation.isPending ? "Persisting..." : "Export Configuration"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}