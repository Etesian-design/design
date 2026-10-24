# Components

All components are prefixed `Hd`, use only `--hd-*` variables, work in light and dark themes,
follow WAI-ARIA patterns and show a visible focus ring for keyboard users.

## OS / N9 components

| Component | N9 source | Notes |
| --- | --- | --- |
| `HdButton` | Button, ButtonStyle, Positive/NegativeButtonStyle | variants default/accent/negative/plain, icon, `fixedWidth` (322 n9px), `checked` (toggle) |
| `HdToolIcon` | ToolIcon | icon-only, `label` required (aria-label), optional badge |
| `HdToolBar` | ToolBar, ToolBarLayout | Back left, menu right, dark gradient, `landscape`, `fixed` |
| `HdPageHeader` | app header convention | plain or `colored` with accent; optional `dropdown` header menu |
| `HdTabBar` / `HdTabButton` | TabButton, ButtonRow, TabBarLayout | text segments or icon tabs in the toolbar; arrow-key navigation |
| `HdListItem` | ListDelegate, ListButton | title/subtitle, squircle thumbnail, drill-down chevron, trailing slot |
| `HdSectionHeader` | ListSectionHeader convention | bold xsmall label at the right of a hairline |
| `HdSwitch` | Switch | role=switch |
| `HdCheckBox` | CheckBox | native input |
| `HdRadioButton` | RadioButton | native input; group by `name` inside a `fieldset` |
| `HdSlider` | Slider | native range; value bubble while dragging |
| `HdTextField` / `HdTextArea` / `HdSearchField` | TextField, TextArea | label, helper, error (aria-describedby), clear button |
| `HdSheet` | Sheet, SheetButton | Reject / title / Accept bar; focus trap |
| `HdQueryDialog` | QueryDialog | alertdialog, stacked fixed-width buttons, inverted |
| `HdSelectionDialog` | SelectionDialog | listbox; accent selected row |
| `HdMenu` | Menu, ContextMenu | rises from the toolbar; ARIA menu |
| `HdInfoBanner` | InfoBanner (extras) | 3s, scale animation, role=status |
| `HdNotificationBanner` | system notification banner | slides from top, squircle icon |
| `HdBusyIndicator` | BusyIndicator | `squircle` (canon) or `classic`; 24/32/96 n9px |
| `HdProgressBar` | ProgressBar | determinate / indeterminate |
| `HdCountBubble` | CountBubble (extras) | |
| `HdPageIndicator` | PageIndicator (extras) | static or interactive dots |
| `HdSquircle` / `HdAvatar` / `HdAppIcon` / `HdThumbnail` | squircle rule | AppIcon `loading` ring = app launch |
| `HdStatusBar` | StatusBar | decorative status bar |
| `HdLockScreenNotificationCard` | lock screen | no buttons |
| `HdTaskCard` | Open applications | `editing` shows close buttons |
| `HdAppGrid` | Applications view | 4 columns or auto |
| `HdEventsFeedItem` | Events view | |
| `HdPageStack` | PageStack, PageStackWindow | drill-down with slide transitions + toolbar Back |
| `HdTheme` | `inverted` property | theme + accent scope |

## Web components (EXT)

| Component | Notes |
| --- | --- |
| `HdSiteHeader` | brand, links, actions; skip link; links collapse into a bottom toolbar < 600px |
| `HdFooter` | inverted, link columns |
| `HdHero` | big light title, lead, one accent action, optional media / colored |
| `HdCard` | flat surface, whole-card link, optional squircle icon |
| `HdContainer` / `HdGrid` | layout primitives (4/8/12 columns) |
| `HdTable` | sortable, tabular numbers, reflows to list items on compact |
| `HdPagination` | full on medium+, compact "n / m" on phones |
| `HdTooltip` | hover + focus, 400ms delay, Escape |
| `HdToast` | bottom, single action, pauses on hover/focus |

Every component has stories and an autodocs page in Storybook.
