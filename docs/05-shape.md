# Shape: the squircle

**Rule (canon):** every thumb-sized shape (app icons, avatars, contact photos, thumbnails, file
icons and the busy/loading ring) is a **superellipse squircle**:

```
|x|^2.8 + |y|^2.8 = 1
```

**n = 2.8**, measured by alpha-coverage fit of 108 stock N9 icons (fits ranged 2.74-2.82).
The sides bulge visibly; there is no flat straight edge with a small corner arc.

**n = 4 or 5 is wrong**: at those exponents the superellipse has long flat sides and tight corners
and reads as a rounded square, which is exactly what the N9 does not look like. (An earlier version
of this library used n = 4; that was a bug.)

Not a circle. Not a rounded rectangle (whose corners have a sudden curvature change; the N9 squircle's
curvature changes continuously and its sides bulge outward).

## Implementation

- `src/squircle.ts`: `squirclePath(size, n = SQUIRCLE_EXPONENT (2.8), samples, inset)` returns an SVG path;
  `SQUIRCLE_PATH_100` is a pre-computed 100 x 100 path; `SQUIRCLE_MASK` a CSS `mask-image` value.
- CSS: add class `.hd-squircle` to any element (uses `--hd-squircle-mask`).
- Components: `HdSquircle` (base), `HdAvatar`, `HdAppIcon`, `HdThumbnail`, `HdBusyIndicator variant="squircle"`,
  plus list thumbnails, events-feed items, lock-screen card icons and notification/info banner icons.
- Always a CSS mask (`mask-image` + `-webkit-mask-image`, `mask-size: 100% 100%`, `mask-repeat: no-repeat`), never
  `border-radius`. Do not wrap a squircle in an element with `border-radius` + `overflow: hidden`.

```vue
<HdSquircle :size="64" src="/photo.jpg" alt="Anna" />
<img class="hd-squircle" src="/photo.jpg" alt="" width="64" height="64" />
```

## What is NOT a squircle

- Controls: radio buttons are round (N9), checkboxes have small radii, switch tracks are pills. **N9**: text fields (and
  search fields) have squircle ends: a squircle as tall as the field, cut in half and pulled apart, joined by straight
  lines (blanco `meegotouch-textedit-background`, the same n = 2.8 curve as the icons). Taller fields keep those corners.
  CSS: `.hd-sqf`.
- Large surfaces: cards, sheets, banners use `--hd-radius-card` (EXT) or are square-edged (N9 pages).
- Task cards (open applications) are screen-shaped rectangles with tiny radii (N9).

## Squircle controls and highlights

Icon-only buttons (ToolIcon, icon-only Button, TaskCard close, field clear, pagination) and the selected /
hover highlight behind toolbar and tab icons are squircles too. Use `.hd-sq` (base.css): the element keeps
its rectangular hit area, `::before` draws `--hd-sq-fill` and `::after` the border / focus ring
(`--hd-sq-ring`), both clipped to the n = 2.8 squircle, sized `--hd-sq-size` (capped at the element height).
The Quasar theme does the same for flat round `q-btn` focus helpers and toolbar `q-tab` highlights.
