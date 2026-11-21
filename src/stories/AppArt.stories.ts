import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdAppIcon from '../components/HdAppIcon.vue';
import { APP_ART_NAMES } from '../components/app-art';
import { APPS as phoneApps } from '../shell/parts/data';

const meta: Meta = {
  title: 'OS/App art',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'The drawings on app icons (`app-art.ts`, HdAppIcon `art`): original filled objects on a 24 px grid, lit like the glyphs (off-white gradient), cut-outs in the tile\'s own dark colour, at most one or two accents from the palette. The Plasma icon theme is generated from the same file. The line glyph (`icon`) stays as the fallback.' } } },
};
export default meta;
type S = StoryObj;

/** a tile colour for every drawing, so each can be seen lit */
const PALETTE = ['#62B700', '#09A7CC', '#007DC9', '#0067BC', '#2EA8C7', '#821DDE', '#CC09BA', '#EF5500', '#F2B111', '#D9001E', '#60AD00', '#1C51AF', '#7B7B7B', '#0093D0', '#505050'];

export const PhoneApps: S = {
  name: 'Phone apps',
  render: () => ({ components: { HdAppIcon }, setup: () => ({ apps: phoneApps }), template: `<div style="display:grid;gap:20px">
    <div style="display:flex;flex-wrap:wrap;gap:8px"><HdAppIcon v-for="a in apps" :key="a.name" :label="a.name" :icon="a.icon" :art="a.art" :color="a.color" :tone="a.tone" :size="80" /></div>
    <div><p style="margin:0 0 8px">The same apps with their line glyphs</p><div style="display:flex;flex-wrap:wrap;gap:8px"><HdAppIcon v-for="a in apps" :key="a.name" :label="a.name" :icon="a.icon" :color="a.color" :tone="a.tone" :size="54" /></div></div></div>` }),
};

export const AllDrawings: S = {
  name: 'Every drawing',
  render: () => ({ components: { HdAppIcon }, setup: () => ({ names: APP_ART_NAMES, color: (i: number) => PALETTE[i % PALETTE.length] }), template: `<div style="display:flex;flex-wrap:wrap;gap:8px">
    <HdAppIcon v-for="(n, i) in names" :key="n" :label="n" :art="n" :color="color(i)" :size="72" /></div>` }),
};
