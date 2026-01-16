import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, ProjectState } from '@shared/types';
import { CheckCircle2, Circle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
const STEPS = [
  { id: 0, title: "Download Proxmox VE 8.x ISO", category: "Pre-Flight", desc: "Download the latest Proxmox VE 8.1+ ISO from proxmox.com" },
  { id: 1, title: "Provision USB via Script Forge", category: "Pre-Flight", desc: "Generate the USB provisioning script and execute it on your workstation." },
  { id: 2, title: "iMac BIOS: Boot from UEFI USB", category: "Hardware", desc: "Hold 'Option' on boot, select the EFI Boot option from the USB." },
  { id: 3, title: "Proxmox: Run Installer with 'nomodeset'", category: "Host Install", desc: "Essential for AMD Radeon 6000 series to prevent display hang." },
  { id: 4, title: "Network: Configure vmbr0 on tg3 NIC", category: "Host Install", desc: "Map the internal Broadcom NIC to the primary Proxmox bridge." },
  { id: 5, title: "Update: Install firmware-amd-graphics", category: "Optimization", desc: "Crucial for GPU initialization and stability." },
  { id: 6, title: "GRUB: Enable intel_iommu=on", category: "Host Install", desc: "Required for passing through the GPU or other PCI devices." },
  { id: 7, title: "Storage: Provision ZFS Datasets", category: "Configuration", desc: "Run the ZFS script from Architect Tools to create the data hierarchy." },
  { id: 8, title: "VM: Create Windows 11 with vTPM", category: "Virtualization", desc: "Use OVMF and add a vTPM state to satisfy Win11 requirements." },
  { id: 9, title: "VM: Setup Kali Linux Security Node", category: "Virtualization", desc: "Install qemu-guest-agent for graceful shutdowns." },
  { id: 10, title: "VM: Configure openFyde VirtIO-GPU", category: "Virtualization", desc: "Set display to VirtIO-GPU with 3D acceleration for smoothness." },
  { id: 11, title: "Shared: Bridge ZFS Dataset via SMB", category: "Configuration", desc: "Enable the Proxmox SMB server for cross-OS data access." },
  { id: 12, title: "GPU: Configure VFIO GPU Passthrough", category: "Optimization", desc: "Bind 01:00.0 (Radeon 6970M) to the Windows 11 VM." },
  { id: 13, title: "OCLP: Post-Install Root Patches", category: "Optimization", desc: "Use OpenCore Legacy Patcher within macOS VMs if needed for drivers." },
  { id: 14, title: "Backup: Schedule Daily PBS Jobs", category: "Reliability", desc: "Automate backups to an external disk or NAS." }
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
        headers: { 'Content-Type': 'application/json' },
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
    // Ensure array is big enough
    while(newChecklist.length < STEPS.length) newChecklist.push(false);
    newChecklist[index] = !newChecklist[index];
    mutation.mutate({ ...projectState, checklist: newChecklist });
  };
  const completedCount = projectState?.checklist?.filter(Boolean).length || 0;
  const progressPercent = (completedCount / STEPS.length) * 100;
  if (isLoading) return <div className="p-8 text-white center h-screen">Loading deployment pipeline...</div>;
  return (
    <AppLayout container className="bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">Deployment Protocol</h1>
            <p className="text-slate-400 mt-2">Interactive 15-step installation pipeline for the iMac 12,2 project.</p>
          </div>
          <Card className="bg-slate-900 border-white/10 p-6 shadow-glow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-300">Phase Completion</span>
              <span className="text-sm font-mono text-emerald-400">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-slate-800" />
          </Card>
        </div>
        <TooltipProvider>
          <div className="space-y-3">
            {STEPS.map((step) => {
              const isDone = projectState?.checklist?.[step.id];
              return (
                <div key={step.id} className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${isDone ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900 border-white/10 text-white hover:border-white/20'}`}>
                  <Checkbox
                    id={`step-${step.id}`}
                    checked={isDone}
                    onCheckedChange={() => toggleStep(step.id)}
                    className="border-slate-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label htmlFor={`step-${step.id}`} className={`text-sm font-medium cursor-pointer ${isDone ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                        {step.title}
                      </label>
                      <Tooltip>
                        <TooltipTrigger><HelpCircle className="size-3 text-slate-500 hover:text-slate-300" /></TooltipTrigger>
                        <TooltipContent className="bg-slate-800 border-white/10 text-xs max-w-xs">{step.desc}</TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-1">{step.category}</div>
                  </div>
                  {isDone && <CheckCircle2 className="size-5 text-emerald-500 animate-in fade-in zoom-in duration-300" />}
                </div>
              );
            })}
          </div>
        </TooltipProvider>
        <div className="text-center pt-8 border-t border-white/5">
          <p className="text-[10px] text-slate-600 font-mono">
            * Persistent state synced to Cloudflare Durable Objects. Last updated: {projectState?.lastUpdated ? new Date(projectState.lastUpdated).toLocaleString() : 'Never'}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}