# Sound & haptics

No N9 sound files are included. Etesian has its own sounds, made from scratch: on the phone the startup
sound (water drops on the boot ripple, then a warm chord). The N9's UI sounds (button click, edit mode, close)
play only when the user imports their own N9 files.

## N9 behaviour (reference)

- Feedback was primarily **haptic**: a short, crisp vibration on key presses (virtual keyboard),
  long-press, and toggles; a slightly longer pulse on gesture commits (minimise/close).
- Sounds: short, soft, organic tones for notifications and the keyboard; nothing for ordinary taps.
- Silence by default: UI sounds followed the profile (Ringing / Beep / Silent).

## Keyboard click

Every key on the virtual keyboard clicks **in and out**, **on by default**, like a button: a lower click when the
key goes down (~1.25 kHz body) and a higher one when it comes back up (~2.6 kHz). Holding a key plays only the
first; the second comes when it is let go. Each is a bright tick of a few milliseconds on a tiny body that dies
within ~10 ms. On the phone they are Etesian's own `vkb_press` / `vkb_release` (sounds/tones.py), or the N9's
press and release sounds when the user imported their N9 files. They follow the ringer: silent mode silences them.

## The sound map (phone)

Which moment makes which sound. Every sound follows the profile (Silent silences all but alarms and calls) and
the UI sounds switch; the N9 column needs the user's own imported files, otherwise Etesian's own or nothing.

| Moment | Sound | Notes |
|---|---|---|
| Key goes down / comes up (keyboard) | press / release click | on by default, see above |
| Button or icon press | the same press click | buttons and keys share one sound (N9 `static_press`) |
| Long press enters **edit mode** | the edit "scratch" (N9 `popup`) | played once, even when one press both long-presses and enters edit mode |
| An app is **closed** (swipe down, ✕) | close | Close all plays `close_multiple` once, not one per app |
| Volume keys | a tone at each step; a different one at the **top** and **bottom** stop | the N9's `volume_max` / `volume_min`; changing profile with the keys plays `profile_switch` |
| Startup | Etesian's boot sound: water drops on the ripple, then a warm chord | plays once the phone has booted, over the boot animation's first part |
| Minimise, scroll, page change | none | the N9 made no sound for ordinary navigation |

## Guidance (EXT)

- OS UIs: use a 10-15ms haptic tick for taps on keys and switches, 20-30ms for long-press and
  gesture commit. Never vibrate on scroll.
- Web: do not play sounds without user intent. `navigator.vibrate` only for explicit,
  user-triggered actions in installed web apps, and never as the only feedback.
- Every sound or haptic has a visual equivalent (accessibility).
