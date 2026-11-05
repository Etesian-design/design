import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(`${process.cwd()}/${p}`, 'utf8');

// 2026-11-05: chips, badges, count bubbles and tags were still pills (border-radius 999px) while buttons and fields
// had the N9 squircle-half ends. Every one of them takes the same n = 2.8 ends now; scripts/shape-audit.mjs checks
// every Storybook story in a real browser.
describe('chips, badges and count bubbles have squircle-half ends, never pills', () => {
  const base = read('src/styles/base.css');
  const q = read('src/quasar/etesian-quasar.css');
  const rule = (css: string, sel: string) => { const i = css.indexOf(sel); return css.slice(i, css.indexOf('}', i)); };
  it('.hd-sqm masks with the two end caps, sized by the height', () => {
    const r = rule(base, '.hd-sqm, ');
    expect(r).toContain('var(--hd-sq-cap-l) left center / auto 100%');
    expect(r).toContain('mask-composite: intersect');
    expect(r).toContain('border-radius: 0 !important');
  });
  it('count bubbles, app icon and tool icon badges use it', () => {
    const sel = base.slice(base.indexOf('.hd-sqm, '), base.indexOf('{', base.indexOf('.hd-sqm, ')));
    for (const c of ['.hd-count', '.hd-app-icon__badge', '.hd-tool-icon__badge']) expect(sel).toContain(c);
  });
  it('Quasar badges and chips are masked by the caps, and no rule gives them a pill radius', () => {
    expect(rule(q, '.hd-quasar .q-badge {')).toContain('var(--hd-sq-cap-l)');
    expect(rule(q, '.hd-quasar .q-chip {')).toContain('var(--hd-sq-cap-l)');
    expect(rule(q, '.hd-quasar .q-chip::before {')).toContain('var(--hd-sq-cap-l)');
    expect(q).not.toMatch(/\.q-(badge|chip)[^{]*\{[^}]*border-radius: var\(--hd-radius-pill\)/);
  });
  it('a button with a floating badge draws its shape with layers, so the badge is not cut off', () => {
    expect(q).toMatch(/:has\(\.q-badge--floating\) \{ -webkit-mask: none; mask: none; background-clip: text !important; \}/);
  });
  it('segmented Quasar tabs take the text field shape', () => {
    expect(q).toContain('.q-tabs:not(.q-tabs--vertical):not(:is(.q-header, .q-footer) *) .q-tabs__content { gap: 1px;');
  });
  it('the time picker AM/PM column is a vertical group (top and bottom caps)', () => {
    expect(read('src/components/HdTimePicker.vue')).toContain('class="hd-timepicker__ampm hd-btn-group-lit hd-vertical"');
  });
  it('the pickers\', empty state\'s and task edit bar\'s dark buttons have the .hd-sqf shape', () => {
    for (const f of ['HdTimePicker', 'HdColorPicker', 'HdEmptyState', 'HdTaskEditBar']) expect(read(`src/components/${f}.vue`)).toMatch(/class="hd-[a-z-]+(__[a-z]+)? hd-sqf hd-focusable"/);
  });
});
