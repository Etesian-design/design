import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import XChoice from './parts/XChoice.vue';
import XStage from './parts/XStage.vue';
import DesktopV2 from '../../shell/desktop/DesktopV2.vue';
import { STATES, CORE, type V2State } from '../../shell/desktop/states';

/** Desktop / The desktop: the agreed Etesian desktop, every state live. Built from @etesian-design/shell. */
const meta: Meta = {
  title: 'Desktop/The desktop',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'The Etesian desktop at 1920 × 1080, scaled to fit. The Overview (tap Super: Events, open windows, apps) is the main menu, with overlapping windows with snapping, a light floating dock on the left (launcher | apps | recycle bin, separated; panel, clock and window previews are options), a global menu bar (app menus left, status and clock right), window decorations that hold the app toolbar, Super+Tab quick switching (release Super to switch; Super + wheel or pinch zooms and keeps the task viewer open), the spotlight search (Super+Space), the phone’s Events view (Super+N), a status menu and three-finger touchpad gestures. Pick a state with the switcher or the `state` arg. Live keys in the canvas: hold Super and tap Tab / Shift+Tab, Super + wheel, tap Super (Overview), Super+Space, Super+N, Super+Z, Super+Left/Right/Down, typing, Esc. Hybrid colour mode by default; Dark and Light via the Mode toolbar. Decisions are written up in docs/21-desktop.md.' } } },
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
