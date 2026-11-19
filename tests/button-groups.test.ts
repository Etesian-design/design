import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(`${process.cwd()}/${p}`, 'utf8');

// 2026-11-04: groups had a rounded-rect outline with squircle-ended buttons inside. A group (QBtnGroup, QBtnToggle,
// HdTabBar segments, the time picker's AM/PM) follows the text field: squircle-half ends, flat everywhere else.
describe('button groups and toggles have the text field shape', () => {
  const base = read('src/styles/base.css');
  const q = read('src/quasar/etesian-quasar.css');
  const rule = (sel: string) => base.slice(base.lastIndexOf(sel), base.indexOf('}', base.lastIndexOf(sel)));
  it('the caps are n = 2.8 squircle halves for all four sides', () => {
    for (const k of ['l', 'r', 't', 'b']) expect(base).toContain(`--hd-sq-cap-${k}: url(`);
  });
  it('the group is masked by a start and an end cap, never a border radius', () => {
    const g = rule('.hd-btn-group-lit, .hd-quasar .q-btn-group {');
    expect(g).toMatch(/border-radius: 0 !important/);
    expect(g).toContain('mask-composite: intersect');
    expect(g).toContain('--hd-cap-a: var(--hd-sq-cap-l); --hd-cap-b: var(--hd-sq-cap-r)');
  });
  it('vertical groups round their top and bottom corners, a button tall (not caps as wide as the column)', () => {
    const v = rule('.hd-btn-group-lit.hd-tab-bar--vertical, .hd-btn-group-lit.hd-vertical, .hd-quasar .q-btn-group.column, .hd-quasar .q-btn-group.hd-vertical {');
    expect(v).toContain('--hd-vcap: calc(var(--hd-size-button) + 2px)');
    for (const c of ['left top', 'right top', 'left bottom', 'right bottom']) expect(v).toContain(`var(--hd-squircle-mask) ${c} / var(--hd-vcap) var(--hd-vcap)`);
  });
  it('middle buttons are flat and share the space; only the first and last take a cap', () => {
    const all = rule('.hd-btn-group-lit > *, ');
    expect(all).toContain('flex: 1 1 0'); expect(all).toContain('border-radius: 0 !important'); expect(all).toContain('mask: none !important');
    expect(rule('.hd-btn-group-lit > :first-child')).toContain('var(--hd-cap-a)');
    expect(rule('.hd-btn-group-lit > :last-child')).toContain('var(--hd-cap-b)');
  });
  it("a grouped Quasar button drops its own squircle face", () => {
    expect(q).toContain('.hd-quasar .q-btn-group > .q-btn-item::before { content: none !important; }');
    expect(q).not.toMatch(/\.q-btn-group \{[^}]*border-radius: calc/);
  });
});

// 2026-11-19 (user): the N9 camera settings are the reference for grouped buttons and tabs, and Quasar must match.
// Measured: unselected #434343 -> #181818, the selected segment FLAT blue (no gloss), dividers a groove (dark gap,
// then a light line on the next segment's leading edge).
describe('segments follow the N9 camera settings, in our components and in Quasar alike', () => {
  const base = readFileSync(`${process.cwd()}/src/styles/base.css`, 'utf8');
  const q = readFileSync(`${process.cwd()}/src/quasar/etesian-quasar.css`, 'utf8');
  const tab = readFileSync(`${process.cwd()}/src/components/HdTabButton.vue`, 'utf8');
  it('the selected segment is flat accent, without a gradient', () => {
    const sel = tab.slice(tab.indexOf('.hd-tab-bar--segments > .hd-tab-button.is-selected'));
    expect(sel.slice(0, sel.indexOf('}'))).toMatch(/background: var\(--hd-accent\); box-shadow: none/);
    const qs = q.slice(q.indexOf('.q-btn-toggle .q-btn-item[aria-pressed="true"]'));
    expect(qs.slice(0, qs.indexOf('}'))).toMatch(/background: var\(--hd-accent\) !important;.*box-shadow: none/);
    expect(q).toMatch(/\.q-tab--active \{ background: var\(--hd-accent\)/);
  });
  it('dividers are a groove: a light leading line on every segment after the first, horizontal and vertical', () => {
    expect(base).toContain('.hd-btn-group-lit > * + *, .hd-quasar .q-btn-group > * + * { box-shadow: inset 1px 0 0 var(--hd-btn-rim-top) !important; }');
    expect(base).toMatch(/\.hd-quasar \.q-btn-group\.hd-vertical > \* \+ \* \{ box-shadow: inset 0 1px 0 var\(--hd-btn-rim-top\)/);
    expect(q).toContain('.q-tab + .q-tab:not(.q-tab--active) { box-shadow: inset 1px 0 0 var(--hd-btn-rim-top); }');
  });
  it('segmented Quasar tabs are lit like the other groups', () => {
    expect(base).toContain('.hd-quasar .q-btn-group, .hd-quasar .q-tabs {');
    expect(q).toContain('.q-tab:not(.q-tab--active) { background: var(--hd-lit-fill); }');
  });
});

// 2026-11-19 (user): match the N9's padding around the text too. Camera settings: a segment 50 n9px (33px) tall,
// 13px bold text centred, the group's length shared equally; never less than 11px either side of the text.
describe('segments have the N9 size and padding, in our components and in Quasar alike', () => {
  const q = readFileSync(`${process.cwd()}/src/quasar/etesian-quasar.css`, 'utf8');
  const tab = readFileSync(`${process.cwd()}/src/components/HdTabButton.vue`, 'utf8');
  it('33px tall with 11px either side of the text', () => {
    expect(tab).toContain('flex: 1 1 0; min-height: 33px; min-width: var(--hd-size-touch-target); padding: 0 var(--hd-space-xlarge);');
    expect(q).toContain('.q-btn-toggle .q-btn-item { font-size: var(--hd-font-size-small); font-weight: var(--hd-font-weight-bold); min-height: 33px; padding: 0 var(--hd-space-xlarge); }');
    expect(q).toMatch(/\.hd-quasar \.q-tab \{ text-transform: none; min-height: 33px; padding: 0 var\(--hd-space-xlarge\)/);
  });
});

describe('an icon in a segment is the N9 size', () => {
  it('20px in Quasar toggles and groups', () => {
    expect(readFileSync(`${process.cwd()}/src/quasar/etesian-quasar.css`, 'utf8')).toContain('.hd-quasar .q-btn-toggle .q-btn-item .q-icon, .hd-quasar .q-btn-group > .q-btn-item .q-icon { font-size: 20px; }');
  });
});
