<script setup lang="ts">
/**
 * The Belle gear clock's dial (belle-ref11): a charcoal face lit from above in a thin metal rim, layered fine-toothed gears with
 * spoked and round cut-outs behind the hands (they turn with the seconds), twelve short ticks on the face, tapered metal hour and
 * minute hands, a thin light second hand with a counterweight, the day in a dark round window low on the left and the date in a
 * small bubble at 3 o'clock. Drawn on a 200 grid; it fills its box (keep the box square). The time comes in as numbers.
 */
import { computed, useId } from 'vue';
const props = withDefaults(defineProps<{ h: number; m: number; s?: number; day?: string; date?: number | string }>(), { s: 0, day: '', date: '' });
const id = useId();
/** a gear: toothed rim (trapezoid teeth), then spoke windows (or round holes) between rim and hub, for an even-odd fill */
function gear(cx: number, cy: number, r: number, teeth: number, depth: number, holes: number, holeR: number, hub: number): string {
  const ri = r - depth, P = (a: number, rr: number) => `${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`;
  const st = (Math.PI * 2) / teeth, pts: string[] = [];
  for (let i = 0; i < teeth; i++) { const a = i * st; pts.push(P(a, ri), P(a + st * 0.12, r), P(a + st * 0.42, r), P(a + st * 0.54, ri)); }
  let d = `M${pts.join('L')}Z`;
  const ro = ri - r * 0.1;
  for (let i = 0; i < holes; i++) {
    const a0 = (i / holes) * Math.PI * 2 + 0.22, a1 = ((i + 1) / holes) * Math.PI * 2 - 0.22, mid = (a0 + a1) / 2, rm = (ro + hub) / 2;
    d += holeR
      ? `M${P(mid, rm + holeR)}A${holeR} ${holeR} 0 1 0 ${P(mid, rm - holeR)}A${holeR} ${holeR} 0 1 0 ${P(mid, rm + holeR)}Z`
      : `M${P(a0, ro)}A${ro} ${ro} 0 0 1 ${P(a1, ro)}L${P(a1 - 0.08, hub)}A${hub} ${hub} 0 0 0 ${P(a0 + 0.08, hub)}Z`;
  }
  return d;
}
/* x, y, radius, teeth, tooth depth, spokes, round hole radius, hub, shade (0 light .. 2 dark); the centre one last, over the others */
const GEARS = [[128, 62, 32, 40, 3.2, 5, 0, 12, 1], [152, 112, 22, 26, 2.6, 3, 4.2, 7, 1], [66, 66, 34, 36, 3, 0, 0, 10, 2], [104, 160, 34, 34, 3, 4, 0, 10, 2], [100, 100, 36, 58, 2.2, 6, 0, 11, 0]]
  .map(([x, y, r, t, dp, ho, hr, hub, sh]) => ({ x: x!, y: y!, r: r!, hub: hub!, sh: sh!, d: gear(x!, y!, r!, t!, dp!, ho!, hr!, hub!) }));
