import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import HdTabBar from '../../components/HdTabBar.vue';
import XStage from './parts/XStage.vue';
import DesktopWorkspace from './desktop/DesktopWorkspace.vue';
import DesktopColumns from './desktop/DesktopColumns.vue';
import DesktopHome from './desktop/DesktopHome.vue';
import DesktopDetails from './desktop/DesktopDetails.vue';

/** Explorations: the Harmattan look on a 1920 x 1080 desktop with mouse and keyboard. Mockups only, not library API. */
const meta: Meta = {
  title: 'Explorations/Desktop',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Desktop directions (mouse + keyboard) for the Harmattan Design Language, at 1920 x 1080 scaled to fit. Keyboard shortcuts are shown as small key hints on the mockups; several also work in the canvas (Super/Meta, Escape, Super+Arrows). Hybrid colour mode by default. C (classic taskbar) was dropped after review; see Desktop v2 for the merged direction.' } } },
};
export default meta;
type S = StoryObj;
const desc = (idea: string, gain: string, cost: string) => ({ docs: { description: { story: `${idea}\n\n**You get:** ${gain}\n\n**You give up:** ${cost}` } } });
const tabs = (o: Record<string, string>) => Object.entries(o).map(([id, label]) => ({ id, label }));

const A = {
  title: 'A · Workspace overview',
  idea: 'Normal overlapping, resizable windows with slim 30px Harmattan title bars, a slim 28px top bar (clock, connections, battery, notification count) and no taskbar. Super opens a full-screen overview: Events on the left, open windows as live thumbnails in the middle, the app grid with type-to-search on the right.',
  gain: 'the most screen for apps; one key shows everything (notifications, windows, apps) in the three-part N9 home order.',
  cost: 'nothing is visible without pressing Super (no running-app list on screen); overlapping windows need manual arranging.',
};
export const AWorkspaceOverview: S = {
  name: 'A Workspace overview',
  args: { state: 'windows', query: '' },
  argTypes: { state: { control: { type: 'inline-radio' }, options: ['windows', 'overview'] } },
  parameters: desc(A.idea, A.gain, A.cost),
  render: (args) => ({
    components: { XStage, HdTabBar, DesktopWorkspace },
    setup: () => { const s = ref(args.query ? 'typing' : args.state); return { A, s, T: tabs({ windows: 'Windows', overview: 'Overview (Super)', typing: 'Overview, typing “mu”' }) }; },
    template: `<XStage v-bind="A"><template #controls><HdTabBar v-model="s" :tabs="T" label="State" id-prefix="da" /></template>
      <DesktopWorkspace :key="s" :state="s === 'windows' ? 'windows' : 'overview'" :query="s === 'typing' ? 'mu' : ''" /></XStage>`,
  }),
};

const B = {
  title: 'B · Docked columns',
  idea: 'A tiling desktop: windows snap to 1/3, 1/2 or 2/3 columns (Super+Left/Right, or drag to an edge for a snap preview) and never overlap. Events is a panel that slides in from the right edge (Super+N or the notification count in the top bar).',
  gain: 'no window juggling, every open app readable at once; very keyboard friendly; calm and orderly like the N9.',
  cost: 'free-form window sizes and overlap (dialogs, small utilities); narrow columns force apps into their compact layouts.',
};
export const BDockedColumns: S = {
  name: 'B Docked columns',
  args: { layout: 'thirds', events: false, snapping: false },
  argTypes: { layout: { control: { type: 'inline-radio' }, options: ['thirds', 'halves', 'two-thirds'] } },
  parameters: desc(B.idea, B.gain, B.cost),
  render: (args) => ({
    components: { XStage, HdTabBar, DesktopColumns },
    setup: () => { const s = ref(args.events ? 'events' : args.snapping ? 'snap' : args.layout); return { B, s, T: tabs({ thirds: '3 columns', halves: '1/2 + 1/2', 'two-thirds': '2/3 + 1/3', snap: 'Snap preview', events: 'Events panel' }) }; },
    template: `<XStage v-bind="B"><template #controls><HdTabBar v-model="s" :tabs="T" label="Layout" id-prefix="db" /></template>
      <DesktopColumns :key="s" :layout="['halves', 'two-thirds'].includes(s) ? s : 'thirds'" :events="s === 'events'" :snapping="s === 'snap'" /></XStage>`,
  }),
};

const D = {
  title: 'D · Home is the desktop',
  idea: 'The N9 model kept whole: one app full screen with the top bar. Super minimises it (it slides away) to reveal the three home views side by side as the desktop itself. Two apps can split the screen and a third can float as a pop-up. A hidden peek dock slides up one row of favourites while the pointer is held at the bottom edge; Open-app cards show their ✕ on hover.',
  gain: 'the purest Harmattan: one focus at a time, home is always one key away and doubles as the app switcher; no taskbar clutter.',
  cost: 'free windows: at most split + one pop-up; heavy multitaskers juggling many windows will feel boxed in.',
};
export const DHomeIsDesktop: S = {
  name: 'D Home is the desktop',
  args: { state: 'app' },
  argTypes: { state: { control: { type: 'inline-radio' }, options: ['app', 'home', 'split', 'peek', 'hover'] } },
  parameters: desc(D.idea, D.gain, D.cost),
  render: (args) => ({
    components: { XStage, HdTabBar, DesktopHome },
    setup: () => { const s = ref(args.state); return { D, s, T: tabs({ app: 'App full screen', home: 'Minimised (Super)', split: 'Split + pop-up', peek: 'Peek dock', hover: 'Card hover ✕' }) }; },
    template: `<XStage v-bind="D"><template #controls><HdTabBar v-model="s" :tabs="T" label="State" id-prefix="dd" /></template>
      <DesktopHome :state="s" /></XStage>`,
  }),
};

const E = {
  title: 'Shared desktop details',
  idea: 'Details every desktop direction shares: the toolbar becomes a header bar inside the window (Back on the left, actions and a menu button on the right), right-click opens a context menu with shortcuts, pointer density (32px rows) next to touch density (53px), hover / focus / pressed states and tooltips. Every icon button and selection highlight is a squircle.',
  gain: 'one set of rules for A, B and D; mouse users get compact rows and shortcuts, touch laptops keep N9 sizes.',
  cost: 'the bottom toolbar of the phone (Back moves from bottom-left to top-left on the desktop); two densities to maintain.',
};
export const ESharedDetails: S = {
  name: 'Shared details',
  parameters: desc(E.idea, E.gain, E.cost),
  render: () => ({ components: { XStage, DesktopDetails }, setup: () => ({ E }), template: '<XStage v-bind="E"><DesktopDetails /></XStage>' }),
};
