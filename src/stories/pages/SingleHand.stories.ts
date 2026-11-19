import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdStoryCard from '../../components/HdStoryCard.vue';
import HdToolBar from '../../components/HdToolBar.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import HdIcon from '../../components/HdIcon.vue';

/* Single hand mode (phone, 2026-11-19). The whole screen drawn at half its size, the same shape: a zoom out, the
 * resolution and every app unchanged. Frame 360 × 640; the small screen is 180 × 320. */
const meta: Meta = {
  title: 'OS/Single hand mode',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '**Single hand mode**: everything on screen at half its size, the same shape, within reach of the thumb. Apps are not told; it only looks zoomed out, and touch follows it. **Tap the empty space** to move the small screen to that side (left, right, up, down); **double tap the empty space** for full screen. On from a toolbar or side-menu button, a gesture or the system app\'s shortcut. It ends when the device locks or turns, and never survives a restart. The system bottom bar stays full size at the bottom: it is already within reach.' } } },
  argTypes: { place: { control: 'select', options: ['bottom', 'bottom-left', 'bottom-right', 'top-left', 'top-right'] } },
};
export default meta;
type S = StoryObj<{ place: string }>;

const CSS = `<component is="style">
.sh-phone { position: relative; width: 360px; height: 640px; overflow: hidden; background: #101010; font-family: var(--hd-font-family-base); }
.sh-area { position: absolute; left: 0; top: 0; right: 0; bottom: 56px; }
.sh-small { position: absolute; width: 180px; height: 320px; border-radius: 12px; overflow: hidden; transition: left .26s, top .26s; box-shadow: 0 0 0 1px #2A2A2A; }
.sh-inner { width: 360px; height: 640px; transform: scale(.5); transform-origin: 0 0; background: #000; color: #F2F2F2; display: flex; flex-direction: column; }
.sh-status { height: 24px; display: flex; justify-content: flex-end; align-items: center; padding: 0 10px; font-size: 13px; }
.sh-hint { position: absolute; left: 0; right: 0; text-align: center; font-size: 13px; color: #A0A0A0; }
.sh-bar { position: absolute; left: 0; right: 0; bottom: 0; }
</component>`;
const POS: Record<string, [number, number]> = {
  bottom: [90, 264], 'bottom-left': [0, 264], 'bottom-right': [180, 264], 'top-left': [0, 0], 'top-right': [180, 0],
};

export const SingleHand: S = {
  name: 'Single hand mode',
  args: { place: 'bottom' },
  render: (args) => ({
    components: { HdStoryCard, HdToolBar, HdToolIcon, HdIcon },
    setup: () => {
      const [x, y] = POS[args.place] ?? POS.bottom!;
      return { x, y, hintTop: y > 100 ? 120 : 440 };
    },
    template: `${CSS}<div class="sh-phone" aria-label="Single hand mode: tap the empty space to move, double tap for full screen">
      <div class="sh-area">
        <div class="sh-hint" :style="{ top: hintTop + 'px' }">Tap here to move · Double tap for full screen</div>
        <div class="sh-small" :style="{ left: x + 'px', top: y + 'px' }">
          <div class="sh-inner">
            <div class="sh-status">09:41</div>
            <HdStoryCard lead title="Leaders meet on the summit sidelines as talks on trade resume" source="World Service" age="27 min" :outlets="5" image="linear-gradient(160deg, #2C4A6E, #8FA7C0 45%, #3A2A1E)" />
            <HdStoryCard title="Storm brings record rain to the coast" source="Coast Herald" age="1 h" image="linear-gradient(200deg, #0E3B5C, #1D7FB8 50%, #E0EEF5)" />
          </div>
        </div>
      </div>
      <div class="sh-bar"><HdToolBar back label="System toolbar"><template #right><HdToolIcon icon="menu" label="Menu" /></template></HdToolBar></div>
    </div>`,
  }),
};
