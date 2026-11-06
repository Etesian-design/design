<script setup lang="ts">
/**
 * The browser's frame: one row under the window header with Back, Forward, Reload, the address field (the site's state as a
 * lock or a warning, squircle-half ends) and ⋯ for zoom, other devices and the rest. The tabs are XBrowserTabs: in the
 * window's decoration, in place of its title, as Chrome has them in its title bar (`tabsAt: top`; the frame declares them
 * with useChrome, so the page around it must not declare its own header), or a list on the left (`tabsAt: side`). Outside a
 * window or the classic layout (no host) the top tabs are a strip above the row; the tab count opens a picker of page thumbnails at any width,
 * and in a narrow window it is the only way to the tabs. A host puts its own ⋮ menu in the `more` slot: it sits inside the
 * button's box, so a popup menu there anchors to the button (Quasar's q-menu takes its parent). In a narrow window (container under 560 px) the row moves to the bottom, as on the phone.
 */
import HdIcon from '../../components/HdIcon.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import { computed, ref, watch } from 'vue';
import { useChrome } from '../parts/chrome';
import XBrowserTabs, { type BrowserTab } from './XBrowserTabs.vue';
const props = withDefaults(defineProps<{
  address?: string; secure?: boolean; back?: boolean; forward?: boolean; loading?: number;
  /** the open tabs; `top`: a strip above the navigation row, `side`: a list on the left */
  tabs?: BrowserTab[]; current?: string; tabsAt?: 'top' | 'side'; max?: number;
  /** the tab picker (page thumbnails) starts open (Storybook) */
  pickerOpen?: boolean;
}>(), { address: 'journal.example/tablet-swipe', secure: true, back: true, forward: false, tabs: () => [], tabsAt: 'top', pickerOpen: false });
const emit = defineEmits<{ go: [address: string]; back: []; forward: []; reload: []; more: []; pick: [id: string]; close: [id: string]; add: [] }>();
const picker = ref(props.pickerOpen);
watch(() => props.pickerOpen, (v) => (picker.value = v));
function choose(id: string) { picker.value = false; emit('pick', id); }
/* the tabs in the host's header (a window's decoration, the classic header bar) */
const top = computed(() => props.tabsAt === 'top' && props.tabs.length > 0);
const chrome = useChrome(() => (top.value ? { tabs: { list: props.tabs.map((t) => ({ id: t.id, title: t.title, icon: t.icon })), current: props.current ?? props.tabs[0]!.id, max: props.max } } : {}));
chrome.on('tab', (id) => id && emit('pick', id));
chrome.on('tab-close', (id) => id && emit('close', id));
chrome.on('tab-add', () => emit('add'));
</script>
<template>
  <div class="x-bf">
    <XBrowserTabs v-if="top && !chrome.hosted" class="x-bf__strip hd-on-chrome" :tabs="tabs" :current="current ?? tabs[0]!.id" :max="max" @pick="$emit('pick', $event)" @close="$emit('close', $event)" @add="$emit('add')" />
    <div class="x-bf__row hd-on-chrome" role="toolbar" aria-label="Navigation">
      <HdToolIcon icon="back" label="Back" :disabled="!back" @click="$emit('back')" />
      <HdToolIcon icon="back" label="Forward" class="x-bf__fwd" :disabled="!forward" @click="$emit('forward')" />
      <HdToolIcon icon="refresh" label="Reload" @click="$emit('reload')" />
      <label class="x-bf__addr hd-sqm hd-focusable">
        <HdIcon :name="secure ? 'lock' : 'warning'" :size="16" :class="{ 'is-warn': !secure }" :aria-label="secure ? 'Secure connection' : 'Not secure'" />
        <input :value="address" aria-label="Address" spellcheck="false" @keydown.enter="$emit('go', ($event.target as HTMLInputElement).value)" />
        <HdIcon name="star" :size="16" aria-label="Bookmark" />
      </label>
      <button v-if="tabs.length" type="button" class="x-bf__count hd-sq hd-focusable" :aria-label="`${tabs.length} tabs: show them as pages`" :aria-expanded="picker ? 'true' : 'false'" @click="picker = !picker">{{ tabs.length }}</button>
      <span class="x-bf__more"><HdToolIcon icon="more-vert" label="More: zoom, other devices, find in page" @click="$emit('more')" /><slot name="more" /></span>
      <span v-if="loading !== undefined" class="x-bf__load" :style="{ width: `${loading}%` }" aria-hidden="true"></span>
    </div>
    <div class="x-bf__main">
      <XBrowserTabs v-if="tabsAt === 'side' && tabs.length" class="x-bf__side" vertical :tabs="tabs" :current="current ?? tabs[0]!.id" :max="max" @pick="$emit('pick', $event)" @close="$emit('close', $event)" @add="$emit('add')" />
      <div class="x-bf__page"><slot /></div>
      <div v-if="picker" class="x-bf__picker" role="dialog" aria-label="Tabs">
        <div class="x-bf__grid">
          <div v-for="t in tabs" :key="t.id" class="x-bf__card" :class="{ 'is-on': t.id === current }">
            <button type="button" class="x-bf__shot hd-focusable" :aria-label="`Go to ${t.title}`" @click="choose(t.id)">
              <img v-if="t.thumb" :src="t.thumb" alt="" /><span v-else class="x-bf__blank"><HdIcon :name="t.icon ?? 'globe'" :size="32" /></span>
            </button>
            <div class="x-bf__cap"><HdIcon :name="t.icon ?? 'globe'" :size="14" /><span>{{ t.title }}</span>
              <button type="button" class="x-bt__x hd-sqh" :aria-label="`Close ${t.title}`" @click="$emit('close', t.id)"><HdIcon name="close" :size="12" /></button></div>
          </div>
          <button v-if="max === undefined || tabs.length < max" type="button" class="x-bf__card x-bf__new hd-focusable" @click="picker = false; $emit('add')"><HdIcon name="add" :size="32" /><span>New tab</span></button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.x-bf { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; background: var(--hd-c-bg); }
