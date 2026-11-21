<script setup lang="ts">
/**
 * An interactive phone (360 x 720 dp, the Pro1-X's 1080 x 2160 at 3x) that moves exactly as the ROM does (gestures.ts):
 * - home views side by side, swiped in a circle; a drag settles to the nearest view, at most one away;
 * - an app over home: swipe in from the left, right or bottom edge (18 dp) to minimise it, down from the status bar
 *   (or the 24 dp band under it) to close it. The app only slides; home behind it zooms from 0.9 and brightens from 25%;
 *   closing darkens it up to 70%. Past the distance (50%) or a flick (900 dp/s) it goes; otherwise it springs back.
 * - swipe up from the bottom and hold still 500 ms: the first row of Applications comes up, the app rests on it in 55%
 *   shadow; let go on an icon to open it, or tap an icon or the app later.
 * - tap an Applications icon to launch, or an Open apps card to restore: the app comes in from the side the last one left by.
 * - locked: drag the lock screen any way; past 35% (or a 1000 dp/s flick) it unlocks.
 * Emits `log` with a short line for each finished gesture (the story shows it).
 */
import { ref, computed, onBeforeUnmount } from 'vue';
import HdAppIcon from '../../components/HdAppIcon.vue';
import HdAppGrid from '../../components/HdAppGrid.vue';
import HdTaskCard from '../../components/HdTaskCard.vue';
import HdEventsHeader from '../../components/HdEventsHeader.vue';
import HdEventsFeedItem from '../../components/HdEventsFeedItem.vue';
import HdSectionHeader from '../../components/HdSectionHeader.vue';
import XFit from './XFit.vue';
import XMiniApp from './XMiniApp.vue';
import { APPS, app as appInfo } from './data';
import {
  ANDROID, SWIPE, PAGER, RESTORE, UNLOCK, type Edge, type HomeView,
  edgeAt, inward, progressOf, shouldCommit, homeLook, shade, windowOffset, homeViews, wrap, pagerTarget, unlockCommits,
  velocity, settleMs, decelerate, accelerate,
} from './gestures';

const props = withDefaults(defineProps<{
  /** The app open at the start (null: home). */
  open?: string | null; running?: string[]; locked?: boolean;
  news?: boolean; widgets?: number; events?: boolean;
  /** Where a minimised app leaves you (per side on the phone; one value here). */
  leaveTo?: 'switcher' | 'last' | 'events' | 'apps' | 'widgets';
  /** Swipe distance to leave an app: 0.5 (N9, default), 0.4, 0.3, 0.2. */
  distance?: number;
  dots?: 'hidden' | 'top' | 'bottom';
  /** Tint the 18 dp edge zones (a teaching aid; the phone draws nothing there). */
  zones?: boolean;
}>(), { zones: true,  open: 'Messages', running: () => ['Messages', 'Mail', 'Calendar', 'Music'], locked: false, events: true, widgets: 0, leaveTo: 'switcher', distance: SWIPE.commit, dots: 'hidden' });
const emit = defineEmits<{ log: [line: string] }>();

const W = 360, H = 720, BAR = 24, ICON = 58, ROW_H = ICON + SWIPE.rowExtra;
const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const views = computed(() => homeViews({ news: props.news, widgets: props.widgets, events: props.events }));
const offset = ref(Math.max(0, views.value.indexOf('apps')));
const current = computed(() => ((Math.round(offset.value) % views.value.length) + views.value.length) % views.value.length);
const LABEL: Record<HomeView, string> = { news: 'News', widgets: 'Widgets', events: 'Events', apps: 'Applications', switcher: 'Open apps' };

const tasks = ref<string[]>([...props.running]);
const app = ref<string | null>(props.open);
const edge = ref<Edge>('left');
const closing = ref(false);
const p = ref(0);
const peekShadow = ref(0);
const rowUp = ref(false);
const parked = ref(false);
const hovered = ref(-1);
const launching = ref<string | null>(null);
const sucking = ref<{ name: string; k: number } | null>(null);
/** The next app comes in from the side the last one was swiped out to (the left until then). */
const fromRight = ref(false);
const locked = ref(props.locked);
const lockD = ref(0);
const lockAxis = ref<'x' | 'y'>('x');
const ROW = APPS.slice(0, 4);

