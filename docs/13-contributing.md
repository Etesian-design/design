# Contributing & gaps

## How to change things

1. Tokens: edit `tokens/tokens.json` only, keep `origin` (`n9` / `ext`) and `src`. Run `npm run tokens`.
2. Components: `src/components/Hd*.vue`. Use only `--hd-*` variables, provide stories in
   `src/stories`, keep a header comment stating what is N9 and what is EXT.
3. Docs: edit `docs/*.md`; Storybook renders them directly (`src/stories/guide/*.mdx` import the Markdown).
4. Verify: `npm test`, `npm run build`, `npm run build-storybook`.

To promote an EXT value to N9, cite the source (file + constant, or a photo/video of the device).

## Known gaps / open questions

- **Toolbar gradient, button graphics, field insets** are approximations sampled by eye; the N9 used
  bitmap graphics (`blanco/meegotouch/images`). Precise values are welcome.
- **Accent button contrast** (white on `#4591FF`, 3.1:1) is below AA for normal text.
- **Light-theme surfaces** (`--hd-c-surface`, raised) and all **dark-theme** secondary surfaces are EXT.
- **Page transition curves**: durations are known, exact curves of the compositor (mcompositor) are not.
- **Landscape** layouts are only partly covered (toolbar height).
- **Font fallback** metrics differ from Nokia Pure (Open Sans is wider); line-heights may need tuning.
- **Swipe gestures** are documented but not implemented as components (they belong to the window manager / app shell).
- **Tumbler / DatePicker / TimePicker**, RatingIndicator, EditBubble (copy/paste), Magnifier,
  SectionScroller and ScrollDecorator are not yet implemented.
- **RTL**: components use logical-ish layout but are untested in RTL.
- **Charts / data viz** colours are not defined.
