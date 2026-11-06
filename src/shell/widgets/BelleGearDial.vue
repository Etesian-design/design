<script setup lang="ts">
/**
 * The Belle gear clock's dial (belle-ref11): a skeleton dial. A wide light bezel with oval ticks round a face plate that is
 * mostly solid, with an S-shaped bridge carrying the hands; through openings cut in the plate (a large one on the right, a
 * crescent top left, a round window on the left, the hole round the centre) the movement shows in a dark recess: flat,
 * low-contrast toothed gears (one with three spokes) that turn with the seconds. The plate casts a soft shadow into the
 * recess. Broad tapered metal hands, a thin light second hand, a silver cap; the day in a dark disc low on the left, the date
 * in a dark rounded square at 3 o'clock. Drawn on a 200 grid; it fills its box (keep it square).
 */
import { computed, useId } from 'vue';
const props = withDefaults(defineProps<{ h: number; m: number; s?: number; day?: string; date?: number | string }>(), { s: 0, day: '', date: '' });
const id = useId();
/** a gear: toothed rim (trapezoid teeth), then spoke windows between rim and hub, for an even-odd fill */
function gear(cx: number, cy: number, r: number, teeth: number, depth: number, spokes: number, hub: number): string {
  const ri = r - depth, P = (a: number, rr: number) => `${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`;
  const st = (Math.PI * 2) / teeth, pts: string[] = [];
  for (let i = 0; i < teeth; i++) { const a = i * st; pts.push(P(a, ri), P(a + st * 0.12, r), P(a + st * 0.42, r), P(a + st * 0.54, ri)); }
  let d = `M${pts.join('L')}Z`;
  const ro = ri - r * 0.12, rh = hub * 1.6;
  for (let i = 0; i < spokes; i++) {
    const a0 = (i / spokes) * Math.PI * 2 + 0.3, a1 = ((i + 1) / spokes) * Math.PI * 2 - 0.3;
    d += `M${P(a0, ro)}A${ro} ${ro} 0 0 1 ${P(a1, ro)}L${P(a1 - 0.12, rh)}A${rh} ${rh} 0 0 0 ${P(a0 + 0.12, rh)}Z`;
  }
  return d;
}
/* x, y, radius, teeth, tooth depth, spokes, hub */
const GEARS = [[124, 62, 22, 30, 2.2, 0, 6], [153, 92, 33, 40, 2.6, 3, 7], [100, 100, 21, 36, 1.8, 0, 6], [42, 103, 13, 18, 1.8, 0, 4], [106, 157, 22, 28, 2, 0, 8]]
  .map(([x, y, r, t, dp, sp, hub]) => ({ x: x!, y: y!, r: r!, hub: hub!, spokes: sp!, d: gear(x!, y!, r!, t!, dp!, sp!, hub!) }));
