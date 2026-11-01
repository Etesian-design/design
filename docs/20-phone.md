# The phone (reference for every form factor)

This chapter records everything already built and decided for the phone (Etesian on any phone running LineageOS). It is the reference for tablet, desktop and any later form factor. If something here conflicts with an exploration, this chapter wins unless the change is made here first.

Units: all sizes are in **dp**, and type is in **sp**.

---

## 1. Gestures and the OS

| Gesture | Result |
|---|---|
| **Swipe in from the left or right edge** | Minimises the app to home. The app shrinks away and the last home view shows. The app keeps running and appears in Open apps. |
| **Swipe down from the top edge** | Closes the app (the N9 swipe-down close). |
| **Swipe up from the bottom edge and hold** | Peeks the first row of the app grid over the app. Release on an icon to launch it; release elsewhere to cancel. |
| **Tap the status bar** | Opens the status menu (see below). It is never part of Events. |
| **Swipe sideways on the lock screen** | Unlocks. There is no unlock button. |
| **Pinch in Open apps** | Zooms between the levels: carousel (one card), 2, 3 and 4 per row. |
| **Two fingers drag two Open apps cards together** | Split view: the cards follow the fingers and snap into one card showing the split. Spreading the fingers before lifting undoes it; the reverse gesture pulls a split apart. |

The system gesture areas belong to the OS. Apps never put interactive controls within the edge-swipe zone, and nothing in an app may imitate an edge swipe.

### Status menu

- **Profile strip.** Silent and Beep are fixed segments. The Ringing segment and the grey after it are one control, the ringer volume slider: its blue fill runs into the grey in proportion to ring volume (drag along it to set the level; full = all the way across). A strip without a volume (e.g. the Mode strip) has no grey remainder: its segments fill the width.
- **Volume** is the media volume, one flat bar. There are no per-stream volume rows.
- **Rows** of a lit squircle, a bold title and its state: network, Bluetooth, battery and so on.
- Additions (off by default): a strip of toggle tiles with its editor, extra sliders (brightness), hidden rows behind a handle, a Modes strip (Do Not Disturb and the enabled modes) and the small Belle music widget while something plays, with its "Play on" output dialog.

### Lock screen

> **To be revisited as a whole.** Today: a huge thin right-aligned clock, the full date right-aligned under it, a glance line (next alarm or event) and the notification cards at the bottom.

- **Default notification style: a stacked carousel (iPhone style).**
  - The newest **N** notifications show in full at the bottom. N defaults to 3; the setting allows 1–10.
  - The rest appear as stacked strips under them.
  - Sliding up works like an accordion: cards past the last full one wait hidden behind it, the next card is uncovered from its lower edge and then carried up, and cards fold away under the clock block, so the clock always stays visible.
- **Optional style: N9.** The N9 "More" label replaces the stacked strips.
- **Groups:** tapping a group opens it in place into separate N9 cards. It does not navigate away.
- **Notification cards:**
  - N9 dark translucent cards with an **8dp** radius.
  - A **44dp squircle** app icon or contact photo.
  - The message in large type, with the sender and time beneath it.

### Animations on every interaction

- **App launch:** a loading ring runs on the tapped icon. When the app is ready, it slides in. There is **no splash screen**.
- **Restore from Open apps:** the card is sucked away, then the app slides in from the side it was last swiped out to (swiped out to the right, it comes back from the right).
- **Minimise (edge swipe):** the app slides off in the direction of the swipe and home is revealed underneath.
- **Close (swipe down):** the app follows the finger down and fades out.
- **Open apps zoom (pinch):** cards reflow between carousel, 2, 3 and 4 per row. Cards keep their identity; there is no cross-fade.

Durations and easings come from the motion tokens (see [07 Motion](07-motion.md)).

---

## 2. Home views

There are three horizontal views. Swiping moves between them, with page dots.

### Events

From top to bottom:

1. **Day and date.**
2. **Weather**, centred on its line:
   - the city in small bold type, centred above a hairline rule;
   - the temperature and weather icon centred under the rule.
