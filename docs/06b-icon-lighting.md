# Icon lighting (top-lit emboss)

Every stock N9 app icon is lit the same way: **one light source straight above the screen**. The tile
looks slightly domed, the glyph looks raised out of it. This page gives the measured numbers and how
to rebuild the effect, in code (`lighting="lit"`, the default) and by hand (for designers).

**Method.** Pixel analysis (Python/PIL) of the 80 x 80 `icon-l-*.png` blanco app icons: 19 colour
tiles and 16 white/grey tiles for the tile gradient and rim, 16 icons for glyph colours and cast
shadows. Columns without glyph pixels were sampled for the tile, glyph pixels were classified as
low-saturation/high-value, cast shadows were measured as tile luminance ratio directly below each
glyph's bottom edge. Nokia files are analysed only; none ship with this project.

Legend: **M** = measured (median), **EXT** = extrapolated / our choice.

## Anatomy

```
   ._________________.      <- top rim: 1-2 px crescent, +10% lightness            (M)
  /  lighter, hue ->  \     <- gradient starts at 10% of the height                (M)
 |   yellow / cyan     |
 |      ######         |    <- glyph: off-white #F6F8ED at top                     (M)
 |      ######         |       1 px white highlight on its top edges              (M)
 |      ######         |       -> #EAE9E3 -> #D0C9C6 at its bottom                (M)
 |      ::::::         |    <- cast shadow: tile x0.72 right under the glyph,      (M)
 |                     |       back to tile after ~6-7 px of 80 (8%)
 |   darker, hue ->    |    <- gradient ends at 72%, flat below                     (M)
  \  red / indigo     /
   '-----------------'      <- (faint reflected line, not measurable)             (EXT)
       ~~ soft shadow ~~     <- outside the tile: not in N9 assets                 (EXT)
```

## Measured values

