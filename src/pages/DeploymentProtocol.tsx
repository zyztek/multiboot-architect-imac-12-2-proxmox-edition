import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, ProjectState } from '@shared/types';
import { CheckCircle2, Circle, Save } from 'lucide-react';
import { toast } from 'sonner';
const STEPS = [
  { id: 0, title: "Download Proxmox VE 8.x ISO", category: "Pre-Flight" },
  { id: 1, title: "Provision USB via Script Forge", category: "Pre-Flight" },
  { id: 2, title: "iMac BIOS: Disable Secure Boot (if applicable)", category: "Hardware" },
  { id: 3, title: "iMac BIOS: Boot from UEFI USB", category: "Hardware" },
  { id: 4, title: "Proxmox: Run Installer with 'nomodeset'", category: "Host Install" },
  { id: 5, title: "Proxmox: Configure ZFS Storage Pool", category: "Host Install" },
  { id: 6, title: "VM: Create Windows 11 Node (VirtIO/vTPM)", category: "Virtualization" },
  { id: 7, title: "VM: Create Kali Linux Node", category: "Virtualization" },
  { id: 8, title: "VM: Create openFyde Node (VirtIO-GPU)", category: "Virtualization" },
  { id: 9, title: "Network: Set up Shared NAS Bridge", category: "Configuration" },
  { id: 10, title: "Driver: Run OCLP Post-Install Root Patches", category: "Optimization" },
  { id: 11, title: "Backup: Configure Proxmox Backup Server/Jobs", category: "Reliability" }
];
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
  const mutation = useMutation({
    mutationFn: async (newState: ProjectState) => {
      const res = await fetch('/api/project-state', {
        method: 'POST',
        body: JSON.stringify(newState)
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-state'] });
    }
  });
  const toggleStep = (index: number) => {
    if (!projectState) return;
    const newChecklist = [...projectState.checklist];
    newChecklist[index] = !newChecklist[index];
    mutation.mutate({ ...projectState, checklist: newChecklist });
  };
  const completedCount = projectState?.checklist.filter(Boolean).length || 0;
  const progressPercent = (completedCount / STEPS.length) * 100;
  if (isLoading) return <div className="p-8 text-white">Initializing protocol...</div>;
  return (
    <AppLayout container className="bg-slate-950">
      <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Deployment Protocol</h1>
            <p className="text-slate-400">Step-by-step installation pipeline.</p>
          </div>
          <Card className="bg-slate-900 border-white/10 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-300">Overall Progress</span>
              <span className="text-sm font-mono text-emerald-400">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-slate-800" />
          </Card>
        </div>
        <div className="space-y-3">
          {STEPS.map((step) => {
            const isDone = projectState?.checklist[step.id];
            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  isDone 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300' 
                    : 'bg-slate-900 border-white/10 text-white hover:border-white/20'
                }`}
              >
                <Checkbox 
                  id={`step-${step.id}`} 
                  checked={isDone} 
                  onCheckedChange={() => toggleStep(step.id)}
                  className="border-slate-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <div className="flex-1">
                  <label htmlFor={`step-${step.id}`} className="text-sm font-medium cursor-pointer">
                    {step.title}
                  </label>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">
                    {step.category}
                  </div>
                </div>
                {isDone ? <CheckCircle2 className="size-5 text-emerald-500" /> : <Circle className="size-5 text-slate-700" />}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center pt-8">
            <p className="text-xs text-slate-600 font-mono italic">
              * Progress is automatically saved to the MultiBoot Architect cloud vault.
            </p>
        </div>
      </div>
    </AppLayout>
  );
}