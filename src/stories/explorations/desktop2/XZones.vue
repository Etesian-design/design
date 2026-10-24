<script setup lang="ts">
/** Snap zones overlay shown while dragging a window (FancyZones style, Harmattan look): numbered zones, the hot zone lit in the accent colour. */
import { computed } from 'vue';
import { zoneRects, type LayoutId, type Rect } from './geometry';
const props = withDefaults(defineProps<{ layout: LayoutId; area: Rect; hot?: number; app?: string }>(), { hot: -1 });
const zones = computed(() => zoneRects(props.layout, props.area));
</script>
<template>
  <div class="x-zones" aria-label="Snap zones">
    <div v-for="(z, i) in zones" :key="i" class="x-zones__z" :class="{ 'is-hot': i === hot }" :style="{ left: `${z.x}px`, top: `${z.y}px`, width: `${z.w}px`, height: `${z.h}px` }">
      <span class="x-zones__n">{{ i + 1 }}</span>
      <span v-if="i === hot" class="x-zones__cap">{{ app ? `Release to snap ${app} here` : 'Release to snap' }} · {{ z.w }} × {{ z.h }}</span>
    </div>
  </div>
</template>
<style>
.x-zones { position: absolute; inset: 0; z-index: 30; pointer-events: none; }
.x-zones__z { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; border-radius: var(--hd-radius-card);
  background: color-mix(in srgb, var(--hd-surface-home) 45%, transparent); box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--hd-accent) 55%, transparent); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); color: #fff; }
.x-zones__z.is-hot { background: color-mix(in srgb, var(--hd-accent) 42%, transparent); box-shadow: inset 0 0 0 3px var(--hd-accent), 0 0 40px color-mix(in srgb, var(--hd-accent) 40%, transparent); }
.x-zones__n { font: var(--hd-font-weight-light) 120px/1 var(--hd-font-family-light); opacity: .75; text-shadow: 0 2px 12px rgba(0,0,0,.4); }
.x-zones__cap { padding: 8px 14px; border-radius: 16px; background: rgba(0,0,0,.55); font: 700 var(--hd-font-size-small)/1 var(--hd-font-family-base); }
</style>
