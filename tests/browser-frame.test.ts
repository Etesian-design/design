import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import XBrowserFrame from '../src/shell/apps/XBrowserFrame.vue';

// 2026-11-09: the star in the address bar is a button (Cloud Companion's Browser bookmarks the page with it)
describe('browser frame star', () => {
  it('is a toggle button that says whether the page is bookmarked, and emits star', async () => {
    const w = mount(XBrowserFrame, { props: { starred: false } });
    const b = w.get('.x-bf__star');
    expect(b.attributes('aria-pressed')).toBe('false');
    expect(b.attributes('aria-label')).toBe('Bookmark');
    await b.trigger('click');
    expect(w.emitted('star')).toHaveLength(1);
    await w.setProps({ starred: true });
    expect(w.get('.x-bf__star').attributes('aria-pressed')).toBe('true');
    expect(w.get('.x-bf__star').attributes('aria-label')).toBe('Remove bookmark');
    expect(w.get('.x-bf__star').classes()).toContain('is-on');
  });
});
