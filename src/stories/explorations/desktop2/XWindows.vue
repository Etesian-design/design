<script setup lang="ts">
/**
 * Windows view (Super+Tab): only the open windows, as live cards, like the phone's Open apps view. While Super is held,
 * the mouse wheel zooms between the phone's levels: 1 = one large card at a time (carousel), then 2, 3, 4 per row.
 * Ctrl/Super + pinch on a touchpad does the same (browsers deliver a pinch as a wheel event with ctrlKey).
 * Each card keeps its window's exact aspect ratio; cards keep the card radius (not squircles); the app badge is a squircle.
 */
import { computed } from 'vue';
import HdSquircle from '../../../components/HdSquircle.vue';
import HdIcon from '../../../components/HdIcon.vue';
import XMiniApp from '../parts/XMiniApp.vue';
import { app as appOf } from '../parts/data';
import { chromeOf } from './chrome';
import { SCREEN, BAR_H, OPEN_WINDOWS, ZOOM_LEVELS, zoomStep, fitInto, type OpenWin, type ZoomLevel } from './geometry';
const props = withDefaults(defineProps<{ level?: ZoomLevel; selected?: number; left?: number; windows?: OpenWin[] }>(), { level: 3, selected: 0, left: 0, windows: () => OPEN_WINDOWS });
const emit = defineEmits<{ 'update:level': [l: ZoomLevel]; 'update:selected': [i: number]; open: [app: string]; zoom: [] }>();
const W = SCREEN.w, H = SCREEN.h - BAR_H, TOP = 76, TITLE = 34, PAD = 56;
interface Card { app: string; title: string; x: number; y: number; w: number; h: number; s: number; ow: number; oh: number; side: number }
const cards = computed<Card[]>(() => {
  const n = props.level, x0 = props.left + PAD, avail = W - x0 - PAD;
  const title = (a: string) => chromeOf(a).title;
  if (n === 1) {
    const ch = H - TOP - TITLE - 90, cw = Math.min(Math.round(ch * 1.5), avail - 420);
    const cx = x0 + avail / 2, G = 64;
    const fits = props.windows.map((o) => fitInto(o.w, o.h, cw, ch));
    const xs: number[] = [];
    const sel = Math.min(props.selected, fits.length - 1);
    xs[sel] = cx - fits[sel]!.w / 2;
    for (let i = sel + 1; i < fits.length; i++) xs[i] = xs[i - 1]! + fits[i - 1]!.w + G;
    for (let i = sel - 1; i >= 0; i--) xs[i] = xs[i + 1]! - G - fits[i]!.w;
    return props.windows.map((o, i) => {
      const f = fits[i]!;
      return { app: o.app, title: title(o.app), x: Math.round(xs[i]!), y: TOP + (ch - f.h), w: f.w, h: f.h, s: f.s, ow: o.w, oh: o.h, side: i - sel };
    });
  }
  const gap = n === 2 ? 40 : n === 3 ? 32 : 26;
  const cw = (avail - gap * (n - 1)) / n, ch = Math.round(cw * 0.62);
  return props.windows.map((o, i) => {
    const c = i % n, r = Math.floor(i / n), f = fitInto(o.w, o.h, cw, ch);
    return { app: o.app, title: title(o.app), x: Math.round(x0 + c * (cw + gap) + (cw - f.w) / 2), y: TOP + r * (ch + TITLE + gap) + (ch - f.h), w: f.w, h: f.h, s: f.s, ow: o.w, oh: o.h, side: 0 };
  });
});
function onWheel(e: WheelEvent) {
  if (e.metaKey || e.ctrlKey) { e.preventDefault(); emit('zoom'); const l = zoomStep(props.level, e.deltaY); if (l !== props.level) emit('update:level', l); }
  else if (props.level === 1 && e.deltaY) emit('update:selected', Math.min(props.windows.length - 1, Math.max(0, props.selected + (e.deltaY > 0 ? 1 : -1))));
}
const LEVEL_LABEL: Record<ZoomLevel, string> = { 1: 'One at a time', 2: '2 per row', 3: '3 per row', 4: '4 per row' };
</script>
<template>
  <div class="x-wins hd-on-home" :class="`x-wins--${level}`" role="dialog" aria-label="Windows" @wheel="onWheel">
    <header class="x-wins__head" :style="{ left: `${left + PAD}px` }">
      <h2 class="x-wins__h">Windows</h2>
      <span class="x-wins__n">{{ windows.length }} open · {{ LEVEL_LABEL[level] }}</span>
      <span class="x-wins__zoom" role="radiogroup" aria-label="Zoom level (Super + wheel)">
        <button v-for="l in ZOOM_LEVELS" :key="l" type="button" role="radio" class="x-wins__z hd-sq hd-focusable" :class="{ 'is-on': l === level }" :aria-checked="l === level ? 'true' : 'false'" :aria-label="LEVEL_LABEL[l]" @click="emit('update:level', l)">
          <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><rect v-for="k in l" :key="k" :x="l === 1 ? 4 : (k - 1) * (20 / l) + 0.5" :y="l === 1 ? 1 : 3" :width="l === 1 ? 12 : 20 / l - 1.5" :height="l === 1 ? 12 : 8" rx="1.5" fill="currentColor" /></svg>
        </button>
      </span>
    </header>
    <button v-for="(c, i) in cards" :key="c.app" type="button" class="x-wins__card hd-focusable" :class="{ 'is-sel': i === selected, 'is-side': level === 1 && c.side !== 0 }"
      :style="{ left: `${c.x}px`, top: `${c.y}px`, width: `${c.w}px` }" :aria-label="`${c.title} – ${c.app}`" :aria-current="i === selected ? 'true' : undefined" @click="emit('open', c.app)" @mouseenter="emit('update:selected', i)">
      <span class="x-wins__prev" :style="{ height: `${c.h}px` }">
        <span class="x-wins__live" inert :style="{ width: `${c.ow}px`, height: `${c.oh}px`, transform: `scale(${c.s})` }"><XMiniApp :name="c.app" chrome="headerbar" density="pointer" :hints="false" :id-prefix="`xw2-${c.app}`" /></span>
      </span>
      <span class="x-wins__t">
        <HdSquircle :size="20" :color="appOf(c.app).color" lighting="lit" :tone="appOf(c.app).tone"><HdIcon :name="appOf(c.app).icon" :size="12" :lit="true" /></HdSquircle>
        <span>{{ c.app }}</span><small>{{ c.title }}</small>
      </span>
    </button>
  </div>
