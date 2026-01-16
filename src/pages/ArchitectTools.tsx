import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { generateInstallScript } from '@/lib/powershell-template';
import { Copy, Terminal, Download, Calculator } from 'lucide-react';
import { toast } from 'sonner';
export function ArchitectTools() {
  const [win11, setWin11] = useState(200);
  const [kali, setKali] = useState(100);
  const [fyde, setFyde] = useState(100);
  const total = 1000;
  const shared = total - win11 - kali - fyde;
  const [usbDrive, setUsbDrive] = useState("E:");
  const [isoPath, setIsoPath] = useState("C:\\ISOs\\proxmox-ve-8.iso");
  const chartData = useMemo(() => [
    { name: 'Windows 11', value: win11, color: '#3b82f6' },
    { name: 'Kali Linux', value: kali, color: '#10b981' },
    { name: 'openFyde', value: fyde, color: '#f59e0b' },
    { name: 'Shared Data', value: shared, color: '#64748b' },
  ], [win11, kali, fyde, shared]);
  const script = useMemo(() => generateInstallScript({
    usbDrive,
    isoPath,
    osName: "Proxmox VE 8.x"
  }), [usbDrive, isoPath]);
  const copyScript = () => {
    navigator.clipboard.writeText(script);
    toast.success("Script copied to clipboard");
  };
  return (
    <AppLayout container className="bg-slate-950">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
        <div className="space-y-8">
          <Card className="bg-slate-900 border-white/10 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="size-5 text-blue-500" /> Partition Architect
              </CardTitle>
              <CardDescription>Allocate 1TB SSD Space</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Windows 11 ({win11} GB)</Label>
                  <span className="text-xs text-slate-500 font-mono">System + Software</span>
                </div>
                <Slider value={[win11]} onValueChange={(v) => setWin11(v[0])} max={500} step={10} className="[&>span]:bg-blue-500" />
                <div className="flex justify-between items-center">
                  <Label>Kali Linux ({kali} GB)</Label>
                  <span className="text-xs text-slate-500 font-mono">Tools + Workspace</span>
                </div>
                <Slider value={[kali]} onValueChange={(v) => setKali(v[0])} max={300} step={5} className="[&>span]:bg-emerald-500" />
                <div className="flex justify-between items-center">
                  <Label>openFyde ({fyde} GB)</Label>
                  <span className="text-xs text-slate-500 font-mono">Cloud OS</span>
                </div>
                <Slider value={[fyde]} onValueChange={(v) => setFyde(v[0])} max={200} step={5} className="[&>span]:bg-orange-500" />
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} stroke="none">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-400">Remaining Shared Pool: <span className="text-white">{shared} GB</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card className="bg-slate-900 border-white/10 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="size-5 text-emerald-500" /> Script Forge
              </CardTitle>
              <CardDescription>Generate PowerShell USB Installer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>USB Drive Letter</Label>
                  <Input value={usbDrive} onChange={(e) => setUsbDrive(e.target.value)} className="bg-slate-800 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>ISO File Path</Label>
                  <Input value={isoPath} onChange={(e) => setIsoPath(e.target.value)} className="bg-slate-800 border-white/10" />
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" onClick={copyScript}>
                    <Copy className="size-4" />
                  </Button>
                </div>
                <pre className="bg-black/50 p-4 rounded-lg text-[11px] font-mono text-emerald-400/90 overflow-x-auto h-[350px]">
                  {script}
                </pre>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500" onClick={copyScript}>
                <Download className="size-4 mr-2" /> Download Provisioning Script
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}