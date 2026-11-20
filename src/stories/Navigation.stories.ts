import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import HdToolBar from '../components/HdToolBar.vue';
import HdToolIcon from '../components/HdToolIcon.vue';
import HdTabBar from '../components/HdTabBar.vue';
import HdFastScroll from '../components/HdFastScroll.vue';
import HdPageHeader from '../components/HdPageHeader.vue';
import HdStatusBar from '../components/HdStatusBar.vue';
import HdPageIndicator from '../components/HdPageIndicator.vue';
import HdPageStack from '../components/HdPageStack.vue';
import HdListItem from '../components/HdListItem.vue';

const meta: Meta = { title: 'OS/Navigation', tags: ['autodocs'], parameters: { docs: { description: { component: 'ToolBar, TabBar, PageHeader, StatusBar, PageIndicator and the drill-down PageStack. **N9**: toolbar 72/56 n9px, light grey by default (dark per app), Back as a lit squircle button bottom-left, selected tab a lighter squircle, header 72 n9px, status bar 36 n9px. **EXT**: toolbar gradient values, keyboard support.' } } } };
export default meta;
type S = StoryObj;

export const ToolBar: S = {
  name: 'ToolBar (light default + dark per-app)',
  render: () => ({ components: { HdToolBar, HdToolIcon }, template: `<div style="display:grid;gap:16px;max-width:400px">
    <HdToolBar back><HdToolIcon icon="refresh" label="Reload" /><HdToolIcon icon="star" label="Bookmark" /><template #right><HdToolIcon icon="more" label="Page menu" /></template></HdToolBar>
    <HdToolBar back variant="dark" label="Dark toolbar (Settings, Gallery)"><HdToolIcon icon="share" label="Share" /><HdToolIcon icon="delete" label="Delete" /></HdToolBar>
    <HdToolBar back variant="dark" label="Settings sub page" /></div>` }),
};
export const ToolBarLandscape: S = { render: () => ({ components: { HdToolBar, HdToolIcon }, template: '<HdToolBar back landscape><HdToolIcon icon="share" label="Share" /></HdToolBar>' }) };
export const ToolBarWithTabs: S = {
  name: 'ToolBar with icon tabs',
  render: () => ({ components: { HdToolBar, HdTabBar }, setup: () => ({ t: ref('calls'), tabs: [{ id: 'calls', label: 'Call log', icon: 'clock' }, { id: 'pad', label: 'Dialer', icon: 'phone' }, { id: 'people', label: 'Contacts', icon: 'person' }] }),
    template: '<div style="display:grid;gap:16px;max-width:400px"><HdToolBar><HdTabBar v-model="t" :tabs="tabs" label="Phone views" /></HdToolBar><HdToolBar variant="dark"><HdTabBar v-model="t" :tabs="tabs" label="Phone views (dark)" id-prefix="hd-dtab" /></HdToolBar></div>' }),
};
export const TextTabs: S = {
  name: 'TabBar (text segments)',
  render: () => ({ components: { HdTabBar }, setup: () => ({ t: ref('all'), tabs: [{ id: 'all', label: 'All' }, { id: 'unread', label: 'Unread' }, { id: 'flagged', label: 'Flagged' }] }),
    template: '<div style="display:flex;gap:32px;align-items:flex-start"><div><HdTabBar v-model="t" :tabs="tabs" label="Filter" /><p :id="`hd-tab-${t}-panel`" role="tabpanel">Showing: {{ t }}</p></div><HdTabBar v-model="t" :tabs="tabs" label="Filter (vertical)" vertical id-prefix="hd-vtab" /></div>' }),
};
export const PageHeaders: S = {
  render: () => ({ components: { HdPageHeader }, template: `<div style="display:grid;gap:16px">
    <HdPageHeader title="Settings" />
    <HdPageHeader title="Contacts" colored accent="#007DC9" />
    <HdPageHeader title="Inbox" subtitle="3 unread" colored accent="#0067BC" />
    <HdPageHeader title="All accounts" dropdown /></div>` }),
};
export const StatusBar: S = { render: () => ({ components: { HdStatusBar }, template: '<HdStatusBar operator="Carrier" time="09:41" :signal="3" />' }) };
export const PageIndicator: S = {
  render: () => ({ components: { HdPageIndicator }, setup: () => ({ i: ref(1) }), template: '<HdPageIndicator :total="3" :current="i" interactive label="Home views" @select="i = $event" />' }),
};
export const DrillDown: S = {
  name: 'PageStack (drill-down)',
  render: () => ({ components: { HdPageStack, HdListItem }, setup: () => { const titles = ref(['Settings']); return { titles, push: (t: string) => titles.value.push(t), pop: () => titles.value.length > 1 && titles.value.pop() }; },
    template: `<div style="max-width:360px;height:420px;border:1px solid var(--hd-c-divider)"><HdPageStack :titles="titles" @back="pop">
      <template #default="{ depth }">
        <HdListItem v-for="n in ['Display', 'Sounds', 'Connectivity']" :key="n + depth" :title="depth === 1 ? n : n + ' option'" drilldown @click="push(n)" />
      </template></HdPageStack></div>` }),
};

