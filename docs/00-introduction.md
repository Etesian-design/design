# Harmattan Design Language

The Harmattan Design Language (HDL) documents the visual and interaction language of the Nokia N9
(MeeGo 1.2 "Harmattan", 2011) and extends it to **operating-system UIs** and **websites**, with a
ready-to-use Vue 3 component library.

The N9 was designed for one 854 x 480 portrait/landscape touch screen with no hardware buttons
except power and volume. Everything beyond that (desktop widths, hover, keyboard focus, forms on the
web, data tables, dark-mode switching, WCAG accessibility) is **extrapolated** in the spirit of the original.

## Provenance labels

Every rule, token and component in this guide carries one of two labels:

| Label | Meaning |
| --- | --- |
| **N9** | N9-original. Taken from the device's `blanco` theme (`constants.ini`), Qt Quick Components for MeeGo (`com.nokia.meego`, `com.nokia.extras`, `UIConstants.js`, `*Style.qml`), or the shipped UX behaviour (treated as canon). |
| **EXT** | Extrapolated. Not present on the N9; designed here to fill a gap. Open to improvement. |

In `tokens/tokens.json` every token has `"origin": "n9"` or `"origin": "ext"` and, where possible, a
`src` naming the original constant.

## What is in the box

- `tokens/tokens.json`: single source of tokens, generated to `src/styles/tokens.css` (CSS custom
  properties, `--hd-*`) and `src/tokens.ts` (TypeScript).
- `src/components`: 48 Vue 3 SFCs (`Hd*`), themable via CSS variables, keyboard and screen-reader accessible.
- `docs/*.md`: this guide. The same files are rendered in Storybook under **Guide**.
- Storybook: `npm run storybook`.

## Legal

No Nokia files are included or redistributed: no Nokia Pure fonts, icons, wallpapers, sounds or
theme graphics. Colour values, sizes and behaviours are facts documented for interoperability and
reference. Icons are original drawings (MIT). "Nokia", "N9" and "Nokia Pure" are trademarks of their
owners; this project is unaffiliated.

## Quick start

```bash
npm install
npm run storybook        # browse the guide and components at http://localhost:6006
npm run build            # library build -> dist/
npm test                 # vitest smoke tests
```

```ts
import { HdTheme, HdButton } from 'harmattan-design';
import 'harmattan-design/style.css';
```

```vue
<HdTheme theme="light" accent="#62B700">
  <HdButton variant="accent">Call</HdButton>
</HdTheme>
```
