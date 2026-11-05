<script setup lang="ts">
/**
 * TimePicker (N9 TimePickerDialog / Tumbler, recreated): a dark dialog with a coloured bold title, large light hour and
 * minute columns that flick vertically (drag, wheel, Up/Down keys, or tap a value), the selected row centred in a
 * highlighted band across the columns, AM/PM buttons in 12-hour mode, and lit Accept / Cancel buttons.
 * v-model: "HH:mm" (24-hour).
 */
import { ref, computed, watch } from 'vue';
const props = withDefaults(defineProps<{ modelValue?: string; title?: string; hour24?: boolean; acceptLabel?: string; cancelLabel?: string; minuteStep?: number }>(),
  { modelValue: '10:45', title: 'Pick time', hour24: false, acceptLabel: 'Done', cancelLabel: 'Cancel', minuteStep: 1 });
const emit = defineEmits<{ 'update:modelValue': [v: string]; accept: [v: string]; cancel: [] }>();
const parse = (v: string) => { const [h, m] = v.split(':').map((n) => parseInt(n, 10)); return { h: (h ?? 0) % 24, m: (m ?? 0) % 60 }; };
const h = ref(parse(props.modelValue).h);
const m = ref(parse(props.modelValue).m);
watch(() => props.modelValue, (v) => { const p = parse(v); h.value = p.h; m.value = p.m; });
const pm = computed(() => h.value >= 12);
const value = computed(() => `${String(h.value).padStart(2, '0')}:${String(m.value).padStart(2, '0')}`);
function commit() { emit('update:modelValue', value.value); }
/** column models: values shown and the selected index */
const hours = computed(() => (props.hour24 ? Array.from({ length: 24 }, (_, i) => i) : Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i))));
const hourIndex = computed(() => (props.hour24 ? h.value : h.value % 12));
const minutes = computed(() => Array.from({ length: Math.ceil(60 / props.minuteStep) }, (_, i) => i * props.minuteStep));
const minuteIndex = computed(() => Math.round(m.value / props.minuteStep) % minutes.value.length);
function setHourIndex(i: number) { const n = hours.value.length; i = ((i % n) + n) % n; h.value = props.hour24 ? i : i + (pm.value ? 12 : 0); commit(); }
function setMinuteIndex(i: number) { const n = minutes.value.length; i = ((i % n) + n) % n; m.value = minutes.value[i]!; commit(); }
function setPm(on: boolean) { if (on !== pm.value) { h.value = (h.value + 12) % 24; commit(); } }
const ROW = 64, VISIBLE = 5;
/** the rows around the selection (loops), offset -2..+2 */
const around = (list: number[], idx: number) => Array.from({ length: VISIBLE }, (_, k) => { const o = k - 2; const n = list.length; return { o, v: list[(((idx + o) % n) + n) % n]! }; });
const pad = (n: number, hourCol: boolean) => (hourCol && !props.hour24 ? String(n) : String(n).padStart(2, '0'));
/* flick: drag vertically, one step per row height; wheel steps one */
let drag: { y: number; col: 'h' | 'm'; start: number } | null = null;
function down(e: PointerEvent, col: 'h' | 'm') { drag = { y: e.clientY, col, start: col === 'h' ? hourIndex.value : minuteIndex.value }; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); }
function move(e: PointerEvent) { if (!drag) return; const steps = Math.round((drag.y - e.clientY) / ROW); (drag.col === 'h' ? setHourIndex : setMinuteIndex)(drag.start + steps); }
function up() { drag = null; }
function wheel(e: WheelEvent, col: 'h' | 'm') { e.preventDefault(); const d = e.deltaY > 0 ? 1 : -1; if (col === 'h') setHourIndex(hourIndex.value + d); else setMinuteIndex(minuteIndex.value + d); }
function key(e: KeyboardEvent, col: 'h' | 'm') {
  const d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : e.key === 'PageDown' ? 5 : e.key === 'PageUp' ? -5 : 0;
  if (!d) return; e.preventDefault();
  if (col === 'h') setHourIndex(hourIndex.value + d); else setMinuteIndex(minuteIndex.value + d);
}
</script>
<template>
  <section class="hd-timepicker" role="dialog" :aria-label="title">
    <h2 class="hd-timepicker__title">{{ title }}</h2>
    <div class="hd-timepicker__tumbler" :style="{ height: `${ROW * VISIBLE}px`, '--hd-tp-row': `${ROW}px` }">
      <span class="hd-timepicker__band" aria-hidden="true"></span>
      <div v-for="col in (['h', 'm'] as const)" :key="col" class="hd-timepicker__col hd-focusable" role="spinbutton" tabindex="0"
        :aria-label="col === 'h' ? 'Hours' : 'Minutes'" :aria-valuenow="col === 'h' ? (hour24 ? h : hours[hourIndex]) : m"
        :aria-valuemin="col === 'h' ? (hour24 ? 0 : 1) : 0" :aria-valuemax="col === 'h' ? (hour24 ? 23 : 12) : 59"
        @pointerdown="down($event, col)" @pointermove="move" @pointerup="up" @pointercancel="up" @wheel="wheel($event, col)" @keydown="key($event, col)">
        <span class="hd-timepicker__label">{{ col === 'h' ? 'HR' : 'MIN' }}</span>
        <button v-for="r in around(col === 'h' ? hours : minutes, col === 'h' ? hourIndex : minuteIndex)" :key="r.o" type="button" tabindex="-1"
          class="hd-timepicker__item" :class="{ 'is-sel': r.o === 0 }" :style="{ opacity: r.o === 0 ? 1 : Math.abs(r.o) === 1 ? 0.5 : 0.22 }"
          @click="r.o && (col === 'h' ? setHourIndex(hourIndex + r.o) : setMinuteIndex(minuteIndex + r.o))">{{ pad(r.v, col === 'h') }}</button>
      </div>
      <div v-if="!hour24" class="hd-timepicker__ampm hd-btn-group-lit hd-vertical" role="radiogroup" aria-label="AM or PM">
        <button type="button" role="radio" class="hd-timepicker__ap hd-focusable" :class="{ 'is-on': !pm }" :aria-checked="!pm ? 'true' : 'false'" @click="setPm(false)">AM</button>
        <button type="button" role="radio" class="hd-timepicker__ap hd-focusable" :class="{ 'is-on': pm }" :aria-checked="pm ? 'true' : 'false'" @click="setPm(true)">PM</button>
      </div>
    </div>
    <footer class="hd-timepicker__buttons">
      <button type="button" class="hd-dark-btn hd-sqf hd-focusable" @click="emit('accept', value)">{{ acceptLabel }}</button>
      <button type="button" class="hd-dark-btn hd-sqf hd-focusable" @click="emit('cancel')">{{ cancelLabel }}</button>
    </footer>
  </section>
