# Using with Quasar

Most Etesian web work targets [Quasar 2](https://quasar.dev) (Vue 3). `@etesian-design/quasar`
styles **every built-in Quasar component** (all 123 entries of type "component" in Quasar's API,
see coverage below) plus the Notify, Dialog, Loading, LoadingBar and BottomSheet plugins.

## Install

```bash
npm i quasar @etesian-design/tokens @etesian-design/vue @etesian-design/quasar   # from GitHub Packages, see the README
```

```ts
// main.ts (Vite + @quasar/vite-plugin, or a Quasar CLI boot file)
import { createApp } from 'vue';
import { Quasar, Notify, Dialog, Loading, BottomSheet } from 'quasar';
import 'quasar/dist/quasar.css';               // or Quasar's SCSS build
import '@etesian-design/tokens/styles/tokens.css';  // the design tokens
import '@etesian-design/tokens/styles/base.css';    // base styles
import '@etesian-design/vue/style.css';            // the Hd* components
import '@etesian-design/quasar/theme.css';     // the Quasar theme (load last)
import { etesianQuasarOptions, EtesianQuasar } from '@etesian-design/quasar';

const app = createApp(App);
app.use(Quasar, etesianQuasarOptions({ plugins: { Notify, Dialog, Loading, BottomSheet } }));
app.use(EtesianQuasar);   // after Quasar
app.mount('#app');
```

Quasar CLI (`quasar.config.ts`):

```ts
framework: {
  plugins: ['Notify', 'Dialog', 'Loading', 'BottomSheet'],
  // iconSet/config come from etesianQuasarOptions(); in a boot file:
  //   import { boot } from 'quasar/wrappers'; import { EtesianQuasar } from '@etesian-design/quasar';
  //   export default boot(({ app }) => { app.use(EtesianQuasar); });
  config: { brand: { primary: '#4591FF', secondary: '#1C51AF', accent: '#09A7CC', positive: '#62B700',
    negative: '#DA201E', info: '#4591FF', warning: '#CC9900', dark: '#161616', 'dark-page': '#000000' },
    dark: 'auto' },
},
css: ['etesian.css'],  // src/css/etesian.css: @import '@etesian-design/vue/style.css'; @import '@etesian-design/quasar/theme.css';
```

## What the pieces do

| Piece | Purpose |
|---|---|
| `etesianQuasarOptions(extra)` | `iconSet` (Etesian line icons as inline SVG, no icon font), `config.brand` (Etesian colours), `dark: 'auto'`, Notify (top, 3000 ms), Loading/Notify spinner = N9 squircle ring |
| `EtesianQuasar` plugin | adds `.hd-quasar` to `<body>`, syncs `[data-hd-theme]` with Quasar Dark, patches default props (`etesianDefaultProps`: `no-caps`, `unelevated`, no ripple on buttons/tabs/chips, `outlined` fields, `flat` cards/date/time/stepper/uploader) |
| `theme.css` (`src/quasar/etesian-quasar.css`) | component overrides scoped to `.hd-quasar`; `--q-primary` etc. re-pointed to `--hd-*` so accents and light/dark follow the Etesian tokens |
| `variables.scss` | Quasar SCSS variables for SCSS builds (`$primary` ..., button radius, toolbar, tooltip, menu, no layout shadows) |
| `HdQSpinnerSquircle` | QSpinner-compatible N9 squircle spinner |
| `hdIcon(name)` | Quasar icon string for any Etesian icon: `<q-icon :name="hdIcon('phone')" />` |
| `quasarCoverage` | machine-readable map Quasar component -> theme selectors (tested) |

## Dark mode

Use Quasar's Dark plugin as usual (`$q.dark.set(true)` or `config.dark: 'auto'`). The plugin mirrors
it to `data-hd-theme="dark"` on `<html>`, which switches every `--hd-c-*` token; the theme only reads
those tokens, so you do not need `dark` props on individual components. A subtree can also be forced
with `<HdTheme theme="dark">` or `class="hd-theme-dark"`.

## Rules the theme enforces

- **Squircle (n = 2.8)** on every QAvatar, chip avatar, list thumbnail (`q-item__section--thumbnail`),
  QSkeleton type QAvatar, step dots, timeline dots, chat avatars, round/FAB buttons, uploader image
  thumbnails, pull-to-refresh puller, BottomSheet grid icons, Notify avatars. Masks, never border-radius.
- **Icon lighting**: coloured avatars (`color="..."`), FABs, BottomSheet icons and active step dots get the
  top-lit emboss (gradient overlay, top rim, glyph cast shadow; no outer shadow on Quasar avatars because the squircle mask sits on the root). `class="hd-flat"` on a
  QAvatar turns it off; `class="hd-lit"` forces it on avatars without a colour prop.
- **Flat**: no ripples, no elevation shadows (`shadow-*` classes are neutralised) except on overlays
  (menus, dialogs, notifications). Sentence case (no uppercase buttons/tabs).
- Light type (`--hd-font-family-light`, 300) for content, bold base font for buttons and section headers.

## Mapping: Etesian component <-> Quasar

| Etesian (`Hd*`) | Quasar |
|---|---|
| HdPageHeader | `QHeader` + `QToolbar` + `QToolbarTitle` (accent) or `QHeader class="hd-plain"` |
| HdToolBar (N9 bottom toolbar) | `QFooter` + `QToolbar` with `QBtn flat round :icon` |
| HdStatusBar | `QBar` |
| HdListItem (drill-down) | `QItem clickable` + `QItemSection avatar` + `QItemLabel`/`caption` + side chevron |
| HdSectionHeader | `QItemLabel header` |
| HdAvatar / HdThumbnail | `QAvatar` (squircle, lit) / `QItemSection thumbnail` |
| HdAppIcon | `QAvatar color=... :icon` (lit) or use `HdAppIcon` directly |
| HdButton | `QBtn` (default = white blanco button; `color="primary"` accent; `color="negative"` delete) |
| HdTabBar / HdTabButton | `QTabs` + `QTab` (segmented row), `QBtnToggle`; icon tabs inside `QFooter` |
| HdTextField / HdTextArea / HdSearchField | `QInput outlined` (`type="textarea"`, `#prepend` search icon) |
| HdCheckBox / HdRadioButton / HdSwitch | `QCheckbox` / `QRadio` / `QToggle` |
| HdSlider / HdProgressBar / HdBusyIndicator | `QSlider` / `QLinearProgress` / `HdQSpinnerSquircle` |
| HdSheet | `QDialog position="bottom"` with a `QCard` (bar: Cancel, title, Accept) |
| HdQueryDialog / HdDialog | `QDialog class="hd-query"` or `$q.dialog()` |
| HdMenu (N9 bottom menu) | `$q.bottomSheet()`; dropdown menus: `QMenu` (dark panel) |
| HdInfoBanner / HdToast | `$q.notify()` |
| HdNotificationBanner | `$q.notify({ position: 'top', avatar })` (closest) |
| swipe-to-delete | `QSlideItem right-color="negative"` |
| HdTable | `QTable flat` / `QMarkupTable flat` |
| HdCard | `QCard` + `QCardSection` + `QCardActions` |
| HdPagination / HdPageIndicator | `QPagination` / `QCarousel navigation` |
| HdTooltip | `QTooltip` |
| HdCountBubble | `QBadge` |

## Gaps

- **No Quasar equivalent**: HdAppGrid (use a CSS grid of `HdAppIcon`), HdTaskCard, HdLockScreenNotificationCard,
  HdEventsFeedItem (build with `QItem` + `QAvatar`), HdPageStack transitions (use Vue Router transitions).
- **Material-only components** with no N9 counterpart are themed to fit but are extrapolated (EXT): QFab,
  QKnob, QColor, QEditor, QParallax, QTimeline, QTree, QUploader, QRating, QSplitter.
- Quasar's own spinner variants (Audio, Ball, Gears, ...) keep their shapes; they take the accent colour. Prefer
  `HdQSpinnerSquircle`, which is the default for Loading and Notify.
- `etesianDefaultProps` only applies to globally registered components (Quasar CLI, `app.use(Quasar, { components })`
  or the Vite plugin's auto-import registers them per file: set the props yourself there).
- The generic lit overlay on Quasar avatars works on any background colour but has no hue shift; for exact N9 tiles use
  `litVars(accent)` from `etesian-design` in a `style` binding, or `HdAppIcon`.
