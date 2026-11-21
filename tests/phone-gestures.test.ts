import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import {
  edgeAt, inward, progressOf, shouldCommit, homeLook, shade, windowOffset, homeViews, wrap, pagerTarget, unlockCommits,
  settleMs, decelerate, accelerate, velocity, SWIPE, PAGER,
} from '../src/shell/parts/gestures';
import XPhoneGestures from '../src/shell/parts/XPhoneGestures.vue';

describe('phone gesture maths (from the ROM)', () => {
  it('finds the edge a touch starts on', () => {
    expect(edgeAt(180, 10, 360, 720, 24)).toBe('top');
    expect(edgeAt(180, 40, 360, 720, 24)).toBe('top'); // the 24 dp band under the status bar
    expect(edgeAt(10, 40, 360, 720, 24)).toBe('left'); // but not within 18 dp of a side
    expect(edgeAt(17, 300, 360, 720, 24)).toBe('left');
    expect(edgeAt(18, 300, 360, 720, 24)).toBeNull();
    expect(edgeAt(350, 300, 360, 720, 24)).toBe('right');
    expect(edgeAt(180, 710, 360, 720, 24)).toBe('bottom');
    expect(edgeAt(180, 300, 360, 720, 24)).toBeNull();
  });
  it('measures progress inward over the width or height', () => {
    expect(inward('right', -90, 5)).toEqual({ d: 90, across: 5 });
    expect(progressOf('right', 90, 360, 720)).toBe(0.25);
    expect(progressOf('top', 360, 360, 720)).toBe(0.5);
    expect(progressOf('left', -20, 360, 720)).toBe(0);
  });
  it('commits past half, or on a flick past 8%, and never when moving back', () => {
    expect(shouldCommit(0.49, 0)).toBe(false);
    expect(shouldCommit(0.51, 0)).toBe(true);
    expect(shouldCommit(0.1, 1000)).toBe(true);
    expect(shouldCommit(0.05, 1000)).toBe(false);
    expect(shouldCommit(0.9, -400)).toBe(false);
    expect(shouldCommit(0.25, 0, 0.2)).toBe(true);
  });
  it('home zooms from 0.9 and brightens from 25%; a close darkens to 70%', () => {
    expect(homeLook(0)).toEqual({ scale: 0.9, opacity: 0.25 });
    expect(homeLook(1)).toEqual({ scale: 1, opacity: 1 });
    expect(shade('top', true, 1)).toBeCloseTo(0.7);
    expect(shade('left', false, 1)).toBe(0);
    expect(shade('bottom', false, 0.2, 1)).toBeCloseTo(0.55);
    expect(windowOffset('left', 0.5, 360, 720)).toEqual({ x: 180, y: 0 });
    expect(windowOffset('bottom', 0.5, 360, 720)).toEqual({ x: 0, y: -360 });
  });
  it('orders the home views and wraps round', () => {
    expect(homeViews()).toEqual(['events', 'apps', 'switcher']);
    expect(homeViews({ news: true, widgets: 2 })).toEqual(['news', 'widgets', 'widgets', 'events', 'apps', 'switcher']);
    expect(wrap(2, 3)).toBe(-1);
    expect(wrap(-2, 3)).toBe(1);
  });
  it('the pager settles to the nearest view, at most one away, and flings past 300 dp/s', () => {
    expect(PAGER.flingDpS).toBe(300);
    expect(pagerTarget(1, 1.4, 0, true)).toBe(1);
    expect(pagerTarget(1, 1.6, 0, true)).toBe(2);
    expect(pagerTarget(1, 1.2, -400, true)).toBe(2);
    expect(pagerTarget(1, 0.9, 400, true)).toBe(0);
    expect(pagerTarget(1, 3.2, 0, true)).toBe(2);
  });
  it('unlocks past 35% or on a flick along the drag', () => {
    expect(unlockCommits(130, 360, 0)).toEqual({ commit: true, ms: 220 });
    expect(unlockCommits(120, 360, 0)).toEqual({ commit: false, ms: 260 });
    expect(unlockCommits(40, 360, 1500)).toEqual({ commit: true, ms: 160 });
    expect(unlockCommits(200, 360, -1500)).toEqual({ commit: false, ms: 260 });
  });
  it('durations and interpolators match Android', () => {
    expect(settleMs(1)).toBe(400);
    expect(settleMs(0.5)).toBe(310);
    expect(settleMs(3, PAGER.maxMs)).toBe(400);
    expect(decelerate(0.5)).toBeCloseTo(0.75);
    expect(decelerate(0.5, 1.6)).toBeCloseTo(1 - Math.pow(0.5, 3.2));
    expect(accelerate(0.5, 1.5)).toBeCloseTo(0.125);
    expect(SWIPE.peekHoldMs).toBe(500);
  });
  it('measures velocity over the last 100 ms', () => {
    expect(velocity([{ t: 0, x: 0, y: 0 }, { t: 50, x: 50, y: 0 }, { t: 100, x: 100, y: 0 }])).toEqual({ vx: 1000, vy: 0 });
  });
});

