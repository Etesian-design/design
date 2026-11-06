<script setup lang="ts">
/**
 * StatusState: a page or panel that has nothing to show yet, is loading, or failed, in one layout: an icon (the busy
 * indicator while loading), one title, one sentence, at most one action (the default slot). Centred in the page's own
 * colours, for a section inside an app; the first run of a whole app is EmptyState.
 */
import HdIcon from './HdIcon.vue';
import HdBusyIndicator from './HdBusyIndicator.vue';
withDefaults(defineProps<{ state?: 'empty' | 'loading' | 'error'; icon?: string; title: string; text?: string }>(), { state: 'empty', icon: 'info', text: '' });
</script>
<template>
  <div class="hd-status-state" :data-state="state" :role="state === 'error' ? 'alert' : undefined">
    <HdBusyIndicator v-if="state === 'loading'" label="Loading" />
    <HdIcon v-else class="hd-status-state__icon" :name="state === 'error' ? 'warning' : icon" :size="48" />
    <h2 class="hd-status-state__title">{{ title }}</h2>
    <p v-if="text || $slots.text" class="hd-status-state__text"><slot name="text">{{ text }}</slot></p>
    <slot />
  </div>
</template>
<style>
.hd-status-state { display: flex; flex-direction: column; align-items: center; gap: 12px; max-width: 420px; margin: 0 auto; padding: 48px 16px; text-align: center; color: var(--hd-c-fg); }
.hd-status-state__icon { color: var(--hd-c-fg-secondary); }
.hd-status-state[data-state='error'] .hd-status-state__icon { color: var(--hd-color-palette-warning); }
.hd-status-state__title { margin: 0; font: var(--hd-font-weight-light) 24px/1.2 var(--hd-font-family-light); }
.hd-status-state__text { margin: 0; color: var(--hd-c-fg-secondary); }
</style>
