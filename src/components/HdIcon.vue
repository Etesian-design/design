<script setup lang="ts">
/**
 * Line icon. `lit` turns it into an N9 app-icon glyph (top-lit emboss): off-white top->bottom
 * gradient stroke, 1px white highlight on top edges and a short cast shadow straight below.
 * `lit="dark"` is the dark-glyph variant for white tiles (Clock/Camera style).
 */
import { computed } from 'vue';
import { icons } from './icons';
import { useId } from '../composables/useModal';
import { LIGHTING } from '../lighting';
const props = withDefaults(defineProps<{ name: string; size?: number | string; label?: string; lit?: boolean | 'light' | 'dark' }>(), { size: 24, lit: false });
const d = computed(() => icons[props.name] ?? icons.info);
const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size));
const id = useId('hd-glyph');
const mode = computed(() => (props.lit === true ? 'light' : props.lit || null));
const stops = computed(() => (mode.value === 'dark'
  ? [LIGHTING.lightTile['glyph-top'], LIGHTING.lightTile['glyph-bottom'], LIGHTING.lightTile['glyph-bottom']]
  : LIGHTING.glyph));
/* Glyph drawn at 50% of the tile: 24 units = 0.5 x tile, so 1 unit = tile/48. */
const castDy = LIGHTING.castOffset * 48;
const castSd = (LIGHTING.castBlur * 48) / 2;
const castOpacity = computed(() => (mode.value === 'dark' ? LIGHTING.castOpacity * 0.35 : Math.min(1, LIGHTING.castOpacity * 1.35)));
/* x1.35: a 2.4u stroke has far less alpha mass than the N9's solid glyphs, so its blurred shadow needs more opacity to reach the measured tile x0.72 */;
</script>
<template>
  <svg class="hd-icon" :class="{ 'hd-icon--lit': mode }" viewBox="0 0 24 24" :width="px" :height="px" fill="none"
    :stroke="mode ? `url(#${id}-g)` : 'currentColor'" overflow="visible"
    :stroke-width="mode ? 2.4 : 2" stroke-linecap="round" stroke-linejoin="round"
    :role="label ? 'img' : undefined" :aria-label="label" :aria-hidden="label ? undefined : 'true'" focusable="false">
    <defs v-if="mode">
      <linearGradient :id="`${id}-g`" gradientUnits="userSpaceOnUse" x1="0" y1="3" x2="0" y2="21">
        <stop offset="0" :stop-color="stops[0]" />
        <stop offset=".5" :stop-color="stops[1]" />
        <stop offset="1" :stop-color="stops[2]" />
      </linearGradient>
      <filter :id="`${id}-f`" filterUnits="userSpaceOnUse" x="-6" y="-6" width="36" height="38" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceAlpha" :stdDeviation="castSd" result="b" />
        <feOffset in="b" :dy="castDy" result="bo" />
        <feFlood flood-color="#000" :flood-opacity="castOpacity" />
        <feComposite in2="bo" operator="in" result="shadow" />
        <feOffset in="SourceAlpha" dy="0.6" result="down" />
        <feComposite in="SourceAlpha" in2="down" operator="out" result="edge" />
        <feFlood :flood-color="mode === 'dark' ? '#000' : LIGHTING.glyphHighlight" flood-opacity=".9" />
        <feComposite in2="edge" operator="in" result="hi" />
        <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /><feMergeNode in="hi" /></feMerge>
      </filter>
    </defs>
    <path :d="d" :filter="mode ? `url(#${id}-f)` : undefined" />
  </svg>
</template>
<style>
.hd-icon { display: inline-block; flex: none; vertical-align: middle; }
</style>
