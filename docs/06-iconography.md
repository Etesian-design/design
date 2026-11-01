# Iconography

## N9 style (reference)

- Toolbar/tool icons: monochrome, thin, outline-based, ~32 n9px (21 CSS px) in a 48 CSS px target,
  white on the dark toolbar. Icons only, no labels (labels appeared as text tabs instead).
- App icons: full-colour artwork on a squircle; 80 n9px.
- Sizes: xlarge 6.4mm, large 4.8mm, default 3.2mm, small 2.4mm, xsmall 1.8mm.

The original N9 icon files are Nokia's and are **not included**.

## Etesian icon set (EXT, original, MIT)

`src/components/icons.ts` contains 67 original icons drawn for this project on a 24 x 24 grid with a
2px round stroke, chosen to echo the N9's light outline look. Use with `<HdIcon name="back" />`.

Rules:
- One stroke weight (2px at 24px). Scale the whole icon; don't vary stroke.
- `currentColor` only; icons inherit text colour.
- Decorative icons are `aria-hidden`; meaningful icons need `label` (or the parent control needs `aria-label`).
- App icons: put a glyph on an accent-coloured squircle (`HdAppIcon icon="phone" color="#62B700"`) or supply your own artwork.

Alternative: any outline set with a similar weight (e.g. Lucide, ISC licence; Tabler, MIT) works with
`HdIcon` if you register its paths in `icons`; credit the licence.

App icon tiles are lit (top-lit emboss) by default: see [Icon lighting](06b-icon-lighting.md).
