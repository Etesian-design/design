<script setup lang="ts">
/**
 * The desktop's global menu bar (30px, home surface), the one bar for every desktop (XShell, DesktopV2, the website's and the
 * cloud companion's): left = an optional mark (`mark` slot), the focused app's name and its menus (File, Edit, View…), like
 * macOS or a Linux global menu; right = the host's `indicators`, the Events count, the status icons, then the clock (which
 * opens Events too) at the far right end.
 * `menus` gives the menus and their items (picking one emits `select`); without it the app's own demo menus (chrome.ts) show.
 * The open menu is internal unless `open-menu` is bound (v-model:open-menu); with a menu open, moving onto another opens it.
 * `date`/`time` fix the clock (Storybook); without them it is live.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import HdIcon from '../../components/HdIcon.vue';
import HdCountBubble from '../../components/HdCountBubble.vue';
import XKey from '../parts/XKey.vue';
import XContextMenu from '../parts/XContextMenu.vue';
import { chromeOf } from './chrome';
import type { XMenuItem } from '../parts/types';
import type { ShellMenu } from './shell';
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{
  app?: string; label?: string; menus?: ShellMenu[];
  /** the Events count; null hides the button */
  count?: number | null; hints?: boolean; active?: 'events' | 'status' | null; openMenu?: string | null;
  /** the status icons button (Wi-Fi, Bluetooth, battery) */
  statusButton?: boolean; date?: string; time?: string;
}>(), { app: '', count: 4, hints: true, active: null, openMenu: undefined, statusButton: true });
const emit = defineEmits<{ events: []; status: []; menu: [name: string | null]; 'update:openMenu': [name: string | null]; select: [id: string] }>();
const DEMO: Record<string, XMenuItem[]> = {
  File: [{ id: 'new', label: 'New message', keys: 'Ctrl+N', icon: 'add' }, { id: 'win', label: 'New window', keys: 'Ctrl+Shift+N', icon: 'window' }, { id: 'print', label: 'Print…', keys: 'Ctrl+P' }, { id: 'close', label: 'Close window', keys: 'Ctrl+W', divider: true }, { id: 'quit', label: 'Quit', keys: 'Ctrl+Q' }],
  View: [{ id: 'inbox', label: 'Inbox', keys: 'Ctrl+1', icon: 'mail' }, { id: 'sent', label: 'Sent', keys: 'Ctrl+2' }, { id: 'split', label: 'Reading pane', icon: 'split', keys: 'Ctrl+J', divider: true }, { id: 'full', label: 'Full screen', icon: 'maximize', keys: 'F11' }],
};
const list = computed<ShellMenu[]>(() => props.menus ?? (props.app ? chromeOf(props.app).menus.map((m) => ({ label: m, items: DEMO[m] ?? DEMO.File! })) : []));
const name = computed(() => props.app || props.label || 'Desktop');
const local = ref<string | null>(props.openMenu ?? null);
watch(() => props.openMenu, (v) => { if (v !== undefined) local.value = v; });
function setOpen(m: string | null) { local.value = m; emit('menu', m); emit('update:openMenu', m); }
let hoverAt = 0;
function hover(m: string) { if (local.value && local.value !== m) { setOpen(m); hoverAt = Date.now(); } }
function click(m: string) { if (local.value === m && Date.now() - hoverAt < 400) return; setOpen(local.value === m ? null : m); }
function pick(id: string) { setOpen(null); emit('select', id); }
const now = ref(new Date());
let tick: number | undefined;
onMounted(() => { if (!props.time) tick = window.setInterval(() => (now.value = new Date()), 15000); });
onBeforeUnmount(() => window.clearInterval(tick));
const shownTime = computed(() => props.time ?? now.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
const shownDate = computed(() => props.date ?? now.value.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }));
</script>
<template>
  <header v-bind="$attrs" class="x-mbar hd-on-home" role="menubar" :aria-label="`${name} menu bar`">
    <span v-if="$slots.mark" class="x-mbar__mark"><slot name="mark" /></span>
    <span class="x-mbar__app">{{ name }}</span>
    <span v-for="m in list" :key="m.label" class="x-mbar__m">
      <button type="button" role="menuitem" class="x-mbar__menu hd-focusable" :class="{ 'is-open': local === m.label }" :aria-expanded="local === m.label ? 'true' : 'false'" aria-haspopup="menu"
        @click="click(m.label)" @mouseenter="hover(m.label)">{{ m.label }}</button>
      <span v-if="local === m.label" class="x-mbar__drop"><XContextMenu :open="true" :items="m.items" :label="m.label" @select="pick" @update:open="setOpen(null)" /></span>
    </span>
    <XKey v-if="hints && list.length" keys="Alt" label="Alt opens the menus" />
    <span class="x-mbar__sp"></span>
    <span class="x-mbar__status" aria-label="Status">
      <slot name="indicators"><XKey v-if="hints" keys="Super+N" /></slot>
      <button v-if="count != null" type="button" class="x-mbar__events hd-focusable" :class="{ 'is-active': active === 'events' }" :aria-label="`Events: ${count} new`" title="Events" @click="emit('events')"><HdCountBubble :value="count" /></button>
      <button v-if="statusButton" type="button" class="x-mbar__sicons hd-focusable" :class="{ 'is-active': active === 'status' }" aria-label="Status menu" :aria-expanded="active === 'status' ? 'true' : 'false'" @click="emit('status')">
        <slot name="status-icons"><HdIcon name="wifi" :size="15" /><HdIcon name="bluetooth" :size="15" /><span class="x-mbar__batt"><HdIcon name="battery" :size="17" />82%</span></slot>
      </button>
      <button type="button" class="x-mbar__clock hd-focusable" :class="{ 'is-active': active === 'events' }" :aria-label="`${shownDate}, ${shownTime}, Events`" :aria-expanded="active === 'events' ? 'true' : 'false'" title="Events" @click="emit('events')">
        <span>{{ shownDate }}</span><b>{{ shownTime }}</b></button>
    </span>
  </header>
  <div v-if="local" class="x-mbar__scrim" @pointerdown="setOpen(null)"></div>
</template>
<style>
.x-mbar { position: relative; z-index: 60; flex: none; display: flex; align-items: center; gap: 2px; height: 30px; padding: 0 6px 0 14px; background: var(--hd-surface-home); color: var(--hd-c-fg); font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); font-variant-numeric: tabular-nums; box-shadow: 0 1px 0 var(--hd-c-divider); }
.x-mbar__mark { display: inline-flex; margin-right: 8px; }
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
.x-mbar__clock { display: inline-flex; align-items: center; gap: 8px; padding: 0 8px; height: 24px; margin-left: 2px; border: 0; border-radius: 4px; background: none; color: inherit; font: inherit; font-size: var(--hd-font-size-small); cursor: pointer; }
.x-mbar__clock:hover, .x-mbar__clock.is-active { background: var(--hd-c-pressed); }
.x-mbar__clock b { font-weight: 700; }
.x-mbar__m { position: relative; }
.x-mbar__drop { position: absolute; z-index: 61; left: 0; top: 27px; }
.x-mbar__drop .x-cmenu-scrim { display: none; }
.x-mbar__scrim { position: fixed; inset: 0; z-index: 59; }
</style>
