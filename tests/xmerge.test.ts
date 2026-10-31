import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import XMerge from '../src/stories/explorations/phone2/XMerge.vue';

// jsdom has no layout: map client coords 1:1 onto the 360-wide frame
const rect = { left: 0, top: 0, width: 360, height: 640, right: 360, bottom: 640, x: 0, y: 0, toJSON() {} };
const ev = (id: number, x: number, y: number, type = 'touch') => ({ pointerId: id, clientX: x, clientY: y, pointerType: type, currentTarget: { closest: () => ({ getBoundingClientRect: () => rect }), setPointerCapture() {} } }) as unknown as PointerEvent;
const pullTogether = (vm: any) => { vm.down('mail', ev(1, 96, 109)); vm.down('calendar', ev(2, 263, 109)); vm.move(ev(1, 150, 109)); vm.move(ev(2, 200, 109)); };

describe('two-finger split demo', () => {
  it('cards follow the fingers, then snap into ONE card showing the portrait split, with a vibration', async () => {
    const vib = vi.fn(); (navigator as any).vibrate = vib;
    const w = mount(XMerge); const vm = w.vm as any;
    vm.down('mail', ev(1, 96, 109)); vm.down('calendar', ev(2, 263, 109));
    vm.move(ev(1, 110, 109)); expect(vm.g.offA.x).toBe(14); expect(vm.g.snapped).toBe(false);
    vm.move(ev(1, 150, 109)); vm.move(ev(2, 200, 109)); await nextTick();
    expect(vm.g.snapped).toBe(true); expect(vib).toHaveBeenCalledWith(30);
    const live = w.find('.xm__c--live');
    expect(live.findAll('.xm__pane')).toHaveLength(2); // top and bottom of one card
    expect(live.find('.xm__handle').exists()).toBe(true);
  });
  it('lifting keeps the pair as a single card in the grid', async () => {
    const w = mount(XMerge); const vm = w.vm as any;
    pullTogether(vm); vm.up(ev(1, 0, 0)); vm.up(ev(2, 0, 0)); await nextTick();
    expect(vm.cards.map((c: any) => c.id)).toEqual(['mail+calendar', 'music', 'messages']);
    expect(w.findAll('.xm__c')).toHaveLength(3);
  });
  it('pulling apart stretches the merged card, then tears it back into two', async () => {
    const vib = vi.fn(); (navigator as any).vibrate = vib;
    const w = mount(XMerge); const vm = w.vm as any;
    pullTogether(vm);
    vm.move(ev(1, 120, 109)); vm.move(ev(2, 230, 109));
    expect(vm.g.snapped).toBe(true); expect(vm.g.stretch).toBeGreaterThan(0); // still merged, deformed
    vm.move(ev(1, 60, 109)); vm.move(ev(2, 300, 109));
    expect(vm.g.snapped).toBe(false); expect(vib).toHaveBeenLastCalledWith(10);
    vm.up(ev(1, 0, 0)); vm.up(ev(2, 0, 0));
    expect(vm.cards).toHaveLength(4);
  });
  it('mouse: dragging a card onto another merges them', () => {
    const w = mount(XMerge); const vm = w.vm as any;
    vm.down('music', ev(1, 96, 299, 'mouse')); vm.move(ev(1, 240, 299, 'mouse'));
    expect(vm.g.b).toBe('messages'); expect(vm.g.snapped).toBe(true);
    vm.up(ev(1, 0, 0, 'mouse'));
    expect(vm.cards.map((c: any) => c.id)).toEqual(['mail', 'calendar', 'music+messages']);
  });
});

describe('pulling a split card apart', () => {
  const merged = (vm: any) => { pullTogether(vm); vm.up(ev(1, 0, 0)); vm.up(ev(2, 0, 0)); }; // mail+calendar at slot 0, centre (96.5, 109)
  it('stretches, tears into two cards with a vibration, and lifting separates them', async () => {
    const vib = vi.fn(); (navigator as any).vibrate = vib;
    const w = mount(XMerge); const vm = w.vm as any; merged(vm);
    vm.down('mail+calendar', ev(3, 96, 80)); vm.down('mail+calendar', ev(4, 96, 140));
    vm.move(ev(3, 96, 60)); vm.move(ev(4, 96, 160));
    expect(vm.sp.stretch).toBeGreaterThan(0); expect(vm.sp.torn).toBe(false);
    vm.move(ev(3, 96, 20)); vm.move(ev(4, 96, 220)); await nextTick();
    expect(vm.sp.torn).toBe(true); expect(vib).toHaveBeenLastCalledWith(30);
    expect(w.findAll('.xm__c--torn').map((c) => c.text())).toEqual(['Mail', 'Calendar']);
    vm.up(ev(3, 0, 0)); vm.up(ev(4, 0, 0));
    expect(vm.cards.map((c: any) => c.id)).toEqual(['mail', 'calendar', 'music', 'messages']);
  });
  it('pushing back before lifting keeps the pair', () => {
    const w = mount(XMerge); const vm = w.vm as any; merged(vm);
    vm.down('mail+calendar', ev(3, 96, 80)); vm.down('mail+calendar', ev(4, 96, 140));
    vm.move(ev(3, 96, 20)); vm.move(ev(4, 96, 220)); expect(vm.sp.torn).toBe(true);
    vm.move(ev(3, 96, 75)); vm.move(ev(4, 96, 145)); expect(vm.sp.torn).toBe(false);
    vm.up(ev(3, 0, 0)); vm.up(ev(4, 0, 0));
    expect(vm.cards[0].id).toBe('mail+calendar');
  });
  it('mouse: dragging a split card away from its centre pulls it apart', () => {
    const w = mount(XMerge); const vm = w.vm as any; merged(vm);
    vm.down('mail+calendar', ev(1, 96, 100, 'mouse')); vm.move(ev(1, 96, 30, 'mouse'));
    expect(vm.sp.torn).toBe(true);
    vm.up(ev(1, 0, 0, 'mouse'));
    expect(vm.cards).toHaveLength(4);
  });
});
