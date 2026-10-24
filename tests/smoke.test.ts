import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import * as Hd from '../src/index';
import { squirclePath } from '../src/squircle';
import tokensJson from '../tokens/tokens.json';

const required: Record<string, Record<string, unknown>> = {
  HdIcon: { name: 'back' }, HdLockScreenStack: { items: [] }, HdEventsHeader: { day: 'Saturday', date: '24 October' }, HdToolIcon: { icon: 'add', label: 'Add' }, HdPageHeader: { title: 'T' },
  HdTabBar: { tabs: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], modelValue: 'a' }, HdTabButton: { label: 'A' },
  HdListItem: { title: 'T' }, HdSectionHeader: { title: 'S' }, HdAvatar: { name: 'Ada Lovelace' }, HdAppIcon: { label: 'App' },
  HdRadioButton: { value: 'a', name: 'n' }, HdSlider: { label: 'Vol' }, HdSheet: { open: true }, HdQueryDialog: { open: true, title: 'Q' },
  HdSelectionDialog: { open: true, title: 'S', options: ['a', 'b'] }, HdMenu: { open: true, items: [{ id: 'a', label: 'A' }] },
  HdInfoBanner: { open: true, text: 'Hi' }, HdNotificationBanner: { open: true, title: 'Hi' }, HdCountBubble: { value: 3 },
  HdPageIndicator: { total: 3, current: 0 }, HdLockScreenNotificationCard: { message: 'm', source: 's', time: 't' },
  HdTaskCard: { title: 'T' }, HdEventsFeedItem: { title: 'T', time: 'now' }, HdSiteHeader: { brand: 'B', links: [{ label: 'A', href: '#a' }] },
  HdHero: { title: 'H' }, HdPageStack: { titles: ['A'] }, HdTable: { columns: [{ key: 'a', label: 'A' }], rows: [{ id: 1, a: 'x' }] },
  HdPagination: { page: 1, total: 5 }, HdTooltip: { text: 't' }, HdToast: { open: true, text: 't' }, HdDialog: { open: true },
};

describe('every component mounts', () => {
  const comps = Object.entries(Hd).filter(([k]) => /^Hd[A-Z]/.test(k));
  it('exports at least 45 components', () => expect(comps.length).toBeGreaterThanOrEqual(45));
  for (const [name, comp] of comps) {
    it(name, () => {
      const w = mount(comp as any, { props: required[name] ?? {}, slots: { default: 'x' }, attachTo: document.body });
      expect(w.html().length).toBeGreaterThan(0);
      w.unmount();
    });
  }
});

describe('behaviour', () => {
  it('Button emits click and respects disabled', async () => {
    const w = mount(Hd.HdButton, { slots: { default: 'Go' } });
    await w.trigger('click');
    expect(w.emitted('click')).toHaveLength(1);
    const d = mount(Hd.HdButton, { props: { disabled: true }, slots: { default: 'Go' } });
    expect(d.attributes('disabled')).toBeDefined();
  });
  it('Switch toggles with role=switch', async () => {
    const w = mount(Hd.HdSwitch, { props: { modelValue: false, label: 'Wi-Fi' } });
    const b = w.get('[role=switch]');
    expect(b.attributes('aria-checked')).toBe('false');
    await b.trigger('click');
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
  });
  it('TabBar arrow keys move selection', async () => {
    const w = mount(Hd.HdTabBar, { props: { tabs: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], modelValue: 'a' } });
    await w.get('[role=tablist]').trigger('keydown', { key: 'ArrowRight' });
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['b']);
  });
  it('TextField links error via aria-describedby', () => {
    const w = mount(Hd.HdTextField, { props: { label: 'Email', error: 'Required' } });
    const input = w.get('input');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(w.get(`#${input.attributes('aria-describedby')}`).text()).toContain('Required');
  });
  it('Avatar is a squircle with initials', () => {
    const w = mount(Hd.HdAvatar, { props: { name: 'Ada Lovelace' } });
    expect(w.find('.hd-squircle').exists()).toBe(true);
    expect(w.text()).toBe('AL');
  });
  it('squircle path is a closed superellipse', () => {
    const p = squirclePath(100, 4, 8);
    expect(p.startsWith('M100.00 50.00')).toBe(true);
    expect(p.endsWith('Z')).toBe(true);
  });
  it('tokens match the N9 palette', () => {
    expect(Hd.tokens.color.palette.background).toBe('#E0E1E2');
    expect((tokensJson as any).color.accent.default.origin).toBe('n9');
  });
});

describe('phone parts matched to the ROM', () => {
  it('lock stack: 3 full cards, the rest as strips; "more" variant shows the label; grouped card reads "Sender · N more"', () => {
    const items = Array.from({ length: 6 }, (_, i) => ({ message: `M${i}`, source: `S${i}`, time: '12:00' }));
    const w = mount(Hd.HdLockScreenStack, { props: { items } });
    expect(w.findAll('.hd-lock-card')).toHaveLength(3);
    expect(w.findAll('.hd-lock-stack__strip')).toHaveLength(3);
    expect(w.find('.hd-lock-stack__more').exists()).toBe(false);
    const m = mount(Hd.HdLockScreenStack, { props: { items, variant: 'more' } });
    expect(m.get('.hd-lock-stack__more').text()).toContain('More');
    const c = mount(Hd.HdLockScreenNotificationCard, { props: { message: 'Hi', source: 'Test 6', time: '14:43', more: 5 } });
    expect(c.get('.hd-lock-card__from').text()).toBe('Test 6 · 5 more');
    expect(c.get('.hd-lock-card__time').text()).toBe('14:43');
  });
  it('toolbar: light by default, Back is a lit squircle button, dark variant', () => {
    const t = mount(Hd.HdToolBar, { props: { back: true } });
    expect(t.classes()).toContain('hd-toolbar--light');
    expect(t.get('.hd-toolbar__back').classes()).toContain('hd-sq');
    expect(mount(Hd.HdToolBar, { props: { variant: 'dark' } }).classes()).toContain('hd-toolbar--dark');
  });
  it('edit bar renders one shared action row', () => {
    const b = mount(Hd.HdTaskEditBar, { props: { actions: ['Split view', 'Pop-up', 'Screenshot', 'App info'] } });
    expect(b.findAll('.hd-task-edit-bar__actions button').map((x) => x.text())).toEqual(['Split view', 'Pop-up', 'Screenshot', 'App info']);
  });
});
