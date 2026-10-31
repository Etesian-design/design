<!--
  Belle analog dial, measured from the 701's own clock art (analogclock .nvg, a 126 grid; kept here as the units):
  a squircle face (n = 2.9) in warm charcoal (#41413C → #282823) inside a #50504B → #34342F bezel; white rounded bars at 12, 3, 6
  and 9 and faint hollow ticks between; a date window at 3 o'clock; white hour (0.60 r, 5 wide) and minute (0.86 r, 2.6 wide)
  hands with a soft shadow; a 1-unit #4791DC second hand with a short tail, and a blue hub. `face="none"` draws only the marks
  and hands (the gear and round clocks bring their own face). The time comes in as numbers: the widget keeps it running.
-->
<script setup lang="ts">
import { computed } from 'vue';
import { squircleRectPath, FACE_EXPONENT } from '../../squircle';

const props = withDefaults(defineProps<{ h: number; m: number; s: number; date?: number; second?: boolean; face?: 'squircle' | 'none'; marks?: boolean }>(), { face: 'squircle', marks: true });
const outer = squircleRectPath(126, 126, FACE_EXPONENT);
const inner = squircleRectPath(118, 118, FACE_EXPONENT, 4, 4);
const win = squircleRectPath(26, 26, 2.8, 79, 50);
const rot = (deg: number) => `rotate(${deg} 63 63)`;
const hourDeg = computed(() => (props.h % 12) * 30 + props.m / 2 + props.s / 120);
const minDeg = computed(() => props.m * 6 + props.s / 10);
const secDeg = computed(() => props.s * 6);
/** the eight minor ticks: every 30° except the cardinal points */
const minor = [30, 60, 120, 150, 210, 240, 300, 330];
</script>
<template>
  <svg class="bd" viewBox="0 0 126 126" aria-hidden="true">
    <defs>
      <linearGradient id="bd-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A5A55" /><stop offset=".5" stop-color="#3E3E39" /><stop offset="1" stop-color="#34342F" /></linearGradient>
      <linearGradient id="bd-face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#41413C" /><stop offset=".22" stop-color="#373732" /><stop offset=".59" stop-color="#32322D" /><stop offset="1" stop-color="#282823" /></linearGradient>
      <linearGradient id="bd-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A2A26" /><stop offset="1" stop-color="#3C3C37" /></linearGradient>
      <filter id="bd-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1.2" stdDeviation=".9" flood-color="#000" flood-opacity=".55" /></filter>
    </defs>
    <template v-if="face === 'squircle'">
      <path :d="outer" fill="url(#bd-bezel)" stroke="#1C1C19" stroke-width="1" />
      <path :d="inner" fill="url(#bd-face)" />
      <path :d="inner" fill="none" stroke="#fff" stroke-opacity=".13" stroke-width=".8" />
    </template>
    <g v-if="marks" stroke-linecap="round">
      <line v-for="a in [0, 90, 180, 270]" :key="a" x1="63" y1="10.5" x2="63" y2="15.3" stroke="#fff" stroke-width="2.7" :transform="rot(a)" />
      <line v-for="a in minor" :key="a" x1="63" y1="11.5" x2="63" y2="15.5" stroke="#D6D6D6" stroke-opacity=".4" stroke-width="1.6" :transform="rot(a)" />
    </g>
    <g v-if="date !== undefined" class="bd-date">
      <path :d="win" fill="url(#bd-win)" stroke="#000" stroke-opacity=".35" stroke-width=".8" />
      <text x="92" y="67.6" text-anchor="middle" font-size="12.5" fill="#D6D6D6">{{ date }}</text>
    </g>
    <g filter="url(#bd-shadow)">
      <path class="bd-hour" d="M60.5 68 L60.6 25.5 Q63 24.2 65.4 25.5 L65.5 68 Z" fill="#fff" :transform="rot(hourDeg)" />
      <path class="bd-minute" d="M61.7 68 L61.75 9.4 Q63 8.6 64.25 9.4 L64.3 68 Z" fill="#fff" :transform="rot(minDeg)" />
      <circle cx="63" cy="63" r="5" fill="#fff" />
    </g>
    <line v-if="second" class="bd-second" x1="63" y1="84" x2="63" y2="9" stroke="#4791DC" stroke-width="1.1" :transform="rot(secDeg)" />
    <circle cx="63" cy="63" r="2.2" fill="#4791DC" /><circle cx="63" cy="63" r="1" fill="#fff" />
  </svg>
</template>
<style scoped>
.bd { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.bd-date text { font-family: var(--hd-font-family-base); }
</style>
