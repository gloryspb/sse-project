import { useState, type FormEvent } from 'react';
import { LockKeyhole } from 'lucide-react';
import { ModalShell } from '@/components/shared/ModalShell';

interface AuthModalProps {
  isSubmitting: boolean;
  onClose: () => void;
  onLogin: (values: { email: string; password: string }) => Promise<boolean>;
  onRegister: (values: { email: string; password: string; username?: string }) => Promise<boolean>;
}

type Mode = 'login' | 'register';

export function AuthModal({ isSubmitting, onClose, onLogin, onRegister }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const success =
      mode === 'login'
        ? await onLogin({ email, password })
        : await onRegister({ email, password, username: username || undefined });

    if (success) {
      onClose();
    }
  };

  return (
    <ModalShell
      title={mode === 'login' ? 'Welcome back' : 'Create account'}
      onClose={onClose}
      maxWidth="max-w-lg"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b82f6]/20">
          <LockKeyhole className="h-5 w-5 text-[#3b82f6]" />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 rounded-xl bg-muted/50 p-1">
          <button
            onClick={() => setMode('login')}
            className={`rounded-lg px-4 py-2 text-sm transition-colors ${mode === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
            type="button"
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`rounded-lg px-4 py-2 text-sm transition-colors ${mode === 'register' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
            type="button"
          >
            Register
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">Username</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Optional display name"
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              minLength={6}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#3b82f6] px-6 py-3 text-white transition-colors hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </ModalShell>
  );
}
