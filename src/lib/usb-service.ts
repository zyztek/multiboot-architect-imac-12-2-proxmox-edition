export class WebUsbService {
  private device: USBDevice | null = null;
  async requestAccess(): Promise<USBDevice | null> {
    if (!navigator.usb) throw new Error("WebUSB not supported");
    try {
      this.device = await navigator.usb.requestDevice({ filters: [] });
      return this.device;
    } catch (e) {
      console.error("USB Access Denied", e);
      return null;
    }
  }
  async flashImage(
    stream: ReadableStream, 
    onProgress: (bytes: number) => void
  ): Promise<void> {
    if (!this.device) throw new Error("No device connected");
    await this.device.open();
    await this.device.selectConfiguration(1);
    await this.device.claimInterface(0);
    // Simulation of binary streaming to hardware
    const reader = stream.getReader();
    let totalBytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
        onProgress(totalBytes);
        // In real WebUSB, we would use transferOut here
        // await this.device.transferOut(1, value);
      }
    } finally {
      reader.releaseLock();
      await this.device.close();
    }
  }
  isIMacCompatible(): boolean {
    if (!this.device) return false;
    // Sandy Bridge era Macs (2011) often use specific Intel/NEC controllers
    const vendorId = this.device.vendorId;
    return [0x8086, 0x1033].includes(vendorId);
  }
}
export const usbService = new WebUsbService();