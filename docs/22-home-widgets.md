# Home widgets (Belle style)

Etesian's widgets, in the style of the Belle widgets: glossy panels with lit squircles, the same on the phone's home screen and on the desktop. Sizes are dp, which map 1:1 to CSS px at this scale. Every widget is live in Storybook under *OS / Belle widgets*.

## Grid

- 4 columns; cell = screen width / 4 (90px on a 360px screen). 6px gap round every widget, so a widget is `n × 90 − 12` px (1×1 = 78, 2×1 = 168 × 78, 4×2 = 348 × 168, 4×3 = 348 × 258).
- Each widget declares a default size (targetCell) and a minimum; resizing snaps to whole cells, up to 4 × 8.

| Widget | Cells | Body |
| --- | --- | --- |
| Switch (Wi-Fi, Bluetooth, data, Silent, Flight, VPN, 3G) | 1×1 | 76×80 brushed grey squircle, 24px corners |
| Wi-Fi / FM radio switch | 2×1 | dark lit pill, 16px corners, 56px power squircle |
| Switches row | 4×1 | four 60×56 dark squircles, labels 13px |
| Data usage | 1×1 | 78px dark disc, 7px blue ring from 12 o'clock |
| Today / Agenda | 4×1 / 4×3 | white paper, 12px corners, two binder rings 44px in |
| Notes | 4×2 | yellow paper, 40px dark bar with ▲ ▼ + delete |
| Analog (square) / big / gear clock | 2×2 / 4×3 / 4×3 | 120 / 220px dial |
| Flip / LCD / word clock | 4×2 | two black tiles / metal frame / text only |
| Web / contact shortcut | 2×2 | picture as is, name on a dark strip |
| Weather | 4×2 | grey glass from 30px down, 84px icon breaking out above |
| RSS (one site) | 4×3 | 52px orange header, white rows with orange dots |
| Music (small) | 4×1.5 | belle-music-widget-small.jpg: glossy black panel, square art on the left rising above its top edge, title (+ output link), prev / play / next in a recessed groove. Also the status-menu music block |
| Music (large, `music-large`) | 4×3 | belle-music-widget-large.jpg: square art standing up out of a glossy tray, prev / big play / next on the tray; empty state "Go to Music library". **Planned as a home-screen widget in the phone launcher** |
| Modern set (clock, calendar, feeds, music, weather, shortcuts) | 4×1 – 4×2 | one translucent black panel |

## Materials

- Everything is **lit from the top**: each body is a top → bottom gradient, light at the top, with a darker 1–1.5px rim and often a short white sheen over the top 30–40px.
- Classic glass: `#505155 → #2A2B2E → #141416` at 90%, 14px corners, 1px `#0A0A0B` rim.
- Dark pill: `#4C4D52 → #26272A → #101012`, 16px corners, 1.5px `#050506` rim.
- Paper: `#FFFFFF → #E6E6E8`, 1px `#BDBDC0` rim, a dark backing showing below; text `#1A1A1A`, secondary `#6E6E73`, rules `#DADADD`.
- Modern panel: `#000` at 70%, 12px corners, 1px white at 15%, a faint top light; secondary text `#8C8C8C`.
- Accents: event bar cyan `#19D3E6`, on-state blue `#2F7FD6` / ring `#2F8BEA`, power on green `#D3EE7A → #4F8A14`, LCD `#23B14D`, word-clock minutes pink `#E0287A`, RSS orange `#F7A13A → #E5620F`.

## Shape

- Switch faces and power buttons are squircle-ish, with corners near a third of their size; toggles 20px on 56px.
- Music transport buttons are lit squircles (our rule), although Belle drew them round. Round shapes remain only for date bubbles and the data disc.
- Album art, web thumbnails and photos are **shown as is**: square (photo frames 6px corners). Only placeholders (no art) sit on a squircle tile.

## Type

- Regular weight for content (13–18px), bold only for headings and states (Notes 22px, RSS site 18px, flip digits 84px). Big numerals in the modern set use Light (clock 56px, temperature 44px).
- Labels on pictures sit on a dark strip (`#000` at 65%) or a glass tab, never straight on the image.

## States

- On: blue light under the rim (switches) or a green power face; off: unlit grey. Text goes white when active (FM frequency), grey `#8E8F94` when idle.
- Disabled arrows dim to `#6A6B70`.
- Empty states are a single centred grey line ("No events", "No posts yet", "Nothing playing").

## Edit mode

- Long-press: every widget gets a 2px accent outline (14px corners), a **red ✕ squircle, 30px, at the top right** (`#F78673 → #EF2C10`, white cross 13% stroke) and a corner resize handle that snaps to cells.
- The bottom gets the black edit bar (1px `#2A2A2A` top rule) with **Done** and **Add widget**: dark lit buttons, 180×41 n9px (120×27.5px), centred, 8 n9px apart.
- With no widgets, Add widget is a single button on the empty page.
