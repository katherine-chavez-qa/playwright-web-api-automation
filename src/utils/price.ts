// Extracts the amount from labels such as "$29.99" or "Item total: $37.98".
export function parsePrice(text: string): number {
  const match = /\$(\d+\.\d{2})/.exec(text);
  if (!match) {
    throw new Error(`No price found in "${text}"`);
  }
  return Number(match[1]);
}
