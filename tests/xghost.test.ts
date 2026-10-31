import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import XGhost from '../src/stories/explorations/phone2/XGhost.vue';

describe('ghost rows', () => {
  it('shows whole rows plus a cut, almost invisible half row, fading gradually', () => {
    const w = mount(XGhost, { props: { size: 'small', amount: 2.5 } });
    const g = w.findAll('.xg__g');
    expect(g).toHaveLength(3);
    expect(g[2]!.classes()).toContain('xg__g--half');
    const o = g.map((x) => Number((x.element as HTMLElement).style.opacity));
    expect(o[0]).toBeGreaterThan(o[1]!); expect(o[1]).toBeGreaterThan(o[2]!); expect(Math.min(...o)).toBeGreaterThanOrEqual(0.35); // gentle: only the cut half row fades out, under the Feed header
  });
  it('0.5 exists only for big rows', () => {
    expect(mount(XGhost, { props: { size: 'big', amount: 0.5 } }).findAll('.xg__g')).toHaveLength(1);
    expect(mount(XGhost, { props: { size: 'small', amount: 0.5 } }).findAll('.xg__g--half')).toHaveLength(0);
  });
  it('off (0 rows) shows nothing', () => {
    expect(mount(XGhost, { props: { amount: 0 } }).find('.xg__ghosts').exists()).toBe(false);
  });
  it('a dismissed notification becomes the top ghost row', async () => {
    const w = mount(XGhost); const vm = w.vm as any;
    const first = vm.live[0].title; vm.dismiss(vm.live[0].id); await nextTick();
    expect(vm.ghosts[0].title).toBe(first);
  });
  it('the rows are one item: tap opens Earlier with all of them; swipe expires them all', async () => {
    const w = mount(XGhost); const vm = w.vm as any;
    await w.find('.xg__ghosts').trigger('pointerdown'); await w.find('.xg__ghosts').trigger('pointerup');
    expect(vm.openEarlier).toBe(true);
    expect(w.findAll('.hd-event')).toHaveLength(vm.ghosts.length);
    vm.openEarlier = false; vm.expireAll(); await nextTick();
    expect(w.find('.xg__ghosts').exists()).toBe(false);
  });
});
