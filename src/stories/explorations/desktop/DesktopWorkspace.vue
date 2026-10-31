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
import XOverview from '../parts/XOverview.vue';
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
  { title: 'Etesian journal', app: 'Browser', x: 70, y: 40, w: 900, h: 620, z: 1 },
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
        <XOverview v-if="overview" v-model:query="q" @open="(n: string) => { focused = n; overview = false; }" />
      </Transition>
    </div>
  </XDesktop>
</template>
