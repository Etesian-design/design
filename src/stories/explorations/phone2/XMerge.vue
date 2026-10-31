<script setup lang="ts">
/**
 * Interactive: Open apps edit mode, pull two cards together with two fingers to make a split pair.
 * Touch: one finger on each card. Mouse: drag a card onto another (the other counts as held).
 * - Pulling: each card follows its finger.
 * - Snap: once the cards overlap enough they are taken from the fingers and become ONE card showing the result,
 *   the portrait split (top / bottom with the split-view handle), with a short vibration.
 * - Still in your hands: pulling the fingers apart stretches the merged card towards them; past the limit it
 *   tears back into two cards under the fingers (a lighter vibration).
 * - Lifting while merged keeps the pair as one card; the grid reflows.
 * - The opposite: two fingers on a split card pull it apart. It stretches, then tears into two cards (one under each
 *   finger, the upper finger keeps the top app) with a vibration; pushing back re-joins it; lifting while torn separates.
 */
import { computed, onMounted, reactive, ref } from 'vue';
import HdSquircle from '../../../components/HdSquircle.vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdTaskEditBar from '../../../components/HdTaskEditBar.vue';

const props = defineProps<{ autoplay?: boolean; at?: number }>(); // at: freeze the demo at this second (screenshots)
type App = { name: string; icon: string; color: string };
const APPS: Record<string, App> = {
  mail: { name: 'Mail', icon: 'mail', color: '#0067BC' }, calendar: { name: 'Calendar', icon: 'calendar', color: '#EF5500' },
  music: { name: 'Music', icon: 'music', color: '#C000C0' }, messages: { name: 'Messages', icon: 'message', color: '#09A7CC' },
};
type Card = { id: string; apps: string[] }; // one app, or a split pair (top, bottom)
const W = 360, PAD = 20, GAP = 14, CW = (W - 2 * PAD - GAP) / 2, CH = 150, ROW = CH + 40, TOP = 34;
const SNAP_OVERLAP = 0.5;  // cards snap when they overlap by half a card
const TEAR = 0.45 * CW;    // how far the fingers may stretch the merged card before it tears apart

const cards = ref<Card[]>(Object.keys(APPS).map((k) => ({ id: k, apps: [k] })));
const g = reactive({ a: '', b: '', snapped: false, active: false, offA: { x: 0, y: 0 }, offB: { x: 0, y: 0 }, mid: { x: 0, y: 0 }, stretch: 0, snapDist: 0, pop: 0 });
/** the opposite: two fingers on a split card pull it apart into two cards */
const sp = reactive({ id: '', d0: 0, stretch: 0, ax: 1, ay: 0, torn: false, pa: { x: 0, y: 0 }, pb: { x: 0, y: 0 }, pop: 0 });
const pointers = new Map<number, { card: string; sx: number; sy: number; x: number; y: number }>();

const slot = (i: number) => ({ x: PAD + (i % 2) * (CW + GAP), y: TOP + Math.floor(i / 2) * ROW });
const idx = (id: string) => cards.value.findIndex((c) => c.id === id);
function local(e: PointerEvent) { const r = (e.currentTarget as HTMLElement).closest('.xm')!.getBoundingClientRect(); return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * W) / r.width }; }
const buzz = (ms: number) => { try { navigator.vibrate?.(ms); } catch { /* not supported */ } };

