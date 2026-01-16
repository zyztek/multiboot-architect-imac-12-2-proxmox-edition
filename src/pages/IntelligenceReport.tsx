import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Monitor, ShieldCheck, Terminal, Zap, Gauge, Cpu, ExternalLink } from 'lucide-react';
export function IntelligenceReport() {
  return (
    <AppLayout container className="bg-slate-950">
      <div className="space-y-8 animate-fade-in">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-4xl font-display font-bold text-white tracking-tighter uppercase">INTELLIGENCE REPORT</h1>
          <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-widest">Architectural Documentation • iMac 12,2 Sandy Bridge</p>
        </div>
        <Tabs defaultValue="gpu" className="w-full">
          <TabsList className="bg-slate-900/50 border border-white/10 p-1 w-full sm:w-auto backdrop-blur-md">
            <TabsTrigger value="gpu" className="flex-1 sm:flex-none font-mono text-[10px] px-6">GPU & DRIVERS</TabsTrigger>
            <TabsTrigger value="proxmox" className="flex-1 sm:flex-none font-mono text-[10px] px-6">HOST SETUP</TabsTrigger>
            <TabsTrigger value="windows" className="flex-1 sm:flex-none font-mono text-[10px] px-6">WIN11 VIRT</TabsTrigger>
            <TabsTrigger value="opt" className="flex-1 sm:flex-none font-mono text-[10px] px-6">OPTIMIZATIONS</TabsTrigger>
          </TabsList>
          <TabsContent value="gpu" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-dark border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rose-400">
                    <Monitor className="size-5" /> AMD Radeon 6970M VFIO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <p>The Radeon 6970M in the iMac 12,2 requires binding to <code className="text-rose-300">vfio-pci</code> to prevent the host from initializing the GPU during boot.</p>
                  <div className="p-3 bg-black/50 rounded-md font-mono text-[10px] text-rose-300 border border-rose-500/20">
                    {`# /etc/modprobe.d/vfio.conf
options vfio-pci ids=1002:6711,1002:aa80`}
                  </div>
                  <p className="text-xs text-slate-500 italic">Note: Vendor IDs might differ. Use 'lspci -nn' to verify.</p>
                </CardContent>
              </Card>
              <Card className="glass-dark border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Cpu className="size-5" /> Sandy Bridge IOMMU
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-300">
                  <p>Intel i7-2600 supports VT-d, but requires <code className="text-blue-300">intel_iommu=on</code>. In Proxmox v8+, the kernel supports this by default, but manual flags are safer for passthrough stability.</p>
                  <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                    <Info className="size-4" />
                    <AlertTitle className="text-xs font-bold">PRO TIP</AlertTitle>
                    <AlertDescription className="text-[11px]">
                      Disable the integrated Intel HD Graphics in BIOS (if accessible) or via kernel blacklist to ensure the Radeon gets primary PCI lanes.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
              <Card className="glass-dark border-white/10 text-white md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-emerald-400">OCLP Integration</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>OpenCore Legacy Patcher (OCLP) is required if running a macOS VM to patch root drivers for Non-Metal AMD cards on modern macOS versions.</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                      <li>Use 'TeraScale 2' patches for 6000 series</li>
                      <li>Enable SIP '0x03' for root patching</li>
                      <li>Required for display transparency & acceleration</li>
                    </ul>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-white/5 flex flex-col justify-center items-center text-center">
                    <Zap className="size-8 text-orange-500 mb-2" />
                    <p className="text-xs font-bold uppercase mb-1">Performance Warning</p>
                    <p className="text-[10px] text-slate-500">Sandy Bridge lacks AVX2. Some modern software in guests may fail. Use 'host-model' CPU flags.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="proxmox" className="space-y-6 mt-6">
            <Card className="glass-dark border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="size-5 text-blue-500" /> Bootloader Config
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                  <Info className="size-4" />
                  <AlertTitle className="font-mono text-xs font-bold">CRITICAL BOOT PARAMETERS</AlertTitle>
                  <AlertDescription>
                    <div className="mt-3 font-mono text-[11px] p-4 bg-black/60 rounded border border-white/10 text-emerald-400 leading-relaxed">
                      GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt nomodeset video=efifb:off,vesafb:off"
                    </div>
                  </AlertDescription>
                </Alert>
                <div className="space-y-4 text-sm text-slate-300">
                  <p>The <code className="text-rose-400">nomodeset</code> flag is non-negotiable for the initial installation. Without it, the kernel will attempt to load 'radeon' drivers before you've blacklisted them for VFIO, resulting in a black screen.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="windows" className="mt-6">
            <Card className="glass-dark border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-orange-400">Windows 11 Sandy Bridge Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-300">
                 <p>Since the i7-2600 lacks TPM 2.0, use the Proxmox <strong>vTPM State</strong> feature. Do not attempt Registry hacks in the ISO; vTPM is cleaner and supports Bitlocker.</p>
                 <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <strong>Hardware Configuration:</strong>
                    <ul className="mt-2 space-y-1 text-xs text-slate-400 list-disc list-inside">
                      <li>Machine: q35 (Essential for PCIe passthrough)</li>
                      <li>BIOS: OVMF (UEFI)</li>
                      <li>TPM: Version 2.0 (Stored on local-zfs)</li>
                      <li>CPU Type: 'host' (Required for nested virtualization)</li>
                    </ul>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="opt" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="glass-dark border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-400">
                    <Gauge className="size-5" /> VirtIO Scaling
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300">
                  <p>Sandy Bridge NIC (Broadcom tg3) is limited to 1GbE. Use internal <code className="text-emerald-300">virtio-net</code> for all VM-to-VM traffic to achieve up to 10Gbps virtual bandwidth.</p>
                </CardContent>
              </Card>
              <Card className="glass-dark border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <ExternalLink className="size-5" /> Guacamole Console
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300">
                  <p>Install Apache Guacamole in an LXC container for agentless RDP/SSH access. Provides a "Clientless" experience for the whole lab.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}