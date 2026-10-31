import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import * as Hd from '../src/index';
import { icons } from '../src/components/icons';
import XFit from '../src/stories/explorations/parts/XFit.vue';
import XKey from '../src/stories/explorations/parts/XKey.vue';
import XContextMenu from '../src/stories/explorations/parts/XContextMenu.vue';
import XAppShell from '../src/stories/explorations/parts/XAppShell.vue';
import XOpenApps from '../src/stories/explorations/parts/XOpenApps.vue';
import XAppsView from '../src/stories/explorations/parts/XAppsView.vue';
import XMail from '../src/stories/explorations/apps/XMail.vue';
import XWindow from '../src/stories/explorations/desktop/XWindow.vue';
import XTopBar from '../src/stories/explorations/desktop/XTopBar.vue';
import DesktopHome from '../src/stories/explorations/desktop/DesktopHome.vue';
import DesktopWorkspace from '../src/stories/explorations/desktop/DesktopWorkspace.vue';
import TabletHome from '../src/stories/explorations/tablet/TabletHome.vue';
import { shellProps } from '../src/stories/explorations/parts/types';
import { photo } from '../src/stories/explorations/parts/data';

describe('squircle highlights in the library (no rounded squares on icon-shaped elements)', () => {
  it('ToolIcon uses the squircle highlight and exposes active', () => {
    const w = mount(Hd.HdToolIcon, { props: { icon: 'back', label: 'Back', active: true } });
    expect(w.classes()).toContain('hd-sq');
    expect(w.classes()).toContain('is-active');
    expect(w.attributes('aria-pressed')).toBe('true');
  });
  // 2026-10-25 (N9 review): the selected toolbar tab is a lighter full-height square-edged cell, not a squircle.
  it('icon TabButton is a full-height cell (no squircle), text TabButton is not a squircle either', () => {
    expect(mount(Hd.HdTabButton, { props: { label: 'A', icon: 'phone', selected: true } }).classes()).not.toContain('hd-sq');
    expect(mount(Hd.HdTabButton, { props: { label: 'A' } }).classes()).not.toContain('hd-sq');
  });
  it('icon-only Button is a squircle, labelled Button is not', () => {
    expect(mount(Hd.HdButton, { props: { icon: 'delete' } }).classes()).toContain('hd-sq');
    expect(mount(Hd.HdButton, { props: { icon: 'delete' }, slots: { default: 'Delete' } }).classes()).not.toContain('hd-sq');
  });
  it('TaskCard close and TextField clear are squircles', () => {
    expect(mount(Hd.HdTaskCard, { props: { title: 'Mail', editing: true } }).find('.hd-task-card__close').classes()).toContain('hd-sq');
    expect(mount(Hd.HdTextField, { props: { label: 'x', clearable: true, modelValue: 'abc' } }).find('.hd-field__clear').classes()).toContain('hd-sq');
  });
  it('Pagination buttons are squircles', () => {
    const w = mount(Hd.HdPagination, { props: { page: 2, total: 5 } });
    expect(w.findAll('.hd-pagination__btn').every((b) => b.classes().includes('hd-sq'))).toBe(true);
  });
  it('window/split icons exist', () => { for (const n of ['split', 'maximize', 'minimize', 'window', 'grid']) expect(icons[n]).toBeTruthy(); });
});

