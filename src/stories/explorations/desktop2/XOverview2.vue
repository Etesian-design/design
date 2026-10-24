<script setup lang="ts">
/**
 * Desktop v2 overview (Super): the N9 home as three side-by-side views on a horizontal track — Events, Windows,
 * Applications — with big light titles and page dots. Left/Right (or a three-finger swipe) flick between them;
 * the neighbours peek in at the edges. Typing jumps to Applications and filters.
 */
import { computed } from 'vue';
import HdPageIndicator from '../../../components/HdPageIndicator.vue';
import HdSearchField from '../../../components/HdSearchField.vue';
import XEvents from '../parts/XEvents.vue';
import XAppsView from '../parts/XAppsView.vue';
import XOpenApps from '../parts/XOpenApps.vue';
import XHints from '../desktop/XHints.vue';
const props = withDefaults(defineProps<{ page?: number; query?: string; width?: number; offset?: number; hints?: boolean; left?: number }>(), { page: 1, query: '', width: 1920, offset: 0, hints: true, left: 0 });
const emit = defineEmits<{ 'update:page': [p: number]; 'update:query': [q: string]; open: [name: string] }>();
const PEEK = 96, G = 48;
const vw = computed(() => props.width - props.left - 2 * PEEK - 2 * G);
const x = computed(() => PEEK + G - (props.page + props.offset) * (vw.value + G));
const TITLES = ['Events', 'Windows', 'Applications'];
const SUBS = ['4 new · Super+N opens them beside your windows', '5 open · Enter focuses, Delete closes', 'Type to search apps, people, mail and files'];
const WINS = ['Mail', 'Browser', 'Messages', 'Calendar', 'Music'];
</script>
<template>
  <div class="x-ov2 hd-on-home" role="dialog" aria-label="Overview" :style="{ paddingLeft: `${left}px` }">
    <div class="x-ov2__dots">
      <button v-for="(t, i) in TITLES" :key="t" type="button" class="x-ov2__tab hd-focusable" :class="{ 'is-on': i === page }" @click="emit('update:page', i)">{{ t }}</button>
      <HdPageIndicator :total="3" :current="page" interactive label="Overview views" @select="(i: number) => emit('update:page', i)" />
    </div>
    <div class="x-ov2__clip">
      <div class="x-ov2__track" :style="{ transform: `translateX(${x}px)`, gap: `${G}px` }">
        <section v-for="(t, i) in TITLES" :key="t" class="x-ov2__view" :class="{ 'is-on': i === page }" :style="{ width: `${vw}px` }" :aria-label="t" @click="i !== page && emit('update:page', i)">
          <header class="x-ov2__head"><h2 class="x-ov2__h">{{ t }}</h2><p class="x-ov2__sub">{{ SUBS[i] }}</p></header>
          <XEvents v-if="i === 0" :columns="2" :title="false" :thumb="56" />
          <XOpenApps v-else-if="i === 1" :apps="WINS" :cols="3" :w="1280" :h="800" chrome="none" hover-close :focus="0" :gap="40" @open="(n: string) => emit('open', n)" />
          <div v-else class="x-ov2__apps">
            <HdSearchField :model-value="query" placeholder="Type to search" label="Search" @update:model-value="(v: string) => emit('update:query', v)" />
            <p v-if="query" class="x-ov2__sub">Apps matching “{{ query }}” · Enter opens the first</p>
            <XAppsView :columns="8" :size="72" :query="query" @open="(n: string) => emit('open', n)" />
          </div>
        </section>
      </div>
    </div>
    <XHints v-if="hints" corner="br" :items="[['Left+Right', 'Flick views'], ['Super+N', 'Events'], ['Enter', 'Open'], ['Delete', 'Close window'], ['Esc', 'Back to desktop']]" />
  </div>
</template>
<style>
.x-ov2 { position: absolute; inset: 0; z-index: 35; display: flex; flex-direction: column; color: var(--hd-c-fg);
  background: radial-gradient(1100px 600px at 60% 20%, color-mix(in srgb, var(--hd-accent) 18%, transparent), transparent 70%), var(--hd-surface-home); }
.x-ov2__dots { flex: none; display: flex; align-items: center; justify-content: center; gap: 22px; height: 48px; }
.x-ov2__tab { padding: 4px 6px; border: 0; background: none; color: var(--hd-c-fg-secondary); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); cursor: pointer; }
.x-ov2__tab.is-on { color: var(--hd-c-fg); font-weight: 700; }
.x-ov2__dots .hd-page-indicator { margin-left: 8px; }
.x-ov2__clip { position: relative; flex: 1; min-height: 0; overflow: hidden; }
.x-ov2__track { position: absolute; top: 0; bottom: 0; left: 0; display: flex; transition: transform var(--hd-motion-duration-slow) var(--hd-motion-easing-out); }
.x-ov2__view { flex: none; min-width: 0; overflow: hidden; opacity: .35; transform: scale(.96); transition: opacity var(--hd-motion-duration-slow), transform var(--hd-motion-duration-slow); cursor: pointer;
  -webkit-mask-image: linear-gradient(#000 calc(100% - 60px), transparent); mask-image: linear-gradient(#000 calc(100% - 60px), transparent); }
.x-ov2__view.is-on { opacity: 1; transform: none; cursor: default; }
.x-ov2__head { padding: 8px 16px 22px; }
.x-ov2__h { margin: 0; font: var(--hd-font-weight-light) 64px/1 var(--hd-font-family-light); letter-spacing: -.01em; }
.x-ov2__sub { margin: 8px 0 0; font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); }
.x-ov2__view .x-open { padding: 0 16px; }
.x-ov2__apps { padding: 0 16px; }
.x-ov2__apps .hd-search-field, .x-ov2__apps .hd-field { max-width: 640px; }
.x-ov2__apps .x-apps__grid { padding-top: 28px; row-gap: 36px; }
</style>