</template>
<style>
/* N9 dialogs are always dark, whatever the colour mode */
.hd-timepicker { --hd-c-button-bg: #1C1C1C; display: inline-flex; flex-direction: column; width: 400px; max-width: 100%; padding: 16px 16px 14px; border-radius: var(--hd-radius-card); background: #000; color: #fff; box-shadow: 0 0 0 1px #262626; user-select: none; }
.hd-timepicker__title { margin: 4px 4px 12px; font: 700 24px/1.1 var(--hd-font-family-base); color: var(--hd-accent); }
.hd-timepicker__tumbler { position: relative; display: flex; justify-content: center; gap: 4px; overflow: hidden; }
.hd-timepicker__band { position: absolute; left: 0; right: 0; top: calc(var(--hd-tp-row) * 2); height: var(--hd-tp-row); background: linear-gradient(#2a2a2a, #1a1a1a); border-top: 1px solid #3a3a3a; border-bottom: 1px solid #0a0a0a; box-shadow: 0 1px 0 #262626; pointer-events: none; }
.hd-timepicker__col { position: relative; z-index: 1; display: flex; flex-direction: column; width: 110px; cursor: ns-resize; touch-action: none; border-radius: 4px; }
.hd-timepicker__label { position: absolute; top: calc(var(--hd-tp-row) * 2 + 6px); right: 2px; font: 700 10px/1 var(--hd-font-family-base); color: var(--hd-accent); letter-spacing: .04em; }
.hd-timepicker__item { flex: none; height: var(--hd-tp-row); padding: 0; border: 0; background: none; color: #fff; font: var(--hd-font-weight-light) 44px/1 var(--hd-font-family-light); font-variant-numeric: tabular-nums; cursor: inherit; }
.hd-timepicker__item.is-sel { font-size: 52px; }
.hd-timepicker__ampm { position: relative; z-index: 1; align-self: center; flex-direction: column; margin-left: 10px; --hd-c-button-bg: #1C1C1C; }
.hd-timepicker__ap { width: 64px; height: 44px; padding: 0; border: 0; background: transparent; color: #fff; font: 700 var(--hd-font-size-default)/1 var(--hd-font-family-base); cursor: pointer; }
.hd-timepicker__ap + .hd-timepicker__ap { border-top: 1px solid var(--hd-btn-rim); }
.hd-timepicker__ap.is-on { background: linear-gradient(color-mix(in srgb, var(--hd-accent) 88%, #fff), var(--hd-accent) 50%, color-mix(in srgb, var(--hd-accent) 88%, #000)); box-shadow: inset 0 1px 0 rgba(255,255,255,.3); }
.hd-timepicker__buttons { display: flex; gap: 6px; margin-top: 14px; }
/* lit N9 dark button (as in the Open apps edit-mode bar): #1C1C1C -> #101010 -> #080808, rim #393839, radius 21% of height */
.hd-dark-btn { flex: 1 1 0; height: 48px; padding: 0 16px; border: 1px solid #393839; border-top-color: #4a494a; border-radius: calc(48px * .21); background: linear-gradient(#1C1C1C, #101010 50%, #080808); box-shadow: inset 0 1px 0 rgba(255,255,255,.08); color: #fff; font: 700 var(--hd-font-size-large)/1 var(--hd-font-family-base); cursor: pointer; }
.hd-dark-btn:active { background: #111; }
</style>
