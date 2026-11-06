<script setup lang="ts">
/**
 * TimeDial (the N9 Clock's alarm time setter, recreated): the time in large light type over a recessed disc lit from
 * above. The outer light ring holds the minutes (a flat dark brown knob), the inner black disc the hours (a flat light
 * knob, 12 to the turn as on the N9: going past 12 switches between morning and afternoon). Each knob runs near the outer
 * edge of its ring. Drag a knob around, or focus it and use the arrow keys (Page Up / Down: 10 minutes or 3 hours).
 * v-model: "HH:mm" (24-hour).
 */
import { computed, ref } from 'vue';
const props = withDefaults(defineProps<{ modelValue?: string; size?: number; label?: string }>(), { modelValue: '07:00', size: 292, label: 'Time' });
const emit = defineEmits<{ 'update:modelValue': [v: string] }>();
const pad = (n: number) => String(n).padStart(2, '0');
const h = computed(() => (parseInt(props.modelValue.split(':')[0] ?? '0', 10) || 0) % 24);
const m = computed(() => (parseInt(props.modelValue.split(':')[1] ?? '0', 10) || 0) % 60);
const set = (hh: number, mm: number) => emit('update:modelValue', `${pad(((hh % 24) + 24) % 24)}:${pad(((mm % 60) + 60) % 60)}`);

/* geometry, measured on the N9: inner disc 55 % of the dial wide, knobs 18 %, each about 5 % in from its ring's outer edge */
const R = computed(() => props.size / 2);
const core = computed(() => R.value * 0.553);
const knobR = computed(() => R.value * 0.18);
const minR = computed(() => R.value * 0.77);
const hourR = computed(() => R.value * 0.327);
const at = (deg: number, r: number) => ({ left: `${R.value + r * Math.sin((deg * Math.PI) / 180)}px`, top: `${R.value - r * Math.cos((deg * Math.PI) / 180)}px` });

const dial = ref<HTMLElement | null>(null);
function drag(e: PointerEvent, which: 'h' | 'm') {
  const el = e.currentTarget as HTMLElement;
  el.setPointerCapture?.(e.pointerId);
  el.focus();
  const move = (ev: PointerEvent) => {
    const b = dial.value!.getBoundingClientRect();
    const deg = ((Math.atan2(ev.clientX - (b.left + b.width / 2), -(ev.clientY - (b.top + b.height / 2))) * 180) / Math.PI + 360) % 360;
    if (which === 'm') set(h.value, Math.round(deg / 6) % 60);
    else {
      const i = Math.round(deg / 30) % 12, was = h.value % 12;
      let pm = h.value >= 12;
      if ((was === 11 && i === 0) || (was === 0 && i === 11)) pm = !pm; // past 12: the other half of the day
      set(i + (pm ? 12 : 0), m.value);
    }
  };
  move(e);
  const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
  el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
}
function key(e: KeyboardEvent, which: 'h' | 'm') {
  const step = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: which === 'm' ? 10 : 3, PageDown: which === 'm' ? -10 : -3 }[e.key];
  if (step === undefined) return;
  e.preventDefault();
  if (which === 'm') set(h.value, m.value + step); else set(h.value + step, m.value);
}
</script>
<template>
  <div class="hd-td" role="group" :aria-label="label">
    <div class="hd-td__time" aria-live="polite">{{ pad(h) }}:{{ pad(m) }}</div>
    <div ref="dial" class="hd-td__ring" :style="{ width: `${size}px`, height: `${size}px` }">
      <div class="hd-td__core" :style="{ inset: `${R - core}px` }"></div>
      <span class="hd-td__knob is-min" role="slider" tabindex="0" aria-label="Minutes" aria-valuemin="0" aria-valuemax="59" :aria-valuenow="m"
            :style="{ ...at(m * 6, minR), width: `${knobR * 2}px`, height: `${knobR * 2}px`, margin: `${-knobR}px 0 0 ${-knobR}px` }"
            @pointerdown.prevent="drag($event, 'm')" @keydown="key($event, 'm')">{{ pad(m) }}</span>
      <span class="hd-td__knob is-hour" role="slider" tabindex="0" aria-label="Hours" aria-valuemin="0" aria-valuemax="23" :aria-valuenow="h"
            :style="{ ...at((h % 12) * 30, hourR), width: `${knobR * 2}px`, height: `${knobR * 2}px`, margin: `${-knobR}px 0 0 ${-knobR}px` }"
            @pointerdown.prevent="drag($event, 'h')" @keydown="key($event, 'h')">{{ pad(h) }}</span>
    </div>
  </div>
</template>
<style>
.hd-td { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.hd-td__time { font: 200 3.4rem/1 var(--hd-font-family-light); letter-spacing: 3px; color: var(--hd-c-fg); }
.hd-td__ring { position: relative; flex: none; border-radius: 50%; touch-action: none; background: linear-gradient(#eeeeee 10%, #c9c9c9);
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, .3), 0 1px 0 rgba(255, 255, 255, .9); }
/* black; the light from above only catches a little of its top, just under the shadow of the rim */
.hd-td__core { position: absolute; border-radius: 50%; background: radial-gradient(ellipse 75% 32% at 50% 6%, rgba(255, 255, 255, .13), transparent 75%), #0d0d0d;
  box-shadow: inset 0 3px 3px rgba(0, 0, 0, .7), 0 1.5px 0 #fff; }
.hd-td__knob { position: absolute; display: grid; place-items: center; border-radius: 50%; cursor: grab; font: 200 1.625rem/1 var(--hd-font-family-light); box-shadow: 0 1px 3px rgba(0, 0, 0, .35); user-select: none; }
.hd-td__knob:active { cursor: grabbing; }
.hd-td__knob:focus-visible { outline: var(--hd-size-focus-ring, 2px) solid var(--hd-c-focus, #1C8FD8); outline-offset: 2px; }
.hd-td__knob.is-min { background: #312018; color: #f2ece6; }
.hd-td__knob.is-hour { background: #bdc0bd; color: #222; box-shadow: 0 2px 4px rgba(0, 0, 0, .6); }
</style>
