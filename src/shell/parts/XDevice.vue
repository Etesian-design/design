<script setup lang="ts">
/** A device screen at its real CSS size (tablet 1280x800 / 800x1280, desktop 1920x1080), scaled to fit; label shows size and zoom. */
import XFit from './XFit.vue';
withDefaults(defineProps<{ w: number; h: number; label?: string; kind?: 'tablet' | 'desktop' }>(), { kind: 'tablet' });
</script>
<template>
  <figure class="x-device" :class="`x-device--${kind}`" :style="{ flexGrow: w / h }">
    <XFit :w="w" :h="h" fit="contain">
      <div class="x-device__screen hd-on-home"><slot /></div>
    </XFit>
    <figcaption class="x-device__label">{{ label ?? (kind === 'tablet' ? 'Tablet' : 'Desktop') }} · {{ w }} × {{ h }}</figcaption>
  </figure>
</template>
<style>
.x-device { margin: 0; flex: 1 1 0px; min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: 6px; }
.x-device > .x-fit { flex: 1 1 auto; }
.x-device__screen {
  position: relative; width: 100%; height: 100%; overflow: hidden; contain: layout paint;
  background: var(--hd-surface-home); color: var(--hd-c-fg);
  box-shadow: 0 0 0 1px var(--hd-c-divider), 0 6px 24px rgba(0,0,0,.25);
}
.x-device--tablet .x-device__screen { border-radius: 18px; }
.x-device__label { font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); text-align: center; }
</style>
