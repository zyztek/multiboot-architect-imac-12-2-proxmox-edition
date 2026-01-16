import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, ExternalLink, ShieldAlert, Network, HardDrive, Terminal } from 'lucide-react';
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
            <TabsTrigger value="kali">Kali Linux</TabsTrigger>
            <TabsTrigger value="fyde">openFyde</TabsTrigger>
            <TabsTrigger value="storage">Shared Storage</TabsTrigger>
          </TabsList>
          <TabsContent value="proxmox" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-white/10 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Terminal className="size-5 text-blue-500" /> Host Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                  <Info className="size-4" />
                  <AlertTitle>Critical Boot Flags</AlertTitle>
                  <AlertDescription>
                    iMac 12,2 EFI is strictly UEFI 1.1. In <code className="bg-black/40 px-1 rounded">/etc/default/grub</code>, you MUST use:
                    <div className="mt-2 font-mono text-xs p-2 bg-black/40 rounded">
                      GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt nomodeset"
                    </div>
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">AMD GPU Firmware</h4>
                    <p className="text-sm text-slate-300">The Radeon HD 6970M requires non-free firmware for the host to initialize correctly:</p>
                    <div className="p-2 bg-black/50 rounded font-mono text-xs text-emerald-400">
                      apt update && apt install firmware-amd-graphics
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Networking</h4>
                    <p className="text-sm text-slate-300">Internal Broadcom BCM57765 requires the <code className="text-orange-400">tg3</code> driver. Set up <code className="text-blue-400">vmbr0</code> on this interface.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="windows" className="mt-6">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Windows 11 vTPM Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <h3 className="text-orange-400 font-bold flex items-center gap-2"><ShieldAlert className="size-4" /> Installation Hack</h3>
                  <p className="text-sm text-slate-300 mt-2">If the installer says "PC can't run Windows 11", press Shift+F10 and enter:</p>
                  <pre className="mt-2 p-2 bg-black/60 rounded text-[10px] text-orange-200">
                    reg add HKLM\SYSTEM\Setup\LabConfig /v BypassTPMCheck /t REG_DWORD /d 1
                  </pre>
                </div>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
                  <li>Use <strong>SeaBIOS</strong> if you have issues with UEFI, but <strong>OVMF</strong> is preferred for vTPM.</li>
                  <li>Always use <strong>VirtIO-SCSI</strong> for the disk controller.</li>
                  <li>Link: <a href="https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/virtio-win.iso" className="text-blue-400 hover:underline">VirtIO Latest Drivers ISO</a></li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="kali" className="mt-6">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader><CardTitle>Kali PenTest Node</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-300">The internal AirPort Extreme card is Broadcom-based and doesn't support monitor mode well in VMs. Use a USB Passthrough for an Alfa AWUS036ACM.</p>
                <div className="flex gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">USB Passthrough</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Rolling Distro</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="storage" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-white/10 text-white">
                <CardHeader><CardTitle className="flex items-center gap-2"><HardDrive className="size-5 text-emerald-500" /> ZFS Dataset Tree</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2"><div className="w-1 h-8 bg-slate-700" /> rpool (1TB)</div>
                    <div className="ml-4 flex items-center gap-2"><div className="w-4 h-px bg-slate-700" /> data/</div>
                    <div className="ml-8 flex items-center gap-2 text-blue-400">├── win11 (200GB)</div>
                    <div className="ml-8 flex items-center gap-2 text-emerald-400">├── kali (100GB)</div>
                    <div className="ml-8 flex items-center gap-2 text-orange-400">├── fyde (100GB)</div>
                    <div className="ml-8 flex items-center gap-2 text-slate-400">└── shared (500GB+)</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-white/10 text-white">
                <CardHeader><CardTitle className="flex items-center gap-2"><Network className="size-5 text-purple-500" /> Network Bridge</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">The shared storage is mounted via NFS to Linux guests and SMB/CIFS to Windows, bridged over the internal VirtIO network at 10Gbps virtual speeds.</p>
                  <div className="p-3 bg-black/40 rounded border border-white/5 font-mono text-[10px] text-purple-300">
                    # Example SMB Mount (Windows)<br/>
                    net use S: \\192.168.1.10\shared /user:admin password
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}