<script setup lang="ts">
/**
 * Looping demos for the Motion guide page. Each kind steps through a short timeline of states; every movement is a CSS
 * transition on the real motion tokens (--hd-motion-duration-*, --hd-motion-easing-*), so the demo shows the values
 * the components use. Reduced motion: the transitions collapse, as the guide asks.
 */
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

export type MotionKind = 'easings' | 'drill' | 'sheet' | 'dialog' | 'info' | 'card' | 'minimise' | 'close' | 'launch' | 'restore' | 'unlock';
const props = defineProps<{ kind: MotionKind }>();

/** each step: the state to enter and how long to stay in it (ms) */
const TIMELINES: Record<MotionKind, [string, number][]> = {
  easings: [['start', 700], ['end', 1400]],
  drill: [['list', 900], ['page', 1500], ['list', 900]],
  sheet: [['closed', 900], ['open', 1500], ['closed', 900]],
  dialog: [['closed', 900], ['open', 1500], ['closed', 900]],
  info: [['hidden', 800], ['shown', 3000], ['gone', 900]],
  card: [['hidden', 900], ['shown', 1800], ['dismissed', 900]],
  minimise: [['app', 1000], ['drag', 450], ['home', 1500]],
  close: [['app', 1000], ['drag', 450], ['closed', 1500]],
  launch: [['home', 700], ['loading', 900], ['app', 1600]],
  restore: [['out', 300], ['home', 900], ['app', 1600]],
  unlock: [['lock', 1100], ['open', 1600]],
};
const CAPTIONS: Record<MotionKind, string> = {
  easings: 'Out (entering), In (dismissing), In-out (moving), over the slow duration',
  drill: 'Drill-down: in from the right, Back out to the right (slow, 350ms)',
  sheet: 'Sheet: up from the bottom, down to dismiss (slow)',
  dialog: 'Dialog: fades in with a slight scale from 0.9 (default, 200ms)',
  info: 'Info banner: scales in (200ms, out), stays 3s, leaves (in)',
  card: 'A notification over an app: the lock-screen card under the status bar; swipe up dismisses',
  minimise: 'Edge swipe: the app slides off, home brightens and zooms in behind it',
  close: 'Swipe down from the top: the app follows the finger down and fades',
  launch: 'Launch: a ring runs round the icon until the app has drawn, then it slides in (fast, 130ms)',
  restore: 'Restore: the app comes back from the side it was swiped out to',
  unlock: 'Lock screen: swipe sideways to unlock',
};

const state = ref(TIMELINES[props.kind][0][0]);
let timer = 0, i = 0;
function step() {
  const tl = TIMELINES[props.kind];
  state.value = tl[i][0];
  timer = window.setTimeout(() => { i = (i + 1) % tl.length; step(); }, tl[i][1]);
}
onMounted(step);
onBeforeUnmount(() => window.clearTimeout(timer));
const caption = computed(() => CAPTIONS[props.kind]);
const ICONS = ['#62B700', '#09A7CC', '#0067BC', '#EF5500', '#821DDE', '#CC09BA', '#F2B111', '#4591FF'];
</script>

