<script setup lang="ts">
/**
 * TimeDial (the N9 Clock's alarm time setter, recreated): the time in large light type over two rings. The outer light
 * ring holds the minutes (a dark knob), the inner dark disc the hours of the day (a light knob, 24 to the turn). Drag a
 * knob around, or focus it and use the arrow keys (Page Up / Down: 10 minutes or 3 hours).
 * v-model: "HH:mm" (24-hour).
 */
import { computed, ref } from 'vue';
const props = withDefaults(defineProps<{ modelValue?: string; size?: number; label?: string }>(), { modelValue: '07:00', size: 292, label: 'Time' });
const emit = defineEmits<{ 'update:modelValue': [v: string] }>();
const pad = (n: number) => String(n).padStart(2, '0');
const h = computed(() => (parseInt(props.modelValue.split(':')[0] ?? '0', 10) || 0) % 24);
const m = computed(() => (parseInt(props.modelValue.split(':')[1] ?? '0', 10) || 0) % 60);
const set = (hh: number, mm: number) => emit('update:modelValue', `${pad(((hh % 24) + 24) % 24)}:${pad(((mm % 60) + 60) % 60)}`);

/* geometry: the inner disc is 45 % of the dial wide; each knob runs in the middle of its ring */
const R = computed(() => props.size / 2);
const core = computed(() => props.size * 0.225);
const knobR = computed(() => props.size * 0.088);
const minR = computed(() => (R.value + core.value) / 2);
const hourR = computed(() => core.value - knobR.value - props.size * 0.02);
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
    else set(Math.round(deg / 15) % 24, m.value);
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
            :style="{ ...at(h * 15, hourR), width: `${knobR * 2}px`, height: `${knobR * 2}px`, margin: `${-knobR}px 0 0 ${-knobR}px` }"
            @pointerdown.prevent="drag($event, 'h')" @keydown="key($event, 'h')">{{ pad(h) }}</span>
    </div>
  </div>
</template>
<style>
.hd-td { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.hd-td__time { font: 200 3.4rem/1 var(--hd-font-family-light); color: var(--hd-c-fg); }
.hd-td__ring { position: relative; flex: none; border-radius: 50%; touch-action: none; background: radial-gradient(circle at 50% 30%, #f1f1f1, #c8c8c9 80%); box-shadow: 0 0 0 2px #fff, 0 1px 4px rgba(0, 0, 0, .3); }
.hd-td__core { position: absolute; border-radius: 50%; background: radial-gradient(circle at 50% 25%, #3a3a3a, #141414 70%); box-shadow: inset 0 3px 6px rgba(0, 0, 0, .6); }
.hd-td__knob { position: absolute; display: grid; place-items: center; border-radius: 50%; cursor: grab; font: 300 1.375rem/1 var(--hd-font-family-light); box-shadow: 0 2px 4px rgba(0, 0, 0, .4); user-select: none; }
.hd-td__knob:active { cursor: grabbing; }
.hd-td__knob:focus-visible { outline: var(--hd-size-focus-ring, 2px) solid var(--hd-c-focus, #1C8FD8); outline-offset: 2px; }
.hd-td__knob.is-min { background: radial-gradient(circle at 50% 30%, #4a3a30, #241a14); color: #fff; }
.hd-td__knob.is-hour { background: radial-gradient(circle at 50% 30%, #e8e8e8, #b4b4b4); color: #222; }
</style>
