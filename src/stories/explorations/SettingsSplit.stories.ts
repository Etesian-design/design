import type { Meta, StoryObj } from '@storybook/vue3-vite';
import XWindow from '../../shell/desktop/XWindow.vue';
import XSettingsSplit from '../../shell/apps/XSettingsSplit.vue';

/** Desktop / Settings split: one Settings app for the device and the server, a side panel when the window is wide. */
const meta: Meta = {
  title: 'Desktop/Settings split',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Wide window: groups on the left with squircle icons and search, the page on the right. Narrow: the same list drills down, Back in the bottom toolbar. Connections, Devices, Catalogue and Android are groups of Settings, shown only to the owner; the dock and app grid can keep them as shortcuts that open Settings at that page.' } } },
};
export default meta;
export const Split: StoryObj<{ owner: boolean }> = {
  args: { owner: true },
  render: (args) => ({
    components: { XWindow, XSettingsSplit },
    setup: () => ({ args }),
    template: `<div style="display:flex;gap:20px;align-items:flex-start;padding:20px;min-height:100vh;background:var(--hd-surface-home)">
      <div style="position:relative;width:1000px;height:560px"><XWindow title="Settings" icon="settings" color="#555" :w="1000" :h="560" focused :resizable="false" :tools="[{icon:'search',label:'Search'}]">
        <XSettingsSplit :owner="args.owner" page="connections" /></XWindow></div>
      <div style="position:relative;width:400px;height:560px"><XWindow title="Connections" icon="settings" color="#555" :w="400" :h="560" focused back :resizable="false" :tools="[{icon:'add',label:'Add an account'}]">
        <XSettingsSplit :owner="args.owner" page="connections" narrow-page /></XWindow></div>
    </div>`,
  }),
};