function down(id: string, e: PointerEvent) {
  const c = cards.value[idx(id)]; if (!c) return;
  if (c.apps.length > 1) { downSplit(id, e); return; } // a pair cannot take a third app: pulling it apart separates it
  if (sp.id) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  const p = local(e);
  pointers.set(e.pointerId, { card: id, sx: p.x, sy: p.y, x: p.x, y: p.y });
  const held = [...new Set([...pointers.values()].map((q) => q.card))];
  Object.assign(g, { active: true, snapped: false, stretch: 0, offA: { x: 0, y: 0 }, offB: { x: 0, y: 0 } });
  g.a = held[0]!; g.b = held[1] ?? '';
}
function centreOf(id: string) { const s0 = slot(idx(id)); return { x: s0.x + CW / 2, y: s0.y + CH / 2 }; }
function downSplit(id: string, e: PointerEvent) {
  if (g.active || (sp.id && sp.id !== id)) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  const p = local(e);
  pointers.set(e.pointerId, { card: id, sx: p.x, sy: p.y, x: p.x, y: p.y });
  sp.id = id; sp.torn = false; sp.stretch = 0; sp.d0 = splitDist();
}
/** finger spread; with one pointer (mouse) the other finger is its mirror through the card centre */
function splitFingers() {
  const ps = [...pointers.values()].filter((q) => q.card === sp.id), c = centreOf(sp.id);
  const a = ps[0]!, b = ps[1] ?? { x: 2 * c.x - a.x, y: 2 * c.y - a.y };
  return { a, b };
}
function splitDist() { const { a, b } = splitFingers(); return Math.hypot(a.x - b.x, a.y - b.y); }
function moveSplit() {
  const { a, b } = splitFingers(), d = Math.hypot(a.x - b.x, a.y - b.y);
  sp.stretch = Math.max(0, d - sp.d0); sp.ax = Math.abs(a.x - b.x) / (d || 1); sp.ay = Math.abs(a.y - b.y) / (d || 1);
  // the upper finger takes the top app
  const [top, bottom] = a.y <= b.y ? [a, b] : [b, a];
  sp.pa = { x: top.x - CW / 2, y: top.y - CH / 2 }; sp.pb = { x: bottom.x - CW / 2, y: bottom.y - CH / 2 };
  if (!sp.torn && sp.stretch > TEAR) { sp.torn = true; sp.pop++; buzz(30); }      // torn: two cards, one under each finger
  else if (sp.torn && sp.stretch < TEAR * 0.6) { sp.torn = false; buzz(10); }    // pushed back: one split card again
}
function upSplit() {
  if (sp.torn) { const i = idx(sp.id), [top, bottom] = cards.value[i]!.apps; cards.value.splice(i, 1, { id: top!, apps: [top!] }, { id: bottom!, apps: [bottom!] }); }
  Object.assign(sp, { id: '', torn: false, stretch: 0 });
}
function fingers() {
  const ps = [...pointers.values()];
  return { fa: ps.find((q) => q.card === g.a), fb: ps.find((q) => q.card === g.b) };
}
function move(e: PointerEvent) {
  const pt = pointers.get(e.pointerId); if (!pt) return;
  Object.assign(pt, local(e));
  if (sp.id) { moveSplit(); return; }
  if (!g.active) return;
  const { fa, fb } = fingers();
  if (!g.snapped) {
    if (fa) g.offA = { x: fa.x - fa.sx, y: fa.y - fa.sy };
    if (fb) g.offB = { x: fb.x - fb.sx, y: fb.y - fb.sy };
    // mouse / one finger: the card under the dragged card is the partner
    if (!g.b) { const t = target(); if (t) g.b = t; }
    if (!g.b) return;
    const A = rect(g.a, g.offA), B = rect(g.b, g.offB);
    const ox = Math.max(0, Math.min(A.x + CW, B.x + CW) - Math.max(A.x, B.x)) / CW;
    const oy = Math.max(0, Math.min(A.y + CH, B.y + CH) - Math.max(A.y, B.y)) / CH;
    if (ox * oy >= SNAP_OVERLAP) { // taken from the fingers: one card at the meeting point
      g.snapped = true; g.pop++; buzz(30);
      g.mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
      g.snapDist = fa && fb ? Math.hypot(fa.x - fb.x, fa.y - fb.y) : fa ? Math.hypot(fa.x - (B.x + CW / 2), fa.y - (B.y + CH / 2)) : 0;
    } else if (g.b && !fb && ox * oy === 0 && pointers.size === 1) g.b = '';
  } else {
    const d = fa && fb ? Math.hypot(fa.x - fb.x, fa.y - fb.y) : fa ? Math.hypot(fa.x - (g.mid.x + CW / 2), fa.y - (g.mid.y + CH / 2)) * 2 : 0;
    g.stretch = Math.max(0, d - g.snapDist);
    if (g.stretch > TEAR) { // torn apart: the cards go back under the fingers
      g.snapped = false; g.stretch = 0; buzz(10);
      if (fa) g.offA = { x: fa.x - fa.sx, y: fa.y - fa.sy };
      if (fb) g.offB = { x: fb.x - fb.sx, y: fb.y - fb.sy };
    }
  }
}
function rect(id: string, off: { x: number; y: number }) { const s = slot(idx(id)); return { x: s.x + off.x, y: s.y + off.y }; }
function target() {
  const A = rect(g.a, g.offA);
  return cards.value.find((c, i) => c.id !== g.a && c.apps.length === 1 && Math.abs(slot(i).x - A.x) < CW * 0.8 && Math.abs(slot(i).y - A.y) < CH * 0.8)?.id ?? '';
}
function up(e: PointerEvent) {
  pointers.delete(e.pointerId);
  if (pointers.size) return;
  if (sp.id) { upSplit(); return; }
  if (!g.active) return;
  if (g.snapped) { // keep the pair: one card in the first card's place, the grid reflows
    const i = Math.min(idx(g.a), idx(g.b));
    const top = cards.value[idx(g.a)]!.apps[0]!, bottom = cards.value[idx(g.b)]!.apps[0]!;
    cards.value = cards.value.filter((c) => c.id !== g.a && c.id !== g.b);
    cards.value.splice(i, 0, { id: `${top}+${bottom}`, apps: [top, bottom] });
  }
  Object.assign(g, { active: false, snapped: false, a: '', b: '', stretch: 0, offA: { x: 0, y: 0 }, offB: { x: 0, y: 0 } });
}

