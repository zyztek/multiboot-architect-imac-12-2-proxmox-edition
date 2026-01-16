import type { CodexItem, DeploymentStep } from './types';
const categories: CodexItem['category'][] = ['Visionary', 'Robust', 'VM', 'AI', 'Galaxy'];
const complexities: CodexItem['complexity'][] = ['Standard', 'Advanced', 'Elite', 'God'];
export const MASTER_CODEX: CodexItem[] = Array.from({ length: 150 }).map((_, i) => {
  const catIdx = Math.floor(i / 30);
  const compIdx = i % 4;
  return {
    id: `cx-${i}`,
    category: categories[catIdx],
    title: `${categories[catIdx]} Module ${i + 1}`,
    description: `Infinity Robust specialized technical primitive for ${categories[catIdx]} operations, ensuring peak i7-2600 Sandy Bridge performance.`,
    complexity: complexities[compIdx],
    cmd: i % 5 === 0 ? `pve-tool --module ${i} --enable` : undefined
  };
});
export const MASTER_STEPS: DeploymentStep[] = Array.from({ length: 150 }).map((_, i) => {
  const requires = i > 0 ? [i - 1] : undefined;
  return {
    id: i,
    title: `Technical Protocol ${i + 1}`,
    category: i < 30 ? 'Pre-Flight' : i < 60 ? 'Hardware' : i < 90 ? 'Hypervisor' : i < 120 ? 'Virtualization' : 'Post-Install',
    desc: `Executing phase ${i + 1} of the iMac 12,2 Infinity Robust deployment pipeline.`,
    requires
  };
});