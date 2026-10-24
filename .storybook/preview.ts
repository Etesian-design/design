import type { Preview } from '@storybook/vue3';
import { setup } from '@storybook/vue3';
import { installQuasar } from '../src/stories/quasar/quasar-app';
import '../src/styles/tokens.css';
import '../src/styles/base.css';
import HdTheme from '../src/components/HdTheme.vue';

setup((app) => installQuasar(app));

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Harmattan theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: [{ value: 'light', title: 'Light (blanco)' }, { value: 'dark', title: 'Dark (inverted)' }, { value: 'both', title: 'Side by side' }], dynamicTitle: true },
    },
    accent: {
      description: 'Accent colour',
      toolbar: { title: 'Accent', icon: 'paintbrush', items: [
        { value: '', title: 'Default #4591FF' }, { value: '#62B700', title: 'Phone' }, { value: '#09A7CC', title: 'Conversations' },
        { value: '#0067BC', title: 'Email' }, { value: '#821DDE', title: 'Photos' }, { value: '#CC09BA', title: 'Music' },
        { value: '#EF5500', title: 'Calendar' }, { value: '#F2B111', title: 'Notes' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', accent: '' },
  decorators: [
    (story, ctx) => ({
      components: { story, HdTheme },
      setup: () => ({ theme: ctx.globals.theme ?? 'light', accent: ctx.globals.accent || undefined, full: ctx.parameters.layout === 'fullscreen' }),
      template: `<div v-if="theme === 'both'" style="display:grid;grid-template-columns:1fr 1fr;min-height:100%">
          <HdTheme theme="light" :accent="accent" style="padding:24px;position:relative"><story /></HdTheme>
          <HdTheme theme="dark" :accent="accent" style="padding:24px;position:relative"><story /></HdTheme></div>
        <HdTheme v-else :theme="theme" :accent="accent" :style="full ? 'min-height:100vh;position:relative' : 'padding:24px;position:relative;min-height:120px'"><story /></HdTheme>`,
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color|accent)$/i } },
    options: { storySort: { order: ['Guide', ['Introduction', 'Principles', 'Colour', 'Typography', 'Spacing & sizing', 'Shape (squircle)', 'Iconography', 'Icon lighting', 'Motion', 'Sound & haptics', 'Layout & grids', 'Components', 'Patterns', 'Accessibility', 'Contributing & gaps'], 'OS', 'Controls', 'Overlays', 'Web', 'Examples', 'Quasar', ['Using with Quasar', 'Examples', 'Components']] } },
  },
};
export default preview;
