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
    case 'ventoy-god':
      return `# VENTOY GOD-MODE PROVISIONER v2.0
# Target: iMac 12,2 (Sandy Bridge / Radeon 6970M)

$USB = "${usbDrive || 'E:'}"
$VENTOY_URL = "https://github.com/ventoy/Ventoy/releases/download/v1.0.97/ventoy-1.0.97-windows.zip"

Write-Host "[1/4] INITIALIZING VENTOY CORE..." -ForegroundColor Cyan
# Command: .\\Ventoy2Disk.exe -i $USB --force

Write-Host "[2/4] INJECTING IMAC OPENCORE PATCH..." -ForegroundColor Blue
$OC_DRIVER = "iMac-12-2-SandyBridge-6970M.efi"
$VTOY_EFI = "$USB\\VTOY_EFI"
New-Item -Path "$VTOY_EFI\\OC" -ItemType Directory -Force
Invoke-WebRequest -Uri "https://pve-imac.internal/drivers/$OC_DRIVER" -OutFile "$VTOY_EFI\\OC\\$OC_DRIVER"

Write-Host "[3/4] DEPLOYING MULTI-ISO PAYLOADS..." -ForegroundColor Green
$ISOs = @("proxmox-ve_8.1.iso", "kali-linux-2024.1.iso", "win11-sandybridge-patched.iso")
foreach ($iso in $ISOs) {
    Write-Host "Streaming $iso to $USB..."
    # Copy-Item "$isoPath\\$iso" "$USB"
}

Write-Host "[4/4] SEALING BOOTLOADER WITH NOMODESET..." -ForegroundColor Yellow
$VENTOY_CONF = @"
{
    "control": [
        { "vtoy_default_image": "/proxmox-ve_8.1.iso" },
        { "vtoy_kernel_append": "quiet intel_iommu=on nomodeset" }
    ]
}
"@
$VENTOY_CONF | Out-File "$USB\\ventoy\\ventoy.json" -Encoding utf8

Write-Host "USB PROVISIONING COMPLETE. READY FOR IMAC BOOT." -ForegroundColor Green`;

    case 'terraform':
      return `# Terraform Provider: Proxmox
provider "proxmox" {
  pm_api_url = "https://10.0.0.10:8006/api2/json"
  pm_user    = "root@pam"
  pm_password = "CHANGEME"
}
resource "proxmox_vm_qemu" "distributed_node" {
  name        = "win11-tf-managed"
  target_node = "pve-imac-01"
  iso         = "local:iso/win11.iso"
  memory      = 8192
  cores       = 4
  network {
    model  = "virtio"
    bridge = "vmbr0"
  }
}`;
    case 'helm':
      return `# Helm values.yaml for K8s-on-Proxmox
clusterName: "imac-tsunami"
storage:
  type: "zfs-local"
  pool: "rpool/data"
services:
  kali-gateway:
    enabled: true
    image: "kali-rolling"
    cpu: 2
    memory: 4Gi
  fyde-web-proxy:
    enabled: true
    replicas: 3`;
    case 'opencore':
      return `<!-- OpenCore config.plist Snippet -->
<key>DeviceProperties</key>
<dict>
  <key>Add</key>
  <dict>
    <key>PciRoot(0x0)/Pci(0x1,0x0)/Pci(0x0,0x0)</key>
    <dict>
      <key>model</key>
      <string>AMD Radeon HD 6970M</string>
      <key>device_type</key>
      <string>ATY,GibbaParent</string>
    </dict>
  </dict>
</dict>`;
    case 'usb':
      return `# MultiBoot Architect: USB Provisioning
$USB = "${usbDrive || 'E:'}"
Write-Host "Syncing Proxmox ISO to $USB..." -ForegroundColor Cyan
# Manual EFI patch for iMac 12,2 Sandy Bridge compatibility
Copy-Item "C:\\EFI_BOOT_PATCH\\*" "$USB\\EFI\\BOOT" -Recurse -Force`;
    case 'zfs-setup':
      if (!storage) return "# Error: Storage missing";
      return `zfs create rpool/data/shared -o quota=${storage.shared}G\nzfs set compression=lz4 rpool/data/shared`;
    case 'vm-create':
      if (!vms) return "# Error: VM missing";
      return vms.map(vm => `qm create ${vm.vmid} --name ${vm.name} --memory ${vm.memory} --cores ${vm.cores}`).join('\n');
    default:
      return "Selection Required";
  }
}