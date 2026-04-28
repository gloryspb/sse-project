export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.includeNumbers) charset += '0123456789';
  if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!charset) {
    throw new Error('Select at least one character type');
  }

  const random = new Uint32Array(options.length);
  crypto.getRandomValues(random);

  return Array.from(random, (value) => charset[value % charset.length]).join('');
}

export function getPasswordStrength(password: string) {
  if (!password) {
    return { label: 'None', color: '#6b7280', percentage: 0 };
  }

  let score = 0;
  if (password.length >= 12) score += 25;
  if (password.length >= 16) score += 25;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;

  if (score < 40) return { label: 'Weak', color: '#ef4444', percentage: score };
  if (score < 70) return { label: 'Medium', color: '#f59e0b', percentage: score };
  return { label: 'Strong', color: '#10b981', percentage: score };
}
