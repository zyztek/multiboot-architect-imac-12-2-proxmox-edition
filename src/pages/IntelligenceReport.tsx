import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, ExternalLink, ShieldAlert } from 'lucide-react';
export function IntelligenceReport() {
  return (
    <AppLayout container className="bg-slate-950">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Intelligence Report</h1>
          <p className="text-slate-400">Technical deep-dive for iMac 12,2 Sandy Bridge hardware.</p>
        </div>
        <Tabs defaultValue="proxmox" className="w-full">
          <TabsList className="bg-slate-900 border-white/10">
            <TabsTrigger value="proxmox">Proxmox Host</TabsTrigger>
            <TabsTrigger value="windows">Windows 11</TabsTrigger>
            <TabsTrigger value="kali">Kali Linux</TabsTrigger>
            <TabsTrigger value="fyde">openFyde</TabsTrigger>
          </TabsList>
          <TabsContent value="proxmox" className="mt-4">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Hypervisor Foundation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                  <Info className="size-4" />
                  <AlertTitle>Legacy BIOS/EFI Note</AlertTitle>
                  <AlertDescription>
                    The iMac 12,2 uses a 64-bit EFI but lacks standard CSM. Proxmox installer may hang without <code className="bg-black/40 px-1">nomodeset</code>.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-400">Essential Proxmox Config:</h4>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                    <li>IOMMU: Enable in GRUB <code className="text-emerald-400">intel_iommu=on iommu=pt</code></li>
                    <li>CPU Model: Set to <code className="text-emerald-400">host</code> for maximum guest performance</li>
                    <li>Network: Use <code className="text-emerald-400">vmbr0</code> bridged to physical Broadcom NIC</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="windows" className="mt-4">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Windows 11 Modernization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <h3 className="text-orange-400 font-bold flex items-center gap-2">
                    <ShieldAlert className="size-4" /> TPM & Secure Boot Bypass
                  </h3>
                  <p className="text-sm text-slate-300 mt-2">
                    Sandy Bridge does not support TPM 2.0. In Proxmox, use <strong>vTPM</strong> (SWTPM) and <strong>OVMF (UEFI)</strong>.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-400">Driver Repository:</h4>
                  <div className="flex flex-col gap-2">
                    <a href="https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers" target="_blank" className="text-sm flex items-center gap-2 hover:underline text-emerald-400">
                      VirtIO Guest Tools <ExternalLink className="size-3" />
                    </a>
                    <a href="https://github.com/dortania/OpenCore-Legacy-Patcher" target="_blank" className="text-sm flex items-center gap-2 hover:underline text-emerald-400">
                      OCLP (For Apple-specific drivers) <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="kali" className="mt-4">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Security & Pentesting Node</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Kali thrives on the i7-2600. Recommended to passthrough a secondary USB Wi-Fi adapter (TP-Link/Alfa) for monitor mode, as the internal Broadcom chip is unreliable in VMs.
                </p>
                <div className="mt-4 p-3 bg-slate-800 rounded font-mono text-xs text-emerald-400">
                  apt update && apt install -y qemu-guest-agent
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="fyde" className="mt-4">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Cloud OS Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  openFyde requires UEFI and VirtIO-GPU. Set Display to <code className="text-emerald-400">VirtIO-GPU</code> with 3D acceleration for smooth UI.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}