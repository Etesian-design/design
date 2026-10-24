import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { readFileSync } from 'node:fs';
import * as Hd from '../src';
import { FONT_ALTERNATIVES, fontVars } from '../src/fonts';

const t = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'));
const css = readFileSync('src/styles/tokens.css', 'utf8');
const modes = ['hybrid', 'dark', 'light'] as const;
const surfaces = ['page', 'card', 'field', 'chrome', 'overlay', 'scrim', 'home', 'banner', 'media'];

const block = (selStart: string) => { const i = css.indexOf(selStart); return css.slice(i, css.indexOf('\n}', i)); };
const blocks = { hybrid: block(':root, [data-hd-mode="hybrid"]'), dark: block('[data-hd-mode="dark"]'), light: block('[data-hd-mode="light"]') };

describe('colour modes', () => {
  it('tokens.json defines the same semantic surfaces for all three modes', () => {
    for (const m of modes) expect(Object.keys(t.mode[m]).sort(), m).toEqual([...surfaces].sort());
    for (const m of modes) for (const s of surfaces) expect(['light', 'dark']).toContain(t.mode[m][s].scheme);
  });
  for (const m of modes) {
    it(`${m}: every semantic token and the page palette is emitted`, () => {
      const b = blocks[m];
      for (const s of surfaces) for (const suf of ['', '-fg', '-fg-secondary', '-scheme']) expect(b, `${m} --hd-surface-${s}${suf}`).toContain(`--hd-surface-${s}${suf}:`);
      for (const k of Object.keys(t.theme.light)) expect(b, `${m} --hd-c-${k}`).toContain(`--hd-c-${k}:`);
    });
  }
  it('hybrid is never flattened into light: chrome, overlay, home, banner, media are dark; page is light', () => {
    for (const s of ['chrome', 'overlay', 'home', 'banner', 'media']) expect(t.mode.hybrid[s].scheme, s).toBe('dark');
    expect(t.mode.hybrid.page.scheme).toBe('light');
    for (const s of surfaces) expect(t.mode.dark[s].scheme, `dark ${s}`).toBe('dark');
    for (const s of surfaces) if (s !== 'scrim') expect(t.mode.light[s].scheme, `light ${s}`).toBe('light');
  });
  it('auto follows prefers-color-scheme', () => {
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\)\s*{\s*\[data-hd-mode="auto"\]/);
  });
  it('chrome/overlay components consume semantic surface tokens', () => {
    for (const f of ['HdMenu', 'HdDialog', 'HdInfoBanner', 'HdToast', 'HdNotificationBanner', 'HdTooltip', 'HdStatusBar']) {
      const src = readFileSync(`src/components/${f}.vue`, 'utf8');
      expect(src, f).toMatch(/var\(--hd-surface-(chrome|overlay|scrim|banner|home)\)/);
      expect(src, f).toMatch(/hd-on-(chrome|overlay|banner|home)/);
    }
  });
  it('measured phone surfaces keep their ROM values in every mode: light toolbar, lock cards', () => {
    const tb = readFileSync('src/components/HdToolBar.vue', 'utf8');
    expect(tb).toContain('#D6D6D8, #ADADB0');
    expect(tb).toContain("variant: 'light'");
    expect(readFileSync('src/components/HdLockScreenNotificationCard.vue', 'utf8')).toContain('rgba(12, 15, 18, .70)');
  });
  it('HdTheme sets data-hd-mode, legacy theme maps light->hybrid', () => {
    expect(mount(Hd.HdTheme, { props: { mode: 'light' } }).attributes('data-hd-mode')).toBe('light');
    expect(mount(Hd.HdTheme, { props: { theme: 'light' } }).attributes('data-hd-mode')).toBe('hybrid');
    expect(mount(Hd.HdTheme).attributes('data-hd-mode')).toBe('hybrid');
  });
});

describe('font alternatives', () => {
  it('every look-alike has licence, source, package and metric adjustments', () => {
    expect(FONT_ALTERNATIVES.length).toBeGreaterThanOrEqual(8);
    for (const f of FONT_ALTERNATIVES) {
      expect(f.sizeAdjust).toMatch(/^\d+(\.\d+)?%$/);
      expect(f.letterSpacing).toMatch(/^-?\d+(\.\d+)?em$/);
      if (f.key === 'nokia-pure') { expect(f.package).toBeNull(); continue; }
      expect(f.licence).toMatch(/OFL-1\.1|Ubuntu Font Licence 1\.0|Apache-2\.0/);
      expect(f.source).toMatch(/^https:\/\//);
      expect(f.package).toBe(`@fontsource/${f.key}`);
    }
  });
  it('never bundles Nokia Pure files; aliases exist for every free font', () => {
    const css = readFileSync('src/styles/font-alternatives.css', 'utf8');
    expect(css).not.toMatch(/url\([^)]*nokia/i);
    for (const f of FONT_ALTERNATIVES.filter((x) => x.key !== 'nokia-pure')) expect(css).toContain(`font-family: "${f.alias}"`);
    expect(fontVars('fira-sans')['--hd-font-family-base']).toContain('"HD Fira Sans"');
    expect(fontVars(undefined)).toEqual({});
  });
});
