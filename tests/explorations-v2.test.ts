import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { workArea, zoneRects, LAYOUTS, SCREEN, BAR_H, zoomStep, fitInto, OPEN_WINDOWS } from '../src/shell/desktop/geometry';
import { chromeOf } from '../src/shell/desktop/chrome';
import { STATES, CORE } from '../src/shell/desktop/states';
import XWin from '../src/shell/desktop/XWin.vue';
import XMenuBar from '../src/shell/desktop/XMenuBar.vue';
import XDock from '../src/shell/desktop/XDock.vue';
import XDockSettings from '../src/shell/desktop/XDockSettings.vue';
import XLayoutPicker from '../src/shell/desktop/XLayoutPicker.vue';
import XZones from '../src/shell/desktop/XZones.vue';
import XFit from '../src/shell/parts/XFit.vue';
import XWindows from '../src/shell/desktop/XWindows.vue';
import XEventsPanel from '../src/shell/desktop/XEventsPanel.vue';
import XStatusPanel from '../src/shell/desktop/XStatusPanel.vue';
import DesktopV2 from '../src/shell/desktop/DesktopV2.vue';

const key = async (k: string, meta = false, shift = false) => { window.dispatchEvent(new KeyboardEvent('keydown', { key: k, metaKey: meta, shiftKey: shift })); await nextTick(); };
const keyUp = async (k: string) => { window.dispatchEvent(new KeyboardEvent('keyup', { key: k })); await nextTick(); };
const tapSuper = async () => { await key('Meta', true); await keyUp('Meta'); };