</template>
<style>
.x-wins { position: absolute; inset: 0; z-index: 35; overflow: hidden; color: var(--hd-c-fg); background: color-mix(in srgb, var(--hd-surface-home) 86%, transparent); -webkit-backdrop-filter: blur(22px); backdrop-filter: blur(22px);
}
.x-wins__head { position: absolute; top: 20px; right: 56px; display: flex; align-items: center; gap: 16px; }
.x-wins__h { margin: 0; font: var(--hd-font-weight-light) 36px/1 var(--hd-font-family-light); }
.x-wins__n { flex: 1; font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-wins__zoom { display: inline-flex; gap: 2px; }
.x-wins__z { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; padding: 0; border: 0; color: var(--hd-c-fg-secondary); cursor: pointer; --hd-sq-size: 34px; }
.x-wins__z:hover { --hd-sq-fill: var(--hd-c-pressed); }
.x-wins__z.is-on { --hd-sq-fill: linear-gradient(color-mix(in srgb, var(--hd-accent) 75%, #fff), var(--hd-accent)); color: #fff; }
.x-wins__z svg { position: relative; }
.x-wins__card { position: absolute; display: flex; flex-direction: column; gap: 10px; padding: 0; border: 0; background: none; color: inherit; text-align: left; cursor: pointer;
  transition: left var(--hd-motion-duration-slow) var(--hd-motion-easing-out), top var(--hd-motion-duration-slow) var(--hd-motion-easing-out), width var(--hd-motion-duration-slow) var(--hd-motion-easing-out), opacity var(--hd-motion-duration-slow); }
.x-wins__prev { position: relative; display: block; width: 100%; overflow: hidden; border-radius: var(--hd-radius-card); background: var(--hd-c-bg); box-shadow: 0 0 0 1px var(--hd-c-divider), 0 8px 26px rgba(0,0,0,.35); transition: transform var(--hd-motion-duration-fast) var(--hd-motion-easing-out); }
.x-wins__card:hover .x-wins__prev { transform: scale(1.015); }
.x-wins__card.is-sel .x-wins__prev { box-shadow: 0 0 0 3px var(--hd-accent), 0 10px 30px rgba(0,0,0,.4); }
.x-wins__card.is-side { opacity: .5; }
.x-wins__live { position: absolute; left: 0; top: 0; display: flex; transform-origin: 0 0; pointer-events: none; background: var(--hd-c-bg); color: var(--hd-c-fg); }
.x-wins__t { display: flex; align-items: center; gap: 8px; min-width: 0; height: 24px; font: 700 var(--hd-font-size-small)/1 var(--hd-font-family-base); white-space: nowrap; }
.x-wins__t small { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-weight: 400; color: var(--hd-c-fg-secondary); }
.x-wins--1 .x-wins__t { justify-content: center; font-size: var(--hd-font-size-default); }
</style>
