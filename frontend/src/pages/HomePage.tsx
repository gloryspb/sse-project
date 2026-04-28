import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { Braces, CaseSensitive, Clock, Globe, QrCode, Shield, Type } from 'lucide-react';
import { Toaster } from 'sonner';
import { createHistoryItem } from '@/api/history';
import { AuthModal } from '@/components/auth/AuthModal';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { Header } from '@/components/layout/Header';
import { CaseConverterTool } from '@/components/tools/CaseConverterTool';
import { IpDetectorTool } from '@/components/tools/IpDetectorTool';
import { JsonFormatterTool } from '@/components/tools/JsonFormatterTool';
import { PasswordGeneratorTool } from '@/components/tools/PasswordGeneratorTool';
import { QrCodeGeneratorTool } from '@/components/tools/QrCodeGeneratorTool';
import { TextCounterTool } from '@/components/tools/TextCounterTool';
import { TimestampConverterTool } from '@/components/tools/TimestampConverterTool';
import { ToolCard } from '@/components/tools/ToolCard';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import type { ToolActionPayload, ToolDefinition, ToolId } from '@/types/tools';

export function HomePage() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isSubmitting, isLoadingUser, isAuthenticated, login, logout, register } = useAuth();
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const lastTrackedPayload = useRef<string | null>(null);

  const tools = useMemo<ToolDefinition[]>(
    () => [
      {
        id: 'text-counter',
        icon: Type,
        title: 'Text Counter',
        description: 'Count characters, words, lines in real time',
        accentColor: '#3b82f6',
      },
      {
        id: 'case-converter',
        icon: CaseSensitive,
        title: 'Case Converter',
        description: 'Convert text to UPPER, lower, camelCase, and more',
        accentColor: '#8b5cf6',
      },
      {
        id: 'json-formatter',
        icon: Braces,
        title: 'JSON Formatter',
        description: 'Format and validate JSON with clear error feedback',
        accentColor: '#3b82f6',
      },
      {
        id: 'timestamp-converter',
        icon: Clock,
        title: 'Unix Timestamp',
        description: 'Convert timestamps and human-readable dates',
        accentColor: '#10b981',
      },
      {
        id: 'password-generator',
        icon: Shield,
        title: 'Password Generator',
        description: 'Generate strong passwords with custom rules',
        accentColor: '#8b5cf6',
      },
      {
        id: 'qr-generator',
        icon: QrCode,
        title: 'QR Code Generator',
        description: 'Create QR codes from text or URLs',
        accentColor: '#3b82f6',
      },
      {
        id: 'ip-detector',
        icon: Globe,
        title: 'IP Address',
        description: 'Detect your public IP through the backend API',
        accentColor: '#10b981',
      },
    ],
    [],
  );

  const trackAction = useCallback(
    async (payload: ToolActionPayload) => {
      if (!isAuthenticated) {
        return;
      }

      const key = JSON.stringify(payload);
      if (lastTrackedPayload.current === key) {
        return;
      }

      lastTrackedPayload.current = key;

      try {
        await createHistoryItem(payload);
      } catch {
        lastTrackedPayload.current = null;
      }
    },
    [isAuthenticated],
  );

  const toolModals: Record<Exclude<ToolId, null>, ReactNode> = {
    'text-counter': <TextCounterTool onClose={() => setActiveTool(null)} onTrackAction={trackAction} />,
    'case-converter': <CaseConverterTool onClose={() => setActiveTool(null)} onTrackAction={trackAction} />,
    'json-formatter': <JsonFormatterTool onClose={() => setActiveTool(null)} onTrackAction={trackAction} />,
    'timestamp-converter': <TimestampConverterTool onClose={() => setActiveTool(null)} onTrackAction={trackAction} />,
    'password-generator': <PasswordGeneratorTool onClose={() => setActiveTool(null)} onTrackAction={trackAction} />,
    'qr-generator': <QrCodeGeneratorTool onClose={() => setActiveTool(null)} onTrackAction={trackAction} />,
    'ip-detector': <IpDetectorTool onClose={() => setActiveTool(null)} onTrackAction={trackAction} />,
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster
        position="bottom-right"
        theme={isDark ? 'dark' : 'light'}
        toastOptions={{
          style: isDark
            ? {
                background: '#1f1f1f',
                border: '1px solid #2a2a2a',
                color: '#ededed',
              }
            : {
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                color: '#0a0a0a',
              },
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-16">
        <Header
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenHistory={() => setHistoryOpen(true)}
          onLogout={() => void logout()}
          user={user}
          authBusy={isSubmitting}
        />

        <div className="mb-8 rounded-2xl border border-border bg-card/60 p-5">
          <p className="text-sm text-muted-foreground">
            {isLoadingUser
              ? 'Checking your session...'
              : isAuthenticated
                ? 'Your tool activity will be saved to history while you are signed in.'
                : 'Utilities work without an account, but history is available only after sign in.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => setActiveTool(tool.id)} />
          ))}
        </div>

        <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>Built for speed and simplicity with optional account-based history.</p>
        </footer>
      </div>

      {activeTool ? toolModals[activeTool] : null}

      {authModalOpen ? (
        <AuthModal
          isSubmitting={isSubmitting}
          onClose={() => setAuthModalOpen(false)}
          onLogin={login}
          onRegister={register}
        />
      ) : null}

      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} user={user} />
    </div>
  );
}
