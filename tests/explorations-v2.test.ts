import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { workArea, zoneRects, LAYOUTS, SCREEN, BAR_H } from '../src/stories/explorations/desktop2/geometry';
import { chromeOf } from '../src/stories/explorations/desktop2/chrome';
import { STATES, CORE, IDEAS } from '../src/stories/explorations/desktop2/states';
import XWin from '../src/stories/explorations/desktop2/XWin.vue';
import XMenuBar from '../src/stories/explorations/desktop2/XMenuBar.vue';
import XDock from '../src/stories/explorations/desktop2/XDock.vue';
import XDockSettings from '../src/stories/explorations/desktop2/XDockSettings.vue';
import XLayoutPicker from '../src/stories/explorations/desktop2/XLayoutPicker.vue';
import XZones from '../src/stories/explorations/desktop2/XZones.vue';
import XOverview2 from '../src/stories/explorations/desktop2/XOverview2.vue';
import DesktopV2 from '../src/stories/explorations/desktop2/DesktopV2.vue';

const key = async (k: string, meta = false) => { window.dispatchEvent(new KeyboardEvent('keydown', { key: k, metaKey: meta })); await nextTick(); };

describe('desktop v2 geometry', () => {
  it('work area leaves room for the dock unless it auto-hides', () => {
    expect(workArea('left', 44)).toEqual({ x: 72, y: 0, w: SCREEN.w - 72, h: SCREEN.h - BAR_H });
    expect(workArea('bottom', 44).h).toBe(SCREEN.h - BAR_H - 72);
    expect(workArea('left', 44, true).x).toBe(0);
  });
  it('zones tile the area with even gaps and no overlap', () => {
    const a = { x: 72, y: 0, w: 1848, h: 1050 };
    for (const id of Object.keys(LAYOUTS) as (keyof typeof LAYOUTS)[]) {
      const z = zoneRects(id, a);
      expect(z).toHaveLength(LAYOUTS[id].zones.length);
      for (const r of z) { expect(r.x).toBeGreaterThanOrEqual(a.x + 8); expect(r.x + r.w).toBeLessThanOrEqual(a.x + a.w - 8); expect(r.y + r.h).toBeLessThanOrEqual(a.h - 8); }
      for (let i = 0; i < z.length; i++) for (let j = i + 1; j < z.length; j++) {
        const p = z[i]!, q = z[j]!;
        const overlap = p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h;
        expect(overlap).toBe(false);
      }
    }
    const t = zoneRects('thirds', a);
    expect(t[1]!.x - (t[0]!.x + t[0]!.w)).toBe(8);
  });
  it('every state has a tab and a trade-off, with at least 3 new ideas', () => {
    for (const s of [...CORE, ...IDEAS]) { expect(STATES[s].gain).toBeTruthy(); expect(STATES[s].cost).toBeTruthy(); }
    expect(IDEAS.length).toBeGreaterThanOrEqual(3);
  });
});

