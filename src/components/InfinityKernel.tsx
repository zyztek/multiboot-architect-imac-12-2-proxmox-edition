import React, { useEffect, useState, useCallback } from 'react';
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
import { UsbForge } from '@/pages/UsbForge';
import { UsbFlash } from '@/pages/UsbFlash';
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
  { path: "/usb-forge", element: <UsbForge />, errorElement: <RouteErrorBoundary /> },
  { path: "/usb-flash", element: <UsbFlash />, errorElement: <RouteErrorBoundary /> },
]);
export function InfinityKernel() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'hydrating' | 'degraded' | 'stable'>('hydrating');
  const [retryCount, setRetryCount] = useState(0);
  const performSync = useCallback(async (active: boolean) => {
    try {
      const res = await fetch('/api/project-state');
      if (res.ok && active) {
        const json = await res.json();
        if (json.success) {
          setSyncStatus('stable');
        } else {
          throw new Error("Handshake declined");
        }
      } else if (active) {
        throw new Error("Network unreachable");
      }
    } catch (e) {
      if (!active) return;
      if (retryCount < 5) {
        const nextRetry = retryCount + 1;
        const delay = Math.pow(2, retryCount) * 500;
        console.warn(`[INFINITY KERNEL]: Sync retry ${nextRetry}/5 in ${delay}ms`);
        setTimeout(() => {
          if (active) {
            setRetryCount(nextRetry);
          }
        }, delay);
      } else {
        console.error("[INFINITY KERNEL]: Sync failure. Engaging Degraded Mode.");
        setSyncStatus('degraded');
      }
    }
  }, [retryCount]);
  useEffect(() => {
    let active = true;
    if (syncStatus === 'hydrating' || syncStatus === 'degraded') {
      performSync(active);
    }
    return () => { active = false; };
  }, [retryCount, performSync, syncStatus]);
  return (
    <>
      <AnimatePresence>
        {syncStatus === 'hydrating' && (
          <motion.div
            key="kernel-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[999] bg-slate-950 flex flex-col items-center justify-center gap-6"
          >
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-glow animate-pulse">
              <Terminal className="text-white size-12" />
            </div>
            <div className="space-y-3 text-center">
              <h2 className="text-white font-black uppercase tracking-[0.5em] italic text-2xl">Infinity Kernel</h2>
              <div className="flex flex-col gap-1">
                <p className="text-blue-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                  Hydrating Robust State...
                </p>
                {retryCount > 0 && (
                  <p className="text-slate-600 font-mono text-[8px] uppercase tracking-widest">
                    Link Attempt {retryCount}/5
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative h-full w-full">
        {syncStatus === 'degraded' && (
          <div className="fixed top-0 left-0 right-0 z-[1000] bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest py-1 flex items-center justify-center gap-2">
            <ShieldAlert className="size-3" /> Degraded Mode Active: Kernel Out of Sync
          </div>
        )}
        {(syncStatus === 'stable' || syncStatus === 'degraded') && (
          <RouterProvider router={router} />
        )}
      </div>
    </>
  );
}