<script setup lang="ts">
/**
 * The classic layout: one app at a time, as a calm web app, for doing one thing fast. The desktop is the place for many
 * windows; this is the efficient single task. A top bar in the page's own colours (the web styling): the apps button (an
 * app grid in a dropdown, recent apps first, with search: no permanent sidebar), the app's squircle and title (a menu of
 * its views when it has them), its actions by the same rule as a desktop window (as many as fit, the rest in ⋮), and the
 * status at the right. Under 600 px the phone pattern: Back and the first three actions in a bottom toolbar, the rest in ⋮.
 */
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import HdIcon from '../../components/HdIcon.vue';
import HdSquircle from '../../components/HdSquircle.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import HdToolBar from '../../components/HdToolBar.vue';
import HdSearchField from '../../components/HdSearchField.vue';
import type { XAction } from '../parts/types';
import { provideChromeHost } from '../parts/chrome';
export interface ClassicApp { id: string; title: string; icon: string; color: string }
const props = withDefaults(defineProps<{
  brand?: string; apps: ClassicApp[]; app: string; title?: string; views?: string[]; view?: string; back?: boolean; tools?: XAction[];
  recent?: string[]; status?: string; online?: boolean;
  /** Storybook: the apps menu or ⋮ starts open */
  gridOpen?: boolean; moreOpen?: boolean;
}>(), { brand: 'Cloud Companion', tools: () => [], recent: () => [], online: true, gridOpen: false, moreOpen: false });
const emit = defineEmits<{ open: [id: string]; back: []; view: [v: string]; tool: [label: string] }>();
const root = ref<HTMLElement>();
const w = ref(1200);
let ro: ResizeObserver | undefined;
onMounted(() => { ro = new ResizeObserver(([e]) => (w.value = e!.contentRect.width)); ro.observe(root.value!); });
onBeforeUnmount(() => ro?.disconnect());
/* the page inside declares its header with useChrome(); it wins over the props */
const host = provideChromeHost();
const pc = computed(() => host.state.c);
const views = computed(() => pc.value?.views ?? props.views);
const back = computed(() => pc.value?.back ?? props.back);
const tools = computed<XAction[]>(() => pc.value?.tools ?? props.tools);
const grid = ref(props.gridOpen), more = ref(props.moreOpen), viewMenu = ref(false), q = ref('');
watch(() => props.gridOpen, (v) => (grid.value = v));
const cur = computed(() => props.apps.find((a) => a.id === props.app));
const narrow = computed(() => w.value < 600);
const shownTitle = computed(() => (views.value?.length ? (pc.value?.view ?? props.view ?? views.value[0]!) : (pc.value?.title ?? props.title ?? cur.value?.title ?? '')));
/** room for actions: the width less the apps button, the brand, the title, ⋮ and the status */
const fits = computed(() => {
  const room = w.value - 56 - (w.value >= 900 ? 190 : 0) - 44 - shownTitle.value.length * 12 - 40 - 48 - 140;
  const n = Math.max(0, Math.floor(room / 44));
  return n >= tools.value.length ? tools.value.length : Math.max(0, Math.floor((room - 44) / 44));
});
const shown = computed(() => tools.value.slice(0, narrow.value ? 0 : fits.value));
const below = computed(() => tools.value.slice(0, 3));
const folded = computed(() => tools.value.slice(narrow.value ? 3 : fits.value));
const recentApps = computed(() => props.recent.map((id) => props.apps.find((a) => a.id === id)).filter((a): a is ClassicApp => !!a));
const found = computed(() => props.apps.filter((a) => a.title.toLowerCase().includes(q.value.toLowerCase())));
function open(id: string) { grid.value = false; emit('open', id); }
function tool(l: string) { more.value = false; emit('tool', l); host.emit('tool', l); }
function goBack() { emit('back'); host.emit('back'); }
function pickView(v: string) { viewMenu.value = false; emit('view', v); host.emit('view', v); }
</script>
<template>
  <div ref="root" class="x-cl" :class="{ 'is-narrow': narrow }">
    <header class="x-cl__bar">
      <button type="button" class="x-cl__apps hd-sq hd-focusable" aria-label="Apps" :aria-expanded="grid ? 'true' : 'false'" @click="grid = !grid"><HdIcon name="grid" :size="22" /></button>
      <span v-if="w >= 900" class="x-cl__brand"><slot name="logo" />{{ brand }}</span>
      <span class="x-cl__sep" aria-hidden="true"></span>
      <HdToolIcon v-if="back && !narrow" icon="back" label="Back" @click="goBack" />
      <HdSquircle v-else-if="cur" :size="28" :color="cur.color" lighting="lit"><HdIcon :name="cur.icon" :size="16" lit /></HdSquircle>
      <button v-if="views?.length" type="button" class="x-cl__title is-menu hd-sqh hd-focusable" :aria-expanded="viewMenu ? 'true' : 'false'" aria-haspopup="listbox" @click="viewMenu = !viewMenu">{{ shownTitle }}<HdIcon name="chevron-down" :size="16" /></button>
      <h1 v-else class="x-cl__title">{{ shownTitle }}</h1>
      <span class="x-cl__gap"></span>
      <span v-if="!narrow" class="x-cl__actions" role="toolbar" :aria-label="`${shownTitle} actions`">
        <HdToolIcon v-for="t in shown" :key="t.label" :icon="t.icon" :label="t.label" @click="tool(t.label)" />
        <HdToolIcon v-if="folded.length" icon="more-vert" label="More" @click.stop="more = !more" />
      </span>
      <span v-if="status && w >= 760" class="x-cl__status" :class="{ 'is-off': !online }"><HdIcon :name="online ? 'check' : 'warning'" :size="16" />{{ status }}</span>
    </header>
    <div v-if="viewMenu && views?.length" class="x-cl__pop x-cl__views hd-on-overlay" role="listbox">
      <button v-for="v in views" :key="v" type="button" role="option" class="x-cl__item hd-focusable" :aria-selected="v === shownTitle ? 'true' : 'false'" @click="pickView(v)">
        <span class="x-cl__mark hd-sq" :class="{ 'is-on': v === shownTitle }"><HdIcon v-if="v === shownTitle" name="check" :size="14" /></span>{{ v }}</button>
    </div>
    <div v-if="grid" class="x-cl__pop x-cl__grid" role="dialog" aria-label="Apps">
      <HdSearchField v-model="q" placeholder="Find an app" />
      <template v-if="recentApps.length && !q"><p class="x-cl__label">Recent</p>
        <div class="x-cl__icons"><button v-for="a in recentApps" :key="a.id" type="button" class="x-cl__icon hd-focusable" @click="open(a.id)"><HdSquircle :size="48" :color="a.color" lighting="lit"><HdIcon :name="a.icon" :size="26" lit /></HdSquircle><span>{{ a.title }}</span></button></div>
        <p class="x-cl__label">All apps</p></template>
      <div class="x-cl__icons"><button v-for="a in found" :key="a.id" type="button" class="x-cl__icon hd-focusable" :class="{ 'is-on': a.id === app }" @click="open(a.id)"><HdSquircle :size="48" :color="a.color" lighting="lit"><HdIcon :name="a.icon" :size="26" lit /></HdSquircle><span>{{ a.title }}</span></button></div>
    </div>
    <div v-if="more && folded.length" class="x-cl__pop x-cl__more hd-on-overlay" :class="{ 'is-below': narrow }" role="menu">
      <button v-for="t in folded" :key="t.label" type="button" role="menuitem" class="x-cl__item hd-focusable" @click="tool(t.label)"><HdIcon :name="t.icon" :size="20" /><span>{{ t.label }}</span></button>
    </div>
    <main class="x-cl__main"><slot /></main>
    <HdToolBar v-if="narrow && (back || tools.length)" :back="back" :label="`${shownTitle} toolbar`" @back="goBack">
      <HdToolIcon v-for="t in below" :key="t.label" :icon="t.icon" :label="t.label" @click="tool(t.label)" />
      <template v-if="folded.length" #right><HdToolIcon icon="more-vert" label="More" @click.stop="more = !more" /></template>
    </HdToolBar>
  </div>
