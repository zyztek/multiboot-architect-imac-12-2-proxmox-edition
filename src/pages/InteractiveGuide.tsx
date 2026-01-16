import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MatrixRain } from '@/components/MatrixRain';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Terminal, ShieldCheck, Github, Box, HardDrive, Cpu } from 'lucide-react';
import { verboseTextContainer, verboseTextItem } from '@/lib/utils';
const STEPS = [
  { 
    title: "Empire Genesis", 
    desc: "Fetch core ISO payloads and verify cryptographic hashes.",
    details: "Initializing high-speed streams for Proxmox 8.2 (3GB) and Windows 11 Pro (5GB)...",
    icon: HardDrive 
  },
  { 
    title: "Kernel Synthesis", 
    desc: "Inject Sandy Bridge EFI patches and nomodeset boot flags.",
    details: "Applying TeraScale 3 GPU microcode and IOMMU group overrides for iMac 12,2...",
    icon: Cpu 
  },
  { 
    title: "Multiverse Forge", 
    desc: "Configure Ventoy multi-boot with ZFS persistence.",
    details: "Formatting GPT structure... Aligning partitions for Kali 2024 and openFyde...",
    icon: Box 
  },
  { 
    title: "Endgame Synchronization", 
    desc: "Deploy GitHub Cosmos CI/CD and Wiki documentation.",
    details: "Finalizing Ansible playbooks and Terraform state templates for the global cluster...",
    icon: Github 
  }
];
export function InteractiveGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  useEffect(() => {
    setStepProgress(0);
    setIsLocked(true);
    const duration = 4000; // 4 seconds per step simulation
    const interval = 50;
    const increment = (interval / duration) * 100;
    const timer = setInterval(() => {
      setStepProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsLocked(false);
          return 100;
        }
        return prev + increment;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [currentStep]);
  const activeStepData = STEPS[currentStep];
  return (
    <AppLayout className="bg-slate-950 min-h-screen relative overflow-hidden">
      <MatrixRain />
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyanNeon/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-magentaPulse/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 relative z-10 space-y-12">
        <div className="flex flex-col gap-2 border-l-4 border-cyanNeon pl-6">
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic perspective-skew">Empire Guide</h1>
          <p className="text-cyanNeon font-mono text-xs tracking-[0.5em] uppercase">Verbose Singularity Deployment</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stepper Wizard */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -20, rotateY: 10 }}
                transition={{ duration: 0.5 }}
                className="glass-dark border-white/10 p-10 rounded-[40px] shadow-2xl relative glass3d"
              >
                <div className="absolute top-8 right-8 text-cyanNeon/20">
                  <activeStepData.icon size={120} />
                </div>
                <div className="space-y-8 relative z-10">
                  <Badge className="bg-cyanNeon text-black font-black uppercase text-[10px] tracking-widest px-4 py-1">
                    Phase 0{currentStep + 1} / 04
                  </Badge>
                  <motion.div variants={verboseTextContainer} initial="hidden" animate="visible" className="space-y-4">
                    <motion.h2 variants={verboseTextItem} className="text-4xl font-black text-white uppercase italic tracking-tight">
                      {activeStepData.title}
                    </motion.h2>
                    <motion.p variants={verboseTextItem} className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                      {activeStepData.desc}
                    </motion.p>
                    <motion.div variants={verboseTextItem} className="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-[11px] text-cyanNeon/80">
                      <span className="text-slate-600 mr-2">{"[VERBOSE]"}</span>
                      {activeStepData.details}
                    </motion.div>
                  </motion.div>
                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Syncing Neural Link</span>
                      <span className="text-cyanNeon">{Math.round(stepProgress)}%</span>
                    </div>
                    <Progress value={stepProgress} className="h-2 bg-white/5" />
                  </div>
                  <div className="flex justify-between items-center pt-6">
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="text-slate-500 hover:text-white uppercase font-black text-xs"
                    >
                      Return
                    </Button>
                    <Button 
                      onClick={() => currentStep < 3 ? setCurrentStep(currentStep + 1) : null}
                      disabled={isLocked || currentStep === 3}
                      className={`h-14 px-10 rounded-full font-black uppercase tracking-widest shadow-glow transition-all
                        ${isLocked ? 'bg-slate-800 text-slate-500' : 'bg-cyanNeon text-black hover:bg-white'}
                      `}
                    >
                      {currentStep === 3 ? "Empire Sealed" : "Proceed Phase"}
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* List Explorers */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="glass-dark border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-magentaPulse flex items-center gap-2 italic">
                  <Terminal className="size-4" /> Technical Registry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="oses" className="border-white/5">
                    <AccordionTrigger className="text-[11px] font-bold uppercase py-4">S-Tier OS Payloads</AccordionTrigger>
                    <AccordionContent className="space-y-2 pb-4">
                      {['Proxmox 8.2 (Kernel 6.5)', 'Windows 11 Pro (OCLP)', 'Kali 2024.1 (OffSec)', 'openFyde 20 (Cloud)'].map(os => (
                        <div key={os} className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <CheckCircle2 className="size-3 text-cyanNeon" /> {os}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="apps" className="border-white/5">
                    <AccordionTrigger className="text-[11px] font-bold uppercase py-4">Elite Tooling</AccordionTrigger>
                    <AccordionContent className="space-y-2 pb-4">
                      {['Rufus 4.5 (DD Patched)', 'Ventoy 1.0.97', 'VirtIO v0.2.2', 'WinPE Environment'].map(tool => (
                        <div key={tool} className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <ShieldCheck className="size-3 text-magentaPulse" /> {tool}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="github" className="border-white/5">
                    <AccordionTrigger className="text-[11px] font-bold uppercase py-4">GitHub Cosmos Suite</AccordionTrigger>
                    <AccordionContent className="space-y-2 pb-4">
                      {['CI/CD Deploy Action', 'Ansible Proxmox Playbook', 'Terraform State Hub', 'Endgame Wiki Template'].map(gh => (
                        <div key={gh} className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <Github className="size-3 text-white" /> {gh}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            <div className="glass-dark border-magentaPulse/20 bg-magentaPulse/5 p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="size-5 text-magentaPulse animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-widest italic">Oracle Intelligence</h3>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold italic">
                The iMac 12,2 Sandy Bridge architecture requires manual injection of the GibbaParent ATY driver for 6970M acceleration. Verify all hashes before flash.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}