import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock, CheckCircle2, AlertTriangle, TrendingUp, Filter, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { MASTER_STEPS } from '@shared/mock-data';
import type { ApiResponse, ProjectState } from '@shared/types';
export function DeploymentProtocol() {
  const queryClient = useQueryClient();
  const { data: projectState, isLoading } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      return json.data;
    }
  });
  const batchMutation = useMutation({
    mutationFn: async (updates: { id: number, value: boolean }[]) => {
      const res = await fetch('/api/checklist/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    }
  });
  const checklist = projectState?.checklist ?? new Array(150).fill(false);
  const completedCount = checklist.filter(Boolean).length;
  const progressPercent = (completedCount / 150) * 100;
  const isStepLocked = (stepId: number) => {
    const step = MASTER_STEPS[stepId];
    if (!step?.requires) return false;
    return step.requires.some(reqId => !checklist[reqId]);
  };
  const stepsByCategory = useMemo(() => {
    return MASTER_STEPS.reduce((acc, step) => {
      if (!acc[step.category]) acc[step.category] = [];
      acc[step.category].push(step);
      return acc;
    }, {} as Record<string, typeof MASTER_STEPS>);
  }, []);
  if (isLoading) return <div className="p-8 text-white center h-screen bg-slate-950">Synchronizing Protocol...</div>;
  return (
    <AppLayout container className="bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Protocol Master</h1>
            <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">150-Stage Deployment Pipeline</p>
          </div>
          <Card className="bg-slate-900 border-white/10 p-4 w-full md:w-80 shadow-glow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Synchronized Progress</span>
              <span className="text-sm font-mono text-blue-400">{completedCount}/150</span>
            </div>
            <Progress value={progressPercent} className="h-1.5 bg-slate-800" />
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
             <Card className="glass-dark border-white/10 text-white">
                <CardHeader><CardTitle className="text-xs uppercase tracking-widest text-slate-500">Filters</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                   {Object.keys(stepsByCategory).map(cat => (
                     <div key={cat} className="flex items-center justify-between text-xs p-2 rounded hover:bg-white/5 cursor-pointer">
                        <span className="text-slate-300">{cat}</span>
                        <Badge variant="outline" className="text-[9px] border-white/10">{stepsByCategory[cat].length}</Badge>
                     </div>
                   ))}
                </CardContent>
             </Card>
             <Card className="glass-dark border-blue-500/20 bg-blue-600/5 p-4 text-blue-400">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase mb-2">
                  <TrendingUp className="size-3" /> System Health
                </div>
                <p className="text-[10px] leading-relaxed text-slate-400">
                  Dependency engine is verifying 150 constraints. Complete preceding tasks to unlock high-level Sandy Bridge optimizations.
                </p>
             </Card>
          </div>
          <div className="lg:col-span-3 space-y-12">
            {Object.entries(stepsByCategory).map(([category, steps]) => (
              <section key={category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">{category}</h2>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {steps.map((step) => {
                    const isDone = checklist[step.id];
                    const locked = isStepLocked(step.id);
                    return (
                      <TooltipProvider key={step.id}>
                        <div className={`
                          relative flex items-center gap-4 p-4 rounded-xl border transition-all
                          ${isDone ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-900/60 border-white/10'}
                          ${locked ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-white/20'}
                        `}>
                          {step.requires && (
                            <div className="absolute left-[-1.5rem] top-1/2 w-4 h-[1px] bg-white/10" />
                          )}
                          <Checkbox
                            checked={isDone}
                            onCheckedChange={(val) => batchMutation.mutate([{ id: step.id, value: !!val }])}
                            disabled={locked}
                            className="h-5 w-5 border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isDone ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                                {step.title}
                              </span>
                              {locked && <Lock className="size-3 text-slate-600" />}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{step.desc}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Tooltip>
                              <TooltipTrigger><Layers className="size-4 text-slate-700" /></TooltipTrigger>
                              <TooltipContent className="bg-slate-800 border-white/10 text-[10px]">
                                Requires Step: {step.requires?.join(', ') ?? 'None'}
                              </TooltipContent>
                            </Tooltip>
                            {isDone && <CheckCircle2 className="size-4 text-emerald-500" />}
                          </div>
                        </div>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}