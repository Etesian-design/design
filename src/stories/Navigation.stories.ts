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

/* a contacts-style list: per letter a header line (24px) then 48px rows; section tops follow the list as it scrolls */
const fsNames: Record<string, string[]> = { A: ['Alex Jones', 'Anna Berg', 'Arto Niemi'], E: ['Eleni Pappa', 'Erik Lund'], H: ['Hanna Koski', 'Harri Salo', 'Helen Wu'],
  J: ['Jaakko Aho', 'Johanna Laine'], K: ['Kalika Mehta', 'Karen DeCenzo', 'Katerina Boboti', 'Kiran Kulkarni'], L: ['Linzi Jayne', 'Lisa Taylor'],
  M: ['Maria Nieto', 'Mikko Virta', 'Minna Oja'], S: ['Sanna Rinne', 'Sofia Karra'], T: ['Tapio Heino', 'Tuula Mäki'] };
const FS_HEAD = 24, FS_ROW = 48;
const fsGroups = Object.entries(fsNames).map(([letter, names]) => ({ letter, names }));
const fsTops: { letter: string; top: number }[] = [];
fsGroups.reduce((y, g) => { fsTops.push({ letter: g.letter, top: y + FS_HEAD / 2 }); return y + FS_HEAD + g.names.length * FS_ROW; }, 0);
const fsSecs = fsTops; // list at the top
const fsAt = (off: number) => fsTops.map((x) => ({ ...x, top: x.top - off }));
const fsInit = (n: string) => n.split(' ').map((w) => w[0]).join('');
const fsList = `<div :style="{ position: 'absolute', left: 0, right: 0, top: -off + 'px' }">
  <template v-for="g in groups" :key="g.letter"><div style="height:24px;display:flex;align-items:center;padding:0 47px 0 8px"><hr style="flex:1;border:0;border-top:1px solid #FFF;margin:0" /></div>
  <div v-for="n in g.names" :key="n" style="height:48px;display:flex;align-items:center;gap:10px;padding:0 55px 0 10px;font:600 15px/1 var(--hd-font-family-base)">
  <span style="width:38px;height:38px;border-radius:11px;background:#1C1C1E;color:#fff;display:grid;place-items:center;font:700 15px/1 var(--hd-font-family-base)">{{ init(n) }}</span>{{ n }}</div></template></div>`;
const fsPanel = 'position:relative;width:240px;height:480px;background:#DDE1E5;color:#111;overflow:hidden';
const fsCap = 'margin:0 0 6px;font:13px/1.2 var(--hd-font-family-base);color:var(--hd-c-fg-secondary)';
const FsList = { props: { off: { type: Number, default: 0 } }, setup: () => ({ groups: fsGroups, init: fsInit }), template: fsList };
export const FastScroll: StoryObj<typeof HdFastScroll> = {
  name: 'FastScroll (idle letters, swipe bar, finger on the strip, no scroll)',
  parameters: { docs: { description: { story: '**N9** (n9-contacts-fastscroll*.png). Every list that scrolls shows its section letters down the right edge, moving or not. Swipe-scrolling the list puts a dimmed bar with a dot (the position in the data) on top of the letters. A finger on that strip scrolls fast, section by section, with a dark band and the big LIGHT letter on the other side. A list that does not scroll has no fast scroll at all, and no space is kept for one. The last panel is live: scroll it, or drag the strip.' } } },
  render: () => ({ components: { HdFastScroll, FsList }, setup: () => {
    const live = ref<HTMLElement | null>(null);
    const names = fsSecs.flatMap((s) => [1, 2, 3, 4].map((n) => `${s.letter}${'abcdefgh'[n]}name ${n}`));
    const liveSecs = fsSecs.map((s, i) => ({ letter: s.letter, top: 14 + i * 56 }));
    const short = ref<HTMLElement | null>(null);
    const jump = (i: number) => live.value?.scrollTo({ top: i * (24 + 4 * 40) });
    return { secs: fsSecs, at: fsAt, live, short, names, liveSecs, jump, panel: fsPanel, cap: fsCap };
  }, template: `<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px">
    <div><p :style="cap">Idle: letters only</p><div :style="panel"><FsList :off="0" /><HdFastScroll :sections="at(0)" :position="0" /></div></div>
    <div><p :style="cap">Swipe-scrolling: bar + dot</p><div :style="panel"><FsList :off="380" /><HdFastScroll :sections="at(380)" :position="0.41" scrolling /></div></div>
    <div><p :style="cap">Finger on the strip</p><div :style="panel"><FsList :off="380" /><HdFastScroll :sections="at(380)" :position="0.41" active letter="K" /></div></div>
    <div><p :style="cap">Not scrolling: nothing</p><div :style="panel"><div ref="short" style="height:100%;overflow:auto"><p v-for="n in 5" :key="n" style="margin:0;padding:10px 12px;border-bottom:1px solid #C4C8CC">Item {{ n }}</p></div>
      <HdFastScroll :sections="secs.slice(0, 1)" :container="short" /></div></div>
    <div><p :style="cap">Live (scroll or drag)</p><div :style="panel"><div ref="live" style="height:100%;overflow:auto">
      <template v-for="s in secs" :key="s.letter"><div :data-fs-letter="s.letter" style="height:24px;display:flex;align-items:center;padding:0 47px 0 8px"><hr style="flex:1;border:0;border-top:1px solid #FFF;margin:0" /></div>
      <p v-for="n in names.filter((x) => x[0] === s.letter)" :key="n" style="margin:0;height:40px;box-sizing:border-box;padding:10px 12px">{{ n }}</p></template></div>
      <HdFastScroll :sections="liveSecs" :container="live" @jump="jump" /></div></div></div>` }),
};
