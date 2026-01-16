import type { CodexItem, DeploymentStep, FleetNode, Snapshot } from './types';
const categories: CodexItem['category'][] = ['Visionary', 'Robust', 'VM', 'AI', 'Galaxy', 'Singularity'];
const complexities: CodexItem['complexity'][] = ['Standard', 'Advanced', 'Elite', 'God', 'Singularity'];
export const MASTER_CODEX: CodexItem[] = Array.from({ length: 300 }).map((_, i) => {
  const catIdx = Math.min(categories.length - 1, Math.floor(i / 50));
  const compIdx = i % complexities.length;
  return {
    id: `cx-${i}`,
    category: categories[catIdx],
    title: `${categories[catIdx]} Protocol ${i + 1}`,
    description: `High-fidelity implementation of ${categories[catIdx]} logic for Sandy Bridge Singularity architecture. Optimized for Radeon 6970M passthrough.`,
    complexity: complexities[compIdx],
    cmd: i % 10 === 0 ? `singularity --init --module ${i}` : undefined
  };
});
export const MASTER_STEPS: DeploymentStep[] = Array.from({ length: 300 }).map((_, i) => {
  const requires = i > 0 ? [i - 1] : undefined;
  return {
    id: i,
    title: `Phase ${i + 1}: Deployment Vector`,
    category: i < 50 ? 'Pre-Flight' : i < 100 ? 'Hardware' : i < 150 ? 'Hypervisor' : i < 200 ? 'Virtualization' : i < 250 ? 'Post-Install' : 'Singularity',
    desc: `Executing technical sequence ${i + 1} of the 300-point Infinity Robust deployment plan.`,
    requires
  };
});
export const MOCK_FLEET: FleetNode[] = [
  { id: 'f1', name: 'iMac-Master', ip: '10.0.0.10', load: 12, status: 'online', isLeader: true },
  { id: 'f2', name: 'iMac-Node-02', ip: '10.0.0.11', load: 45, status: 'online', isLeader: false },
  { id: 'f3', name: 'iMac-Node-03', ip: '10.0.0.12', load: 88, status: 'syncing', isLeader: false },
  { id: 'f4', name: 'MacPro-Vault', ip: '10.0.0.20', load: 5, status: 'offline', isLeader: false }
];
export const MOCK_SNAPSHOTS: Snapshot[] = [
  { id: 's1', timestamp: new Date(Date.now() - 86400000).toISOString(), checklistState: new Array(300).fill(false), label: 'Day 0 - Initialization' },
  { id: 's2', timestamp: new Date(Date.now() - 43200000).toISOString(), checklistState: new Array(300).fill(true).map((_, i) => i < 150), label: 'Day 1 - Robust Expansion' }
];