describe('exploration parts', () => {
  it('XFit renders the slot at design size with the initial scale', () => {
    const w = mount(XFit, { props: { w: 1280, h: 800, initial: 0.5 }, slots: { default: '<p>hi</p>' } });
    const inner = w.get('.x-fit__inner');
    expect(inner.attributes('style')).toContain('width: 1280px');
    expect(inner.attributes('style')).toContain('scale(0.5)');
    expect(w.attributes('style')).toContain('height: 400px');
  });
  it('XKey maps arrow names to symbols', () => {
    const w = mount(XKey, { props: { keys: 'Super+Left' } });
    expect(w.findAll('kbd').map((k) => k.text())).toEqual(['Super', '←']);
  });
  it('XContextMenu selects with click and closes on Escape', async () => {
    const w = mount(XContextMenu, { props: { open: true, items: [{ id: 'a', label: 'A', keys: 'Ctrl+A' }, { id: 'b', label: 'B', divider: true }] }, attachTo: document.body });
    expect(w.findAll('[role=menuitem]')).toHaveLength(2);
    expect(w.find('[role=separator]').exists()).toBe(true);
    await w.findAll('[role=menuitem]')[1]!.trigger('click');
    expect(w.emitted('select')?.[0]).toEqual(['b']);
    await w.get('[role=menu]').trigger('keydown', { key: 'Escape' });
    expect(w.emitted('update:open')?.at(-1)).toEqual([false]);
    w.unmount();
  });
  it('XAppShell renders each chrome variant', () => {
    expect(mount(XAppShell, { props: { title: 'T', chrome: 'toolbar' } }).find('.hd-toolbar').exists()).toBe(true);
    expect(mount(XAppShell, { props: { title: 'T', chrome: 'side' } }).find('.x-sidebar').exists()).toBe(true);
    const hb = mount(XAppShell, { props: { title: 'T', chrome: 'headerbar', density: 'pointer' } });
    expect(hb.find('.x-headerbar').exists()).toBe(true);
    expect(hb.classes()).toContain('x-density-pointer');
    expect(hb.find('.x-key').exists()).toBe(true);
    expect(mount(XAppShell, { props: { title: 'T', chrome: 'none' } }).find('.hd-toolbar, .x-headerbar, .x-sidebar').exists()).toBe(false);
  });
  it('XAppShell back emits; menu button opens the context menu', async () => {
    const w = mount(XAppShell, { props: { title: 'T', chrome: 'headerbar' }, attachTo: document.body });
    await w.get('[aria-label="Back"]').trigger('click');
    expect(w.emitted('back')).toHaveLength(1);
    await w.get('[aria-label="Menu"]').trigger('click');
    expect(w.find('.x-cmenu').exists()).toBe(true);
    w.unmount();
  });
  it('shellProps drops app-specific props', () => {
    expect(shellProps({ chrome: 'none', density: 'pointer', ...({ selected: 3 } as object) })).toEqual({ chrome: 'none', density: 'pointer' });
  });
  it('XOpenApps shows the close button on hover only when hoverClose', async () => {
    const w = mount(XOpenApps, { props: { apps: ['Notes', 'Mail'], hoverClose: true } });
    expect(w.find('.hd-task-card__close').exists()).toBe(false);
    await w.findAll('.x-open__item')[0]!.trigger('mouseenter');
    expect(w.findAll('.hd-task-card__close')).toHaveLength(1);
    const plain = mount(XOpenApps, { props: { apps: ['Notes'] } });
    await plain.get('.x-open__item').trigger('mouseenter');
    expect(plain.find('.hd-task-card__close').exists()).toBe(false);
  });
  it('XAppsView filters by query', () => {
    const w = mount(XAppsView, { props: { query: 'mu' } });
    expect(w.findAll('.hd-app-icon').map((a) => a.text())).toEqual(['Music']);
    expect(mount(XAppsView, { props: { query: 'zzz' } }).text()).toContain('No apps match');
  });
  it('XMail opens the detail pane and Back returns to the list', async () => {
    const w = mount(XMail, { props: { chrome: 'toolbar' } });
    expect(w.find('.x-mail--list').exists()).toBe(true);
    await w.findAll('.hd-list-item')[2]!.trigger('click');
    expect(w.find('.x-mail--detail').exists()).toBe(true);
    expect(w.get('.x-mail__subject').text()).toBe('Photos from the trip');
    await w.get('[aria-label="Back"]').trigger('click');
    expect(w.find('.x-mail--list').exists()).toBe(true);
  });
  it('XWindow places itself and emits close', async () => {
    const w = mount(XWindow, { props: { title: 'Inbox', app: 'Mail', x: 10, y: 20, w: 300, h: 200 } });
    expect(w.attributes('style')).toContain('left: 10px');
    await w.get('[aria-label="Close"]').trigger('click');
    expect(w.emitted('close')).toHaveLength(1);
    expect(w.find('.hd-squircle').exists()).toBe(true);
  });
  it('XTopBar emits overview and events', async () => {
    const w = mount(XTopBar, { props: { count: 3 } });
    await w.get('[aria-label="Overview"]').trigger('click');
    await w.get('[aria-label="3 notifications"]').trigger('click');
    expect(w.emitted('overview')).toHaveLength(1);
    expect(w.emitted('events')).toHaveLength(1);
  });
  it('photo() returns an SVG data URI', () => expect(photo(3)).toMatch(/^data:image\/svg\+xml,/));
});

describe('exploration scenes', () => {
  it('TabletHome switches views via the page indicator and honours eventsBeside in landscape only', async () => {
    const w = mount(TabletHome, { props: { view: 0 } });
    expect(w.find('.x-events--2').exists()).toBe(true);
    await w.findAll('.hd-page-indicator__dot')[2]!.trigger('click');
    expect(w.find('.x-open').exists()).toBe(true);
    expect(mount(TabletHome, { props: { eventsBeside: true } }).find('.x-thome__beside').exists()).toBe(true);
    expect(mount(TabletHome, { props: { eventsBeside: true, orientation: 'portrait' } }).find('.x-thome__beside').exists()).toBe(false);
  });
  it('DesktopWorkspace: Super toggles the overview, typing filters, Escape closes', async () => {
    const w = mount(DesktopWorkspace, { attachTo: document.body });
    expect(w.find('.x-ov').exists()).toBe(false);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' })); await nextTick();
    expect(w.find('.x-ov').exists()).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm' })); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'u' })); await nextTick();
    expect(w.findAll('.x-ov__apps .hd-app-icon').map((a) => a.text())).toEqual(['Music']);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await nextTick();
    expect(w.find('.x-ov').exists()).toBe(false);
    w.unmount();
  });
  it('DesktopHome: Super minimises the app to reveal home; peek dock only in peek state', async () => {
    const w = mount(DesktopHome, { attachTo: document.body });
    expect(w.get('.x-dapp').classes()).not.toContain('is-away');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' })); await nextTick();
    expect(w.get('.x-dapp').classes()).toContain('is-away');
    w.unmount();
    expect(mount(DesktopHome, { props: { state: 'peek' } }).find('.x-peek').exists()).toBe(true);
    expect(mount(DesktopHome, { props: { state: 'hover' } }).find('.hd-task-card__close').exists()).toBe(true);
  });
});
