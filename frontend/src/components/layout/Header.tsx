import { Moon, Sun, History, LogOut, UserRound } from 'lucide-react';
import type { User } from '@/types/auth';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  onLogout: () => void;
  user: User | null;
  authBusy: boolean;
}

export function Header({
  isDark,
  onToggleTheme,
  onOpenAuth,
  onOpenHistory,
  onLogout,
  user,
  authBusy,
}: HeaderProps) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="mb-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6]">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl">Web Toolbox</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Simple, fast utilities for developers and power users
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenHistory}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-foreground transition-colors hover:bg-muted"
          >
            <History className="h-4 w-4" />
            History
          </button>

          {user ? (
            <>
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-foreground">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <span>{user.username || user.email}</span>
              </div>
              <button
                onClick={onLogout}
                disabled={authBusy}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="rounded-lg bg-[#3b82f6] px-4 py-2.5 text-white transition-colors hover:bg-[#2563eb]"
            >
              Sign In / Register
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-muted"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>
    </header>
  );
}
