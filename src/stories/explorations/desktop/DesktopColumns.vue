<script setup lang="ts">
/**
 * B "Docked columns": a tiling desktop. Windows snap to 1/3, 1/2 or 2/3 columns (Super+Left/Right), never overlap.
 * Events is a panel that slides in from the right (Super+N or the notification count).
 */
import { ref, computed, watch } from 'vue';
import XDesktop from './XDesktop.vue';
import XTopBar from './XTopBar.vue';
import XWindow from './XWindow.vue';
import XHints from './XHints.vue';
import XMiniApp from '../parts/XMiniApp.vue';
import XEvents from '../parts/XEvents.vue';
import XKey from '../parts/XKey.vue';
import HdButton from '../../../components/HdButton.vue';
import { useDesktopKeys } from './useDesktopKeys';
type Layout = 'thirds' | 'halves' | 'two-thirds';
const props = withDefaults(defineProps<{ layout?: Layout; events?: boolean; snapping?: boolean }>(), { layout: 'thirds', events: false, snapping: false });
const lay = ref<Layout>(props.layout);
const events = ref(props.events);
watch(() => props.layout, (v) => (lay.value = v));
watch(() => props.events, (v) => (events.value = v));
const W = 1920, H = 1052, G = 8;
const LAYOUTS: Record<Layout, { app: string; title: string; f: number }[]> = {
  thirds: [{ app: 'Mail', title: 'Inbox', f: 1 / 3 }, { app: 'Calendar', title: 'Calendar', f: 1 / 3 }, { app: 'Messages', title: 'Anna Virtanen', f: 1 / 3 }],
  halves: [{ app: 'Mail', title: 'Inbox', f: 1 / 2 }, { app: 'Browser', title: 'Harmattan journal', f: 1 / 2 }],
  'two-thirds': [{ app: 'Mail', title: 'Inbox', f: 2 / 3 }, { app: 'Messages', title: 'Anna Virtanen', f: 1 / 3 }],
};
const cols = computed(() => {
  let x = G; const list = LAYOUTS[lay.value];
  return list.map((c, i) => { const w = Math.round(c.f * (W - G * (list.length + 1)) ); const r = { ...c, x, y: G, w, h: H - 2 * G, i }; x += w + G; return r; });
});
const focused = ref(0);
useDesktopKeys((e) => {
  if (e.metaKey && e.key === 'ArrowLeft') lay.value = lay.value === 'thirds' ? 'two-thirds' : lay.value === 'two-thirds' ? 'halves' : 'thirds';
  else if (e.metaKey && e.key === 'ArrowRight') lay.value = lay.value === 'thirds' ? 'halves' : lay.value === 'halves' ? 'two-thirds' : 'thirds';
  else if (e.metaKey && (e.key === 'n' || e.key === 'N')) events.value = !events.value;
  else if (e.key === 'Escape') events.value = false;
});
</script>
<template>
  <XDesktop :label="`Docked columns: ${lay}${events ? ' + Events panel' : ''}`">
    <XTopBar :app="cols[focused]?.app" :active="events ? 'events' : null" @events="events = !events" />
    <div class="x-desktop__area">
      <XWindow v-for="c in cols" :key="lay + c.app" :title="c.title" :app="c.app" :x="c.x" :y="c.y" :w="c.w" :h="c.h" tiled :focused="focused === c.i" @focus="focused = c.i">
        <XMiniApp :name="c.app" chrome="headerbar" density="pointer" :id-prefix="`db-${c.app}`" />
      </XWindow>
      <!-- snap preview while dragging Messages towards the right edge -->
      <template v-if="snapping">
        <div class="x-snap" :style="{ left: `${W - G - Math.round((W - 4 * G) / 3)}px`, width: `${Math.round((W - 4 * G) / 3)}px` }"><span class="x-snap__chip hd-on-overlay"><span>Snap to right third</span><XKey keys="Super+Right" /></span></div>
        <div class="x-snap__zones" aria-hidden="true"><span>1/3</span><span>1/2</span><span>2/3</span></div>
      </template>
      <XHints :items="[['Super+Left', 'Snap left'], ['Super+Right', 'Snap right'], ['Super+Up', 'Widen column'], ['Super+N', 'Events'], ['Alt+Tab', 'Next column']]" />
      <div v-if="events" class="x-panel-scrim" @click="events = false"></div>
      <Transition name="x-slide">
        <aside v-if="events" class="x-epanel hd-on-home" aria-label="Events">
          <div class="x-epanel__head"><XKey keys="Esc" /><HdButton variant="plain" @click="events = false">Clear all</HdButton></div>
          <XEvents :columns="1" :thumb="44" />
        </aside>
      </Transition>
    </div>
  </XDesktop>
</template>
<style>
.x-snap { position: absolute; top: 8px; bottom: 8px; z-index: 15; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; border-radius: 6px;
  background: color-mix(in srgb, var(--hd-accent) 22%, transparent); outline: 2px solid var(--hd-accent); outline-offset: -2px; color: var(--hd-c-fg); font: 700 var(--hd-font-size-default)/1 var(--hd-font-family-base); }
.x-snap__chip { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay); }
.x-snap__zones { position: absolute; top: 16px; left: 50%; transform: translateX(-50%); z-index: 16; display: flex; gap: 4px; padding: 4px; border-radius: 999px; background: var(--hd-surface-overlay); }
.x-snap__zones span { padding: 6px 14px; border-radius: 999px; color: var(--hd-surface-overlay-fg); font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); }
.x-snap__zones span:first-child { background: var(--hd-accent); color: #fff; }
.x-epanel { position: absolute; top: 0; right: 0; bottom: 0; z-index: 25; width: 440px; overflow: hidden; background: color-mix(in srgb, var(--hd-surface-home) 96%, transparent); color: var(--hd-c-fg); box-shadow: -12px 0 40px rgba(0,0,0,.45); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); }
.x-epanel__head { position: absolute; right: 12px; top: 18px; z-index: 1; display: flex; align-items: center; gap: 8px; }
.x-slide-enter-active, .x-slide-leave-active { transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.x-slide-enter-from, .x-slide-leave-to { transform: translateX(100%); }
</style>
