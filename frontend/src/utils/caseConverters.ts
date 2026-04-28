function normalizeWords(text: string): string[] {
  return text
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean);
}

export function buildCaseConversions(text: string) {
  const words = normalizeWords(text);

  return {
    UPPERCASE: text.toUpperCase(),
    lowercase: text.toLowerCase(),
    'Title Case': words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' '),
    camelCase: words
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(''),
    snake_case: words.map((word) => word.toLowerCase()).join('_'),
    'kebab-case': words.map((word) => word.toLowerCase()).join('-'),
  };
}