| Parameter | Value (80 px icon) | As % of icon size | Origin |
|---|---|---|---|
| Tile size in the 80 px canvas | 78 px, 1 px transparent margin | 97.5% | M |
| Gradient direction | vertical, 180deg (top to bottom) | | M |
| Gradient start / end | row 8 / row 57 | 10% / 72% (bottom 28% flat) | M (n=19, median row 57) |
| Lightness top vs bottom (colour tiles) | +11.8% HSL L (mean 11.0, sd 5.5) | | M (n=19) |
| Lightness top vs bottom (white/grey tiles) | +14% (white: #FCFCFD -> #D1D3D4, linear over full height) | | M (n=16) |
| Saturation | unchanged (median dS = 0) | | M |
| Hue | top leans to the brighter neighbour hue: orange/red -> yellow (+19..23deg), blue -> cyan (-12..23deg) | | M |
| Top rim | 1-2 px, +10% L over the tile under it (sd 2.8) | 2.5% | M (n=19) |
| Bottom reflected line | median 0% (+0.6% at most) | | M: practically absent |
| Glyph colour top / middle / bottom | #F6F8ED / #EAE9E3 / #D0C9C6 (large glyphs to ~#C1BBB5) | | M (n=16) |
| Glyph top-edge highlight | up to #FFFFFF, 1 px | ~1.2% | M (Calculator; antialiased median #EDF0EC) |
| Cast shadow under glyph (tile luminance ratio) | x0.72 at 1 px, 0.74 at 2, 0.81 at 3, 0.88 at 4, 0.94 at 5, 0.97 at 6, 0.99 at 7 | fades over ~8% | M (n=16) |
| Cast shadow colour | darker shade of the tile, e.g. #895400 on Calculator orange, #3C5789 on Conversations blue | | M |
| Cast shadow direction | straight down (no x offset) | | M |
| Soft shadow outside the tile | none in the assets (alpha 0 outside the squircle) | we use 1.5% offset, 2.5% blur, 28% | EXT |

Examples (tile colour at 15% / bottom): Contacts #2293D7 -> #1148B9, Calculator #EFBB00 -> #DC6A00,
Browser #2EA8C7 -> #155392, Maps #60AD00 -> #336500, Gallery #8D01D6 -> #3A019D.

### White tile variant (Clock, Camera, AT&T, widgets, location)

Same light: tile #FCFCFD at top -> #D1D3D4 at the bottom (linear, full height, no flat part). Glyphs are
near-black **#231F20 at the top getting lighter, #5E5E60 at the bottom** (the reverse of light glyphs,
because a dark raised surface catches less light lower down). Cast shadows under dark glyphs are weak
(~2-4% darker, e.g. #CFCBCB on #D2D3D4). Use `tone="light"`.

## Using it

```vue
<HdAppIcon label="Phone" icon="phone" color="#62B700" />            <!-- lit by default -->
<HdAppIcon label="Phone" icon="phone" color="#62B700" lighting="flat" />
<HdAppIcon label="Clock" icon="clock" tone="light" />                <!-- white tile -->
<HdIcon name="phone" lit />                                          <!-- lit glyph only (SVG filter) -->
```

Plain HTML/CSS (any content, e.g. Quasar avatars, font icons):

```html
<span class="hd-icon-lit-shadow" style="--hd-icon-size:64px">
  <span class="hd-squircle hd-icon-lit" style="--hd-icon-accent:#62B700;width:64px;height:64px">...</span>
</span>
```

- `.hd-icon-lit`: tile gradient, top rim (crescent = squircle minus squircle moved down by 2.5%,
  so it follows the curved top edge), faint bottom line, cast shadow on children via `drop-shadow`.
- `.hd-icon-lit--light`: white tile variant. `.hd-icon-lit-shadow`: soft outer shadow wrapper
  (a mask clips shadows on the masked element itself, so the shadow lives on a wrapper).
- Exact gradient: `litPalette(accent)` / `litVars(accent, size)` from `etesian-design` set
  `--hd-icon-top` / `--hd-icon-bottom`; without them a `color-mix()` fallback is used.
- Glyph: `HdIcon lit` strokes with the off-white gradient and applies an SVG filter (cast shadow +
  top-edge highlight). Photos (`src`) are never re-lit.
- Tokens: `--hd-icon-lighting-*` and `--hd-icon-light-tile-*` (tokens.json `icon.lighting`, `icon.light-tile`).

Where it is on: HdAppIcon, HdAppGrid, HdAvatar (initials), HdThumbnail (icon thumbnails, list rows),
HdEventsFeedItem, HdLockScreenNotificationCard, HdNotificationBanner, HdCard icons, the Iconography
gallery and the Quasar theme (`q-avatar`). Every component takes `lighting="flat"` to turn it off,
e.g. for tiny (< 24 px) icons, print, or high-contrast contexts.

## Recipe for designers (any size S)

1. Squircle n = 2.8, filling 97.5% of the canvas.
2. Pick the accent as the **mid** tone. Linear gradient 180deg: stop 10% = accent +6.5% L (hue 10deg toward
   yellow for warm colours, 5deg toward cyan for blues, blues ~18% less saturated); stop 72% = accent -5.5% L
   (hue the other way); flat below 72%.
3. Top rim: inner crescent 2.5% of S, white at ~55% fading to 0 over its height (gives +10% L).
4. Glyph (big and simple, 50-75% of S, solid shapes): gradient #F6F8ED -> #EAE9E3 -> #D0C9C6 top to bottom;
   1 px #FFFFFF line along its top edges.
5. Cast shadow: copy of the glyph, black, 30-35% opacity, multiply, moved down 1.5% of S, blur 3% of S.
   It must be clipped by the tile.
6. Optional (EXT): outer soft shadow 1.5% down, 2.5% blur, 28% black. No other outer effects.

Do not: add gloss/specular "shine" bands, light from the top left, coloured glyphs on colour tiles,
pure-white glyphs, or inner shadows at the top.

## Buttons

Every button uses the same light from straight above as the icon tiles. Measured on the N9's dark
"Done" / "Close all" buttons (Open applications edit mode):

| Part | Value |
| --- | --- |
| Fill | vertical gradient, lighter at the top: `#1C1C1C` → `#101010` (middle) → `#080808` |
| Rim | 1px `#393839` all round, brightest along the top edge |
| Corners | soft radius ≈ 21% of the height (8px on a 40px button), never a pill |

Light (blanco) and accent buttons follow the same pattern, derived from their base colour exactly as
the icon tiles are: the top is ~10–12% lighter, a 1–2px lighter top rim, a darker bottom.

In CSS (`src/styles/base.css`) set `--hd-btn-base`; `--hd-lit-fill` and `--hd-lit-shadow` follow:

```css
--hd-btn-top: color-mix(in srgb, var(--hd-btn-base) 90%, #fff);
--hd-btn-bot: color-mix(in srgb, var(--hd-btn-base) 88%, #000);
--hd-lit-fill: linear-gradient(var(--hd-btn-top), var(--hd-btn-base) 50%, var(--hd-btn-bot));
```

- `HdButton` is lit by default (all variants and colour modes); `lighting="flat"` keeps a flat fill, as for icons.
- Icon-only buttons (`.hd-sq`) use the lit gradient as the squircle fill and the rim as the squircle ring.
- Toolbar icons (`HdToolIcon`) light their hover / pressed / active squircle highlight the same way.
- The Quasar theme lights `q-btn` (standard, unelevated, push, and coloured `bg-*` buttons).
- `HdTaskEditBar` ("Done" / "Close all") uses the measured dark values above.
