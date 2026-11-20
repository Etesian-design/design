import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import XChoice from './parts/XChoice.vue';
import XStage from './parts/XStage.vue';
import DesktopV2 from '../../shell/desktop/DesktopV2.vue';
import XMenuBar from '../../shell/desktop/XMenuBar.vue';
import { STATES, CORE, type V2State } from '../../shell/desktop/states';

/** Desktop / The desktop: the agreed Etesian desktop, every state live. Built from @etesian-design/shell. */
const meta: Meta = {
  title: 'Desktop/The desktop',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'The Etesian desktop at 1920 × 1080, scaled to fit. The Overview (tap Super: Events, open windows, apps) is the main menu, with overlapping windows with snapping, a light floating dock on the left (launcher | apps | recycle bin, separated; panel, clock and window previews are options), a global menu bar (app menus left, status and clock right), window decorations that hold the app toolbar, Super+Tab quick switching (release Super to switch; Super + wheel or pinch zooms and keeps the task viewer open), Search (Super+Space), the phone’s Events view (Super+N), a status menu and three-finger touchpad gestures. Pick a state with the switcher or the `state` arg. Live keys in the canvas: hold Super and tap Tab / Shift+Tab, Super + wheel, tap Super (Overview), Super+Space, Super+N, Super+Z, Super+Left/Right/Down, typing, Esc. Hybrid colour mode by default; Dark and Light via the Mode toolbar. Decisions are written up in docs/21-desktop.md.' } } },
};
export default meta;
const tabs = (ids: readonly V2State[]) => ids.map((id) => ({ id, label: STATES[id].tab }));

export const Tour: StoryObj<{ state: V2State }> = {
  name: 'The desktop',
  args: { state: 'desktop' },
  argTypes: { state: { control: { type: 'select' }, options: [...CORE] } },
  render: (args) => ({
    components: { XStage, XChoice, DesktopV2 },
    setup: () => {
      const s = ref<V2State>(args.state);
      const info = computed(() => STATES[s.value]);
      return { s, info, CT: tabs(CORE) };
    },
    template: `<XStage v-bind="info"><template #controls>
        <XChoice v-model="s" :tabs="CT" label="State" id-prefix="v2c" />
      </template>
      <DesktopV2 :key="s" :state="s" /></XStage>`,
  }),
};

/** The one menu bar every desktop uses (XShell, the website's, the cloud companion's): a mark, the host's menus, its indicators. */
export const MenuBar: StoryObj = {
  name: 'Menu bar',
  render: () => ({
    components: { XMenuBar },
    setup: () => ({
      menus: [{ label: 'Go', items: [{ id: 'about', label: 'About Etesian', icon: 'star' }, { id: 'web', label: 'Back to the website', icon: 'globe', divider: true }] },
        { label: 'View', items: [{ id: 'overview', label: 'Overview', icon: 'grid', keys: 'Super' }, { id: 'events', label: 'Events', icon: 'calendar', keys: 'Super+N' }] }],
    }),
    template: `<div style="height:260px;background:var(--hd-surface-home)"><XMenuBar app="Etesian" :menus="menus" :count="3" :hints="false" open-menu="View" date="Sat 24 Oct" time="12:45">
      <template #mark><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="7" fill="#4591FF"/></svg></template>
      <template #indicators><a href="#" class="hd-sqm" style="color:inherit;text-decoration:none">Back to the website</a></template>
    </XMenuBar></div>`,
  }),
};
