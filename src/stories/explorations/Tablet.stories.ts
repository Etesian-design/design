import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import HdTabBar from '../../components/HdTabBar.vue';
import XStage from './parts/XStage.vue';
import XTablet from './tablet/XTablet.vue';
import TabletHome from './tablet/TabletHome.vue';
import TabletSplit from './tablet/TabletSplit.vue';
import TabletSheet from './tablet/TabletSheet.vue';
import XMiniApp from './parts/XMiniApp.vue';

/**
 * Explorations: what the Harmattan look could become on a 10" tablet (1280 x 800 CSS px landscape, 800 x 1280 portrait).
 * Static-but-interactive mockups built from the library components; nothing here is a library API.
 */
const meta: Meta = {
  title: 'Explorations/Tablet',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Tablet directions for the Harmattan Design Language. Each story shows the idea at real size (1280 x 800 / 800 x 1280 CSS px), scaled to fit the canvas, with what you get and what you give up. Hybrid colour mode by default; use the Mode toolbar for Dark, Light or all three.' } } },
};
export default meta;
type S = StoryObj;
type Orient = 'landscape' | 'portrait' | 'both';
const ORIENT = [{ id: 'landscape', label: 'Landscape' }, { id: 'portrait', label: 'Portrait' }, { id: 'both', label: 'Both' }];
const desc = (idea: string, gain: string, cost: string) => ({ docs: { description: { story: `${idea}\n\n**You get:** ${gain}\n\n**You give up:** ${cost}` } } });
const orients = (o: Orient) => (o === 'both' ? ['landscape', 'portrait'] : [o]) as ('landscape' | 'portrait')[];
const base = { HdTabBar, XStage, XTablet };

const T1 = {
  title: 'T1 · Home views at tablet size',
  idea: 'The three N9 home views, unchanged in idea, given room: a 6-column app grid, Open applications as 3×3 or 4×3 live cards (each card is the running app, scaled), Events in two columns with squircle image previews.',
  gain: 'zero new concepts; anyone who used an N9 knows where everything is, and live cards show real state at a glance.',
  cost: 'one view at a time: on a big screen you swipe between views that could have shared the space (see T2).',
};
export const T1HomeViews: S = {
  name: 'T1 Home views',
  args: { view: 1, grid: '3x3', orientation: 'both', editing: false },
  argTypes: { view: { control: { type: 'inline-radio' }, options: [0, 1, 2] }, grid: { control: { type: 'inline-radio' }, options: ['3x3', '4x3'] }, orientation: { control: { type: 'inline-radio' }, options: ['landscape', 'portrait', 'both'] } },
  parameters: desc(T1.idea, T1.gain, T1.cost),
  render: (args) => ({
    components: { ...base, TabletHome },
    setup: () => {
      const view = ref(String(args.view)); const edit = ref(!!args.editing); const grid = ref(args.grid); const o = ref<Orient>(args.orientation);
      return { T1, edit, view, grid, o, list: computed(() => orients(o.value)), ORIENT,
        VIEWS: [{ id: '0', label: 'Events' }, { id: '1', label: 'Applications' }, { id: '2', label: 'Open apps' }], GRIDS: [{ id: '3x3', label: '3×3' }, { id: '4x3', label: '4×3' }] };
    },
    template: `<XStage v-bind="T1">
      <template #controls><HdTabBar v-model="view" :tabs="VIEWS" label="Home view" id-prefix="t1v" /><HdTabBar v-model="grid" :tabs="GRIDS" label="Open apps grid" id-prefix="t1g" /><HdTabBar v-model="o" :tabs="ORIENT" label="Orientation" id-prefix="t1o" /><label style="font-size:13px"><input type="checkbox" v-model="edit"> Open apps edit mode</label></template>
      <XTablet v-for="x in list" :key="x + view + grid" :orientation="x"><TabletHome :orientation="x" :view="Number(view)" :grid="grid" :editing="edit" /></XTablet>
    </XStage>`,
  }),
};

