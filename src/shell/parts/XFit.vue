<script setup lang="ts">
/**
 * Renders its slot at a fixed design size (w x h CSS px) and scales it to fit the host.
 * fit="width": host is as tall as the scaled content (live thumbnails). fit="contain": fills the host, centred (device frames).
 * Until the host is measured (and in pre-rendered pages, before the scripts run) the content is hidden, never drawn at the
 * `initial` guess: that showed as a tiny box growing to full size.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
const props = withDefaults(defineProps<{ w: number; h: number; fit?: 'width' | 'contain'; max?: number; initial?: number }>(), { fit: 'width', max: 1, initial: 0.25 });
const host = ref<HTMLElement>();
const box = ref({ w: 0, h: 0 });
let ro: ResizeObserver | undefined;
function measure() { if (host.value) box.value = { w: host.value.clientWidth, h: host.value.clientHeight }; }
onMounted(() => { measure(); if (typeof ResizeObserver !== 'undefined' && host.value) { ro = new ResizeObserver(measure); ro.observe(host.value); } });
onBeforeUnmount(() => ro?.disconnect());
const scale = computed(() => {
  if (!box.value.w) return props.initial;
  const sx = box.value.w / props.w;
  const s = props.fit === 'width' ? sx : Math.min(sx, box.value.h ? box.value.h / props.h : sx);
  return Math.min(props.max, s);
});
const left = computed(() => (props.fit === 'contain' ? Math.max(0, (box.value.w - props.w * scale.value) / 2) : 0));
const top = computed(() => (props.fit === 'contain' ? Math.max(0, (box.value.h - props.h * scale.value) / 2) : 0));
defineExpose({ scale });
</script>
<template>
  <div ref="host" class="x-fit" :class="`x-fit--${fit}`" :style="fit === 'width' ? { height: `${h * scale}px` } : undefined">
    <div class="x-fit__inner" :style="{ width: `${w}px`, height: `${h}px`, transform: `translate(${left}px, ${top}px) scale(${scale})`, visibility: box.w ? undefined : 'hidden' }">
      <slot :scale="scale" />
    </div>
  </div>
</template>
<style>
.x-fit { position: relative; width: 100%; overflow: hidden; }
.x-fit--contain { height: 100%; min-height: 0; }
.x-fit__inner { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
</style>