function style(c: Card, i: number) {
  const s = slot(i);
  let x = s.x, y = s.y, t = '';
  if (g.active && !g.snapped && c.id === g.a) { x += g.offA.x; y += g.offA.y; t = 'scale(1.03)'; }
  if (g.active && !g.snapped && c.id === g.b) { x += g.offB.x; y += g.offB.y; }
  if (c.id === sp.id) { const k = sp.stretch / TEAR; t = `scale(${1 + 0.35 * k * sp.ax + 0.04 * k}, ${1 + 0.35 * k * sp.ay + 0.04 * k})`; }
  const moving = (g.active && (c.id === g.a || c.id === g.b)) || c.id === sp.id;
  return { left: `${x}px`, top: `${y}px`, width: `${CW}px`, height: `${CH}px`, transform: t, transition: moving ? 'none' : undefined, zIndex: c.id === g.a ? 3 : moving ? 2 : 1 };
}
/** the live merged card: at the meeting point, stretched towards the fingers while they pull apart */
const liveStyle = computed(() => {
  const k = g.stretch / TEAR; // 0..1
  return { left: `${g.mid.x}px`, top: `${g.mid.y}px`, width: `${CW}px`, height: `${CH}px`, transform: `scale(${1 + 0.35 * k}, ${1 - 0.12 * k})` };
});
const hidden = (c: Card) => (g.snapped && (c.id === g.a || c.id === g.b)) || (sp.torn && c.id === sp.id);
const hint = computed(() => (sp.id ? (sp.torn ? 'Release to separate · push back to keep together' : 'Pull apart to separate') : !g.active ? 'Edit mode · pull two cards together' : g.snapped ? (g.stretch > TEAR * 0.5 ? 'Pull further to separate' : 'Release to split · pull apart to cancel') : 'Keep pulling…'));
const liveApps = computed(() => (g.a && g.b ? [cards.value[idx(g.a)]?.apps[0], cards.value[idx(g.b)]?.apps[0]] : []));

