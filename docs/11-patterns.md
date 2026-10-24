# Patterns

## Drill-down navigation without breadcrumbs (N9 -> web)

The N9 never showed breadcrumbs. Hierarchy is expressed by **one level per screen**, a page title,
a slide-in from the right, and a single **Back** at bottom-left.

Web adaptation (EXT):
- Each level is a real URL; browser Back must equal the HDL Back.
- Compact: Back is the toolbar's left button. Medium+: Back may appear at the left of the page header.
- The page title always names the current level; the parent's name may appear as the Back label on desktop ("< Settings").
- Max ~4 levels. Deeper structures need search instead.
- Use `HdPageStack` or your router with the `hd-stack-push`/`hd-stack-pop` transitions.

## Settings (N9)

Section headers, list items with a trailing Switch or a value + drill-down, no Save button:
changes apply immediately. See *Examples / OS Settings page*.

## Creating content (N9)

New items open in a **Sheet** with Cancel/Done. Done is the accent button and is disabled until
the form is valid.

## Confirmation (N9)

Destructive actions ask with a **QueryDialog** (title = question, message = consequence,
accept = verb, e.g. "Delete"). Undoable actions use a Toast with "Undo" instead (EXT).

## Feedback (N9 + EXT)

- Transient info: InfoBanner (OS) / Toast (web).
- Incoming events: NotificationBanner + Events view item.
- Busy: BusyIndicator in place of the content or on the tapped icon (squircle ring). Never block the whole UI for under 1s.

## Lock screen (canon)

Large light clock at the top right, date below, notification tiles (`HdLockScreenNotificationCard`)
at the bottom, a "More" label when there are more, swipe sideways to unlock. Opt-in alternative: a
stacked card carousel.

## Home (canon)

Three horizontal views (Events, Applications, Open applications), `HdPageIndicator` dots, no dock.

## Forms on the web (EXT)

- Single column; labels above fields (never placeholder-only).
- Mark optional fields rather than required ones when most are required.
- Validate on blur and submit; errors in warning red with an icon, linked via aria-describedby.
- Primary action bottom (mobile: full-width accent button, or Sheet Done in OS contexts).

## Data tables (EXT)

No zebra stripes; hairline separators; numbers right-aligned with tabular figures; sortable headers
are buttons with `aria-sort`. On phones each row becomes a list item.

## Marketing pages (EXT)

Hero (one accent action) -> feature cards (3 up on desktop, 1 up on phones) -> a quiet list -> footer.
Imagery is full-bleed photography; small images and avatars are squircles.