const SHADES = [['#46474b', '#2a2b2e'], ['#3a3b3f', '#232427'], ['#313236', '#1d1e21']];
const sec = computed(() => props.s * 6);
const min = computed(() => props.m * 6 + props.s * 0.1);
const hour = computed(() => (props.h % 12) * 30 + props.m * 0.5);
/** neighbouring gears turn the other way, the small ones faster */
const turn = (g: { x: number; y: number; r: number }, i: number) => `rotate(${((i % 2 ? -1 : 1) * sec.value * 20) / g.r} ${g.x} ${g.y})`;
</script>
<template>
  <svg class="bw-geardial" viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <radialGradient :id="`${id}f`" cx=".5" cy=".3" r=".75"><stop offset="0" stop-color="#3e3f43" /><stop offset=".75" stop-color="#2a2b2e" /><stop offset="1" stop-color="#18181a" /></radialGradient>
      <linearGradient :id="`${id}b`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c5d62" /><stop offset=".5" stop-color="#2b2c30" /><stop offset="1" stop-color="#3d3e42" /></linearGradient>
      <linearGradient v-for="(c, i) in SHADES" :id="`${id}m${i}`" :key="i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" :stop-color="c[0]" /><stop offset="1" :stop-color="c[1]" /></linearGradient>
      <linearGradient :id="`${id}h`" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" /><stop offset=".5" stop-color="#f4f4f5" /><stop offset=".51" stop-color="#c9cacd" /><stop offset="1" stop-color="#e2e3e5" /></linearGradient>
      <radialGradient :id="`${id}c`" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#e8e9eb" /><stop offset=".6" stop-color="#9a9ba0" /><stop offset="1" stop-color="#55565a" /></radialGradient>
      <filter :id="`${id}s`" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.6" stdDeviation="1.4" flood-color="#000" flood-opacity=".75" /></filter>
      <filter :id="`${id}v`"><feGaussianBlur stdDeviation="3" /></filter>
      <clipPath :id="`${id}k`"><circle cx="100" cy="100" r="95" /></clipPath>
    </defs>
    <circle cx="100" cy="100" r="98" :fill="`url(#${id}b)`" />
    <circle cx="100" cy="100" r="95.5" :fill="`url(#${id}f)`" stroke="#0b0b0c" />
    <g :clip-path="`url(#${id}k)`">
      <g v-for="(g, i) in GEARS" :key="i" :filter="`url(#${id}s)`">
        <g :transform="turn(g, i)">
          <path :d="g.d" :fill="`url(#${id}m${g.sh})`" fill-rule="evenodd" stroke="#111214" stroke-width=".5" />
          <circle :cx="g.x" :cy="g.y" :r="g.r - 4.2" fill="none" stroke="rgba(255,255,255,.08)" stroke-width=".7" />
        </g>
        <circle :cx="g.x" :cy="g.y" :r="g.hub" :fill="`url(#${id}m${g.sh})`" stroke="#111214" stroke-width=".5" />
        <circle :cx="g.x" :cy="g.y" :r="g.hub * 0.45" fill="#18191b" />
      </g>
      <!-- the face is recessed: the rim's shadow darkens its edge -->
      <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="14" :filter="`url(#${id}v)`" />
    </g>
    <line v-for="i in 12" :key="i" x1="100" y1="8" x2="100" y2="13" stroke="#8e8f93" stroke-width="1.4" stroke-linecap="round" :transform="`rotate(${i * 30} 100 100)`" />
    <template v-if="day">
      <circle cx="60" cy="122" r="15" fill="#161618" stroke="#0a0a0b" />
      <text x="60" y="126" text-anchor="middle" font-size="10" fill="#c9cacd" class="bw-geardial__t">{{ day }}</text>
    </template>
    <template v-if="date !== ''">
      <circle cx="174" cy="100" r="8.5" fill="#0d0d0e" stroke="#2c2d30" stroke-width=".7" />
      <text x="174" y="103.6" text-anchor="middle" font-size="10" fill="#e8e8ea" class="bw-geardial__t">{{ date }}</text>
    </template>
    <g :filter="`url(#${id}s)`">
      <path d="M97.4 100 L98.6 52 L100 46 L101.4 52 L102.6 100 Z" :fill="`url(#${id}h)`" :transform="`rotate(${hour} 100 100)`" />
      <path d="M97.9 100 L99 26 L100 20 L101 26 L102.1 100 Z" :fill="`url(#${id}h)`" :transform="`rotate(${min} 100 100)`" />
      <g :transform="`rotate(${sec} 100 100)`"><line x1="100" y1="122" x2="100" y2="16" stroke="#d5d6d9" stroke-width=".9" /><rect x="98.6" y="112" width="2.8" height="10" rx="1.2" fill="#c9cacd" /></g>
    </g>
    <circle cx="100" cy="100" r="7" :fill="`url(#${id}c)`" stroke="#2a2b2e" stroke-width=".6" :filter="`url(#${id}s)`" />
    <circle cx="100" cy="100" r="2.4" fill="#6a6b70" />
  </svg>
</template>
<style>
.bw-geardial { display: block; width: 100%; height: 100%; }
.bw-geardial__t { font-family: var(--hd-font-family-base, sans-serif); }
</style>
