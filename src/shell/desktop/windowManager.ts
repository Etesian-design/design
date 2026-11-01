/**
 * The desktop's window manager, without any look: the windows (their floating rectangle, snap, stacking order, minimised),
 * focus, snapping to halves, to maximised and to the zones of a snap layout, moving and resizing, Show desktop, the Windows
 * switcher (Super+Tab: release Super to switch; Super + wheel zooms and keeps it open), and the keyboard (every shortcut takes
 * Super, or Ctrl+Alt where the system keeps Super for itself). Shared by the website and cloud-companion; the windows'
 * contents are theirs. Optionally kept on the device (localStorage) under `storageKey`.
 */
import { computed, reactive, ref, watch, type Ref } from 'vue';
import { GAP, LAYOUTS, zoneRects, type LayoutId, type Rect, type ZoomLevel } from './geometry';

/** where a window is: floating at its own rectangle, maximised, or in a zone of a snap layout (the halves are layout "halves") */
export type Snap = null | 'max' | { layout: LayoutId; zone: number };
export interface WmWin { id: string; x: number; y: number; w: number; h: number; snap: Snap; z: number; min: boolean }
export const LAYOUT_IDS = Object.keys(LAYOUTS) as LayoutId[];
export const HALF_LEFT: Snap = { layout: 'halves', zone: 0 };
export const HALF_RIGHT: Snap = { layout: 'halves', zone: 1 };
export const MIN_W = 320, MIN_H = 220;
/** how much of a window stays on the desktop when it is dragged off an edge (its header bar stays reachable) */
const KEEP = 120, BAR = 44;

export interface WmOptions {
  /** the desktop area the windows live in, in its own coordinates (x, y are usually 0) */
  area: Ref<Rect>;
  /** the size and place a newly opened window gets (n: how many windows are showing, for the cascade) */
  place?: (id: string, n: number, area: Rect) => Partial<Rect>;
  /** keep the windows on this device under this key */
  storageKey?: string;
}

