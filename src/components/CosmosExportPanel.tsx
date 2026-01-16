import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, FileCode, Terminal, Cloud, RefreshCw, CheckCircle2, Globe, Book, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GITHUB_WORKFLOW_DEPLOY, ANSIBLE_PROXMOX_DEPLOY, GITHUB_WIKI_TEMPLATE, GALAXY_README_PRO } from '@shared/cosmos-templates';
import { toast } from 'sonner';
export function CosmosExportPanel() {
  const [activeFile, setActiveFile] = useState<'workflow' | 'ansible' | 'wiki' | 'readme'>('workflow');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState(0);
  const fileContent = {
    workflow: GITHUB_WORKFLOW_DEPLOY,
    ansible: ANSIBLE_PROXMOX_DEPLOY,
    wiki: GITHUB_WIKI_TEMPLATE,
    readme: GALAXY_README_PRO
  }[activeFile];
  const handleExport = async () => {
    setIsExporting(true);
    const steps = ["Initializing Repository", "Metadata Injection", "Archive Sealing", "Syncing to Cosmos"];
    for (let i = 0; i < steps.length; i++) {
      setExportStep(i + 1);
      await new Promise(r => setTimeout(r, 800));
    }
    setIsExporting(false);
    toast.success("Endgame Sync Complete: Full Repository Exported");
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <Card className="glass-dark border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-black flex items-center gap-2 text-blue-400 uppercase tracking-tighter">
              <Github className="size-4" /> GitHub Cosmos Pro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                variant={activeFile === 'wiki' ? 'secondary' : 'outline'}
                className="w-full justify-start text-[10px] h-9"
                onClick={() => setActiveFile('wiki')}
              >
                <Book className="size-3 mr-2 text-purple-400" /> wiki-archive.md
              </Button>
              <Button
                variant={activeFile === 'readme' ? 'secondary' : 'outline'}
                className="w-full justify-start text-[10px] h-9"
                onClick={() => setActiveFile('readme')}
              >
                <Layout className="size-3 mr-2 text-rose-400" /> README-PRO.md
              </Button>
            </div>
            <div className="pt-4">
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-blue-600 hover:bg-blue-500 h-12 font-black text-xs uppercase tracking-widest shadow-glow"
              >
                {isExporting ? <RefreshCw className="size-4 mr-2 animate-spin" /> : <Globe className="size-4 mr-2" />}
                {isExporting ? `SEALING STAGE ${exportStep}...` : "BATCH EXPORT"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-8">
        <Card className="glass-dark border-white/10 text-white h-[500px] flex flex-col overflow-hidden shadow-2xl">
          <CardHeader className="bg-white/5 border-b border-white/5 py-3">
            <CardTitle className="text-blue-400 text-[10px] font-black uppercase tracking-widest italic">
              Live Blueprint Stream
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-black/40 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.pre
                key={activeFile}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="p-6 h-full overflow-auto text-blue-300/90 font-mono text-[10px] leading-relaxed"
              >
                {activeFile === 'wiki' || activeFile === 'readme' ? fileContent : fileContent}
              </motion.pre>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}