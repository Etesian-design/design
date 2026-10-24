import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { readFileSync } from 'node:fs';
import * as Hd from '../src/index';
import { SQUIRCLE_EXPONENT, SQUIRCLE_PATH_100, squirclePath } from '../src/squircle';

describe('N9 squircle exponent', () => {
  it('default exponent is 2.8 (measured from N9 icons)', () => {
    expect(SQUIRCLE_EXPONENT).toBe(2.8);
    expect(squirclePath()).toBe(squirclePath(100, 2.8));
    // 45-degree point of n=2.8 is ~ 50 + 50 * 2^(-1/2.8) = 89.04
    expect(SQUIRCLE_PATH_100).toContain('89.04 89.04');
  });
  it('CSS mask uses the same n=2.8 path', () => {
    const css = readFileSync('src/styles/base.css', 'utf8');
    expect(css).toContain(SQUIRCLE_PATH_100);
  });
});

const cases: [string, any, Record<string, unknown>, string][] = [
  ['HdAppIcon', Hd.HdAppIcon, { label: 'A', icon: 'phone' }, '.hd-app-icon__shape > .hd-squircle'],
  ['HdAvatar', Hd.HdAvatar, { name: 'Ada L' }, '.hd-squircle'],
  ['HdThumbnail', Hd.HdThumbnail, {}, '.hd-squircle'],
  ['HdLockScreenNotificationCard', Hd.HdLockScreenNotificationCard, { message: 'm', source: 's', time: 't' }, '.hd-squircle'],
  ['HdListItem', Hd.HdListItem, { title: 'T', thumbnailIcon: 'photo' }, '.hd-squircle'],
  ['HdEventsFeedItem', Hd.HdEventsFeedItem, { title: 'T', time: 'now' }, '.hd-squircle'],
  ['HdNotificationBanner', Hd.HdNotificationBanner, { open: true, title: 'Hi', icon: 'message' }, '.hd-squircle'],
];

describe('thumb-sized elements are squircle-masked, never border-radius', () => {
  for (const [name, comp, props, sel] of cases) {
    it(name, () => {
      const w = mount(comp, { props, attachTo: document.body });
      const el = document.body.querySelector(sel) as HTMLElement | null;
      expect(el, `${name} has no .hd-squircle`).not.toBeNull();
      expect(el!.style.borderRadius).toBe('');
      expect(el!.getAttribute('style') ?? '').not.toMatch(/border-radius/);
      w.unmount();
    });
  }
  it('.hd-squircle CSS sets mask-image, size 100% and no-repeat (both prefixes)', () => {
    const css = readFileSync('src/styles/base.css', 'utf8');
    const rule = css.slice(css.indexOf('.hd-squircle {'), css.indexOf('}', css.indexOf('.hd-squircle {')));
    for (const d of ['-webkit-mask-image', 'mask-image', '-webkit-mask-size: 100% 100%', 'mask-size: 100% 100%', '-webkit-mask-repeat: no-repeat', 'mask-repeat: no-repeat']) expect(rule).toContain(d);
    expect(rule).not.toContain('border-radius');
  });
});
