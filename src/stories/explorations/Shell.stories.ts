import type { Meta, StoryObj } from '@storybook/vue3-vite';
import XShell from '../../shell/desktop/XShell.vue';
import XWin from '../../shell/desktop/XWin.vue';
import XMiniApp from '../../shell/parts/XMiniApp.vue';
import XEventsPanel from '../../shell/desktop/XEventsPanel.vue';
import XStatusPanel from '../../shell/desktop/XStatusPanel.vue';
import XWidgets from '../../shell/desktop/XWidgets.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import { APPS } from '../../shell/parts/data';
import { chromeOf } from '../../shell/desktop/chrome';

/** Desktop / Try it: the real desktop (XShell), the one the website and cloud-companion run, with the mock apps. */
const meta: Meta = {
  title: 'Desktop/Try it',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'The working desktop: drag windows by their header to move them, to a side edge to snap, to the top edge for the snap layouts; resize from any edge; double-click the header to maximise. Everything opens from the dock, the menu bar and right-click (no Super or Ctrl+Alt shortcuts: in a browser the system takes them); in the switcher, arrows or Tab, Enter and Escape. Right-click the desktop, a header, the dock. The arrangement is kept in this browser.' } } },
};
export default meta;
const SHOWN = ['Mail', 'Messages', 'Browser', 'Calendar', 'Music', 'Gallery', 'Notes', 'Settings'];
const apps = APPS.filter((a) => SHOWN.includes(a.name)).map((a) => ({ id: a.name, title: a.name, icon: a.icon, color: a.color, tone: a.tone }));
const metaOf = Object.fromEntries(SHOWN.map((n) => [n, { back: !!chromeOf(n).back, views: chromeOf(n).views }]));
export const TryIt: StoryObj = {
  name: 'Try it',
  render: () => ({
    components: { XShell, XWin, XMiniApp, XEventsPanel, XStatusPanel, XWidgets, HdToolIcon },
    setup: () => ({ apps, metaOf, chromeOf }),
    template: `<div style="height:100vh"><XShell :apps="apps" :meta="metaOf" storage-key="sb-shell" :events-count="3">
      <template #window="{ id }"><XMiniApp :name="id" chrome="none" density="pointer" :hints="false" :id-prefix="'sh-' + id" /></template>
      <template #actions="{ id }"><HdToolIcon v-for="a in chromeOf(id).actions" :key="a.label" :icon="a.icon" :label="a.label" /></template>
      <template #events><XEventsPanel :hints="false" /></template>
      <template #status><XStatusPanel /></template>
      <template #widgets="{ editing }"><XWidgets :editing="editing" /></template>
    </XShell></div>`,
  }),
};
