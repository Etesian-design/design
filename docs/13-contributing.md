# Contributing & gaps

## How to change things

1. Tokens: edit `tokens/tokens.json` only, keep `origin` (`n9` / `ext`) and `src`. Run `npm run tokens`.
2. Components: `src/components/Hd*.vue`. Use only `--hd-*` variables, provide stories in
   `src/stories`, keep a header comment stating what is N9 and what is EXT.
3. Docs: edit `docs/*.md`; Storybook renders them directly (`src/stories/guide/*.mdx` import the Markdown).
4. Shell parts (the desktop, phone parts, mini apps, widgets) live in `src/shell`; explorations not yet agreed stay in `src/stories`.
5. Verify: `npm test`, `npm run build` (the four packages), `npm run build-storybook`.
6. Release: push a `v*` tag; the Packages workflow publishes `@etesian-design/*` at that version.

To promote an EXT value to N9, cite the source (file + constant, or a photo/video of the device).

## Known gaps / open questions

- **Toolbar gradient, button graphics, field insets** are approximations sampled by eye; the N9 used
  bitmap graphics (`blanco/meegotouch/images`). Precise values are welcome.
- **Accent button contrast** (white on `#4591FF`, 3.1:1) is below AA for normal text.
- **Light-theme surfaces** (`--hd-c-surface`, raised) and all **dark-theme** secondary surfaces are EXT.
- **Page transition curves**: durations are known, exact curves of the compositor (mcompositor) are not.
- **Landscape** layouts are only partly covered (toolbar height).
- **Fira Sans** is close to Nokia Pure but not identical; its size and spacing are adjusted per font (Font alternatives).
- **Swipe gestures** live in the shells (the ROM launcher, the Plasma scripts, `src/shell` for the web), not in the components.
- **DatePicker**, RatingIndicator, EditBubble (copy/paste), Magnifier and ScrollDecorator are not yet implemented
  (TimePicker and the fast scroll are).
- **RTL**: components use logical-ish layout but are untested in RTL.
- **Charts / data viz** colours are not defined.
