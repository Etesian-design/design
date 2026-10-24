<script setup lang="ts">
/** Slim desktop top bar (28px, home surface): left = Overview/home button + focused app, centre = clock, right = connections, battery, notification count. */
import HdIcon from '../../../components/HdIcon.vue';
import HdCountBubble from '../../../components/HdCountBubble.vue';
import HdTooltip from '../../../components/HdTooltip.vue';
import XKey from '../parts/XKey.vue';
withDefaults(defineProps<{ app?: string; count?: number; hints?: boolean; transparent?: boolean; active?: 'overview' | 'events' | null }>(), { app: '', count: 4, hints: true, active: null });
const emit = defineEmits<{ overview: []; events: [] }>();
</script>
<template>
  <header class="x-topbar hd-on-home" :class="{ 'is-transparent': transparent }">
    <HdTooltip text="Overview (Super)" placement="bottom">
      <button type="button" class="x-topbar__btn hd-focusable" :class="{ 'is-active': active === 'overview' }" aria-label="Overview" @click="emit('overview')"><HdIcon name="grid" :size="14" /><span>Overview</span></button>
    </HdTooltip>
    <XKey v-if="hints" keys="Super" />
    <span v-if="app" class="x-topbar__app">{{ app }}</span>
    <span class="x-topbar__clock">Sat 24 Oct&nbsp;&nbsp;12:45</span>
    <span class="x-topbar__tray">
      <HdIcon name="wifi" :size="14" label="Wi-Fi connected" /><HdIcon name="bluetooth" :size="14" label="Bluetooth on" />
      <span class="x-topbar__batt"><HdIcon name="battery" :size="16" label="Battery" />82%</span>
      <XKey v-if="hints" keys="Super+N" />
      <button type="button" class="x-topbar__btn hd-focusable" :class="{ 'is-active': active === 'events' }" :aria-label="`${count} notifications`" @click="emit('events')"><HdCountBubble :value="count" /></button>
    </span>
  </header>
</template>
<style>
.x-topbar { position: relative; z-index: 30; flex: none; display: flex; align-items: center; gap: 10px; height: 28px; padding: 0 8px; background: var(--hd-surface-home); color: var(--hd-c-fg); font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); font-variant-numeric: tabular-nums; }
.x-topbar.is-transparent { background: color-mix(in srgb, var(--hd-surface-home) 55%, transparent); }
.x-topbar__btn { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 8px; border: 0; border-radius: 999px; background: transparent; color: inherit; font: inherit; cursor: pointer; }
.x-topbar__btn:hover, .x-topbar__btn.is-active { background: var(--hd-c-pressed); }
.x-topbar__btn .hd-count { min-width: 18px; height: 18px; font-size: 11px; }
.x-topbar__app { font-weight: 700; }
.x-topbar__clock { position: absolute; left: 50%; transform: translateX(-50%); font-weight: 700; }
.x-topbar__tray { margin-left: auto; display: inline-flex; align-items: center; gap: 10px; }
.x-topbar__batt { display: inline-flex; align-items: center; gap: 3px; }
</style>
