import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import HdLockScreenNotificationCard from '../components/HdLockScreenNotificationCard.vue';
import HdTaskCard from '../components/HdTaskCard.vue';
import HdTaskEditBar from '../components/HdTaskEditBar.vue';
import HdAppGrid from '../components/HdAppGrid.vue';
import HdAppIcon from '../components/HdAppIcon.vue';
import HdEventsFeedItem from '../components/HdEventsFeedItem.vue';
import HdSectionHeader from '../components/HdSectionHeader.vue';
import HdPageHeader from '../components/HdPageHeader.vue';

const meta: Meta = { title: 'OS/Home & lock screen', excludeStories: ['apps'], tags: ['autodocs'], parameters: { docs: { description: { component: '**Canon**: lock-screen tiles (no buttons), Open applications task cards (2x2 / 3x3), Applications grid (4 columns), Events feed items with squircle thumbnails.' } } } };
export default meta;
type S = StoryObj;
export const apps = [
  ['Phone', 'phone', '#62B700'], ['Messages', 'message', '#09A7CC'], ['Contacts', 'person', '#007DC9'], ['Mail', 'mail', '#0067BC'],
  ['Store', 'star', '#1C51AF'], ['Gallery', 'photo', '#821DDE'], ['Music', 'music', '#CC09BA'], ['Calendar', 'calendar', '#EF5500'],
  ['Clock', 'clock', '#F77219'], ['Feeds', 'globe', '#FF8500'], ['Notes', 'edit', '#F2B111'], ['Settings', 'settings', '#505050'],
];

export const LockScreenCard: S = { render: () => ({ components: { HdLockScreenNotificationCard }, template: `<div style="display:grid;gap:8px;max-width:360px;padding:16px;background:linear-gradient(160deg,color-mix(in srgb,#1d6bba 35%,var(--hd-surface-home)),var(--hd-surface-home))">
  <HdLockScreenNotificationCard message="Are we still on for lunch?" source="Anna Virtanen" time="12:02" accent="#09A7CC" />
  <HdLockScreenNotificationCard message="2 missed calls" source="Phone" time="11:40" icon="phone" accent="#62B700" :count="2" /></div>` }) };
export const TaskCards: S = { args: { editing: true }, render: (args) => ({ components: { HdTaskCard, HdTaskEditBar }, setup: () => ({ edit: ref(!!args.editing) }), template: `<label><input type="checkbox" v-model="edit"> Edit mode (long-press)</label>
  <div style="width:480px;background:var(--hd-surface-home);margin-top:8px"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:24px 16px">
  <HdTaskCard title="Messages" accent="#09A7CC" :editing="edit" /><HdTaskCard title="Mail" accent="#0067BC" :editing="edit" /><HdTaskCard title="Music" accent="#CC09BA" :editing="edit" /><HdTaskCard title="Calendar" accent="#EF5500" :editing="edit" /></div>
  <HdTaskEditBar v-if="edit" @done="edit = false" /></div>` }) };
export const AppGrid: S = { render: () => ({ components: { HdAppGrid, HdAppIcon }, setup: () => ({ apps }), template: '<div style="max-width:360px"><HdAppGrid><li v-for="a in apps" :key="a[0]"><HdAppIcon :label="a[0]" :icon="a[1]" :color="a[2]" /></li></HdAppGrid></div>' }) };
export const EventsFeed: S = { render: () => ({ components: { HdEventsFeedItem, HdSectionHeader, HdPageHeader }, template: `<div style="max-width:420px"><HdPageHeader title="Events" />
  <HdSectionHeader title="Messages" /><HdEventsFeedItem title="Anna Virtanen" body="Are we still on for lunch? I can be there by 12:30." time="5 min ago" accent="#09A7CC" />
  <HdSectionHeader title="Feeds" /><HdEventsFeedItem title="Design weekly" body="Why squircles feel softer than rounded rectangles" time="1 h ago" icon="globe" accent="#FF8500" />
  <HdEventsFeedItem title="Mikko Laine" body="Posted 6 new photos" time="Yesterday" icon="photo" accent="#821DDE" /></div>` }) };
