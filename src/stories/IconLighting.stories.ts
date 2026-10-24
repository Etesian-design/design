import type { Meta, StoryObj } from '@storybook/vue3';
import HdAppIcon from '../components/HdAppIcon.vue';
import HdAvatar from '../components/HdAvatar.vue';
import HdThumbnail from '../components/HdThumbnail.vue';
import { icons } from '../components/icons';

const meta: Meta = {
  title: 'OS/Icon lighting',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'N9 **top-lit emboss** on icon tiles (measured from stock N9 icons, see Guide/Icon lighting): vertical tile gradient from one accent, lighter top rim, off-white glyph with its own gradient, top-edge highlight and a short cast shadow straight below. `lighting="flat"` turns it off.' } } },
};
export default meta;
type S = StoryObj;

const apps = [
  ['Phone', 'phone', '#62B700'], ['Messages', 'message', '#09A7CC'], ['Contacts', 'person', '#007DC9'], ['Mail', 'mail', '#0067BC'],
  ['Photos', 'photo', '#821DDE'], ['Music', 'music', '#CC09BA'], ['Calendar', 'calendar', '#EF5500'], ['Clock', 'clock', '#F77219'],
  ['Calculator', 'add', '#ED9507'], ['Notes', 'edit', '#F2B111'], ['Maps', 'globe', '#3D890C'], ['Settings', 'settings', '#505050'],
];

export const FlatVsLit: S = {
  name: 'Flat vs lit',
  render: () => ({ components: { HdAppIcon }, setup: () => ({ apps }), template: `<div style="display:grid;gap:24px">
    <div><p style="margin:0 0 8px">lighting="flat"</p><div style="display:flex;flex-wrap:wrap;gap:8px"><HdAppIcon v-for="a in apps" :key="a[0]" :label="a[0]" :icon="a[1]" :color="a[2]" :size="80" lighting="flat" /></div></div>
    <div><p style="margin:0 0 8px">lighting="lit" (default)</p><div style="display:flex;flex-wrap:wrap;gap:8px"><HdAppIcon v-for="a in apps" :key="a[0]" :label="a[0]" :icon="a[1]" :color="a[2]" :size="80" /></div></div></div>` }),
};

export const Zoomed: S = {
  name: 'Zoomed (256 px)',
  render: () => ({ components: { HdAppIcon }, template: `<div style="display:flex;gap:24px;flex-wrap:wrap">
    <HdAppIcon label="Flat" icon="person" color="#007DC9" :size="200" lighting="flat" style="width:220px" />
    <HdAppIcon label="Lit" icon="person" color="#007DC9" :size="200" style="width:220px" />
    <HdAppIcon label="Lit" icon="add" color="#ED9507" :size="200" style="width:220px" />
    <HdAppIcon label="White tile" icon="clock" :size="200" tone="light" style="width:220px" /></div>` }),
};

export const WhiteTiles: S = {
  name: 'White tile variant',
  render: () => ({ components: { HdAppIcon }, template: `<div style="display:flex;gap:8px">
    <HdAppIcon label="Clock" icon="clock" tone="light" :size="80" /><HdAppIcon label="Camera" icon="photo" tone="light" :size="80" />
    <HdAppIcon label="Location" icon="globe" tone="light" :size="80" /><HdAppIcon label="Flat" icon="clock" tone="light" lighting="flat" :size="80" /></div>` }),
};

export const OtherTiles: S = {
  name: 'Avatars & thumbnails',
  render: () => ({ components: { HdAvatar, HdThumbnail }, template: `<div style="display:flex;gap:16px;align-items:end">
    <HdAvatar name="Anna Virtanen" :size="64" /><HdAvatar name="Mikko Laine" :size="64" lighting="flat" />
    <HdThumbnail icon="music" :size="64" /><HdThumbnail icon="info" color="#F2B111" :size="64" /><HdThumbnail icon="info" color="#F2B111" :size="64" lighting="flat" /></div>` }),
};

export const Playground: S = {
  args: { color: '#4591FF', icon: 'phone', size: 80, lighting: 'lit', tone: 'colour', label: 'App' },
  argTypes: {
    color: { control: 'color' }, icon: { control: 'select', options: Object.keys(icons) },
    size: { control: { type: 'range', min: 24, max: 256, step: 2 } },
    lighting: { control: 'inline-radio', options: ['lit', 'flat'] }, tone: { control: 'inline-radio', options: ['colour', 'light'] },
  },
  render: (args) => ({ components: { HdAppIcon }, setup: () => ({ args }), template: '<HdAppIcon v-bind="args" :style="{ width: args.size + 24 + \'px\' }" />' }),
};
