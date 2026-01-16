import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, FileCode, Terminal, Cloud, RefreshCw, CheckCircle2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GITHUB_WORKFLOW_DEPLOY, ANSIBLE_PROXMOX_DEPLOY, DEVCONTAINER_CONFIG } from '@/lib/cosmos-templates';
import { toast } from 'sonner';
export function CosmosExportPanel() {
  const [activeFile, setActiveFile] = useState<'workflow' | 'ansible' | 'devcontainer'>('workflow');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState(0);
  const fileContent = {
    workflow: GITHUB_WORKFLOW_DEPLOY,
    ansible: ANSIBLE_PROXMOX_DEPLOY,
    devcontainer: DEVCONTAINER_CONFIG
  }[activeFile];
  const handleExport = async () => {
    setIsExporting(true);
    const steps = ["Initializing Repository", "Generating Blueprints", "Injecting Secrets", "Syncing to Cosmos"];
    for (let i = 0; i < steps.length; i++) {
      setExportStep(i + 1);
      await new Promise(r => setTimeout(r, 1200));
    }
    setIsExporting(false);
    toast.success("GitHub Cosmos Sync Complete: iMac Environment is now Cloud-Portable");
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <Card className="glass-dark border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-black flex items-center gap-2 text-blue-400 uppercase tracking-tighter">
              <Github className="size-4" /> GitHub Cosmos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[10px] text-slate-400 uppercase leading-relaxed tracking-wider">
              Bridge your local iMac Sandy Bridge cluster with GitHub Codespaces. Automate multi-node Proxmox deployments via Ansible & Actions.
            </p>
            <div className="space-y-2">
              <Button
                variant={activeFile === 'workflow' ? 'secondary' : 'outline'}
                className="w-full justify-start text-[10px] h-9"
                onClick={() => setActiveFile('workflow')}
              >
                <FileCode className="size-3 mr-2 text-blue-400" /> deploy.yml
              </Button>
              <Button
                variant={activeFile === 'ansible' ? 'secondary' : 'outline'}
                className="w-full justify-start text-[10px] h-9"
                onClick={() => setActiveFile('ansible')}
              >
                <Terminal className="size-3 mr-2 text-emerald-400" /> proxmox.yml
              </Button>
              <Button
                variant={activeFile === 'devcontainer' ? 'secondary' : 'outline'}
                className="w-full justify-start text-[10px] h-9"
                onClick={() => setActiveFile('devcontainer')}
              >
                <Cloud className="size-3 mr-2 text-purple-400" /> devcontainer.json
              </Button>
            </div>
            <div className="pt-4">
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-blue-600 hover:bg-blue-500 h-12 font-black text-xs uppercase tracking-widest"
              >
                {isExporting ? <RefreshCw className="size-4 mr-2 animate-spin" /> : <Github className="size-4 mr-2" />}
                {isExporting ? `SYNCING STAGE ${exportStep}...` : "EXPORT TO COSMOS"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-dark border-blue-500/20 bg-blue-500/5 p-6 text-blue-400">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase mb-2">
            <Globe className="size-3" /> Portability Status
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[9px]"><span>Codespaces Sync</span><CheckCircle2 className="size-3 text-emerald-500" /></div>
            <div className="flex justify-between text-[9px]"><span>Ansible Vault</span><Badge className="text-[7px] h-3">SECURED</Badge></div>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-8">
        <Card className="glass-dark border-white/10 text-white h-[500px] flex flex-col overflow-hidden shadow-2xl">
          <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between py-3">
            <CardTitle className="text-blue-400 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic">
              Code Previewer
            </CardTitle>
            <Badge variant="outline" className="text-[8px] uppercase border-blue-500/30 text-blue-400 font-mono">YAML-V2</Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative bg-black/40 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.pre
                key={activeFile}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 h-full overflow-auto text-blue-300/90 font-mono text-[10px] leading-relaxed"
              >
                {fileContent}
              </motion.pre>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}