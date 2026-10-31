import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { readFileSync } from 'node:fs';
import XChoice from '../src/stories/explorations/parts/XChoice.vue';

const tabs = Array.from({ length: 20 }, (_, i) => ({ id: `s${i}`, label: `State ${i}` }));
const mountAt = (avail: number, probe: number, modelValue = 's3') => {
  const parent = document.createElement('div');
  document.body.appendChild(parent);
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get() { return avail; } });
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, get() { return this.classList?.contains('x-choice__probe') ? probe : 0; } });
  return mount(XChoice, { attachTo: parent, props: { tabs, modelValue, label: 'State' } });
};

describe('exploration state switcher', () => {
  it('keeps the tab bar when the tabs fit', async () => {
    const w = mountAt(1200, 600); await nextTick();
    expect(w.find('select').exists()).toBe(false);
    expect(w.find('.x-choice > .hd-tab-bar').exists()).toBe(true);
  });
  it('becomes a drop-down when the tabs would overflow', async () => {
    const w = mountAt(400, 2400); await nextTick();
    const sel = w.find('select');
    expect(sel.exists()).toBe(true);
    expect(sel.findAll('option')).toHaveLength(20);
    expect((sel.element as HTMLSelectElement).value).toBe('s3');
    await sel.setValue('s7');
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['s7']);
  });
  it('shows a placeholder when the shared state belongs to another switcher', async () => {
    const w = mountAt(400, 2400, 'other'); await nextTick();
    expect((w.find('select').element as HTMLSelectElement).value).toBe('');
  });
  it('every exploration page uses it instead of a raw tab bar', () => {
    for (const f of ['Desktop', 'Desktop2', 'PhoneV2', 'Tablet']) {
      const s = readFileSync(`src/stories/explorations/${f}.stories.ts`, 'utf8');
      expect(s).not.toMatch(/<HdTabBar/);
      expect(s).toMatch(/<XChoice/);
    }
  });
});
