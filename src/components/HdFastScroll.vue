<script setup lang="ts">
/**
 * FastScroll (N9, n9-contacts-fastscroll*.png). Place inside a position:relative list; it overlays the list's right edge
 * and never reserves space. Three states (user 2026-11-20):
 * - idle: only the section letters (small grey bold) down the right edge, each at its section's position. Always shown
 *   while the list scrolls at all, whether or not it is moving.
 * - swipe-scrolling (scrolling): a dimmed vertical bar (#B8B8BC ~70%, 70 n9px ≈ 47px) on top of the letters, with a tiny
 *   rounded-square dot at the scroll position in the data.
 * - finger on the strip (active): the bar stays, the dot hides and a dark band (#1A1A1A ~85%, ≈120px) runs across the list
 *   up to the strip, centred on the finger, with the current letter big, white, LIGHT at its left edge. Dragging snaps
 *   section by section: the strip's height is split evenly between the sections, emits jump(index, letter) once per change.
 * No fast scroll at all when the list does not scroll: scrollable=false, or pass the scrolling element as `container` and
 * overflow is detected (ResizeObserver); the container's scroll also drives position and the swipe-scrolling bar.
 * Nothing is ever drawn "visible but transparent": the bar and the dark band exist only in their states.
 * touched (older API) forces the bar, as does scrolling; active / letter force the finger look (docs, screenshots).
 */
import { ref, computed, watch, onBeforeUnmount } from 'vue';
const props = withDefaults(defineProps<{ position?: number; active?: boolean; touched?: boolean; scrolling?: boolean; scrollable?: boolean; container?: HTMLElement | null; letter?: string; sections?: { letter: string; top: number }[]; label?: string }>(), { position: 0, scrollable: true, container: null, sections: () => [], label: 'Fast scroll' });
const emit = defineEmits<{ jump: [index: number, letter: string] }>();
const drag = ref<number | null>(null); // finger y as 0..1 once it moves on the strip
const down0 = ref<number | null>(null); // finger y (px) while it is on the strip
const idx = ref(-1);
// container-driven state
const overflow = ref(true);
const autoPos = ref<number | null>(null);
const swiping = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
let ro: ResizeObserver | undefined;
const measure = (el: HTMLElement) => { const max = el.scrollHeight - el.clientHeight; overflow.value = max > 1; autoPos.value = max > 0 ? el.scrollTop / max : 0; };
const onScroll = (e: Event) => { measure(e.currentTarget as HTMLElement); swiping.value = true; clearTimeout(timer); timer = setTimeout(() => (swiping.value = false), 800); };
watch(() => props.container, (el, old) => {
  old?.removeEventListener('scroll', onScroll); ro?.disconnect();
  if (!el) { overflow.value = true; autoPos.value = null; return; }
  measure(el); el.addEventListener('scroll', onScroll, { passive: true });
  if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(() => measure(el)); ro.observe(el); for (const c of Array.from(el.children)) ro.observe(c); }
}, { immediate: true });
onBeforeUnmount(() => { props.container?.removeEventListener('scroll', onScroll); ro?.disconnect(); clearTimeout(timer); });

const shownAtAll = computed(() => props.scrollable && overflow.value);
const on = computed(() => props.active || drag.value !== null);
const bar = computed(() => on.value || props.touched || props.scrolling || swiping.value || down0.value !== null);
const pos = computed(() => autoPos.value ?? props.position);
const shown = computed(() => props.letter ?? props.sections[idx.value]?.letter);
const at = computed(() => drag.value ?? pos.value);
/** 0..1 down the strip → section index (even slices, like the N9) */
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
  <div v-if="shownAtAll" class="hd-fast-scroll" :class="{ 'is-active': on, 'is-touched': bar, 'is-scrolling': bar }">
    <div class="hd-fast-scroll__band" role="scrollbar" :aria-label="label" aria-orientation="vertical" :aria-valuenow="Math.round(pos * 100)" aria-valuemin="0" aria-valuemax="100"
      @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up">
      <span v-for="s in sections" :key="s.letter" class="hd-fast-scroll__sec" :style="{ top: `${s.top}px` }">{{ s.letter }}</span>
      <div v-if="bar" class="hd-fast-scroll__bar"><i v-if="!on" class="hd-fast-scroll__dot" :style="{ top: `calc(${pos * 100}% - ${pos * 8}px)` }" /></div>
    </div>
    <div v-if="on" class="hd-fast-scroll__finger" :style="{ top: `${at * 100}%` }"><span v-if="shown" class="hd-fast-scroll__letter" aria-live="polite">{{ shown }}</span></div>
  </div>
</template>
<style>
.hd-fast-scroll { position: absolute; inset: 0; pointer-events: none; z-index: 3; --hd-fast-scroll-width: 47px; }
.hd-fast-scroll__band { pointer-events: auto; touch-action: none; cursor: ns-resize; position: absolute; top: 0; bottom: 0; right: 0; width: var(--hd-fast-scroll-width); overflow: hidden; }
.hd-fast-scroll__sec { position: absolute; left: 0; right: 0; transform: translateY(-50%); text-align: center; font: 700 .75rem/1 var(--hd-font-family-base); color: #7A7A7E; }
/* swipe-scrolling or finger on the strip: the dimmed bar on top of the letters, with the dot */
.hd-fast-scroll__bar { position: absolute; inset: 0; background: rgba(184,184,188,.7); animation: hd-fast-scroll-in .2s ease-out; }
@keyframes hd-fast-scroll-in { from { opacity: 0; } }
.hd-fast-scroll__dot { position: absolute; left: 50%; width: 8px; height: 8px; margin-left: -4px; border-radius: 2px; background: #9C9CA0; box-shadow: inset 0 0 0 1.5px #E8E8EA; }
.hd-fast-scroll__finger { position: absolute; left: 0; right: var(--hd-fast-scroll-width); height: var(--hd-fast-scroll-finger, 120px); transform: translateY(-50%); display: flex; align-items: center; background: rgba(26,26,26,.85); }
.hd-fast-scroll__letter { padding-left: 8px; color: #fff; font: 200 72px/1 var(--hd-font-family-light); }
@media (prefers-reduced-motion: reduce) { .hd-fast-scroll__bar { animation: none; } }
</style>
