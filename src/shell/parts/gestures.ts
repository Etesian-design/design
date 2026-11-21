/**
 * The phone's gesture maths, taken from the ROM (vendor/etesian: launcher EdgeGestures, WindowDrag, HomePager,
 * RestoreTransition, AppPeek, UnlockAnimation; SystemUI EtesianKeyguardSwipe). Units are dp, dp/s and ms.
 * Guide: docs/23-phone-behaviour.md. Used by XPhoneGestures.vue.
 */

/** Android's defaults, which the ROM uses through ViewConfiguration. */
export const ANDROID = { touchSlop: 8, minFlingDpS: 50 } as const;

export const EDGE = {
  /** Edge zone on the left, right and bottom. */
  zone: 18,
  /** Band under the status bar where a clear swipe down still closes the app. */
  topBand: 24,
  /** A Back swipe (when a side is set as Back) fires past this. */
  backMin: 40,
} as const;

export const SWIPE = {
  /** Default "Swipe distance to leave an app": 50% (N9); the setting also has 40, 30 and 20%. */
  commit: 0.5,
  distances: [0.5, 0.4, 0.3, 0.2],
  /** A quick flick inward commits once past this much. */
  flingDpS: 900,
  flingMinProgress: 0.08,
  /** Moving back towards the edge faster than this always cancels. */
  backOffDpS: 900 / 3,
  /** Home behind the app before the swipe starts. */
  homeScale: 0.9,
  homeLight: 0.25,
  /** Black over a closing app at the bottom of the screen, and behind the app row. */
  closeDarkest: 0.7,
  peekDarkest: 0.55,
  /** Hold still this long on a swipe up from the bottom and the app row comes up. */
  peekHoldMs: 500,
  /** The app's fall into shadow behind the row. */
  peekShadowMs: 260,
  /** Row icons: each starts this much after the one before, and takes rowIconMs. */
  rowStaggerMs: 30,
  rowIconMs: 220,
  /** Row icons come from 1.25x, 40 dp lower and transparent; the icon under the finger lifts to 1.15x in 120 ms. */
  rowIconFrom: { scale: 1.25, y: 40 },
  rowHover: { scale: 1.15, ms: 120 },
  /** The row: one icon per grid column (4), the icon size (58 dp by default) + 36 dp high. */
  rowExtra: 36,
} as const;

export const PAGER = {
  /** A drag is sideways when |dx| > 1.3 |dy|. */
  sideways: 1.3,
  /** 6 x the minimum fling velocity. */
  flingDpS: 6 * ANDROID.minFlingDpS,
  maxMs: 400,
  /** The scrolling wallpaper is this many screens wide. */
  panWidth: 1.35,
  /** Page dots (hidden by default): radius, spacing, distance from the edge (dp); alpha of a far and the current dot. */
  dot: { r: 2.5, gap: 12, inset: 12, alphaFar: 70, alphaNear: 255 },
} as const;

export const RESTORE = {
  /** The tapped card is sucked away (AccelerateInterpolator 1.5). */
  suckMs: 110,
  /** Then the app slides in (Decelerate 1.6). */
  slideMs: 300,
} as const;

export const UNLOCK = {
  commit: 0.35,
  flingDpS: 1000,
  flingMs: 160,
  slideMs: 220,
  springMs: 260,
  /** Home's zoom when the lock screen has gone (also the whole of a fingerprint unlock). */
  zoomMs: 220,
  /** Pull this far down at the top of the open notification list and it closes. */
  closePull: 64,
} as const;

/** Android's DecelerateInterpolator(f). */
export const decelerate = (t: number, f = 1) => (f === 1 ? 1 - (1 - t) * (1 - t) : 1 - Math.pow(1 - t, 2 * f));
/** Android's AccelerateInterpolator(f). */
export const accelerate = (t: number, f = 1) => (f === 1 ? t * t : Math.pow(t, 2 * f));

/** Commit and cancel animations of a window drag (and the pager settle, which is capped). */
export const settleMs = (delta: number, cap = Infinity) => Math.min(cap, Math.round(220 + 180 * Math.abs(delta)));

export type Edge = 'left' | 'right' | 'top' | 'bottom';

/** Which edge a touch starts on, or null. statusBar: its height in dp. */
export function edgeAt(x: number, y: number, w: number, h: number, statusBar: number): Edge | null {
  if (y < statusBar) return 'top';
  if (y < statusBar + EDGE.topBand && x >= EDGE.zone && x <= w - EDGE.zone) return 'top';
  if (x < EDGE.zone) return 'left';
  if (x > w - EDGE.zone) return 'right';
  if (y > h - EDGE.zone) return 'bottom';
  return null;
}

