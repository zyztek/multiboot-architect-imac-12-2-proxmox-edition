import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Copy, Terminal, Calculator, Sparkles, Network, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, ProjectState, AiArchitectRequest, AiArchitectResponse } from '@shared/types';
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
  // Local UI state for sliders
  const [win11, setWin11] = useState(200);
  const [kali, setKali] = useState(100);
  const [fyde, setFyde] = useState(100);
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
  return (
    <AppLayout container className="bg-slate-950">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        <div className="lg:col-span-5 space-y-8">
          <Tabs defaultValue="partition" className="w-full">
            <TabsList className="bg-slate-900 border-white/10 w-full p-1">
              <TabsTrigger value="partition" className="flex-1">Manual Partition</TabsTrigger>
              <TabsTrigger value="ai" className="flex-1">AI Wizard</TabsTrigger>
            </TabsList>
            <TabsContent value="partition" className="pt-4 space-y-4">
              <Card className="bg-slate-900 border-white/10 text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Calculator className="size-5 text-blue-500" /> Partition Architect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-slate-400">Windows 11 ({win11}GB)</Label>
                      <Slider value={[win11]} onValueChange={(v) => setWin11(v[0])} max={500} step={10} className="py-2" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400">Kali Linux ({kali}GB)</Label>
                      <Slider value={[kali]} onValueChange={(v) => setKali(v[0])} max={300} step={5} className="py-2" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400">openFyde ({fyde}GB)</Label>
                      <Slider value={[fyde]} onValueChange={(v) => setFyde(v[0])} max={200} step={5} className="py-2" />
                    </div>
                  </div>
                  <div className="h-[200px] w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: 'Win', value: win11 },
                          { name: 'Kali', value: kali },
                          { name: 'Fyde', value: fyde },
                          { name: 'Shared', value: shared },
                        ]} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} stroke="none" paddingAngle={4}>
                          <Cell fill="#3b82f6" /><Cell fill="#10b981" /><Cell fill="#f59e0b" /><Cell fill="#64748b" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <Button onClick={handleSaveLayout} className="w-full bg-blue-600 hover:bg-blue-500">
                    <Save className="size-4 mr-2" /> Save Partition Layout
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ai" className="pt-4">
              <Card className="bg-slate-900 border-white/10 text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Sparkles className="size-5 text-orange-400" /> AI Architect Wizard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-slate-400">Primary Use Case</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Workstation', 'Server', 'Gaming'] as const).map(g => (
                        <Button key={g} variant={aiGoal === g ? 'default' : 'outline'} className="text-xs" onClick={() => setAiGoal(g)}>{g}</Button>
                      ))}
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label className="text-slate-400">Host RAM Allocation: {aiRam}GB</Label>
                      <Slider value={[aiRam]} onValueChange={(v) => setAiRam(v[0])} max={32} min={8} step={8} className="py-2" />
                    </div>
                  </div>
                  <Button onClick={handleAiWizard} className="w-full bg-orange-600 hover:bg-orange-500">
                    <Sparkles className="size-4 mr-2" /> Generate & Provision
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-7 space-y-8">
           <Card className="bg-slate-900 border-white/10 text-white shadow-xl h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Terminal className="size-5 text-emerald-500" /> Blueprint Forge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              {aiResult ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg text-sm text-slate-300">
                    <p className="font-bold text-orange-400 mb-2">AI Reasoning:</p>
                    {aiResult.reasoning}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-slate-500">PROXMOX CLI COMMANDS:</p>
                    <pre className="bg-black/50 p-4 rounded-lg text-xs font-mono text-emerald-400 max-h-[300px] overflow-auto border border-white/5">
                      {aiResult.cliCommands.join('\n')}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1" onClick={() => { navigator.clipboard.writeText(aiResult.cliCommands.join('\n')); toast.success("Commands Copied"); }}>
                      <Copy className="size-4 mr-2" /> Copy CLI
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
                  <Network className="size-16" />
                  <div className="text-center">
                    <p className="font-medium">Blueprint Forge Idle</p>
                    <p className="text-xs">Configure options to generate an optimized hypervisor plan</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}