<template>
  <figure class="md" :data-kind="kind" :data-state="state">
    <div v-if="kind === 'easings'" class="md-ease">
      <div v-for="e in ['out', 'in', 'in-out']" :key="e" class="md-ease__row"><span>{{ e }}</span><i class="md-ease__dot hd-squircle" :class="`is-${e}`" /></div>
    </div>
    <div v-else class="md-phone">
      <div class="md-sb"><span>12:45</span></div>
      <!-- home (behind apps) -->
      <div class="md-home" :class="{ 'is-dim': ['app', 'drag', 'closed-app'].includes(state) && ['minimise', 'restore', 'launch', 'close'].includes(kind) }">
        <span v-for="(c, n) in ICONS" :key="n" class="md-icon hd-squircle" :class="{ 'is-target': n === 1 }" :style="{ background: c }">
          <svg v-if="n === 1 && kind === 'launch'" class="md-ring" viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="13" /></svg>
        </span>
      </div>
      <!-- an app page -->
      <div v-if="['drill', 'sheet', 'dialog', 'info', 'card'].includes(kind)" class="md-app">
        <div class="md-head">Mail</div>
        <div v-for="n in 5" :key="n" class="md-row"><b /><i /></div>
        <div class="md-tb" />
      </div>
      <div v-if="kind === 'drill'" class="md-app md-page"><div class="md-head md-head--plain">Message</div><div v-for="n in 3" :key="n" class="md-row"><i /><i /></div><div class="md-tb"><span class="md-back hd-squircle" /></div></div>
      <div v-if="kind === 'sheet'" class="md-sheet"><div class="md-sheet__bar"><span>Cancel</span><b>New</b><span>Done</span></div><div class="md-field hd-sqm" /><div class="md-field hd-sqm" /></div>
      <template v-if="kind === 'dialog'"><div class="md-scrim" /><div class="md-dialog"><b>Delete message?</b><span class="md-btn hd-sqf">Delete</span><span class="md-btn hd-sqf">Cancel</span></div></template>
      <div v-if="kind === 'info'" class="md-info">Message sent</div>
      <div v-if="kind === 'card'" class="md-card"><span class="md-icon hd-squircle" style="background:#09A7CC" /><span><b>Anna</b><i>Lunch on Friday?</i></span></div>
      <div v-if="['minimise', 'close', 'launch', 'restore'].includes(kind)" class="md-app md-run"><div class="md-head" style="background:#09A7CC">Messages</div><div v-for="n in 5" :key="n" class="md-row"><b /><i /></div><div class="md-tb" /></div>
      <div v-if="kind === 'unlock'" class="md-lock"><span class="md-lock__clock">12:45</span><span class="md-lock__date">Sunday, 1 November</span><span class="md-lock__hint">Swipe sideways to unlock</span></div>
      <span v-if="['minimise', 'unlock'].includes(kind)" class="md-finger md-finger--side" />
      <span v-if="kind === 'close'" class="md-finger md-finger--down" />
      <span v-if="kind === 'card'" class="md-finger md-finger--up" />
    </div>
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.md { --o: var(--hd-motion-easing-out); --in: var(--hd-motion-easing-in); --io: var(--hd-motion-easing-in-out);
  --slow: var(--hd-motion-duration-slow); --def: var(--hd-motion-duration-default); --fast: var(--hd-motion-duration-fast);
  display: inline-flex; flex-direction: column; align-items: center; gap: 8px; width: 200px; margin: 0; vertical-align: top; }
