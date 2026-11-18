<script setup lang="ts">
/**
 * The N9 virtual keyboard (Etesian's LatinIME theme), as on the phone:
 * - letters in lower case; Shift once gives one capital, then lower case again;
 * - a double tap on Shift is caps lock: the Shift key turns plain white (no lighting) with a black arrow;
 * - bottom row ?123 / , / globe / space / . / Enter; the globe switches language (with one language it offers the
 *   languages and keyboards);
 * - every key is lit like the icons (docs/06b-icon-lighting.md): lighter top rim, gradient flat below 72%, an
 *   off-white raised label with a white top edge and its shadow; a pressed key sinks in (darker, the gradient
 *   turned over, the rim in shadow);
 * - each key press clicks (docs/08-sound-haptics.md).
 */
import { computed } from 'vue';
import HdIcon from './HdIcon.vue';

export type HdKeyboardShift = 'off' | 'once' | 'locked';

const props = withDefaults(defineProps<{
  /** off: lower case; once: the next letter is a capital; locked: caps lock (double tap on Shift). */
  shift?: HdKeyboardShift;
  /** A key shown held down (its label, or 'shift', 'backspace', 'symbols', 'globe', 'space', 'enter'). */
  pressed?: string;
}>(), { shift: 'off' });
const emit = defineEmits<{ key: [key: string] }>();

const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const upper = computed(() => props.shift !== 'off');
const label = (k: string) => (upper.value ? k.toUpperCase() : k);
const isPressed = (k: string) => props.pressed === k;
</script>

<template>
  <div class="hd-kb" role="group" aria-label="Keyboard">
    <div class="hd-kb__row">
      <button v-for="k in rows[0]" :key="k" type="button" class="hd-kb__key" :class="{ 'is-pressed': isPressed(k) }"
        @click="emit('key', k)"><span class="hd-kb__label">{{ label(k) }}</span></button>
    </div>
    <div class="hd-kb__row hd-kb__row--inset">
      <button v-for="k in rows[1]" :key="k" type="button" class="hd-kb__key" :class="{ 'is-pressed': isPressed(k) }"
        @click="emit('key', k)"><span class="hd-kb__label">{{ label(k) }}</span></button>
    </div>
    <div class="hd-kb__row">
      <button type="button" class="hd-kb__key hd-kb__key--fn hd-kb__key--shift"
        :class="{ 'is-pressed': isPressed('shift'), 'is-locked': shift === 'locked', 'is-once': shift === 'once' }"
        :aria-label="shift === 'locked' ? 'Caps lock on' : 'Shift'" :aria-pressed="shift !== 'off'"
        @click="emit('key', 'shift')"><HdIcon name="shift" :size="22" /></button>
      <button v-for="k in rows[2]" :key="k" type="button" class="hd-kb__key" :class="{ 'is-pressed': isPressed(k) }"
        @click="emit('key', k)"><span class="hd-kb__label">{{ label(k) }}</span></button>
      <button type="button" class="hd-kb__key hd-kb__key--fn hd-kb__key--side" :class="{ 'is-pressed': isPressed('backspace') }"
        aria-label="Backspace" @click="emit('key', 'backspace')"><HdIcon name="backspace" :size="22" /></button>
    </div>
    <div class="hd-kb__row">
      <button type="button" class="hd-kb__key hd-kb__key--fn hd-kb__key--w15" :class="{ 'is-pressed': isPressed('symbols') }"
        @click="emit('key', 'symbols')"><span class="hd-kb__label hd-kb__label--fn">?123</span></button>
      <button type="button" class="hd-kb__key hd-kb__key--w10" :class="{ 'is-pressed': isPressed(',') }"
        @click="emit('key', ',')"><span class="hd-kb__label">,</span></button>
      <button type="button" class="hd-kb__key hd-kb__key--w10" :class="{ 'is-pressed': isPressed('globe') }"
        aria-label="Language" @click="emit('key', 'globe')"><HdIcon name="globe" :size="22" /></button>
      <button type="button" class="hd-kb__key hd-kb__key--w40" :class="{ 'is-pressed': isPressed('space') }"
        aria-label="Space" @click="emit('key', 'space')"></button>
      <button type="button" class="hd-kb__key hd-kb__key--w10" :class="{ 'is-pressed': isPressed('.') }"
        @click="emit('key', '.')"><span class="hd-kb__label">.</span></button>
      <button type="button" class="hd-kb__key hd-kb__key--fn hd-kb__key--w15" :class="{ 'is-pressed': isPressed('enter') }"
        aria-label="Enter" @click="emit('key', 'enter')"><HdIcon name="enter" :size="22" /></button>
    </div>
  </div>
</template>

<style>
/* Values match the ROM (LatinIME colors-n9.xml): letter keys #333333 → #141414, functional keys #5C5C5C → #3B3B3B,
   the gradient flat below 72%, a 1.5px lighter top rim; pressed keys #0B0B0B → #1A1A1A with the rim in shadow. */
.hd-kb { flex: none; display: grid; grid-template-rows: repeat(4, 1fr); gap: 7px; height: 240px; padding: 8px 3px;
  background: #000; user-select: none; }
.hd-kb__row { display: flex; gap: 5px; justify-content: center; min-width: 0; }
.hd-kb__row--inset { padding: 0 5%; }
.hd-kb__key { --hd-kb-top: #333333; --hd-kb-bottom: #141414; --hd-kb-rim: rgba(255, 255, 255, 0.12);
  flex: 1 1 0; min-width: 0; display: grid; place-items: center; padding: 0; border: 0; border-radius: 5px; cursor: pointer;
  color: #F6F8ED; background: linear-gradient(var(--hd-kb-top) 10%, var(--hd-kb-bottom) 72%);
  box-shadow: inset 0 1.5px 0 var(--hd-kb-rim); font: 700 22px/1 var(--hd-font-family-base); }
.hd-kb__key--fn { --hd-kb-top: #5C5C5C; --hd-kb-bottom: #3B3B3B; --hd-kb-rim: rgba(255, 255, 255, 0.18); }
.hd-kb__key--shift, .hd-kb__key--side { flex: 1.5 1 0; }
.hd-kb__key--w15 { flex: 1.5 1 0; } .hd-kb__key--w10 { flex: 1 1 0; } .hd-kb__key--w40 { flex: 4 1 0; }
/* The label: off-white, lighter at the top, a white top edge and its shadow cast straight down. */
.hd-kb__label { background: linear-gradient(#F6F8ED, #EAE9E3 50%, #D0C9C6); -webkit-background-clip: text; background-clip: text;
  color: transparent; filter: drop-shadow(0 -1px 0 rgba(255, 255, 255, 0.8)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35)); }
.hd-kb__label--fn { font-size: 17px; }
.hd-kb__key .hd-icon { filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35)); }
/* Pressed: sunk in. */
.hd-kb__key.is-pressed, .hd-kb__key:active { --hd-kb-rim: rgba(0, 0, 0, 0.8);
  background: linear-gradient(#0B0B0B 10%, #1A1A1A 72%); }
.hd-kb__key--fn.is-pressed, .hd-kb__key--fn:active { background: linear-gradient(#1F1F1F 10%, #303030 72%); }
/* Caps lock: plain white, no lighting, a black arrow. */
.hd-kb__key--shift.is-locked { background: #FFFFFF; box-shadow: none; color: #000; }
.hd-kb__key--shift.is-locked .hd-icon { filter: none; }
.hd-kb__key:focus-visible { outline: 2px solid var(--hd-color-accent, #F26B1D); outline-offset: 1px; }
</style>
