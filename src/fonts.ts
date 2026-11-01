/**
 * Free look-alikes for Nokia Pure (proprietary, never bundled). Metric adjustments come from
 * tokens.json font.alternatives (measured against Nokia Pure Text, docs/03b-font-alternatives.md).
 * applyFont() re-points the Etesian font tokens on an element so layouts stay stable when swapping.
 */
import raw from '../tokens/tokens.json';

export interface FontAlternative {
  key: string; family: string; sizeAdjust: string; letterSpacing: string; lineHeight: number;
  licence: string; source: string; package: string | null; score: number; notes: string;
  /** CSS family name of the metric-adjusted @font-face alias (see font-alternatives.css). */
  alias: string;
}
type Leaf = { value: string };
const alts = (raw as unknown as { font: { alternatives: Record<string, Record<string, Leaf> & { $info: Omit<FontAlternative, 'key'> }> } }).font.alternatives;

export const FONT_ALTERNATIVES: FontAlternative[] = Object.entries(alts)
  .filter(([k]) => !k.startsWith('$'))
  .map(([key, a]) => ({
    key,
    family: a.family!.value.replace(/"/g, ''),
    sizeAdjust: a['size-adjust']!.value,
    letterSpacing: a['letter-spacing']!.value,
    lineHeight: Number(a['line-height']!.value),
    licence: a.$info.licence, source: a.$info.source, package: a.$info.package, score: a.$info.score, notes: a.$info.notes,
    alias: key === 'nokia-pure' ? 'Nokia Pure Text' : `HD ${a.family!.value.replace(/"/g, '')}`,
  }))
  .sort((x, y) => y.score - x.score);

const FALLBACK = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/** CSS custom properties that switch Etesian text to font `key` (empty object = token default). */
export function fontVars(key: string | undefined): Record<string, string> {
  const f = FONT_ALTERNATIVES.find((a) => a.key === key);
  if (!f) return {};
  const fam = f.key === 'nokia-pure' ? '"Nokia Pure Text", "Nokia Pure"' : `"${f.alias}", "${f.family}"`;
  return {
    '--hd-font-family-base': `${fam}, ${FALLBACK}`,
    '--hd-font-family-light': `${f.key === 'nokia-pure' ? '"Nokia Pure Text Light", ' : ''}${fam}, ${FALLBACK}`,
    '--hd-font-letter-spacing': f.letterSpacing,
    'letter-spacing': f.letterSpacing,
  };
}
