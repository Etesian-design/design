# Phone behaviour: the exact numbers

How the Etesian phone moves and responds, with the values the ROM uses. Everything here is read from the ROM's code
(launcher, SystemUI patch, fast scroll) and its device tests. Try the gestures in *OS / Gestures (try them)*; the maths is
in `src/shell/parts/gestures.ts`.

Units: dp, dp/s and ms. "Decelerate(f)" and "Accelerate(f)" are Android's interpolators: 1 − (1 − t)^2f and t^2f.
The phone's touch slop is Android's (8 dp).

## Edge swipes over an app

| What | Value |
|---|---|
| Edge zone (left, right, bottom) | 18 dp |
| Top | the whole status bar, plus a 24 dp band under it (not within 18 dp of the sides) |
| Starts when | the finger moves inward past the slop, more inward than across |
| Cancelled when | it moves across by 2 × slop first (not on the status bar) |
| Progress | inward distance ÷ screen width (sides) or height (top, bottom) |

- **Left, right, bottom: minimise.** **Top: close.** A side can be set as Back instead (Settings → Gestures → Back by
  swiping in: Disabled by default, left or right). Then a round chevron follows the swipe and Back fires past 40 dp.
- **The app only slides** with the finger. No scale. It keeps the screen's own rounded corners.
- **Home behind it** comes out of the dark: scale 0.9 + 0.1 × progress, opacity 0.25 + 0.75 × progress.
- **Closing darkens the app:** black over it at 0.7 × progress.
- **Letting go:**
  - commits past the swipe distance: 50% (N9, default; the setting also has 40, 30 and 20%);
  - or on a flick inward faster than 900 dp/s, once past 8%;
  - always springs back when the finger is moving back towards the edge faster than 300 dp/s.
- **Commit and spring back** run in 220 + 180 × (distance left) ms, Decelerate(1.6). So a full slide takes 400 ms.
- **Where you land:** a close shows Open apps. A minimise shows the view set for that side (Open apps by default; or where
  you were, Applications, Events, Widgets).
- **One animation.** Home then appears with no second window animation.
- A close plays the close sound.
- **On home** there is nothing to minimise: a tap on the status bar opens the status menu, and a swipe from it is
  swallowed. Nothing ever opens Android's notification shade.

## Swipe up and hold: the app row

- Hold still (within the slop) for **500 ms** anywhere on a swipe up from the bottom. Moving starts the wait again.
- Not while the on-screen keyboard is up: then the swipe only minimises.
- The first row of Applications comes up: one icon per grid column (4), a strip the icon size (58 dp by default) + 36 dp
  high. Each icon comes from 1.25 ×, 40 dp lower and transparent, 220 ms, Decelerate; each starts 30 ms after the one
  before. A short click sound plays.
- The app slides by itself to rest on the row and falls into shadow: black at 55%, in 260 ms, Decelerate. The finger no
  longer moves it.
- The icon under the finger lifts to 1.15 × in 120 ms. Let go on it to open it.
- Let go anywhere else: the app stays on the row until a tap. A tap on an icon opens it; a tap on the app goes back to it.

## Launch and restore

- **Launch:** no splash screen. A loading ring runs on the tapped icon until the app has drawn, then the app slides in.
- **Restore from Open apps:** the card is sucked away (scale to 0, 110 ms, Accelerate(1.5)), then the app slides in
  **from the side the last one left by** (swiped in from the left edge, it left to the right, so the next comes from the
  right; from the left until the first swipe). Home sinks back into the dark, the reverse of a minimise. 300 ms,
  Decelerate(1.6).
- Restore: 300 ms, the value to follow (see [07](07-motion.md)). The 130 ms once given for it has no known source.

## Home views

