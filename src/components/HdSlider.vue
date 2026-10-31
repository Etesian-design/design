<script setup lang="ts">
/** Slider (N9, n9-settings-main.png Brightness; ROM StatusMenuActivity FillBar slider): thin dark groove, the accent-filled
 *  part, a large white top-lit rounded-square thumb with a soft shadow (never a round web knob), optional end icons OUTSIDE
 *  the track (startIcon / endIcon), value bubble while dragging. Native range input. */
import HdIcon from './HdIcon.vue';
import { computed, ref } from 'vue';
const props = withDefaults(defineProps<{ modelValue?: number; min?: number; max?: number; step?: number; label: string; disabled?: boolean; showValue?: boolean; startIcon?: string; endIcon?: string }>(), { modelValue: 0, min: 0, max: 100, step: 1 });
defineEmits<{ 'update:modelValue': [v: number] }>();
const pct = computed(() => ((props.modelValue - props.min) / (props.max - props.min)) * 100);
const active = ref(false);
</script>
<template>
  <div class="hd-slider" :class="{ 'is-disabled': disabled }" :style="{ '--hd-slider-pct': `${pct}%` }">
    <HdIcon v-if="startIcon" :name="startIcon" :size="16" class="hd-slider__end" />
    <input type="range" class="hd-slider__input" :aria-label="label" :min="min" :max="max" :step="step" :value="modelValue" :disabled="disabled"
      @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      @pointerdown="active = true" @pointerup="active = false" @blur="active = false" />
    <HdIcon v-if="endIcon" :name="endIcon" :size="22" class="hd-slider__end" />
    <output v-if="showValue || active" class="hd-slider__bubble" :class="{ 'is-floating': active }" aria-hidden="true">{{ modelValue }}</output>
  </div>
</template>
<style>
.hd-slider { position: relative; display: flex; align-items: center; min-height: var(--hd-size-touch-target); }
.hd-slider.is-disabled { opacity: var(--hd-opacity-disabled); }
.hd-slider { gap: 14px; /* thumb: n=2.8 squircle (same path as --hd-squircle-mask), top-lit, soft shadow — no border-radius */
  --hd-slider-thumb: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -3 108 112'%3E%3Cdefs%3E%3ClinearGradient id='g' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23fff'/%3E%3Cstop offset='.5' stop-color='%23F1F1F2'/%3E%3Cstop offset='1' stop-color='%23D6D6D9'/%3E%3C/linearGradient%3E%3Cfilter id='s'%3E%3CfeDropShadow dy='4' stdDeviation='2.5' flood-opacity='.5'/%3E%3C/filter%3E%3C/defs%3E%3Cpath filter='url(%23s)' fill='url(%23g)' stroke='%23B9B9BC' stroke-width='2' d='M100.00 50.00L99.92 57.13L99.69 61.68L99.31 65.56L98.78 69.04L98.09 72.23L97.25 75.18L96.26 77.92L95.12 80.48L93.82 82.86L92.38 85.08L90.78 87.13L89.04 89.04L87.13 90.78L85.08 92.38L82.86 93.82L80.48 95.12L77.92 96.26L75.18 97.25L72.23 98.09L69.04 98.78L65.56 99.31L61.68 99.69L57.13 99.92L50.00 100.00L42.87 99.92L38.32 99.69L34.44 99.31L30.96 98.78L27.77 98.09L24.82 97.25L22.08 96.26L19.52 95.12L17.14 93.82L14.92 92.38L12.87 90.78L10.96 89.04L9.22 87.13L7.62 85.08L6.18 82.86L4.88 80.48L3.74 77.92L2.75 75.18L1.91 72.23L1.22 69.04L0.69 65.56L0.31 61.68L0.08 57.13L0.00 50.00L0.08 42.87L0.31 38.32L0.69 34.44L1.22 30.96L1.91 27.77L2.75 24.82L3.74 22.08L4.88 19.52L6.18 17.14L7.62 14.92L9.22 12.87L10.96 10.96L12.87 9.22L14.92 7.62L17.14 6.18L19.52 4.88L22.08 3.74L24.82 2.75L27.77 1.91L30.96 1.22L34.44 0.69L38.32 0.31L42.87 0.08L50.00 0.00L57.13 0.08L61.68 0.31L65.56 0.69L69.04 1.22L72.23 1.91L75.18 2.75L77.92 3.74L80.48 4.88L82.86 6.18L85.08 7.62L87.13 9.22L89.04 10.96L90.78 12.87L92.38 14.92L93.82 17.14L95.12 19.52L96.26 22.08L97.25 24.82L98.09 27.77L98.78 30.96L99.31 34.44L99.69 38.32L99.92 42.87Z'/%3E%3C/svg%3E"); }
.hd-slider__end { flex: none; color: var(--hd-c-fg); }
/* groove 4px, dark, square-ish; blue fill; thumb 27 × 25 white, corners ~30%, lit from the top */
.hd-slider__input { -webkit-appearance: none; appearance: none; flex: 1; width: 100%; height: 4px; border-radius: 1px; margin: 0; cursor: pointer;
  background: linear-gradient(to right, var(--hd-accent) var(--hd-slider-pct), var(--hd-slider-groove, #3A3A3A) var(--hd-slider-pct)); box-shadow: inset 0 1px 1px rgba(0,0,0,.5); }
.hd-slider__input::-webkit-slider-thumb { -webkit-appearance: none; width: 30px; height: 30px; border: 0; background: var(--hd-slider-thumb) center / 100% 100% no-repeat; }
.hd-slider__input::-moz-range-thumb { width: 30px; height: 30px; border: 0; border-radius: 0; background: var(--hd-slider-thumb) center / 100% 100% no-repeat; }
.hd-slider__input:focus-visible { outline: 2px solid var(--hd-c-focus); outline-offset: 6px; }
.hd-slider__bubble { margin-left: var(--hd-space-xlarge); min-width: 3ch; font: var(--hd-font-weight-bold) var(--hd-font-size-small)/1 var(--hd-font-family-base); font-variant-numeric: tabular-nums; }
.hd-slider__bubble.is-floating { position: absolute; bottom: 100%; left: var(--hd-slider-pct); transform: translateX(-50%); margin: 0; padding: 6px 10px; border-radius: 6px; background: var(--hd-c-fg); color: var(--hd-c-bg); }
</style>
