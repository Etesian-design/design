/**
 * Where each window goes as a card in the Windows switcher and the Overview: the window itself, scaled, keeping its shape.
 * Level 1 is the carousel (one large card centred, the others in a row beside it at half strength, like the phone's Open apps);
 * 2 to 4 are that many per row, every row on screen.
 */
import { fitInto, type Rect, type ZoomLevel } from './geometry';
import type { WindowCard } from './XWindow.vue';

/** the room under each card for its title */
export const CARD_TITLE = 34;

/** `sizes`: each window's size, in order; `box`: where the cards may go; `selected`: the carousel's centre card; `z`: the first z-index */
export function windowCards(sizes: { w: number; h: number }[], level: ZoomLevel, selected: number, box: Rect, z = 9000): WindowCard[] {
  if (!sizes.length) return [];
  if (level === 1) {
    const ch = box.h - CARD_TITLE, cw = Math.max(200, Math.min(Math.round(ch * 1.5), box.w - 240)), G = 48;
    const fits = sizes.map((s) => fitInto(s.w, s.h, cw, ch));
    const sel = Math.min(Math.max(0, selected), fits.length - 1);
    const xs: number[] = []; xs[sel] = box.x + box.w / 2 - fits[sel]!.w / 2;
    for (let i = sel + 1; i < fits.length; i++) xs[i] = xs[i - 1]! + fits[i - 1]!.w + G;
    for (let i = sel - 1; i >= 0; i--) xs[i] = xs[i + 1]! - G - fits[i]!.w;
    return fits.map((f, i) => ({ x: Math.round(xs[i]!), y: Math.round(box.y + (ch - f.h) / 2), s: f.s, z: z + i, side: i !== sel }));
  }
  const n = level, gap = n === 2 ? 36 : n === 3 ? 28 : 22, rows = Math.ceil(sizes.length / n);
  const cw = (box.w - gap * (n - 1)) / n, ch = Math.max(40, Math.min(cw * 0.75, (box.h - rows * (CARD_TITLE + gap) + gap) / rows));
  return sizes.map((s, i) => {
    const c = i % n, r = Math.floor(i / n), f = fitInto(s.w, s.h, cw, ch);
    return { x: Math.round(box.x + c * (cw + gap) + (cw - f.w) / 2), y: Math.round(box.y + r * (ch + CARD_TITLE + gap) + (ch - f.h)), s: f.s, z: z + i, side: false };
  });
}
