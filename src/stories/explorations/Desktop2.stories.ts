import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import XChoice from './parts/XChoice.vue';
import XStage from './parts/XStage.vue';
import DesktopV2 from './desktop2/DesktopV2.vue';
import { STATES, CORE, IDEAS, type V2State } from './desktop2/states';

/** Explorations: Desktop v2, the merged direction after the first review. Mockups only, not library API. */
const meta: Meta = {
  title: 'Explorations/Desktop v2',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Desktop v2 for the Etesian Design Language at 1920 × 1080, scaled to fit. v2 EXTENDS Desktop v1: v1’s Overview (tap Super: Events, open windows, apps) stays the main menu, and v2 adds overlapping windows with snapping, a light floating dock on the left (launcher | apps | recycle bin, separated; panel, clock and window previews are options), a global menu bar (app menus left, status and clock right), window decorations that hold the app toolbar, Super+Tab quick switching (release Super to switch; Super + wheel or pinch zooms and keeps the task viewer open), the spotlight search (Super+Space), the phone’s Events view (Super+N), a status menu and three-finger touchpad gestures. Pick a state with the switcher or the `state` arg. Live keys in the canvas: hold Super and tap Tab / Shift+Tab, Super + wheel, tap Super (Overview), Super+Space, Super+N, Super+Z, Super+Left/Right/Down, typing, Esc. Hybrid colour mode by default; Dark and Light via the Mode toolbar. Decisions are written up in docs/21-desktop.md.' } } },
};
export default meta;
const tabs = (ids: readonly V2State[]) => ids.map((id) => ({ id, label: STATES[id].tab }));

export const Tour: StoryObj<{ state: V2State }> = {
  name: 'Desktop v2',
  args: { state: 'desktop' },
  argTypes: { state: { control: { type: 'select' }, options: [...CORE, ...IDEAS] } },
  render: (args) => ({
    components: { XStage, XChoice, DesktopV2 },
    setup: () => {
      const s = ref<V2State>(args.state);
      const info = computed(() => STATES[s.value]);
      return { s, info, CT: tabs(CORE), IT: tabs(IDEAS) };
    },
    template: `<XStage v-bind="info"><template #controls>
        <XChoice v-model="s" :tabs="CT" label="State" id-prefix="v2c" />
        <XChoice v-model="s" :tabs="IT" label="New ideas" id-prefix="v2i" />
      </template>
      <DesktopV2 :key="s" :state="s" /></XStage>`,
  }),
};
