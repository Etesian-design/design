import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdStoryCard from '../../components/HdStoryCard.vue';
import HdToolBar from '../../components/HdToolBar.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import HdIcon from '../../components/HdIcon.vue';

/* Single hand mode (phone, 2026-11-19). The whole screen drawn smaller, the same shape: a zoom out, the resolution and
 * every app unchanged. Its size is the user's (50-90% of the width, 70% by default); always in a corner. Frame 360 × 640. */
const meta: Meta = {
  title: 'OS/Single hand mode',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '**Single hand mode**: everything on screen smaller, the same shape, within reach of the thumb. **The size is the user\'s**: a slider (50 to 90% of the width, 70% by default) under a live preview; half suits only very large phones. Apps are not told; it only looks zoomed out, and touch follows it. It always sits in a **corner**: **tap the empty space** and it moves to the corner nearest the tap; **double tap the empty space** for full screen. On from a toolbar or side-menu button, a gesture or the system app\'s shortcut. It ends when the device locks or turns, and never survives a restart. Everything shrinks with it, the bottom toolbar too, so the app stays whole.' } } },
  argTypes: { place: { control: 'select', options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'] }, size: { control: { type: 'range', min: 50, max: 90, step: 5 } } },
};
// A phone screen (or part of one): centred, as big as itself.
meta.parameters = { ...meta.parameters, layout: 'centered' };
export default meta;
type S = StoryObj<{ place: string; size: number }>;

const CSS = `<component is="style">
.sh-phone { position: relative; width: 360px; height: 640px; overflow: hidden; background: #101010; font-family: var(--hd-font-family-base); }
.sh-area { position: absolute; inset: 0; }
.sh-inner .hd-toolbar { margin-top: auto; }
.sh-small { position: absolute; border-radius: 12px; overflow: hidden; transition: left .26s, top .26s; box-shadow: 0 0 0 1px #2A2A2A; }
.sh-inner { width: 360px; height: 640px; transform-origin: 0 0; background: #000; color: #F2F2F2; display: flex; flex-direction: column; }
.sh-status { height: 24px; display: flex; justify-content: flex-end; align-items: center; padding: 0 10px; font-size: 13px; }
.sh-hint { position: absolute; left: 0; right: 0; text-align: center; font-size: 13px; color: #A0A0A0; }
.sh-bar { position: absolute; left: 0; right: 0; bottom: 0; }
</component>`;


export const SingleHand: S = {
  name: 'Single hand mode',
  args: { place: 'bottom-right', size: 70 },
  render: (args) => ({
    components: { HdStoryCard, HdToolBar, HdToolIcon, HdIcon },
    setup: () => {
      const k = Math.min(90, Math.max(50, args.size)) / 100;
      const w = 360 * k, h = 640 * k;
      const x = args.place.endsWith('left') ? 0 : 360 - w;
      const y = args.place.startsWith('top') ? 0 : 640 - h;
      return { x, y, w, h, k, hintTop: y > 0 ? y / 2 : h + (640 - h) / 2 };
    },
    template: `${CSS}<div class="sh-phone" aria-label="Single hand mode: tap the empty space to move, double tap for full screen">
      <div class="sh-area">
        <div class="sh-hint" v-if="(640 - h) > 40" :style="{ top: hintTop + 'px' }">Tap here to move · Double tap for full screen</div>
        <div class="sh-small" :style="{ left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }">
          <div class="sh-inner" :style="{ transform: 'scale(' + k + ')' }">
            <div class="sh-status">09:41</div>
            <HdStoryCard lead title="Leaders meet on the summit sidelines as talks on trade resume" source="World Service" age="27 min" :outlets="5" image="linear-gradient(160deg, #2C4A6E, #8FA7C0 45%, #3A2A1E)" />
            <HdToolBar back label="Reader toolbar"><template #right><HdToolIcon icon="globe" label="Open in browser" /><HdToolIcon icon="share" label="Share" /></template></HdToolBar>
          </div>
        </div>
      </div>
    </div>`,
  }),
};

export const Small: S = { name: 'At 50%, top left', args: { place: 'top-left', size: 50 }, render: SingleHand.render };
