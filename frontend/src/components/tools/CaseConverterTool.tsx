import { useEffect, useMemo, useState } from 'react';
import { CaseSensitive, Copy } from 'lucide-react';
import { ModalShell } from '@/components/shared/ModalShell';
import { copyToClipboard } from '@/utils/clipboard';
import { buildCaseConversions } from '@/utils/caseConverters';
import { makePreview } from '@/utils/historyPreview';
import type { ToolActionPayload } from '@/types/tools';

interface CaseConverterToolProps {
  onClose: () => void;
  onTrackAction: (payload: ToolActionPayload) => void;
}

export function CaseConverterTool({ onClose, onTrackAction }: CaseConverterToolProps) {
  const [text, setText] = useState('');
  const conversions = useMemo(() => buildCaseConversions(text), [text]);

  useEffect(() => {
    if (!text.trim()) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onTrackAction({
        tool_name: 'case_converter',
        input_preview: makePreview(text),
        result_preview: makePreview(conversions['Title Case']),
      });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [conversions, onTrackAction, text]);

  return (
    <ModalShell
      title="Case Converter"
      onClose={onClose}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b5cf6]/20">
          <CaseSensitive className="h-5 w-5 text-[#8b5cf6]" />
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-muted-foreground">Enter your text</label>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type or paste text here..."
            className="h-32 w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50"
          />
        </div>

        <div className="space-y-3">
          {Object.entries(conversions).map(([label, value]) => (
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
              <div className="rounded-xl bg-muted/50 px-4 py-3 font-mono text-sm text-foreground break-all">
                {value || <span className="text-muted-foreground">-</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}
