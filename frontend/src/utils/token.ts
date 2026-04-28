const ACCESS_TOKEN_KEY = 'web-toolbox-access-token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  set: (value: string) => localStorage.setItem(ACCESS_TOKEN_KEY, value),
  clear: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
};
