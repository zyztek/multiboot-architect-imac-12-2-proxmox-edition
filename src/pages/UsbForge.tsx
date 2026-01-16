import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, HardDrive, ShieldCheck, Zap, Download, Loader2, Package, Globe, Clock, Info, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiResponse, ProjectState, ForgeJob } from '@shared/types';
export function UsbForge() {
  const queryClient = useQueryClient();
  const [selectedOS, setSelectedOS] = useState<string[]>(['Proxmox', 'Win11']);
  const [testMode, setTestMode] = useState(false);
  const { data: state } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    },
    refetchInterval: 5000
  });
  const forgeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/usb/forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          os: selectedOS, 
          components: ['EFI Patch', 'OpenCore', 'Ventoy-God'],
          isTest: testMode
        })
      });
      return res.json() as Promise<ApiResponse<ForgeJob>>;
    },
    onSuccess: () => {
      toast.success(testMode ? "Production Test Simulation Engaged" : "Remote Forge Initiated");
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    }
  });
  const activeJobs = state?.activeForgeJobs ?? [];
  const BUNDLE_METRICS = [
    { label: "Proxmox 8.2 ISO", size: "3.2GB", status: "VERIFIED" },
    { label: "Windows 11 Pro", size: "5.1GB", status: "PATCHED" },
    { label: "Kali 2024.1", size: "4.0GB", status: "READY" },
    { label: "openFyde 20", size: "2.5GB", status: "SYNCED" },
    { label: "Ventoy Core", size: "50MB", status: "INJECTED" },
  ];
  return (
    <AppLayout container className="bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter uppercase italic perspective-skew">Remote Forge</h1>
            <p className="text-blue-400 font-mono text-[10px] tracking-[0.4em] uppercase">Persistent Cloud Provisioning</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 glass-dark px-4 py-2 rounded-full border border-white/10">
              <span className="text-[10px] font-black uppercase text-slate-500">Prod Test</span>
              <Checkbox checked={testMode} onCheckedChange={(v) => setTestMode(!!v)} />
            </div>
            <Badge variant="outline" className="h-8 border-rose-500/50 text-rose-400 font-mono uppercase italic animate-pulse">Production Grade</Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="glass-dark border-white/10 text-white overflow-hidden shadow-2xl glass3d">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-xs uppercase text-blue-400 font-black flex items-center gap-2">
                  <Package className="size-4" /> New Bundle Forge
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">OS Selection</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Proxmox', 'Win11', 'Kali', 'openFyde'].map(os => (
                      <div key={os} className="flex items-center space-x-3 bg-black/40 p-3 rounded-lg border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => selectedOS.includes(os) ? setSelectedOS(selectedOS.filter(x => x !== os)) : setSelectedOS([...selectedOS, os])}>
                        <Checkbox checked={selectedOS.includes(os)} onCheckedChange={() => {}} />
                        <label className="text-[11px] font-bold uppercase cursor-pointer select-none">{os}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="bg-slate-900 border-white/5 w-full grid grid-cols-2 h-10">
                    <TabsTrigger value="features" className="text-[10px] font-black uppercase">Features</TabsTrigger>
                    <TabsTrigger value="apps" className="text-[10px] font-black uppercase">Apps</TabsTrigger>
                  </TabsList>
                  <TabsContent value="features" className="space-y-2 pt-4">
                     {['EFI Patches (iMac 12,2)', 'nomodeset Flags', 'WSL2 Support', 'WSA (Android) Support', 'Nested Hyper-V'].map(f => (
                       <div key={f} className="flex justify-between items-center text-[10px] p-2 bg-blue-600/5 border border-blue-500/10 rounded">
                         <span className="text-slate-400 uppercase">{f}</span>
                         <Badge variant="outline" className="text-[8px] h-4 border-emerald-500/30 text-emerald-400">ENABLED</Badge>
                       </div>
                     ))}
                  </TabsContent>
                  <TabsContent value="apps" className="space-y-2 pt-4">
                    {['Rufus 4.5', 'Ventoy 1.0.97', 'VirtIO v0.2.2', 'WinPE Guest-Agent'].map(app => (
                      <div key={app} className="flex justify-between items-center text-[10px] p-2 bg-magentaPulse/5 border border-magentaPulse/10 rounded">
                        <span className="text-slate-400 uppercase">{app}</span>
                        <Badge variant="outline" className="text-[8px] h-4 border-magentaPulse/30 text-magentaPulse">AUTO-INJECT</Badge>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
                <Button
                  onClick={() => forgeMutation.mutate()}
                  disabled={forgeMutation.isPending || selectedOS.length === 0}
                  className={`w-full h-14 font-black text-xs uppercase tracking-[0.2em] shadow-glow-lg transition-all
                    ${testMode ? 'bg-magentaPulse hover:bg-magentaPulse/80' : 'bg-blue-600 hover:bg-blue-500'}
                  `}
                >
                  {forgeMutation.isPending ? <Loader2 className="animate-spin size-5 mr-3" /> : (testMode ? <ShieldAlert className="size-5 mr-3" /> : <Globe className="size-5 mr-3" />)}
                  {forgeMutation.isPending ? "SYNTHESIZING..." : (testMode ? "Engage Prod Test" : "Commence Remote Forge")}
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-7 space-y-6">
             <Card className="glass-dark border-white/10 text-white shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                <CardHeader className="bg-white/5 border-b border-white/5 py-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 italic">
                    <Clock className="size-4" /> Production Queue
                  </CardTitle>
                  <div className="flex gap-2">
                     <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-[9px]">TOTAL BUNDLE: 15.0GB</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4 flex-1 overflow-auto">
                   {testMode && (
                     <div className="space-y-3 mb-6 p-4 bg-black/60 border border-emerald-500/20 rounded-2xl">
                        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase mb-2">
                           <Info className="size-3" /> Deep Inspection Metrics
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                           {BUNDLE_METRICS.map(m => (
                             <div key={m.label} className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/5">
                                <div className="flex flex-col">
                                   <span className="text-[9px] text-white font-bold">{m.label}</span>
                                   <span className="text-[8px] text-slate-500 uppercase">{m.status}</span>
                                </div>
                                <span className="text-[10px] font-mono text-cyanNeon">{m.size}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}
                   {activeJobs.length === 0 ? (
                     <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-slate-600">
                        <Package className="size-16 mb-4 opacity-20" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Forge Queue Empty</span>
                     </div>
                   ) : (
                     <AnimatePresence>
                       {activeJobs.map((job) => (
                         <motion.div
                           key={job.id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-4 hover:border-blue-500/40 transition-all glitch-hover"
                         >
                           <div className="flex justify-between items-start">
                             <div className="space-y-1">
                               <div className="flex items-center gap-3">
                                 <Badge className={`${job.status === 'completed' ? 'bg-emerald-600' : 'bg-blue-600'} text-[8px] h-4 uppercase`}>
                                   {job.status}
                                 </Badge>
                                 <span className="text-[10px] font-mono text-slate-500 tracking-tighter">{job.id.slice(0, 12)}</span>
                               </div>
                               <h4 className="text-sm font-black uppercase tracking-tight pt-1">
                                 {job.targetOs.join(' + ')} Archive (15GB Zip)
                               </h4>
                             </div>
                             <div className="text-right">
                               <p className="text-[10px] font-mono text-slate-500 uppercase">{new Date(job.timestamp).toLocaleTimeString()}</p>
                             </div>
                           </div>
                           <div className="space-y-2">
                             <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 px-1">
                               <span>Synthesis Depth</span>
                               <span className="text-cyanNeon">{job.progress}%</span>
                             </div>
                             <Progress value={job.progress} className={`h-1.5 bg-slate-900 ${job.status === 'processing' ? 'animate-pulse' : ''}`} />
                           </div>
                           <div className="flex justify-between items-center pt-2">
                             <span className="text-[10px] text-slate-500 font-bold uppercase italic">
                               Verified Sandy Bridge Integrity
                             </span>
                             {job.status === 'completed' && (
                               <Button size="sm" variant="secondary" className="h-8 text-[10px] font-black uppercase px-4 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20">
                                 <Download className="size-3 mr-2" /> Retrieve Payload
                               </Button>
                             )}
                           </div>
                         </motion.div>
                       ))}
                     </AnimatePresence>
                   )}
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}