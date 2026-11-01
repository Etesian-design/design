<script setup lang="ts">
/**
 * The Overview, the desktop's main menu: full screen under the top bar, in the N9 home order.
 * the phone's Events view on the left (the same as v2's Events sidebar, weather included), no column titles, the open windows as live thumbnails in the middle, the app grid with type-to-search on the right.
 * Super opens and closes it; typing goes to the search. Search (Super+Space) is the compact version next to it.
 */
import XEventsPanel from '../desktop/XEventsPanel.vue';
import XAppsView from './XAppsView.vue';
import XOpenApps from './XOpenApps.vue';
import XHints from '../desktop/XHints.vue';
import HdSearchField from '../../components/HdSearchField.vue';
withDefaults(defineProps<{ query?: string; apps?: string[]; search?: boolean }>(), { query: '', apps: () => ['Mail', 'Messages', 'Browser'], search: false });
const emit = defineEmits<{ 'update:query': [q: string]; open: [name: string] }>();
</script>
<template>
  <div class="x-ov hd-on-home" role="dialog" aria-label="Overview">
    <aside class="x-ov__events"><XEventsPanel :hints="false" /></aside>
    <section class="x-ov__wins" aria-label="Open windows">
      <XOpenApps :apps="apps" :cols="2" :w="1280" :h="840" chrome="headerbar" hover-close :focus="0" :gap="32" @open="(n: string) => emit('open', n)" />
    </section>
    <section class="x-ov__apps" aria-label="Applications">
      <HdSearchField :model-value="query" placeholder="Type to search apps, contacts, mail" label="Search" @update:model-value="(v: string) => emit('update:query', v)" />
      <p class="x-ov__hint">{{ query ? `Apps matching “${query}”` : 'Just start typing' }}</p>
      <XAppsView :columns="5" :size="54" :query="query" @open="(n: string) => emit('open', n)" />
    </section>
    <XHints corner="br" :items="search
      ? [['Esc', 'Close'], ['Tab', 'Next column'], ['Enter', 'Open'], ['Ctrl+W', 'Close window'], ['Super+Space', 'Search']]
      : [['Esc', 'Close'], ['Tab', 'Next column'], ['Left+Right', 'Move'], ['Enter', 'Open'], ['Ctrl+W', 'Close window']]" />
  </div>
</template>
<style>
.x-ov { position: absolute; inset: 0; z-index: 42; /* above the dock (40), as on Plasma */ display: grid; grid-template-columns: 420px 1fr 600px; gap: 0; background: color-mix(in srgb, var(--hd-surface-home) 92%, transparent); color: var(--hd-c-fg); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px); }
.x-ov__events { position: relative; overflow: hidden; border-right: 1px solid var(--hd-c-divider); }
.x-ov__wins { min-width: 0; padding: 32px 40px; overflow: hidden; }
.x-ov__events .x-ev { position: absolute; inset: 0; width: auto; z-index: auto; background: none; box-shadow: none; -webkit-backdrop-filter: none; backdrop-filter: none; }
.x-ov__apps { min-width: 0; padding: 24px 24px; border-left: 1px solid var(--hd-c-divider); overflow: hidden; }
.x-ov__hint { margin: 8px 4px 0; font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); }
.x-ov-enter-active, .x-ov-leave-active { transition: opacity var(--hd-motion-duration-default) var(--hd-motion-easing-out), transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.x-ov-enter-from, .x-ov-leave-to { opacity: 0; transform: scale(1.02); }
</style>
