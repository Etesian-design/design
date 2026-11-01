/**
 * Renders a guide chapter (docs/*.md) in Storybook, with three additions over the plain Markdown block:
 * - every colour (#RGB, #RRGGBB, #RRGGBBAA, rgb()/rgba()) gets a swatch beside its code, in text and in tables;
 * - links between chapters (e.g. "20-phone.md") open that chapter's Storybook page;
 * - the provenance labels "(N9)" and "(EXT)" show as small badges.
 * Plain JavaScript (React.createElement) so the Vue type check does not need JSX settings.
 *   <Doc md={md} />
 */
import React from 'react';
import { Markdown, CodeOrSourceMdx } from '@storybook/addon-docs/blocks';

/** docs/*.md → its Storybook page */
const PAGES = {
  '00-introduction.md': 'guide-introduction', '01-principles.md': 'guide-principles', '02-colour.md': 'guide-colour',
  '03-typography.md': 'guide-typography', '03b-font-alternatives.md': 'guide-font-alternatives', '04-spacing-sizing.md': 'guide-spacing-sizing',
  '05-shape.md': 'guide-shape-squircle', '06-iconography.md': 'guide-iconography', '06b-icon-lighting.md': 'guide-icon-lighting',
  '07-motion.md': 'guide-motion', '08-sound-haptics.md': 'guide-sound-haptics', '09-layout.md': 'guide-layout-grids',
  '10-components.md': 'guide-components', '11-patterns.md': 'guide-patterns', '12-accessibility.md': 'guide-accessibility',
  '13-contributing.md': 'guide-contributing-gaps', '14-quasar.md': 'quasar-using-with-quasar', '15-colour-modes.md': 'guide-colour-modes',
  '20-phone.md': 'guide-the-phone', '21-desktop.md': 'guide-the-desktop', '22-home-widgets.md': 'guide-home-widgets',
};

const COLOUR = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b|rgba?\([^)]*\)/g;
const isColour = (s) => { COLOUR.lastIndex = 0; const m = s.trim().match(COLOUR); return !!m && m.join('') === s.trim(); };

/** outside code: bare colours become inline code (so they get a swatch), "(N9)" / "(EXT)" become badges */
function prepare(md) {
  return md.split(/(```[\s\S]*?```|`[^`\n]*`)/g).map((part, i) => {
    if (i % 2) return part;
    return part
      .replace(/(^|[^\w`&#/])(#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3}))(?![\w-])/g, (_, a, c) => `${a}\`${c}\``)
      .replace(/\b(rgba?\([0-9.,%\s/]+\))/g, '`$1`')
      .replace(/\((N9|EXT|N9 \+ EXT|N9\/canon|canon|N9 \(canon\))\)/g, (_, l) => `<span class="hd-prov hd-prov--${l.startsWith('EXT') ? 'ext' : 'n9'}">${l}</span>`);
  }).join('');
}

const chip = (c, k) => React.createElement('span', { key: k, className: 'hd-swatch', style: { background: c }, 'aria-hidden': true });

/** inline code: a swatch before each colour it names (a single colour, or a few, as in "#3A3A3A → #141414") */
function Code(props) {
  const text = typeof props.children === 'string' ? props.children : Array.isArray(props.children) ? props.children.join('') : '';
  const colours = (text.length <= 64 && !props.className) ? (text.match(COLOUR) || []) : [];
  if (!colours.length || (!isColour(text) && !/^[#rgba(),.\d\s%a-fA-F→>\-/]+$/.test(text))) return React.createElement(CodeOrSourceMdx, props);
  return React.createElement('span', { className: 'hd-colour' }, colours.map(chip), React.createElement(CodeOrSourceMdx, props));
}

/** links to another chapter open its Storybook page */
function Link({ href = '', children, ...rest }) {
  const m = href.match(/^(?:\.\/)?([\w-]+\.md)(#.*)?$/);
  if (m && PAGES[m[1]]) return React.createElement('a', { ...rest, href: `./?path=/docs/${PAGES[m[1]]}--docs`, target: '_top' }, children);
  return React.createElement('a', { ...rest, href, ...(/^https?:/.test(href) ? { target: '_blank', rel: 'noopener' } : {}) }, children);
}

export function Doc({ md }) {
  return React.createElement(Markdown, { options: { overrides: { code: { component: Code }, a: { component: Link } } } }, prepare(md));
}
