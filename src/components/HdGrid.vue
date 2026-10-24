<script setup lang="ts">
/**
 * Grid (extrapolated, web). 4 / 8 / 12 columns at compact / medium / expanded. Children span with
 * `style="--span: 6"` or the `min` prop for an auto-fill card grid.
 */
withDefaults(defineProps<{ min?: string; gap?: string; tag?: string }>(), { tag: 'div' });
</script>
<template>
  <component :is="tag" class="hd-grid" :class="{ 'hd-grid--auto': min }" :style="{ '--hd-grid-min': min, '--hd-grid-gap': gap }"><slot /></component>
</template>
<style>
.hd-grid { display: grid; gap: var(--hd-grid-gap, 16px); grid-template-columns: repeat(4, minmax(0, 1fr)); }
.hd-grid > * { grid-column: span min(var(--span, 4), 4); }
@media (min-width: 600px) { .hd-grid { grid-template-columns: repeat(8, minmax(0, 1fr)); gap: var(--hd-grid-gap, 24px); } .hd-grid > * { grid-column: span min(var(--span-md, var(--span, 8)), 8); } }
@media (min-width: 960px) { .hd-grid { grid-template-columns: repeat(12, minmax(0, 1fr)); } .hd-grid > * { grid-column: span var(--span-lg, var(--span-md, var(--span, 12))); } }
.hd-grid--auto { grid-template-columns: repeat(auto-fill, minmax(min(var(--hd-grid-min), 100%), 1fr)) !important; }
.hd-grid--auto > * { grid-column: auto !important; }
</style>
