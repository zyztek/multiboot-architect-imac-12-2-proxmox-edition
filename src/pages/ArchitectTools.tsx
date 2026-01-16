import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Copy, Terminal, Calculator, Sparkles, Network, Save, Usb, Database, Cpu } from 'lucide-react';
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
      toast.success("Architectural state persisted to cloud");
    }
  });
  // Partition Sliders
  const [win11, setWin11] = useState(200);
  const [kali, setKali] = useState(100);
  const [fyde, setFyde] = useState(100);
  // Script Forge Params
  const [scriptMode, setScriptMode] = useState<ScriptMode>('usb');
  const [usbLabel, setUsbLabel] = useState('PROXMOX_BOOT');
  const [isoPath, setIsoPath] = useState('C:\\ISOs\\proxmox-ve-8.1.iso');
  // AI Wizard state
  const [aiGoal, setAiGoal] = useState<'Workstation' | 'Server' | 'Gaming'>('Workstation');
  const [aiRam, setAiRam] = useState(16);
  const [aiResult, setAiResult] = useState<AiArchitectResponse | null>(null);
  useEffect(() => {
    if (projectState?.storage) {
      setWin11(projectState.storage.win11);
      setKali(projectState.storage.kali);
      setFyde(projectState.storage.fyde);
    }
  }, [projectState]);
  const shared = Math.max(0, 1000 - win11 - kali - fyde);
  const handleSaveLayout = () => {
    if (!projectState) return;
    mutation.mutate({
      ...projectState,
      storage: { win11, kali, fyde, shared }
    });
  };
  const handleAiWizard = async () => {
    try {
      const res = await fetch('/api/ai-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: aiGoal, ramGb: aiRam, storageGb: 1000 } as AiArchitectRequest)
      });
      const json = await res.json();
      setAiResult(json.data);
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
      toast.success("Blueprint Generated and VM Provisioned!");
    } catch (e) {
      toast.error("AI Wizard failed");
    }
  };
  const generatedScriptCode = generateScript({
    mode: scriptMode,
    usbDrive: usbLabel,
    isoPath: isoPath,
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
              <TabsTrigger value="ai" className="flex-1">AI Wizard</TabsTrigger>
              <TabsTrigger value="forge" className="flex-1">Script Forge</TabsTrigger>
            </TabsList>
            <TabsContent value="partition" className="pt-4 space-y-4">
              <Card className="glass-dark border-white/10 text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Calculator className="size-5" /> Manual Partition
                  </CardTitle>
                  <CardDescription>Allocate 1TB ZFS Pool</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-slate-400 flex justify-between">Windows 11 <span>{win11}GB</span></Label>
                      <Slider value={[win11]} onValueChange={(v) => setWin11(v[0])} max={500} step={10} className="py-2" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 flex justify-between">Kali Linux <span>{kali}GB</span></Label>
                      <Slider value={[kali]} onValueChange={(v) => setKali(v[0])} max={300} step={5} className="py-2" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 flex justify-between">openFyde <span>{fyde}GB</span></Label>
                      <Slider value={[fyde]} onValueChange={(v) => setFyde(v[0])} max={200} step={5} className="py-2" />
                    </div>
                  </div>
                  <div className="h-[180px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: 'Win', value: win11 },
                          { name: 'Kali', value: kali },
                          { name: 'Fyde', value: fyde },
                          { name: 'Shared', value: shared },
                        ]} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={75} stroke="none" paddingAngle={4}>
                          <Cell fill="#3b82f6" /><Cell fill="#10b981" /><Cell fill="#f59e0b" /><Cell fill="#64748b" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <Button onClick={handleSaveLayout} className="w-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                    <Save className="size-4 mr-2" /> Save Layout
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ai" className="pt-4">
              <Card className="glass-dark border-white/10 text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Sparkles className="size-5" /> AI Architect
                  </CardTitle>
                  <CardDescription>Optimize for Sandy Bridge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-slate-400">Primary Goal</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Workstation', 'Server', 'Gaming'] as const).map(g => (
                        <Button key={g} variant={aiGoal === g ? 'default' : 'outline'} className="text-xs h-8 border-white/10" onClick={() => setAiGoal(g)}>{g}</Button>
                      ))}
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label className="text-slate-400">Host RAM: {aiRam}GB</Label>
                      <Slider value={[aiRam]} onValueChange={(v) => setAiRam(v[0])} max={32} min={8} step={8} className="py-2" />
                    </div>
                  </div>
                  <Button onClick={handleAiWizard} className="w-full bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-500/20">
                    <Sparkles className="size-4 mr-2" /> Generate Blueprint
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="forge" className="pt-4 space-y-4">
              <Card className="glass-dark border-white/10 text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-400">
                    <Terminal className="size-5" /> Script Forge
                  </CardTitle>
                  <CardDescription>Configure automation parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-1">
                    <Button variant={scriptMode === 'usb' ? 'secondary' : 'ghost'} size="sm" onClick={() => setScriptMode('usb')} className="text-[10px] h-8 px-1">
                      <Usb className="size-3 mr-1" /> USB
                    </Button>
                    <Button variant={scriptMode === 'zfs-setup' ? 'secondary' : 'ghost'} size="sm" onClick={() => setScriptMode('zfs-setup')} className="text-[10px] h-8 px-1">
                      <Database className="size-3 mr-1" /> ZFS
                    </Button>
                    <Button variant={scriptMode === 'vm-create' ? 'secondary' : 'ghost'} size="sm" onClick={() => setScriptMode('vm-create')} className="text-[10px] h-8 px-1">
                      <Cpu className="size-3 mr-1" /> VM CLI
                    </Button>
                  </div>
                  {scriptMode === 'usb' && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-slate-500">USB Drive Letter/Label</Label>
                        <Input value={usbLabel} onChange={(e) => setUsbLabel(e.target.value)} className="bg-black/40 border-white/10 h-8 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-slate-500">Proxmox ISO Local Path</Label>
                        <Input value={isoPath} onChange={(e) => setIsoPath(e.target.value)} className="bg-black/40 border-white/10 h-8 text-xs" />
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 italic mt-2">
                    Adjusting these values will update the script preview in the Forge window.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-7 space-y-6">
           <Card className="glass-dark border-white/10 text-white shadow-xl min-h-[500px] flex flex-col overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-emerald-400 text-lg">
                  <Terminal className="size-5" /> Forge Output: {scriptMode.toUpperCase()}
                </CardTitle>
                <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 font-mono">
                  {scriptMode === 'usb' ? 'POWERSHELL' : 'BASH'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative font-mono text-xs">
               <pre className="p-6 h-full overflow-auto text-emerald-300/90 leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                  {generatedScriptCode}
                  {aiResult && scriptMode !== 'usb' && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <span className="text-orange-400 opacity-50"># --- AI GENERATED OPTIMIZATIONS ---</span>
                      {"\n"}{aiResult.cliCommands.join('\n')}
                    </div>
                  )}
               </pre>
               <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button variant="secondary" size="sm" className="h-8 bg-slate-800 hover:bg-slate-700 border-white/10 text-white" onClick={() => { 
                    navigator.clipboard.writeText(generatedScriptCode);
                    toast.success("Script copied to clipboard");
                  }}>
                    <Copy className="size-3 mr-2" /> Copy Script
                  </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}