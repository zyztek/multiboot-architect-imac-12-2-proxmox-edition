import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Copy, Terminal, Calculator, Sparkles, Save, Usb, Database, Cpu, Layers, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateScript } from '@/lib/script-generator';
import type { ApiResponse, ProjectState, AiArchitectRequest, AiArchitectResponse, ScriptMode } from '@shared/types';
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
      toast.success("Architectural state persisted");
    }
  });
  const [win11, setWin11] = useState(200);
  const [kali, setKali] = useState(100);
  const [fyde, setFyde] = useState(100);
  const [scriptMode, setScriptMode] = useState<ScriptMode>('usb');
  useEffect(() => {
    if (projectState?.storage) {
      setWin11(projectState.storage.win11);
      setKali(projectState.storage.kali);
      setFyde(projectState.storage.fyde);
    }
  }, [projectState]);
  const shared = Math.max(0, 1000 - win11 - kali - fyde);
  const generatedScriptCode = generateScript({
    mode: scriptMode,
    storage: { win11, kali, fyde, shared },
    vms: projectState?.vms
  });
  return (
    <AppLayout container className="bg-slate-950">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        <div className="lg:col-span-5 space-y-6">
          <Tabs defaultValue="partition" className="w-full">
            <TabsList className="bg-slate-900/50 border border-white/10 w-full p-1 backdrop-blur-md">
              <TabsTrigger value="partition" className="flex-1">Partition</TabsTrigger>
              <TabsTrigger value="forge" className="flex-1">Script Forge</TabsTrigger>
              <TabsTrigger value="hacks" className="flex-1">Hacks</TabsTrigger>
            </TabsList>
            <TabsContent value="partition" className="pt-4 space-y-4">
              <Card className="glass-dark border-white/10 text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2"><Calculator className="size-4" /> Layout Architect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs text-slate-500 uppercase tracking-widest">Windows Allocation: {win11}GB</Label>
                    <Slider value={[win11]} onValueChange={(v) => setWin11(v[0])} max={500} step={10} />
                    <Label className="text-xs text-slate-500 uppercase tracking-widest">Kali Lab: {kali}GB</Label>
                    <Slider value={[kali]} onValueChange={(v) => setKali(v[0])} max={300} step={5} />
                  </div>
                  <Button onClick={() => mutation.mutate({ ...projectState!, storage: { win11, kali, fyde, shared } })} className="w-full bg-blue-600">Save Blueprint</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="forge" className="pt-4">
              <Card className="glass-dark border-white/10 text-white">
                <CardHeader><CardTitle className="text-emerald-400">Mode Selection</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {(['usb', 'zfs-setup', 'vm-create', 'terraform', 'helm', 'opencore'] as ScriptMode[]).map(mode => (
                    <Button key={mode} variant={scriptMode === mode ? 'secondary' : 'outline'} size="sm" onClick={() => setScriptMode(mode)} className="text-[10px] uppercase">
                      {mode}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="hacks" className="pt-4">
               <Card className="glass-dark border-rose-500/20 text-white bg-rose-500/5">
                  <CardHeader><CardTitle className="text-rose-400 flex items-center gap-2"><ShieldAlert className="size-4" /> Sandy Bridge Hacks</CardTitle></CardHeader>
                  <CardContent className="text-xs space-y-4 text-slate-400">
                    <p>iMac 12,2 requires EFI patching for non-UEFI OS support. Use the OpenCore snippet to inject GPU framebuffers for Radeon 6970M acceleration.</p>
                    <div className="p-2 bg-black/40 rounded border border-white/10 font-mono text-[9px] text-rose-300">
                      pve-imac-patch-v2.1 --force-igpu-disable
                    </div>
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-7">
           <Card className="glass-dark border-white/10 text-white h-[600px] flex flex-col overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-emerald-400 flex items-center gap-2"><Terminal className="size-4" /> Forge Engine</CardTitle>
              <Badge variant="outline" className="text-[10px] uppercase border-emerald-500/30 text-emerald-400">{scriptMode}</Badge>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative">
               <pre className="p-6 h-full overflow-auto text-emerald-300/90 font-mono text-xs leading-relaxed">
                  {generatedScriptCode}
               </pre>
               <Button className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-500" onClick={() => {
                 navigator.clipboard.writeText(generatedScriptCode);
                 toast.success("Copied to clipboard");
               }}><Copy className="size-3 mr-2" /> Copy Output</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}