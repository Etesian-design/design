<script setup lang="ts">
/**
 * Tablet home (T1/T2): the three N9 home views, Events / Applications / Open applications, scaled up.
 * eventsBeside (T2, opt-in, landscape only): Events as a column beside the app grid.
 */
import { ref, computed, watch } from 'vue';
import HdPageIndicator from '../../../components/HdPageIndicator.vue';
import XEvents from '../parts/XEvents.vue';
import XAppsView from '../parts/XAppsView.vue';
import XOpenApps from '../parts/XOpenApps.vue';
import XMiniApp from '../parts/XMiniApp.vue';
const props = withDefaults(defineProps<{ orientation?: 'landscape' | 'portrait'; view?: number; grid?: '3x3' | '4x3'; eventsBeside?: boolean }>(), { orientation: 'landscape', view: 1, grid: '3x3' });
const current = ref(props.view);
watch(() => props.view, (v) => (current.value = v));
const opened = ref<string | null>(null);
const land = computed(() => props.orientation === 'landscape');
const beside = computed(() => props.eventsBeside && land.value);
const W = computed(() => (land.value ? 1280 : 800));
const H = computed(() => (land.value ? 800 : 1280));
const OPEN = ['Mail', 'Messages', 'Calendar', 'Music', 'Gallery', 'Browser', 'Notes', 'Settings', 'Mail', 'Messages', 'Calendar', 'Music'];
const cols = computed(() => (props.grid === '4x3' ? 4 : 3));
const openApps = computed(() => OPEN.slice(0, cols.value * 3));
/* fit cols x 3 live cards (same aspect as the screen) into the view */
const gridWidth = computed(() => {
  const g = 24, title = 26, availW = W.value - 64, availH = H.value - 24 - 40 - 40;
  const a = H.value / W.value;
  const w = Math.min((availW - (cols.value - 1) * g) / cols.value, (availH - 3 * title - 2 * g) / 3 / a);
  return Math.floor(cols.value * w + (cols.value - 1) * g);
});
const views = ['Events', 'Applications', 'Open applications'];
</script>
<template>
  <div class="x-thome hd-on-home">
    <template v-if="opened">
      <div class="x-thome__app"><XMiniApp :name="opened" :landscape="land" chrome="toolbar" @back="opened = null" /></div>
      <button type="button" class="x-thome__edge hd-focusable" @click="opened = null">Swipe from any edge to go home</button>
    </template>
    <template v-else>
      <div class="x-thome__view">
        <div v-if="beside && current !== 2" class="x-thome__beside">
          <aside class="x-thome__events-col" aria-label="Events"><XEvents :columns="1" :thumb="48" /></aside>
          <div class="x-thome__apps-col"><h2 class="x-thome__h">Applications</h2><XAppsView :columns="5" :size="64" @open="opened = $event" /></div>
        </div>
        <XEvents v-else-if="current === 0" :columns="2" class="x-thome__pad" />
        <div v-else-if="current === 1" class="x-thome__pad"><h2 class="x-thome__h">Applications</h2><XAppsView :columns="6" :size="land ? 64 : 72" @open="opened = $event" /></div>
        <div v-else class="x-thome__open">
          <XOpenApps :apps="openApps" :cols="cols" :w="W" :h="H" :gap="24" :style="{ maxWidth: `${gridWidth}px` }" @open="opened = $event" />
        </div>
      </div>
      <HdPageIndicator class="x-thome__dots" :total="beside ? 2 : 3" :current="beside ? (current === 2 ? 1 : 0) : current" interactive label="Home views"
        @select="(i: number) => (current = beside ? (i === 1 ? 2 : 1) : i)" />
      <p class="x-thome__label" aria-live="polite">{{ beside && current !== 2 ? 'Events + Applications' : views[current] }}</p>
    </template>
  </div>
</template>
<style>
.x-thome { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; background: var(--hd-surface-home); color: var(--hd-c-fg); }
.x-thome__view { flex: 1; min-height: 0; overflow: hidden; margin-bottom: 40px; }
.x-thome__pad { padding: 8px 24px; }
.x-thome__h { margin: 0; padding: 18px 16px 0; font: var(--hd-font-weight-light) var(--hd-font-size-xxlarge)/1 var(--hd-font-family-light); }
.x-thome__open { height: 100%; display: flex; align-items: center; justify-content: center; padding: 16px 32px; }
.x-thome__open .x-open { width: 100%; }
.x-thome__beside { display: grid; grid-template-columns: 420px 1fr; height: 100%; }
.x-thome__events-col { border-right: 1px solid var(--hd-c-divider); overflow: hidden; background: color-mix(in srgb, var(--hd-c-fg) 4%, transparent); }
.x-thome__apps-col { min-width: 0; padding: 8px 16px; }
.x-thome__dots { position: absolute; left: 0; right: 0; bottom: 14px; justify-content: center; }
.x-thome__label { position: absolute; left: 24px; bottom: 12px; margin: 0; font-size: var(--hd-font-size-xsmall); color: var(--hd-c-fg-secondary); }
.x-thome__app { flex: 1; min-height: 0; display: flex; }
.x-thome__edge { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); padding: 6px 14px; border: 0; border-radius: 999px; background: var(--hd-surface-banner); color: var(--hd-surface-banner-fg); font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); cursor: pointer; opacity: .9; }
</style>