export function createWindowManager(opts: WmOptions) {
  const wins = reactive<WmWin[]>(load());
  const focused = ref<string | null>(null);
  let zTop = Math.max(0, ...wins.map((w) => w.z));
  /** the windows Show desktop minimised, so it brings back the same ones */
  let hidden: string[] = [];

  function load(): WmWin[] {
    if (!opts.storageKey) return [];
    try {
      const s = JSON.parse(localStorage.getItem(opts.storageKey) || '[]');
      return Array.isArray(s) ? s.filter((w: WmWin) => w && typeof w.id === 'string' && Number.isFinite(w.w) && Number.isFinite(w.h)) : [];
    } catch { return []; }
  }
  if (opts.storageKey) watch(wins, () => { try { localStorage.setItem(opts.storageKey!, JSON.stringify(wins)); } catch { /* private window: not kept */ } }, { deep: true });

  const get = (id: string) => wins.find((w) => w.id === id);
  const shown = computed(() => wins.filter((w) => !w.min));
  const focusedWin = computed(() => { const w = focused.value ? get(focused.value) : undefined; return w && !w.min ? w : undefined; });
  /** most recently used first */
  const recent = computed(() => [...wins].sort((a, b) => b.z - a.z));

  /** where a window is drawn: its zone, the whole area, or its floating rectangle kept reachable */
  function rectOf(w: WmWin): Rect {
    const a = opts.area.value;
    if (w.snap === 'max') return { x: a.x + GAP, y: a.y + GAP, w: a.w - 2 * GAP, h: a.h - 2 * GAP };
    if (w.snap) { const r = zoneRects(w.snap.layout, a)[w.snap.zone]; if (r) return r; }
    const ww = Math.min(w.w, a.w - 2 * GAP), hh = Math.min(w.h, a.h - 2 * GAP);
    return { x: Math.min(Math.max(w.x, a.x + KEEP - ww), a.x + a.w - KEEP), y: Math.min(Math.max(w.y, a.y), a.y + a.h - BAR), w: ww, h: hh };
  }

  /** keeps the stacking numbers small (under the dock and the overlays) while keeping the order */
  function renumber() { [...wins].sort((a, b) => a.z - b.z).forEach((w, i) => (w.z = i + 1)); zTop = wins.length; }
  function focus(id: string) { const w = get(id); if (!w) return; w.min = false; if (focused.value !== id || w.z !== zTop) { w.z = ++zTop; if (zTop > 1000) renumber(); } focused.value = id; }
  function focusTopmost() { focused.value = [...shown.value].sort((a, b) => b.z - a.z)[0]?.id ?? null; }
  /** opens a window, or brings an open one forward */
  function open(id: string, rect?: Partial<Rect>) {
    if (!get(id)) {
      const a = opts.area.value, n = shown.value.length;
      const def = { x: a.x + 32 + (n % 6) * 36, y: a.y + 16 + (n % 6) * 32, w: Math.min(1040, a.w - KEEP), h: Math.min(720, a.h - 64) };
      wins.push({ id, ...def, ...opts.place?.(id, n, a), ...rect, snap: null, z: 0, min: false });
    }
    focus(id);
  }
  function close(id: string) { const i = wins.findIndex((w) => w.id === id); if (i < 0) return; wins.splice(i, 1); if (focused.value === id) focusTopmost(); }
  function minimise(id: string) { const w = get(id); if (!w) return; w.min = true; if (focused.value === id) focusTopmost(); }
  function toggleMax(id: string) { const w = get(id); if (!w) return; w.snap = w.snap === 'max' ? null : 'max'; focus(id); }
  function snap(id: string, s: Snap) { const w = get(id); if (!w) return; w.snap = s; focus(id); }
  /** the dock and the Overview: bring a window forward, or minimise it when it is already in front */
  function activate(id: string) { const w = get(id); if (w && !w.min && focused.value === id) minimise(id); else open(id); }
  /** Super+D: minimise every window; again brings the same ones back */
  function showDesktop() {
    if (shown.value.length) { hidden = shown.value.map((w) => w.id); shown.value.forEach((w) => (w.min = true)); focused.value = null; }
    else { hidden.forEach((id) => { const w = get(id); if (w) w.min = false; }); hidden = []; focusTopmost(); }
  }
  /** Super+arrows: Left / Right to that half, Up maximises, Down floats a snapped window again or minimises a floating one */
  function arrow(key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown') {
    const w = focusedWin.value; if (!w) return;
    if (key === 'ArrowLeft') snap(w.id, HALF_LEFT); else if (key === 'ArrowRight') snap(w.id, HALF_RIGHT);
    else if (key === 'ArrowUp') snap(w.id, 'max'); else if (w.snap) w.snap = null; else minimise(w.id);
  }

  /* ---------- moving: a snapped window comes off at its floating size with the pointer at the same share of the bar ---------- */
  let grab: { id: string; dx: number; dy: number; sx: number; sy: number; moved: boolean; from: { x: number; y: number } | null } | null = null;
  function moveStart(id: string, px: number, py: number) {
    const w = get(id); if (!w) return; focus(id);
    const r = rectOf(w);
    grab = { id, dx: px - r.x, dy: py - r.y, sx: px, sy: py, moved: false, from: w.snap ? null : { x: w.x, y: w.y } };
  }
  /** returns whether the window is moving (a press that has not travelled 4 px is still a click) */
  function moveTo(px: number, py: number): boolean {
    const g = grab; if (!g) return false;
    const w = get(g.id); if (!w) return false;
    if (!g.moved) {
      if (Math.hypot(px - g.sx, py - g.sy) < 4) return false;
      g.moved = true;
      if (w.snap) { const r = rectOf(w); g.dx = Math.min(w.w - 40, Math.max(40, ((px - r.x) / r.w) * w.w)); g.dy = Math.min(BAR / 2, py - r.y); w.snap = null; }
    }
    w.x = Math.round(px - g.dx); w.y = Math.round(py - g.dy);
    return true;
  }
  /** ends a move; dropped into `to` it snaps there, and later floats back to where it was before the drag */
  function moveEnd(to: Snap = null) {
    const g = grab; grab = null; if (!g?.moved) return;
    const w = get(g.id); if (!w || !to) return;
    if (g.from) { w.x = g.from.x; w.y = g.from.y; }
    w.snap = to;
  }
  const moving = () => (grab?.moved ? grab.id : null);

  /* ---------- resizing from any edge or corner ---------- */
  let rs: { id: string; h: string; px: number; py: number; r: Rect } | null = null;
  function resizeStart(id: string, handle: string, px: number, py: number) {
    const w = get(id); if (!w) return;
    const r0 = rectOf(w); Object.assign(w, r0); w.snap = null; focus(id);
    rs = { id, h: handle, px, py, r: r0 };
  }
  function resizeTo(px: number, py: number) {
    if (!rs) return; const w = get(rs.id); if (!w) return;
    const a = opts.area.value, r0 = rs.r, dx = px - rs.px, dy = py - rs.py;
    let { x, y, w: ww, h: hh } = r0;
    if (rs.h.includes('e')) ww = Math.min(a.x + a.w - x, Math.max(MIN_W, r0.w + dx));
    if (rs.h.includes('s')) hh = Math.min(a.y + a.h - y, Math.max(MIN_H, r0.h + dy));
    if (rs.h.includes('w')) { x = Math.max(a.x, Math.min(r0.x + r0.w - MIN_W, r0.x + dx)); ww = r0.x + r0.w - x; }
    if (rs.h.includes('n')) { y = Math.max(a.y, Math.min(r0.y + r0.h - MIN_H, r0.y + dy)); hh = r0.y + r0.h - y; }
    Object.assign(w, { x: Math.round(x), y: Math.round(y), w: Math.round(ww), h: Math.round(hh) });
  }
  function resizeEnd() { rs = null; }

  /* ---------- the Windows switcher (Super+Tab) ---------- */
  /** list: most recent first; held: Super is still down, so letting go switches; zoomed out (level > 1) it stays open */
  const switcher = ref<{ list: string[]; i: number; level: ZoomLevel; held: boolean } | null>(null);
  function switchStep(back: boolean, held = true) {
    const sw = switcher.value;
    if (!sw) { const list = recent.value.map((w) => w.id); if (!list.length) return; switcher.value = { list, i: list.length > 1 ? (back ? list.length - 1 : 1) : 0, level: 1, held }; return; }
    const n = sw.list.length; sw.i = (sw.i + (back ? n - 1 : 1)) % n;
  }
  function switchMove(d: number) { const sw = switcher.value; if (sw) sw.i = Math.min(sw.list.length - 1, Math.max(0, sw.i + d)); }
  function switchLevel(l: ZoomLevel) { const sw = switcher.value; if (!sw) return; sw.level = l; if (l > 1) sw.held = false; }
  function switchEnd(commit: boolean) { const sw = switcher.value; switcher.value = null; if (commit && sw?.list[sw.i]) open(sw.list[sw.i]!); }

  return {
    wins, focused, focusedWin, shown, recent, rectOf, focus, focusTopmost, open, close, minimise, toggleMax, snap, activate, showDesktop, arrow,
    moveStart, moveTo, moveEnd, moving, resizeStart, resizeTo, resizeEnd, switcher, switchStep, switchMove, switchLevel, switchEnd, get,
  };
}
export type WindowManager = ReturnType<typeof createWindowManager>;

