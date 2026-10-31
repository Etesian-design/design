import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(`${process.cwd()}/${p}`, 'utf8');

// 2026-10-25, from the N9 (n9-music-*.png, n9-grid-edit.png).
describe('bottom bar buttons keep the N9 padding inside the 72 n9px bar', () => {
  it('Back is 51x49 n9px (34x33), not the full bar height', () => {
    const css = read('src/components/HdToolBar.vue');
    expect(css).toMatch(/\.hd-toolbar__back \{[^}]*width: 34px; height: 33px;[^}]*--hd-sq-size: 33px;/);
    expect(read('src/quasar/etesian-quasar.css')).toMatch(/\.q-btn\.hd-q-back \{ width: 34px; height: 33px;/);
  });
  it('edit bar buttons are 180x41 n9px (120x27.5), centred', () => {
    expect(read('src/components/HdTaskEditBar.vue')).toContain('<HdButton variant="dark" size="bar"'); expect(read('src/components/HdButton.vue')).toMatch(/\.hd-button--bar \{ --hd-btn-h: 27\.5px; height: 27\.5px; min-height: 0; width: 120px;/);
  });
});

describe('content is shown as it is', () => {
  const ex = read('src/stories/quasar/Examples.stories.ts');
  const music = ex.slice(ex.indexOf('/* ---- Music'), ex.indexOf('/* ---- Calendar'));
  it('album art is never squircled', () => expect(music).not.toContain('hd-q-sqart'));
  it('albums without art get the generated cover', () => {
    expect(music).toContain('const genArt');
    expect(music).toMatch(/genArt\('Unknown album', '#8E10C4'/);
  });
  it('gallery photos are not squircled', () => expect(ex).not.toMatch(/v-for="\(t, i\) in tints"[^>]*hd-q-sqart/));
});
