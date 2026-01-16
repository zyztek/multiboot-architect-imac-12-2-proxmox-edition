import { IsoMetadata } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';
export function detectFormat(filename: string, sizeInBytes: number): Partial<IsoMetadata> {
  const ext = filename.split('.').pop()?.toLowerCase();
  let format: IsoMetadata['format'] = 'iso';
  let detectedOs = 'Generic Linux';
  if (ext === 'qcow2') format = 'qcow2';
  else if (ext === 'vmdk') format = 'vmdk';
  else if (ext === 'raw' || ext === 'img') format = 'raw';
  else if (ext === 'ova') format = 'ova';
  if (filename.toLowerCase().includes('kali')) detectedOs = 'Kali Linux';
  else if (filename.toLowerCase().includes('win')) detectedOs = 'Windows 10/11';
  else if (filename.toLowerCase().includes('fyde')) detectedOs = 'openFyde';
  else if (filename.toLowerCase().includes('ubuntu')) detectedOs = 'Ubuntu LTS';
  return {
    id: uuidv4(),
    filename,
    size: sizeInBytes,
    detectedOs,
    architecture: 'amd64',
    format,
    status: 'available'
  };
}
export function generateImportCommand(iso: IsoMetadata, storageId: string = 'local-zfs'): string {
  if (iso.format === 'iso') {
    return `# ISO detected. No importdisk needed. Move to storage:
mv ${iso.filename} /var/lib/vz/template/iso/`;
  }
  return `qm importdisk <vmid> ${iso.filename} ${storageId} --format ${iso.format}`;
}