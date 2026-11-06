<script setup lang="ts">
/**
 * The Belle gear clock's dial (belle-ref11, its shapes traced on a grid over the photo): a skeleton dial. A dark bezel lit
 * from above with oval ticks; a face plate darkening downwards with a raised fin top left; a dark S-shaped bridge from 12 to 6
 * that wraps the centre ring; through the openings on its right, round the centre and in a round window on the left, flat
 * low-contrast gears (one with three spokes) that turn with the seconds, and a disc at the bottom. Broad tapered metal hands, a thin light second hand, a silver cap; the day in a dark disc low on the left, the date
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
const GEARS = [[122, 60, 23, 32, 2.2, 0, 6], [153, 92, 30, 40, 2.6, 3, 9], [100, 100, 21, 40, 1.6, 0, 6], [41, 103, 14, 18, 1.8, 0, 4]]
  .map(([x, y, r, t, dp, sp, hub]) => ({ x: x!, y: y!, r: r!, hub: hub!, spokes: sp!, d: gear(x!, y!, r!, t!, dp!, sp!, hub!) }));
/* the plate's large opening, right of the bridge */
const RIGHT = 'M100 18 C92 30 88 44 96 56 C104 66 120 72 126 84 C129 96 128 110 126 118 C132 126 146 130 160 128 C170 127 176 123 182 118 L200 118 L200 0 L100 0 Z';
/** a smooth closed outline through points (Catmull-Rom as cubic Beziers) */
function smooth(pts: number[][]): string {
  let d = `M${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!, p1 = pts[i]!, p2 = pts[i + 1]!, p3 = pts[i + 2] ?? p2;
    d += `C${(p1[0]! + (p2[0]! - p0[0]!) / 6).toFixed(1)} ${(p1[1]! + (p2[1]! - p0[1]!) / 6).toFixed(1)} ${(p2[0]! - (p3[0]! - p1[0]!) / 6).toFixed(1)} ${(p2[1]! - (p3[1]! - p1[1]!) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
/* the S bridge: its two edges, thin at 12 and 6 and widest where it wraps the centre ring */
const BL = [[98, 14], [88, 32], [90, 50], [100, 62], [114, 72], [120, 86], [121, 100], [118, 113], [106, 121], [95, 131], [88, 145], [90, 165], [97, 188]];
const BR = [[106, 14], [96, 32], [98, 48], [108, 56], [126, 68], [136, 86], [136, 106], [130, 124], [114, 134], [104, 142], [98, 152], [101, 168], [108, 188]];
const BRIDGE = `${smooth(BL)}L${smooth([...BR].reverse()).slice(1)}Z`;
const FIN = 'M37 77 C44 58 62 42 82 35 C78 48 76 62 72 80 C60 78 48 76 37 77 Z';
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
      <linearGradient :id="`${id}bz`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#424346" /><stop offset=".5" stop-color="#2e2f32" /><stop offset="1" stop-color="#1c1d1f" /></linearGradient>
      <linearGradient :id="`${id}pl`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38393c" /><stop offset=".55" stop-color="#2a2b2e" /><stop offset="1" stop-color="#1b1c1e" /></linearGradient>
      <linearGradient :id="`${id}gm`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#434447" /><stop offset="1" stop-color="#2c2d30" /></linearGradient>
      <linearGradient :id="`${id}hd`" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" /><stop offset=".5" stop-color="#f2f2f3" /><stop offset=".51" stop-color="#cfd0d2" /><stop offset="1" stop-color="#e4e4e6" /></linearGradient>
      <radialGradient :id="`${id}cp`" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f0f0f2" /><stop offset=".6" stop-color="#a5a6aa" /><stop offset="1" stop-color="#5a5b5f" /></radialGradient>
      <filter :id="`${id}ps`" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.4" flood-color="#000" flood-opacity=".8" /></filter>
      <filter :id="`${id}bb`" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".7" /><feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-color="#000" flood-opacity=".6" /></filter>
      <filter :id="`${id}hs`"><feDropShadow dx="0" dy="1.2" stdDeviation="1" flood-color="#000" flood-opacity=".6" /></filter>
      <clipPath :id="`${id}in`"><circle cx="100" cy="100" r="81" /></clipPath>
      <mask :id="`${id}mk`">
        <circle cx="100" cy="100" r="81" fill="#fff" /><path :d="RIGHT" fill="#000" /><circle cx="100" cy="100" r="24" fill="#000" />
        <circle cx="44" cy="103" r="17" fill="#000" /><circle cx="117" cy="152" r="23" fill="#000" /><circle cx="118" cy="29" r="5" fill="#fff" />
      </mask>
    </defs>
    <circle cx="100" cy="100" r="93" fill="#0e0e0f" />
    <circle cx="100" cy="100" r="92" :fill="u('bz')" />
    <g :clip-path="u('in')">
      <circle cx="100" cy="100" r="81" fill="#1e1f21" />
      <g v-for="(g, i) in GEARS" :key="i">
        <g :transform="turn(g, i)">
          <path :d="g.d" :fill="u('gm')" fill-rule="evenodd" stroke="#18191b" stroke-width=".4" />
          <circle v-if="!g.spokes" :cx="g.x" :cy="g.y" :r="g.r * 0.6" fill="none" stroke="#343538" :stroke-width="g.r * 0.08" />
        </g>
        <circle :cx="g.x" :cy="g.y" :r="g.hub" fill="#3a3b3e" stroke="#1d1e20" stroke-width=".5" /><circle :cx="g.x" :cy="g.y" :r="g.hub * 0.35" fill="#232426" />
      </g>
      <circle cx="50" cy="96" r="1.6" fill="#111" /><circle cx="58" cy="105" r="6" fill="#1a1b1d" />
      <circle cx="117" cy="152" r="21" fill="#2e2f32" /><circle cx="106" cy="160" r="11" fill="#28292c" stroke="#26272a" stroke-width="1.4" /><circle cx="106" cy="160" r="4" fill="#2a2b2e" />
      <circle cx="162" cy="146" r="5" fill="#141416" /><circle cx="118" cy="29" r="5" fill="#141416" />
      <g :filter="u('ps')">
        <rect width="200" height="200" :fill="u('pl')" :mask="u('mk')" />
        <path :d="FIN" fill="#303134" stroke="#242527" stroke-width=".6" />
      </g>
      <path :d="BRIDGE" fill="#1b1c1e" :filter="u('bb')" />
      <circle cx="100" cy="100" r="26" fill="none" stroke="#1b1c1e" stroke-width="5" :filter="u('bb')" />
      <circle cx="100" cy="100" r="80.5" fill="none" stroke="rgba(255,255,255,.06)" stroke-width=".6" />
    </g>
    <ellipse v-for="i in 12" :key="i" cx="100" cy="12.5" rx="1.1" ry="2.6" fill="#b4b5b8" :transform="`rotate(${i * 30} 100 100)`" />
    <template v-if="day">
      <circle cx="57" cy="145" r="18" fill="#1c1d1f" stroke="#18191a" />
      <text x="57" y="149.5" text-anchor="middle" font-size="12" fill="#b9babd" class="bw-geardial__t">{{ day }}</text>
    </template>
    <template v-if="date !== ''">
      <rect x="165" y="95" width="18" height="18" rx="6" fill="#121214" :filter="u('hs')" />
      <text x="174" y="108.5" text-anchor="middle" font-size="13.5" fill="#f2f2f3" class="bw-geardial__t">{{ date }}</text>
    </template>
    <g :filter="u('hs')">
      <path d="M97.2 104 L96.4 54 L100 41 L103.6 54 L102.8 104 Z" :fill="u('hd')" :transform="`rotate(${hour} 100 100)`" />
      <path d="M98.2 104 L97.8 26 L100 17 L102.2 26 L101.8 104 Z" :fill="u('hd')" :transform="`rotate(${min} 100 100)`" />
      <line x1="100" y1="124" x2="100" y2="18" stroke="#d9d9db" stroke-width=".8" :transform="`rotate(${sec} 100 100)`" />
    </g>
    <circle cx="100" cy="100" r="7" :fill="u('cp')" stroke="#3a3b3e" stroke-width=".5" />
    <circle cx="100" cy="100" r="1.6" fill="#7a7b7f" />
  </svg>
</template>
<style>
.bw-geardial { display: block; width: 100%; height: 100%; }
.bw-geardial__t { font-family: var(--hd-font-family-base, sans-serif); }
</style>
