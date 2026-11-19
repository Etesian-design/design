# Building an operating system the Etesian way

The rules every part of an Etesian system follows: the shell, the system apps and any app made for it. They hold on
any platform (a phone, a tablet, a desktop, a web desktop), not only on the Android ROM where most of them were first
built; each one says why, so a new platform can apply it rather than copy a screen. The phone chapter (20) shows how
each is built there.

## Reach and controls

1. **Actions live on the bottom toolbar, never at the top.** The bottom of the screen is where the thumb is; the top
   is the hardest place to reach. Page headers are plain titles, with no buttons in them.
2. **Back is always at the far left of the toolbar**, alone, as a lit squircle button. The other actions follow,
   evenly spaced, the outermost ones a fixed distance from the edges. A screen that is the first of its app has no Back.
3. **Fields may sit at the top.** A search field is where reading starts, not an action; its clear (✕) stays inside it.
4. **An app that runs elsewhere draws the same bar itself, at the bottom.** When the system toolbar is not there (another
   system, or the user turned it off), the app's own bar takes its place with the same items in the same order.
5. **Single hand mode** shrinks the whole screen to half its size (the same shape, a zoom out: apps are not told) at the
   bottom, within reach. Tapping the empty space moves it to that side; a double tap there returns to full screen. It
   ends when the device locks or turns. Any system with a tall screen should offer it.

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

## Shape

22. **Squircles** for icons, avatars, fields, icon buttons and highlights; **album art and photos stay square**; never
    pills or circles for those.