3. **Notifications.** Live updates (calls, timers, downloads) are pinned first and appear only here, never in the status bar.
4. **Today** (optional): one-line items such as screen time, all-day events, birthdays and upcoming events.
5. **Feeds.**

Long-press an item for the N9 menu sheet: Reply (a one-line composer), Mark as read, Snooze, Dismiss. Optional additions: **priority people** (a contact's messages and mail pinned to the top, across apps) and **ghost rows** (dismissed notifications fade out as one or more rows under the list; tap opens "Earlier", swipe clears them).

Section headers are the N9 SectionHeader: a small bold secondary label, right-aligned, with a hairline to its left.

Item type sizes:

| Element | Size |
|---|---|
| Title | 16sp bold |
| Summary | 14sp regular |
| Time | 12sp |

Thumbnails are 43–44dp squircles.

### Applications

- The app grid uses squircle icons, 4 columns on a phone.
- Long-press starts the edit or move mode.

### Open apps

- Live cards of the running apps.
- Zoom levels: carousel, 2, 3 and 4 per row, changed by pinching.
- The default is 2 per row.
- The last opened app moves to the top. In edit mode, cards can be dragged to a new place.
- Two-finger split view: see the gestures table.

### Open apps edit mode (long press)

- **Close button:** a red lit squircle ✕ at each card's **top-right**.
  - Gradient #F78673 → #EF2C10, with a thick white rounded ✕.
  - Its width is about 0.28 × the card width.
  - It sits slightly outside the card's corner.
- **Previews** dim to exactly 50% (black at 50% alpha, no tint).
- **Bottom bar:** lit **Done** and **Close all** buttons.
- **In the carousel:** the same bar appears automatically. There is also **one shared action row** for the centred card: Split view, Pop-up, Screenshot, App info. The row is not repeated on each card.
- **Done** returns to 2 per row.

---

## 3. The bottom toolbar

- **Contents:**
  - Back sits on the left as a lit squircle icon button.
  - App actions and tabs follow it.
  - The selected tab is a squircle highlight.
- **Style:** light N9 grey by default. An app may ask for the dark style (Settings does).
  - Within one flow the style never flips. Settings and its search use the same toolbar.
- **Apps can hide it.** The Settings main page has no toolbar; its sub-pages show one with Back.
- **Keyboard behaviour:**
  - The toolbar **hides while the keyboard is up**.
  - The keyboard has its own ⌄ hide key next to the microphone.
  - Above the keys sits the white N9 strip (emoticon, character counter, Send); in Messaging, a hardware keyboard gets the strip on its own.
  - There is **no system navigation strip under the keyboard**.

## 4. Settings

- There is **no search button**.
- Pulling down at the top of any Settings page reveals search.
- A hint follows the pull: "Pull down to search", then "Release to search".
- Everything Etesian adds is a normal setting in its own group, off by default, with no page of "extras". A page with such settings starts with a live preview that redraws as they change.
- Emergency information has its own page; on the lock screen it shows as the owner's block beside the clock, which opens a full-screen emergency card.

## 4b. System dialogs

Restyled as N9 pieces: the share sheet (a Filter field, pinned targets, all apps; suggested people optional), the power menu (Power off, Restart, Lock now, Emergency), permission dialogs (an N9 query dialog over a 90% dark backdrop), the privacy indicator, app pinning, and small bubbles for "Screenshot saved" (with Share and Edit), "Copied", screen recording (a red dot; tap to stop) and Wi-Fi sharing as a QR sheet. Private apps sit in a locked folder at the end of the app grid. Each one, with its mock and status, is in *Android features, the Etesian way* below.

---

## 5. Type follows the OS

- Everything is set in sp and dp.
- Respect Android's font size, display size and **Bold text** settings.
- Events use 16sp bold titles, 14sp regular summaries and 12sp times.
- **Do not hard-code bigger or bolder sizes "to look N9".** The N9 look comes from the typeface, weights and spacing, not from oversized text.

## 6. Shape and lighting

### Squircle

- **Exponent:** n = **2.8** exactly (see `src/squircle.ts` and `.hd-sq`).
- **Use it for:**
  - app icons;
  - avatars and contact photos;
  - notification icons;
  - icon buttons;
  - selected highlights (tabs, list selections, the calendar day).
- **Never use circles or rounded squares** for these.
- **Android adaptive icons** are drawn unmasked (the full foreground and background layers) and clipped to the squircle. Never use the system circle mask.
- **Not squircles:** windows, panels, cards and window thumbnails keep the card radius, `--hd-radius-card` (8dp).

### Top lighting

**Every button is top-lit like the icons** (see [06b Icon lighting](06b-icon-lighting.md) and `src/lighting.ts`). The measured dark button is:

| Property | Value |
|---|---|
| Gradient | #1C1C1C → #101010 → #080808 |
| Rim | 1px #393839 |
| Corner radius | about 21% of the button height |

Accent and negative buttons use the same structure with their base colour.

---

## 7. Mistakes not to repeat

1. **Guessed squircle exponents** (n = 4 or 5). The measured value is **2.8**.
2. **Circle masks on adaptive icons.** Draw the icon unmasked and clip it to the squircle.
3. **Rounded-rectangle buttons and selection highlights.** Icon buttons and highlights are squircles, and text buttons are lit with a radius of about 21% of their height.
4. **Oversized bold text** used "to look N9". Follow the OS type scale and the user's settings.
5. **A toolbar fighting the keyboard.** Hide the toolbar while the keyboard is up; the keyboard has its own hide key.
6. **A toolbar style flipping between screens of one flow** (Settings in dark, its search in light). Keep one style per flow.
7. **The ✕ on the wrong side.** The Open apps close button is at the **top-right**.
8. **Per-card action buttons repeated on every card.** Use one shared action row for the centred card.
9. (Desktop) **Squircle window thumbnails.** Thumbnails keep the window's aspect ratio and the card radius; only the app badge is a squircle.

## Exact values (from the phone)

> **Weights come from this spec, not from screenshots.** Reference screenshots from the ROM device may have Android's "Bold text" accessibility setting on, which shifts every weight up.

- **Lock screen**: the default is the stacked carousel. The newest 3 notifications show as cards; the rest show as strips beneath, each narrower and fainter. The N9 "More" label is optional. Each card has a #B30C0F12 tile with an 8dp radius and a 44dp lit squircle. The message is large (18) and REGULAR. The sender is on the next line (14 regular, 80% white), as "Sender · N more" for a group, and the time is on its own line (14 regular, 60% white). No bold in the cards; the date under the clock and "Swipe sideways to unlock" are regular.
- **Settings**: the main page is black with white text. It has no title bar and no toolbar, and it scrolls to the bottom. Pulling down shows "Pull down to search" and then "Release to search". Sub pages have a dark toolbar with only the lit squircle Back.
- **Events**: black background.
  - Header: the day (large, LIGHT 300) and the date (light, secondary grey, about 0.85× the day) on the left. On the right, the city (small bold) sits centred over a thin rule, with the temperature (light) and weather icon under it.
  - Section headers: grey bold with a rule, and a lit "Clear" or "Refresh" button.
  - Rows: 48dp squircle, title 16sp bold, summary 14sp regular, time 12sp regular grey. Settings rows: titles regular, subtitles regular grey. Open apps labels: regular, white.
- **Open apps**: 2 per row by default, showing app screenshots as previews. Labels are white. Edit mode dims only the previews, to 50%. In the carousel, one action row (Split view, Pop-up, Screenshot, App info) sits above the Done / Close all bar.
- **Tool bar**: light grey by default (#D6D6D8 to #ADADB0, with a dark top edge). Dark is a per-app variant. Back is a lit squircle button. A selected tab has a lighter squircle behind its icon. There is no system menu button.