const log = (s: string) => emit('log', s);

// --- animation: one tween per channel, on Android's interpolators ---
const tweens = new Map<string, number>();
function tween(key: string, from: number, to: number, ms: number, ease: (t: number) => number, set: (v: number) => void, done?: () => void) {
  cancelAnimationFrame(tweens.get(key) ?? 0);
  const dur = reduce ? 1 : ms; const t0 = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / dur);
    set(from + (to - from) * ease(t));
    if (t < 1) tweens.set(key, requestAnimationFrame(step)); else { tweens.delete(key); done?.(); }
  };
  tweens.set(key, requestAnimationFrame(step));
}
onBeforeUnmount(() => { tweens.forEach((id) => cancelAnimationFrame(id)); clearTimeout(holdTimer); });
const dec16 = (t: number) => decelerate(t, 1.6);

// --- looks ---
const look = (k: number) => { const l = homeLook(k); return { transform: `scale(${l.scale})`, opacity: l.opacity }; };
/** Home behind an app being swiped away. */
const homeStyle = computed(() => (app.value ? look(p.value) : {}));
/** Whatever is behind the lock screen (home, or the app last open) comes out of the dark with the slide. */
const belowStyle = computed(() => (locked.value ? look(Math.min(1, Math.abs(lockD.value) / (lockAxis.value === 'x' ? W : H))) : {}));
const appStyle = computed(() => {
  const o = windowOffset(edge.value, p.value, W, H);
  return { transform: `translate(${o.x}px, ${o.y}px)` };
});
const appShade = computed(() => shade(edge.value, closing.value, p.value, peekShadow.value));
const viewStyle = (i: number) => {
  const d = wrap(i - offset.value, views.value.length);
  return { transform: `translateX(${d * W}px)`, visibility: Math.abs(d) < 1 ? 'visible' as const : 'hidden' as const };
};
const dotAlpha = (i: number) => (PAGER.dot.alphaFar + (PAGER.dot.alphaNear - PAGER.dot.alphaFar) * Math.max(0, 1 - Math.abs(wrap(i - offset.value, views.value.length)))) / 255;
const lockStyle = computed(() => ({ transform: lockAxis.value === 'x' ? `translateX(${lockD.value}px)` : `translateY(${lockD.value}px)` }));

// --- actions ---
function showView(v: HomeView | 'last') {
  if (v === 'last') return;
  const i = views.value.indexOf(v);
  if (i >= 0) offset.value = i;
}
function bringIn(name: string, how: string) {
  tasks.value = [name, ...tasks.value.filter((t) => t !== name)];
  app.value = name; closing.value = false; peekShadow.value = 0; rowUp.value = false; parked.value = false;
  edge.value = fromRight.value ? 'left' : 'right';
  p.value = 1;
  tween('app', 1, 0, RESTORE.slideMs, dec16, (v) => (p.value = v), () => log(`${how} ${name}: slid in from the ${fromRight.value ? 'right' : 'left'} in ${RESTORE.slideMs} ms`));
}
function launch(name: string) {
  if (launching.value || app.value) return;
  launching.value = name;
  // The phone waits for the app to draw (the ring on the icon); here a fixed 250 ms stands in for that wait.
  setTimeout(() => { launching.value = null; bringIn(name, 'Launched'); }, reduce ? 1 : 250);
}
function restore(name: string) {
  if (app.value || sucking.value) return;
  sucking.value = { name, k: 1 };
  tween('suck', 1, 0, RESTORE.suckMs, (t) => accelerate(t, 1.5), (v) => (sucking.value = { name, k: v }), () => { sucking.value = null; bringIn(name, 'Restored'); });
}
function closeTask(name: string) { tasks.value = tasks.value.filter((t) => t !== name); log(`Closed ${name} from Open apps`); }