/* the plate's openings: the right one bounded by the S of the bridge, and the crescent top left */
const RIGHT = 'M96 0 C97 22 86 36 94 52 C104 68 124 78 124 100 C124 122 104 132 97 146 C92 158 99 172 104 200 L200 200 L200 0 Z';
const CRESCENT = 'M35 77 C40 60 58 44 83 36 C80 50 84 62 98 70 C90 74 80 76 72 77 Z';
const sec = computed(() => props.s * 6);
const min = computed(() => props.m * 6 + props.s * 0.1);
const hour = computed(() => (props.h % 12) * 30 + props.m * 0.5);
/** neighbouring gears turn the other way, the small ones faster */
const turn = (g: { x: number; y: number; r: number }, i: number) => `rotate(${((i % 2 ? -1 : 1) * sec.value * 20) / g.r} ${g.x} ${g.y})`;
const u = (n: string) => `url(#${id}${n})`;
</script>
<template>
  <svg class="bw-geardial" viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <linearGradient :id="`${id}bz`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46474a" /><stop offset=".5" stop-color="#36373a" /><stop offset="1" stop-color="#303134" /></linearGradient>
      <radialGradient :id="`${id}pl`" cx=".5" cy=".25" r=".8"><stop offset="0" stop-color="#3a3b3e" /><stop offset="1" stop-color="#2f3033" /></radialGradient>
      <linearGradient :id="`${id}gm`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f4043" /><stop offset="1" stop-color="#333437" /></linearGradient>
      <linearGradient :id="`${id}hd`" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" /><stop offset=".5" stop-color="#f2f2f3" /><stop offset=".51" stop-color="#cfd0d2" /><stop offset="1" stop-color="#e4e4e6" /></linearGradient>
      <radialGradient :id="`${id}cp`" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f0f0f2" /><stop offset=".6" stop-color="#a5a6aa" /><stop offset="1" stop-color="#5a5b5f" /></radialGradient>
      <filter :id="`${id}ps`" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#000" flood-opacity=".7" /></filter>
      <filter :id="`${id}hs`"><feDropShadow dx="0" dy="1.2" stdDeviation="1" flood-color="#000" flood-opacity=".6" /></filter>
      <clipPath :id="`${id}in`"><circle cx="100" cy="100" r="85" /></clipPath>
      <mask :id="`${id}mk`">
        <circle cx="100" cy="100" r="85" fill="#fff" /><path :d="RIGHT" fill="#000" /><path :d="CRESCENT" fill="#000" />
        <circle cx="100" cy="100" r="25" fill="#000" /><circle cx="46" cy="104" r="19" fill="#000" /><circle cx="118" cy="30" r="4.5" fill="#fff" />
      </mask>
    </defs>
    <circle cx="100" cy="100" r="99" fill="#141416" />
    <circle cx="100" cy="100" r="97.5" :fill="u('bz')" />
    <g :clip-path="u('in')">
      <circle cx="100" cy="100" r="85" fill="#222325" />
      <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="3" />
      <g v-for="(g, i) in GEARS" :key="i">
        <g :transform="turn(g, i)">
          <path :d="g.d" :fill="u('gm')" fill-rule="evenodd" stroke="#1a1b1d" stroke-width=".4" />
          <circle v-if="!g.spokes" :cx="g.x" :cy="g.y" :r="g.r * 0.62" fill="none" stroke="#2f3033" :stroke-width="g.r * 0.1" />
        </g>
        <circle :cx="g.x" :cy="g.y" :r="g.hub" fill="#333437" stroke="#1d1e20" stroke-width=".5" /><circle :cx="g.x" :cy="g.y" :r="g.hub * 0.3" fill="#232426" />
      </g>
      <circle cx="118" cy="30" r="4.5" fill="#151517" /><circle cx="160" cy="146" r="4.5" fill="#151517" />
      <g :filter="u('ps')"><rect width="200" height="200" :fill="u('pl')" :mask="u('mk')" /></g>
    </g>
    <ellipse v-for="i in 12" :key="i" cx="100" cy="8.4" rx="1.2" ry="2.8" fill="#b4b5b8" :transform="`rotate(${i * 30} 100 100)`" />
    <template v-if="day">
      <circle cx="61" cy="143" r="21" fill="#28292c" stroke="#202123" />
      <text x="61" y="147.5" text-anchor="middle" font-size="12.5" fill="#b9babd" class="bw-geardial__t">{{ day }}</text>
    </template>
    <template v-if="date !== ''">
      <rect x="164" y="91" width="20" height="20" rx="7" fill="#121214" :filter="u('hs')" />
      <text x="174" y="106" text-anchor="middle" font-size="15" fill="#f2f2f3" class="bw-geardial__t">{{ date }}</text>
    </template>
    <g :filter="u('hs')">
      <path d="M97.2 104 L96.4 54 L100 41 L103.6 54 L102.8 104 Z" :fill="u('hd')" :transform="`rotate(${hour} 100 100)`" />
      <path d="M98.2 104 L97.8 26 L100 17 L102.2 26 L101.8 104 Z" :fill="u('hd')" :transform="`rotate(${min} 100 100)`" />
      <line x1="100" y1="124" x2="100" y2="18" stroke="#d9d9db" stroke-width=".8" :transform="`rotate(${sec} 100 100)`" />
    </g>
    <circle cx="100" cy="100" r="8" :fill="u('cp')" stroke="#3a3b3e" stroke-width=".5" :filter="u('hs')" />
    <circle cx="100" cy="100" r="3.6" fill="none" stroke="#8a8b8f" stroke-width=".6" /><circle cx="100" cy="100" r="1.4" fill="#7a7b7f" />
  </svg>
</template>
<style>
.bw-geardial { display: block; width: 100%; height: 100%; }
.bw-geardial__t { font-family: var(--hd-font-family-base, sans-serif); }
</style>
