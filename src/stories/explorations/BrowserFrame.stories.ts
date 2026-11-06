import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import XWindow from '../../shell/desktop/XWindow.vue';
import XBrowserFrame from '../../shell/apps/XBrowserFrame.vue';
import XBrowser from '../../shell/apps/XBrowser.vue';
import { photo } from '../../shell/parts/data';

/** Desktop / Browser frame: the browser as a proper browser, tabs in the header or on the side, and a picker of page thumbnails. */
const meta: Meta = {
  title: 'Desktop/Browser frame',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Tabs sit in the window header (Tabs: top) or as a list on the left (Tabs: side, the header then shows none). One row holds Back, Forward, Reload, the address with the site state, the tab count and ⋮ (zoom, other devices, find in page). The tab count opens a picker of page thumbnails at any width; in a narrow window it is the only way to the tabs and the row moves to the bottom, as on the phone. The same frame is the Browser page of the classic layout.' } } },
};
export default meta;
type Args = { tabsAt: 'top' | 'side'; picker: boolean };
export const Frame: StoryObj<Args> = {
  args: { tabsAt: 'top', picker: true },
  argTypes: { tabsAt: { control: 'inline-radio', options: ['top', 'side'] } },
  render: (args) => ({
    components: { XWindow, XBrowserFrame, XBrowser },
    setup: () => {
      const tabs = ref([{ id: 'a', title: 'A tablet for the swipe generation', thumb: photo(2) }, { id: 'b', title: 'Etesian design language', thumb: photo(4) }, { id: 'c', title: 'Weather · Helsinki', thumb: photo(6) }]);
      const cur = ref('a');
      return { tabs, cur, args };
    },
    template: `<div style="display:flex;gap:20px;align-items:flex-start;padding:20px;min-height:100vh;background:var(--hd-surface-home)">
      <div style="position:relative;width:1000px;height:600px"><XWindow title="Browser" icon="globe" color="#2EA8C7" :w="1000" :h="600" focused :resizable="false">
        <XBrowserFrame :loading="60" :tabs="tabs" :current="cur" :tabs-at="args.tabsAt" :max="3" @pick="cur = $event"><XBrowser chrome="none" density="pointer" :hints="false" id-prefix="bf1" /></XBrowserFrame></XWindow></div>
      <div style="position:relative;width:400px;height:600px"><XWindow title="Browser" icon="globe" color="#2EA8C7" :w="400" :h="600" focused :resizable="false">
        <XBrowserFrame :secure="false" address="http://old.example" :tabs="tabs" :current="cur" :tabs-at="args.tabsAt" :max="3" :picker-open="args.picker" @pick="cur = $event"><XBrowser chrome="none" density="pointer" :hints="false" id-prefix="bf2" /></XBrowserFrame></XWindow></div>
    </div>`,
  }),
};
export const SideTabs: StoryObj<Args> = { ...Frame, name: 'Tabs on the side', args: { tabsAt: 'side', picker: false } };
