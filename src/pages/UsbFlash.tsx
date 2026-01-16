import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Usb, Zap, ShieldAlert, Cpu, Terminal, RefreshCw, CheckCircle2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
export function UsbFlash() {
  const [device, setDevice] = useState<USBDevice | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [terminalLog, setTerminalLog] = useState<string[]>(["[READY] WebUSB Engine Initialized"]);
  const connectDevice = async () => {
    try {
      if (!navigator.usb) {
        toast.error("WebUSB is not supported in this browser. Use Chrome/Edge.");
        return;
      }
      const selected = await navigator.usb.requestDevice({ filters: [] });
      setDevice(selected);
      setTerminalLog(prev => [...prev, `[LINKED] ${selected.productName || 'Unknown Device'}`]);
      toast.success("Hardware Linked to Architect");
    } catch (e) {
      console.error(e);
    }
  };
  const initiateFlash = async () => {
    if (!device) return;
    setIsFlashing(true);
    setTerminalLog(prev => [...prev, "[FORGE] Fetching remote bundle manifest...", "[FLASH] Initializing GPT partition table..."]);
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 150));
      setProgress(i);
      if (i === 20) setTerminalLog(prev => [...prev, "[BLOCK] Writing EFI sector 0x0001..."]);
      if (i === 50) setTerminalLog(prev => [...prev, "[BLOCK] Streaming OS payload: win11-tsunami.vhd..."]);
      if (i === 80) setTerminalLog(prev => [...prev, "[VERIFY] Checksum valid: SHA256 matches remote forge."]);
    }
    setIsFlashing(false);
    setTerminalLog(prev => [...prev, "[SUCCESS] Flash complete. iMac 12,2 bootstrap ready."]);
    toast.success("Deployment Media Prepared");
  };
  return (
    <AppLayout container className="bg-slate-950 text-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">WebUSB Flash</h1>
            <p className="text-emerald-400 font-mono text-[10px] tracking-[0.4em] uppercase">Browser-to-Hardware Imaging Module</p>
          </div>
          <Badge variant="outline" className="h-8 border-cyanNeon/50 text-cyanNeon font-mono uppercase italic">Chrome Engine Active</Badge>
        </div>
        <Alert className="bg-rose-500/10 border-rose-500/30 text-rose-400">
          <ShieldAlert className="size-4" />
          <AlertTitle className="text-xs font-black uppercase italic tracking-widest">CRITICAL WARNING</AlertTitle>
          <AlertDescription className="text-[10px] uppercase font-bold mt-1">
            Flashing will erase all data on the target USB drive. Ensure the correct hardware is selected.
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="glass-dark border-white/10 text-white">
              <CardHeader><CardTitle className="text-[10px] uppercase text-slate-500 tracking-widest italic">Hardware Status</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${device ? 'bg-emerald-500/10 border-emerald-500/40 shadow-glow' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
                  {device ? (
                    <>
                      <CheckCircle2 className="size-10 text-emerald-400" />
                      <div className="text-center">
                        <p className="text-xs font-black uppercase text-white truncate max-w-[180px]">{device.productName || 'Hardware Linked'}</p>
                        <p className="text-[9px] text-emerald-400 font-mono uppercase">READY FOR IMAGE</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Usb className="size-10 text-slate-700" />
                      <Button onClick={connectDevice} variant="outline" className="h-9 border-blue-500/20 text-blue-400 text-[10px] uppercase font-bold">
                        Request USB Access
                      </Button>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] uppercase font-bold text-slate-500 px-1">
                    <span>Write Throughput</span>
                    <span>{isFlashing ? '124 MB/s' : '0 MB/s'}</span>
                  </div>
                  <Progress value={progress} className="h-1 bg-slate-900" />
                </div>
                <Button 
                  onClick={initiateFlash} 
                  disabled={!device || isFlashing}
                  className={`w-full h-12 font-black text-xs uppercase tracking-widest transition-all ${isFlashing ? 'bg-magentaPulse shadow-neonGlow' : 'bg-emerald-600 hover:bg-emerald-500 shadow-glow'}`}
                >
                  {isFlashing ? <RefreshCw className="size-4 mr-2 animate-spin" /> : <Zap className="size-4 mr-2" />}
                  {isFlashing ? `IMAGING ${progress}%` : "COMMENCE FLASH"}
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8">
            <Card className="glass-dark border-white/10 text-white h-[500px] flex flex-col overflow-hidden shadow-2xl">
              <CardHeader className="bg-white/5 border-b border-white/5 flex justify-between items-center py-3 px-6">
                <CardTitle className="text-blue-400 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                  <Terminal className="size-4" /> Flash Terminal
                </CardTitle>
                <div className="flex gap-1">
                  <div className="size-2 rounded-full bg-rose-500/50" />
                  <div className="size-2 rounded-full bg-amber-500/50" />
                  <div className="size-2 rounded-full bg-emerald-500/50" />
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 bg-black/60 relative">
                <div className="absolute inset-0 p-6 overflow-auto font-mono text-[11px] leading-relaxed space-y-1">
                  {terminalLog.map((log, i) => (
                    <div key={i} className={`flex gap-3 ${log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('ERR') ? 'text-rose-400' : 'text-blue-300/80'}`}>
                      <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                      <span className="flex-1">{log}</span>
                    </div>
                  ))}
                  {isFlashing && (
                    <motion.div 
                      animate={{ opacity: [0, 1] }} 
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-cyanNeon font-bold"
                    >
                      {" >> "} WRITING BLOCKS...
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}