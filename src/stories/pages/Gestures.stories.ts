import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import XPhoneGestures from '../../shell/parts/XPhoneGestures.vue';

/* The phone's gestures, driven by the pointer, on the ROM's own numbers (src/shell/parts/gestures.ts,
 * docs/23-phone-behaviour.md). 360 x 720 dp: the Pro1-X's 1080 x 2160 at 3x. */
const meta: Meta<typeof XPhoneGestures> = {
  title: 'OS/Gestures (try them)',
  component: XPhoneGestures,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Drag with the mouse or a finger. **Over an app:** swipe in from the left, right or bottom edge (the tinted 18 dp strips) to minimise it; swipe down from the status bar to close it (it darkens up to 70%). Let go past half the screen, or flick (900 dp/s), and it goes; otherwise it springs back. Swipe up from the bottom and **hold still half a second**: the first row of Applications comes up and the app rests on it in shadow. **On home:** drag sideways between the views; they go round in a circle. Tap an icon to launch, a card in Open apps to restore: the app comes back from the side the last one left by. **Locked:** drag the lock screen any way; past 35% it unlocks. Every number is in *Guide / Phone behaviour*.' } },
  },
  argTypes: {
    leaveTo: { control: 'select', options: ['switcher', 'last', 'events', 'apps', 'widgets'] },
    distance: { control: 'select', options: [0.5, 0.4, 0.3, 0.2] },
    dots: { control: 'select', options: ['hidden', 'top', 'bottom'] },
    widgets: { control: { type: 'range', min: 0, max: 5 } },
  },
};
export default meta;
type S = StoryObj<typeof XPhoneGestures>;

const render: S['render'] = (args) => ({
  components: { XPhoneGestures },
  setup: () => {
    const lines = ref<string[]>([]);
    const phone = ref<InstanceType<typeof XPhoneGestures> | null>(null);
    return { args, lines, phone, add: (l: string) => { lines.value = [l, ...lines.value].slice(0, 8); } };
  },
  template: `<div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;font-family:var(--hd-font-family-base)">
    <XPhoneGestures ref="phone" v-bind="args" @log="add" style="box-shadow:0 0 0 1px #333,0 8px 28px rgba(0,0,0,.35);border-radius:4px" />
    <div style="width:260px;font-size:13px;color:var(--hd-c-fg)">
      <button type="button" class="hd-button" style="margin-bottom:10px" @click="phone && phone.lock()">Lock the phone</button>
      <p style="margin:0 0 6px;font-weight:700">What happened</p>
      <ol aria-live="polite" style="margin:0;padding-left:18px;color:var(--hd-c-fg-secondary)"><li v-for="(l, i) in lines" :key="lines.length - i">{{ l }}</li></ol>
      <p v-if="!lines.length" style="color:var(--hd-c-fg-secondary)">Drag on the phone.</p>
    </div>
  </div>`,
});

export const OverAnApp: S = { name: 'Over an app', args: { open: 'Messages' }, render };
export const Home: S = { name: 'Home views (with Widgets, News and dots)', args: { open: null, news: true, widgets: 1, dots: 'bottom' }, render };
export const Locked: S = { name: 'Lock screen', args: { open: null, locked: true }, render };
export const ShortDistance: S = { name: 'Swipe distance 20%', args: { open: 'Mail', distance: 0.2, leaveTo: 'apps' }, render };
