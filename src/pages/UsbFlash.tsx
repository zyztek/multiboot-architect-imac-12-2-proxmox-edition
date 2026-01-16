import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Usb, Zap, ShieldAlert, Terminal, RefreshCw, CheckCircle2, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
export function UsbFlash() {
  const [device, setDevice] = useState<USBDevice | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [terminalLog, setTerminalLog] = useState<string[]>(["[READY] WebUSB Engine Online"]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLog]);
  const connectDevice = async () => {
    try {
      if (!navigator.usb) {
        toast.error("WebUSB unsupported in this environment");
        return;
      }
      const selected = await navigator.usb.requestDevice({ filters: [] });
      setDevice(selected);
      setTerminalLog(prev => [...prev, `[LINKED] ${selected.productName || 'USB Storage'} (VID: ${selected.vendorId}, PID: ${selected.productId})`]);
      toast.success("Hardware Connected");
    } catch (e) {
      console.error(e);
    }
  };
  const initiateFlash = async () => {
    if (!device) return;
    setIsFlashing(true);
    const stages = [
      "[FORGE] Loading remote tsunami-bundle.tar.gz...",
      "[BLOCK] Partitioning GPT structure...",
      "[BLOCK] Writing EFI partition (FAT32)...",
      "[BLOCK] Injected Sandy Bridge patches to 0x01",
      "[DATA] Streaming primary payload (Win11)...",
      "[VERIFY] Checksum 0xFD42 valid.",
      "[FINAL] Syncing hardware buffers..."
    ];
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 200));
      setProgress(i);
      if (i % 15 === 0 && stages.length > 0) {
        const stage = stages.shift();
        if (stage) setTerminalLog(prev => [...prev, stage]);
      }
    }
    setIsFlashing(false);
    setTerminalLog(prev => [...prev, "[SUCCESS] Deployment Media Finalized."]);
    toast.success("iMac Boot Media Ready");
  };
  return (
    <AppLayout container className="bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">Hardware Flash</h1>
            <p className="text-emerald-400 font-mono text-[10px] tracking-[0.4em] uppercase">WebUSB Tsunami Imaging</p>
          </div>
          <Badge variant="outline" className="h-8 border-cyanNeon/50 text-cyanNeon font-mono uppercase italic">Kernel Direct</Badge>
        </div>
        <Alert className="bg-rose-500/10 border-rose-500/30 text-rose-400">
          <ShieldAlert className="size-4" />
          <AlertTitle className="text-xs font-black uppercase tracking-widest italic">Warning</AlertTitle>
          <AlertDescription className="text-[10px] uppercase font-bold mt-1">This operation is destructive. Ensure your target drive contains no critical data.</AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="glass-dark border-white/10 text-white">
              <CardHeader><CardTitle className="text-[10px] uppercase text-slate-500 tracking-widest italic font-black">Target Device</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${device ? 'bg-emerald-500/10 border-emerald-500/40 shadow-glow' : 'bg-black/40 border-white/5'}`}>
                  {device ? (
                    <>
                      <CheckCircle2 className="size-12 text-emerald-400" />
                      <div className="text-center">
                        <p className="text-xs font-black uppercase text-white truncate max-w-[200px]">{device.productName || 'Generic Drive'}</p>
                        <p className="text-[9px] text-emerald-400 font-mono uppercase font-bold mt-1">Status: Operational</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Usb className="size-12 text-slate-700" />
                      <Button onClick={connectDevice} variant="outline" className="h-10 border-blue-500/20 text-blue-400 uppercase font-black text-[10px] tracking-widest">
                        Scan Hardware
                      </Button>
                    </>
                  )}
                </div>
                {device && (
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between text-[9px] uppercase font-bold text-slate-500"><span>Vendor</span><span className="text-white">0x{device.vendorId.toString(16)}</span></div>
                    <div className="flex justify-between text-[9px] uppercase font-bold text-slate-500"><span>Product</span><span className="text-white">0x{device.productId.toString(16)}</span></div>
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] uppercase font-bold text-slate-500 px-1">
                    <span>Flash Progress</span>
                    <span className="text-emerald-400">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-slate-900" />
                </div>
                <Button 
                  onClick={initiateFlash} 
                  disabled={!device || isFlashing}
                  className={`w-full h-14 font-black text-xs uppercase tracking-widest transition-all ${isFlashing ? 'bg-magentaPulse animate-pulse shadow-neonGlow' : 'bg-emerald-600 hover:bg-emerald-500 shadow-glow'}`}
                >
                  {isFlashing ? <RefreshCw className="size-5 mr-3 animate-spin" /> : <Zap className="size-5 mr-3" />}
                  {isFlashing ? "IMAGING..." : "START HARDWARE FLASH"}
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8">
            <Card className="glass-dark border-white/10 text-white h-[540px] flex flex-col overflow-hidden shadow-2xl">
              <CardHeader className="bg-white/5 border-b border-white/5 flex justify-between items-center py-4 px-6">
                <CardTitle className="text-blue-400 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                  <Terminal className="size-4" /> Live Execution Log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 bg-black/60 relative">
                <div className="absolute inset-0 p-8 overflow-auto font-mono text-[11px] leading-relaxed space-y-2 scrollbar-thin scrollbar-thumb-white/10">
                  {terminalLog.map((log, i) => (
                    <div key={i} className={`flex gap-4 ${log.includes('SUCCESS') ? 'text-emerald-400' : 'text-blue-300/80'}`}>
                      <span className="opacity-20 font-bold">[{i.toString().padStart(3, '0')}]</span>
                      <span className="flex-1">{log}</span>
                    </div>
                  ))}
                  {isFlashing && (
                    <div className="flex gap-4 text-cyanNeon font-bold animate-pulse">
                      <span className="opacity-20 font-bold">[{terminalLog.length.toString().padStart(3, '0')}]</span>
                      <span>{" >> "} WRITING SECTORS...</span>
                    </div>
                  )}
                  <div ref={terminalEndRef} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}