describe('desktop geometry', () => {
  it('work area leaves room for the dock unless it auto-hides', () => {
    expect(workArea('left', 44)).toEqual({ x: 64, y: 0, w: SCREEN.w - 64, h: SCREEN.h - BAR_H });
    expect(workArea('bottom', 44).h).toBe(SCREEN.h - BAR_H - 64);
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
  it('Super + wheel steps through the phone zoom levels 1..4; fitInto keeps the aspect ratio', () => {
    expect(zoomStep(3, 100)).toBe(4);
    expect(zoomStep(4, 100)).toBe(4);
    expect(zoomStep(2, -100)).toBe(1);
    expect(zoomStep(1, -100)).toBe(1);
    expect(zoomStep(2, 0)).toBe(2);
    const f = fitInto(1200, 600, 100, 100);
    expect([f.w, f.h]).toEqual([100, 50]);
    const t = fitInto(400, 800, 100, 100);
    expect([t.w, t.h]).toEqual([50, 100]);
  });
  it('every state has a tab and a trade-off, with at least 3 new ideas', () => {
    for (const s of CORE) { expect(STATES[s].gain).toBeTruthy(); expect(STATES[s].cost).toBeTruthy(); }
    expect(CORE).toContain('gestures');
    expect(CORE).toContain('switch');
  });
});

describe('desktop parts', () => {
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
  it('XWin emits close', async () => {
    const w = mount(XWin, { props: { app: 'Notes' } });
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
  it('XDock default: floating strip on the left; Overview button | separator | apps | separator | trash (last)', async () => {
    const w = mount(XDock);
    const d = w.get('.x-dock');
    expect(d.classes()).toEqual(expect.arrayContaining(['x-dock--left', 'is-vertical']));
    expect(d.classes()).not.toContain('is-panel');
    expect(w.find('.x-dock__clock').exists()).toBe(false);
    const kids = Array.from(d.element.children).map((c) => (c.classList.contains('x-dock__div') ? '|' : c.querySelector('[aria-label]')?.getAttribute('aria-label')));
    expect(kids).toEqual(['Overview', '|', 'Browser', 'Mail', 'Messages', 'Calendar', 'Music', 'Notes', '|', 'Trash']);
    expect(w.findAll('.x-dock__item').every((b) => b.classes().includes('hd-sq'))).toBe(true);
    expect(w.findAll('.x-dock__run').length).toBe(3);
    await w.get('[aria-label="Mail"]').trigger('click');
    expect(w.emitted('open')?.[0]).toEqual(['Mail']);
  });
  it('XDock options: full-height panel keeps the trash last; positions; auto-hide; edit mode', async () => {
    const p = mount(XDock, { props: { panel: true, clock: true } });
    expect(p.get('.x-dock').classes()).toContain('is-panel');
    expect(p.get('.x-dock').attributes('style')).toContain('bottom: 8px');
    expect(p.find('.x-dock__clock').exists()).toBe(true);
    expect(p.get('.x-dock').element.lastElementChild?.classList.contains('x-dock__trash')).toBe(true);
    await p.get('[aria-label="Overview"]').trigger('click');
    expect(p.emitted('launcher')).toHaveLength(1);
    expect(mount(XDock, { props: { position: 'bottom' } }).get('.x-dock').classes()).not.toContain('is-vertical');
    const hid = mount(XDock, { props: { autoHide: true } });
    expect(hid.get('.x-dock').classes()).toContain('is-hidden');
    expect(hid.find('.x-dock-edge').exists()).toBe(true);
    expect(mount(XDock, { props: { autoHide: true, revealed: true } }).get('.x-dock').classes()).not.toContain('is-hidden');
    const ed = mount(XDock, { props: { editing: true } });
    expect(ed.find('.x-dock__move').exists()).toBe(true);
    expect(ed.findAll('.x-dock__rm').length).toBe(8);
  });
  it('XDock previews are optional: items stay squircle icons, hover shows the window in its aspect ratio', () => {
    expect(mount(XDock, { props: { peekThumb: 'Mail' } }).find('.x-dock__peek').exists()).toBe(false);
    const th = mount(XDock, { props: { previews: true, peekThumb: 'Mail' } });
    expect(th.find('.x-dock__thumb').exists()).toBe(false);
    expect(th.get('[aria-label="Mail"]').find('.hd-squircle, .hd-sq').exists()).toBe(true);
    const pw = th.get('.x-dock__peekwin');
    expect(pw.classes()).not.toContain('hd-squircle');
    const m = /width: (\d+)px; height: (\d+)px/.exec(pw.attributes('style')!)!;
    const mail = OPEN_WINDOWS.find((o) => o.app === 'Mail')!;
    expect(Number(m[1]) / Number(m[2])).toBeCloseTo(mail.w / mail.h, 1);
  });
  it('XDockSettings switches position', async () => {
    const w = mount(XDockSettings);
    expect(w.get('[aria-label=Position] [aria-checked=true]').text()).toBe('Left');
    expect(w.get('[aria-label=Style] [aria-checked=true]').text()).toBe('Floating strip');
    await w.findAll('.x-dset__posbtn')[1]!.trigger('click');
    expect(w.emitted('update:position')?.[0]).toEqual(['bottom']);
    expect(w.findAll('[role=switch][aria-checked=true]').map((x) => x.attributes('aria-label'))).toEqual(['Launcher button (first)', 'Recycle bin (last)']);
    expect(w.find('[aria-label="Window previews on hover"]').attributes('aria-checked')).toBe('false');
    await w.findAll('[aria-label=Style] [role=radio]')[1]!.trigger('click');
    expect(w.emitted('update:panel')?.[0]).toEqual([true]);
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
  it('XWindows lays out 1 / 2 / 3 / 4 per row and Super or Ctrl + wheel zooms', async () => {
    const tops = (w: ReturnType<typeof mount>) => new Set(w.findAll('.x-wins__card').map((c) => /top: (\d+)/.exec(c.attributes('style')!)![1])).size;
    expect(tops(mount(XWindows, { props: { level: 4 } }))).toBe(2);
    expect(tops(mount(XWindows, { props: { level: 3 } }))).toBe(2);
    expect(tops(mount(XWindows, { props: { level: 2 } }))).toBe(3);
    const c = mount(XWindows, { props: { level: 1, selected: 1 } });
    expect(c.findAll('.x-wins__card.is-side')).toHaveLength(4);
    expect(c.get('.x-wins__card.is-sel').attributes('aria-label')).toContain('Browser');
    const w = mount(XWindows, { props: { level: 3 } });
    expect(w.findAll('.x-wins__card')).toHaveLength(OPEN_WINDOWS.length);
    expect(w.find('.hd-squircle.x-wins__prev, .x-wins__prev.hd-sq').exists()).toBe(false);
    const wheel = async (init: WheelEventInit) => { w.element.dispatchEvent(new WheelEvent('wheel', { cancelable: true, ...init })); await nextTick(); };
    await wheel({ deltaY: 100, metaKey: true });
    expect(w.emitted('update:level')?.[0]).toEqual([4]);
    await wheel({ deltaY: -100, ctrlKey: true });
    expect(w.emitted('update:level')?.[1]).toEqual([2]);
    await wheel({ deltaY: 100 });
    expect(w.emitted('update:level')).toHaveLength(2);
    await w.findAll('.x-wins__z')[0]!.trigger('click');
    expect(w.emitted('update:level')?.[2]).toEqual([1]);
  });
  it('XEventsPanel follows the phone order with no toggles; the date expands into a month', async () => {
    const w = mount(XEventsPanel);
    expect(w.get('.x-ev__day').text()).toBe('Saturday');
    expect(w.get('.x-ev__time').text()).toBe('12:45');
    expect(w.get('.x-ev__wx').text()).toContain('Helsinki');
    expect(w.findAll('.hd-section-header').map((h) => h.text())).toEqual(['Notifications', 'Calendar', 'Feeds']);
    expect(w.find('.hd-slider').exists()).toBe(false);
    expect(w.find('[aria-pressed]').exists()).toBe(false);
    expect(w.find('.x-ev__month').exists()).toBe(false);
    await w.get('.x-ev__date').trigger('click');
    expect(w.emitted('update:month')?.[0]).toEqual([true]);
    expect(w.findAll('.x-ev__cell:not(.is-empty)')).toHaveLength(31);
    expect(w.get('.x-ev__cell.is-sel').text()).toBe('24');
    expect(w.findAll('.x-ev__lines li')).toHaveLength(3);
    await w.get('[aria-label="26 October"]').trigger('click');
    expect(w.get('.x-ev__selh').text()).toBe('Monday 26 October');
    expect(w.findAll('.x-ev__lines li').map((l) => l.text())).toEqual(['09:00Sprint planning', '16:00Swipe UI workshop']);
  });
  it('XStatusPanel holds the connectivity toggles and volume', () => {
    const w = mount(XStatusPanel);
    expect(w.findAll('.x-stat__tg').map((b) => b.get('b').text())).toEqual(['Wi-Fi', 'Bluetooth', 'Silent', 'Focus']);
    expect(w.findAll('.hd-slider').length).toBe(2);
  });
});

describe('DesktopV2 scene', () => {
  it('Super+Tab quick switch: carousel, Tab / Shift+Tab cycle, releasing Super switches', async () => {
    const w = mount(DesktopV2, { attachTo: document.body });
    expect(w.findAll('.x-win')).toHaveLength(3);
    await key('Meta', true);
    await key('Tab', true);
    expect(w.find('.x-wins--1').exists()).toBe(true);
    expect(w.find('.x-launch').exists()).toBe(false);
    expect(w.get('.x-switchhint').text()).toContain('Release Super to switch');
    expect(w.get('.x-wins__card.is-sel').attributes('aria-label')).toContain('Browser');
    await key('Tab', true);
    expect(w.get('.x-wins__card.is-sel').attributes('aria-label')).toContain('Messages');
    await key('Tab', true, true);
    expect(w.get('.x-wins__card.is-sel').attributes('aria-label')).toContain('Browser');
    await keyUp('Meta');
    expect(w.find('.x-wins').exists()).toBe(false);
    expect(w.get('.x-mbar__app').text()).toBe('Browser');
    w.unmount();
  });
  it('Super + wheel zooms out and locks the viewer open after Super is released; Esc closes', async () => {
    const w = mount(DesktopV2, { attachTo: document.body });
    await key('Meta', true); await key('Tab', true);
    const wheel = async (deltaY: number) => { w.get('.x-wins').element.dispatchEvent(new WheelEvent('wheel', { deltaY, metaKey: true, cancelable: true })); await nextTick(); };
    await wheel(100);
    expect(w.find('.x-wins--2').exists()).toBe(true);
    await keyUp('Meta');
    expect(w.find('.x-wins').exists()).toBe(true);
    expect(w.find('.x-switchhint--locked').exists()).toBe(true);
    await key('Escape');
    expect(w.find('.x-wins').exists()).toBe(false);
    // zooming in at the carousel also locks it, with no visual change
    await key('Meta', true); await key('Tab', true);
    await wheel(-100);
    expect(w.find('.x-wins--1').exists()).toBe(true);
    await keyUp('Meta');
    expect(w.find('.x-wins--1').exists()).toBe(true);
    w.unmount();
  });
  // Super opens the Overview (the main menu), never the spotlight.
  it('tapping Super alone opens the Overview (Events, Windows, Apps); typing filters; Super again closes', async () => {
    const w = mount(DesktopV2, { attachTo: document.body });
    await tapSuper();
    expect(w.find('.x-ov').exists()).toBe(true);
    expect(w.find('.x-launch').exists()).toBe(false);
    expect(w.find('.x-ov__events').exists()).toBe(true);
    expect(w.find('.x-ov__wins').exists()).toBe(true);
    await key('m'); await key('u');
    expect(w.findAll('.x-ov__apps .hd-app-icon').map((a) => a.text())).toEqual(['Music']);
    await tapSuper();
    expect(w.find('.x-ov').exists()).toBe(false);
    w.unmount();
  });
  it('the dock\'s first button opens the Overview too', async () => {
    const w = mount(DesktopV2, { attachTo: document.body });
    await w.get('.x-dock__launcher').trigger('click');
    expect(w.find('.x-ov').exists()).toBe(true);
    w.unmount();
  });
  it('Super+Space opens the spotlight (an addition, not the Overview); typing filters; Esc closes', async () => {
    const w = mount(DesktopV2, { attachTo: document.body });
    await key(' ', true); await keyUp('Meta');
    expect(w.find('.x-launch').exists()).toBe(true);
    expect(w.find('.x-ov').exists()).toBe(false);
    await key('m'); await key('u');
    expect(w.findAll('.x-launch .hd-app-icon').map((a) => a.text())).toEqual(['Music']);
    await key('Escape');
    expect(w.find('.x-launch').exists()).toBe(false);
    w.unmount();
  });
  it('decorations: a KDE app\'s toolbar moves into the header (after has actions and no toolbar row)', () => {
    const w = mount(DesktopV2, { props: { state: 'decor' } });
    const [before, after] = w.findAll('.x-kde');
    expect(before!.find('.x-kde__tools').exists()).toBe(true);
    expect(after!.find('.x-kde__tools').exists()).toBe(false);
    expect(after!.findAll('.x-kde__bar .hd-tool-icon').map((b) => b.attributes('aria-label'))).toEqual(expect.arrayContaining(['New (Ctrl+N)', 'Open (Ctrl+O)', 'Save (Ctrl+S)']));
    w.unmount();
  });
  it('the status icons open the status menu, separate from Events', async () => {
    const w = mount(DesktopV2, { attachTo: document.body });
    await w.get('.x-mbar__sicons').trigger('click');
    expect(w.find('.x-stat').exists()).toBe(true);
    expect(w.find('.x-ev').exists()).toBe(false);
    w.unmount();
  });
  it('Super+N toggles the Events panel; Super+Z the layout picker; Super+Left snaps', async () => {
    const w = mount(DesktopV2, { attachTo: document.body });
    await key('n', true);
    expect(w.find('.x-ev').exists()).toBe(true);
    await key('n', true);
    expect(w.find('.x-ev').exists()).toBe(false);
    await key('z', true);
    expect(w.find('.x-lpick').exists()).toBe(true);
    await key('Escape');
    await key('ArrowLeft', true);
    expect(w.findAll('.x-win.is-tiled')).toHaveLength(1);
    w.unmount();
  });
  it('renders every state', () => {
    for (const s of CORE) {
      const w = mount(DesktopV2, { props: { state: s } });
      expect(w.find('.x-mbar').exists()).toBe(true);
      w.unmount();
    }
    expect(mount(DesktopV2, { props: { state: 'snapped' } }).findAll('.x-win.is-tiled')).toHaveLength(3);
    expect(mount(DesktopV2, { props: { state: 'drag' } }).find('.x-zones .is-hot').exists()).toBe(true);
    expect(mount(DesktopV2, { props: { state: 'dock-bottom' } }).find('.x-dock--bottom').exists()).toBe(true);
    expect(mount(DesktopV2, { props: { state: 'idea-viewmenu' } }).find('.x-viewmenu').exists()).toBe(true);
    expect(mount(DesktopV2, { props: { state: 'dock-panel' } }).find('.x-dock.is-panel .x-dock__clock').exists()).toBe(true);
    expect(mount(DesktopV2).find('.x-dock.is-panel').exists()).toBe(false);
    expect(mount(DesktopV2, { props: { state: 'events-month' } }).find('.x-ev__month').exists()).toBe(true);
    expect(mount(DesktopV2, { props: { state: 'windows-carousel' } }).find('.x-wins--1').exists()).toBe(true);
    expect(mount(DesktopV2, { props: { state: 'windows-4' } }).find('.x-wins--4').exists()).toBe(true);
    expect((STATES as Record<string, unknown>)['idea-close']).toBeUndefined();
    const g = mount(DesktopV2, { props: { state: 'gestures' } });
    expect(g.findAll('.x-gest__g')).toHaveLength(3);
    expect(g.get('[aria-label="Three-finger swipe down closes windows"]').attributes('aria-checked')).toBe('false');
    expect(mount(DesktopV2, { props: { state: 'dock-previews' } }).find('.x-dock__peekwin').exists()).toBe(true);
    expect(mount(DesktopV2, { props: { state: 'switch' } }).find('.x-switchhint').exists()).toBe(true);
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

describe('phone: decisions on what to leave out', async () => {
  const { STATES, SMALL, LEAVE_OUT } = await import('../src/stories/explorations/phone2/states');
  it('records the agreed directions', () => {
    expect(SMALL).not.toContain('history'); expect(SMALL).not.toContain('history-entry'); expect(SMALL).toContain('history-ghost');
    expect(STATES['priority'].idea).toMatch(/per contact/);
    expect(STATES['split-drag'].idea).toMatch(/two fingers/);
    expect(STATES['screen-time'].idea).toMatch(/one-line/);
    expect(STATES['medical'].idea).toMatch(/No Emergency call button on the lock screen/); expect(STATES['medical-card'].idea).toMatch(/only Emergency call button/);
    expect(LEAVE_OUT.map((l) => l[0])).toEqual(expect.arrayContaining(['App shortcuts sheet in edit mode', 'Per-stream volume rows', 'Share in Open apps', 'Notification history']));
  });
});

describe('XDock auto-hide', () => {
  // regression: `.x-dock--left.is-hidden` lost to the centring rule `.x-dock.is-vertical:not(.is-panel)`, so a hidden dock stayed on screen
  const css = readFileSync('src/shell/desktop/XDock.vue', 'utf8');
  /** class-level specificity: classes, attribute selectors and the classes inside :not() */
  const spec = (sel: string) => (sel.match(/\.[\w-]+/g) ?? []).length;
  const centring = ['.x-dock.is-vertical:not(.is-panel)', '.x-dock:not(.is-vertical):not(.is-panel)'].map((s) => { expect(css).toContain(s + ' {'); return spec(s); });
  for (const p of ['left', 'right', 'bottom', 'top']) {
    it(`the ${p} hidden rule outranks the centring rules`, () => {
      const m = css.match(new RegExp(`^([^{}\\n]*\\.x-dock--${p}\\.is-hidden) \\{`, 'm'));
      expect(m, `no hidden rule for ${p}`).toBeTruthy();
      expect(spec(m![1]!)).toBeGreaterThanOrEqual(Math.max(...centring));
      expect(css.indexOf(m![0])).toBeGreaterThan(css.indexOf('.x-dock:not(.is-vertical):not(.is-panel) {'));
    });
  }
  it('the settings report size and visibility', async () => {
    const w = mount(XDockSettings);
    await w.findAll('.x-dset__segbtn').find((b) => b.text() === 'Auto-hide')!.trigger('click');
    await nextTick();
    expect(w.emitted('update:visibility')?.[0]).toEqual(['autohide']);
  });
});

describe('XFit before measuring', () => {
  // regression: unmeasured (pre-rendered pages, before the scripts run) it drew the content at the `initial` 25%: a tiny box
  it('hides the content until the host has a size', () => {
    const w = mount(XFit, { props: { w: 360, h: 720, fit: 'contain' }, slots: { default: '<p>phone</p>' } });
    expect((w.find('.x-fit__inner').element as HTMLElement).style.visibility).toBe('hidden');
  });
});

describe('XEventsPanel separators', () => {
  // regression (reported twice): a full-width rule under the time / the month, then the Notifications header's own line
  const css = readFileSync('src/shell/desktop/XEventsPanel.vue', 'utf8');
  for (const sel of ['.x-ev__now', '.x-ev__month']) {
    it(`${sel} draws no rule above the section header`, () => {
      const rule = css.match(new RegExp(`^\\${sel} \\{[^}]*\\}`, 'm'))?.[0] ?? '';
      expect(rule).not.toBe('');
      expect(rule).not.toMatch(/border/);
    });
  }
});

describe('XDockSettings widgets', () => {
  it('reports a Widgets switch change', async () => {
    const w = mount(XDockSettings, { props: { previews: true } });
    await w.findAll('.x-dset__list li')[1]!.find('[role=switch], input, button').trigger('click');
    await nextTick();
    expect(w.emitted('widget')?.[0]).toEqual(['previews', false]);
  });
});
