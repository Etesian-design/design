<script setup lang="ts">
/** Desktop screen 1920x1080: home surface with a faint accent glow as the "wallpaper", content positioned inside. */
import XDevice from '../parts/XDevice.vue';
defineProps<{ label?: string }>();
</script>
<template>
  <XDevice :w="1920" :h="1080" kind="desktop" :label="label">
    <div class="x-desktop"><slot /></div>
  </XDevice>
</template>
<style>
.x-desktop { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; color: var(--hd-c-fg);
  background: radial-gradient(1200px 700px at 70% 30%, color-mix(in srgb, var(--hd-accent) 22%, transparent), transparent 70%), var(--hd-surface-home); }
.x-desktop__area { position: relative; flex: 1; min-height: 0; }
.x-panel-scrim { position: absolute; inset: 0; z-index: 24; background: rgba(0,0,0,.25); }
</style>
