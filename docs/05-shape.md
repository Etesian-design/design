# Shape: the squircle

**Rule (canon):** every thumb-sized shape (app icons, avatars, contact photos, thumbnails, file
icons and the busy/loading ring) is a **superellipse squircle**:

```
|x|^4 + |y|^4 = 1
```

Not a circle. Not a rounded rectangle (whose corners have a sudden curvature change; the squircle's
curvature changes continuously and the sides are flatter).

## Implementation

- `src/squircle.ts`: `squirclePath(size, n = 4, samples, inset)` returns an SVG path;
  `SQUIRCLE_PATH_100` is a pre-computed 100 x 100 path; `SQUIRCLE_MASK` a CSS `mask-image` value.
- CSS: add class `.hd-squircle` to any element (uses `--hd-squircle-mask`).
- Components: `HdSquircle` (base), `HdAvatar`, `HdAppIcon`, `HdThumbnail`, `HdBusyIndicator variant="squircle"`,
  plus the notification/event/lock-screen tiles.

```vue
<HdSquircle :size="64" src="/photo.jpg" alt="Anna" />
<img class="hd-squircle" src="/photo.jpg" alt="" width="64" height="64" />
```

## What is NOT a squircle

- Controls: radio buttons are round (N9), checkboxes and fields have small radii, switch tracks are pills.
- Large surfaces: cards, sheets, banners use `--hd-radius-card` (EXT) or are square-edged (N9 pages).
- Task cards (open applications) are screen-shaped rectangles with tiny radii (N9).
