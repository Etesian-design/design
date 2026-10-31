<script setup lang="ts">
/** Super+Z snap-layout picker (Windows 11 snap layouts, Etesian look). Also drops down when a window is dragged to the top edge. */
import XKey from '../parts/XKey.vue';
import { LAYOUTS, type LayoutId } from './geometry';
const props = withDefaults(defineProps<{ layout?: LayoutId; zone?: number; hints?: boolean }>(), { zone: -1, hints: true });
const emit = defineEmits<{ pick: [layout: LayoutId, zone: number] }>();
const IDS = Object.keys(LAYOUTS) as LayoutId[];
</script>
<template>
  <section class="x-lpick hd-on-overlay" role="dialog" aria-label="Snap layouts">
    <header class="x-lpick__head"><h2>Snap layouts</h2><XKey v-if="hints" keys="Super+Z" /></header>
    <div class="x-lpick__grid">
      <div v-for="(id, i) in IDS" :key="id" class="x-lpick__item" :class="{ 'is-on': props.layout === id }">
        <div class="x-lpick__mini" role="group" :aria-label="LAYOUTS[id].label">
          <button v-for="(z, j) in LAYOUTS[id].zones" :key="j" type="button" class="x-lpick__z hd-focusable" :class="{ 'is-hot': props.layout === id && zone === j }"
            :style="{ left: `${z.x * 100}%`, top: `${z.y * 100}%`, width: `${z.w * 100}%`, height: `${z.h * 100}%` }" :aria-label="`${LAYOUTS[id].label}, zone ${j + 1}`" @click="emit('pick', id, j)"></button>
        </div>
        <span class="x-lpick__lab"><kbd>{{ i + 1 }}</kbd>{{ LAYOUTS[id].label }}</span>
      </div>
    </div>
    <footer v-if="hints" class="x-lpick__foot"><span><XKey keys="1" />–<XKey keys="6" /> layout, then zone number</span><span><XKey keys="Shift" /> while dragging: show zones</span><span><XKey keys="Esc" /> cancel</span></footer>
  </section>
</template>
<style>
.x-lpick { position: absolute; z-index: 50; width: 640px; padding: 16px 18px 12px; border-radius: var(--hd-radius-card); background: color-mix(in srgb, var(--hd-surface-overlay) 96%, transparent); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); }
.x-lpick__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.x-lpick__head h2 { margin: 0; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1 var(--hd-font-family-light); }
.x-lpick__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 16px; }
.x-lpick__item { display: flex; flex-direction: column; gap: 6px; padding: 8px; border-radius: 8px; }
.x-lpick__item.is-on { background: color-mix(in srgb, var(--hd-c-fg) 8%, transparent); }
.x-lpick__mini { position: relative; height: 90px; }
.x-lpick__z { position: absolute; padding: 0; border: 0; background: transparent; cursor: pointer; }
.x-lpick__z::before { content: ''; position: absolute; inset: 3px; border-radius: 5px; background: color-mix(in srgb, var(--hd-c-fg) 22%, transparent); transition: background var(--hd-motion-duration-instant); }
.x-lpick__z:hover::before, .x-lpick__z.is-hot::before { background: var(--hd-accent); }
.x-lpick__lab { display: flex; align-items: center; gap: 6px; font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-lpick__lab kbd { min-width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--hd-c-divider); border-radius: 3px; font: 700 10px/1 var(--hd-font-family-base); color: var(--hd-c-fg); }
.x-lpick__foot { display: flex; gap: 18px; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--hd-c-divider); font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-lpick__foot span { display: inline-flex; align-items: center; gap: 4px; }
</style>
