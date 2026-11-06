import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import XBrowserFrame from '../src/shell/apps/XBrowserFrame.vue';
import XShell from '../src/shell/desktop/XShell.vue';
import HdToastStack from '../src/components/HdToastStack.vue';
import HdStatusState from '../src/components/HdStatusState.vue';

describe('browser frame for a host', () => {
  it('puts the host menu inside the ⋮ button box and still reports the press', async () => {
    const w = mount(XBrowserFrame, { slots: { more: () => h('div', { class: 'host-menu' }) } });
    const box = w.find('.x-bf__more');
    expect(box.find('.host-menu').exists()).toBe(true);
    await box.find('[aria-label^="More"]').trigger('click');
    expect(w.emitted('more')).toHaveLength(1);
  });
  it('gives the address field squircle-half ends, not a pill', () => {
    expect(mount(XBrowserFrame).find('.x-bf__addr').classes()).toContain('hd-sqm');
  });
});

describe('desktop widgets', () => {
  it('get the free area beside the dock', () => {
    let area: { x: number; w: number } | undefined;
    mount(XShell, { props: { apps: [] }, slots: { widgets: (p: { area: { x: number; w: number } }) => { area = p.area; return h('i'); } }, attachTo: document.body });
    expect(area).toBeDefined();
    expect(area!.x).toBeGreaterThan(0); // the dock is on the left and always shown by default
  });
});

describe('toast stack', () => {
  it('closes a toast by its action, by ×, and after its time', async () => {
    vi.useFakeTimers();
    const w = mount(HdToastStack, { props: { toasts: [{ id: 1, text: 'Deleted', action: 'Undo' }, { id: 2, text: 'Saved', timeout: 1000 }] } });
    expect(w.findAll('.hd-toast')).toHaveLength(2);
    await w.find('[data-test=toast-action]').trigger('click');
    expect(w.emitted('close')?.[0]).toEqual([1, true]);
    vi.advanceTimersByTime(1000);
    expect(w.emitted('close')?.[1]).toEqual([2, false]);
    await w.findAll('[aria-label=Dismiss]')[0]!.trigger('click');
    expect(w.emitted('close')?.[2]).toEqual([1, false]);
    vi.useRealTimers();
  });
  it('waits while hovered', async () => {
    vi.useFakeTimers();
    const w = mount(HdToastStack, { props: { toasts: [{ id: 1, text: 'Saved', timeout: 1000 }] } });
    await w.find('.hd-toast').trigger('mouseenter');
    vi.advanceTimersByTime(5000);
    expect(w.emitted('close')).toBeUndefined();
    vi.useRealTimers();
  });
});

describe('status state', () => {
  it('shows the busy indicator while loading and a warning on error', () => {
    expect(mount(HdStatusState, { props: { state: 'loading', title: 'Loading' } }).find('.hd-busy, [role=progressbar], svg').exists()).toBe(true);
    const e = mount(HdStatusState, { props: { state: 'error', title: 'Failed', text: 'No answer' }, slots: { default: () => h('button', 'Retry') } });
    expect(e.attributes('role')).toBe('alert');
    expect(e.text()).toContain('No answer');
    expect(e.find('button').text()).toBe('Retry');
  });
});
