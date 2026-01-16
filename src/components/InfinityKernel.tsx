import React, { useEffect } from 'react';
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