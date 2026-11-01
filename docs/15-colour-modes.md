# Colour modes: Hybrid, Dark, Light

The N9 had no "dark mode" switch. Its blanco theme defined **two palettes** (`COLOR_*` and
`COLOR_INVERTED_*` in `constants.ini`) and every app, and every piece of system chrome, picked one.
The result was a **mix**: light content pages framed by dark chrome, dark overlays and a dark home.
We call that mix **Hybrid**. It is the default and the only N9-original mode. From it we derive
two strict modes for the web: **Dark** (everything inverted) and **Light** (everything blanco).

Hybrid must never be flattened into Light: in Hybrid the toolbar, menus, dialogs, banners, status
bar and home stay dark even though pages are light.

```html
<html data-hd-mode="hybrid">  <!-- default; also: dark | light | auto (light/dark by prefers-color-scheme) -->
<HdTheme mode="dark"> ... </HdTheme>                 <!-- any subtree -->
```

Legacy: `theme="light"` / `[data-hd-theme="light"]` = Hybrid, `theme="dark"` = Dark.

## Evidence from the N9 files (Hybrid)

| Finding | Source file | Status |
|---|---|---|
| Two palettes: `COLOR_BACKGROUND #E0E1E2`, `COLOR_FOREGROUND #282828`, `COLOR_SECONDARY_FOREGROUND #505050` vs `COLOR_INVERTED_BACKGROUND #000000`, `COLOR_INVERTED_FOREGROUND #FFFFFF`, `COLOR_INVERTED_SECONDARY_FOREGROUND #C8C8C8` | `themes/blanco/meegotouch/constants.ini` | measured |
| An app chooses one globally: `theme.inverted`; every `*Style.qml` derives `__invertedString` from it; window background `theme.inverted ? "#000000" : "#E0E1E2"` | `qt4/imports/com/nokia/meego/Style.qml`, `PageStackWindowStyle.qml` | measured |
| Query dialogs, selection and multi-selection dialogs are dark whatever the app: their buttons are hard-coded `ButtonStyle { inverted: true }`; `COLOR_DIALOGHEADER = $COLOR_INVERTED_FOREGROUND` (white titles) | `QueryDialog.qml`, `SelectionDialog.qml`, `MultiSelectionDialog.qml`, `constants.ini` | measured |
| Menus have an inverted background asset; menu items use `COLOR_BUTTON_INVERTED_FOREGROUND` when inverted | `MenuStyle.qml`, `MenuItemStyle.qml`, `AbstractMenu.qml` | measured |
| Toolbar/tab bar: `BottomTabButtonInverted`, `TopTabButtonInverted` styles with `$COLOR_INVERTED_FOREGROUND` | `libmeegotouchviews/style/mtoolbartabstyle.css` | measured |
| System UI (status bar, lock screen, notifications, volume): `background-color: $COLOR_INVERTED_BACKGROUND`, white text | `sysuid/style/sysuid.css`, `sysuid/style/volume.css` | measured |
| Camera: on-screen text `$COLOR_INVERTED_FOREGROUND` | `camera-ui/style/camera-ui.css` | measured |
| Gallery: `CommonInverted` button labels | `gallery/style/gallery.css` | measured |
| Video: duration text `#c8c8c8` (= inverted secondary) on dark | `video/style/video.css` | measured |
| Mail, Notes, Calendar (organiser), Settings (duicontrolpanel), device lock: no inverted styles at all, so they use the light blanco palette | `mail/`, `notes/`, `organiser/`, `duicontrolpanel/` styles | measured (absence) |
| Calendar defines extra dark shades `COLOR_CALENDAR_SHADE6..9` (#333333, #262626, #1A1A1A, #808080) for month/agenda shading on its light page | `organiser/style/*.css` | measured |
| Home (Events, Applications, Open applications) dark | not in the extracted theme (lipstick/meegotouchhome QML absent) | canon (device behaviour), not verified in files |
| Music app dark; Contacts and Messaging light | no theme styles for music-suite, contacts or messaging-ui in the extracted files | canon, not verified in files |
| Sheet header dark | sheet assets exist in both normal and `-inverted` variants; no evidence which one apps used | extrapolated |

Calendar is light but carries its own dark shading greys; Home, Music, Contacts, Messaging and the sheet
header could not be confirmed from the extracted files and are marked canon/EXT.

## Rules (Hybrid)

| Context | Surface token | Hybrid | Status |
|---|---|---|---|
| Content pages, lists, forms (Settings, Contacts, Messaging, Email, Calendar, Notes) | `--hd-surface-page` | light #E0E1E2 | measured |
| Cards, fields | `--hd-surface-card`, `--hd-surface-field` | white | extrapolated |
| Toolbar, tab bar, sheet header | `--hd-surface-chrome` | dark gradient | measured (toolbar), EXT (sheet header) |
| Status bar, lock screen, Home views | `--hd-surface-home` | black | measured (sysuid), canon (Home) |
| Menus, query/selection dialogs, popups, tooltips | `--hd-surface-overlay` | dark 97% | measured |
| Dialog scrim | `--hd-surface-scrim` | black 88% | measured (dark dialogs), value EXT |
| Banners, notifications, toasts | `--hd-surface-banner` | dark 92% | measured (sysuid) |
| Media apps (Music, Video, Gallery, Camera) | `--hd-surface-media` | black | measured (Camera, Gallery, Video), canon (Music) |

## Derivation of Dark and Light (extrapolated)

| Surface | Hybrid (N9) | Dark (EXT) | Light (EXT) |
|---|---|---|---|
| page | #E0E1E2 / #282828 text | #000000 / #FFFFFF, #C8C8C8 | #E0E1E2 / #282828, #505050 |
| card | #FFFFFF | #161616 (elevated) | #FFFFFF |
| field | #FFFFFF | #1C1C1C | #FFFFFF |
| chrome | #3A3A3A to #141414 (white icons) | #2E2E2E to #101010 | #F7F8F8 to #D5D6D8 (dark icons, keeps the top-lit gradient) |
| overlay | rgba(20,20,20,.97) | #1E1E1E (separates from #000 page) | #FFFFFF with divider ring |
| scrim | rgba(0,0,0,.88) | rgba(0,0,0,.8) | rgba(224,225,226,.92) |
| home / lock | #000000 | #000000 | #E0E1E2 (lock-like hero becomes light) |
| banner | rgba(30,30,30,.92) | rgba(44,44,44,.96) | rgba(255,255,255,.97) |
| media | #000000 | #000000 | #F2F3F4 |

Every surface also carries a **scheme** (light or dark). Content placed on it uses that scheme's
palette: `.hd-on-chrome`, `.hd-on-overlay`, `.hd-on-home`, `.hd-on-banner`, `.hd-on-media`,
`.hd-on-card`, `.hd-on-page` re-point every `--hd-c-*` token (fg, secondary, divider, pressed,
button colours, link, focus) to that surface, so a button inside a Hybrid menu is automatically a
dark-scheme button. Components only consume `--hd-surface-*` and `--hd-c-*`.

Contrast (WCAG 2.1): primary text is 10:1 or more in every mode (#282828 on #E0E1E2 = 11.3:1,
#FFFFFF on #000000 = 21:1, #FFFFFF on the toolbar gradient bottom #141414 = 18.4:1, #282828 on the light toolbar
bottom #D5D6D8 = 10.1:1). Secondary text: #505050 on #E0E1E2 = 6.2:1, #C8C8C8 on #000000 = 12.6:1.
Accent as text uses `--hd-c-accent-text` (#1C51AF on light = 5.6:1, #7FB0FF on black = 9.6:1, AA).
Gap: white bold 15px text on the default accent #4591FF fill is 3.1:1 (N9 original); it passes only
for large/bold UI text (3:1), so for long text on accent fills pick a darker accent.

## Tokens

Generated in `src/styles/tokens.css` from `tokens.json` → `mode.{hybrid,dark,light}.{page,card,field,chrome,overlay,scrim,home,banner,media}`
(each with value, scheme, origin, source). Per mode: `--hd-surface-<x>`, `--hd-surface-<x>-fg`,
`--hd-surface-<x>-fg-secondary`, `--hd-surface-<x>-scheme`, plus the page palette `--hd-c-*`.
`tests/modes.test.ts` checks that every surface is defined for all three modes.

## Quasar

The plugin keeps `data-hd-mode` on `<html>` in sync: Quasar Dark on = `dark`, off = the `mode` option
(default `hybrid`, or `light`/`auto`). QFooter/QBar use chrome, QMenu/QTooltip/dialogs/BottomSheet/Loading
use overlay and Notify uses banner, so Hybrid keeps them dark over light Quasar pages.
