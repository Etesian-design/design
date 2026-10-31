import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import BelleWidget from './belle/BelleWidget.vue';
import BellePlacePicker, { type Place } from './belle/BellePlacePicker.vue';
import HdTaskEditBar from '../components/HdTaskEditBar.vue';

const meta: Meta<typeof BelleWidget> = {
  title: 'OS/Belle widgets',
  component: BelleWidget,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '**ROM** (launcher BelleClassic*.kt, bc_*.xml / belle_*.xml): Belle-style home-screen widgets, dp → px 1:1 on a 4-column grid (90px cells, 6px gap round each widget, so a widget is n × 90 − 12 px). Classic widgets are lit objects (glass, brushed metal, paper); the modern set shares one translucent black panel. Album art and photos are shown as is (square); only placeholders and icons are squircles. Rules: Guide / Home widgets.' } } },
  argTypes: { kind: { control: 'select', options: ['switch', 'wifi', 'fm', 'toggles', 'data', 'notes', 'today', 'agenda', 'bigclock', 'gearclock', 'analog', 'flipclock', 'lcdclock', 'wordclock', 'web', 'contact', 'weather', 'rss', 'mail', 'stackmail', 'music', 'music-large', 'm-clock', 'm-analog', 'm-calendar', 'm-feeds', 'm-music', 'm-weather', 'm-shortcuts'] } },
  args: { kind: 'music', on: true, editing: false },
  decorators: [() => ({ template: '<div class="hd-on-home" style="padding:24px;background:linear-gradient(160deg,#4d5a63,#1b2226 60%,#0b0e10);display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start"><story /></div>' })],
};
export default meta;
type S = StoryObj<typeof BelleWidget>;
const W = (items: string) => ({ components: { BelleWidget }, template: items });

export const Playground: S = {};
export const Switches: S = {
  name: 'Switches (1×1, 2×1, 4×1) and data ring',
  render: () => W(`<BelleWidget kind="switch" glyph="wifi" on /><BelleWidget kind="switch" glyph="bluetooth" /><BelleWidget kind="switch" glyph="data" on />
    <BelleWidget kind="switch" glyph="silent" /><BelleWidget kind="switch" glyph="flight" /><BelleWidget kind="switch" word="VPN" /><BelleWidget kind="switch" word="3G" on />
    <BelleWidget kind="data" /><BelleWidget kind="wifi" on /><BelleWidget kind="wifi" /><BelleWidget kind="fm" /><BelleWidget kind="fm" on /><BelleWidget kind="toggles" />`),
};
export const Clocks: S = {
  render: () => W(`<BelleWidget kind="analog" /><BelleWidget kind="m-analog" /><BelleWidget kind="flipclock" /><BelleWidget kind="lcdclock" /><BelleWidget kind="wordclock" />
    <BelleWidget kind="m-clock" /><BelleWidget kind="bigclock" /><BelleWidget kind="gearclock" />`),
};
export const CalendarNotes: S = {
  name: 'Calendar and notes',
  render: () => W('<BelleWidget kind="today" /><BelleWidget kind="notes" /><BelleWidget kind="agenda" /><BelleWidget kind="m-calendar" />'),
};
export const MediaInfo: S = {
  name: 'Music, weather, feeds, web, contact',
  render: () => W(`<BelleWidget kind="music-large" art="linear-gradient(135deg,#d24b6a,#3b1d5a)" title="Polar night · The Swipes" on /><BelleWidget kind="music-large" /><BelleWidget kind="music" on /><BelleWidget kind="m-music" art="linear-gradient(135deg,#d24b6a,#3b1d5a)" /><BelleWidget kind="m-music" />
    <BelleWidget kind="weather" /><BelleWidget kind="m-weather" /><BelleWidget kind="rss" /><BelleWidget kind="mail" /><BelleWidget kind="stackmail" /><BelleWidget kind="m-feeds" />
    <BelleWidget kind="web" /><BelleWidget kind="contact" /><BelleWidget kind="m-shortcuts" />`),
};
const home = `<div style="width:360px;display:grid;grid-template-columns:repeat(4,90px);grid-auto-rows:90px;justify-items:center;align-items:center">
  <BelleWidget kind="switch" word="VPN" :editing="edit" /><BelleWidget kind="switch" word="3G" :editing="edit" /><BelleWidget kind="switch" glyph="bluetooth" on :editing="edit" /><BelleWidget kind="data" :editing="edit" />
  <BelleWidget kind="agenda" :editing="edit" style="grid-column:span 4;grid-row:span 3" />
  <BelleWidget kind="music" on :editing="edit" style="grid-column:span 4;grid-row:span 2" /></div>`;
export const HomeScreen: S = {
  name: 'Home screen (4-column grid)',
  render: () => ({ components: { BelleWidget }, setup: () => ({ edit: false }), template: home }),
};
export const EditMode: S = {
  name: 'Edit mode (✕ badge, outline, Done / Add widget bar)',
  render: () => ({ components: { BelleWidget, HdTaskEditBar }, setup: () => ({ edit: ref(true) }), template: `<div style="width:360px">
    <label style="color:#fff"><input type="checkbox" v-model="edit"> Edit mode (long-press)</label>${home}
    <HdTaskEditBar v-if="edit" done-label="Done" close-all-label="Add widget" @done="edit = false" /></div>` }),
};
export const WeatherPlace: S = {
  name: 'Weather place picker (tap the place)',
  render: () => ({ components: { BelleWidget, BellePlacePicker }, setup: () => {
    const place = ref<string | null>('Tampere'); const picking = ref(false);
    return { place, picking, pick: (p: Place | null) => { place.value = p?.name ?? null; picking.value = false; } };
  }, template: `<div style="width:360px">
    <BellePlacePicker v-if="picking" :current="place ?? ''" @pick="pick" />
    <template v-else><BelleWidget kind="weather" :place="place ?? 'Here'" @place="picking = true" />
      <BelleWidget kind="m-weather" :place="place ?? 'Here'" @place="picking = true" /></template></div>` }),
};
