import { useEffect, useRef, useState } from 'react';
import { Copy, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { getPublicIp, type IpResponse } from '@/api/ip';
import { LoaderBlock } from '@/components/shared/LoaderBlock';
import { ModalShell } from '@/components/shared/ModalShell';
import { copyToClipboard } from '@/utils/clipboard';
import type { ToolActionPayload } from '@/types/tools';

interface IpDetectorToolProps {
  onClose: () => void;
  onTrackAction: (payload: ToolActionPayload) => void;
}

export function IpDetectorTool({ onClose, onTrackAction }: IpDetectorToolProps) {
  const [loading, setLoading] = useState(true);
  const [ipData, setIpData] = useState<IpResponse | null>(null);
  const tracked = useRef(false);

  useEffect(() => {
    void getPublicIp()
      .then((data) => {
        setIpData(data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Unable to detect IP');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!ipData?.ip || tracked.current) {
      return;
    }

    tracked.current = true;
    onTrackAction({
      tool_name: 'ip_detector',
      input_preview: 'public IP lookup',
      result_preview: ipData.ip,
    });
  }, [ipData, onTrackAction]);

  return (
    <ModalShell
      title="IP Address Detector"
      onClose={onClose}
      maxWidth="max-w-2xl"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10b981]/20">
          <Globe className="h-5 w-5 text-[#10b981]" />
        </div>
      }
    >
      {loading ? (
        <LoaderBlock message="Detecting your IP address..." />
      ) : ipData ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-muted/50 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your IP Address</span>
              <button
                onClick={() => void copyToClipboard(ipData.ip)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-background/80"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>
            <div className="font-mono text-3xl text-foreground">{ipData.ip}</div>
          </div>

          <div className="rounded-xl border border-[#10b981]/20 bg-gradient-to-br from-[#10b981]/10 to-[#3b82f6]/10 p-6">
            <h3 className="mb-2 text-foreground">About Your IP Address</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The backend reads your client IP from proxy-aware request headers and falls back to the direct connection address.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-muted-foreground">
          Unable to detect your IP address right now.
        </div>
      )}
    </ModalShell>
  );
}
