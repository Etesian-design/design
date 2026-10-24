# Accessibility (EXT unless noted)

Target: **WCAG 2.2 AA**.

## Contrast

| Pair | Ratio | Status |
| --- | --- | --- |
| `#282828` on `#E0E1E2` (fg/bg light) | 11.3:1 | AA/AAA |
| `#505050` on `#E0E1E2` (secondary) | 6.2:1 | AA |
| `#FFFFFF` on `#000000` | 21:1 | AAA |
| `#C8C8C8` on `#000000` | 12.6:1 | AAA |
| `#1C51AF` on `#E0E1E2` (link light) | 5.6:1 | AA |
| `#4591FF` on `#E0E1E2` (accent as text) | 2.4:1 | **fail; don't** |
| `#FFFFFF` on `#4591FF` (accent button) | 3.1:1 | large text only; known gap |
| `#FFFFFF` on `#DA201E` (negative button) | 5.0:1 | AA |

## Focus

- `:focus-visible` ring: 2px `--hd-c-focus`, 2px offset. Never removed without replacement.
- Dialogs, sheets and menus trap focus, close on Escape and restore focus to the opener (`useModal`).

## Keyboard

| Component | Keys |
| --- | --- |
| TabBar | Left/Right/Home/End (automatic activation) |
| Menu | Up/Down/Home/End, Enter, Escape |
| SelectionDialog | Up/Down, Enter/Space, Escape |
| Slider | native range keys |
| Tooltip | shows on focus, Escape hides |

## Semantics

- Native elements first (button, a, input). ARIA roles only where needed (switch, tablist, menu, listbox, dialog, alertdialog, progressbar, status).
- Icon-only buttons require `label`.
- Live regions: InfoBanner/Toast/NotificationBanner are polite; warning Toasts use role=alert.
- SiteHeader includes a "Skip to content" link targeting `#main`.

## Touch

- 44 x 44 CSS px minimum targets (N9 used 30-px release tolerance and 12-px touch expansion; HDL
  sizes the target itself).
- Gestures always have a visible alternative (Back button for edge swipe, close button in task-card edit mode).

## Motion

- `prefers-reduced-motion` disables transitions; spinners keep slow rotation.
- No auto-advancing carousels without pause.
