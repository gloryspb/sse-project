import type { ReactNode } from 'react';

interface ModalShellProps {
  title: string;
  icon: ReactNode;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export function ModalShell({
  title,
  icon,
  onClose,
  children,
  maxWidth = 'max-w-3xl',
}: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className={`max-h-[90vh] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl ${maxWidth}`}>
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-foreground">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 88px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