let raf = 0;
/** the demo timeline at second k: Mail pulled onto Calendar (0–1.1 s), snap, a little stretch and back, release at 2.5 s */
function demoAt(k: number) {
  if (k >= 2.5) {
    if (g.active || (cards.value[0]!.apps.length < 2 && k < 4.6)) { // (frozen frames start here without the merge)
      Object.assign(g, { active: true, snapped: true, a: 'mail', b: 'calendar' }); pointers.clear(); up({ pointerId: -1 } as PointerEvent);
    }
    // then the opposite: two fingers pull the split card apart (2.8–3.8 s), torn at the limit, released at 4.4 s
    if (k < 2.8) return true;
    if (k >= 4.4) { if (sp.id) upSplit(); return false; }
    const c = centreOf(cards.value[0]!.id), spread = Math.min(1, (k - 2.8) / 1.0) * (TEAR + 70);
    sp.id = cards.value[0]!.id; sp.d0 = 60;
    pointers.clear();
    pointers.set(-2, { card: sp.id, sx: c.x, sy: c.y - 30, x: c.x, y: c.y - 30 - spread / 2 });
    pointers.set(-3, { card: sp.id, sx: c.x, sy: c.y + 30, x: c.x, y: c.y + 30 + spread / 2 });
    moveSplit();
    return true;
  }
  Object.assign(g, { active: true, a: 'mail', b: 'calendar' });
  if (k < 1.1) { const p = k / 1.1; g.snapped = false; g.offA = { x: p * (CW + GAP) * 0.5, y: 0 }; g.offB = { x: -p * (CW + GAP) * 0.5, y: 0 }; return true; }
  if (!g.snapped) { g.snapped = true; g.pop++; buzz(30); g.mid = { x: slot(0).x + (CW + GAP) / 2, y: slot(0).y }; }
  g.stretch = k < 1.5 ? 0 : k < 1.9 ? ((k - 1.5) / 0.4) * TEAR * 0.6 : Math.max(0, TEAR * 0.6 * (1 - (k - 1.9) / 0.3));
  return true;
}
function play() {
  cancelAnimationFrame(raf); reset();
  const t0 = performance.now();
  const step = (t: number) => { if (demoAt((t - t0) / 1000)) raf = requestAnimationFrame(step); };
  raf = requestAnimationFrame(step);
}
function reset() { cancelAnimationFrame(raf); pointers.clear(); cards.value = Object.keys(APPS).map((k) => ({ id: k, apps: [k] })); Object.assign(g, { active: false, snapped: false, a: '', b: '', stretch: 0, offA: { x: 0, y: 0 }, offB: { x: 0, y: 0 } }); }
onMounted(() => { if (props.at !== undefined && props.at !== null && !Number.isNaN(Number(props.at))) demoAt(Number(props.at)); else if (props.autoplay) play(); });
defineExpose({ down, move, up, g, cards, play, reset });
</script>
<template>
  <div class="xm-wrap">
    <div class="xm" role="application" aria-label="Open apps edit mode: two-finger split" @pointermove="move" @pointerup="up" @pointercancel="up">
      <div v-for="(c, i) in cards" v-show="!hidden(c)" :key="c.id" class="xm__c" :class="{ 'xm__c--lit': g.active && (c.id === g.a || c.id === g.b) }" :style="style(c, i)" @pointerdown="down(c.id, $event)">
        <span v-if="c.apps.length === 1" class="xm__t"><HdSquircle :size="44" :color="APPS[c.apps[0]!]!.color" lighting="lit"><HdIcon :name="APPS[c.apps[0]!]!.icon" :size="24" lit /></HdSquircle></span>
        <span v-else class="xm__split"><span v-for="a in c.apps" :key="a" class="xm__pane"><HdSquircle :size="34" :color="APPS[a]!.color" lighting="lit"><HdIcon :name="APPS[a]!.icon" :size="19" lit /></HdSquircle></span><i class="xm__handle" /></span>
        <small>{{ c.apps.map((a) => APPS[a]!.name).join(' + ') }}</small>
      </div>
      <!-- while held past the snap point: one card, the split as it will open -->
      <div v-if="g.snapped" :key="'live' + g.pop" class="xm__c xm__c--live" :style="liveStyle">
        <span class="xm__split"><span v-for="a in liveApps" :key="a" class="xm__pane"><HdSquircle :size="34" :color="APPS[a!]!.color" lighting="lit"><HdIcon :name="APPS[a!]!.icon" :size="19" lit /></HdSquircle></span><i class="xm__handle" /></span>
        <small>{{ liveApps.map((a) => APPS[a!]!.name).join(' + ') }}</small>
      </div>
      <!-- pulled apart past the tear point: two cards, one under each finger -->
      <template v-if="sp.torn"><div v-for="(a, k) in cards[idx(sp.id)]!.apps" :key="'torn' + sp.pop + a" class="xm__c xm__c--live xm__c--torn" :style="{ left: (k ? sp.pb : sp.pa).x + 'px', top: (k ? sp.pb : sp.pa).y + 'px', width: CW + 'px', height: CH + 'px' }">
        <span class="xm__t"><HdSquircle :size="44" :color="APPS[a]!.color" lighting="lit"><HdIcon :name="APPS[a]!.icon" :size="24" lit /></HdSquircle></span><small>{{ APPS[a]!.name }}</small></div></template>
      <p class="xm__hint">{{ hint }}</p>
      <HdTaskEditBar class="xm__bar" close-all-label="Close all" />
    </div>
    <div class="xm-ctl"><button type="button" @click="play">Play the gesture</button><button type="button" @click="reset">Reset</button></div>
  </div>
