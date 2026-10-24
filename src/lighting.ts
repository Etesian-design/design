/**
 * N9 icon lighting ("top-lit emboss"). Measured from the stock 80 px blanco app icons
 * (see docs/06b-icon-lighting.md): light comes from straight above, the tile is a vertical
 * gradient (lighter + hue-shifted toward yellow/cyan at the top), a lighter 1-2 px top rim,
 * an off-white glyph with its own top->bottom gradient and a short cast shadow below it.
 */
import { tokens } from './tokens';

export type IconLighting = 'lit' | 'flat';
export type IconTone = 'colour' | 'light';

export interface LitPalette {
  /** tile colour at gradient-start (top) */
  top: string;
  /** tile colour at gradient-end (bottom; flat below) */
  bottom: string;
}

const L = tokens.icon.lighting;
/** Parsed numeric parameters (fractions of the icon size, 0..1). */
export const LIGHTING = {
  gradientStart: parseFloat(L['gradient-start']) / 100,
  gradientEnd: parseFloat(L['gradient-end']) / 100,
  lightnessDelta: parseFloat(L['lightness-delta']) / 100,
  hueShift: parseFloat(L['hue-shift']),
  rimSize: parseFloat(L['rim-size']) / 100,
  rimOpacity: Number(L['rim-opacity']),
  bottomLineOpacity: Number(L['bottom-line-opacity']),
  castOffset: parseFloat(L['cast-offset']) / 100,
  castBlur: parseFloat(L['cast-blur']) / 100,
  castOpacity: Number(L['cast-opacity']),
  glyph: [L['glyph-top'], L['glyph-mid'], L['glyph-bottom']] as const,
  glyphHighlight: L['glyph-highlight'],
  lightTile: tokens.icon['light-tile'],
} as const;

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1]!;
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHsl([r, g, b]: [number, number, number]): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
function hsl(h: number, s: number, l: number): string {
  return `hsl(${(((h % 360) + 360) % 360).toFixed(1)} ${(clamp(s) * 100).toFixed(1)}% ${(clamp(l) * 100).toFixed(1)}%)`;
}
/** Signed shortest hue distance a -> b in degrees. */
const hueDist = (a: number, b: number) => ((b - a + 540) % 360) - 180;

/**
 * Tile gradient from ONE accent colour (the accent is the mid tone).
 * Top: +lightnessDelta/2 and the hue nudged toward the nearest luminous hue (yellow 60deg or
 * cyan 190deg); bottom: -lightnessDelta/2 and nudged the other way (orange -> red, blue -> indigo),
 * matching e.g. Calculator #EFBB00 -> #DC6A00 and Contacts #2293D7 -> #1148B9.
 * Returns null for non-hex input (CSS fallback with color-mix is used instead).
 */
export function litPalette(accent: string): LitPalette | null {
  const rgb = hexToRgb(accent);
  if (!rgb) return null;
  const [h, s, l] = rgbToHsl(rgb);
  const d = LIGHTING.lightnessDelta;
  if (s < 0.12) return { top: hsl(h, s, l + d * 0.7), bottom: hsl(h, s, l - d * 0.5) };
  const anchor = Math.abs(hueDist(h, 60)) < Math.abs(hueDist(h, 190)) ? 60 : 190;
  const dist = hueDist(h, anchor);
  const shift = Math.sign(dist) * Math.min(Math.abs(dist), LIGHTING.hueShift);
  // blues lean less at the top (Contacts: top ~= accent hue, bottom +20deg); warm hues lean more (Calculator +10/-8deg)
  const up = anchor === 60 ? 0.85 : 0.4;
  return { top: hsl(h + shift * up, anchor === 60 ? s : s * 0.82, l + d * 0.55), bottom: hsl(h - shift * (1.6 - up), Math.min(1, s * 1.05), l - d * 0.45) };
}

/** Inline CSS custom properties for an .hd-icon-lit element. */
export function litVars(accent: string | undefined, sizePx?: number): Record<string, string> {
  const v: Record<string, string> = {};
  if (sizePx) v['--hd-icon-size'] = `${sizePx}px`;
  if (accent) {
    v['--hd-icon-accent'] = accent;
    const p = litPalette(accent);
    if (p) { v['--hd-icon-top'] = p.top; v['--hd-icon-bottom'] = p.bottom; }
  }
  return v;
}
