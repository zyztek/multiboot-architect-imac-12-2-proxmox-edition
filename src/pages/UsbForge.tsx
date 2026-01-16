import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Cpu, HardDrive, ShieldCheck, Zap, Download, Loader2, Package, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
export function UsbForge() {
  const [isForging, setIsForging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [selectedOS, setSelectedOS] = useState<string[]>(['Win11']);
  const layers = [
    "Injecting EFI Patches (Sandy Bridge)",
    "Sealing OpenCore Bootloader",
    "Binding VirtIO ISO Drivers",
    "Applying Nomodeset Flags",
    "Compressing Tsunami Bundle"
  ];
  const handleForge = async () => {
    setIsForging(true);
    setProgress(0);
    for (let i = 0; i < layers.length; i++) {
      setActiveLayer(layers[i]);
      const chunk = 100 / layers.length;
      for (let j = 0; j < 10; j++) {
        await new Promise(r => setTimeout(r, 100));
        setProgress(prev => Math.min(prev + chunk/10, (i + 1) * chunk));
      }
    }
    setIsForging(false);
    setActiveLayer("Forge Sealed: Bundle Ready");
    toast.success("Remote USB Bundle Successfully Forged");
  };
  return (
    <AppLayout container className="bg-slate-950 text-white min-h-screen">
      <div className="space-y-12 animate-fade-in pb-20">
        <div className="border-b border-white/10 pb-8 flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter uppercase italic">Remote Forge</h1>
            <p className="text-blue-400 font-mono text-[10px] tracking-[0.4em] uppercase">Browser-Based Hardware Provisioning</p>
          </div>
          <Badge variant="outline" className="h-8 border-rose-500/50 text-rose-400 font-mono uppercase italic animate-pulse">Visionary Tier</Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="glass-dark border-white/10 text-white overflow-hidden shadow-2xl">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-xs uppercase text-blue-400 font-black italic flex items-center gap-2">
                  <Package className="size-4" /> Forge Configurator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">OS Payload Selection</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Win11', 'Kali', 'openFyde', 'Ubuntu'].map(os => (
                      <div key={os} className="flex items-center space-x-2 bg-black/40 p-3 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors">
                        <Checkbox 
                          id={os} 
                          checked={selectedOS.includes(os)} 
                          onCheckedChange={(val) => {
                            if (val) setSelectedOS([...selectedOS, os]);
                            else setSelectedOS(selectedOS.filter(x => x !== os));
                          }}
                        />
                        <label htmlFor={os} className="text-xs font-bold cursor-pointer">{os}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Injection Modules</Label>
                  <div className="space-y-2">
                    {[
                      { icon: ShieldCheck, label: "EFI Patch (iMac 12,2)" },
                      { icon: Cpu, label: "OpenCore 0.9.8" },
                      { icon: HardDrive, label: "VirtIO Guest Drivers" },
                      { icon: Zap, label: "Nomodeset Kernel Flags" }
                    ].map((mod, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-blue-600/5 border border-blue-500/20 rounded-lg">
                        <mod.icon className="size-4 text-blue-400" />
                        <span className="text-[11px] font-bold text-slate-300">{mod.label}</span>
                        <div className="ml-auto size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      </div>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleForge} 
                  disabled={isForging || selectedOS.length === 0}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-xs font-black uppercase tracking-[0.2em] shadow-glow"
                >
                  {isForging ? <Loader2 className="size-5 mr-2 animate-spin" /> : <Globe className="size-5 mr-2" />}
                  {isForging ? "FORGING BUNDLE..." : "INITIATE REMOTE FORGE"}
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <Card className="glass-dark border-white/10 text-white h-[580px] flex flex-col overflow-hidden">
              <CardHeader className="bg-white/5 border-b border-white/5 flex justify-between items-center py-4">
                <CardTitle className="text-emerald-400 text-xs font-black uppercase italic tracking-widest flex items-center gap-2">
                  <Zap className="size-4" /> Injection Matrix
                </CardTitle>
                <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/30 text-emerald-400">{Math.round(progress)}%</Badge>
              </CardHeader>
              <CardContent className="p-8 flex-1 flex flex-col justify-center items-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {isForging ? (
                    <motion.div 
                      key="forging"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="flex flex-col items-center gap-12 w-full max-w-md"
                    >
                      <div className="grid grid-cols-10 gap-2 w-full">
                        {Array.from({ length: 100 }).map((_, i) => (
                          <motion.div 
                            key={i}
                            animate={{ 
                              opacity: i < progress ? 1 : 0.1,
                              backgroundColor: i < progress ? '#00ffff' : '#1e293b',
                              scale: i === Math.floor(progress) ? [1, 1.5, 1] : 1
                            }}
                            className="aspect-square rounded-[1px]"
                          />
                        ))}
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-cyanNeon font-mono text-[11px] uppercase tracking-[0.3em] animate-pulse">{activeLayer}</p>
                        <Progress value={progress} className="h-1 bg-slate-800" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="idle"
                      className="text-center space-y-6"
                    >
                      <div className={`size-32 rounded-full border-2 flex items-center justify-center transition-all duration-1000 ${progress === 100 ? 'border-emerald-500 shadow-glow bg-emerald-500/10' : 'border-white/5 bg-white/5 opacity-40'}`}>
                        {progress === 100 ? <ShieldCheck className="size-16 text-emerald-400" /> : <Package className="size-16 text-slate-700" />}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tight">{progress === 100 ? "BUNDLE SEALED" : "Awaiting Config"}</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{progress === 100 ? "Ready for direct hardware flash" : "Target: iMac 12,2 Sandy Bridge"}</p>
                      </div>
                      {progress === 100 && (
                        <div className="flex flex-col gap-3">
                          <Button className="bg-blue-600 hover:bg-blue-500 font-black text-[10px] uppercase h-10 px-8">
                            <Download className="size-4 mr-2" /> Download Tsunami.iso (~4.2GB)
                          </Button>
                          <Button variant="ghost" className="text-emerald-400 text-[10px] font-bold uppercase h-8 hover:bg-emerald-400/10">
                            Transfer to WebUSB Flash Module
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Visual Artifacts */}
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}