# Colour

## Base palette (N9)

Source: `/usr/share/themes/blanco/meegotouch/constants.ini`.

| Token | Value | Use | Origin |
| --- | --- | --- | --- |
| `--hd-color-palette-foreground` | `#282828` | Primary text (light theme) | N9 |
| `--hd-color-palette-secondary-foreground` | `#505050` | Secondary text | N9 |
| `--hd-color-palette-background` | `#E0E1E2` | Page background, light theme | N9 |
| `--hd-color-palette-inverted-foreground` | `#FFFFFF` | Text on black | N9 |
| `--hd-color-palette-inverted-secondary-foreground` | `#C8C8C8` | Secondary on black | N9 |
| `--hd-color-palette-inverted-background` | `#000000` | Dark theme bg | N9 |
| `--hd-color-palette-button-secondary-foreground` | `#8C8C8C` | Pressed button label | N9 |
| `--hd-color-palette-button-disabled-foreground` | `#B2B2B4` | Disabled label | N9 |
| `--hd-color-palette-select` | `#A1BFFF` | Text selection | N9 |
| `--hd-color-palette-warning` | `#DA201E` | Errors, destructive | N9 |
| `--hd-color-palette-attention` | `#CC9900` | Caution | N9 |
| `--hd-color-palette-notification` | `#7FB133` | Success / positive | N9 |
| `--hd-color-palette-link` | `#1080DD` | Links | N9 |
| `--hd-color-palette-link-active` | `#1C51AF` | Pressed link | N9 |

Note: Qt Components' `UIConstants.js` uses slightly different values (`#191919` foreground,
`#a6a8ab` secondary). Etesian follows the system theme (`constants.ini`) because it is what native apps showed.

## Brand: the Etesian logo (EXT)

Wind blowing right to left, its curls drawing a lower-case *e*, on the N9 squircle. Files in `brand/`, made by
`scripts/logo.mjs`; the wordmark is Fira Sans Light.

| Version | Use | Tile | Strokes |
| --- | --- | --- | --- |
| Deep blue (`etesian-deep.svg`) | the main logo: light backgrounds, the favicon, the GitHub organisation | `#2C6FD9` → `#0F3B8C` | `#FFFFFF` → `#D7ECFF`, `#9FD4FF` → `#6FB8F5` |
| Pearl (`etesian-pearl.svg`) | dark backgrounds and dark mode | `#FFFFFF` → `#E3EAF3` | `#2584D8` → `#145FB0`, `#7FD0F2` → `#4FB4E6` |

Both carry two leaves, `#9BD12E` → `#5E9418`. At 32 px and below use the simplified favicon
(`etesian-favicon.svg`: three thicker strokes, no leaves); for round crops use `etesian-avatar.svg`, which fills the square.

## Accent colours (N9)

`COLOR_ACCENT1..19`. One per application. `--hd-accent` is the active accent (defaults to ACCENT1).
Set it on any ancestor (`<HdTheme accent="#62B700">` or `style="--hd-accent: ..."`).

| Name | Hex | | Name | Hex |
| --- | --- | --- | --- | --- |
| default | `#4591FF` | | photos | `#821DDE` |
| phone | `#62B700` | | videos | `#870CBA` |
| maps | `#3D890C` | | music | `#CC09BA` |
| drive | `#347708` | | music-store | `#E800A1` |
| journeys | `#306600` | | calendar | `#EF5500` |
| conversations | `#09A7CC` | | documents | `#EA650A` |
| contacts | `#007DC9` | | clock | `#F77219` |
| email | `#0067BC` | | feeds | `#FF8500` |
| store | `#1C51AF` | | calculator | `#ED9507` |
| | | | notes | `#F2B111` |

## Themes

The full picture, with the three colour modes (Hybrid, Dark, Light) and every surface, is in
[Colour modes](15-colour-modes.md). The basics: components never use palette tokens for surfaces directly; they use **semantic theme tokens**
`--hd-c-*`, redefined by theme scope.

| Semantic token | Light / "blanco" | Dark / "inverted" | Origin |
| --- | --- | --- | --- |
| `--hd-c-bg` | `#E0E1E2` | `#000000` | N9 |
| `--hd-c-fg` | `#282828` | `#FFFFFF` | N9 |
| `--hd-c-fg-secondary` | `#505050` | `#C8C8C8` | N9 |
| `--hd-c-fg-disabled` | `#B2B2B4` | `#6E6E70` | N9 / EXT |
| `--hd-c-surface` | `#FFFFFF` | `#161616` | EXT |
| `--hd-c-surface-raised` | `#F2F3F4` | `#222222` | EXT |
| `--hd-c-divider` | 12% black | 16% white | EXT |
| `--hd-c-button-bg` | `#FFFFFF` | `#2A2A2A` | EXT |
| `--hd-c-link` / `--hd-c-accent-text` | `#1C51AF` | `#5AA2FF` / `#7FB0FF` | EXT |
| `--hd-c-focus` | `#1C51AF` | `#7FB0FF` | EXT |
| `--hd-c-toolbar-from/to` | `#3A3A3A -> #141414` | `#2A2A2A -> #000` | EXT (sampled by eye) |

Apply a theme with a class or attribute on any element: `.hd-theme-light`, `.hd-theme-dark`
(alias `.hd-inverted`), `[data-hd-theme="auto"]` (follows `prefers-color-scheme`). Themes nest:
the N9 toolbar, dialogs and menus are always inverted even inside a light page.

## Rules

- (N9) Exactly one accent per screen. Warning red is the only other strong colour.
- (N9) An app's main page header takes the app's own colour, set per app (not sampled from its icon); its sub
  pages have a plain header.
- (N9) Dialogs, menus, the toolbar, status bar and lock screen are always black/inverted.
- (EXT) **Accent as text**: `#4591FF` on `#E0E1E2` is only 2.4:1. For text and links use
  `--hd-c-accent-text` / `--hd-c-link` (AA). Accent fills with white bold text (buttons) reach ~3.1:1;
  acceptable for large/bold labels per WCAG "large text" only if >= 18.66px bold, so Etesian accent buttons
  are documented as a known contrast gap; pick a darker accent for text-heavy fills.
- (EXT) Never encode meaning with colour alone; pair warning red with an icon or text.
