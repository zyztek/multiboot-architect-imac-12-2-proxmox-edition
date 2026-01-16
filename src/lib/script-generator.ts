import { StorageConfig, ScriptMode, VmConfig } from '@shared/types';
interface GeneratorOptions {
  mode: ScriptMode;
  usbDrive?: string;
  isoPath?: string;
  storage?: StorageConfig;
  diskId?: string;
  vms?: VmConfig[];
}
export function generateScript(options: GeneratorOptions): string {
  const { mode, usbDrive, isoPath, storage, diskId = 'local-zfs', vms } = options;
  switch (mode) {
    case 'usb':
      return `# MultiBoot Architect: USB Provisioning (PowerShell)
$USB_DRIVE = "${usbDrive || 'E:'}"
$ISO_PATH = "${isoPath || 'C:\\ISOs\\proxmox-ve-8.iso'}"
Write-Host "--- Provisioning Bootable Proxmox Media ---" -ForegroundColor Cyan
if (-not (Test-Path $ISO_PATH)) { throw "ISO not found at $ISO_PATH" }
# Note: Manual formatting recommended via Rufus or ventoy for iMac 12,2 EFI quirks
# But this script handles raw file extraction for UEFI-only boot
$mount = Mount-DiskImage -ImagePath $ISO_PATH -PassThru
$letter = ($mount | Get-Volume).DriveLetter + ":"
Copy-Item -Path "$letter\\*" -Destination "$USB_DRIVE\\" -Recurse -Force
Dismount-DiskImage -ImagePath $ISO_PATH
Write-Host "[SUCCESS] USB Ready. Use 'nomodeset' in GRUB on first boot." -ForegroundColor Green`;
    case 'zfs-setup':
      if (!storage) return "# Error: Storage config missing";
      return `# Proxmox ZFS Dataset Architecture (Bash)
# Execute on Proxmox Host Shell
# Create datasets for optimized guest I/O and snapshots
zfs create rpool/data/win11 -o quota=${storage.win11}G
zfs create rpool/data/kali -o quota=${storage.kali}G
zfs create rpool/data/fyde -o quota=${storage.fyde}G
zfs create rpool/data/shared -o quota=${storage.shared}G
# Set up Shared Data permissions for SMB/NFS bridge
chmod 770 /rpool/data/shared
chown root:www-data /rpool/data/shared
echo "ZFS Datasets Created Successfully."`;
    case 'vm-create':
      if (!vms) return "# Error: VM configs missing";
      return `# Proxmox VM CLI Provisioning (Bash)
# Automates creation of optimized nodes for iMac 12,2 hardware
${vms.map(vm => `
# Creating ${vm.name} (VMID: ${vm.vmid})
qm create ${vm.vmid} --name ${vm.name} --memory ${vm.memory} --cores ${vm.cores} --net0 virtio,bridge=vmbr0
qm set ${vm.vmid} --scsihw virtio-scsi-pci --scsi0 ${diskId}:vm-${vm.vmid}-disk-0,size=60G
qm set ${vm.vmid} --ostype ${vm.name.includes('win') ? 'win11' : 'l26'}
${vm.hasTpm ? `qm set ${vm.vmid} --efidisk0 ${diskId}:0,format=raw,efitype=4m,pre-enrolled-keys=1 --bios ovmf` : ''}
${vm.hasTpm ? `qm set ${vm.vmid} --tpmstate0 ${diskId}:vmid-${vm.vmid}-tpm,version=v2.0` : ''}
${vm.gpuPassthrough ? `# Manual Step: Add PCI device for Radeon 6970M\n# qm set ${vm.vmid} --hostpci0 01:00.0,pcie=1,x-vga=1` : ''}
`).join('\n')}
echo "All VM templates provisioned."`;
    default:
      return "Invalid Mode Selection";
  }
}