describe('XPhoneGestures', () => {
  let now = 0;
  beforeEach(() => {
    now = 0;
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => { now += 1000; cb(now); }, 0) as unknown as number);
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 360, height: 720, right: 360, bottom: 720, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
  });
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
  const ev = (type: string, x: number, y: number, t: number) => {
    const e = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, button: 0 }) as unknown as PointerEvent;
    Object.defineProperty(e, 'timeStamp', { value: t });
    return e;
  };
  const flush = () => new Promise((r) => setTimeout(r, 20));

  it('a slow swipe from the right edge past half minimises the app to Open apps', async () => {
    const lines: string[] = [];
    const w = mount(XPhoneGestures, { props: { open: 'Messages', onLog: (l: string) => lines.push(l) } });
    expect(w.find('.x-pg__app').exists()).toBe(true);
    w.element.dispatchEvent(ev('pointerdown', 355, 300, 0));
    for (let i = 1; i <= 20; i++) window.dispatchEvent(ev('pointermove', 355 - i * 10, 300, i * 200));
    window.dispatchEvent(ev('pointerup', 155, 300, 4100));
    await flush(); await nextTick();
    expect(w.find('.x-pg__app').exists()).toBe(false);
    expect(lines[0]).toMatch(/^Minimised Messages from the right/);
    expect((w.vm as unknown as { offset: number }).offset).toBe(2);
  });
  it('letting go early springs the app back', async () => {
    const lines: string[] = [];
    const w = mount(XPhoneGestures, { props: { open: 'Mail', onLog: (l: string) => lines.push(l) } });
    w.element.dispatchEvent(ev('pointerdown', 5, 300, 0));
    for (let i = 1; i <= 5; i++) window.dispatchEvent(ev('pointermove', 5 + i * 20, 300, i * 300));
    window.dispatchEvent(ev('pointerup', 105, 300, 1600));
    await flush(); await nextTick();
    expect(w.find('.x-pg__app').exists()).toBe(true);
    expect(lines[0]).toMatch(/springs back/);
  });
  it('a swipe down from the status bar closes the app and removes its card', async () => {
    const w = mount(XPhoneGestures, { props: { open: 'Mail', running: ['Mail', 'Music'] } });
    w.element.dispatchEvent(ev('pointerdown', 180, 10, 0));
    for (let i = 1; i <= 10; i++) window.dispatchEvent(ev('pointermove', 180, 10 + i * 45, i * 300));
    window.dispatchEvent(ev('pointerup', 180, 460, 3100));
    await flush(); await nextTick();
    expect(w.find('.x-pg__app').exists()).toBe(false);
    expect(w.findAll('.x-pg__card .hd-task-card__title').map((c) => c.text())).toEqual(['Music']);
  });
  it('home views swipe round in a circle', async () => {
    const w = mount(XPhoneGestures, { props: { open: null } });
    expect(w.findAll('.x-pg__view').map((v) => v.attributes('aria-label'))).toEqual(['Events', 'Applications', 'Open apps']);
    // Applications (1) -> drag left -> Open apps (2) -> drag left -> Events (0, round)
    for (let k = 0; k < 2; k++) {
      w.element.dispatchEvent(ev('pointerdown', 300, 300, 0));
      for (let i = 1; i <= 10; i++) window.dispatchEvent(ev('pointermove', 300 - i * 25, 300, i * 300));
      window.dispatchEvent(ev('pointerup', 50, 300, 3100));
      await flush();
    }
    expect((w.vm as unknown as { offset: number }).offset).toBe(0);
  });
  it('the lock screen unlocks past 35% on either axis', async () => {
    const w = mount(XPhoneGestures, { props: { open: null, locked: true } });
    w.element.dispatchEvent(ev('pointerdown', 180, 400, 0));
    for (let i = 1; i <= 10; i++) window.dispatchEvent(ev('pointermove', 180, 400 - i * 30, i * 300));
    window.dispatchEvent(ev('pointerup', 180, 100, 3100));
    await flush(); await nextTick();
    expect(w.find('.x-pg__lock').exists()).toBe(false);
  });
});
