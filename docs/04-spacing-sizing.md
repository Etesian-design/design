# Spacing & sizing

## From millimetres to CSS pixels

The N9 theme specifies sizes in **millimetres** (e.g. `SIZE_LIST = 8.0mm`) and Qt Components hard-code
the same values in device pixels (`LIST_ITEM_HEIGHT_DEFAULT = 80`). The theme engine used
**1 mm = 10 n9px** (0.2mm -> 2, 1.6mm -> 16, 6.4mm -> 64, 8mm -> 80). The physical panel is 854 x 480 at
~251 dpi (9.9 px/mm), so the mapping is essentially physical.

The CSS reference pixel is 1/96 inch. A browser on the N9 would report devicePixelRatio = 1.5,
i.e. a **569 x 320 CSS px** viewport. HDL therefore converts:

> **CSS px = n9px x 2/3** (rounded), equivalently **1 mm (N9 theme) = 6.67 CSS px**.

This keeps the N9's physical proportions on a modern phone: default text 24 n9px -> 16 CSS px, a
list item 80 -> 53 px, the toolbar 72 -> 48 px. Where the result would fall below web accessibility
minimums the value is raised and marked EXT (buttons 40px, touch targets 44px, text >= 12px).
`tokens.json` keeps the original `n9px` alongside each converted value.

## Spacing scale

| Token | mm (N9) | n9px | CSS | Use |
| --- | --- | --- | --- | --- |
| `--hd-space-xsmall` | 0.2 | 2 | 1px | hairline offsets |
| `--hd-space-small` | 0.4 | 4 | 3px | icon-to-text in tight places |
| `--hd-space-medium` | 0.6 | 6 | 4px | BUTTON_SPACING; label-field |
| `--hd-space-large` | 0.8 | 8 | 5px | |
| `--hd-space-double` | 1.2 | 12 | 8px | stacked dialog buttons |
| `--hd-space-xlarge` | 1.6 | 16 | 11px | **default margin / list indent** |
| `--hd-space-xxlarge` | 2.4 | 24 | 16px | card padding, dialog gaps |
| `--hd-space-page` (EXT) | | | 16px | web page gutter (mobile) |
| `--hd-space-block` (EXT) | | | 32px | between blocks on web |
| `--hd-space-section` (EXT) | | | 48px | between page sections on web |

Margins and paddings share one scale on the N9 (`MARGIN_*` = `PADDING_*`).

## Component sizes

| Token | N9 | CSS | Origin |
| --- | --- | --- | --- |
| status bar | 36 | 24px | N9 |
| toolbar (portrait / landscape) | 72 / 56 | 48 / 37px | N9 |
| page header | 72 | 48px | N9 |
| list item / small | 80 / 64 | 53 / 43px | N9 |
| button height | 51 (graphic) / 64 (6.4mm slot) | 40px | EXT (raised) |
| button width (dialogs) | 322 | 215px | N9 |
| text field | 52 | 40px | EXT (raised) |
| thumbnail | 64 | 43px | N9 |
| app icon | 80 | 54px | N9 |
| icons xlarge/large/default/small/xsmall | 64/48/32/24/18 | 43/32/21/16/12 | N9 |
| checkbox | 42 | 28px | N9 |
| spinner small/default/large | 24/32/96 | 16/21/64 | N9 |
| touch target minimum | (N9: RELEASE_MISS_DELTA 30, TOUCH_EXPANSION_MARGIN 12) | 44px | EXT |

## Radii (EXT)

The N9 drew controls with bitmap graphics with small rounded corners; HDL uses `--hd-radius-control`
6px and `--hd-radius-card` 8px. Pills (`999px`) for count bubbles and switch tracks are N9. Squircles
are not radii: see Shape.