const fsSecs = ['A', 'E', 'H', 'J', 'K', 'L', 'M', 'S', 'T'].map((letter, i) => ({ letter, top: 14 + i * 60 }));
const fsPanel = 'position:relative;width:240px;height:480px;background:#DDE1E5;color:#111;overflow:hidden';
const fsCap = 'margin:0 0 6px;font:13px/1.2 var(--hd-font-family-base);color:var(--hd-c-fg-secondary)';
export const FastScroll: StoryObj<typeof HdFastScroll> = {
  name: 'FastScroll (idle letters, swipe bar, finger on the strip, no scroll)',
  parameters: { docs: { description: { story: '**N9** (n9-contacts-fastscroll*.png). Every list that scrolls shows its section letters down the right edge, moving or not. Swipe-scrolling the list puts a dimmed bar with a dot (the position in the data) on top of the letters. A finger on that strip scrolls fast, section by section, with a dark band and the big LIGHT letter on the other side. A list that does not scroll has no fast scroll at all, and no space is kept for one. The last panel is live: scroll it, or drag the strip.' } } },
  render: () => ({ components: { HdFastScroll }, setup: () => {
    const live = ref<HTMLElement | null>(null);
    const names = fsSecs.flatMap((s) => [1, 2, 3, 4].map((n) => `${s.letter}${'abcdefgh'[n]}name ${n}`));
    const liveSecs = fsSecs.map((s, i) => ({ letter: s.letter, top: 14 + i * 56 }));
    const short = ref<HTMLElement | null>(null);
    const jump = (i: number) => live.value?.scrollTo({ top: i * 4 * 40 });
    return { secs: fsSecs, live, short, names, liveSecs, jump, panel: fsPanel, cap: fsCap };
  }, template: `<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px">
    <div><p :style="cap">Idle: letters only</p><div :style="panel"><HdFastScroll :sections="secs" :position="0.2" /></div></div>
    <div><p :style="cap">Swipe-scrolling: bar + dot</p><div :style="panel"><HdFastScroll :sections="secs" :position="0.45" scrolling /></div></div>
    <div><p :style="cap">Finger on the strip</p><div :style="panel"><HdFastScroll :sections="secs" :position="0.45" active letter="K" /></div></div>
    <div><p :style="cap">Not scrolling: nothing</p><div :style="panel"><div ref="short" style="height:100%;overflow:auto"><p v-for="n in 5" :key="n" style="margin:0;padding:10px 12px;border-bottom:1px solid #C4C8CC">Item {{ n }}</p></div>
      <HdFastScroll :sections="secs.slice(0, 1)" :container="short" /></div></div>
    <div><p :style="cap">Live (scroll or drag)</p><div :style="panel"><div ref="live" style="height:100%;overflow:auto">
      <p v-for="n in names" :key="n" style="margin:0;height:40px;box-sizing:border-box;padding:10px 12px;border-bottom:1px solid #C4C8CC">{{ n }}</p></div>
      <HdFastScroll :sections="liveSecs" :container="live" @jump="jump" /></div></div></div>` }),
};
