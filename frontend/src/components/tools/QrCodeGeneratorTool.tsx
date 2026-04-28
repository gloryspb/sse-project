import { useEffect, useState } from 'react';
import { Download, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { ModalShell } from '@/components/shared/ModalShell';
import { makePreview } from '@/utils/historyPreview';
import type { ToolActionPayload } from '@/types/tools';

interface QrCodeGeneratorToolProps {
  onClose: () => void;
  onTrackAction: (payload: ToolActionPayload) => void;
}

export function QrCodeGeneratorTool({ onClose, onTrackAction }: QrCodeGeneratorToolProps) {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);

  useEffect(() => {
    if (!text.trim()) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onTrackAction({
        tool_name: 'qr_generator',
        input_preview: makePreview(text),
        result_preview: `QR ${size}px`,
      });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [onTrackAction, size, text]);

  const downloadQr = () => {
    if (!text) {
      toast.error('Enter text to generate a QR code');
      return;
    }

    const svg = document.getElementById('qr-code');
    if (!svg) {
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();

    canvas.width = size;
    canvas.height = size;

    image.onload = () => {
      context?.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'qrcode.png';
        anchor.click();
        URL.revokeObjectURL(url);
        toast.success('QR code downloaded');
      });
    };

    image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <ModalShell
      title="QR Code Generator"
      onClose={onClose}
      maxWidth="max-w-2xl"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b82f6]/20">
          <QrCode className="h-5 w-5 text-[#3b82f6]" />
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-muted-foreground">Text or URL</label>
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-muted-foreground">Size: {size}px</label>
          </div>
          <input
            type="range"
            min="128"
            max="512"
            step="64"
            value={size}
            onChange={(event) => setSize(Number.parseInt(event.target.value, 10))}
            className="w-full accent-[#3b82f6]"
          />
        </div>

        {text ? (
          <div className="space-y-4">
            <div className="flex justify-center rounded-xl bg-white p-8">
              <QRCodeSVG id="qr-code" value={text} size={Math.min(size, 384)} level="H" includeMargin />
            </div>

            <button
              onClick={downloadQr}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b82f6] px-6 py-3 text-white transition-colors hover:bg-[#2563eb]"
            >
              <Download className="h-5 w-5" />
              Download PNG
            </button>
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
