import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import HdTimeDial from '../src/components/HdTimeDial.vue';

describe('HdTimeDial', () => {
  const last = (w: ReturnType<typeof mount>) => (w.emitted('update:modelValue') as string[][]).at(-1)?.[0];
  it('shows the time, the minute knob on the outer ring and the hour knob inside the disc', () => {
    const w = mount(HdTimeDial, { props: { modelValue: '23:49', size: 292 } });
    expect(w.find('.hd-td__time').text()).toBe('23:49');
    const pos = (s: string) => { const st = (w.find(s).element as HTMLElement).style; return Math.hypot(parseFloat(st.left) - 146, parseFloat(st.top) - 146); };
    const core = 146 * 0.553, knob = 146 * 0.18;
    expect(pos('.is-min') - knob).toBeGreaterThanOrEqual(core); // whole minute knob outside the disc
    expect(pos('.is-min') + knob).toBeLessThanOrEqual(146);
    expect(pos('.is-hour') + knob).toBeLessThanOrEqual(core); // whole hour knob inside the disc
    expect(146 - (pos('.is-min') + knob)).toBeLessThan(15); // each knob close to its ring's outer edge
    expect(core - (pos('.is-hour') + knob)).toBeLessThan(15);
  });
  it('puts the hour 12 to the turn, as on the N9: 23 at eleven o\'clock', () => {
    const w = mount(HdTimeDial, { props: { modelValue: '23:49', size: 292 } });
    const st = (w.find('.is-hour').element as HTMLElement).style;
    expect(Math.round((Math.atan2(parseFloat(st.left) - 146, 146 - parseFloat(st.top)) * 180) / Math.PI)).toBe(-30);
  });
  it('steps with the keys and wraps around', async () => {
    const w = mount(HdTimeDial, { props: { modelValue: '23:59' } });
    await w.find('.is-min').trigger('keydown', { key: 'ArrowUp' });
    expect(last(w)).toBe('23:00');
    await w.find('.is-hour').trigger('keydown', { key: 'PageUp' });
    expect(last(w)).toBe('02:59');
  });
});
