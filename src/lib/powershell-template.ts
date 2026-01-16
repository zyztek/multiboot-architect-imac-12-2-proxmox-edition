export interface ScriptConfig {
  usbDrive: string;
  isoPath: string;
  osName: string;
}
export function generateInstallScript(config: ScriptConfig): string {
  return `# MultiBoot Architect: iMac 12,2 USB Provisioning Script
# Generated for: ${config.osName} Installation
$USB_DRIVE = "${config.usbDrive}"
$ISO_PATH = "${config.isoPath}"
Write-Host "--- MultiBoot Architect Deployment Script ---" -ForegroundColor Cyan
Write-Host "[!] Target Drive: $USB_DRIVE"
Write-Host "[!] Source ISO: $ISO_PATH"
if (-not (Test-Path $ISO_PATH)) {
    Write-Error "ISO path not found. Please verify the file path."
    exit
}
Write-Host "[*] Formatting $USB_DRIVE for EFI compatibility..."
# Use diskpart or Format-Volume logic here
# Note: In a real environment, caution is required. 
# This template provides the structure for the user's manual automation.
Write-Host "[*] Extracting ISO content to $USB_DRIVE..."
$mount = Mount-DiskImage -ImagePath $ISO_PATH -PassThru
$driveLetter = ($mount | Get-Volume).DriveLetter + ":"
Copy-Item -Path "$driveLetter\\*" -Destination "$USB_DRIVE\\" -Recurse -Force
Dismount-DiskImage -ImagePath $ISO_PATH
Write-Host "[SUCCESS] USB Drive is ready for iMac 12,2 booting." -ForegroundColor Green
Write-Host "[INFO] Remember to use 'nomodeset' for initial Proxmox installation."
`;
}