.x-bf__row { position: relative; flex: none; min-width: 0; display: flex; align-items: center; gap: 2px; height: 46px; padding: 0 6px; background: var(--hd-surface-chrome); color: var(--hd-c-fg); border-bottom: 1px solid var(--hd-c-divider); }
.x-bf__row .hd-tool-icon { flex: none; width: 38px; height: 40px; --hd-sq-size: 32px; }
.x-bf__row .hd-tool-icon svg { width: 20px; height: 20px; }
.x-bf__more { flex: none; display: flex; }
.x-bf__fwd svg { transform: scaleX(-1); }
.x-bf__addr { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; height: 32px; margin: 0 6px; padding: 0 14px; background: color-mix(in srgb, var(--hd-c-fg) 10%, transparent); color: var(--hd-c-fg-secondary); }
.x-bf__addr input { flex: 1; min-width: 0; border: 0; background: none; color: var(--hd-c-fg); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); outline: none; }
.x-bf__addr .is-warn { color: var(--hd-color-palette-warning); }
.x-bf__load { position: absolute; left: 0; bottom: -1px; height: 2px; background: var(--hd-accent); }
.x-bf .x-web__bar { display: none; }
/* the tab count: a squircle-ish outlined square with the number, as mobile browsers */
.x-bf__count { position: relative; flex: none; width: 26px; height: 26px; margin: 0 7px; border: 0; --hd-sq-size: 26px; --hd-sq-ring: currentColor; background: none; color: inherit; font: 700 12px/1 var(--hd-font-family-base); cursor: pointer; }
.x-bf__strip { flex: none; margin: 0; padding: 6px 6px 0; background: var(--hd-surface-chrome); }
.x-bf__main { position: relative; flex: 1; min-width: 0; min-height: 0; display: flex; }
.x-bf__side { flex: none; width: 240px; border-right: 1px solid var(--hd-c-divider); background: color-mix(in srgb, var(--hd-c-fg) 4%, var(--hd-c-bg)); }
.x-bf__picker { position: absolute; inset: 0; z-index: 3; overflow: auto; padding: 16px; background: var(--hd-surface-home); color: #fff; }
.x-bf__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
.x-bf__card { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.x-bf__shot { aspect-ratio: 3 / 4; padding: 0; border: 0; border-radius: var(--hd-radius-card); overflow: hidden; background: var(--hd-c-bg); cursor: pointer; box-shadow: 0 0 0 1px rgba(255,255,255,.15); }
.x-bf__card.is-on .x-bf__shot { box-shadow: 0 0 0 3px var(--hd-accent); }
.x-bf__shot img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.x-bf__blank { display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; color: var(--hd-c-fg-secondary); }
.x-bf__cap { display: flex; align-items: center; gap: 6px; font: 400 var(--hd-font-size-small)/1.2 var(--hd-font-family-base); }
.x-bf__cap span { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x-bf__new { align-items: center; justify-content: center; aspect-ratio: 3 / 4; border: 2px dashed rgba(255,255,255,.3); border-radius: var(--hd-radius-card); background: none; color: inherit; cursor: pointer; }
.x-bf__page { flex: 1; min-width: 0; min-height: 0; overflow: auto; display: flex; }
@container (max-width: 559px) { .x-bf__side, .x-bf__strip { display: none; } .x-bf__row { order: 2; border-bottom: 0; border-top: 1px solid var(--hd-c-divider); } }
</style>
