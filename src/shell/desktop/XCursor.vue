<script setup lang="ts">
/** A drawn mouse pointer, to show where the pointer is in static mockups (hover, edge peek). */
defineProps<{ x: number; y: number }>();
</script>
<template>
  <svg class="x-cursor" :style="{ left: `${x}px`, top: `${y}px` }" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
    <path d="M2 1.5v16.5l4.6-4.3 3 6.8 3-1.3-3-6.6H16z" fill="#fff" stroke="#000" stroke-width="1.3" stroke-linejoin="round" />
  </svg>
</template>
<style>
.x-cursor { position: absolute; z-index: 100; pointer-events: none; filter: drop-shadow(0 1px 2px rgba(0,0,0,.4)); }
</style>