- **Order**: the N9's three views (Events, Applications, Open apps), with Etesian's optional ones to their left: News,
  Widgets (a list or 1 to 5 screens), Events, Applications, Open apps, in a circle. News and Widgets are off by default;
  Events can be turned off. Home opens on Applications. See [20 Phone](20-phone.md#2-home-views).
- **A drag** starts past the slop when it is 1.3 × more sideways than up or down, with one finger.
- **Letting go** goes to the nearest view, or the next one on a fling faster than 300 dp/s (6 × Android's minimum), and
  never more than one view from where the drag started.
- **Settles** in 220 + 180 × distance ms, at most 400 ms, Decelerate(1.6).
- **Wallpaper:** one picture 1.35 screens wide panning across all the views (from the last view round to the first it pans
  back), or one picture per view that moves with it.
- **Page dots:** hidden by default (the N9 had none). On top or bottom: 2.5 dp radius, 12 dp apart, 12 dp from the edge;
  each dot from 27% (far) to full white (the current view).

## Open apps

| What | Value |
|---|---|
| Levels | carousel (1 card), 2 (default), 3, 4 per row |
| Pinch | the cards reflow with the fingers; past × 1.4 (apart) or × 0.72 (together) on release, the level changes; the reflow reaches the next layout at × 1.8 / × 0.55 |
| Settle | 450 + 150 × progress ms, Decelerate(2); back to the old level 200 + 180 × (1 − progress) ms, Decelerate(1.5) |
| Carousel | each card 78% of the screen width; 11% padding on both sides so the first and last centre |
| Grid | 10 dp side padding |
| Card | the screen's own proportions; the snapshot fills the width from the top. No snapshot: the app icon (58 dp) on a tile, 4 dp radius |

- **Edit mode:** a long press anywhere. The close button (36 dp) at each card's top-right; previews dim to 50%.
- **Reorder** in edit mode: the held card lifts to 1.06 × in 120 ms; the card under its middle takes its place.
- **Close a card:** it shrinks to 0.6 × and fades out in 160 ms.
- **Bars:** Done and Close all, 68 dp high; in the carousel the action row (56 dp) sits above it.
- **Split view:** drag two cards together with two fingers. At 50% overlap they snap into one split card: from 1.12 × with
  an overshoot (2.2) in 220 ms, a 2 dp #2A86D8 outline. Pull them more than 0.45 × a card's width apart to tear it again.
  Cards that are let go return in 250 ms.

## Lock screen

- **Unlock:** a drag in **any direction** anywhere on the lock screen moves the whole lock layer (wallpaper, clock, cards,
  its status bar) along that axis. It starts at 0.8 × the slop.
- A sideways drag that starts on a notification is that card's swipe instead; sliding up on the stacked cards opens the
  full list.
- Without a PIN the phone shows live underneath (the last app or home view), coming out of the dark with the slide as
  behind an app. With a PIN or pattern the layer slides off over black and the N9 security screen appears.
- **Letting go:** unlocks past 35% of the screen on that axis, or on a flick along the drag faster than 1000 dp/s; a flick
  the other way springs back. It slides off in 160 ms (flick) or 220 ms, or springs back in 260 ms; Decelerate(1.5).
- **Home** then zooms from 0.9 and 25% to full in 220 ms, Decelerate(1.5). A fingerprint unlock is only this zoom.
- **The list:** a drag up on the deck opens every notification over the clock, scrollable. A pull down of 64 dp at the
  top closes it. A flung list coasts velocity × 0.25 in 450 ms, Decelerate(2). The clock and date fade out as the top
  card rises from 175 dp to 110 dp below the top. Fades take 200 ms.
- **Cards:** #B30C0F12, 8 dp radius, 16 × 12 dp padding, a 44 dp squircle; message 18 sp white (2 lines), sender 14 sp at
  80% white, time 14 sp at 60% white. 3 shown in full by default (setting 1 to 10).

## Notifications over apps

Settings → Events and notifications → Over apps. Never on the lock screen; there notifications join the cards.

| Style | Look |
|---|---|
| **N9** (default) | one black line the height of the status bar, over it; the text scrolls to its end at 60 dp/s after 900 ms |
| Belle | a dark strip across the full width over the status bar; shade light 55%, medium 72%, dark 86% or solid |
| Card | the lock-screen card under the status bar: #15181C, 10 dp radius, raised 8 dp |
| Colour | a bubble with squircle-half ends (n = 2.8) in the app's colour, the system accent or a fixed colour |
| Android | Android's own heads-up |

- On screen **5 seconds**. A tap opens it, a swipe up dismisses it. No buttons.
- The card drops from above the status bar in 250 ms; a system notice fades in from 40 dp above in 200 ms; let go
  mid-swipe, it returns in 150 ms.
- System notices use the same bubble: "Copied" (a lit green check, #5CC27A → #2E8A47), "App pinned · Long-press Back to
  unpin" (a lit blue lock, #2A86D8 → #0B3F9E), "Screenshot saved".

## Breeze

| What | Value |
|---|---|
| Handle | 20 dp in from the screen edge (out of the touch grip zone, below); thickness and height are settings |
| Touch area | the larger of 64 dp, or inset + thickness + 24 dp |
| Handle or button | within 48 dp of a side it docks as the handle; further in it is the floating button; it morphs in up to 350 ms |
| Handle colour | #E6262626 on dark, #E6F4F4F4 on light |
| Menu | widgets drawn at 75%; buttons 42 dp (the toolbar's are 48 dp); at most 5 buttons |
| Behind the menu | black at 55% (#8C000000): the app still shows, plainly not in use |
| Menu in / out | 260 ms Decelerate(1.6) / 180 ms Accelerate; the dim fades the same way |

## Fast scroll

- Only on a list that scrolls and has sections. Then a column down the right edge, 70/480 of the width, never reserving
  space.
- **Always:** each visible section's letter at its first row, 12 sp, #737573.
- **While the list is swiped:** a dimmed bar (#B3B8B8BC) over the letters with an 8 dp dot (#9C9CA0, rim #E8E8EA) at the
  position in the data. It fades in and out in 300 ms and goes 1 second after the list stops.
- **A finger on the column:** the dot hides; a dark band (#D91A1A1A, 150/854 of the height) runs across the list centred
  on the finger, with the current letter at 72 sp white at its left. Every 14 dp of movement steps one section.
- Component: `HdFastScroll`.

## Single hand mode

- 50 to 90% of the width, 70% by default; always in a corner (bottom-right the first time).
- The space around is #F0101010 with "Tap here to move · Double tap for full screen" in 15 sp #A0A0A0, when there is room.
- Moves and resizes in 260 ms, Decelerate.

## Touch grip zone

On the OnePlus 7 Pro the touch firmware ignores a **still** finger within about 60 px of the curved left and right edges
until it moves inward. Swipes from the edge work; holds and taps there do not. Anything held or tapped near a side
(Breeze's handle) sits at least 20 to 25 dp in.