function leave(commit: boolean, v: number) {
  const from = p.value;
  if (!commit) {
    tween('app', from, 0, settleMs(from), dec16, (x) => (p.value = x));
    if (peekShadow.value) tween('shade', peekShadow.value, 0, SWIPE.peekShadowMs, (t) => decelerate(t), (x) => (peekShadow.value = x));
    log(`Let go at ${Math.round(from * 100)}% (${Math.round(v)} dp/s): springs back in ${settleMs(from)} ms`);
    return;
  }
  const name = app.value!; const e = edge.value; const close = closing.value;
  if (!close && (e === 'left' || e === 'right')) fromRight.value = e === 'left';
  tween('app', from, 1, settleMs(1 - from), dec16, (x) => (p.value = x), () => {
    app.value = null; p.value = 0; peekShadow.value = 0;
    if (close) { tasks.value = tasks.value.filter((t) => t !== name); showView('switcher'); }
    else showView(e === 'top' ? 'switcher' : props.leaveTo);
    log(`${close ? 'Closed' : 'Minimised'} ${name} from the ${e} at ${Math.round(from * 100)}% (${Math.round(v)} dp/s) in ${settleMs(1 - from)} ms`);
  });
}

// --- touch ---
type Mode = 'none' | 'edge?' | 'edge' | 'pager?' | 'pager' | 'lock?' | 'lock' | 'parked' | 'status';
let mode: Mode = 'none';
let x0 = 0, y0 = 0, startOffset = 0, lockStart = 0, stillX = 0, stillY = 0, belowBar = false, moved = false;
let samples: { t: number; x: number; y: number }[] = [];
let holdTimer: ReturnType<typeof setTimeout> | undefined;
const screen = ref<HTMLElement | null>(null);
const slop = ANDROID.touchSlop;

function local(e: PointerEvent) {
  const r = screen.value!.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
}
function rowIndexAt(x: number, y: number) { return y > H - ROW_H ? Math.min(3, Math.floor(x / (W / 4))) : -1; }

function armHold() {
  clearTimeout(holdTimer);
  holdTimer = setTimeout(() => {
    if (mode !== 'edge' || edge.value !== 'bottom' || rowUp.value) return;
    rowUp.value = true;
    const to = ROW_H / H;
    tween('app', p.value, to, settleMs(to - p.value), dec16, (x) => (p.value = x));
    tween('shade', peekShadow.value, 1, SWIPE.peekShadowMs, (t) => decelerate(t), (x) => (peekShadow.value = x));
    log(`Held ${SWIPE.peekHoldMs} ms: the app row came up; the app rests on it in ${Math.round(SWIPE.peekDarkest * 100)}% shadow`);
  }, SWIPE.peekHoldMs);
}

