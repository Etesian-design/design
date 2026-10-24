<script setup lang="ts">
/**
 * Desktop v2 global menu bar (30px, chrome surface): left = focused app name + its menus (File, Edit, View…),
 * like macOS or a Linux global menu; right = status area, then the clock at the far right end.
 */
import { computed } from 'vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdCountBubble from '../../../components/HdCountBubble.vue';
import XKey from '../parts/XKey.vue';
import XContextMenu from '../parts/XContextMenu.vue';
import { chromeOf } from './chrome';
import type { XMenuItem } from '../parts/types';
const props = withDefaults(defineProps<{ app?: string; label?: string; count?: number; hints?: boolean; active?: 'events' | 'status' | null; openMenu?: string | null }>(),
  { app: '', count: 4, hints: true, active: null, openMenu: null });
const emit = defineEmits<{ events: []; status: []; menu: [name: string | null] }>();
const menus = computed(() => (props.app ? chromeOf(props.app).menus : []));
const ITEMS: Record<string, XMenuItem[]> = {
  File: [{ id: 'new', label: 'New message', keys: 'Ctrl+N', icon: 'add' }, { id: 'win', label: 'New window', keys: 'Ctrl+Shift+N', icon: 'window' }, { id: 'print', label: 'Print…', keys: 'Ctrl+P' }, { id: 'close', label: 'Close window', keys: 'Ctrl+W', divider: true }, { id: 'quit', label: 'Quit', keys: 'Ctrl+Q' }],
  View: [{ id: 'inbox', label: 'Inbox', keys: 'Ctrl+1', icon: 'mail' }, { id: 'sent', label: 'Sent', keys: 'Ctrl+2' }, { id: 'split', label: 'Reading pane', icon: 'split', keys: 'Ctrl+J', divider: true }, { id: 'full', label: 'Full screen', icon: 'maximize', keys: 'F11' }],
};
</script>
<template>
  <header class="x-mbar hd-on-home" role="menubar" :aria-label="`${app || label || 'Desktop'} menu bar`">
    <span class="x-mbar__app">{{ app || label || 'Desktop' }}</span>
    <span v-for="m in menus" :key="m" class="x-mbar__m">
      <button type="button" role="menuitem" class="x-mbar__menu hd-focusable" :class="{ 'is-open': openMenu === m }" :aria-expanded="openMenu === m ? 'true' : 'false'" @click="emit('menu', openMenu === m ? null : m)">{{ m }}</button>
      <span v-if="openMenu === m" class="x-mbar__drop"><XContextMenu :open="true" :items="ITEMS[m] ?? ITEMS.File!" :label="m" @update:open="emit('menu', null)" /></span>
    </span>
    <XKey v-if="hints && menus.length" keys="Alt" label="Alt opens the menus" />
    <span class="x-mbar__sp"></span>
    <span class="x-mbar__status" aria-label="Status">
      <XKey v-if="hints" keys="Super+N" />
      <button type="button" class="x-mbar__events hd-focusable" :class="{ 'is-active': active === 'events' }" :aria-label="`Events: ${count} new`" @click="emit('events')"><HdCountBubble :value="count" /></button>
      <button type="button" class="x-mbar__sicons hd-focusable" :class="{ 'is-active': active === 'status' }" aria-label="Status menu: Wi-Fi, Bluetooth, battery 82%" :aria-expanded="active === 'status' ? 'true' : 'false'" @click="emit('status')">
        <HdIcon name="wifi" :size="15" /><HdIcon name="bluetooth" :size="15" /><span class="x-mbar__batt"><HdIcon name="battery" :size="17" />82%</span>
      </button>
      <span class="x-mbar__clock" aria-label="Saturday 24 October, 12:45"><span>Sat 24 Oct</span><b>12:45</b></span>
    </span>
  </header>
</template>
<style>
.x-mbar { position: relative; z-index: 60; flex: none; display: flex; align-items: center; gap: 2px; height: 30px; padding: 0 6px 0 14px; background: var(--hd-surface-home); color: var(--hd-c-fg); font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); font-variant-numeric: tabular-nums; box-shadow: 0 1px 0 var(--hd-c-divider); }
.x-mbar__app { margin-right: 10px; font-weight: 700; font-size: var(--hd-font-size-small); }
.x-mbar__menu { height: 24px; padding: 0 10px; border: 0; border-radius: 4px; background: transparent; color: inherit; font: inherit; font-size: var(--hd-font-size-small); cursor: pointer; }
.x-mbar__menu:hover, .x-mbar__menu.is-open { background: var(--hd-c-pressed); }
.x-mbar .x-key { margin-left: 6px; }
.x-mbar__sp { flex: 1; }
.x-mbar__status { display: inline-flex; align-items: center; gap: 12px; }
.x-mbar__events { display: inline-flex; align-items: center; height: 24px; padding: 0 4px; border: 0; border-radius: 12px; background: transparent; cursor: pointer; }
.x-mbar__events:hover, .x-mbar__events.is-active { background: var(--hd-c-pressed); }
.x-mbar__events .hd-count { min-width: 18px; height: 18px; font-size: 11px; }
.x-mbar__sicons { display: inline-flex; align-items: center; gap: 10px; height: 24px; padding: 0 8px; border: 0; border-radius: 12px; background: transparent; color: inherit; font: inherit; cursor: pointer; }
.x-mbar__sicons:hover, .x-mbar__sicons.is-active { background: var(--hd-c-pressed); }
.x-mbar__batt { display: inline-flex; align-items: center; gap: 3px; }
.x-mbar__clock { display: inline-flex; align-items: center; gap: 8px; padding: 0 8px; height: 24px; margin-left: 2px; font-size: var(--hd-font-size-small); }
.x-mbar__clock b { font-weight: 700; }
.x-mbar__m { position: relative; }
.x-mbar__drop { position: absolute; left: 0; top: 27px; }
.x-mbar__drop .x-cmenu-scrim { display: none; }
</style>
