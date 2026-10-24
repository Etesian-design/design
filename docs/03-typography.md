# Typography

## Typeface

**Reference: Nokia Pure Text** (N9), designed by Dalton Maag for Nokia, used in Light, Regular and
Bold, plus a tabular-figure "T" variant (`Nokia Pure Text T`). It is proprietary and **not shipped**.

**Open fallback stack (EXT):**

```css
--hd-font-family-base:  "Nokia Pure Text", "Nokia Pure", "Open Sans", "Source Sans 3",
                        "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--hd-font-family-light: "Nokia Pure Text Light", "Nokia Pure Text", "Open Sans", ...;
```

Open Sans (SIL OFL) is the closest freely available humanist sans with a true Light 300. Storybook
loads it from Google Fonts **in the preview only**; the library ships no font files.

**Bring your own Nokia Pure:** if you hold a licence, declare it with `@font-face` under the family
names `"Nokia Pure Text"` / `"Nokia Pure Text Light"` and the stack picks it up automatically.
Tabular figures: use `font-variant-numeric: tabular-nums` (replaces the "T" family).

## Type scale

N9 sizes are in device pixels (n9px, ~251 dpi). CSS px = n9px x 2/3 (see Spacing & sizing).

| Role | N9 | CSS | Token | Weight | Origin |
| --- | --- | --- | --- | --- | --- |
| Display / clock / hero | n/a | 48px (web hero: clamp 32-64px) | `xxlarge` | Light | EXT |
| XLarge (page header, dialog title) | 32 | 21px | `xlarge` | Light | N9 |
| Large (list title, menu item) | 28 | 19px | `large` | Light | N9 |
| Default (body, field text) | 24 | 16px | `default` | Light | N9 |
| Button | 22 bold | 15px | `button` | Bold | N9 |
| Page title (uppercase) | 24 bold uppercase | 16px | `.hd-page-title` | Bold | N9 |
| Small (subtitle, labels) | 20 | 13px | `small` | Regular | N9 |
| XSmall (section header, meta) | 18 | 12px | `xsmall` | Bold/Regular | N9 |
| XXSmall | 16 | 12px (floored from 11) | `xxsmall` | Regular | EXT |

On the web (EXT), body copy longer than two lines uses `default` with `line-height: 1.55`
(`--hd-font-line-height-prose`), max 68ch (`--hd-container-prose`). Headings h1-h3 map to
xxlarge/xlarge/large, all Light. Never use bold for headings larger than `large`; the N9 look comes
from big *light* type.

## Rules

- (N9) Light is default. Regular for secondary text on small sizes; Bold only for buttons, section
  headers, page titles and counts.
- (N9) Sentence case everywhere except the bold uppercase page title style.
- (N9) Numbers that update (clock, counters, progress) use tabular figures.
- (EXT) Minimum text size on the web is 12px; minimum for body copy is 16px.
