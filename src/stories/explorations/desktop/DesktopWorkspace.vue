<script setup lang="ts">
/**
 * A "Workspace overview": free, resizable windows with slim title bars, slim top bar, no taskbar.
 * Super opens a full-screen overview: Events left, open windows as live thumbnails in the middle, app grid with type-to-search right.
 */
import { ref, watch } from 'vue';
import XDesktop from './XDesktop.vue';
import XTopBar from './XTopBar.vue';
import XWindow from './XWindow.vue';
import XHints from './XHints.vue';
import XMiniApp from '../parts/XMiniApp.vue';
import XEvents from '../parts/XEvents.vue';
import XAppsView from '../parts/XAppsView.vue';
import XOpenApps from '../parts/XOpenApps.vue';
import HdSearchField from '../../../components/HdSearchField.vue';
import { useDesktopKeys } from './useDesktopKeys';
const props = withDefaults(defineProps<{ state?: 'windows' | 'overview'; query?: string }>(), { state: 'windows', query: '' });
const overview = ref(props.state === 'overview');
const q = ref(props.query);
const focused = ref('Mail');
watch(() => props.state, (v) => (overview.value = v === 'overview'));
watch(() => props.query, (v) => (q.value = v));
useDesktopKeys((e) => {
  if (e.key === 'Meta' || e.key === 'OS') { overview.value = !overview.value; return; }
  if (!overview.value) return;
  if (e.key === 'Escape') { overview.value = false; q.value = ''; }
  else if (e.key === 'Backspace') q.value = q.value.slice(0, -1);
  else if (e.key.length === 1 && !(e.target instanceof HTMLInputElement)) q.value += e.key;
});
const wins = [
  { title: 'Harmattan journal', app: 'Browser', x: 70, y: 40, w: 900, h: 620, z: 1 },
  { title: 'Inbox', app: 'Mail', x: 400, y: 110, w: 1080, h: 720, z: 3 },
  { title: 'Anna Virtanen', app: 'Messages', x: 1400, y: 250, w: 460, h: 640, z: 2 },
];
</script>
<template>
  <XDesktop :label="overview ? 'Overview (Super)' : 'Windows'">
    <XTopBar :app="overview ? '' : focused" :active="overview ? 'overview' : null" @overview="overview = !overview" />
    <div class="x-desktop__area">
      <XWindow v-for="w in wins" :key="w.app" v-bind="w" :focused="focused === w.app" :z="focused === w.app ? 5 : w.z" @focus="focused = w.app">
        <XMiniApp :name="w.app" chrome="headerbar" density="pointer" :id-prefix="`da-${w.app}`" />
      </XWindow>
      <XHints v-if="!overview" :items="[['Super', 'Overview'], ['Alt+Tab', 'Switch windows'], ['Super+Up', 'Maximise'], ['Super+Down', 'Restore'], ['Ctrl+W', 'Close window']]" />

      <Transition name="x-ov">
        <div v-if="overview" class="x-ov hd-on-home" role="dialog" aria-label="Overview">
          <aside class="x-ov__events"><XEvents :columns="1" :thumb="44" /></aside>
          <section class="x-ov__wins" aria-label="Open windows">
            <h2 class="x-ov__h">Windows</h2>
            <XOpenApps :apps="['Mail', 'Messages', 'Browser']" :cols="2" :w="1280" :h="840" chrome="headerbar" hover-close :focus="0" :gap="32" @open="(n: string) => { focused = n; overview = false; }" />
          </section>
          <section class="x-ov__apps" aria-label="Applications">
            <HdSearchField v-model="q" placeholder="Type to search apps, contacts, mail" label="Search" />
            <p class="x-ov__hint">{{ q ? `Apps matching “${q}”` : 'Just start typing' }}</p>
            <XAppsView :columns="5" :size="54" :query="q" />
          </section>
          <XHints corner="br" :items="[['Esc', 'Close'], ['Tab', 'Next column'], ['Left+Right', 'Move'], ['Enter', 'Open'], ['Ctrl+W', 'Close window']]" />
        </div>
      </Transition>
    </div>
  </XDesktop>
</template>
<style>
.x-ov { position: absolute; inset: 0; z-index: 20; display: grid; grid-template-columns: 420px 1fr 600px; gap: 0; background: color-mix(in srgb, var(--hd-surface-home) 92%, transparent); color: var(--hd-c-fg); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px); }
.x-ov__events { overflow: hidden; border-right: 1px solid var(--hd-c-divider); }
.x-ov__wins { min-width: 0; padding: 18px 40px; overflow: hidden; }
.x-ov__h { margin: 0 0 18px; font: var(--hd-font-weight-light) var(--hd-font-size-xxlarge)/1 var(--hd-font-family-light); }
.x-ov__apps { min-width: 0; padding: 24px 24px; border-left: 1px solid var(--hd-c-divider); overflow: hidden; }
.x-ov__hint { margin: 8px 4px 0; font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); }
.x-ov-enter-active, .x-ov-leave-active { transition: opacity var(--hd-motion-duration-default) var(--hd-motion-easing-out), transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.x-ov-enter-from, .x-ov-leave-to { opacity: 0; transform: scale(1.02); }
</style>
