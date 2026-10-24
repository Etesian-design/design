# Motion

## Durations and easing

| Token | Value | Use | Origin |
| --- | --- | --- | --- |
| `--hd-motion-duration-instant` | 100ms | hover/press feedback | EXT |
| `--hd-motion-duration-fast` | 130ms | app slide-in after launch, card restore | N9 (canon) |
| `--hd-motion-duration-default` | 200ms | banners, toggles, dialogs | N9 (InfoBanner) |
| `--hd-motion-duration-slow` | 350ms | page stack, sheets | N9 |
| `--hd-motion-duration-banner` | 3000ms | InfoBanner visible time | N9 |
| `--hd-motion-easing-out` | OutQuad | entering | N9 |
| `--hd-motion-easing-in` | InExpo | dismissing | N9 |
| `--hd-motion-easing-in-out` | InOutQuad | moving | N9 |

## System gestures (N9, canon)

- **Swipe in from a side edge** minimises the app to Home. The window follows the finger (pure
  slide, no zoom). Home is behind it, starting ~25% lit and slightly zoomed out; it brightens and
  zooms in as the window leaves.
- **Swipe down from the top edge** closes the app.
- Commit threshold: ~50% of the screen. Reversing direction before release cancels.
- **Home** has three horizontal views: Events, Applications, Open applications. Swiping moves between them.
- **App launch:** a loading ring runs around the tapped icon's squircle edge until the app has
  drawn, then the app slides in (~130ms).
- **App restore:** the task card zooms away fast and the app slides in from the left.
- **Lock screen:** swipe sideways to unlock.

## In-app transitions (N9)

- Drill-down: new page slides in from the right; Back slides it out to the right (350ms).
- Sheet: slides up from the bottom; dismisses down.
- Dialog: fades in with a slight scale (from 0.9).
- Menu: rises from the toolbar.
- Info banner: scales in from 0 (200ms OutQuad), out with InExpo.
- Notification banner: drops from the top edge.

## Web extrapolations (EXT)

- Hover: background tint to `--hd-c-pressed` in 100ms, no movement for controls; cards may lift 2px.
- Press: label colour to `#8C8C8C` (N9 pressed text) or 0.94 scale on squircle icons.
- Focus: instant ring, no animation.
- Scroll-linked or parallax effects: avoid.
- `prefers-reduced-motion: reduce`: transitions collapse to 1ms; spinners keep turning slowly so
  progress is still communicated.
