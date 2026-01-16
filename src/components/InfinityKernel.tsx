import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { HomePage } from '@/pages/HomePage';
import { IntelligenceReport } from '@/pages/IntelligenceReport';
import { ArchitectTools } from '@/pages/ArchitectTools';
import { DeploymentProtocol } from '@/pages/DeploymentProtocol';
import { ProxmoxDashboard } from '@/pages/ProxmoxDashboard';
import { Orchestrator } from '@/pages/Orchestrator';
import { Visionary } from '@/pages/Visionary';
import { Universe } from '@/pages/Universe';
import { Singularity } from '@/pages/Singularity';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert } from 'lucide-react';
const router = createBrowserRouter([
  { path: "/", element: <HomePage />, errorElement: <RouteErrorBoundary /> },
  { path: "/report", element: <IntelligenceReport />, errorElement: <RouteErrorBoundary /> },
  { path: "/tools", element: <ArchitectTools />, errorElement: <RouteErrorBoundary /> },
  { path: "/protocol", element: <DeploymentProtocol />, errorElement: <RouteErrorBoundary /> },
  { path: "/proxmox", element: <ProxmoxDashboard />, errorElement: <RouteErrorBoundary /> },
  { path: "/orchestrator", element: <Orchestrator />, errorElement: <RouteErrorBoundary /> },
  { path: "/visionary", element: <Visionary />, errorElement: <RouteErrorBoundary /> },
  { path: "/universe", element: <Universe />, errorElement: <RouteErrorBoundary /> },
  { path: "/singularity", element: <Singularity />, errorElement: <RouteErrorBoundary /> },
]);
export function InfinityKernel() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'hydrating' | 'degraded' | 'stable'>('hydrating');
  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    let active = true;
    const maxRetries = 5;
    const syncState = async () => {
      try {
        const res = await fetch('/api/project-state');
        if (res.ok && active) {
          setSyncStatus('stable');
        } else {
          throw new Error("Handshake failed");
        }
      } catch (e) {
        if (!active) return;
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          const delay = Math.pow(2, retryCount) * 500;
          console.warn(`[INFINITY KERNEL]: Sync retry ${retryCount + 1}/${maxRetries} in ${delay}ms`);
          setTimeout(syncState, delay);
        } else {
          console.error("[INFINITY KERNEL]: Failed to hydrate kernel state. Engaging Degraded Mode.");
          setSyncStatus('degraded');
        }
      }
    };
    syncState();
    return () => { active = false; };
  }, [retryCount]);
  return (
    <>
      <AnimatePresence>
        {(syncStatus === 'hydrating') && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-slate-950 flex flex-col items-center justify-center gap-6"
          >
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-glow animate-pulse">
              <Terminal className="text-white size-10" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-white font-black uppercase tracking-[0.4em] italic text-xl">Infinity Kernel</h2>
              <p className="text-blue-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                Hydrating Robust State... {retryCount > 0 ? `(Attempt ${retryCount})` : ""}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative h-full w-full">
        {syncStatus === 'degraded' && (
          <div className="fixed top-0 left-0 right-0 z-[1000] bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest py-1 flex items-center justify-center gap-2">
            <ShieldAlert className="size-3" /> Degraded Mode Active: Local Mirror Only
          </div>
        )}
        <RouterProvider router={router} />
      </div>
    </>
  );
}