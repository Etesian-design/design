import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import HdLockScreenNotificationCard from '../components/HdLockScreenNotificationCard.vue';
import HdTaskCard from '../components/HdTaskCard.vue';
import HdTaskEditBar from '../components/HdTaskEditBar.vue';
import HdAppGrid from '../components/HdAppGrid.vue';
import HdAppIcon from '../components/HdAppIcon.vue';
import HdEventsFeedItem from '../components/HdEventsFeedItem.vue';
import HdSectionHeader from '../components/HdSectionHeader.vue';
import HdLockScreenStack from '../components/HdLockScreenStack.vue';
import HdEventsHeader from '../components/HdEventsHeader.vue';
import HdButton from '../components/HdButton.vue';
import XFit from './explorations/parts/XFit.vue';
import XMiniApp from './explorations/parts/XMiniApp.vue';

const meta: Meta = { title: 'OS/Home & lock screen', excludeStories: ['apps', 'lockItems'], tags: ['autodocs'], parameters: { docs: { description: { component: '**Canon** (matched to the ROM, see docs/20-phone.md): lock-screen cards and the default stacked carousel, Open applications (2 per row by default; pinch: carousel, 2, 3, 4) with edit mode and the carousel action row, the Applications grid (4 columns), and the black Events view.' } } } };
export default meta;
type S = StoryObj;
/** A story with its own controls (the args its render function reads). */
type SA<A> = StoryObj<A>;
export const apps = [
  ['Phone', 'phone', '#62B700'], ['Messages', 'message', '#09A7CC'], ['Contacts', 'person', '#007DC9'], ['Mail', 'mail', '#0067BC'],
  ['Store', 'star', '#1C51AF'], ['Gallery', 'photo', '#821DDE'], ['Music', 'music', '#CC09BA'], ['Calendar', 'calendar', '#EF5500'],
  ['Clock', 'clock', '#F77219'], ['Feeds', 'globe', '#FF8500'], ['Notes', 'edit', '#F2B111'], ['Settings', 'settings', '#505050'],
];

export const lockItems = [
  { message: 'Are we still on for lunch?', source: 'Anna Virtanen', time: '12:02', accent: '#09A7CC' },
  { message: 'Message number 6 for the lock screen', source: 'Test 6', time: '11:58', icon: 'message', accent: '#1F8A8A', more: 5 },
  { message: '2 missed calls', source: 'Phone', time: '11:40', icon: 'phone', accent: '#62B700' },
  { message: 'Design review moved to 14:30', source: 'Calendar', time: '11:15', icon: 'calendar', accent: '#EF5500' },
  { message: 'Your parcel is on its way', source: 'Mail', time: '10:52', icon: 'mail', accent: '#0067BC' },
  { message: 'Posted 6 new photos', source: 'Mikko Laine', time: '09:30', icon: 'photo', accent: '#821DDE' },
];
const lockBg = 'background:linear-gradient(160deg,#0e1418 10%,#2f6b6b 55%,#0d2a2c 90%)';
export const LockScreenCard: S = { render: () => ({ components: { HdLockScreenNotificationCard }, template: `<div style="display:grid;gap:8px;max-width:400px;padding:16px;${lockBg}">
  <HdLockScreenNotificationCard message="Are we still on for lunch?" source="Anna Virtanen" time="12:02" accent="#09A7CC" />
  <HdLockScreenNotificationCard message="Message number 6 for the lock screen" source="Test 6" time="14:43" accent="#1F8A8A" :more="5" /></div>` }) };
