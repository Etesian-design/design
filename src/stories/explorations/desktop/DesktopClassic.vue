<script setup lang="ts">
/** C "Classic + Harmattan look": taskbar, overlapping windows; the start menu is the app grid, the notification panel is the Events feed. */
import { ref, watch } from 'vue';
import XDesktop from './XDesktop.vue';
import XWindow from './XWindow.vue';
import XHints from './XHints.vue';
import XDockIcon from './XDockIcon.vue';
import XMiniApp from '../parts/XMiniApp.vue';
import XEvents from '../parts/XEvents.vue';
import XAppsView from '../parts/XAppsView.vue';
import XKey from '../parts/XKey.vue';
import HdSearchField from '../../../components/HdSearchField.vue';
import HdAvatar from '../../../components/HdAvatar.vue';
import HdButton from '../../../components/HdButton.vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdCountBubble from '../../../components/HdCountBubble.vue';
import HdSectionHeader from '../../../components/HdSectionHeader.vue';
import { useDesktopKeys } from './useDesktopKeys';
type Panel = 'none' | 'start' | 'events';
const props = withDefaults(defineProps<{ panel?: Panel }>(), { panel: 'none' });
const panel = ref<Panel>(props.panel);
watch(() => props.panel, (v) => (panel.value = v));
const q = ref('');
const focused = ref('Mail');
const toggle = (p: Panel) => (panel.value = panel.value === p ? 'none' : p);
useDesktopKeys((e) => {
  if (e.key === 'Meta' || e.key === 'OS') toggle('start');
  else if (e.key === 'Escape') panel.value = 'none';
});
const wins = [
  { title: 'Gallery', app: 'Gallery', x: 120, y: 60, w: 860, h: 600, z: 1 },
  { title: 'Inbox', app: 'Mail', x: 460, y: 140, w: 1040, h: 700, z: 3 },
  { title: 'Now playing', app: 'Music', x: 1320, y: 80, w: 540, h: 520, z: 2 },
];
const PINNED = ['Browser', 'Mail', 'Messages', 'Calendar', 'Gallery', 'Music', 'Notes', 'Settings'];
const RUNNING = new Set(['Mail', 'Gallery', 'Music']);
</script>
<template>
  <XDesktop :label="panel === 'start' ? 'Start menu = app grid' : panel === 'events' ? 'Notification panel = Events' : 'Taskbar + overlapping windows'">
    <div class="x-desktop__area">
      <XWindow v-for="w in wins" :key="w.app" v-bind="w" :focused="focused === w.app" :z="focused === w.app ? 5 : w.z" @focus="focused = w.app">
        <XMiniApp :name="w.app" chrome="headerbar" density="pointer" :id-prefix="`dc-${w.app}`" />
      </XWindow>
      <XHints v-if="panel === 'none'" corner="tr" :items="[['Super', 'Start'], ['Alt+Tab', 'Switch'], ['Super+N', 'Notifications'], ['Super+D', 'Show desktop']]" />
      <div v-if="panel !== 'none'" class="x-panel-scrim x-panel-scrim--clear" @click="panel = 'none'"></div>
      <Transition name="x-pop-up">
        <section v-if="panel === 'start'" class="x-start hd-on-home" aria-label="Start">
          <HdSearchField v-model="q" placeholder="Type to search" />
          <HdSectionHeader title="All applications" align="start" />
          <XAppsView :columns="6" :size="48" :query="q" />
          <footer class="x-start__foot">
            <HdAvatar name="Anna Virtanen" :size="32" /><span>Anna Virtanen</span>
            <span class="x-start__sp"></span>
            <HdButton variant="plain" icon="lock" aria-label="Lock" /><HdButton variant="plain" icon="settings" aria-label="Settings" />
          </footer>
        </section>
      </Transition>
      <Transition name="x-pop-up">
        <section v-if="panel === 'events'" class="x-notif hd-on-home" aria-label="Notifications">
          <div class="x-notif__head"><XKey keys="Esc" /><HdButton variant="plain">Clear all</HdButton></div>
          <XEvents :columns="1" :thumb="40" />
        </section>
      </Transition>
    </div>
    <nav class="x-taskbar hd-on-chrome" aria-label="Taskbar">
      <button type="button" class="x-taskbar__start hd-sq hd-focusable" :class="{ 'is-active': panel === 'start' }" aria-label="Start (Super)" @click="toggle('start')"><HdIcon name="grid" :size="22" /></button>
      <XKey keys="Super" />
      <span class="x-taskbar__apps"><XDockIcon v-for="p in PINNED" :key="p" :name="p" :running="RUNNING.has(p)" :active="focused === p" :size="32" /></span>
      <span class="x-taskbar__tray">
        <HdIcon name="wifi" :size="16" label="Wi-Fi" /><HdIcon name="bluetooth" :size="16" label="Bluetooth" /><HdIcon name="battery" :size="18" label="Battery 82%" />
        <span class="x-taskbar__clock"><b>12:45</b><span>24/10/2026</span></span>
        <button type="button" class="x-taskbar__notif hd-focusable" :class="{ 'is-active': panel === 'events' }" aria-label="4 notifications" @click="toggle('events')"><HdCountBubble :value="4" /></button>
      </span>
    </nav>
  </XDesktop>
