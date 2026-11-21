import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { APP_ART, APP_ART_NAMES, ART_ACCENTS, appArtFragment } from '../src/components/app-art';
import { APPS } from '../src/shell/parts/data';
import HdAppIcon from '../src/components/HdAppIcon.vue';

const paint = { ink: 'url(#i)', cut: '#123456', ...ART_ACCENTS };

// 2026-11-21: app icons were a line glyph on a tile; they are now drawings (app-art.ts), shared by the web shell and Plasma.
describe('app art', () => {
  it.each(APP_ART_NAMES)('%s draws, with a shadow pass and no broken numbers', (n) => {
    const f = appArtFragment(n, paint);
    expect(f).toContain('opacity=".22"');
    expect(f).not.toMatch(/NaN|undefined|Infinity/);
    expect(f.match(/<g /g)!.length).toBeGreaterThanOrEqual(2);
  });
  it('the shadow pass is all black (no accent shows through it)', () => {
    for (const n of APP_ART_NAMES) {
      const shadow = appArtFragment(n, paint).split('</g><g ')[0]!;
      expect(shadow).not.toMatch(/#D9001E|#EFBB00|#62B700|#0093D0|url\(#i\)|#123456/);
    }
  });
  it('every phone app has a drawing that exists', () => {
    for (const a of APPS) expect(APP_ART[a.art!], a.name).toBeTypeOf('function');
  });
  it('HdAppIcon draws the art when it has one, the glyph otherwise', () => {
    const w = mount(HdAppIcon, { props: { label: 'Mail', icon: 'mail', art: 'mail', color: '#0067BC' } });
    expect(w.find('.hd-app-art').exists()).toBe(true);
    expect(w.find('.hd-icon').exists()).toBe(false);
    const g = mount(HdAppIcon, { props: { label: 'X', icon: 'mail', art: 'no-such-art', color: '#0067BC' } });
    expect(g.find('.hd-app-art').exists()).toBe(false);
    expect(g.find('.hd-icon').exists()).toBe(true);
  });
  it('cut-outs take the tile\'s own dark colour, not a fixed one', () => {
    const w = mount(HdAppIcon, { props: { label: 'Mail', icon: 'mail', art: 'mail', color: '#0067BC' } });
    const html = w.html();
    expect(html).not.toContain('#123456');
    expect(html).toMatch(/stroke="(#|rgb|hsl)/);
  });
});