function down(e: PointerEvent) {
  if (e.button !== 0 || mode !== 'none' && mode !== 'parked') return;
  const { x, y } = local(e);
  x0 = x; y0 = y; moved = false; samples = [{ t: e.timeStamp, x, y }];
  if (parked.value) { mode = 'parked'; }
  else if (locked.value) { mode = 'lock?'; lockStart = lockD.value; }
  else if (app.value && !tweens.has('app')) {
    const ed = edgeAt(x, y, W, H, BAR);
    if (!ed) { mode = 'none'; return; }
    edge.value = ed; belowBar = ed === 'top' && y >= BAR; mode = 'edge?';
  } else if (!app.value) {
    if (y < BAR) mode = 'status';
    else { mode = 'pager?'; if (tweens.has('pager')) { cancelAnimationFrame(tweens.get('pager')!); tweens.delete('pager'); startOffset = offset.value; mode = 'pager'; } }
  } else return;
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', cancel);
}
function move(e: PointerEvent) {
  const { x, y } = local(e);
  samples.push({ t: e.timeStamp, x, y }); if (samples.length > 20) samples.shift();
  const dx = x - x0, dy = y - y0;
  if (Math.hypot(dx, dy) > slop) moved = true;
  switch (mode) {
    case 'edge?': {
      const { d, across } = inward(edge.value, dx, dy);
      if (d > slop && d > Math.abs(across)) {
        mode = 'edge'; closing.value = edge.value === 'top';
        if (edge.value === 'bottom') { stillX = x; stillY = y; armHold(); }
      } else if (Math.abs(across) > slop * 2 && (edge.value !== 'top' || belowBar)) mode = 'none';
      break;
    }
    case 'edge': {
      if (rowUp.value) { hovered.value = rowIndexAt(x, y); break; }
      p.value = progressOf(edge.value, inward(edge.value, dx, dy).d, W, H);
      if (edge.value === 'bottom' && Math.hypot(x - stillX, y - stillY) > slop) { stillX = x; stillY = y; armHold(); }
      break;
    }
    case 'pager?':
      if (Math.abs(dx) > slop && Math.abs(dx) > Math.abs(dy) * PAGER.sideways) { mode = 'pager'; startOffset = offset.value; x0 = x; }
      break;
    case 'pager': offset.value = startOffset - (x - x0) / W; break;
    case 'lock?':
      if (Math.hypot(dx, dy) > slop * 0.8) { mode = 'lock'; lockAxis.value = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y'; lockStart = 0; }
      break;
    case 'lock': lockD.value = lockStart + (lockAxis.value === 'x' ? dx : dy); break;
  }
}
function finish(e: PointerEvent | null) {
  window.removeEventListener('pointermove', move);
  window.removeEventListener('pointerup', up);
  window.removeEventListener('pointercancel', cancel);
  clearTimeout(holdTimer);
  const m = mode; mode = 'none';
  const { vx, vy } = velocity(samples);
  const pt = e ? local(e) : { x: x0, y: y0 };
  switch (m) {
    case 'edge': {
      if (rowUp.value) {
        const i = rowIndexAt(pt.x, pt.y); hovered.value = -1;
        if (e && i >= 0) { openFromRow(i); return; }
        parked.value = true; mode = 'parked';
        log('Let go off the row: the app rests on it until you tap an icon or the app');
        return;
      }
      const v = edge.value === 'left' ? vx : edge.value === 'right' ? -vx : edge.value === 'top' ? vy : -vy;
      leave(!!e && shouldCommit(p.value, v, props.distance), v);
      return;
    }
    case 'parked': {
      if (moved) { mode = 'parked'; return; }
      const i = rowIndexAt(pt.x, pt.y);
      if (i >= 0) openFromRow(i);
      else { parked.value = false; rowUp.value = false; leave(false, 0); log('Tapped the app: back to it'); }
      return;
    }
    case 'pager': {
      const t = pagerTarget(startOffset, offset.value, vx, !!e);
      const ms = settleMs(t - offset.value, PAGER.maxMs);
      tween('pager', offset.value, t, ms, dec16, (v) => (offset.value = v), () => {
        const n = views.value.length; offset.value = ((t % n) + n) % n;
        log(`Home: ${LABEL[views.value[offset.value]!]} (${Math.round(vx)} dp/s, settled in ${ms} ms)`);
      });
      return;
    }
    case 'lock': {
      const size = lockAxis.value === 'x' ? W : H;
      const r = unlockCommits(lockD.value, size, lockAxis.value === 'x' ? vx : vy);
      const from = lockD.value, to = r.commit ? Math.sign(from || 1) * size : 0;
      tween('lock', from, to, r.ms, (t) => decelerate(t, 1.5), (v) => (lockD.value = v), () => {
        if (r.commit) { locked.value = false; lockD.value = 0; }
        log(r.commit ? `Unlocked at ${Math.round((Math.abs(from) / size) * 100)}% in ${r.ms} ms` : `Lock screen springs back (${r.ms} ms)`);
      });
      return;
    }
    case 'status': if (!moved) log('Tap on the status bar: the status menu opens (never the notification shade)'); return;
  }
}
function openFromRow(i: number) {
  const name = ROW[i]!.name; const old = app.value;
  tweens.forEach((id) => cancelAnimationFrame(id)); tweens.clear();
  app.value = null; p.value = 0; peekShadow.value = 0; rowUp.value = false; parked.value = false; mode = 'none';
  log(`Opened ${name} from the app row (${old} stays open)`);
  bringIn(name, 'Opened');
}
const up = (e: PointerEvent) => finish(e);
const cancel = () => finish(null);
/** A drag is not a tap on whatever it started on. */
function click(e: MouseEvent) { if (moved) { e.stopPropagation(); e.preventDefault(); } }

function lock() { tweens.forEach((id) => cancelAnimationFrame(id)); tweens.clear(); locked.value = true; lockD.value = 0; log('Locked'); }
defineExpose({ lock, offset, app, locked });
</script>

<template>
  <div ref="screen" class="x-pg" :style="{ width: W + 'px', height: H + 'px' }" @pointerdown="down" @click.capture="click"
    role="application" aria-label="Phone: swipe in from the edges, swipe between home views">
    <div class="x-pg__below" :style="belowStyle">
    <div class="x-pg__home" :style="homeStyle">
      <div class="x-pg__bar"><span>12:45</span></div>
      <section v-for="(v, i) in views" :key="v + i" class="x-pg__view" :style="viewStyle(i)" :aria-label="LABEL[v]" :aria-hidden="i !== current">
        <template v-if="v === 'events'">
          <HdEventsHeader day="Saturday" date="21 November" city="Helsinki" temperature="-2°" weather="cloud" />
          <HdSectionHeader title="Notifications" />
          <HdEventsFeedItem title="Anna Virtanen" body="Are we still on for lunch?" time="12:02" icon="message" accent="#09A7CC" />
          <HdEventsFeedItem title="Calendar" body="Design review moved to 14:30" time="11:15" icon="calendar" accent="#EF5500" />
        </template>
        <HdAppGrid v-else-if="v === 'apps'" class="x-pg__grid">
          <li v-for="a in APPS" :key="a.name"><HdAppIcon :label="a.name" :icon="a.icon" :art="a.art" :color="a.color" :tone="a.tone" :size="ICON" :loading="launching === a.name" @click="launch(a.name)" /></li>
        </HdAppGrid>
        <div v-else-if="v === 'switcher'" class="x-pg__cards">
          <p v-if="!tasks.length" class="x-pg__empty">No open apps</p>
          <div v-for="t in tasks" :key="t" class="x-pg__card" :style="sucking?.name === t ? { transform: `scale(${sucking.k})` } : undefined">
            <HdTaskCard :title="t" @open="restore(t)" @close="closeTask(t)">
              <XFit :w="W" :h="H" :initial="0.4"><div class="x-pg__mini hd-on-page" inert><XMiniApp :name="t" chrome="toolbar" :hints="false" :id-prefix="'pg-' + t" /></div></XFit>
            </HdTaskCard>
          </div>
        </div>
        <div v-else class="x-pg__plain"><p>{{ LABEL[v] }}</p></div>
      </section>
      <div v-if="dots !== 'hidden'" class="x-pg__dots" :class="'x-pg__dots--' + dots" aria-hidden="true">
        <i v-for="(v, i) in views" :key="i" :style="{ opacity: dotAlpha(i) }" />
      </div>
    </div>

    <div v-if="rowUp" class="x-pg__row" :style="{ height: ROW_H + 'px' }" aria-label="First row of Applications">
      <span v-for="(a, i) in ROW" :key="a.name" class="x-pg__rowicon" :class="{ 'is-hover': hovered === i }" :style="{ animationDelay: i * SWIPE.rowStaggerMs + 'ms' }">
        <HdAppIcon :label="a.name" :icon="a.icon" :art="a.art" :color="a.color" :tone="a.tone" :size="ICON" />
      </span>
    </div>

    <div v-if="app" class="x-pg__app hd-on-page" :style="appStyle" :aria-label="app">
      <div class="x-pg__bar x-pg__bar--app"><span>12:45</span></div>
      <div class="x-pg__appbody" :style="{ height: H - BAR + 'px' }"><XMiniApp :name="app" chrome="toolbar" :hints="false" id-prefix="pg-app" /></div>
      <div class="x-pg__shade" :style="{ opacity: appShade }" />
      <template v-if="zones"><div class="x-pg__zone x-pg__zone--l" /><div class="x-pg__zone x-pg__zone--r" /><div class="x-pg__zone x-pg__zone--b" /></template>
    </div>
    </div>

    <div v-if="locked" class="x-pg__lock" :style="lockStyle" aria-label="Lock screen">
      <div class="x-pg__bar"><span /></div>
      <p class="x-pg__clock">12:45</p>
      <p class="x-pg__date">Saturday 21 November</p>
      <p class="x-pg__swipe">Swipe sideways to unlock</p>
    </div>
  </div>
</template>

<style>
.x-pg { position: relative; overflow: hidden; background: #000; color: #F2F2F2; touch-action: none; user-select: none; font-family: var(--hd-font-family-base); contain: layout paint; }
.x-pg__below, .x-pg__home, .x-pg__app, .x-pg__lock { position: absolute; inset: 0; }
.x-pg__below { transform-origin: 50% 50%; }
.x-pg__home { transform-origin: 50% 50%; background: #000; }
.x-pg__bar { position: relative; z-index: 2; height: 24px; display: flex; justify-content: flex-end; align-items: center; padding: 0 10px; font-size: 13px; background: #000; color: #F2F2F2; }
.x-pg__view { position: absolute; top: 24px; left: 0; right: 0; bottom: 0; overflow: hidden; }
.x-pg__grid { padding: 12px 0; }
.x-pg__cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 16px; padding: 20px 16px; align-content: start; }
.x-pg__card { transform-origin: 50% 50%; }
.x-pg__mini { width: 360px; height: 720px; display: flex; background: var(--hd-c-bg); color: var(--hd-c-fg); }
.x-pg__empty, .x-pg__plain p { grid-column: 1 / -1; text-align: center; color: #8C8C8C; font-size: 15px; margin-top: 40%; }
.x-pg__dots { position: absolute; left: 0; right: 0; display: flex; justify-content: center; gap: 7px; pointer-events: none; }
.x-pg__dots--top { top: 31px; } .x-pg__dots--bottom { bottom: 9.5px; }
.x-pg__dots i { width: 5px; height: 5px; border-radius: 50%; background: #F2F2F2; }
.x-pg__row { position: absolute; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: repeat(4, 1fr); align-items: center; justify-items: center; background: #000; }
.x-pg__rowicon { animation: x-pg-rise 220ms cubic-bezier(0, 0, .58, 1) both; transition: transform 120ms; }
.x-pg__rowicon.is-hover { transform: scale(1.15); }
.x-pg__rowicon .hd-app-icon__label { display: none; }
@keyframes x-pg-rise { from { transform: translateY(40px) scale(1.25); opacity: 0; } }
.x-pg__app { z-index: 3; background: var(--hd-c-bg); color: var(--hd-c-fg); box-shadow: 0 0 24px rgba(0,0,0,.5); }
.x-pg__appbody { display: flex; flex-direction: column; overflow: hidden; }
.x-pg__appbody > * { flex: 1 1 auto; }
.x-pg__shade { position: absolute; inset: 0; background: #000; pointer-events: none; }
.x-pg__zone { position: absolute; pointer-events: none; background: rgba(42, 134, 216, .14); }
.x-pg__zone--l { left: 0; top: 0; bottom: 0; width: 18px; } .x-pg__zone--r { right: 0; top: 0; bottom: 0; width: 18px; }
.x-pg__zone--b { left: 0; right: 0; bottom: 0; height: 18px; }
.x-pg__lock { z-index: 4; background: linear-gradient(160deg, #0e1418 10%, #2f6b6b 55%, #0d2a2c 90%); text-align: right; padding: 0 20px; }
.x-pg__lock .x-pg__bar { background: transparent; margin: 0 -20px; }
.x-pg__clock { font-size: 96px; font-weight: 200; margin: 40px 0 0; line-height: 1; }
.x-pg__date { font-size: 18px; margin: 8px 0 0; }
.x-pg__swipe { position: absolute; left: 0; right: 0; bottom: 40px; text-align: center; font-size: 14px; color: rgba(255,255,255,.8); }
@media (prefers-reduced-motion: reduce) { .x-pg__rowicon { animation-duration: 1ms; } }
</style>
