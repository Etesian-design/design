import type { Preview } from '@storybook/vue3';
import { setup } from '@storybook/vue3';
import { installQuasar } from '../src/stories/quasar/quasar-app';
import '../src/styles/tokens.css';
import '../src/styles/base.css';
import HdTheme from '../src/components/HdTheme.vue';

setup((app) => installQuasar(app));

const preview: Preview = {
  globalTypes: {
    mode: {
      description: 'Colour mode',
      toolbar: { title: 'Mode', icon: 'mirror', items: [{ value: 'hybrid', title: 'Hybrid (N9, default)' }, { value: 'dark', title: 'Dark' }, { value: 'light', title: 'Light' }, { value: 'all', title: 'All three side by side' }], dynamicTitle: true },
    },
    accent: {
      description: 'Accent colour',
      toolbar: { title: 'Accent', icon: 'paintbrush', items: [
        { value: '', title: 'Default #4591FF' }, { value: '#62B700', title: 'Phone' }, { value: '#09A7CC', title: 'Conversations' },
        { value: '#0067BC', title: 'Email' }, { value: '#821DDE', title: 'Photos' }, { value: '#CC09BA', title: 'Music' },
        { value: '#EF5500', title: 'Calendar' }, { value: '#F2B111', title: 'Notes' }], dynamicTitle: true },
    },
  },
  initialGlobals: { mode: 'hybrid', accent: '' },
  decorators: [
    (story, ctx) => ({
      components: { story, HdTheme },
      setup: () => ({ mode: ctx.globals.mode ?? 'hybrid', accent: ctx.globals.accent || undefined, full: ctx.parameters.layout === 'fullscreen' }),
      template: `<div v-if="mode === 'all'" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));min-height:100%">
          <HdTheme v-for="m in ['hybrid','dark','light']" :key="m" :mode="m" :accent="accent" style="padding:16px;position:relative;overflow:hidden"><div style="font:700 11px/1 sans-serif;opacity:.6;margin-bottom:8px;text-transform:uppercase">{{ m }}</div><story /></HdTheme></div>
        <HdTheme v-else :mode="mode" :accent="accent" :style="full ? 'min-height:100vh;position:relative' : 'padding:24px;position:relative;min-height:120px'"><story /></HdTheme>`,
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color|accent)$/i } },
    options: { storySort: { order: ['Guide', ['Introduction', 'Principles', 'Colour', 'Colour modes', 'Typography', 'Spacing & sizing', 'Shape (squircle)', 'Iconography', 'Icon lighting', 'Motion', 'Sound & haptics', 'Layout & grids', 'Components', 'Patterns', 'Accessibility', 'Contributing & gaps'], 'OS', 'Controls', 'Overlays', 'Web', 'Examples', 'Quasar', ['Using with Quasar', 'Examples', 'Components']] } },
  },
};
export default preview;
