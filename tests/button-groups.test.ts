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
