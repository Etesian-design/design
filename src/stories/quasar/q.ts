import 'quasar/dist/quasar.css';
import '../../quasar/harmattan-quasar.css';
import { onMounted, onBeforeUnmount, type Component } from 'vue';
import type { StoryObj } from '@storybook/vue3-vite';
import { hdIcon } from '../../quasar/icon-set';

type S = StoryObj;
/** A Quasar story wrapped in .hd-quasar; rendered light + dark side by side by default. */
export function qs(template: string, setup: () => Record<string, unknown> = () => ({}), extra: Partial<S> = {}, components: Record<string, Component> = {}): S {
  return { render: () => ({ components, setup: () => ({ ic: hdIcon, ...setup() }), template: `<div class="hd-quasar hd-q-story" style="padding:16px;min-height:100%">${template}</div>` }), ...extra };
}
/** Overlay stories teleport to <body>: render one theme at a time and set [data-hd-mode] on <html> for the popup. */
export function overlay(template: string, mode: 'hybrid' | 'dark' | 'light', setup: () => Record<string, unknown> = () => ({})): S {
  return {
    globals: { mode },
    render: () => ({
      setup: () => {
        onMounted(() => document.documentElement.setAttribute('data-hd-mode', mode));
        onBeforeUnmount(() => document.documentElement.removeAttribute('data-hd-mode'));
        return { ic: hdIcon, ...setup() };
      },
      template: `<div class="hd-quasar hd-q-story" style="padding:16px;min-height:480px">${template}</div>`,
    }),
  };
}
export const both = { globals: { mode: 'all' } };
