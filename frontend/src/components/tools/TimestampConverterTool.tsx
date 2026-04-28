import { useEffect, useMemo, useState } from 'react';
import { Clock, Copy } from 'lucide-react';
import { ModalShell } from '@/components/shared/ModalShell';
import { copyToClipboard } from '@/utils/clipboard';
import { makePreview } from '@/utils/historyPreview';
import { parseUnixTimestamp } from '@/utils/timestamp';
import type { ToolActionPayload } from '@/types/tools';

interface TimestampConverterToolProps {
  onClose: () => void;
  onTrackAction: (payload: ToolActionPayload) => void;
}

export function TimestampConverterTool({ onClose, onTrackAction }: TimestampConverterToolProps) {
  const [timestamp, setTimestamp] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const timestampMs = timestamp ? parseUnixTimestamp(timestamp) : currentTime;
  const date = timestampMs ? new Date(timestampMs) : null;

  const formats = useMemo(
    () =>
      date
        ? {
            'ISO 8601': date.toISOString(),
            UTC: date.toUTCString(),
            Local: date.toString(),
            Date: date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            Time: date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          }
        : {},
    [date],
  );

  useEffect(() => {
    if (!timestamp || !date) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onTrackAction({
        tool_name: 'timestamp_converter',
        input_preview: makePreview(timestamp),
        result_preview: makePreview(date.toISOString()),
      });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [date, onTrackAction, timestamp]);

  return (
    <ModalShell
      title="Unix Timestamp Converter"
      onClose={onClose}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10b981]/20">
          <Clock className="h-5 w-5 text-[#10b981]" />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-4 rounded-xl bg-muted/50 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Unix Timestamp</span>
            <button
              onClick={() => void copyToClipboard(Math.floor(currentTime / 1000).toString())}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-background/80"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>
          <div className="font-mono text-3xl text-foreground">{Math.floor(currentTime / 1000)}</div>
          <div className="text-sm text-muted-foreground">{new Date(currentTime).toISOString()}</div>
        </div>

        <div>
          <label className="mb-2 block text-muted-foreground">Convert timestamp</label>
          <input
            type="text"
            value={timestamp}
            onChange={(event) => setTimestamp(event.target.value)}
            placeholder="Enter unix timestamp (seconds or milliseconds)"
            className="w-full rounded-xl border border-border bg-input px-4 py-3 font-mono text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
          />
          {timestamp && !date ? (
            <p className="mt-2 text-sm text-destructive">Enter a valid 10 or 13 digit Unix timestamp.</p>
          ) : null}
        </div>

        {timestamp && date ? (
          <div className="space-y-3">
            {Object.entries(formats).map(([label, value]) => (
              <div key={label} className="group relative">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <button
                    onClick={() => void copyToClipboard(value)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-foreground opacity-0 transition-all hover:bg-muted group-hover:opacity-100"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3 font-mono text-sm text-foreground break-all">{value}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
