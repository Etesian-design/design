import { describe, it, expect, beforeEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { createWindowManager, createDesktopKeys, HALF_LEFT, HALF_RIGHT, isSuper } from '../src/shell/desktop/windowManager';

const area = ref({ x: 0, y: 0, w: 1600, h: 900 });
const key = (key: string, mods: Partial<KeyboardEvent> = {}) => ({ key, metaKey: false, ctrlKey: false, altKey: false, shiftKey: false, preventDefault() {}, ...mods }) as KeyboardEvent;

describe('window manager', () => {
  beforeEach(() => localStorage.clear());

  it('opens, focuses and brings an open window forward instead of opening it twice', () => {
    const wm = createWindowManager({ area });
    wm.open('mail'); wm.open('chats'); wm.open('mail');
    expect(wm.wins.length).toBe(2);
    expect(wm.focused.value).toBe('mail');
    expect(wm.get('mail')!.z).toBeGreaterThan(wm.get('chats')!.z);
  });

  it('closing or minimising the focused window focuses the topmost one left', () => {
    const wm = createWindowManager({ area });
    wm.open('a'); wm.open('b'); wm.open('c');
    wm.close('c'); expect(wm.focused.value).toBe('b');
    wm.minimise('b'); expect(wm.focused.value).toBe('a');
  });

  it('the dock minimises the window in front and brings any other forward', () => {
    const wm = createWindowManager({ area });
    wm.open('a'); wm.open('b');
    wm.activate('b'); expect(wm.get('b')!.min).toBe(true);
    wm.activate('b'); expect(wm.get('b')!.min).toBe(false); expect(wm.focused.value).toBe('b');
  });

  it('a floating window dragged off an edge keeps its header bar reachable', () => {
    const wm = createWindowManager({ area });
    wm.open('a', { x: -5000, y: 5000, w: 800, h: 600 });
    const r = wm.rectOf(wm.get('a')!);
    expect(r.x + r.w).toBeGreaterThanOrEqual(120);
    expect(r.y).toBeLessThanOrEqual(900 - 44);
  });

  it('Super+arrows: halves, maximise, then Down floats again and Down once more minimises', () => {
    const wm = createWindowManager({ area });
    wm.open('a');
    wm.arrow('ArrowLeft'); expect(wm.get('a')!.snap).toEqual(HALF_LEFT);
    expect(wm.rectOf(wm.get('a')!).w).toBeLessThan(800);
    wm.arrow('ArrowRight'); expect(wm.get('a')!.snap).toEqual(HALF_RIGHT);
    wm.arrow('ArrowUp'); expect(wm.get('a')!.snap).toBe('max');
    wm.arrow('ArrowDown'); expect(wm.get('a')!.snap).toBeNull(); expect(wm.get('a')!.min).toBe(false);
    wm.arrow('ArrowDown'); expect(wm.get('a')!.min).toBe(true);
  });

  it('a window dropped on an edge snaps, and floats back to where it was before the drag', () => {
    const wm = createWindowManager({ area });
    wm.open('a', { x: 300, y: 200, w: 800, h: 600 });
    wm.moveStart('a', 400, 210);
    expect(wm.moveTo(402, 211)).toBe(false); // under 4 px: still a click
    wm.moveTo(5, 400); wm.moveEnd(HALF_LEFT);
    expect(wm.get('a')!.snap).toEqual(HALF_LEFT);
    wm.arrow('ArrowDown');
    expect([wm.get('a')!.x, wm.get('a')!.y]).toEqual([300, 200]);
  });

  it('dragging a snapped window off keeps the pointer at the same share of the bar', () => {
    const wm = createWindowManager({ area });
    wm.open('a', { w: 800, h: 600 }); wm.snap('a', 'max');
    const r = wm.rectOf(wm.get('a')!);
    const px = r.x + r.w / 2;
    wm.moveStart('a', px, r.y + 10); wm.moveTo(px, r.y + 60);
    const w = wm.get('a')!;
    expect(w.snap).toBeNull();
    expect(Math.abs(w.x + 400 - px)).toBeLessThanOrEqual(1); // the middle of the bar is still under the pointer
  });

  it('resizes from any edge and never below the minimum size', () => {
    const wm = createWindowManager({ area });
    wm.open('a', { x: 200, y: 100, w: 800, h: 600 });
    wm.resizeStart('a', 'nw', 200, 100); wm.resizeTo(1500, 900); wm.resizeEnd();
    const w = wm.get('a')!;
    expect([w.w, w.h]).toEqual([320, 220]);
    expect(w.x + w.w).toBe(1000); // the opposite corner stays put
  });

  it('Show desktop minimises the windows and the second time brings back the same ones', () => {
    const wm = createWindowManager({ area });
    wm.open('a'); wm.open('b'); wm.open('c'); wm.minimise('c');
    wm.showDesktop(); expect(wm.shown.value.length).toBe(0);
    wm.showDesktop(); expect(wm.shown.value.map((w) => w.id).sort()).toEqual(['a', 'b']);
  });

  it('stacking numbers stay under 1000 however often windows are focused, in the same order', () => {
    const wm = createWindowManager({ area });
    wm.open('a'); wm.open('b'); wm.open('c');
    for (let i = 0; i < 1500; i++) wm.focus(['a', 'b', 'c'][i % 3]!);
    expect(Math.max(...wm.wins.map((w) => w.z))).toBeLessThanOrEqual(1000);
    expect([...wm.wins].sort((x, y) => y.z - x.z)[0]!.id).toBe(wm.focused.value);
  });

  it('keeps the windows on the device when given a storage key', async () => {
    const wm = createWindowManager({ area, storageKey: 'wm-test' });
    wm.open('mail', { x: 50, y: 60, w: 700, h: 500 }); wm.snap('mail', HALF_RIGHT);
    await nextTick();
    const again = createWindowManager({ area, storageKey: 'wm-test' });
    expect(again.get('mail')).toMatchObject({ x: 50, y: 60, w: 700, h: 500, snap: HALF_RIGHT });
  });
});

describe('the Windows switcher and the keyboard', () => {
  const noop = { overview() {}, launcher() {}, events() {}, picker() {}, closeAll: () => false };

  it('Super+Tab selects the previous window; letting go of Super switches to it', () => {
    const wm = createWindowManager({ area }); const k = createDesktopKeys(wm, noop);
    wm.open('a'); wm.open('b'); wm.open('c');
    k.down(key('Tab', { metaKey: true }));
    expect(wm.switcher.value!.list[wm.switcher.value!.i]).toBe('b');
    k.down(key('Tab', { metaKey: true }));
    k.up(key('Meta'));
    expect(wm.switcher.value).toBeNull();
    expect(wm.focused.value).toBe('a');
  });

  it('Ctrl+Alt works wherever Super does, including releasing it to switch', () => {
    const wm = createWindowManager({ area }); const k = createDesktopKeys(wm, noop);
    wm.open('a'); wm.open('b');
    k.down(key('Tab', { ctrlKey: true, altKey: true })); k.up(key('Alt'));
    expect(wm.focused.value).toBe('a');
    k.down(key('ArrowLeft', { ctrlKey: true, altKey: true }));
    expect(wm.get('a')!.snap).toEqual(HALF_LEFT);
    expect(isSuper({ metaKey: false, ctrlKey: true, altKey: false })).toBe(false);
  });

  it('zoomed out, the switcher stays open after Super is released: arrows move, Enter opens, Escape cancels', () => {
    const wm = createWindowManager({ area }); const k = createDesktopKeys(wm, noop);
    ['a', 'b', 'c', 'd'].forEach((id) => wm.open(id));
    k.down(key('Tab', { metaKey: true })); wm.switchLevel(2); k.up(key('Meta'));
    expect(wm.switcher.value).not.toBeNull();
    k.down(key('ArrowDown')); // one row down at 2 per row
    expect(wm.switcher.value!.list[wm.switcher.value!.i]).toBe('a');
    k.down(key('Enter'));
    expect(wm.focused.value).toBe('a');
    k.down(key('Tab', { metaKey: true })); wm.switchLevel(3); k.down(key('Escape'));
    expect(wm.switcher.value).toBeNull(); expect(wm.focused.value).toBe('a');
  });

  it('Super pressed and released alone opens the Overview; Super with another key does not', () => {
    const wm = createWindowManager({ area }); let opened = 0;
    const k = createDesktopKeys(wm, { ...noop, overview: () => opened++ });
    k.down(key('Meta')); k.up(key('Meta')); expect(opened).toBe(1);
    k.down(key('Meta')); k.down(key('d', { metaKey: true })); k.up(key('Meta')); expect(opened).toBe(1);
  });

  it('Super+Space, Super+N, Super+Z and Super+D reach their actions', () => {
    const wm = createWindowManager({ area }); const hit: string[] = [];
    const k = createDesktopKeys(wm, { overview() {}, launcher: () => hit.push('launcher'), events: () => hit.push('events'), picker: () => hit.push('picker'), closeAll: () => false });
    wm.open('a');
    for (const c of [' ', 'n', 'Z']) k.down(key(c, { metaKey: true }));
    k.down(key('d', { metaKey: true }));
    expect(hit).toEqual(['launcher', 'events', 'picker']);
    expect(wm.shown.value.length).toBe(0);
  });
});

import { windowCards } from '../src/shell/desktop/cards';
describe('window cards (switcher and Overview)', () => {
  const box = { x: 40, y: 60, w: 1500, h: 800 };
  const sizes = [{ w: 1000, h: 700 }, { w: 460, h: 800 }, { w: 1200, h: 600 }, { w: 800, h: 600 }];
  it('the carousel centres the selected card, keeps every window shape and dims the others', () => {
    const c = windowCards(sizes, 1, 1, box);
    const mid = c[1]!.x + (460 * c[1]!.s) / 2;
    expect(Math.abs(mid - (box.x + box.w / 2))).toBeLessThanOrEqual(1);
    expect(c.map((k) => k.side)).toEqual([true, false, true, true]);
    expect(c[0]!.x + 1000 * c[0]!.s).toBeLessThan(c[1]!.x); // in order, not overlapping
  });
  it('a grid level puts that many per row and every row inside the box', () => {
    for (const level of [2, 3, 4] as const) {
      const c = windowCards(sizes, level, 0, box);
      c.forEach((k, i) => {
        expect(k.x).toBeGreaterThanOrEqual(box.x - 1);
        expect(k.x + sizes[i]!.w * k.s).toBeLessThanOrEqual(box.x + box.w + 1);
        expect(k.y + sizes[i]!.h * k.s).toBeLessThanOrEqual(box.y + box.h + 1);
      });
      expect(new Set(c.slice(0, level).map((k) => Math.round(k.y + sizes[c.indexOf(k)]!.h * k.s))).size).toBe(1); // a row shares its bottom line
    }
  });
});
