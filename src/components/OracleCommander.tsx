import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Radio, Terminal, Sparkles } from 'lucide-react';
import { globalVoiceEngine } from '@/lib/voice-engine';
import { toast } from 'sonner';
export function OracleCommander() {
  const [isActive, setIsActive] = useState(false);
  const [lastWords, setLastWords] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  useEffect(() => {
    const handleEvolve = async (prompt: string) => {
      setIsSynthesizing(true);
      setLastWords(`Oracle synthesizing: "${prompt}"`);
      try {
        await fetch('/api/evolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        toast.info("Vision committed to Evolution Queue");
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => setIsSynthesizing(false), 2000);
      }
    };
    globalVoiceEngine.registerCommand('evolve', () => {
       setLastWords("Oracle awaits your vision...");
    });
    globalVoiceEngine.registerCommand('create protocol', () => {
       handleEvolve("Create new security protocol");
    });
    const interval = setInterval(() => {
      const activeState = globalVoiceEngine.isActive();
      setIsActive(activeState);
    }, 1000);
    return () => {
      clearInterval(interval);
      globalVoiceEngine.unregisterCommand('evolve');
      globalVoiceEngine.unregisterCommand('create protocol');
    };
  }, []);
  const handleToggle = () => {
    if (isActive) {
      globalVoiceEngine.stop();
      setIsActive(false);
      setLastWords(null);
    } else {
      globalVoiceEngine.start();
      setIsActive(true);
      setLastWords("Oracle Listening... Say 'evolve' to begin.");
    }
  };
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {lastWords && isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="glass-dark border border-blue-500/30 px-4 py-2 rounded-2xl shadow-glow mb-2"
          >
            <div className="flex items-center gap-2">
              {isSynthesizing ? <Sparkles className="size-3 text-purple-400 animate-spin" /> : <Terminal className="size-3 text-blue-400" />}
              <span className={`text-[10px] font-mono uppercase tracking-widest italic ${isSynthesizing ? 'text-purple-400' : 'text-blue-400'}`}>
                {lastWords}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`size-16 rounded-full flex items-center justify-center relative transition-all duration-500 ${
          isActive
            ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.6)] ring-2 ring-blue-400'
            : 'bg-slate-900 border border-white/10 hover:border-blue-500/50'
        }`}
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="active"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative"
            >
              <Radio className={`size-6 text-white ${isSynthesizing ? 'animate-bounce' : 'animate-pulse'}`} />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white rounded-full -z-10"
              />
            </motion.div>
          ) : (
            <motion.div
              key="inactive"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className="size-6 text-slate-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}