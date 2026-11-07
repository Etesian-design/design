import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import XBrowserFrame from '../src/shell/apps/XBrowserFrame.vue';
import XShell from '../src/shell/desktop/XShell.vue';
import HdToastStack from '../src/components/HdToastStack.vue';
import HdStatusState from '../src/components/HdStatusState.vue';
import BelleWidget from '../src/shell/widgets/BelleWidget.vue';
import XWindow from '../src/shell/desktop/XWindow.vue';
import XClassic from '../src/shell/web/XClassic.vue';

describe('browser frame for a host', () => {
  it('puts the host menu inside the ⋮ button box and still reports the press', async () => {
    const w = mount(XBrowserFrame, { slots: { more: () => h('div', { class: 'host-menu' }) } });
    const box = w.find('.x-bf__more');
    expect(box.find('.host-menu').exists()).toBe(true);
    await box.find('[aria-label^="More"]').trigger('click');
    expect(w.emitted('more')).toHaveLength(1);
  });
  it('draws the tabs as a strip above the row, or as a list on the side', () => {
    const tabs = [{ id: 'a', title: 'One' }, { id: 'b', title: 'Two' }];
    const top = mount(XBrowserFrame, { props: { tabs, current: 'a', tabsAt: 'top' } });
    expect(top.findAll('.x-bf__strip [role=tab]')).toHaveLength(2);
    expect(top.find('.x-bf__side').exists()).toBe(false);
    const side = mount(XBrowserFrame, { props: { tabs, current: 'a', tabsAt: 'side' } });
    expect(side.find('.x-bf__strip').exists()).toBe(false);
    expect(side.findAll('.x-bf__side [role=tab]')).toHaveLength(2);
  });
  it('in a window, puts the tabs in its decoration in place of the title, with no strip of their own', async () => {
    const tabs = [{ id: 'a', title: 'One' }, { id: 'b', title: 'Two' }];
    const w = mount(XWindow, { props: { title: 'Browser', icon: 'globe', color: '#2a6' }, slots: { default: () => h(XBrowserFrame, { tabs, current: 'b', max: 3 }) } });
    await nextTick();
    const bar = w.find('.x-win__bar');
    expect(bar.findAll('[role=tab]')).toHaveLength(2);
    expect(bar.find('[role=tab][aria-selected=true]').text()).toContain('Two');
    expect(bar.find('h2.x-win__title').exists()).toBe(false);
    expect(w.find('.x-bf__strip').exists()).toBe(false);
    const frame = w.findComponent(XBrowserFrame);
    await bar.findAll('[role=tab]')[0]!.trigger('click');
    await bar.find('[aria-label="Close Two"]').trigger('click');
    await bar.find('[aria-label="New tab"]').trigger('click');
    expect(frame.emitted('pick')).toEqual([['a']]);
    expect(frame.emitted('close')).toEqual([['b']]);
    expect(frame.emitted('add')).toHaveLength(1);
  });
  it('in the classic layout, puts the tabs in the header bar', async () => {
    const tabs = [{ id: 'a', title: 'One' }];
    const w = mount(XClassic, { props: { apps: [{ id: 'web', title: 'Browser', icon: 'globe', color: '#2a6' }], app: 'web' }, slots: { default: () => h(XBrowserFrame, { tabs, current: 'a' }) } });
    await nextTick();
    expect(w.findAll('.x-cl__bar [role=tab]')).toHaveLength(1);
    expect(w.find('.x-bf__strip').exists()).toBe(false);
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

describe('Belle mail widgets with real mail', () => {
  const mails = [{ from: 'Mikko', subject: 'Cabin', when: '10:02', unread: true }, { from: 'Bank', subject: 'Statement', when: 'Mon', unread: false }];
  it('list the host mail, its account and unread count, and report a tap', async () => {
    const w = mount(BelleWidget, { props: { kind: 'mail', mails, account: 'me@example.org' } });
    expect(w.find('.bw-mail__head').text()).toContain('me@example.org');
    expect(w.find('.bw-mail__count').text()).toBe('1');
    expect(w.findAll('.bw-mail__row')).toHaveLength(2);
    await w.findAll('.bw-mail__row')[1]!.trigger('click');
    expect(w.emitted('open')?.[0]).toEqual([1]);
  });
  it('step through one mail at a time, and say when there is none', async () => {
    const w = mount(BelleWidget, { props: { kind: 'stackmail', mails } });
    expect(w.find('.bw-stack__mail').text()).toContain('Mikko');
    await w.find('[aria-label="Older mail"]').trigger('click');
    expect(w.find('.bw-stack__mail').text()).toContain('Bank');
    expect(mount(BelleWidget, { props: { kind: 'stackmail', mails: [] } }).text()).toContain('No mail.');
    expect(mount(BelleWidget, { props: { kind: 'mail', mails: [], empty: 'Mail is not set up.' } }).text()).toContain('Mail is not set up.');
  });
});

describe('dock and recycle bin', () => {
  it('shows the bin empty, or full with how many items, and reports a press', async () => {
    const XShellDock = (await import('../src/shell/desktop/XShellDock.vue')).default;
    const empty = mount(XShellDock, { props: { items: [], binCount: 0 } });
    expect(empty.find('.x-shell-dock__bin').attributes('aria-label')).toBe('Recycle bin, empty');
    expect(empty.find('.x-shell-dock__count').exists()).toBe(false);
    const full = mount(XShellDock, { props: { items: [], binCount: 3 } });
    expect(full.find('.x-shell-dock__bin').classes()).toContain('is-full');
    expect(full.find('.x-shell-dock__count').text()).toBe('3');
    await full.find('.x-shell-dock__bin').trigger('click');
    expect(full.emitted('bin')).toHaveLength(1);
  });
  it('draws the Overview button and the bin as squircle icons, not bare glyphs on the dock', async () => {
    const XShellDock = (await import('../src/shell/desktop/XShellDock.vue')).default;
    const w = mount(XShellDock, { props: { items: [] } });
    expect(w.find('.x-shell-dock__overview .hd-squircle, .x-shell-dock__overview svg').exists()).toBe(true);
    expect(w.findAllComponents({ name: 'HdSquircle' }).length).toBe(2);
  });
  it('has no bin at all for a host without one', () => {
    const w = mount(XShell, { props: { apps: [], bin: false }, attachTo: document.body });
    expect(w.find('.x-shell-dock__bin').exists()).toBe(false);
    w.unmount();
  });
});

const GEARS_AT_0 = ['rotate(0.00 195 118)', 'rotate(0.00 161.7 87.3)', 'rotate(0.00 131.3 130.3)', 'rotate(0.00 145 192)'];
describe('gear clock dial', () => {
  it('draws toothed gears, the hands at the time, the day and the date', async () => {
    const BelleGearDial = (await import('../src/shell/widgets/BelleGearDial.vue')).default;
    const w = mount(BelleGearDial, { props: { h: 10, m: 30, s: 0, day: 'Mon', date: 1 } });
    const gears = w.findAll('.bw-geardial__gear');
    expect(gears.length).toBe(4);
    expect((gears[0]!.attributes('d')!.match(/L/g) ?? []).length).toBeGreaterThan(100); // fine teeth, not a few blunt cogs
    expect(w.text()).toContain('Mon');
    expect(w.findAll('path[transform]:not(.bw-geardial__gear)').map((p) => p.attributes('transform'))).toEqual(['rotate(315 131 131)', 'rotate(180 131 131)']);
    expect((w.find('.bw-geardial__plate').attributes('d')!.match(/M/g) ?? []).length).toBe(6); // a skeleton dial: the plate with its openings
    expect(w.findAll('.bw-geardial__gear').map((g) => g.attributes('transform'))).toEqual(GEARS_AT_0);
  });
});
