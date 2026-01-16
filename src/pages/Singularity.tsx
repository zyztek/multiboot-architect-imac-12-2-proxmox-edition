import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Orbit, Hexagon, Zap, ShieldCheck, Camera, Share2, Hammer, Download, Terminal, Radio } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { ApiResponse, ProjectState } from '@shared/types';
export function Singularity() {
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState(0);
  const { data: state } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    }
  });
  const exportMutation = useMutation({
    mutationFn: async () => {
      setIsExporting(true);
      setExportStep(1);
      await new Promise(r => setTimeout(r, 2000));
      setExportStep(2);
      await new Promise(r => setTimeout(r, 2000));
      setExportStep(3);
      await new Promise(r => setTimeout(r, 2000));
      const res = await fetch('/api/export-iso', { method: 'POST' });
      return res.json();
    },
    onSuccess: () => {
      toast.success("AppOS ISO Forge Complete");
      setIsExporting(false);
      setExportStep(0);
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    }
  });
  const fleet = state?.fleet ?? [];
  return (
    <AppLayout container className="bg-slate-950 text-white min-h-screen">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 uppercase">SINGULARITY</h1>
            <p className="text-purple-400 font-mono text-xs tracking-[0.3em] uppercase">Post-Human Hypervisor Intelligence</p>
          </div>
          <div className="flex gap-4">
             <Badge variant="outline" className="h-8 border-purple-500/50 text-purple-400 font-mono animate-pulse">SWARM STATUS: SYNCED</Badge>
          </div>
        </div>
        <Tabs defaultValue="fleet" className="w-full">
          <TabsList className="bg-slate-900/50 border border-white/10 w-full md:w-auto p-1 backdrop-blur-xl">
            <TabsTrigger value="fleet" className="flex-1 md:flex-none text-[10px] uppercase font-black px-6">Fleet Swarm</TabsTrigger>
            <TabsTrigger value="ar" className="flex-1 md:flex-none text-[10px] uppercase font-black px-6">WebAR HUD</TabsTrigger>
            <TabsTrigger value="forge" className="flex-1 md:flex-none text-[10px] uppercase font-black px-6">ISO Forge</TabsTrigger>
          </TabsList>
          <TabsContent value="fleet" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fleet.map((node) => (
                <Card key={node.id} className={`glass-dark border-white/10 transition-all ${node.isLeader ? 'ring-2 ring-purple-500/30' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Hexagon className={`size-5 ${node.status === 'online' ? 'text-emerald-400' : 'text-slate-600'}`} />
                      {node.isLeader && <Badge className="bg-purple-600 text-[8px] h-4">LEADER</Badge>}
                    </div>
                    <CardTitle className="text-sm mt-2">{node.name}</CardTitle>
                    <p className="text-[10px] font-mono text-slate-500">{node.ip}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-500 uppercase">Swarm Load</span>
                      <span className="text-xs font-mono">{node.load}%</span>
                    </div>
                    <Progress value={node.load} className="h-1 bg-slate-800" />
                    <Button variant="ghost" className="w-full h-8 text-[9px] uppercase border border-white/5 hover:bg-white/5">Connect Trace</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="ar" className="pt-6">
            <Card className="glass-dark border-white/10 overflow-hidden relative aspect-video">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-40 grayscale" />
               <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="size-64 border-2 border-purple-500/20 rounded-full flex items-center justify-center"
                  >
                    <div className="size-48 border border-blue-500/40 rounded-full animate-pulse flex items-center justify-center">
                       <Zap className="size-8 text-white/80" />
                    </div>
                  </motion.div>
                  <div className="absolute top-10 left-10 p-4 glass-dark border-blue-500/30 rounded-xl space-y-2">
                     <div className="flex items-center gap-2"><Radio className="size-3 text-blue-400 animate-ping" /><span className="text-[10px] font-bold uppercase">Scanning Node 01...</span></div>
                     <div className="text-[9px] text-slate-400 font-mono">Temp: 44C | Load: 12% | VFIO: ACTIVE</div>
                  </div>
                  <div className="absolute bottom-10 right-10 flex gap-4">
                    <Button className="bg-purple-600 hover:bg-purple-500 h-10 px-6 uppercase text-xs font-bold"><Camera className="size-4 mr-2" /> Capture Reality</Button>
                    <Button variant="outline" className="h-10 px-6 uppercase text-xs font-bold border-white/10"><Share2 className="size-4 mr-2" /> Broadcast Stream</Button>
                  </div>
               </div>
            </Card>
          </TabsContent>
          <TabsContent value="forge" className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <Card className="lg:col-span-2 glass-dark border-white/10 text-white">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-blue-400"><Hammer className="size-5" /> ISO Forge Pipeline</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="bg-black/40 p-6 rounded-xl border border-white/5 space-y-4">
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                             <span>Build Sequence: {exportStep === 1 ? 'Kernel Init' : exportStep === 2 ? 'AppOS Bundling' : exportStep === 3 ? 'ISO Finalization' : 'Idle'}</span>
                             <span>{isExporting ? 'Processing' : 'Standby'}</span>
                          </div>
                          <Progress value={isExporting ? (exportStep / 3) * 100 : 0} className="h-2 bg-slate-800" />
                       </div>
                       <div className="h-48 bg-black p-4 rounded-lg font-mono text-[10px] overflow-auto border border-white/10 text-emerald-400">
                          {isExporting ? (
                             <div className="space-y-1">
                                <div>[INFO] Target Architecture: Sandy Bridge / x86_64</div>
                                <div>[INFO] Mounting ZFS root snapshot...</div>
                                {exportStep > 1 && <div>[INFO] Compressing Proxmox UI assets...</div>}
                                {exportStep > 2 && <div>[INFO] Generating EFI bootloader...</div>}
                                <div className="animate-pulse">_</div>
                             </div>
                          ) : (
                             <div className="text-slate-600 italic">Ready for forge command...</div>
                          )}
                       </div>
                       <Button 
                         onClick={() => exportMutation.mutate()} 
                         disabled={isExporting} 
                         className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-black uppercase tracking-widest"
                       >
                          {isExporting ? <Hammer className="size-4 animate-spin mr-2" /> : <Hammer className="size-4 mr-2" />} 
                          {isExporting ? "FORGING BOOTABLE ISO..." : "INITIATE ISO FORGE"}
                       </Button>
                    </div>
                 </CardContent>
               </Card>
               <Card className="glass-dark border-white/10 text-white">
                  <CardHeader><CardTitle className="text-xs uppercase text-slate-500">Forge Exports</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-bold">AppOS-v1.{i}.iso</span>
                             <span className="text-[8px] text-slate-500">Size: 4.2GB • Hash: 0xFD...</span>
                          </div>
                          <Button size="icon" variant="ghost" className="text-blue-400"><Download className="size-4" /></Button>
                       </div>
                     ))}
                  </CardContent>
               </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}