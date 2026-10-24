<script setup lang="ts">
/**
 * Desktop window: slim 30px Harmattan title bar (chrome surface: squircle app icon, title, minimise / maximise / close as
 * squircle icon buttons), app content below, resize grip. Absolute position in desktop coordinates.
 */
import HdSquircle from '../../../components/HdSquircle.vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdToolIcon from '../../../components/HdToolIcon.vue';
import { app as appOf } from '../parts/data';
const props = withDefaults(defineProps<{ title: string; app?: string; x?: number; y?: number; w?: number; h?: number; focused?: boolean; tiled?: boolean; z?: number }>(),
  { x: 0, y: 0, w: 800, h: 600, z: 1 });
const emit = defineEmits<{ close: []; minimise: []; maximise: []; focus: [] }>();
const a = appOf(props.app ?? props.title);
</script>
<template>
  <section class="x-window" :class="{ 'is-focused': focused, 'is-tiled': tiled }" :aria-label="`${title} window`"
    :style="{ left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, zIndex: z }" @mousedown="emit('focus')">
    <header class="x-window__bar hd-on-chrome">
      <HdSquircle :size="18" :color="a.color" lighting="lit" :tone="a.tone"><HdIcon :name="a.icon" :size="11" :lit="a.tone === 'light' ? 'dark' : true" /></HdSquircle>
      <span class="x-window__title">{{ title }}</span>
      <span class="x-window__ctl">
        <HdToolIcon icon="minimize" label="Minimise" @click="emit('minimise')" />
        <HdToolIcon icon="maximize" label="Maximise" @click="emit('maximise')" />
        <HdToolIcon icon="close" label="Close" class="x-window__close" @click="emit('close')" />
      </span>
    </header>
    <div class="x-window__body"><slot /></div>
    <span v-if="!tiled" class="x-window__grip" aria-hidden="true"></span>
  </section>
</template>
<style>
.x-window { position: absolute; display: flex; flex-direction: column; overflow: hidden; border-radius: var(--hd-radius-card); background: var(--hd-c-bg);
  box-shadow: 0 0 0 1px rgba(0,0,0,.35), 0 10px 30px rgba(0,0,0,.35); }
.x-window.is-focused { box-shadow: 0 0 0 1px rgba(0,0,0,.45), 0 18px 50px rgba(0,0,0,.5); }
.x-window.is-tiled { border-radius: 4px; }
.x-window__bar { flex: none; display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 2px 0 8px; background: var(--hd-surface-chrome); color: var(--hd-c-fg); cursor: default; }
.x-window:not(.is-focused) .x-window__bar { color: var(--hd-c-fg-secondary); }
.x-window__title { flex: 1; min-width: 0; font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x-window__ctl { display: inline-flex; }
.x-window__ctl .hd-tool-icon { width: 28px; height: 28px; --hd-sq-size: 24px; }
.x-window__ctl .hd-tool-icon svg { width: 14px; height: 14px; }
.x-window__close:hover { --hd-sq-fill: var(--hd-color-palette-warning) !important; color: #fff; }
.x-window__body { flex: 1; min-height: 0; display: flex; }
.x-window__grip { position: absolute; right: 2px; bottom: 2px; width: 10px; height: 10px; border-right: 2px solid var(--hd-c-divider); border-bottom: 2px solid var(--hd-c-divider); cursor: nwse-resize; }
</style>
