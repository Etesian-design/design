<script setup lang="ts">
/**
 * FastScroll (N9, n9-contacts-fastscroll*.png). A wide grey translucent band down the right edge of the list
 * (70 n9px ≈ 47px, #B8B8BC at ~70%) with each section's letter (small grey bold) inside it at the section's position,
 * and a tiny rounded-square dot at the scroll position. Finger on the band: the dot hides and a dark translucent band
 * (#1A1A1A ~85%, 150/854 of the screen ≈ 120px on a 680px phone) runs across the list up to the scroll band, centred on the finger, with the
 * current letter big, white, LIGHT, at its left edge. Place inside a position:relative list. position: 0..1; section top in px.
 * Dragging snaps section by section (N9): the band's height is split evenly between the sections, any small move into the
 * next slice jumps to that letter, emits jump(index, letter) once per change and the list snaps to that section's start.
 * active / letter force the finger-on-bar look (docs, screenshots).
 * Only when the list scrolls (user 2026-11-19): with nothing to scroll there is no band (scrollable=false renders nothing
 * and the list takes its full width). At rest the band is the app's colour (transparent: only the section letters and the
 * dot show); a finger on it turns it grey, smoothly (.3s); moving the finger brings the dark band with the big letter;
 * lifting fades it back. touched forces the grey (docs).
 */
import { ref, computed } from 'vue';
const props = withDefaults(defineProps<{ position?: number; active?: boolean; touched?: boolean; scrollable?: boolean; letter?: string; sections?: { letter: string; top: number }[]; label?: string }>(), { position: 0, scrollable: true, sections: () => [], label: 'Fast scroll' });
const emit = defineEmits<{ jump: [index: number, letter: string] }>();
const drag = ref<number | null>(null); // finger y as 0..1 once it moves on the band
const down0 = ref<number | null>(null); // finger y (px) while it is on the band
const grey = computed(() => props.touched || props.active || down0.value !== null);
const idx = ref(-1);
const on = computed(() => props.active || drag.value !== null);
const shown = computed(() => props.letter ?? props.sections[idx.value]?.letter);
const at = computed(() => drag.value ?? props.position);
/** 0..1 down the band → section index (even slices, like the N9) */
const sectionAt = (f: number, n: number) => Math.min(n - 1, Math.max(0, Math.floor(f * n)));
function move(e: PointerEvent) {
  if (down0.value === null || !props.sections.length) return;
  if (drag.value === null && Math.abs(e.clientY - down0.value) < 4) return; // a touch, not yet a move
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  drag.value = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
  const i = sectionAt(drag.value, props.sections.length);
  if (i !== idx.value) { idx.value = i; emit('jump', i, props.sections[i].letter); }
}
function down(e: PointerEvent) { (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); down0.value = e.clientY; drag.value = null; idx.value = -1; }
const up = () => { drag.value = null; down0.value = null; };
defineExpose({ sectionAt });
</script>
<template>
  <div v-if="scrollable" class="hd-fast-scroll" :class="{ 'is-active': on, 'is-touched': grey }">
    <div class="hd-fast-scroll__band" role="scrollbar" :aria-label="label" aria-orientation="vertical" :aria-valuenow="Math.round(position * 100)" aria-valuemin="0" aria-valuemax="100"
      @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up">
      <span v-for="s in sections" :key="s.letter" class="hd-fast-scroll__sec" :style="{ top: `${s.top}px` }">{{ s.letter }}</span>
      <i v-if="!on" class="hd-fast-scroll__dot" :style="{ top: `calc(${position * 100}% - ${position * 8}px)` }" />
    </div>
    <div v-if="on" class="hd-fast-scroll__finger" :style="{ top: `${at * 100}%` }"><span v-if="shown" class="hd-fast-scroll__letter" aria-live="polite">{{ shown }}</span></div>
  </div>
</template>
<style>
.hd-fast-scroll { position: absolute; inset: 0; pointer-events: none; z-index: 3; --hd-fast-scroll-width: 47px; }
.hd-fast-scroll__band { pointer-events: auto; touch-action: none; cursor: ns-resize; position: absolute; top: 0; bottom: 0; right: 0; width: var(--hd-fast-scroll-width); overflow: hidden; background: rgba(184,184,188,0); transition: background-color .3s ease-in-out; }
/* At rest the app's colour; grey only while a finger is on it. */
.hd-fast-scroll.is-touched .hd-fast-scroll__band { background: rgba(184,184,188,.7); }
.hd-fast-scroll__sec { position: absolute; left: 0; right: 0; transform: translateY(-50%); text-align: center; font: 700 .75rem/1 var(--hd-font-family-base); color: #7A7A7E; }
.hd-fast-scroll__dot { position: absolute; left: 50%; width: 8px; height: 8px; margin-left: -4px; border-radius: 2px; background: #9C9CA0; box-shadow: inset 0 0 0 1.5px #E8E8EA; }
.hd-fast-scroll__finger { position: absolute; left: 0; right: var(--hd-fast-scroll-width); height: var(--hd-fast-scroll-finger, 120px); transform: translateY(-50%); display: flex; align-items: center; background: rgba(26,26,26,.85); }
.hd-fast-scroll__letter { padding-left: 8px; color: #fff; font: 200 72px/1 var(--hd-font-family-light); }
</style>
