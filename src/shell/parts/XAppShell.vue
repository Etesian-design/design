<script setup lang="ts">
/**
 * App frame for the mockups. chrome:
 *  - toolbar   N9 bottom toolbar (Back left, actions/tabs centre, menu right); landscape = 56 n9px bar.
 *  - side      the same toolbar turned 90 degrees on the left edge (Back stays bottom-left).
 *  - headerbar desktop: toolbar moved into a header at the top of the window, Back left, menu button right, tooltips + shortcuts.
 *  - none      content only.
 */
import { ref } from 'vue';
import HdToolBar from '../../components/HdToolBar.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import HdTabBar from '../../components/HdTabBar.vue';
import HdTabButton from '../../components/HdTabButton.vue';
import HdTooltip from '../../components/HdTooltip.vue';
import XContextMenu from './XContextMenu.vue';
import XKey from './XKey.vue';
import type { XMenuItem, XAction, XTab, XChrome } from './types';
const props = withDefaults(defineProps<{
  title?: string; chrome?: XChrome; landscape?: boolean; back?: boolean; actions?: XAction[]; tabs?: XTab[]; tab?: string;
  density?: 'touch' | 'pointer'; media?: boolean; menuItems?: XMenuItem[]; menuOpen?: boolean; menuAt?: { x: number; y: number }; hints?: boolean; idPrefix?: string;
}>(), { chrome: 'toolbar', back: true, actions: () => [], density: 'touch', hints: true, idPrefix: 'x-tab', menuOpen: false });
const emit = defineEmits<{ 'update:tab': [id: string]; back: [] }>();
const menu = ref(props.menuOpen || !!props.menuAt);
const DEFAULT_MENU: XMenuItem[] = [
  { id: 'new', label: 'New window', icon: 'add', keys: 'Ctrl+N' }, { id: 'share', label: 'Share', icon: 'share', keys: 'Ctrl+Shift+S' },
  { id: 'settings', label: 'Settings', icon: 'settings', keys: 'Ctrl+,' }, { id: 'help', label: 'Help', icon: 'info', keys: 'F1', divider: true },
];
const shell = ref<HTMLElement>();
const pos = ref(props.menuAt ?? { x: 0, y: 0 });
function openMenuAt(e: MouseEvent) {
  const r = shell.value!.getBoundingClientRect(); const s = r.width / (shell.value!.offsetWidth || r.width);
  pos.value = { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s }; menu.value = true;
}
function toggleMenu() { const w = shell.value?.offsetWidth ?? 0; pos.value = { x: w - 8, y: 40 }; menu.value = !menu.value; }
const tabValue = ref(props.tab ?? props.tabs?.[0]?.id ?? '');
function setTab(id: string) { tabValue.value = id; emit('update:tab', id); }
</script>
<template>
  <div ref="shell" class="x-shell" :class="[`x-shell--${chrome}`, `x-density-${density}`, { 'x-shell--landscape': landscape, 'hd-on-media': media, 'hd-on-page': !media, 'x-shell--media': media }]"
    @contextmenu.prevent="chrome === 'headerbar' && openMenuAt($event)">
    <!-- desktop header bar -->
    <header v-if="chrome === 'headerbar'" class="x-headerbar hd-on-chrome">
      <HdTooltip v-if="back" text="Back" placement="bottom"><HdToolIcon icon="back" label="Back" @click="emit('back')" /></HdTooltip>
      <XKey v-if="back && hints" keys="Alt+Left" />
      <h2 class="x-headerbar__title">{{ title }}</h2>
      <div v-if="tabs" class="x-headerbar__tabs"><HdTabBar :model-value="tabValue" :tabs="tabs" :id-prefix="idPrefix" :label="`${title} views`" @update:model-value="setTab" /></div>
      <span class="x-headerbar__spacer"></span>
      <HdTooltip v-for="a in actions" :key="a.label" :text="a.keys ? `${a.label} (${a.keys})` : a.label" placement="bottom"><HdToolIcon :icon="a.icon" :label="a.label" /></HdTooltip>
      <HdTooltip text="Menu" placement="bottom"><HdToolIcon icon="more" label="Menu" aria-haspopup="menu" :active="menu" @click="toggleMenu" /></HdTooltip>
    </header>

    <div class="x-shell__body">
      <!-- side toolbar: menu top, tabs middle, Back bottom-left -->
      <nav v-if="chrome === 'side'" class="x-sidebar hd-on-chrome" aria-label="Toolbar">
        <HdToolIcon icon="menu" label="Menu" style="transform: rotate(180deg)" />
        <div class="x-sidebar__mid">
          <template v-if="tabs"><div role="tablist" class="x-sidebar__tabs" aria-label="Views">
            <HdTabButton v-for="t in tabs" :key="t.id" :id="`${idPrefix}-${t.id}`" :label="t.label" :icon="t.icon" :selected="t.id === tabValue" @click="setTab(t.id)" /></div></template>
          <HdToolIcon v-for="a in actions" :key="a.label" :icon="a.icon" :label="a.label" />
        </div>
        <HdToolIcon v-if="back" icon="back" label="Back" @click="emit('back')" />
      </nav>
      <main class="x-shell__content"><slot :tab="tabValue" /></main>
    </div>

    <HdToolBar v-if="chrome === 'toolbar'" :back="back" menu :landscape="landscape" class="x-shell__toolbar" @back="emit('back')">
      <HdTabBar v-if="tabs" :model-value="tabValue" :tabs="tabs" :id-prefix="idPrefix" :label="`${title} views`" @update:model-value="setTab" />
      <HdToolIcon v-for="a in actions" :key="a.label" :icon="a.icon" :label="a.label" />
    </HdToolBar>
    <XContextMenu v-model:open="menu" :items="menuItems ?? DEFAULT_MENU" :x="pos.x" :y="pos.y" :origin="pos.x > 300 ? 'top-right' : 'top-left'" />
  </div>
