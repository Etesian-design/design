<script setup lang="ts">
/** Taskbar / dock launcher: lit squircle app icon, squircle hover highlight, running indicator, tooltip. */
import HdSquircle from '../../../components/HdSquircle.vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdTooltip from '../../../components/HdTooltip.vue';
import { app as appOf } from '../parts/data';
const props = withDefaults(defineProps<{ name: string; size?: number; running?: boolean; active?: boolean; tip?: string }>(), { size: 36 });
const a = appOf(props.name);
</script>
<template>
  <HdTooltip :text="tip ?? name" placement="top">
    <button type="button" class="x-dock-icon hd-sq hd-focusable" :class="{ 'is-active': active }" :aria-label="name" :style="{ '--hd-sq-size': `${size + 10}px`, width: `${size + 12}px`, height: `${size + 12}px` }">
      <HdSquircle :size="size" :color="a.color" lighting="lit" :tone="a.tone"><HdIcon :name="a.icon" :size="Math.round(size * 0.5)" :lit="a.tone === 'light' ? 'dark' : true" /></HdSquircle>
      <span v-if="running" class="x-dock-icon__run" aria-hidden="true"></span>
    </button>
  </HdTooltip>
</template>
<style>
.x-dock-icon { display: inline-flex; align-items: center; justify-content: center; padding: 0; border: 0; color: inherit; cursor: pointer; }
.x-dock-icon:hover, .x-dock-icon.is-active { --hd-sq-fill: var(--hd-c-pressed); }
.x-dock-icon:hover .hd-icon-lit-shadow { transform: translateY(-1px); }
.x-dock-icon__run { position: absolute; bottom: 0; left: 50%; width: 14px; height: 3px; transform: translateX(-50%); border-radius: 999px; background: var(--hd-c-fg-secondary); }
.x-dock-icon.is-active .x-dock-icon__run { width: 22px; background: var(--hd-accent); }
</style>
