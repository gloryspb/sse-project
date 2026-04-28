export function parseUnixTimestamp(value: string): number | null {
  const normalized = value.trim();
  if (!/^\d{10}(\d{3})?$/.test(normalized)) {
    return null;
  }

  const num = Number.parseInt(normalized, 10);
  return normalized.length === 10 ? num * 1000 : num;
}
