import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import NotifOver from './phone2/NotifOver.vue';
import NotifOverSettings from './phone2/NotifOverSettings.vue';

/** Phone / Notifications over apps: the four styles a notification can take while an app is open, chosen in
 *  Settings → Events and notifications → Over apps. The lock screen is not affected by any of them. */
const meta: Meta = {
  title: 'Phone/Notifications over apps',
  parameters: { layout: 'centered', docs: { description: { component:
    'How a notification shows while an app is open. **Discreet (N9)**, measured on the N9: the app\'s icon appears in the status bar next to the time, ' +
    'then one line slides down over the status bar and scrolls until the whole text has been seen; the item is in Events afterwards. System notices ' +
    '(Charging, Unplug the charger) are a small inset banner. **Strip (Belle)**: a dark strip across the full width, its transparency a setting (on ' +
    'Belle it came from the theme). **Card**: the lock screen card under the status bar. **Colour**: a bubble in the app\'s colour with squircle-half ' +
    'ends. All slide in from the top. The lock screen keeps its cards whatever is chosen. A notification for the conversation that is open shows nothing.' } } },
};
export default meta;

type Args = { look: 'n9' | 'belle' | 'card' | 'colour'; shade: 'light' | 'medium' | 'dark' | 'solid'; kind: 'message' | 'system' };
export const TryIt: StoryObj<Args> = {
  name: 'Try it',
  args: { look: 'n9', shade: 'medium', kind: 'message' },
  argTypes: {
    look: { name: 'Style', control: { type: 'inline-radio' }, options: ['n9', 'belle', 'card', 'colour'] },
    shade: { name: 'Strip transparency (Belle)', control: { type: 'inline-radio' }, options: ['light', 'medium', 'dark', 'solid'] },
    kind: { name: 'Notification', control: { type: 'inline-radio' }, options: ['message', 'system'] },
  },
  render: (args) => ({ components: { NotifOver }, setup: () => ({ args }), template: '<NotifOver :look="args.look" :shade="args.shade" :kind="args.kind" />' }),
};

export const SideBySide: StoryObj = {
  name: 'All four side by side',
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { NotifOver },
    setup: () => ({ kind: ref<'message' | 'system'>('message'), LOOKS: [['n9', 'Discreet (N9)'], ['belle', 'Strip (Belle)'], ['card', 'Card'], ['colour', 'Colour']] }),
    template: `<div style="display:flex;flex-direction:column;gap:12px;padding:16px;background:#1a1a1a;min-height:100vh;color:#fff;font-family:var(--hd-font-family-base)">
      <div style="display:flex;gap:8px"><button v-for="k in ['message','system']" :key="k" type="button" class="hd-button hd-sqf" @click="kind = k">{{ k === 'message' ? 'Message' : 'System notice' }}</button></div>
      <div style="display:flex;gap:16px;flex-wrap:wrap"><figure v-for="l in LOOKS" :key="l[0]" style="margin:0"><NotifOver :look="l[0]" :kind="kind" /><figcaption style="padding-top:6px">{{ l[1] }}</figcaption></figure></div></div>`,
  }),
};

export const SettingsPage: StoryObj = {
  name: 'Settings: Over apps',
  render: () => ({ components: { NotifOverSettings }, template: '<NotifOverSettings />' }),
};
