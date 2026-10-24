# Sound & haptics

No N9 sound files are included.

## N9 behaviour (reference)

- Feedback was primarily **haptic**: a short, crisp vibration on key presses (virtual keyboard),
  long-press, and toggles; a slightly longer pulse on gesture commits (minimise/close).
- Sounds: short, soft, organic tones for notifications and the keyboard; nothing for ordinary taps.
- Silence by default: UI sounds followed the profile (Ringing / Beep / Silent).

## Guidance (EXT)

- OS UIs: use a 10-15ms haptic tick for taps on keys and switches, 20-30ms for long-press and
  gesture commit. Never vibrate on scroll.
- Web: do not play sounds without user intent. `navigator.vibrate` only for explicit,
  user-triggered actions in installed web apps, and never as the only feedback.
- Every sound or haptic has a visual equivalent (accessibility).
