import { AiArchitectRequest, AiArchitectResponse, VmConfig } from '@shared/types';
export function runAiWizard(req: AiArchitectRequest): AiArchitectResponse {
  const { goal, ramGb, storageGb } = req;
  const vms: VmConfig[] = [];
  const commands: string[] = [];
  if (goal === 'Workstation') {
    vms.push({
      vmid: 100,
      name: 'Win11-Main',
      cores: 4,
      memory: Math.min(ramGb * 0.6, 16) * 1024,
      diskId: 'local-zfs',
      hasTpm: true,
      gpuPassthrough: true,
      tags: ['productivity', 'gpu']
    });
    commands.push("qm set 100 --cpu host,hidden=1,flags=+pcid");
  } else if (goal === 'Server') {
    vms.push({
      vmid: 200,
      name: 'Docker-Host',
      cores: 2,
      memory: 4096,
      diskId: 'local-zfs',
      hasTpm: false,
      gpuPassthrough: false,
      tags: ['infrastructure']
    });
    commands.push("apt install -y docker.io docker-compose");
  }
  return {
    recommendedVms: vms,
    zfsConfig: `zfs set compression=lz4 rpool/data\nzfs set xattr=sa rpool/data`,
    cliCommands: commands,
    reasoning: `Optimized for Sandy Bridge limits. Pinning 4 cores for high-demand tasks.`,
    prediction: `CPU thermal saturation expected at 85% load. I/O wait will likely bottleneck if more than 3 high-performance VMs are concurrent.`
  };
}