describe('desktop v2 parts', () => {
  it('XWin header: Back, title, actions, menu, then min/max/close; no app bar inside', () => {
    const w = mount(XWin, { props: { app: 'Mail', back: true, focused: true } });
    const labels = w.findAll('.x-win__bar button[aria-label]').map((b) => b.attributes('aria-label'));
    expect(labels).toEqual(['Back', 'Compose', 'Search', 'Refresh', 'Menu', 'Minimise', 'Maximise', 'Close']);
    expect(w.get('.x-win__title').text()).toBe('Inbox');
    expect(w.classes()).toContain('is-focused');
    expect(w.findAll('.hd-tool-icon').every((b) => b.classes().includes('hd-sq'))).toBe(true);
  });
  it('XWin plain app has only the app squircle, title and window controls', () => {
    const w = mount(XWin, { props: { app: 'Notes', plain: true } });
    expect(w.findAll('.x-win__bar button[aria-label]').map((b) => b.attributes('aria-label'))).toEqual(['Minimise', 'Maximise', 'Close']);
    expect(w.find('.x-win__appicon').exists()).toBe(true);
    expect(w.classes()).not.toContain('is-focused');
  });
  it('XWin title opens the view menu and picking a view retitles the window', async () => {
    const w = mount(XWin, { props: { app: 'Mail' } });
    expect(w.find('.x-viewmenu').exists()).toBe(false);
    await w.get('.x-win__title--menu').trigger('click');
    const opts = w.findAll('[role=option]');
    expect(opts.map((o) => o.text())).toEqual(chromeOf('Mail').views);
    expect(opts[0]!.find('.x-viewmenu__mark').classes()).toContain('hd-sq');
    await opts[1]!.trigger('click');
    expect(w.emitted('view')?.[0]).toEqual(['Sent']);
    expect(w.get('.x-win__title').text()).toBe('Sent');
  });
  it('XWin emits close and drag-down close shrinks it', async () => {
    const w = mount(XWin, { props: { app: 'Notes', closing: 0.5 } });
    expect(w.attributes('style')).toContain('translateY(110px)');
    await w.get('[aria-label="Close"]').trigger('click');
    expect(w.emitted('close')).toHaveLength(1);
  });
  it('XMenuBar: app name and menus on the left, clock is the last status item', async () => {
    const w = mount(XMenuBar, { props: { app: 'Mail', count: 3 } });
    expect(w.get('.x-mbar__app').text()).toBe('Mail');
    expect(w.findAll('.x-mbar__menu').map((m) => m.text())).toEqual(chromeOf('Mail').menus);
    const status = w.get('.x-mbar__status').element;
    expect(status.lastElementChild?.classList.contains('x-mbar__clock')).toBe(true);
    await w.get('[aria-label="Events: 3 new"]').trigger('click');
    expect(w.emitted('events')).toHaveLength(1);
    await w.findAll('.x-mbar__menu')[0]!.trigger('click');
    expect(w.emitted('menu')?.[0]).toEqual(['File']);
    expect(mount(XMenuBar, { props: { app: 'Mail', openMenu: 'View' } }).find('.x-cmenu').exists()).toBe(true);
  });
  it('XDock is vertical on the left by default with launcher, pinned apps, trash and clock', async () => {
    const w = mount(XDock);
    expect(w.get('.x-dock').classes()).toEqual(expect.arrayContaining(['x-dock--left', 'is-vertical']));
    expect(w.find('[aria-label="Overview"]').exists()).toBe(true);
    expect(w.find('[aria-label="Trash"]').exists()).toBe(true);
    expect(w.find('.x-dock__clock').exists()).toBe(true);
    expect(w.findAll('.x-dock__item').every((b) => b.classes().includes('hd-sq'))).toBe(true);
    expect(w.findAll('.x-dock__run').length).toBe(3);
    await w.get('[aria-label="Overview"]').trigger('click');
    expect(w.emitted('launcher')).toHaveLength(1);
  });
  it('XDock positions, auto-hide, edit mode and thumbnails', () => {
    expect(mount(XDock, { props: { position: 'bottom' } }).get('.x-dock').classes()).not.toContain('is-vertical');
    const hid = mount(XDock, { props: { autoHide: true } });
    expect(hid.get('.x-dock').classes()).toContain('is-hidden');
    expect(hid.find('.x-dock-edge').exists()).toBe(true);
    expect(mount(XDock, { props: { autoHide: true, revealed: true } }).get('.x-dock').classes()).not.toContain('is-hidden');
    const ed = mount(XDock, { props: { editing: true } });
    expect(ed.find('.x-dock__move').exists()).toBe(true);
    expect(ed.find('.x-dock__resize').exists()).toBe(true);
    expect(ed.findAll('.x-dock__rm').length).toBeGreaterThan(3);
    const th = mount(XDock, { props: { thumbs: true } });
    expect(th.findAll('.x-dock__thumb.hd-squircle')).toHaveLength(3);
  });
  it('XDockSettings switches position', async () => {
    const w = mount(XDockSettings);
    expect(w.get('[role=radio][aria-checked=true]').text()).toBe('Left');
    await w.findAll('.x-dset__posbtn')[1]!.trigger('click');
    expect(w.emitted('update:position')?.[0]).toEqual(['bottom']);
  });
  it('XLayoutPicker lists every layout and emits the picked zone', async () => {
    const w = mount(XLayoutPicker, { props: { layout: 'thirds', zone: 1 } });
    expect(w.findAll('.x-lpick__item')).toHaveLength(Object.keys(LAYOUTS).length);
    expect(w.findAll('.x-lpick__z.is-hot')).toHaveLength(1);
    await w.get('[aria-label="Three columns, zone 3"]').trigger('click');
    expect(w.emitted('pick')?.[0]).toEqual(['thirds', 2]);
  });
  it('XZones numbers zones and lights the hot one', () => {
    const w = mount(XZones, { props: { layout: 'thirds', area: { x: 0, y: 0, w: 1200, h: 800 }, hot: 0, app: 'Mail' } });
    expect(w.findAll('.x-zones__n').map((n) => n.text())).toEqual(['1', '2', '3']);
    expect(w.get('.is-hot').text()).toContain('Release to snap Mail here');
  });
  it('XOverview2 is a horizontal track of three views with page dots', async () => {
    const w = mount(XOverview2, { props: { page: 1 } });
    expect(w.findAll('.x-ov2__view').map((v) => v.attributes('aria-label'))).toEqual(['Events', 'Windows', 'Applications']);
    expect(w.get('.x-ov2__view.is-on').attributes('aria-label')).toBe('Windows');
    expect(w.findAll('.hd-page-indicator__dot')).toHaveLength(3);
    await w.findAll('.hd-page-indicator__dot')[2]!.trigger('click');
    expect(w.emitted('update:page')?.[0]).toEqual([2]);
  });
});

