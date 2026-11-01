import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MotionDemo, { type MotionKind } from './MotionDemo.vue';

/** Live motion demos for Guide / Motion: each loops on the real motion tokens. */
const meta: Meta = { title: 'Guide/Motion demos', tags: ['!dev', '!autodocs'], parameters: { layout: 'centered' } };
export default meta;
const row = (kinds: MotionKind[]): StoryObj => ({
  render: () => ({ components: { MotionDemo }, setup: () => ({ kinds }), template: '<div style="display:flex;flex-wrap:wrap;gap:24px;justify-content:center"><MotionDemo v-for="k in kinds" :key="k" :kind="k" /></div>' }),
});
export const Easings = row(['easings']);
export const InApps = row(['drill', 'sheet', 'dialog', 'info']);
export const System = row(['minimise', 'close', 'launch', 'restore', 'card', 'unlock']);