</template>
<style>
.xm-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.xm { position: relative; width: 360px; height: 640px; background: #000; overflow: hidden; touch-action: none; user-select: none; color: #fff; }
.xm__c { position: absolute; display: flex; flex-direction: column; cursor: grab; transition: left .25s ease-out, top .25s ease-out, transform .2s ease-out; }
.xm__t, .xm__split { flex: 1; display: grid; place-items: center; background: #2E2E30; border: 1px solid #444; }
.xm__c small { position: absolute; left: 0; right: 0; bottom: -22px; text-align: center; font-size: 13px; white-space: nowrap; }
.xm__c--lit .xm__t { border-color: #2A86D8; box-shadow: 0 10px 24px rgba(0,0,0,.7); }
/* the portrait split as it opens: two panes stacked with the home-surface gap and the split-view handle (TabletSplit) */
.xm__split { position: relative; grid-template-rows: 1fr 1fr; gap: 2px; background: #000; place-items: stretch; }
.xm__pane { display: grid; place-items: center; background: #2E2E30; }
.xm__handle { position: absolute; left: 50%; top: 50%; width: 22px; height: 3px; transform: translate(-50%, -50%); border-radius: 999px; background: #fff; opacity: .7; }
.xm__c--live { z-index: 4; transition: transform .08s linear; animation: xm-take .22s cubic-bezier(.3, 1.6, .5, 1); } /* pulled out of the fingers */
.xm__c--torn { transition: none; } .xm__c--torn .xm__t { border: 2px solid #2A86D8; box-shadow: 0 12px 28px rgba(0,0,0,.8); }
.xm__c--live .xm__split { border: 2px solid #2A86D8; box-shadow: 0 12px 28px rgba(0,0,0,.8); }
@keyframes xm-take { 0% { scale: 1.12; } 60% { scale: .94; } 100% { scale: 1; } }
.xm__hint { position: absolute; left: 0; right: 0; top: 430px; margin: 0; text-align: center; font-size: 13px; color: #6CB6FF; }
.xm__bar { position: absolute; left: 0; right: 0; bottom: 0; }
.xm-ctl { display: flex; gap: 8px; } .xm-ctl button { font: inherit; padding: 6px 12px; }
</style>
