import { describe, it, expect, vi } from 'vitest';
import { mount, config } from '@vue/test-utils';
import { quasarPlugin } from '../src/stories/quasar/quasar-app';
import { composeStories, setProjectAnnotations } from '@storybook/vue3';
import preview from '../.storybook/preview';

setProjectAnnotations(preview);
config.global.plugins = [quasarPlugin];
const modules = import.meta.glob('../src/stories/**/*.stories.ts', { eager: true }) as Record<string, any>;

describe('all stories render', () => {
  for (const [file, mod] of Object.entries(modules)) {
    const stories = composeStories(mod);
    for (const [name, Story] of Object.entries(stories)) {
      it(`${file.replace('../src/stories/', '')} > ${name}`, () => {
        const errors: unknown[] = [];
        const spy = vi.spyOn(console, 'warn').mockImplementation((...a) => { if (String(a[0]).includes('[Vue warn]')) errors.push(a[0]); });
        const w = mount(Story as any, { attachTo: document.body });
        expect(w.html().length).toBeGreaterThan(10);
        w.unmount();
        spy.mockRestore();
        expect(errors).toEqual([]);
      });
    }
  }
});
