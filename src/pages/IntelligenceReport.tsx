import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, ExternalLink, ShieldAlert, Network, HardDrive, Terminal, Zap, Gauge } from 'lucide-react';
export function IntelligenceReport() {
  return (
    <AppLayout container className="bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">Intelligence Report</h1>
          <p className="text-slate-400 mt-2">The definitive technical manual for iMac 12,2 Sandy Bridge Virtualization.</p>
        </div>
        <Tabs defaultValue="proxmox" className="w-full">
          <TabsList className="bg-slate-900 border-white/10 p-1">
            <TabsTrigger value="proxmox">Proxmox Host</TabsTrigger>
            <TabsTrigger value="windows">Windows 11</TabsTrigger>
            <TabsTrigger value="opt">Optimizations</TabsTrigger>
            <TabsTrigger value="storage">Shared Storage</TabsTrigger>
          </TabsList>
          <TabsContent value="opt" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-white/10 text-white">
                <CardHeader><CardTitle className="flex items-center gap-2 text-emerald-400"><Monitor className="size-5" /> Guacamole Gateway</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-300">Run Apache Guacamole in a Docker container to access all your VMs via browser (HTML5 RDP/SSH/VNC).</p>
                  <pre className="p-2 bg-black/50 rounded text-[10px] text-emerald-300 font-mono">
                    # Docker Compose Snippet
                    guacamole:
                      image: oznu/guacamole
                      ports: ["8080:8080"]
                  </pre>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-white/10 text-white">
                <CardHeader><CardTitle className="flex items-center gap-2 text-blue-400"><Gauge className="size-5" /> Taskset Core Pinning</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-300">Sandy Bridge i7-2600 has 4 cores. Isolate core 0 for the host and pin high-perf VMs to cores 1-3.</p>
                  <pre className="p-2 bg-black/50 rounded text-[10px] text-blue-300 font-mono">
                    # Example taskset
                    taskset -cp 1-3 [qemu-pid]
                  </pre>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-white/10 text-white">
                <CardHeader><CardTitle className="flex items-center gap-2 text-orange-400"><Zap className="size-5" /> Tiny11 Optimization</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-300">
                  <p>Windows 11 overhead can be high. Using Tiny11 builder reduces RAM usage to ~1.2GB idle, perfect for the 32GB iMac limit.</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-white/10 text-white">
                <CardHeader><CardTitle className="flex items-center gap-2 text-purple-400"><ShieldCheck className="size-5" /> PBS Scheduling</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-300">
                  <p>Schedule daily incremental backups to a separate SSD via Proxmox Backup Server to prevent iMac hardware failure data loss.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="proxmox" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-white/10 text-white shadow-2xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><Terminal className="size-5 text-blue-500" /> Host Configuration</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                  <Info className="size-4" />
                  <AlertTitle>Critical Boot Flags</AlertTitle>
                  <AlertDescription>
                    i7-2600 requires specific flags for stable IOMMU passthrough.
                    <div className="mt-2 font-mono text-xs p-2 bg-black/40 rounded">
                      GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt nomodeset"
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="windows" className="mt-6">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader><CardTitle>Windows 11 vTPM Strategy</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-sm text-slate-300">
                   Ensure you are using <strong>OVMF (UEFI)</strong> and a <strong>vTPM 2.0</strong> device in the Proxmox hardware settings.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="storage" className="mt-6">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader><CardTitle>Shared Storage Strategy</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">Bridge your 1TB ZFS pool via VirtIO network using an internal SMB server for <code className="text-blue-400">10Gbps+</code> virtual transfer speeds between guests.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}