/** Super, or Ctrl+Alt where the system keeps Super for itself */
export const isSuper = (e: { metaKey: boolean; ctrlKey: boolean; altKey: boolean }) => e.metaKey || (e.ctrlKey && e.altKey);

/** the overlays the keyboard opens; the desktop component owns them */
export interface DesktopKeyActions {
  overview(): void; launcher(): void; events(): void; picker(): void; closeAll(): boolean;
  /** Super+Z is open and waiting for a layout digit, then a zone digit */
  pickerDigit?(n: number): boolean;
}
/**
 * The desktop's keyboard. Call it from keydown and keyup on the window; it returns true when it used the key.
 * Super alone (pressed and released with nothing else) opens the Overview.
 */
export function createDesktopKeys(wm: WindowManager, act: DesktopKeyActions) {
  let alone = false;
  function down(e: KeyboardEvent): boolean {
    if (e.key === 'Meta' || e.key === 'OS') { alone = true; return false; }
    alone = false;
    const sw = wm.switcher.value;
    if (sw) {
      if (e.key === 'Escape') { e.preventDefault(); wm.switchEnd(false); return true; }
      if (e.key === 'Tab') { e.preventDefault(); wm.switchStep(e.shiftKey); return true; }
      if (!sw.held) {
        const step: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: sw.level, ArrowUp: -sw.level };
        if (e.key === 'Enter') { e.preventDefault(); wm.switchEnd(true); return true; }
        if (step[e.key] !== undefined) { e.preventDefault(); wm.switchMove(step[e.key]!); return true; }
      }
    }
    if (/^[1-9]$/.test(e.key) && act.pickerDigit?.(Number(e.key) - 1)) { e.preventDefault(); return true; }
    if (e.key === 'Escape') return act.closeAll();
    if (!isSuper(e)) return false;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const run = (f: () => void) => { e.preventDefault(); f(); return true; };
    if (k === 'Tab') return run(() => wm.switchStep(e.shiftKey));
    if (k === ' ') return run(act.launcher);
    if (k === 'n') return run(act.events);
    if (k === 'd') return run(wm.showDesktop);
    if (k === 'z') return run(act.picker);
    if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') return run(() => wm.arrow(k));
    return false;
  }
  function up(e: KeyboardEvent): boolean {
    if (wm.switcher.value?.held && ['Meta', 'OS', 'Control', 'Alt'].includes(e.key)) { wm.switchEnd(true); alone = false; return true; }
    if ((e.key === 'Meta' || e.key === 'OS') && alone) { alone = false; act.overview(); return true; }
    alone = false; return false;
  }
  return { down, up };
}
