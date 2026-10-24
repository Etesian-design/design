<script setup lang="ts">
/** Theme scope. light = N9 "blanco" (light grey bg, dark text); dark = N9 "inverted". */
withDefaults(defineProps<{ theme?: 'light' | 'dark' | 'auto'; accent?: string; tag?: string; fill?: boolean }>(), {
  theme: 'light', tag: 'div', fill: true,
});
</script>
<template>
  <component :is="tag" class="hd-root" :class="[`hd-theme-${theme}`, { 'hd-theme--fill': fill }]"
    :data-hd-theme="theme" :style="accent ? { '--hd-accent': accent } : undefined">
    <slot />
  </component>
</template>
<style>
.hd-theme--fill { background: var(--hd-c-bg); color: var(--hd-c-fg); }
</style>