describe('DesktopV2 scene', () => {
  it('Super opens the overview, arrows flick, typing searches apps, Esc closes', async () => {
    const w = mount(DesktopV2, { attachTo: document.body });
    expect(w.find('.x-ov2').exists()).toBe(false);
    expect(w.findAll('.x-win')).toHaveLength(3);
    await key('Meta');
    expect(w.get('.x-ov2__view.is-on').attributes('aria-label')).toBe('Windows');
    await key('ArrowLeft');
    expect(w.get('.x-ov2__view.is-on').attributes('aria-label')).toBe('Events');
    await key('m'); await key('u');
    expect(w.get('.x-ov2__view.is-on').attributes('aria-label')).toBe('Applications');
    expect(w.findAll('.x-ov2__apps .hd-app-icon').map((a) => a.text())).toEqual(['Music']);
    await key('Escape');
    expect(w.find('.x-ov2').exists()).toBe(false);
    w.unmount();
  });
  it('Super+N toggles the Events panel; Super+Z the layout picker; Super+Left snaps', async () => {
    const w = mount(DesktopV2, { attachTo: document.body });
    await key('n', true);
    expect(w.find('.x-epanel2').exists()).toBe(true);
    await key('n', true);
    expect(w.find('.x-epanel2').exists()).toBe(false);
    await key('z', true);
    expect(w.find('.x-lpick').exists()).toBe(true);
    await key('Escape');
    await key('ArrowLeft', true);
    expect(w.findAll('.x-win.is-tiled')).toHaveLength(1);
    w.unmount();
  });
  it('renders every state', () => {
    for (const s of [...CORE, ...IDEAS]) {
      const w = mount(DesktopV2, { props: { state: s } });
      expect(w.find('.x-mbar').exists()).toBe(true);
      w.unmount();
    }
    expect(mount(DesktopV2, { props: { state: 'snapped' } }).findAll('.x-win.is-tiled')).toHaveLength(3);
    expect(mount(DesktopV2, { props: { state: 'drag' } }).find('.x-zones .is-hot').exists()).toBe(true);
    expect(mount(DesktopV2, { props: { state: 'dock-bottom' } }).find('.x-dock--bottom').exists()).toBe(true);
    expect(mount(DesktopV2, { props: { state: 'idea-viewmenu' } }).find('.x-viewmenu').exists()).toBe(true);
  });
});

describe('Open apps edit mode (measured from the N9)', () => {
  it('TaskCard close is a top-right lit red squircle with a rounded white X; preview dims', async () => {
    const { HdTaskCard, HdTaskEditBar } = await import('../src/index');
    const w = mount(HdTaskCard, { props: { title: 'Mail', editing: true } });
    const c = w.get('.hd-task-card__close');
    expect(c.classes()).toContain('hd-sq');
    const path = c.get('path');
    expect(path.attributes('stroke-linecap')).toBe('round');
    expect(path.attributes('stroke-width')).toBe('13');
    expect(path.attributes('d')).toBe('M31 31L69 69M69 31L31 69');
    expect(w.classes()).toContain('is-editing');
    const bar = mount(HdTaskEditBar);
    expect(bar.findAll('button').map((b) => b.text())).toEqual(['Done', 'Close all']);
    await bar.findAll('button')[1]!.trigger('click');
    expect(bar.emitted('closeAll')).toHaveLength(1);
  });
  it('TabletHome edit mode shows the Done / Close all bar on Open apps', async () => {
    const TabletHome = (await import('../src/stories/explorations/tablet/TabletHome.vue')).default;
    const w = mount(TabletHome, { props: { view: 2, editing: true } });
    expect(w.findAll('.hd-task-card__close').length).toBe(9);
    await w.findAll('.hd-task-edit-bar__btn')[1]!.trigger('click');
    expect(w.findAll('.hd-task-card')).toHaveLength(0);
  });
});
