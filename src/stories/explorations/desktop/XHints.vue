<script setup lang="ts">
/** Keyboard shortcut legend shown on a desktop mockup (bottom corner chip). */
import XKey from '../parts/XKey.vue';
withDefaults(defineProps<{ items: [string, string][]; corner?: 'bl' | 'br' | 'tr' }>(), { corner: 'bl' });
</script>
<template>
  <aside class="x-hints hd-on-overlay" :class="`x-hints--${corner}`" aria-label="Keyboard shortcuts">
    <span v-for="[k, l] in items" :key="k" class="x-hints__item"><XKey :keys="k" /><span>{{ l }}</span></span>
  </aside>
</template>
<style>
.x-hints { position: absolute; z-index: 50; display: flex; flex-wrap: wrap; gap: 6px 16px; max-width: 760px; padding: 8px 12px; border-radius: var(--hd-radius-card); background: color-mix(in srgb, var(--hd-surface-overlay) 92%, transparent); color: var(--hd-c-fg); font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); box-shadow: 0 0 0 1px var(--hd-c-divider), var(--hd-shadow-overlay); }
.x-hints--bl { left: 16px; bottom: 16px; }
.x-hints--br { right: 16px; bottom: 16px; }
.x-hints--tr { right: 16px; top: 40px; }
.x-hints__item { display: inline-flex; align-items: center; gap: 6px; }
</style>
