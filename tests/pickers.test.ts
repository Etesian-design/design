import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HdTimePicker from '../src/components/HdTimePicker.vue';
import HdColorPicker from '../src/components/HdColorPicker.vue';

describe('HdTimePicker (N9 tumbler)', () => {
  it('shows hour and minute columns with the selection in the band, AM/PM and lit buttons', async () => {
    const w = mount(HdTimePicker, { props: { modelValue: '10:45' } });
    const cols = w.findAll('[role=spinbutton]');
    expect(cols.map((c) => c.attributes('aria-label'))).toEqual(['Hours', 'Minutes']);
    expect(cols.map((c) => c.get('.is-sel').text())).toEqual(['10', '45']);
    expect(w.get('[role=radio][aria-checked=true]').text()).toBe('AM');
    expect(w.findAll('.hd-dark-btn').map((b) => b.text())).toEqual(['Done', 'Cancel']);
    await cols[1]!.trigger('keydown', { key: 'ArrowDown' });
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['10:46']);
    await w.findAll('[role=radio]')[1]!.trigger('click');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['22:46']);
    await cols[0]!.trigger('keydown', { key: 'ArrowUp' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['21:46']);
    await w.findAll('.hd-dark-btn')[0]!.trigger('click');
    expect(w.emitted('accept')?.[0]).toEqual(['21:46']);
  });
  it('24-hour mode has no AM/PM and wraps', async () => {
    const w = mount(HdTimePicker, { props: { modelValue: '23:59', hour24: true } });
    expect(w.find('[role=radiogroup]').exists()).toBe(false);
    await w.findAll('[role=spinbutton]')[0]!.trigger('keydown', { key: 'ArrowDown' });
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['00:59']);
  });
});

describe('HdColorPicker (N9 spirit)', () => {
  it('has squircle accent swatches, a shade area, hue, preview and lit Done/Cancel', async () => {
    const w = mount(HdColorPicker, { props: { modelValue: '#4591FF' } });
    const sw = w.findAll('.hd-colorpicker__sw');
    expect(sw.length).toBeGreaterThanOrEqual(12);
    expect(sw.every((s) => s.classes().includes('hd-sq'))).toBe(true);
    expect(w.get('[aria-selected=true]').attributes('aria-label')).toBe('#4591FF');
    expect(w.get('.hd-colorpicker__big').classes()).toContain('hd-sq');
    expect(w.get('.hd-colorpicker__hex').text()).toBe('#4591FF');
    await sw[1]!.trigger('click');
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['#62B700']);
    await w.get('[aria-label=Hue]').trigger('keydown', { key: 'ArrowRight' });
    expect(w.emitted('update:modelValue')).toHaveLength(2);
    await w.findAll('.hd-dark-btn')[0]!.trigger('click');
    expect(w.emitted('done')).toHaveLength(1);
    expect(w.findAll('.hd-dark-btn').map((b) => b.text())).toEqual(['Done', 'Cancel']);
  });
});
