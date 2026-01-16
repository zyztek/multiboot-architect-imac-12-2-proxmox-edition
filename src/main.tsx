import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode, useEffect } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
import { IntelligenceReport } from '@/pages/IntelligenceReport';
import { ArchitectTools } from '@/pages/ArchitectTools';
import { DeploymentProtocol } from '@/pages/DeploymentProtocol';
import { ProxmoxDashboard } from '@/pages/ProxmoxDashboard';
import { Orchestrator } from '@/pages/Orchestrator';
import { Visionary } from '@/pages/Visionary';
import { Universe } from '@/pages/Universe';
import { Singularity } from '@/pages/Singularity';
// PWA Service Worker Registration with silent failure for dev/missing assets
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silence warning as sw.js might not exist in all environments
    });
  });
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
});
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
function InfinityKernel() {
  useEffect(() => {
    const syncState = async () => {
      try {
        await fetch('/api/project-state');
      } catch (e) {
        console.warn("[INFINITY KERNEL]: Initial sync failed", e);
      }
    };
    syncState();
  }, []);
  return <RouterProvider router={router} />;
}
// Singleton pattern for React Root to prevent double-initialization errors in HMR
const container = document.getElementById('root')!;
let root: Root;
if ((globalThis as any).__REACT_ROOT__) {
  root = (globalThis as any).__REACT_ROOT__;
} else {
  root = createRoot(container);
  (globalThis as any).__REACT_ROOT__ = root;
}
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <React.Suspense fallback={
          <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
             <div className="size-16 border-t-2 border-blue-500 rounded-full animate-spin shadow-glow" />
          </div>
        }>
          <InfinityKernel />
        </React.Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);