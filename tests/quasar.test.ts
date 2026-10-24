import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { readFileSync, readdirSync } from 'node:fs';
import { h } from 'vue';
import * as Q from 'quasar';
import { quasarCoverage, quasarPluginCoverage } from '../src/quasar/coverage';
import { harmattanIconSet, harmattanQuasarOptions, HarmattanQuasar, HdQSpinnerSquircle } from '../src/quasar';
import { quasarPlugin } from '../src/stories/quasar/quasar-app';

const apiDir = 'node_modules/quasar/dist/api';
const api = readdirSync(apiDir).map((f) => ({ name: f.replace('.json', ''), ...JSON.parse(readFileSync(`${apiDir}/${f}`, 'utf8')) }));
const components = api.filter((a) => a.type === 'component').map((a) => a.name).sort();
const css = readFileSync('src/quasar/harmattan-quasar.css', 'utf8');

describe('Quasar theme coverage', () => {
  it('covers exactly the components in the installed Quasar API', () => {
    expect(components.length).toBeGreaterThan(100);
    expect(Object.keys(quasarCoverage).sort()).toEqual(components);
  });
  for (const name of components) {
    it(`${name} is themed (or documented as non-visual)`, () => {
      const c = quasarCoverage[name]!;
      if (c.selectors === null) { expect(c.reason.length).toBeGreaterThan(5); return; }
      for (const sel of c.selectors) expect(css, `${name}: ${sel}`).toContain(sel);
    });
  }
  it('themes the UI plugins', () => {
    for (const [p, sels] of Object.entries(quasarPluginCoverage)) for (const s of sels) expect(css, p).toContain(s);
  });
  it('squircle-masks avatars and never uses circles for them', () => {
    const rule = css.slice(css.indexOf('.hd-quasar .q-avatar__content, .hd-quasar .q-avatar img'), css.indexOf('/* lit tile'));
    expect(rule).toContain('mask-image: var(--hd-q-squircle)');
    expect(rule).toContain('border-radius: 0 !important');
  });
  it('icon set defines every key of Quasar material-icons set', async () => {
    const mat = (await import('quasar/icon-set/material-icons.js')).default as Record<string, any>;
    for (const [group, v] of Object.entries(mat)) {
      if (typeof v !== 'object') continue;
      for (const k of Object.keys(v)) expect(harmattanIconSet as any, `${group}.${k}`).toHaveProperty([group, k]);
    }
  });
  it('options map the brand to Harmattan tokens', () => {
    const o = harmattanQuasarOptions();
    expect(o.config.brand.primary).toBe('#4591FF');
    expect(o.config.brand.negative).toBe('#DA201E');
    expect(o.iconSet.name).toBe('harmattan');
  });
});

describe('Quasar smoke mounts with the theme', () => {
  const global = { plugins: [quasarPlugin] };
  const cases: [string, any, Record<string, unknown>, (Record<string, unknown> | (() => any))?][] = [
    ['QBtn', Q.QBtn, { label: 'Go', color: 'primary' }],
    ['QAvatar', Q.QAvatar, { color: 'primary', textColor: 'white' }, { default: () => 'AV' }],
    ['QInput', Q.QInput, { modelValue: 'x', label: 'Name' }],
    ['QSelect', Q.QSelect, { modelValue: 'a', options: ['a', 'b'] }],
    ['QToggle', Q.QToggle, { modelValue: true, label: 'Wi-Fi' }],
    ['QCheckbox', Q.QCheckbox, { modelValue: true }],
    ['QSlider', Q.QSlider, { modelValue: 3, min: 0, max: 10 }],
    ['QList', Q.QList, {}, { default: () => h(Q.QItem, { clickable: true }, () => h(Q.QItemSection, () => 'Row')) }],
    ['QTabs', Q.QTabs, { modelValue: 'a' }, { default: () => [h(Q.QTab, { name: 'a', label: 'A' }), h(Q.QTab, { name: 'b', label: 'B' })] }],
    ['QCard', Q.QCard, {}, { default: () => h(Q.QCardSection, () => 'Hi') }],
    ['QDate', Q.QDate, { modelValue: '2026/10/24' }],
    ['QTable', Q.QTable, { rows: [{ a: 1 }], columns: [{ name: 'a', label: 'A', field: 'a' }], rowKey: 'a' }],
    ['QLinearProgress', Q.QLinearProgress, { value: 0.4 }],
    ['QBadge', Q.QBadge, { label: '3' }],
    ['HdQSpinnerSquircle', HdQSpinnerSquircle, { size: '40px' }],
  ];
  for (const [name, comp, props, slots] of cases) {
    it(name, () => {
      const w = mount(comp, { props, slots: slots as any, global });
      expect(w.html().length).toBeGreaterThan(10);
      w.unmount();
    });
  }
  it('QBtn gets Harmattan defaults (no-caps, unelevated) from the plugin', () => {
    const w = mount(Q.QBtn, { props: { label: 'Go' }, global });
    expect(w.classes()).toContain('q-btn--no-uppercase');
    expect(w.classes()).toContain('q-btn--unelevated');
  });
  it('plugin adds .hd-quasar to body', () => {
    mount({ render: () => h('div') }, { global: { plugins: [[Q.Quasar, harmattanQuasarOptions()], [HarmattanQuasar]] as any } });
    expect(document.body.classList.contains('hd-quasar')).toBe(true);
  });
});
