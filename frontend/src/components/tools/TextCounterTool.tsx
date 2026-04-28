import { useEffect, useMemo, useState } from 'react';
import { Copy, Type } from 'lucide-react';
import { ModalShell } from '@/components/shared/ModalShell';
import { copyToClipboard } from '@/utils/clipboard';
import { makePreview } from '@/utils/historyPreview';
import type { ToolActionPayload } from '@/types/tools';

interface TextCounterToolProps {
  onClose: () => void;
  onTrackAction: (payload: ToolActionPayload) => void;
}

export function TextCounterTool({ onClose, onTrackAction }: TextCounterToolProps) {
  const [text, setText] = useState('');

  const stats = useMemo(
    () => ({
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text ? text.split('\n').length : 0,
      paragraphs: text.split(/\n\n+/).filter((paragraph) => paragraph.trim()).length,
    }),
    [text],
  );

  useEffect(() => {
    if (!text.trim()) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onTrackAction({
        tool_name: 'text_counter',
        input_preview: makePreview(text),
        result_preview: `Words ${stats.words}, chars ${stats.characters}`,
      });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [onTrackAction, stats.characters, stats.words, text]);

  return (
    <ModalShell
      title="Text Counter"
      onClose={onClose}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b82f6]/20">
          <Type className="h-5 w-5 text-[#3b82f6]" />
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-muted-foreground">Enter your text</label>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Start typing..."
            className="h-48 w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="group relative rounded-xl bg-muted/50 p-4">
              <div className="mb-1 font-mono text-2xl text-foreground">{value.toLocaleString()}</div>
              <div className="text-sm capitalize text-muted-foreground">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <button
                onClick={() => void copyToClipboard(value.toString())}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-foreground opacity-0 transition-opacity hover:bg-background/80 group-hover:opacity-100"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}