const T2 = {
  title: 'T2 · Events beside the app grid (landscape, opt-in)',
  idea: 'In landscape, an opt-in setting merges Events and Applications into one home: Events as a 420px column on the left, the app grid (5 columns) on the right. Open applications stays its own view. Portrait ignores the setting and keeps three views.',
  gain: 'notifications and launchers together, one swipe fewer; the big landscape screen stops looking empty.',
  cost: 'the calm single-purpose views; home becomes busier, and landscape and portrait now behave differently.',
};
export const T2EventsBeside: S = {
  name: 'T2 Events beside app grid',
  args: { beside: true, orientation: 'landscape' },
  parameters: desc(T2.idea, T2.gain, T2.cost),
  render: (args) => ({
    components: { ...base, TabletHome },
    setup: () => { const on = ref(args.beside ? 'on' : 'off'); const o = ref<Orient>(args.orientation); return { T2, on, o, list: computed(() => orients(o.value)), ORIENT, OPT: [{ id: 'on', label: 'Events beside: on' }, { id: 'off', label: 'Off (N9 default)' }] }; },
    template: `<XStage v-bind="T2">
      <template #controls><HdTabBar v-model="on" :tabs="OPT" label="Setting" id-prefix="t2s" /><HdTabBar v-model="o" :tabs="ORIENT" label="Orientation" id-prefix="t2o" /></template>
      <XTablet v-for="x in list" :key="x + on" :orientation="x"><TabletHome :orientation="x" :view="1" :events-beside="on === 'on'" /></XTablet>
    </XStage>`,
  }),
};

const T3 = {
  title: 'T3 · Two-pane list / detail (Mail)',
  idea: 'Landscape shows the message list and the open message side by side (a container query at 860px, so the same app also works in a split pane). Portrait falls back to the phone pattern: one list, tap to read, Back bottom-left to return.',
  gain: 'no drill-down on the big screen, the list keeps its context; one app layout that adapts to any width.',
  cost: 'two layouts to design and test per app; the reading pane is narrower than a full-screen page.',
};
export const T3TwoPane: S = {
  name: 'T3 Two-pane Mail',
  args: { orientation: 'both' },
  parameters: desc(T3.idea, T3.gain, T3.cost),
  render: (args) => ({
    components: { ...base, XMiniApp },
    setup: () => { const o = ref<Orient>(args.orientation); return { T3, o, list: computed(() => orients(o.value)), ORIENT }; },
    template: `<XStage v-bind="T3">
      <template #controls><HdTabBar v-model="o" :tabs="ORIENT" label="Orientation" id-prefix="t3o" /></template>
      <XTablet v-for="x in list" :key="x" :orientation="x" :label="x === 'landscape' ? 'Landscape: list + detail' : 'Portrait: single pane'"><XMiniApp name="Mail" :landscape="x === 'landscape'" :id-prefix="'t3' + x" /></XTablet>
    </XStage>`,
  }),
};

const T4 = {
  title: 'T4 · Split view and pop-up window',
  idea: 'Two apps share the screen, 1/2 + 1/2 or 2/3 + 1/3 (stacked in portrait), each with its own bottom toolbar; drag the divider to resize. A third app can float as a pop-up window with a small mini-toolbar: drag handle, move to split, full screen, close.',
  gain: 'real multitasking: reply to a message while reading mail; the pop-up suits quick notes and calls.',
  cost: 'the N9 promise of one app, full screen, one gesture; more window management, two toolbars on screen, and apps must handle narrow widths.',
};
export const T4SplitView: S = {
  name: 'T4 Split view + pop-up',
  args: { ratio: 'half', popup: true, orientation: 'landscape' },
  argTypes: { ratio: { control: { type: 'inline-radio' }, options: ['half', 'third'] } },
  parameters: desc(T4.idea, T4.gain, T4.cost),
  render: (args) => ({
    components: { ...base, TabletSplit },
    setup: () => { const r = ref(args.ratio); const p = ref(args.popup ? 'on' : 'off'); const o = ref<Orient>(args.orientation);
      return { T4, r, p, o, list: computed(() => orients(o.value)), ORIENT, R: [{ id: 'half', label: '1/2 + 1/2' }, { id: 'third', label: '2/3 + 1/3' }], P: [{ id: 'on', label: 'Pop-up on' }, { id: 'off', label: 'Off' }] }; },
    template: `<XStage v-bind="T4">
      <template #controls><HdTabBar v-model="r" :tabs="R" label="Split" id-prefix="t4r" /><HdTabBar v-model="p" :tabs="P" label="Pop-up" id-prefix="t4p" /><HdTabBar v-model="o" :tabs="ORIENT" label="Orientation" id-prefix="t4o" /></template>
      <XTablet v-for="x in list" :key="x + r + p" :orientation="x"><TabletSplit :orientation="x" :ratio="r === 'half' ? '1/2' : '1/3'" :popup="p === 'on'" /></XTablet>
    </XStage>`,
  }),
};