</template>
<style>
.x-cl { position: relative; display: flex; flex-direction: column; height: 100%; min-height: 0; background: var(--hd-c-bg); color: var(--hd-c-fg); }
.x-cl__bar { flex: none; display: flex; align-items: center; gap: 6px; height: 56px; padding: 0 12px; border-bottom: 1px solid var(--hd-c-divider); background: var(--hd-c-bg); }
.x-cl__apps { position: relative; flex: none; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 0; color: inherit; cursor: pointer; --hd-sq-size: 40px; }
.x-cl__apps:hover, .x-cl__apps[aria-expanded=true] { --hd-sq-fill: var(--hd-c-pressed); }
.x-cl__brand { display: inline-flex; align-items: center; gap: 8px; margin-left: 4px; font: 700 var(--hd-font-size-default)/1 var(--hd-font-family-base); white-space: nowrap; }
.x-cl__sep { flex: none; width: 1px; height: 24px; margin: 0 8px; background: var(--hd-c-divider); }
.x-cl__title { min-width: 0; margin: 0 4px; padding: 0; border: 0; background: none; color: inherit; font: var(--hd-font-weight-light) 24px/1 var(--hd-font-family-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x-cl__title.is-menu { display: inline-flex; align-items: center; gap: 4px; height: 38px; padding: 0 10px; border-radius: 19px; cursor: pointer; }
.x-cl__title.is-menu:hover, .x-cl__title.is-menu[aria-expanded=true] { background: var(--hd-c-pressed); }
.x-cl__gap { flex: 1; }
.x-cl__actions { flex: none; display: inline-flex; }
.x-cl__status { display: inline-flex; align-items: center; gap: 6px; margin-left: 8px; color: var(--hd-color-palette-positive, #3A8A1E); font-size: var(--hd-font-size-small); white-space: nowrap; }
.x-cl__status.is-off { color: var(--hd-c-fg-secondary); }
.x-cl__main { flex: 1; min-height: 0; display: flex; overflow: auto; container-type: inline-size; }
.x-cl__pop { position: absolute; z-index: 20; top: 52px; border-radius: var(--hd-radius-card); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); }
.x-cl__views, .x-cl__more { min-width: 220px; padding: 6px 0; background: var(--hd-surface-overlay); color: var(--hd-c-fg); }
.x-cl__views { left: 120px; } .x-cl__more { right: 12px; }
.x-cl__item { display: flex; align-items: center; gap: 12px; width: 100%; height: 44px; padding: 0 16px 0 12px; border: 0; background: none; color: inherit; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1 var(--hd-font-family-light); text-align: left; cursor: pointer; }
.x-cl__item:hover { background: var(--hd-c-pressed); }
.x-cl__mark { position: relative; flex: none; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; --hd-sq-size: 22px; --hd-sq-ring: var(--hd-c-divider); color: #fff; }
.x-cl__mark.is-on { --hd-sq-fill: var(--hd-accent); --hd-sq-ring: transparent; }
.x-cl__mark .hd-icon { position: relative; z-index: 1; } .x-cl__more.is-below { top: auto; bottom: 64px; right: 8px; }
.x-cl__grid { left: 8px; width: min(560px, calc(100% - 16px)); max-height: calc(100% - 64px); overflow: auto; padding: 14px; background: var(--hd-c-bg); }
.x-cl__label { margin: 14px 4px 4px; color: var(--hd-c-fg-secondary); font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); }
.x-cl__icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 8px 4px; }
.x-cl__icon { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 2px; border: 0; border-radius: 12px; background: none; color: inherit; font: 400 var(--hd-font-size-small)/1.1 var(--hd-font-family-base); cursor: pointer; }
.x-cl__icon:hover { background: var(--hd-c-pressed); }
.x-cl__icon.is-on span { font-weight: 700; }
.x-cl.is-narrow .x-cl__title { font-size: 21px; }
</style>
