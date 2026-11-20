import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { readFileSync } from 'node:fs';
import HdSiteHeader from '../src/components/HdSiteHeader.vue';

const css = readFileSync(`${process.cwd()}/src/components/HdSiteHeader.vue`, 'utf8');
const mk = (n: number, current = -1) => Array.from({ length: n }, (_, i) => ({ label: `L${i}`, href: `#l${i}`, icon: 'star', current: i === current }));

// 2026-11-20: the phone bottom bar had seven links edge to edge, no inset, no current shape.
describe('site header bottom bar on the phone follows the N9 ToolBar', () => {
  it('five or fewer links: all shown, no More', () => {
    const w = mount(HdSiteHeader, { props: { links: mk(5) } });
    expect(w.findAll('a.hd-site-header__link')).toHaveLength(5);
    expect(w.find('.hd-site-header__more').exists()).toBe(false);
    expect(w.findAll('.is-overflow')).toHaveLength(0);
  });
  it('more than five: first four stay, the rest go under More (kept in the DOM for >= 600px)', () => {
    const w = mount(HdSiteHeader, { props: { links: mk(7, 1) } });
    expect(w.findAll('a.hd-site-header__link')).toHaveLength(7);
    expect(w.findAll('a.is-overflow').map((a) => a.text())).toEqual(['L4', 'L5', 'L6']);
    const more = w.get('.hd-site-header__more');
    expect(more.attributes('aria-haspopup')).toBe('menu');
    expect(more.attributes('aria-label')).toBe('More');
    expect(more.classes()).not.toContain('is-current');
    expect(w.get('a[aria-current=page]').text()).toBe('L1');
  });
  it('a current page under More marks More and is named in its label and the menu', async () => {
    const w = mount(HdSiteHeader, { props: { links: mk(7, 6) }, attachTo: document.body });
    const more = w.get('.hd-site-header__more');
    expect(more.classes()).toContain('is-current');
    expect(more.attributes('aria-label')).toBe('More, current page: L6');
    await more.trigger('click');
    expect(more.attributes('aria-expanded')).toBe('true');
    const items = [...document.querySelectorAll('[role=menuitem]')].map((e) => e.textContent);
    expect(items).toEqual(['L4', 'L5', 'L6 (current page)']);
    w.unmount();
  });
  it('icon-only like a ToolIcon: 24px icon, the label kept for screen readers and as the title', () => {
    const w = mount(HdSiteHeader, { props: { links: mk(7, 6) } });
    const a = w.get('a.hd-site-header__link');
    expect(a.attributes('title')).toBe('L0');
    expect(a.attributes('aria-label')).toBe('L0');
    expect(a.get('.hd-site-header__label').text()).toBe('L0');
    expect(a.get('svg').attributes('width')).toBe('24px');
    expect(w.get('.hd-site-header__more').attributes('title')).toBe('More');
  });
  it('cells are inset, evenly spaced, and the current one gets a squircle fill; More is hidden on desktop', () => {
    expect(css).toMatch(/\.hd-site-header__more \{ display: none; \}/);
    expect(css).toMatch(/\.hd-site-header__nav \{ position: fixed;[^}]*justify-content: space-between; gap: 0; padding: 0 calc\(88px \/ 3 - 20px\)/);
    expect(css).toMatch(/\.hd-site-header \.hd-site-header__nav > \.hd-site-header__link \{ flex: none; width: 40px; height: 40px;/);
    expect(css).toMatch(/\.hd-site-header__label \{ display: none; \}/);
    expect(css).toMatch(/\.hd-site-header__nav > \.hd-site-header__more\.is-current[^{]*\{[^}]*background: color-mix\(in srgb, var\(--hd-surface-chrome-fg\) 18%, transparent\)/);
    expect(css).toMatch(/\.hd-site-header__nav::before \{[^}]*background: var\(--hd-surface-chrome\);/);
    expect(css).toMatch(/@media[^{]*\{\s*\/\*[^*]*\*\/\s*\.hd-site-header \{ -webkit-backdrop-filter: none; backdrop-filter: none; \}/);
    expect(css).toMatch(/\.hd-site-header__link\.is-overflow \{ display: none; \}/);
  });
});
