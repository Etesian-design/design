import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { readFileSync } from 'node:fs';
import * as Hd from '../src';

describe('icon lighting', () => {
  it('litPalette: top lighter than bottom, warm hues lean to yellow at top', () => {
    const p = Hd.litPalette('#ED9507')!;
    const h = (s: string) => Number(/hsl\(([\d.]+)/.exec(s)![1]);
    const l = (s: string) => Number(/([\d.]+)%\)$/.exec(s)![1]);
    expect(l(p.top)).toBeGreaterThan(l(p.bottom) + 10);
    expect(h(p.top)).toBeGreaterThan(h(p.bottom));
    expect(Hd.litPalette('var(--x)')).toBeNull();
  });
  it('AppIcon is lit by default and flat on request', () => {
    const lit = mount(Hd.HdAppIcon, { props: { label: 'A', icon: 'phone', color: '#62B700' } });
    expect(lit.find('.hd-icon-lit').exists()).toBe(true);
    expect(lit.find('.hd-icon--lit filter').exists()).toBe(true);
    expect(lit.find('.hd-icon-lit').attributes('style')).toContain('--hd-icon-top');
    const flat = mount(Hd.HdAppIcon, { props: { label: 'A', icon: 'phone', lighting: 'flat' } });
    expect(flat.find('.hd-icon-lit').exists()).toBe(false);
    expect(flat.find('.hd-squircle').exists()).toBe(true);
  });
  it('photos are never re-lit', () => {
    const w = mount(Hd.HdAvatar, { props: { name: 'A B', src: 'x.png' } });
    expect(w.find('.hd-icon-lit').exists()).toBe(false);
  });
  it('base.css defines the lit utility with rim crescent', () => {
    const css = readFileSync('src/styles/base.css', 'utf8');
    for (const s of ['.hd-icon-lit {', '.hd-icon-lit::before', '.hd-icon-lit-shadow', 'mask-composite: subtract', '--hd-icon-lighting-rim-size']) expect(css).toContain(s);
  });
});
