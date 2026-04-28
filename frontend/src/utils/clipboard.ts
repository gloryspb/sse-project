import { toast } from 'sonner';

export async function copyToClipboard(value: string, message = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(message);
  } catch {
    toast.error('Unable to copy to clipboard');
  }
}