</template>
<style>
.x-taskbar { position: relative; z-index: 30; flex: none; display: flex; align-items: center; gap: 8px; height: 52px; padding: 0 10px; background: var(--hd-surface-chrome); color: var(--hd-c-fg); }
.x-taskbar__start { width: 44px; height: 44px; border: 0; color: inherit; cursor: pointer; --hd-sq-size: 40px; --hd-sq-fill: var(--hd-accent); color: #fff; }
.x-taskbar__start:hover, .x-taskbar__start.is-active { --hd-sq-fill: color-mix(in srgb, var(--hd-accent) 80%, #fff); }
.x-taskbar__apps { display: inline-flex; gap: 4px; margin-left: 12px; }
.x-taskbar__tray { margin-left: auto; display: inline-flex; align-items: center; gap: 14px; }
.x-taskbar__clock { display: inline-flex; flex-direction: column; align-items: flex-end; gap: 2px; font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); font-variant-numeric: tabular-nums; }
.x-taskbar__notif { display: inline-flex; align-items: center; height: 32px; padding: 0 6px; border: 0; border-radius: 999px; background: transparent; cursor: pointer; }
.x-taskbar__notif:hover, .x-taskbar__notif.is-active { background: var(--hd-c-pressed); }
.x-panel-scrim--clear { background: transparent; }
.x-start { position: absolute; left: 10px; bottom: 10px; z-index: 26; width: 680px; padding: 16px; border-radius: var(--hd-radius-card); background: color-mix(in srgb, var(--hd-surface-home) 95%, transparent); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); }
.x-start .x-apps__grid { padding: 8px 0 12px; row-gap: 18px; }
.x-start__foot { display: flex; align-items: center; gap: 10px; padding-top: 12px; border-top: 1px solid var(--hd-c-divider); font-size: var(--hd-font-size-small); }
.x-start__sp { flex: 1; }
.x-notif { position: absolute; right: 10px; bottom: 10px; top: 10px; z-index: 26; width: 440px; overflow: hidden; border-radius: var(--hd-radius-card); background: color-mix(in srgb, var(--hd-surface-home) 96%, transparent); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); }
.x-notif__head { position: absolute; right: 12px; top: 18px; display: flex; align-items: center; gap: 8px; }
.x-pop-up-enter-active, .x-pop-up-leave-active { transition: opacity var(--hd-motion-duration-fast) var(--hd-motion-easing-out), transform var(--hd-motion-duration-fast) var(--hd-motion-easing-out); }
.x-pop-up-enter-from, .x-pop-up-leave-to { opacity: 0; transform: translateY(12px); }
</style>
