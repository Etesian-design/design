# 21 · The desktop (decisions so far)

This chapter is the desktop counterpart of [20 · The phone](20-phone.md). It records what Desktop v2 (Storybook: *Explorations / Desktop v2*) decided, and what was tried and rejected. **Desktop v2 extends Desktop v1; it does not replace it.** Everything v1 has stays, above all v1 A's **Overview** as the main menu (Super); v2's pieces are additions. The phone chapter's rules still apply: squircle n = 2.8, top-lit buttons, type that follows the OS, and the Events order.

## Windows

- **Overlapping windows, plus snapping.**
  - Dragging a window shows numbered snap zones.
  - Dragging to the top edge, or pressing Super+Z, opens the layout picker.
  - Super+Left/Right snaps the focused window, Super+Up maximises it, and Super+Down floats it again.
- **App actions live in the window decorations.** The app's toolbar *is* the title bar. From left to right:
  - Back (or the app squircle when there is no navigation);
  - the title, which opens a view menu when the app has views;
  - the app's actions and menu;
  - a divider;
  - minimise, maximise and close.
- There is no second app bar inside the window.
- Inactive windows fade their header to 50%.

## Global menu bar

- The left side shows the focused app's name and its menus. Alt opens them.
- The right side holds the Events count, the status icons, and **the clock at the far right**.

## Dock

- **Default: a light floating strip** on the left edge.
  - It is centred vertically and only as long as its icons (Unity's position, the macOS dock's shape).
  - Order: **Overview button | separator | pinned and running apps | separator | recycle bin**. The recycle bin is always last.
  - Running apps get a small dot on the screen-edge side.
- **Options** (Edit dock → settings):
  - a full-height Plasma-style panel;
  - a clock widget;
  - window previews on hover — items stay squircle icons, and the preview keeps the window's exact aspect ratio;
  - icon size, auto-hide, and position (any edge).
- Plain icons are the default.

## Super+Tab: quick switcher and task viewer

- **Super+Tab** opens the **carousel**: one large card for the current selection, with its neighbours peeking in at the sides.
- **While Super is held:**
  - Tab moves to the next window, and Shift+Tab goes back.
  - **Releasing Super switches** to the selected window and closes the view.
  - A hint reads "Release Super to switch · Scroll to keep open".
- **Locking:** while Super is held, the **wheel** (or a pinch on the touchpad) zooms out — carousel → 2 → 3 → 4 per row, like pinch in the phone's Open apps — and **locks** the view.
  - A locked view stays open after Super is released, until you pick a window or press Esc.
  - Zooming in at the carousel also locks it, with no visual change.
- The view shows **only open windows**. Each card keeps its window's aspect ratio and the card radius; only the app badge is a squircle.
## Overview (Super) and spotlight (Super+Space)

- **Tapping Super alone** (pressed and released with no other key), or the dock's first button, opens the **Overview**, v1 A's main menu: full screen under the menu bar, in the N9 home order — **Events** on the left, the **open windows** as live thumbnails in the middle (two per row, close on hover), the **apps** on the right with type-to-search.
  - Just start typing to search; Tab moves between the columns; Enter opens; Ctrl+W closes a window; Esc or Super closes it.
- **Super+Space** opens the **spotlight**, a v2 addition: a compact search field plus the app grid over the windows; typing finds apps, people, mail and files. It does not replace the Overview.

## Events panel and status menu

- **Super+N**, or the count in the bar, opens Events from the right. It is exactly the phone's Events view:
  - day and date, time, weather;
  - then Notifications, Calendar (today) and Feeds.
- Tapping the date expands a month calendar, with one-line entries for the selected day.
- Connectivity toggles, Silent, Focus, volume and brightness live in a **separate status menu**, opened from the status icons in the bar.

## Touchpad gestures (core)

| Gesture | Result |
|---|---|
| Three fingers sideways | The N9 side swipe: minimise to the desktop; keep swiping to switch windows. |
| Three fingers down | The N9 swipe-down close, with no confirmation. **Only through a setting (Touchpad → Swipe down to close), OFF by default** so nobody is surprised. |
| Pinch | Zooms the Windows view (carousel, 2, 3, 4 per row), the same as Super + wheel. |

The two core gestures (sideways and pinch) appear in the key hints alongside the keyboard shortcuts. The swipe-down setting is shown, switched off, in the touchpad hint.

## Rejected, and why

| Idea | Why it was rejected |
|---|---|
| **A Windows-style full-height left panel as the default dock** | Too heavy. It is kept only as an option. |
| **Full-screen three views on a horizontal track** (v1 B: Events / Windows / Applications as pages you slide between) | Wastes space. The Super+Tab carousel and viewer cover window switching. This is not v1 A's three-column Overview, which stays the main menu (Super). |
| **Connectivity toggles and volume inside Events** | Events must match the phone exactly. These moved to the status menu. |
| **Dragging the title bar down to close** | Accidental closes, and it conflicts with snapping to the bottom. The optional three-finger swipe down (off by default) covers the N9 close instead. |
| **Squircle window thumbnails in the dock** | Windows and thumbnails are not squircles. Thumbnails became optional hover previews in the window's real aspect ratio. |
