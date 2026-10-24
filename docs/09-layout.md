# Layout & grids

## OS layout (N9)

Portrait 480 x 854 n9px (320 x 569 CSS px):

```
+--------------------------+
| Status bar 36            |  black, always visible (except fullscreen media)
+--------------------------+
| Page header 72 (optional)|  title, large light; plain or accent-coloured
|                          |
| Content                  |  lists edge to edge, 16 n9px side margin for text
|                          |
+--------------------------+
| Tool bar 72 (56 land.)   |  Back left, actions centre, menu right
+--------------------------+
```

- Side margin: `MARGIN_XLARGE` 16 n9px (11 CSS px). List items use it as indent.
- Home: three full-screen horizontal views (Events, Applications, Open apps), page indicator dots.
- Applications grid: 4 columns portrait, icons 80 n9px with labels.
- Open applications: task cards in a 2x2 grid, 3x3 when many apps are open (pinch to switch).
- Landscape: same structure, shorter toolbar; many apps were portrait-only.

## Web layout (EXT)

### Breakpoints

| Name | Min width | Columns | Gutter | Page margin | Navigation |
| --- | --- | --- | --- | --- | --- |
| compact | 0 | 4 | 16px | 16px | bottom toolbar (N9 style) |
| medium | 600px | 8 | 24px | 24px | top bar, links visible |
| expanded | 960px | 12 | 24px | 32px | top bar |
| wide | 1280px | 12 | 24px | auto (centred) | top bar |

Containers: prose 680px, default 1120px, wide 1360px (`HdContainer`). Grid: `HdGrid` with
`--span`, `--span-md`, `--span-lg` on children, or `min` for an auto-fill card grid.

### Rules

- Mobile first, one column. The page is a *list*: sections stack, each item a full-width row.
- Primary navigation on compact widths sits at the **bottom** (dark gradient toolbar), like the N9.
- Desktop: keep the calm. Big light headings, one accent, generous whitespace (48px between sections,
  96px around heroes). Never more than one primary (accent) button per view.
- Content measure: 45-75 characters for prose.
- Sticky header only at >= 600px is optional; the bottom bar on compact is fixed.