figcaption { font: 400 12px/1.4 var(--hd-font-family-base); color: var(--hd-c-fg-secondary, #505050); text-align: center; min-height: 3em; }
.md-phone { position: relative; width: 160px; height: 284px; overflow: hidden; border-radius: 10px; background: #000; box-shadow: 0 0 0 4px #1a1a1a; font-family: var(--hd-font-family-base); }
.md-sb { position: absolute; z-index: 9; inset: 0 0 auto; height: 14px; padding: 0 6px; background: #000; color: #fff; font-size: 8px; line-height: 14px; text-align: right; }
.md-home { position: absolute; inset: 14px 0 0; display: grid; grid-template-columns: repeat(4, 1fr); align-content: start; gap: 12px 6px; padding: 16px 10px; transition: filter var(--slow) var(--o), transform var(--slow) var(--o); }
.md-home.is-dim { filter: brightness(.25); transform: scale(.92); }
.md-icon { position: relative; width: 28px; height: 28px; justify-self: center; }
.md-ring { position: absolute; inset: -6px; width: 40px; height: 40px; fill: none; stroke: #fff; stroke-width: 2; stroke-dasharray: 120; stroke-dashoffset: 120; opacity: 0; }
.md-app { position: absolute; inset: 14px 0 0; background: #E0E1E2; border-radius: 4px 4px 0 0; display: flex; flex-direction: column; }
.md-head { height: 30px; padding: 0 8px; background: #0067BC; color: #fff; font: 300 13px/30px var(--hd-font-family-base); }
.md-head--plain { background: #E0E1E2; color: #282828; }
.md-row { display: flex; flex-direction: column; gap: 3px; padding: 7px 8px; border-bottom: 1px solid rgba(0,0,0,.08); }
.md-row b, .md-row i { display: block; height: 6px; border-radius: 3px; background: #282828; width: 70%; } .md-row i { background: #9a9a9c; width: 45%; }
.md-tb { margin-top: auto; height: 24px; background: linear-gradient(#D6D6D8, #ADADB0); display: flex; align-items: center; padding: 0 8px; }
.md-back { width: 14px; height: 14px; background: #fff; }
/* drill-down */
.md-page { transform: translateX(100%); transition: transform var(--slow) var(--in); }
[data-state='page'] .md-page { transform: none; transition-timing-function: var(--o); }
/* sheet */
.md-sheet { position: absolute; inset: 40px 0 0; background: #E0E1E2; transform: translateY(100%); transition: transform var(--slow) var(--in); }
[data-state='open'] .md-sheet { transform: none; transition-timing-function: var(--o); }
.md-sheet__bar { display: flex; justify-content: space-between; align-items: center; height: 28px; padding: 0 6px; background: linear-gradient(#3A3A3A, #141414); color: #fff; font: 700 8px/1 var(--hd-font-family-base); }
.md-field { height: 22px; margin: 10px 8px 0; background: #fff; border-radius: 4px; }
/* dialog */
.md-scrim { position: absolute; inset: 0; background: rgba(0,0,0,.88); opacity: 0; transition: opacity var(--def) var(--o); }
.md-dialog { position: absolute; inset: 70px 14px auto; display: flex; flex-direction: column; gap: 6px; color: #fff; text-align: center; font: 300 11px/1.3 var(--hd-font-family-base); opacity: 0; transform: scale(.9); transition: opacity var(--def) var(--o), transform var(--def) var(--o); }
.md-btn { padding: 6px; --hd-sqf-h: 21px; --hd-sqf-edge: #393839; --hd-sqf-fill: linear-gradient(#1C1C1C, #080808); font-weight: 700; font-size: 9px; }
[data-state='open'] .md-scrim { opacity: 1; } [data-state='open'] .md-dialog { opacity: 1; transform: none; }
/* info banner */
.md-info { position: absolute; left: 12px; right: 12px; top: 120px; padding: 10px; border-radius: 6px; background: rgba(20,20,20,.92); color: #fff; font: 300 11px/1 var(--hd-font-family-base); text-align: center; transform: scale(0); transition: transform var(--def) var(--in); }
[data-state='shown'] .md-info { transform: scale(1); transition-timing-function: var(--o); }
/* notification card over an app */
.md-card { position: absolute; left: 6px; right: 6px; top: 18px; z-index: 5; display: flex; gap: 8px; align-items: center; padding: 8px; border-radius: 8px; background: rgba(12,15,18,.92); color: #fff; font: 400 9px/1.3 var(--hd-font-family-base); opacity: 0; transform: translateY(-8px); transition: opacity var(--def) var(--o), transform var(--def) var(--o); }
.md-card span:last-child { display: flex; flex-direction: column; } .md-card i { font-style: normal; font-size: 11px; }
[data-state='shown'] .md-card { opacity: 1; transform: none; }
[data-state='dismissed'] .md-card { opacity: 0; transform: translateY(-60px); transition: opacity var(--def) var(--in), transform var(--def) var(--in); }
/* running app: minimise, close, launch, restore */
.md-run { transition: transform var(--slow) var(--o), opacity var(--slow) var(--o); }
[data-kind='minimise'][data-state='drag'] .md-run { transform: translateX(35%); transition-timing-function: linear; }
[data-kind='minimise'][data-state='home'] .md-run { transform: translateX(105%); }
[data-kind='close'][data-state='drag'] .md-run { transform: translateY(25%); transition-timing-function: linear; }
[data-kind='close'][data-state='closed'] .md-run { transform: translateY(70%); opacity: 0; }
[data-kind='launch'] .md-run { transform: translateX(105%); transition: none; }
[data-kind='launch'][data-state='app'] .md-run { transform: none; transition: transform var(--fast) var(--o); }
[data-kind='launch'][data-state='loading'] .md-ring { opacity: 1; stroke-dashoffset: 0; transition: stroke-dashoffset 900ms linear; }
[data-kind='launch'][data-state='app'] .md-home, [data-kind='restore'][data-state='app'] .md-home { filter: brightness(.25); transform: scale(.92); }
[data-kind='restore'][data-state='out'] .md-run, [data-kind='restore'][data-state='home'] .md-run { transform: translateX(105%); transition: none; }
[data-kind='restore'][data-state='app'] .md-run { transform: none; transition: transform var(--slow) var(--o); }
/* lock screen */
.md-lock { position: absolute; inset: 14px 0 0; z-index: 4; display: flex; flex-direction: column; align-items: flex-end; padding: 18px 10px; background: linear-gradient(#0f3b4a, #04141a); color: #fff; transition: transform var(--slow) var(--o); }
.md-lock__clock { font: 200 38px/1 var(--hd-font-family-light); } .md-lock__date { font: 300 9px/2 var(--hd-font-family-base); }
.md-lock__hint { margin-top: auto; align-self: center; font: 400 8px/1 var(--hd-font-family-base); opacity: .7; }
[data-kind='unlock'][data-state='open'] .md-lock { transform: translateX(105%); }
/* the finger */
.md-finger { position: absolute; z-index: 10; width: 18px; height: 18px; border-radius: 50%; background: rgba(255,255,255,.55); box-shadow: 0 0 0 3px rgba(255,255,255,.25); opacity: 0; transition: transform 450ms linear, opacity 150ms; }
.md-finger--side { left: 2px; top: 140px; } .md-finger--down { left: 70px; top: 4px; } .md-finger--up { left: 70px; top: 40px; }
[data-kind='minimise'][data-state='drag'] .md-finger { opacity: 1; transform: translateX(60px); }
[data-kind='close'][data-state='drag'] .md-finger { opacity: 1; transform: translateY(70px); }
[data-kind='unlock'][data-state='lock'] .md-finger { opacity: 1; transform: translateX(0); transition: opacity 150ms 700ms; }
[data-kind='unlock'][data-state='open'] .md-finger { opacity: 0; transform: translateX(120px); }
[data-kind='card'][data-state='dismissed'] .md-finger { opacity: 1; transform: translateY(-40px); }
/* easing curves */
.md-ease { display: flex; flex-direction: column; gap: 14px; width: 200px; padding: 16px 12px; border-radius: 10px; background: #000; }
.md-ease__row { position: relative; display: flex; align-items: center; height: 24px; color: #8C8C8C; font: 700 9px/1 var(--hd-font-family-base); text-transform: uppercase; }
.md-ease__row span { width: 44px; }
.md-ease__dot { position: absolute; left: 44px; width: 20px; height: 20px; background: #4591FF; transition: transform var(--slow); }
.md-ease__dot.is-out { transition-timing-function: var(--o); } .md-ease__dot.is-in { transition-timing-function: var(--in); } .md-ease__dot.is-in-out { transition-timing-function: var(--io); }
[data-state='end'] .md-ease__dot { transform: translateX(112px); }
@media (prefers-reduced-motion: reduce) { .md * { transition-duration: 1ms !important; } }
</style>
