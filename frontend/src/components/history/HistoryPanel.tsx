import { useEffect, useState } from 'react';
import { Trash2, History } from 'lucide-react';
import { toast } from 'sonner';
import { clearHistory, getHistory } from '@/api/history';
import { ModalShell } from '@/components/shared/ModalShell';
import { LoaderBlock } from '@/components/shared/LoaderBlock';
import type { HistoryItem } from '@/types/history';
import type { User } from '@/types/auth';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function HistoryPanel({ isOpen, onClose, user }: HistoryPanelProps) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) {
      return;
    }

    setLoading(true);
    void getHistory()
      .then(setItems)
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load history');
      })
      .finally(() => setLoading(false));
  }, [isOpen, user]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalShell
      title="History"
      onClose={onClose}
      maxWidth="max-w-3xl"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10b981]/20">
          <History className="h-5 w-5 text-[#10b981]" />
        </div>
      }
    >
      {!user ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <h3 className="mb-2 text-foreground">History is unavailable</h3>
          <p className="text-muted-foreground">Sign in to store and review your recent tool activity.</p>
        </div>
      ) : loading ? (
        <LoaderBlock message="Loading your history..." />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Recent actions are shown from newest to oldest.</p>
            <button
              onClick={async () => {
                setClearing(true);
                try {
                  const response = await clearHistory();
                  setItems([]);
                  toast.success(response.message);
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : 'Failed to clear history');
                } finally {
                  setClearing(false);
                }
              }}
              disabled={clearing || items.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground">
              No saved actions yet.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.id} className="rounded-xl border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-foreground">{item.tool_name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Input: {item.input_preview || 'No preview'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Result: {item.result_preview || 'No preview'}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </ModalShell>
  );
}
