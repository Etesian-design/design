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

Every key on the virtual keyboard clicks, **on by default** (the N9 clicked on every key; a keyboard without it
felt dead). The click is short and crisp: a bright tick of a few milliseconds on a tiny wooden body that dies
within ~15 ms. On the phone it is Etesian's own `vkb_popup_press` (sounds/tones.py), or the N9's original when the
user imported their N9 files. It follows the ringer: silent mode silences it.

## Guidance (EXT)

- OS UIs: use a 10-15ms haptic tick for taps on keys and switches, 20-30ms for long-press and
  gesture commit. Never vibrate on scroll.
- Web: do not play sounds without user intent. `navigator.vibrate` only for explicit,
  user-triggered actions in installed web apps, and never as the only feedback.
- Every sound or haptic has a visual equivalent (accessibility).
