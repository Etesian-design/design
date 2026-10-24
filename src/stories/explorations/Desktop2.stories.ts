import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import HdTabBar from '../../components/HdTabBar.vue';
import XStage from './parts/XStage.vue';
import DesktopV2 from './desktop2/DesktopV2.vue';
import { STATES, CORE, IDEAS, type V2State } from './desktop2/states';

/** Explorations: Desktop v2, the merged direction after the first review. Mockups only, not library API. */
const meta: Meta = {
  title: 'Explorations/Desktop v2',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Desktop v2 for the Harmattan Design Language at 1920 × 1080, scaled to fit: v1 A (overview) and B (snapping) merged, the dock from D (left, Plasma-style, customisable), a global menu bar (app menus left, status and clock right), window decorations that hold the app toolbar, a horizontal N9 three-view overview and an Events panel. Pick a state with the switcher or the `state` arg. Live keys in the canvas: Super, Super+N, Super+Z, Super+Left/Right/Down, Left/Right in the overview, typing, Esc. Hybrid colour mode by default; Dark and Light via the Mode toolbar.' } } },
};
export default meta;
const tabs = (ids: readonly V2State[]) => ids.map((id) => ({ id, label: STATES[id].tab }));

export const Tour: StoryObj<{ state: V2State }> = {
  name: 'Desktop v2',
  args: { state: 'desktop' },
  argTypes: { state: { control: { type: 'select' }, options: [...CORE, ...IDEAS] } },
  render: (args) => ({
    components: { XStage, HdTabBar, DesktopV2 },
    setup: () => {
      const s = ref<V2State>(args.state);
      const info = computed(() => STATES[s.value]);
      return { s, info, CT: tabs(CORE), IT: tabs(IDEAS) };
    },
    template: `<XStage v-bind="info"><template #controls>
        <HdTabBar v-model="s" :tabs="CT" label="State" id-prefix="v2c" />
        <HdTabBar v-model="s" :tabs="IT" label="New ideas" id-prefix="v2i" />
      </template>
      <DesktopV2 :key="s" :state="s" /></XStage>`,
  }),
};
