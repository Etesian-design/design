# OS UI/UX rules

The shell, the system apps and any app built for Etesian follow these rules, on every device.

## Reach and controls

1. **Actions live on the bottom toolbar, never at the top.** The bottom of the screen is where the thumb is; the top
   is the hardest place to reach. Page headers are plain titles, with no buttons in them.
   **The one exception is the N9's own: an editor sheet** (new contact, new alarm, compose) has Cancel and Save at
   the top of the sheet. A sheet is a separate task in its own frame, and the pair stays where every N9 editor put it.
   A web browser's address bar moves to the bottom with the rest (the N9 kept it on top; Etesian does not).
2. **Back is at the far left of the toolbar** by default, as on the N9, alone, as a lit squircle button. The other
   actions follow, evenly spaced, the outermost ones a fixed distance from the edges. A screen that is the first of
   its app has no Back. **The user may move Back to the far right** (one system setting, for the hand they hold the
   device in); only Back moves, the other items keep their order, and every app follows the setting.
3. **Fields may sit at the top.** A search field is where reading starts, not an action; its clear (✕) stays inside it.
4. **An app that runs elsewhere draws the same bar itself, at the bottom.** When the system toolbar is not there (another
   system, or the user turned it off), the app's own bar takes its place with the same items in the same order.
5. **Single hand mode** shrinks the whole screen (the same shape, a zoom out: apps are not told) into a corner, within
   reach. **Its size is the user's**, a slider with a live preview (50 to 90% of the width, 70% by default: half suits
   only very large devices). It always sits in a **corner**, never the middle; a tap in the empty space moves it to the
   corner nearest the tap, and a double tap there returns to full screen. It ends when the device locks or turns. Any
   system with a tall screen should offer it.

## Menus, choices and editing

6. **Every menu, choice list and long-press action is a sheet** (the N9 menu sheet or selection dialog), never a
   pop-up menu next to the finger, never a radio-button dialog.
7. **Long press means edit mode**, everywhere: on a card, on empty space, in a grid, in a menu. Items wobble, get their
   red ✕, and a Done bar appears at the bottom.
8. **Content is the interface.** Rows and cards have no buttons on them; their actions are a long press away, or on
   the toolbar for the one in focus.

## Navigation and motion

9. **Sub-pages come in from the right**, and Back sends them back out to the right.
10. **A surface leaves the way it came** (the status menu goes back up; a minimised app goes back to its side).
11. **One app, one window (or task).** Home never hosts an app; an app is never inside another one's history.
12. **The toolbar's style never flips inside one flow**, and never flashes another colour while changing.

## Lists and content

13. **No empty sections and no filler text** ("No new notifications"). An empty section is not shown.
14. **Group titles say what happened** ("2 missed calls"), never which app it came from.
15. **Long lists have fast scroll.**
16. **Every story or card in a picture feed has a picture.** One without gets a tile in its source's own colour with
    its name, so the feed keeps its rhythm.
17. **Reading is calm.** An article opens in a reader: only the text, the pictures and where it is from, in the
    system's type and colours, without the site's scripts or ads; the original is one tap away.

## Search

18. **One search finds everything**: applications first, the web last, and in between whatever matches best (people,
    messages, notifications including dismissed ones, settings pages, files, news). Matching is by the start of a name
    or of any word in it, or by initials. Enter opens the first result.

## Settings and additions

19. **Additions beyond the N9 are off by default**, each with its own setting under one heading of additions; with all
    of them off the system is the N9.
20. **A settings page with options starts with a live preview** of what they change.
21. **One red dot for anything being recorded or shared**, in the status bar; never a pill with a timer.

## Accessibility

The N9 was not designed for every user; where it falls short, Etesian keeps the look and fixes the reach.

23. **Every gesture has a button.** Edge swipes have Back and the toolbar; long press (edit mode, a row's actions)
    is also in the toolbar menu and in the screen reader's actions; single hand mode turns off from where it was
    turned on, not only by a double tap; the camera's tap-anywhere capture has a labelled shutter for screen readers
    and the volume key.
24. **Icon-only means labelled.** Every toolbar glyph, tab and bare key (the calculator's, the music controls) has a
    spoken name, and its touch target is 44 × 44 even when the glyph is drawn without a box.
25. **Never colour alone.** Today in the calendar is an orange squircle *and* bold; weekends are orange *and* in
    their own columns; an unread row has its bar *and* bold text; a selected segment is blue *and* announced.
26. **N9 greys are too faint for hints and secondary text on light grey.** Field hints (#A8A8A8 on #E3E6EA, about
    2:1) and small grey meta text fail contrast: use at least #6E6E6E (4.5:1) for anything that must be read, and
    keep the faint grey only for decoration.
27. **Type follows the user's size**, everywhere, including headers and the huge display type (Calculator, Browser's
    top sites), which may wrap but never clip.
28. **Sound and motion are the user's to turn down**: key clicks and UI sounds have their own switch, and reduced
    motion swaps slides and wobbles for fades.
29. **Handedness is a setting, not a design**: Back left or right (rule 2), single hand mode in any corner and at the user's size (rule 5).

## Shape

30. **Squircles** for icons, avatars, fields, icon buttons and highlights; **album art and photos stay square**; never
    pills or circles for those.
