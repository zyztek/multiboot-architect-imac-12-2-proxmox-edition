import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import '@/index.css';
import { InfinityKernel } from '@/components/InfinityKernel';
// PWA Service Worker Registration with silent failure
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
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
declare global {
  interface Window {
    __REACT_ROOT__?: Root;
  }
}
const container = document.getElementById('root')!;
if (!window.__REACT_ROOT__) {
  window.__REACT_ROOT__ = createRoot(container);
}
window.__REACT_ROOT__.render(
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