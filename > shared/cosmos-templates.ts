export const GITHUB_USB_BUILD_WORKFLOW = `name: USB Tsunami Builder
on:
  workflow_dispatch:
    inputs:
      os_payload:
        description: 'Target OS flavors (csv)'
        required: true
        default: 'win11,kali'
jobs:
  forge-iso:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Inject EFI Patches
        run: |
          mkdir -p build/efi
          curl -L https://pve-imac.internal/patches/sandy-bridge.efi -o build/efi/bootx64.efi
      - name: Build Ventoy Bundle
        run: |
          # Simulated ventoy build logic
          tar -czf tsunami-bundle.tar.gz build/
      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: tsunami-usb-iso
          path: tsunami-bundle.tar.gz
`;
export const USB_WIKI_GUIDE = `# USB Deployment Guide
## Flashing Procedures
### macOS (Terminal)
\`\`\`bash
diskutil list
sudo dd if=tsunami.iso of=/dev/rdiskN bs=1m status=progress
\`\`\`
### Windows (PowerShell)
\`\`\`powershell
# Use the Architect WebUSB Flash module for direct browser imaging.
# If using manual tools, Rufus (DD Mode) is required for Sandy Bridge EFI.
\`\`\`
## Booting iMac 12,2
1. Hold **Option** on chime.
2. Select "EFI Boot" (Yellow Icon).
3. If screen stays black, ensuring 'nomodeset' is active in Ventoy config.
`;
export const KANBAN_USB_CONFIG = {
  name: "USB Forge Queue",
  columns: ["Backlog", "In Synthesis", "Checksum Verification", "Ready for Flash"],
  automation: true
};