<script setup lang="ts">
/**
 * BusyIndicator. Two variants:
 *  - squircle (canon): a light segment chasing round a squircle outline (also the app-launch ring)
 *  - classic (N9-original look): rotating arc. Sizes 24/32/96 n9px -> 16/21/64 css px.
 */
import { computed } from 'vue';
import { squirclePath, SQUIRCLE_EXPONENT } from '../squircle';
const props = withDefaults(defineProps<{ size?: number | 'small' | 'default' | 'large'; variant?: 'squircle' | 'classic'; label?: string }>(), {
  size: 'default', variant: 'squircle', label: 'Loading',
});
const px = computed(() => (typeof props.size === 'number' ? props.size : { small: 16, default: 21, large: 64 }[props.size]));
const path = squirclePath(100, SQUIRCLE_EXPONENT, 96, 4);
</script>
<template>
  <span class="hd-busy" :class="`hd-busy--${variant}`" role="progressbar" :aria-label="label" aria-busy="true" :style="{ width: `${px}px`, height: `${px}px` }">
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <template v-if="variant === 'squircle'">
        <path :d="path" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width="7" />
        <path class="hd-busy__seg" :d="path" pathLength="100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-dasharray="25 75" />
      </template>
      <template v-else>
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width="10" />
        <circle class="hd-busy__arc" cx="50" cy="50" r="42" pathLength="100" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-dasharray="30 70" />
      </template>
    </svg>
  </span>
</template>
<style>
.hd-busy { display: inline-block; color: var(--hd-accent); flex: none; }
.hd-busy__seg { animation: hd-busy-chase 1.1s linear infinite; }
.hd-busy__arc { transform-origin: 50px 50px; animation: hd-busy-rot 0.9s linear infinite; }
@keyframes hd-busy-chase { to { stroke-dashoffset: -100; } }
@keyframes hd-busy-rot { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .hd-busy__seg, .hd-busy__arc { animation-duration: 3s !important; animation-iteration-count: infinite !important; }
}
</style>