/** How far the finger has come in from its edge (dp), and across it. */
export function inward(edge: Edge, dx: number, dy: number) {
  switch (edge) {
    case 'left': return { d: dx, across: dy };
    case 'right': return { d: -dx, across: dy };
    case 'top': return { d: dy, across: dx };
    case 'bottom': return { d: -dy, across: dx };
  }
}

/** Progress 0..1 of a window drag: the distance over the screen's width (sides) or height (top, bottom). */
export const progressOf = (edge: Edge, d: number, w: number, h: number) =>
  Math.min(1, Math.max(0, d / (edge === 'left' || edge === 'right' ? w : h)));

/** Letting go: past the distance, or a quick flick inward; moving back towards the edge always cancels. */
export function shouldCommit(progress: number, inwardDpS: number, distance: number = SWIPE.commit) {
  if (inwardDpS < -SWIPE.backOffDpS) return false;
  if (inwardDpS > SWIPE.flingDpS) return progress > SWIPE.flingMinProgress;
  return progress > distance;
}

/** Home behind a window being swiped away (also behind the lock screen): scale and opacity at progress p. */
export const homeLook = (p: number) => ({ scale: SWIPE.homeScale + (1 - SWIPE.homeScale) * p, opacity: SWIPE.homeLight + (1 - SWIPE.homeLight) * p });

/** The black over the app: closing from the top darkens with p; the app row's shadow (0..1) on top of that. */
export const shade = (edge: Edge, closing: boolean, p: number, peek = 0) =>
  Math.max(closing && edge === 'top' ? SWIPE.closeDarkest * p : 0, SWIPE.peekDarkest * peek);

/** Where the window sits (dp) at progress p. */
export function windowOffset(edge: Edge, p: number, w: number, h: number) {
  switch (edge) {
    case 'left': return { x: p * w, y: 0 };
    case 'right': return { x: -p * w, y: 0 };
    case 'top': return { x: 0, y: p * h };
    case 'bottom': return { x: 0, y: -p * h };
  }
}

/** The home views, left to right; swiping is circular. Defaults: News and Widgets off, Events on. */
export type HomeView = 'news' | 'widgets' | 'events' | 'apps' | 'switcher';
export function homeViews(o: { news?: boolean; widgets?: number; events?: boolean } = {}): HomeView[] {
  const v: HomeView[] = [];
  if (o.news) v.push('news');
  for (let i = 0; i < (o.widgets ?? 0); i++) v.push('widgets');
  if (o.events ?? true) v.push('events');
  v.push('apps', 'switcher');
  return v;
}

/** The signed distance from offset to view i, on the circle of n views (-n/2..n/2). */
export function wrap(d: number, n: number) {
  const half = n / 2;
  return ((((d + half) % n) + n) % n) - half;
}

/**
 * Where the pager settles after a drag from startOffset to offset. vx: finger velocity (dp/s, + = to the right);
 * fling: the finger lifted (not cancelled). Never more than one view from where the drag started.
 */
export function pagerTarget(startOffset: number, offset: number, vx: number, fling: boolean) {
  const base = Math.round(startOffset);
  let t = Math.round(offset);
  if (fling && vx < -PAGER.flingDpS) t = Math.floor(offset) + 1;
  else if (fling && vx > PAGER.flingDpS) t = Math.ceil(offset) - 1;
  return Math.min(base + 1, Math.max(base - 1, t));
}

/** Unlock on release: past 35% of the screen on that axis, or a fling along the drag; a fling against it springs back. */
export function unlockCommits(d: number, size: number, v: number) {
  const fast = Math.abs(v) > UNLOCK.flingDpS;
  const along = d === 0 || Math.sign(v) === Math.sign(d);
  if (fast && !along) return { commit: false, ms: UNLOCK.springMs };
  if (Math.abs(d) > size * UNLOCK.commit || (fast && along)) return { commit: true, ms: fast ? UNLOCK.flingMs : UNLOCK.slideMs };
  return { commit: false, ms: UNLOCK.springMs };
}

/** Finger velocity from recent samples (dp/s), over the last 100 ms. */
export function velocity(samples: { t: number; x: number; y: number }[]) {
  const last = samples[samples.length - 1];
  if (!last) return { vx: 0, vy: 0 };
  const first = samples.find((s) => last.t - s.t <= 100) ?? last;
  const dt = (last.t - first.t) / 1000;
  return dt > 0 ? { vx: (last.x - first.x) / dt, vy: (last.y - first.y) / dt } : { vx: 0, vy: 0 };
}
