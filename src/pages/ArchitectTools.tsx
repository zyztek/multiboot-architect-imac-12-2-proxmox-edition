import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Terminal, Calculator, Upload, FileText, Zap, HardDrive, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateScript } from '@/lib/script-generator';
import { detectFormat, generateImportCommand } from '@/lib/iso-parser';
import type { ApiResponse, ProjectState, ScriptMode, IsoMetadata } from '@shared/types';
export function ArchitectTools() {
  const queryClient = useQueryClient();
  const { data: projectState, isLoading } = useQuery({
    queryKey: ['project-state'],
    queryFn: async () => {
      const res = await fetch('/api/project-state');
      const json = await res.json() as ApiResponse<ProjectState>;
      if (!json.success || !json.data) {
        throw new Error("Architect state synchronization failed");
      }
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
      toast.success("Blueprint synchronized to kernel");
    }
  });
  const [win11, setWin11] = useState(200);
  const [kali, setKali] = useState(100);
  const [fyde, setFyde] = useState(100);
  const [scriptMode, setScriptMode] = useState<ScriptMode>('usb');
  const [isGodMode, setIsGodMode] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [detectedIso, setDetectedIso] = useState<IsoMetadata | null>(null);
  useEffect(() => {
    if (projectState?.storage) {
      setWin11(projectState.storage.win11);
      setKali(projectState.storage.kali);
      setFyde(projectState.storage.fyde);
    }
  }, [projectState]);
  const sharedSize = Math.max(0, 1000 - win11 - kali - fyde);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const metadata = detectFormat(file.name, file.size);
      setDetectedIso(metadata as IsoMetadata);
      toast.info(`Detected: ${metadata.detectedOs}`);
    }
  };
  const runSimulation = async () => {
    setIsSimulating(true);
    await fetch('/api/usb-sim', { method: 'POST', body: JSON.stringify({ partitions: [win11, kali, fyde] }) });
    await new Promise(r => setTimeout(r, 2000));
    setIsSimulating(false);
    toast.success("Simulation Complete");
  };
  const generatedScriptCode = detectedIso
    ? generateImportCommand(detectedIso)
    : generateScript({
        mode: isGodMode ? 'ventoy-god' : scriptMode,
        storage: { win11, kali, fyde, shared: sharedSize },
        vms: projectState?.vms
      });
  if (isLoading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-400 font-mono uppercase">Syncing Blueprints...</div>;
  return (
    <AppLayout container className="bg-slate-950">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        <div className="lg:col-span-5 space-y-6">
          <Tabs defaultValue="partition" className="w-full">
            <TabsList className="bg-slate-900/50 border border-white/10 w-full p-1">
              <TabsTrigger value="partition" className="flex-1 text-[10px] uppercase font-bold">Partition</TabsTrigger>
              <TabsTrigger value="forge" className="flex-1 text-[10px] uppercase font-bold">Forge</TabsTrigger>
              <TabsTrigger value="universe" className="flex-1 text-[10px] uppercase font-bold">Universe</TabsTrigger>
            </TabsList>
            <TabsContent value="partition" className="pt-4 space-y-4">
              <Card className="glass-dark border-white/10 text-white">
                <CardHeader><CardTitle className="text-blue-400 flex items-center gap-2 text-xs uppercase italic"><Calculator className="size-4" /> Storage Blueprint</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className={`size-4 ${isGodMode ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} />
                      <span className="text-[10px] font-bold uppercase">USB God Mode</span>
                    </div>
                    <Button variant={isGodMode ? "default" : "outline"} size="sm" className="h-6 text-[9px]" onClick={() => setIsGodMode(!isGodMode)}>{isGodMode ? "ON" : "OFF"}</Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><Label className="text-[10px] text-slate-500 uppercase">Win11 Allocation</Label><span className="text-blue-400 font-mono text-xs">{win11}GB</span></div>
                    <Slider value={[win11]} onValueChange={(v) => setWin11(v[0])} max={500} step={10} />
                    <div className="flex justify-between items-center"><Label className="text-[10px] text-slate-500 uppercase">Kali Lab</Label><span className="text-emerald-400 font-mono text-xs">{kali}GB</span></div>
                    <Slider value={[kali]} onValueChange={(v) => setKali(v[0])} max={300} step={5} />
                  </div>
                  <Button
                    onClick={() => projectState && mutation.mutate({ ...projectState, storage: { win11, kali, fyde, shared: sharedSize } })}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-xs h-10 font-bold uppercase tracking-widest"
                  >Save Allocation</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="forge" className="pt-4">
              <Card className="glass-dark border-white/10 text-white">
                <CardHeader><CardTitle className="text-emerald-400 text-xs uppercase tracking-widest italic">Script Selection</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {(['usb', 'zfs-setup', 'vm-create', 'terraform', 'helm', 'opencore'] as ScriptMode[]).map(mode => (
                    <Button key={mode} variant={scriptMode === mode ? 'secondary' : 'outline'} size="sm" onClick={() => { setScriptMode(mode); setDetectedIso(null); }} className="text-[9px] uppercase font-bold">
                      {mode}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="universe" className="pt-4 space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${isDragging ? 'bg-blue-500/20 border-blue-500' : 'border-white/10 hover:border-white/30'}`}
              >
                <Upload className="size-8 mb-2 text-slate-600" />
                <span className="text-xs text-slate-400 font-bold uppercase">Drop technical payload</span>
              </div>
              {detectedIso && (
                <Card className="glass-dark border-blue-500/30 bg-blue-600/5 text-white p-4 flex items-center gap-3">
                  <FileText className="size-5 text-blue-400" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold truncate max-w-[150px]">{detectedIso.filename}</h4>
                    <p className="text-[9px] text-blue-400 uppercase font-mono">{detectedIso.detectedOs}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="text-rose-500" onClick={() => setDetectedIso(null)}><RefreshCw className="size-3" /></Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-7">
           <Card className="glass-dark border-white/10 text-white h-[600px] flex flex-col overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between py-4">
              <CardTitle className="text-emerald-400 flex items-center gap-2 text-sm font-black tracking-widest"><Terminal className="size-4" /> FORGE OUTPUT</CardTitle>
              <Badge variant="outline" className="text-[9px] uppercase border-emerald-500/30 text-emerald-400 font-mono">{detectedIso ? 'UNIVERSE' : scriptMode}</Badge>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative bg-black/40">
               <pre className="p-6 h-full overflow-auto text-emerald-300/90 font-mono text-[11px] leading-relaxed">
                  {generatedScriptCode}
                  {detectedIso && `\n# --- AUTOMATED IMPORT STUB ---\nqm create 900 --name ${detectedIso.detectedOs.replace(/\s+/g, '-')} --net0 virtio,bridge=vmbr0`}
               </pre>
               <Button className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-500 h-8 text-[10px] uppercase font-bold" onClick={() => {
                 navigator.clipboard.writeText(generatedScriptCode);
                 toast.success("Buffer Copied");
               }}><Copy className="size-3 mr-2" /> Copy Buffer</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}