export const LockScreenStack: S = {
  name: 'Lock-screen notifications (stacked carousel, default)',
  render: () => ({ components: { HdLockScreenStack }, setup: () => ({ items: lockItems }), template: `<div style="max-width:400px;padding:16px 16px 28px;${lockBg}"><HdLockScreenStack :items="items" :visible="3" /></div>` }),
};
export const LockScreenMore: S = {
  name: 'Lock-screen notifications (N9 "More" style, optional)',
  render: () => ({ components: { HdLockScreenStack }, setup: () => ({ items: lockItems }), template: `<div style="max-width:400px;padding:16px;${lockBg}"><HdLockScreenStack :items="items" :visible="3" variant="more" /></div>` }),
};
const openApps = ['Messages', 'Mail', 'Calendar', 'Music'];
const preview = `<XFit :w="480" :h="854" :initial="0.3"><div style="width:480px;height:854px;display:flex;background:var(--hd-c-bg);color:var(--hd-c-fg)" class="hd-on-page" inert><XMiniApp :name="a" chrome="toolbar" :hints="false" :id-prefix="'tc-' + a" /></div></XFit>`;
export const TaskCards: SA<{ editing: boolean }> = {
  name: 'Open apps (2 per row, edit mode)',
  args: { editing: true },
  render: (args) => ({ components: { HdTaskCard, HdTaskEditBar, XFit, XMiniApp }, setup: () => ({ edit: ref(!!args.editing), openApps }), template: `<label><input type="checkbox" v-model="edit"> Edit mode (long-press)</label>
  <div class="hd-on-home" style="width:400px;background:#000;color:#fff;margin-top:8px"><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:28px 16px;padding:24px 16px">
  <HdTaskCard v-for="a in openApps" :key="a" :title="a" :editing="edit">${preview}</HdTaskCard></div>
  <HdTaskEditBar v-if="edit" @done="edit = false" /></div>` }),
};
export const TaskCarousel: S = {
  name: 'Open apps carousel (edit mode: one action row + Done bar)',
  render: () => ({ components: { HdTaskCard, HdTaskEditBar, XFit, XMiniApp }, setup: () => ({ openApps: ['Mail', 'Calendar', 'Music'] }), template: `<div class="hd-on-home" style="width:400px;background:#000;color:#fff;overflow:hidden">
  <div style="display:flex;gap:16px;padding:24px 0 8px;transform:translateX(-206px)">
    <div v-for="(a, i) in openApps" :key="a" style="flex:none;width:260px" :style="{ opacity: i === 1 ? 1 : .6 }"><HdTaskCard :title="a">${preview}</HdTaskCard></div></div>
  <HdTaskEditBar :actions="['Split view', 'Pop-up', 'Screenshot', 'App info']" /></div>` }),
};
export const AppGrid: S = { render: () => ({ components: { HdAppGrid, HdAppIcon }, setup: () => ({ apps }), template: '<div class="hd-on-home" style="max-width:400px;background:var(--hd-surface-home);padding:8px 0"><HdAppGrid><li v-for="a in apps" :key="a[0]"><HdAppIcon :label="a[0]" :icon="a[1]" :color="a[2]" /></li></HdAppGrid></div>' }) };
export const EventsFeed: S = {
  name: 'Events view',
  render: () => ({ components: { HdEventsFeedItem, HdSectionHeader, HdEventsHeader, HdButton }, template: `<div class="hd-on-home" style="max-width:420px;background:#000;color:#fff;padding-bottom:8px">
  <HdEventsHeader day="Saturday" date="24 October" city="Athens" temperature="23°C" weather="partly" />
  <HdSectionHeader title="Notifications" align="start" large><template #action><HdButton variant="default" class="hd-events-btn">Clear</HdButton></template></HdSectionHeader>
  <HdEventsFeedItem title="Anna Virtanen" body="Are we still on for lunch? I can be there by 12:30." time="12:24" accent="#09A7CC" />
  <HdEventsFeedItem title="3 new messages" body="Mikko Laine, Sara Koski, Liisa Niemi" time="Latest 12:20" icon="mail" accent="#0067BC" />
  <HdSectionHeader title="Feed" align="start" large><template #action><HdButton variant="default" class="hd-events-btn">Refresh</HdButton></template></HdSectionHeader>
  <HdEventsFeedItem title="Hacker News: Front Page" body="Show HN: a squircle calculator for the Etesian design language" time="12:18" icon="globe" accent="#FF8500" />
  <HdEventsFeedItem title="Design weekly" body="Why squircles feel softer than rounded rectangles" time="11:51" icon="globe" accent="#FF8500" />
  <HdEventsFeedItem title="Mikko Laine" body="Posted 6 new photos from Lapland" time="10:53" icon="photo" accent="#821DDE" /></div>` }),
};
