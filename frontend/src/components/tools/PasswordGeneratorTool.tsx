import { useState } from 'react';
import { Copy, RefreshCw, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { ModalShell } from '@/components/shared/ModalShell';
import { copyToClipboard } from '@/utils/clipboard';
import { generatePassword, getPasswordStrength } from '@/utils/password';
import type { ToolActionPayload } from '@/types/tools';

interface PasswordGeneratorToolProps {
  onClose: () => void;
  onTrackAction: (payload: ToolActionPayload) => void;
}

export function PasswordGeneratorTool({ onClose, onTrackAction }: PasswordGeneratorToolProps) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const strength = getPasswordStrength(password);

  const handleGenerate = () => {
    try {
      const nextPassword = generatePassword({
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
      });
      setPassword(nextPassword);
      onTrackAction({
        tool_name: 'password_generator',
        input_preview: `length=${length}, upper=${includeUppercase}, lower=${includeLowercase}, numbers=${includeNumbers}, symbols=${includeSymbols}`,
        result_preview: '[hidden]',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to generate password');
    }
  };

  return (
    <ModalShell
      title="Password Generator"
      onClose={onClose}
      maxWidth="max-w-2xl"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b5cf6]/20">
          <Shield className="h-5 w-5 text-[#8b5cf6]" />
        </div>
      }
    >
      <div className="space-y-6">
        {password ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-4">
              <div className="flex-1 break-all font-mono text-lg text-foreground">{password}</div>
              <button
                onClick={() => void copyToClipboard(password, 'Password copied to clipboard')}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-background/80"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Password Strength</span>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${strength.percentage}%`, backgroundColor: strength.color }}
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-muted-foreground">Length: {length}</label>
              <span className="font-mono text-sm">{length} characters</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(event) => setLength(Number.parseInt(event.target.value, 10))}
              className="w-full accent-[#8b5cf6]"
            />
          </div>

          <div className="space-y-3">
            {[
              { label: 'Uppercase (A-Z)', checked: includeUppercase, onChange: setIncludeUppercase },
              { label: 'Lowercase (a-z)', checked: includeLowercase, onChange: setIncludeLowercase },
              { label: 'Numbers (0-9)', checked: includeNumbers, onChange: setIncludeNumbers },
              { label: 'Symbols (!@#$...)', checked: includeSymbols, onChange: setIncludeSymbols },
            ].map((option) => (
              <label key={option.label} className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={(event) => option.onChange(event.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-border accent-[#8b5cf6]"
                />
                <span className="text-muted-foreground transition-colors group-hover:text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b5cf6] px-6 py-3 text-white transition-colors hover:bg-[#7c3aed]"
        >
          <RefreshCw className="h-5 w-5" />
          Generate Password
        </button>
      </div>
    </ModalShell>
  );
}