const T5 = {
  title: 'T5 · Landscape toolbar: bottom (N9) vs. side',
  idea: 'Left: the N9-defined landscape toolbar, 56 n9px tall (--hd-size-toolbar-landscape, 37 CSS px), at the bottom with Back bottom-left, tabs centred, menu right. Right: the same toolbar turned onto the left edge, 56px wide, Back still bottom-left, menu at the top. The selected tab shows the squircle highlight.',
  gain: '(bottom) N9 muscle memory and one rule for every orientation; (side) ~6% more content height and controls under the left thumb.',
  cost: '(bottom) the bar is wide and sparse on 1280px and far from the right thumb; (side) a second toolbar layout, and actions move away from Back.',
};
export const T5Toolbars: S = {
  name: 'T5 Bottom vs side toolbar',
  args: { variant: 'both' },
  parameters: desc(T5.idea, T5.gain, T5.cost),
  render: (args) => ({
    components: { ...base, XMiniApp },
    setup: () => { const v = ref(args.variant); return { T5, v, V: [{ id: 'both', label: 'Compare' }, { id: 'bottom', label: 'Bottom (N9)' }, { id: 'side', label: 'Side' }] }; },
    template: `<XStage v-bind="T5">
      <template #controls><HdTabBar v-model="v" :tabs="V" label="Toolbar" id-prefix="t5v" /></template>
      <XTablet v-if="v !== 'side'" label="Bottom toolbar, 56 n9px (N9)"><XMiniApp name="Calendar" landscape chrome="toolbar" id-prefix="t5a" /></XTablet>
      <XTablet v-if="v !== 'bottom'" label="Side toolbar, 56px wide"><XMiniApp name="Calendar" landscape chrome="side" id-prefix="t5b" /></XTablet>
    </XStage>`,
  }),
};

const T6 = {
  title: 'T6 · Sheet as a centred panel',
  idea: 'On the phone a Sheet (new item flows: Cancel left, Save right) covers the whole screen. On the tablet it becomes a 640px centred panel over a dark scrim, the app still visible behind it.',
  gain: 'context stays visible, the form is a comfortable width instead of a 1280px-wide row of fields.',
  cost: 'the strong "you are now in a separate task" signal of the full-screen sheet; less room for long forms (they scroll inside the panel).',
};
export const T6CentredSheet: S = {
  name: 'T6 Centred sheet',
  args: { variant: 'centred', orientation: 'landscape' },
  parameters: desc(T6.idea, T6.gain, T6.cost),
  render: (args) => ({
    components: { ...base, TabletSheet },
    setup: () => { const v = ref(args.variant); const o = ref<Orient>(args.orientation); return { T6, v, o, list: computed(() => orients(o.value)), ORIENT, V: [{ id: 'centred', label: 'Centred panel' }, { id: 'full', label: 'Full screen (phone)' }] }; },
    template: `<XStage v-bind="T6">
      <template #controls><HdTabBar v-model="v" :tabs="V" label="Sheet" id-prefix="t6v" /><HdTabBar v-model="o" :tabs="ORIENT" label="Orientation" id-prefix="t6o" /></template>
      <XTablet v-for="x in list" :key="x + v" :orientation="x"><TabletSheet :orientation="x" :variant="v" /></XTablet>
    </XStage>`,
  }),
};
