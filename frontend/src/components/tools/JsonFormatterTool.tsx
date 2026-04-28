import { useEffect, useState } from 'react';
import { AlertCircle, Braces, Copy } from 'lucide-react';
import { ModalShell } from '@/components/shared/ModalShell';
import { copyToClipboard } from '@/utils/clipboard';
import { makePreview } from '@/utils/historyPreview';
import type { ToolActionPayload } from '@/types/tools';

interface JsonFormatterToolProps {
  onClose: () => void;
  onTrackAction: (payload: ToolActionPayload) => void;
}

export function JsonFormatterTool({ onClose, onTrackAction }: JsonFormatterToolProps) {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');

  const handleFormat = (value: string) => {
    setInput(value);
    setError('');

    if (!value.trim()) {
      setFormatted('');
      return;
    }

    try {
      const parsed = JSON.parse(value);
      setFormatted(JSON.stringify(parsed, null, 2));
    } catch (formatError) {
      setError(formatError instanceof Error ? formatError.message : 'Invalid JSON');
      setFormatted('');
    }
  };

  useEffect(() => {
    if (!formatted) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onTrackAction({
        tool_name: 'json_formatter',
        input_preview: makePreview(input),
        result_preview: makePreview(formatted),
      });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [formatted, input, onTrackAction]);

  const minify = () => {
    if (!formatted) {
      return;
    }

    const parsed = JSON.parse(formatted);
    setFormatted(JSON.stringify(parsed));
  };

  return (
    <ModalShell
      title="JSON Formatter & Validator"
      onClose={onClose}
      maxWidth="max-w-6xl"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b82f6]/20">
          <Braces className="h-5 w-5 text-[#3b82f6]" />
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-muted-foreground">Input JSON</label>
          <textarea
            value={input}
            onChange={(event) => handleFormat(event.target.value)}
            placeholder='{"key":"value"}'
            className="h-[500px] w-full resize-none rounded-xl border border-border bg-input px-4 py-3 font-mono text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-muted-foreground">Formatted Output</label>
            {formatted && (
              <div className="flex gap-2">
                <button
                  onClick={minify}
                  className="rounded-lg px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  Minify
                </button>
                <button
                  onClick={() => void copyToClipboard(formatted)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
            )}
          </div>

          {error ? (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
              <div>
                <div className="mb-1 text-sm text-destructive-foreground">Invalid JSON</div>
                <div className="font-mono text-sm text-muted-foreground">{error}</div>
              </div>
            </div>
          ) : (
            <div className="h-[500px] w-full overflow-auto rounded-xl bg-muted/50 px-4 py-3">
              <pre className="whitespace-pre-wrap break-all font-mono text-sm text-foreground">
                {formatted || <span className="text-muted-foreground">Formatted JSON will appear here</span>}
              </pre>
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
