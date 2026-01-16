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
import { Terminal } from 'lucide-react';
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
  const [isHydrating, setIsHydrating] = useState(true);
  useEffect(() => {
    let retries = 0;
    const maxRetries = 5;
    const syncState = async () => {
      try {
        const res = await fetch('/api/project-state');
        if (res.ok) {
          setIsHydrating(false);
        } else {
          throw new Error("Initial fetch failed");
        }
      } catch (e) {
        if (retries < maxRetries) {
          retries++;
          const delay = Math.pow(2, retries) * 500;
          console.warn(`[INFINITY KERNEL]: Sync retry ${retries}/${maxRetries} in ${delay}ms`);
          setTimeout(syncState, delay);
        } else {
          console.error("[INFINITY KERNEL]: Failed to hydrate kernel state", e);
          setIsHydrating(false);
        }
      }
    };
    syncState();
  }, []);
  return (
    <>
      <AnimatePresence>
        {isHydrating && (
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
              <p className="text-blue-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Hydrating Robust State...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <RouterProvider router={router} />
    </>
  );
}