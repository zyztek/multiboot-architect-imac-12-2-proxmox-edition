import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Cpu, HardDrive, ShieldCheck, Zap, Download, Loader2, Package, Globe, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiResponse, ProjectState, ForgeJob } from '@shared/types';
export function UsbForge() {
  const queryClient = useQueryClient();
  const [selectedOS, setSelectedOS] = useState<string[]>(['Win11']);
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
        body: JSON.stringify({ os: selectedOS, components: ['EFI Patch', 'OpenCore'] })
      });
      return res.json() as Promise<ApiResponse<ForgeJob>>;
    },
    onSuccess: () => {
      toast.success("Remote Forge Initiated");
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    }
  });
  const activeJobs = state?.activeForgeJobs ?? [];
  return (
    <AppLayout container className="bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
        <div className="border-b border-white/10 pb-8 flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter uppercase italic">Remote Forge</h1>
            <p className="text-blue-400 font-mono text-[10px] tracking-[0.4em] uppercase">Persistent Cloud Provisioning</p>
          </div>
          <Badge variant="outline" className="h-8 border-rose-500/50 text-rose-400 font-mono uppercase italic animate-pulse">Production Grade</Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="glass-dark border-white/10 text-white overflow-hidden">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-xs uppercase text-blue-400 font-black flex items-center gap-2">
                  <Package className="size-4" /> New Bundle Forge
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">OS Selection</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Win11', 'Kali', 'openFyde', 'Ubuntu'].map(os => (
                      <div key={os} className="flex items-center space-x-2 bg-black/40 p-3 rounded-lg border border-white/5">
                        <Checkbox 
                          id={os} 
                          checked={selectedOS.includes(os)} 
                          onCheckedChange={(val) => val ? setSelectedOS([...selectedOS, os]) : setSelectedOS(selectedOS.filter(x => x !== os))}
                        />
                        <label htmlFor={os} className="text-[11px] font-bold uppercase cursor-pointer">{os}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                   <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Module Stack</Label>
                   {[ShieldCheck, Cpu, HardDrive].map((Icon, i) => (
                     <div key={i} className="flex items-center gap-3 p-3 bg-blue-600/5 border border-blue-500/20 rounded-lg">
                       <Icon className="size-4 text-blue-400" />
                       <span className="text-[10px] font-bold text-slate-400">Automatic iMac Injection</span>
                     </div>
                   ))}
                </div>
                <Button 
                  onClick={() => forgeMutation.mutate()} 
                  disabled={forgeMutation.isPending || selectedOS.length === 0}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 font-black text-xs uppercase tracking-[0.2em] shadow-glow"
                >
                  {forgeMutation.isPending ? <Loader2 className="animate-spin size-5" /> : <Globe className="size-5 mr-3" />}
                  Commence Remote Forge
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-7 space-y-6">
             <Card className="glass-dark border-white/10 text-white h-full flex flex-col">
                <CardHeader className="bg-white/5 border-b border-white/5 py-4">
                  <CardTitle className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 italic">
                    <Clock className="size-4" /> Active Job Queue
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 overflow-auto">
                   {activeJobs.length === 0 ? (
                     <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-slate-600">
                        <Package className="size-12 mb-3" />
                        <span className="text-[10px] font-black uppercase">No Active Provisioning Tasks</span>
                     </div>
                   ) : (
                     <AnimatePresence>
                       {activeJobs.map((job) => (
                         <motion.div 
                           key={job.id} 
                           initial={{ opacity: 0, x: -20 }} 
                           animate={{ opacity: 1, x: 0 }}
                           className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3"
                         >
                           <div className="flex justify-between items-start">
                             <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                 <Badge className="bg-blue-600 text-[8px] h-4">{job.status}</Badge>
                                 <span className="text-[10px] font-mono text-slate-500">{job.id.slice(0, 8)}</span>
                               </div>
                               <h4 className="text-xs font-bold uppercase">{job.targetOs.join(' + ')} Deployment</h4>
                             </div>
                             <div className="text-right">
                               <p className="text-[9px] font-mono text-slate-500">{new Date(job.timestamp).toLocaleTimeString()}</p>
                             </div>
                           </div>
                           <Progress value={job.progress} className="h-1 bg-slate-900" />
                           <div className="flex justify-between items-center">
                             <span className="text-[9px] text-slate-500 font-bold uppercase">{job.components.length} Components Injected</span>
                             {job.status === 'completed' && <Button size="sm" variant="ghost" className="h-6 text-[9px] text-emerald-400"><Download className="size-3 mr-2" /> Retrieve</Button>}
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