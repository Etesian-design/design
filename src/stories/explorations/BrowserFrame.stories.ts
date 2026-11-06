import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import XWindow from '../../shell/desktop/XWindow.vue';
import XBrowserFrame from '../../shell/apps/XBrowserFrame.vue';
import XBrowserTabs from '../../shell/apps/XBrowserTabs.vue';
import XBrowser from '../../shell/apps/XBrowser.vue';

/** Desktop / Browser frame: the browser as a proper browser, tabs in the window header and one navigation row. */
const meta: Meta = {
  title: 'Desktop/Browser frame',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Tabs sit in the window header beside the window controls; one row below holds Back, Forward, Reload, the address with the site state and ⋯ (zoom, other devices, find in page). A narrow window moves that row to the bottom, as on the phone. The same frame is the Browser page of the classic layout.' } } },
};
export default meta;
export const Frame: StoryObj = {
  render: () => ({
    components: { XWindow, XBrowserFrame, XBrowserTabs, XBrowser },
    setup: () => {
      const tabs = ref([{ id: 'a', title: 'A tablet for the swipe generation' }, { id: 'b', title: 'Etesian design language' }, { id: 'c', title: 'Weather · Helsinki' }]);
      const cur = ref('a');
      return { tabs, cur };
    },
    template: `<div style="display:flex;gap:20px;align-items:flex-start;padding:20px;min-height:100vh;background:var(--hd-surface-home)">
      <div style="position:relative;width:1000px;height:600px"><XWindow title="Browser" icon="globe" color="#2EA8C7" :w="1000" :h="600" focused :resizable="false">
        <template #title><XBrowserTabs :tabs="tabs" :current="cur" :max="3" @pick="cur = $event" /></template>
        <XBrowserFrame :loading="60"><XBrowser chrome="none" density="pointer" :hints="false" id-prefix="bf1" /></XBrowserFrame></XWindow></div>
      <div style="position:relative;width:400px;height:600px"><XWindow title="Browser" icon="globe" color="#2EA8C7" :w="400" :h="600" focused :resizable="false">
        <template #title><XBrowserTabs :tabs="tabs.slice(0, 1)" :current="cur" /></template>
        <XBrowserFrame :secure="false" address="http://old.example"><XBrowser chrome="none" density="pointer" :hints="false" id-prefix="bf2" /></XBrowserFrame></XWindow></div>
    </div>`,
  }),
};
