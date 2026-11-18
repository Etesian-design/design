import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { readFileSync } from 'node:fs';
import HdKeyboard from '../src/components/HdKeyboard.vue';

const read = (p: string) => readFileSync(p, 'utf8');
const labels = (w: ReturnType<typeof mount>) => w.findAll('.hd-kb__label').map((l) => l.text());

describe('HdKeyboard (matched to the ROM keyboard)', () => {
  it('letters are lower case', () => expect(labels(mount(HdKeyboard))).toContain('q'));
  it('shift once and caps lock show capitals', () => {
    expect(labels(mount(HdKeyboard, { props: { shift: 'once' } }))).toContain('Q');
    expect(labels(mount(HdKeyboard, { props: { shift: 'locked' } }))).toContain('Q');
  });
  it('caps lock turns the shift key plain white', () => {
    const w = mount(HdKeyboard, { props: { shift: 'locked' } });
    expect(w.find('.hd-kb__key--shift').classes()).toContain('is-locked');
    expect(w.find('.hd-kb__key--shift').attributes('aria-label')).toBe('Caps lock on');
    expect(read('src/components/HdKeyboard.vue')).toMatch(/\.hd-kb__key--shift\.is-locked \{ background: #FFFFFF; box-shadow: none;/);
  });
  it('the globe sits between the comma and the space bar', () => {
    const last = mount(HdKeyboard).findAll('.hd-kb__row')[3]!.findAll('button');
    const names = last.map((b) => b.attributes('aria-label') ?? b.text());
    expect(names).toEqual(['?123', ',', 'Language', 'Space', '.', 'Enter']);
  });
  it('a pressed key sinks in', () => {
    const w = mount(HdKeyboard, { props: { pressed: 'g' } });
    expect(w.findAll('.hd-kb__key.is-pressed')).toHaveLength(1);
    expect(read('src/components/HdKeyboard.vue')).toContain('background: linear-gradient(#0B0B0B 10%, #1A1A1A 72%)');
  });
  it('emits the keys', async () => {
    const w = mount(HdKeyboard);
    await w.findAll('.hd-kb__key')[0]!.trigger('click');
    expect(w.emitted('key')![0]).toEqual(['q']);
  });
  it('the page mocks use it', () => expect(read('src/stories/parts/N9Keyboard.vue')).toContain('<HdKeyboard class="xm-kb" />'));
  it('docs describe the keyboard and the composer', () => {
    const d = read('docs/20-phone.md');
    expect(d).toContain('### Keyboard'); expect(d).toContain('Caps lock is a double tap on Shift');
    expect(d).toContain('### Messaging composer');
    expect(read('docs/08-sound-haptics.md')).toContain('## Keyboard click');
    expect(d).toContain('Every key clicks in and out'); expect(d).toContain('Not while the on-screen keyboard is up');
    expect(d).toContain('darkens the further it is pulled down');
  });
});
