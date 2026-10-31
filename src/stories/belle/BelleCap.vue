<!--
  Belle toggle cap, measured from the 701's switch art (nfcapplication .nvg, a 72 × 82 face): a blue-grey metal squircle
  (n = 2.95, #A6B6C1 → #555E70) in a well. On: the cap sits up and the well glows blue below it (#2FA7DD → #2F86DD → #355CA6).
  Off: the cap sits down in a dark well (#4E5662, rim #808C9A). Stretches to any size; never a rounded rectangle.
-->
<script setup lang="ts">
import { squircleRectPath } from '../../squircle';

const props = defineProps<{ on?: boolean }>();
const n = 2.95, id = `bc${Math.random().toString(36).slice(2, 8)}`;
const body = squircleRectPath(72, 82, n);
const well = squircleRectPath(66, 76, n, 3, 3);
const capOn = squircleRectPath(64, 64, n, 4, 4);
const capOff = squircleRectPath(64, 64, n, 4, 14);
</script>
<template>
  <span class="bcap" :class="{ on: props.on }">
    <svg viewBox="0 0 72 82" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient :id="`${id}m`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6B6C1" /><stop offset="1" stop-color="#555E70" /></linearGradient>
        <linearGradient :id="`${id}b`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2FA7DD" /><stop offset=".16" stop-color="#2F86DD" /><stop offset="1" stop-color="#355CA6" /></linearGradient>
        <linearGradient :id="`${id}g`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25" /><stop offset="1" stop-color="#fff" stop-opacity="0" /></linearGradient>
      </defs>
      <path :d="body" :fill="`url(#${id}m)`" stroke="#010101" stroke-opacity=".3" />
      <path :d="well" :fill="props.on ? `url(#${id}b)` : '#4E5662'" :stroke="props.on ? '#355CA6' : '#808C9A'" stroke-width=".8" />
      <path :d="props.on ? capOn : capOff" :fill="`url(#${id}m)`" stroke="#010101" stroke-opacity=".3" />
      <path :d="props.on ? capOn : capOff" :fill="`url(#${id}g)`" />
    </svg>
    <span class="bcap__glyph"><slot /></span>
  </span>
</template>
<style scoped>
.bcap { position: relative; display: block; }
.bcap svg { position: absolute; inset: 0; width: 100%; height: 100%; }
/* the glyph rides on the cap: up when on, pressed down when off */
.bcap__glyph { position: absolute; left: 0; right: 0; top: 5%; height: 78%; display: grid; place-items: center; color: #2E343D; filter: drop-shadow(0 1px 0 rgba(255,255,255,.35)); }
.bcap:not(.on) .bcap__glyph { top: 17%; }
.bcap.on .bcap__glyph { color: #fff; filter: drop-shadow(0 1px 1px rgba(0,0,0,.45)); }
</style>
