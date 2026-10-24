<script setup lang="ts">
/** AppGrid. N9-original: Applications view, 4 columns in portrait, icons 80 n9px with labels; web: auto-fill columns. */
withDefaults(defineProps<{ columns?: number | 'auto'; label?: string }>(), { columns: 4, label: 'Applications' });
</script>
<template>
  <ul class="hd-app-grid" :aria-label="label" :style="{ gridTemplateColumns: columns === 'auto' ? 'repeat(auto-fill, minmax(84px, 1fr))' : `repeat(${columns}, 1fr)` }">
    <slot />
  </ul>
</template>
<style>
.hd-app-grid { list-style: none; margin: 0; padding: var(--hd-space-xxlarge) var(--hd-space-double); display: grid; gap: var(--hd-space-xxlarge) 0; justify-items: center; }
.hd-app-grid > * { display: flex; justify-content: center; }
</style>
