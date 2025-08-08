export type ReplacementPair = { from: string; to: string };

const defaultReplacements: ReplacementPair[] = [
  { from: 'ETA BASE', to: 'BASE ETA' },
];

export function applyAutomaticReplacements(text: string, extra?: ReplacementPair[]): string {
  if (!text) return '';
  const pairs = [...defaultReplacements, ...(extra || [])];
  let output = text;
  for (const { from, to } of pairs) {
    // Replace case-sensitive and preserve spacing
    output = output.split(from).join(to);
  }
  return output;
}
