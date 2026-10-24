import type { StorybookConfig } from '@storybook/vue3-vite';
const config: StorybookConfig = {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.ts'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: { name: '@storybook/vue3-vite', options: { docgen: 'vue-component-meta' } },
  docs: { defaultName: 'Docs' },
  core: { disableTelemetry: true },
};
export default config;
