<script setup lang="ts">
/**
 * Colour-mode scope (docs/15-colour-modes.md).
 *  mode: hybrid (default, N9 original: light pages, dark chrome/overlays/home) | dark | light | auto (light/dark by prefers-color-scheme).
 *  theme (legacy): 'light' = hybrid, 'dark' = dark, 'auto' = auto.
 */
import { computed } from 'vue';
export type HdMode = 'hybrid' | 'dark' | 'light' | 'auto';
const props = withDefaults(defineProps<{ mode?: HdMode; theme?: 'light' | 'dark' | 'auto'; accent?: string; tag?: string; fill?: boolean }>(), { tag: 'div', fill: true });
const m = computed<HdMode>(() => props.mode ?? (props.theme === 'dark' ? 'dark' : props.theme === 'auto' ? 'auto' : 'hybrid'));
</script>
<template>
  <component :is="tag" class="hd-root" :class="[`hd-mode-${m}`, { 'hd-theme--fill': fill }]"
    :data-hd-mode="m" :style="accent ? { '--hd-accent': accent } : undefined">
    <slot />
  </component>
</template>
<style>
.hd-theme--fill { background: var(--hd-c-bg); color: var(--hd-c-fg); }
</style>
