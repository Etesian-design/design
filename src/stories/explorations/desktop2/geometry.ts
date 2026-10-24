/** Desktop v2 geometry: screen, bar, dock and snap-layout zones (FancyZones / Windows 11 snap layouts style). */
export const SCREEN = { w: 1920, h: 1080 };
export const BAR_H = 30;
export const GAP = 8;
export type DockPos = 'left' | 'bottom' | 'right' | 'top';
export interface Rect { x: number; y: number; w: number; h: number }

/** Dock thickness for an icon size (icon + padding). */
export const dockThickness = (icon: number) => icon + 20;

/** The free work area under the bar, minus a visible (not auto-hidden) dock. Coordinates are inside the area below the bar. */
export function workArea(pos: DockPos = 'left', icon = 44, autoHide = false): Rect {
  const W = SCREEN.w, H = SCREEN.h - BAR_H;
  const t = autoHide ? 0 : dockThickness(icon) + GAP;
  if (pos === 'left') return { x: t, y: 0, w: W - t, h: H };
  if (pos === 'right') return { x: 0, y: 0, w: W - t, h: H };
  if (pos === 'top') return { x: 0, y: t, w: W, h: H - t };
  return { x: 0, y: 0, w: W, h: H - t };
}

export type LayoutId = 'halves' | 'thirds' | 'two-thirds' | 'focus' | 'main-stack' | 'quarters';
/** Layout zones as fractions of the work area. */
export const LAYOUTS: Record<LayoutId, { label: string; keys?: string; zones: Rect[] }> = {
  halves: { label: '1/2 + 1/2', keys: 'Super+Left', zones: [{ x: 0, y: 0, w: 0.5, h: 1 }, { x: 0.5, y: 0, w: 0.5, h: 1 }] },
  thirds: { label: 'Three columns', zones: [{ x: 0, y: 0, w: 1 / 3, h: 1 }, { x: 1 / 3, y: 0, w: 1 / 3, h: 1 }, { x: 2 / 3, y: 0, w: 1 / 3, h: 1 }] },
  'two-thirds': { label: '2/3 + 1/3', zones: [{ x: 0, y: 0, w: 2 / 3, h: 1 }, { x: 2 / 3, y: 0, w: 1 / 3, h: 1 }] },
  focus: { label: 'Focus centre', zones: [{ x: 0, y: 0, w: 0.25, h: 1 }, { x: 0.25, y: 0, w: 0.5, h: 1 }, { x: 0.75, y: 0, w: 0.25, h: 1 }] },
  'main-stack': { label: 'Main + stack', zones: [{ x: 0, y: 0, w: 0.5, h: 1 }, { x: 0.5, y: 0, w: 0.5, h: 0.5 }, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 }] },
  quarters: { label: 'Quarters', keys: 'Super+Up', zones: [{ x: 0, y: 0, w: 0.5, h: 0.5 }, { x: 0.5, y: 0, w: 0.5, h: 0.5 }, { x: 0, y: 0.5, w: 0.5, h: 0.5 }, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 }] },
};

/** Zones of a layout in pixels inside `area`, with `gap` around and between them (no overlap, pixel-snapped). */
export function zoneRects(layout: LayoutId, area: Rect, gap = GAP): Rect[] {
  return LAYOUTS[layout].zones.map((z) => {
    const x0 = Math.round(area.x + z.x * area.w), x1 = Math.round(area.x + (z.x + z.w) * area.w);
    const y0 = Math.round(area.y + z.y * area.h), y1 = Math.round(area.y + (z.y + z.h) * area.h);
    const l = x0 + (z.x === 0 ? gap : gap / 2), r = x1 - (z.x + z.w >= 0.999 ? gap : gap / 2);
    const t = y0 + (z.y === 0 ? gap : gap / 2), b = y1 - (z.y + z.h >= 0.999 ? gap : gap / 2);
    return { x: l, y: t, w: r - l, h: b - t };
  });
}
