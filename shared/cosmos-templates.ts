export const GITHUB_WORKFLOW_DEPLOY = `name: Singularity CI/CD
on:
  push:
    branches: [ main ]
jobs:
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      - name: Install & Build
        run: |
          bun install
          bun run build
      - name: Deploy Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
`;
export const DEPENDABOT_CONFIG = `version: 2
updates:
  - package-ecosystem: "bun"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
`;
export const GITHUB_SECRETS_GUIDE = `# Singularity Secrets Management
To enable full automation, configure the following secrets in GitHub Repository Settings:
| Secret Name | Purpose | Example |
|-------------|---------|---------|
| PROXMOX_TOKEN | API Access for Orchestrator | root@pam!id=... |
| SSH_PRIVATE_KEY | Secure Node Access | -----BEGIN RSA... |
| CLOUDFLARE_API_KEY | Worker/DO Deployment | xxxxxxxxxxxxxxx |
| COSMOS_PWA_SIGN | PWA Verification Key | singularity_0x1 |
## Usage in Workflows
\`\`\`yaml
env:
  PVE_TOKEN: ${{ secrets.PROXMOX_TOKEN }}
\`\`\`
`;
export const ANSIBLE_PROXMOX_DEPLOY = `---
- name: Proxmox iMac Singularity Provisioning
  hosts: imac_nodes
  tasks:
    - name: Create VM from Infinity Blueprint
      proxmox_kvm:
        api_user: "root@pam"
        node: "pve-imac-01"
        name: "Win11-Cosmos-Node"
        vmid: 150
        cores: 4
        memory: 8192
        state: present
`;
export const GITHUB_WIKI_TEMPLATE = `# iMac 12,2 Singularity Architecture
## Hardware Specs
- CPU: Intel Core i7-2600 (Sandy Bridge)
- GPU: AMD Radeon HD 6970M (TeraScale 3)
- Memory: 32GB DDR3-1333
- Hypervisor: Proxmox VE 8.1
## Infinity Ecosystem
The iMac 12,2 Architect is a production-grade hypervisor stack designed for the singularity era. It leverages IOMMU passthrough to provide near-native performance for Windows 11 and Linux guests on legacy Apple hardware.
`;
export const GITHUB_PROJECTS_CONFIG = {
  name: "Infinity Singularity Roadmap",
  columns: ["Backlog", "In Progress", "Validation", "Singularity"],
  automation: true
};
export const GALAXY_README_PRO = `# Infinity Robust v1.0
> Production Finality for the iMac 12,2 Cluster
![Build Status](https://img.shields.io/badge/Kernel-Stable-emerald)
![Arch](https://img.shields.io/badge/Arch-SandyBridge-blue)
## Features
- **Quantum Identity Node Verification**: NFT-based cluster auth.
- **Oracle AI Thermal Modeling**: Predictive scaling for TeraScale 3 GPUs.
- **ZFS Recursive History**: 100ms state rollback across 300 technical primitives.
## Deployment
\`\`\`bash
# Engaged endgame deployment
singularity --deploy --full-stack
\`\`\`
`;
export const DEVCONTAINER_CONFIG = `{
  "name": "iMac Singularity Architect",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:20"
}
`;