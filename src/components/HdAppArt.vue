<script setup lang="ts">
/**
 * An app icon's drawing (app-art.ts) for a squircle tile of `size` px in `color`: the object in the lit glyph gradient
 * (dark on a light tile), cut-outs in the tile's own bottom colour, a short cast shadow. Fills the tile's box; put it in
 * HdSquircle (HdAppIcon does with its `art` prop).
 */
import { computed } from 'vue';
import { APP_ART, ART_ACCENTS, appArtFragment } from './app-art';
import { LIGHTING, litPalette, type IconTone } from '../lighting';
import { useId } from '../composables/useModal';
const props = withDefaults(defineProps<{ name: string; size?: number; color?: string; tone?: IconTone }>(), { size: 54, color: '#4591FF', tone: 'colour' });
const id = useId('hd-art');
const stops = computed(() => (props.tone === 'light'
  ? [LIGHTING.lightTile['glyph-top'], LIGHTING.lightTile['glyph-bottom'], LIGHTING.lightTile['glyph-bottom']]
  : LIGHTING.glyph));
const cut = computed(() => (props.tone === 'light' ? '#DADADA' : (litPalette(props.color)?.bottom ?? props.color)));
const body = computed(() => (APP_ART[props.name]
  ? appArtFragment(props.name, { ink: `url(#${id}-ink)`, cut: cut.value, ...ART_ACCENTS }, 48) : ''));
</script>
<template>
  <svg class="hd-app-art" viewBox="0 0 48 48" :width="size" :height="size" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient :id="`${id}-ink`" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="0" y2="40">
        <stop offset="0" :stop-color="stops[0]" /><stop offset=".5" :stop-color="stops[1]" /><stop offset="1" :stop-color="stops[2]" />
      </linearGradient>
    </defs>
    <g v-html="body" />
  </svg>
</template>
<style>.hd-app-art { position: absolute; inset: 0; display: block; pointer-events: none; }</style>
