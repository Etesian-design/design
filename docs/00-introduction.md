# Etesian Design Language

Etesian is one calm, gesture-first interface for every screen: the **KDE Plasma desktop**, **phones running
LineageOS** and the **web**, with **S60** planned later. Its influence is the Nokia N9's Swipe UI, re-envisioned for how we use our screens today. It is not a copy of the N9.

You move by swiping from the edges, never hunting for a Home button. What's new waits in Events, not in a dozen
badges. Content fills the screen; controls step back until you need them.

This guide is the design language behind all three: its principles, tokens and the components they share.

Everything is open source on GitHub: [the design language](https://github.com/etesian-design/design) (this guide and
its components), [the phone](https://github.com/etesian-design/android_vendor_etesian),
[KDE Plasma](https://github.com/etesian-design/plasma) and [the website](https://github.com/etesian-design/website).
You can try Etesian in your browser at [etesian-design.com](https://etesian-design.com).

## Where each rule comes from

Every rule, token and component carries one of two labels:

| Label | Meaning |
| --- | --- |
| **N9** | Studied from the N9 itself: its `blanco` theme (`constants.ini`), Qt Quick Components for MeeGo (`com.nokia.meego`, `com.nokia.extras`, `UIConstants.js`, `*Style.qml`), or how the device behaved. |
| **EXT** | Etesian's own: designed here for what the N9 never had, in its spirit. |

In `tokens/tokens.json` every token has `"origin": "n9"` or `"origin": "ext"` and, where possible, a
`src` naming the original constant.

## What is in the box

- `tokens/tokens.json`: single source of tokens, generated to `src/styles/tokens.css` (CSS custom
  properties, `--hd-*`) and `src/tokens.ts` (TypeScript).
- `src/components`: 55 Vue 3 components (`Hd*`), themable via CSS variables, keyboard and screen-reader accessible.
- `src/shell`: the shell parts (the desktop, the phone parts, mini apps and the Belle widgets) that the website runs.
- `packages/`: the four published packages, `@etesian-design/tokens`, `vue`, `quasar` and `shell`.
- `brand/`: the Etesian logo (see [Colour](02-colour.md), Brand).
- `docs/*.md`: this guide. The same files are rendered in Storybook under **Guide**. Chapters:
  - [Principles](01-principles.md)
  - [Colour](02-colour.md)
  - [Typography](03-typography.md)
  - [Font alternatives (free look-alikes for Nokia Pure)](03b-font-alternatives.md)
  - [Spacing & sizing](04-spacing-sizing.md)
  - [Shape: the squircle](05-shape.md)
  - [Iconography](06-iconography.md)
  - [Icon lighting (top-lit emboss)](06b-icon-lighting.md)
  - [Motion](07-motion.md)
  - [Sound & haptics](08-sound-haptics.md)
  - [Layout & grids](09-layout.md)
  - [Components](10-components.md)
  - [Patterns](11-patterns.md)
  - [Accessibility (EXT unless noted)](12-accessibility.md)
  - [Contributing & gaps](13-contributing.md)
  - [Using with Quasar](14-quasar.md)
  - [Colour modes: Hybrid, Dark, Light](15-colour-modes.md)
  - [The desktop](21-desktop.md)
  - [The phone: reference for every form factor, read it first](20-phone.md)
  - [Home widgets (Belle style)](22-home-widgets.md)
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
npm run build            # the four @etesian-design packages -> packages/*/dist
npm test                 # vitest smoke tests
```

```ts
import { HdTheme, HdButton } from '@etesian-design/vue';
import '@etesian-design/vue/style.css';
```

```vue
<HdTheme theme="light" accent="#62B700">
  <HdButton variant="accent">Call</HdButton>
</HdTheme>
```
