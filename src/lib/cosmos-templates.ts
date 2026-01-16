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
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
  worker-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Worker
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CF_API_TOKEN }}
          accountId: \${{ secrets.CF_ACCOUNT_ID }}
`;
export const ANSIBLE_PROXMOX_DEPLOY = `---
- name: Proxmox iMac Singularity Provisioning
  hosts: imac_nodes
  vars:
    proxmox_api_token_id: "{{ secrets.PROXMOX_TOKEN_ID }}"
    proxmox_api_token_secret: "{{ secrets.PROXMOX_TOKEN_SECRET }}"
  tasks:
    - name: Create VM from Infinity Blueprint
      proxmox_kvm:
        api_user: "root@pam"
        api_token_id: "{{ proxmox_api_token_id }}"
        api_token_secret: "{{ proxmox_api_token_secret }}"
        node: "pve-imac-01"
        name: "Win11-Cosmos-Node"
        vmid: 150
        cores: 4
        memory: 8192
        net0: "virtio,bridge=vmbr0"
        scsihw: "virtio-scsi-pci"
        virtio0: "local-zfs:vm-150-disk-0,size=200G"
        state: present
`;
export const DEVCONTAINER_CONFIG = `{
  "name": "iMac Singularity Architect",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:20",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {},
    "ghcr.io/devcontainers/features/common-utils:2": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "tamasfe.even-better-toml",
        "ms-azuretools.vscode-docker"
      ]
    }
  },
  "postCreateCommand": "bun install",
  "remoteUser": "node"
}
`;