</template>
<style>
.x-shell { position: relative; display: flex; flex-direction: column; width: 100%; height: 100%; min-height: 0; overflow: hidden; background: var(--hd-c-bg); color: var(--hd-c-fg); container-type: inline-size; }
.x-shell--media { background: var(--hd-surface-media); }
.x-shell__body { flex: 1 1 auto; min-height: 0; display: flex; }
.x-shell__content { flex: 1 1 auto; min-width: 0; overflow: hidden; display: flex; flex-direction: column; }
.x-shell__toolbar { flex: none; }
.x-shell__toolbar .hd-tab-button { flex: 0 0 auto; min-width: 64px; }
.x-headerbar { flex: none; display: flex; align-items: center; gap: 6px; height: 48px; padding: 0 6px; background: var(--hd-surface-chrome); color: var(--hd-c-fg); }
.x-density-pointer .x-headerbar { height: 40px; }
.x-density-pointer .x-headerbar .hd-tool-icon { width: 36px; height: 36px; --hd-sq-size: 32px; }
.x-headerbar__title { margin: 0 8px; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1 var(--hd-font-family-light); white-space: nowrap; }
.x-headerbar__tabs { display: flex; }
.x-headerbar__tabs .hd-tab-button { flex: 0 0 auto; min-width: 48px; }
.x-headerbar__spacer { flex: 1; }
.x-sidebar { flex: none; display: flex; flex-direction: column; align-items: center; justify-content: space-between; width: 56px; padding: 6px 0; background: var(--hd-surface-chrome); color: var(--hd-c-fg); }
.x-sidebar__mid, .x-sidebar__tabs { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.x-sidebar .hd-tab-button { flex: none; width: 48px; min-height: 48px; padding: 0; }
/* pointer density: 32px rows, smaller targets (mouse) */
.x-density-pointer { --hd-size-list-item: 32px; --hd-size-list-item-small: 32px; }
.x-density-pointer .hd-list-item { padding-block: 0; gap: 8px; }
.x-density-pointer .hd-list-item__title { font-size: var(--hd-font-size-small); font-family: var(--hd-font-family-base); font-weight: 400; }
.x-density-pointer .hd-list-item__text { flex-direction: row; align-items: baseline; gap: 8px; }
.x-density-pointer .hd-list-item__title { flex: none; max-width: 60%; }
.x-density-pointer .hd-list-item__subtitle { flex: 1; min-width: 0; font-size: var(--hd-font-size-xsmall); }
</style>
