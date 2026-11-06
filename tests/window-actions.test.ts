import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import XWindow from '../src/shell/desktop/XWindow.vue';
import type { XAction } from '../src/shell/parts/types';

const TOOLS: XAction[] = ['add', 'search', 'refresh', 'folder', 'delete', 'check', 'star', 'share', 'settings'].map((icon) => ({ icon, label: icon }));
const win = (w: number, extra = {}) => mount(XWindow, { props: { title: 'Inbox', icon: 'mail', color: '#1C6FD1', w, h: 400, tools: TOOLS, ...extra } });
const labels = (el: Element | null) => [...(el?.querySelectorAll('button') ?? [])].map((b) => b.getAttribute('aria-label') ?? b.textContent?.trim());

describe('window actions fold by width', () => {
  it('shows every action when they fit, with no ⋮', () => {
    const w = win(1400);
    expect(labels(w.find('.x-win__actions').element)).toEqual(TOOLS.map((t) => t.label));
    expect(w.find('.x-win__bottom').exists()).toBe(false);
  });
  it('folds the last actions into ⋮ in priority order, keeping the window controls', async () => {
    const w = win(640);
    const shown = labels(w.find('.x-win__actions').element);
    expect(shown.at(-1)).toBe('More');
    const n = shown.length - 1;
    expect(n).toBeGreaterThan(0);
    expect(shown.slice(0, n)).toEqual(TOOLS.slice(0, n).map((t) => t.label));
    expect(labels(w.find('.x-win__ctl').element)).toEqual(['Minimise', 'Maximise', 'Close']);
    await w.find('.x-win__more').trigger('click');
    expect(labels(w.find('.x-moremenu').element)).toEqual(TOOLS.slice(n).map((t) => t.label));
  });
  it('takes the phone pattern when narrow: Back and three actions below, the rest in ⋮', async () => {
    const w = win(400, { back: true });
    expect(w.find('.x-win__actions').exists()).toBe(false);
    expect(labels(w.find('.x-win__bottom').element)).toEqual(['Back', 'add', 'search', 'refresh', 'More']);
    expect(w.find('.x-win__lead [aria-label=Back]').exists()).toBe(false);
    await w.find('.x-win__bottom .x-win__more').trigger('click');
    expect(labels(w.find('.x-moremenu').element)).toEqual(TOOLS.slice(3).map((t) => t.label));
    expect(w.find('.x-win__more').element.innerHTML).toContain('M12 5h.01');
  });
});

describe('a page declares its header with useChrome', () => {
  it('shows the page title, views and actions in the window, and sends the clicks back', async () => {
    const { defineComponent, h, nextTick } = await import('vue');
    const { useChrome } = await import('../src/shell/parts/chrome');
    const got: string[] = [];
    const Page = defineComponent({ setup() {
      const c = useChrome(() => ({ views: ['Inbox', 'Sent'], tools: [{ icon: 'add', label: 'Write' }, { icon: 'refresh', label: 'Refresh' }] }));
      c.on('tool', (l) => got.push(`tool:${l}`)); c.on('view', (v) => got.push(`view:${v}`));
      return () => h('p', 'page');
    } });
    const w = mount(XWindow, { props: { title: 'Mail', icon: 'mail', color: '#1C6FD1', w: 1000, h: 400 }, slots: { default: () => h(Page) } });
    await nextTick();
    expect(w.find('.x-win__title--menu').text()).toContain('Inbox');
    expect(labels(w.find('.x-win__actions').element)).toEqual(['Write', 'Refresh']);
    await w.find('.x-win__actions [aria-label=Write]').trigger('click');
    await w.find('.x-win__title--menu').trigger('click');
    await w.findAll('.x-viewmenu__item')[1]!.trigger('click');
    expect(got).toEqual(['tool:Write', 'view:Sent']);
  });
});
