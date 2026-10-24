<script setup lang="ts">
/** Slider. N9-original: thin groove, accent-filled part, round handle, value indicator bubble while dragging. Native range input. */
import { computed, ref } from 'vue';
const props = withDefaults(defineProps<{ modelValue?: number; min?: number; max?: number; step?: number; label: string; disabled?: boolean; showValue?: boolean }>(), { modelValue: 0, min: 0, max: 100, step: 1 });
defineEmits<{ 'update:modelValue': [v: number] }>();
const pct = computed(() => ((props.modelValue - props.min) / (props.max - props.min)) * 100);
const active = ref(false);
</script>
<template>
  <div class="hd-slider" :class="{ 'is-disabled': disabled }" :style="{ '--hd-slider-pct': `${pct}%` }">
    <input type="range" class="hd-slider__input" :aria-label="label" :min="min" :max="max" :step="step" :value="modelValue" :disabled="disabled"
      @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      @pointerdown="active = true" @pointerup="active = false" @blur="active = false" />
    <output v-if="showValue || active" class="hd-slider__bubble" :class="{ 'is-floating': active }" aria-hidden="true">{{ modelValue }}</output>
  </div>
</template>
<style>
.hd-slider { position: relative; display: flex; align-items: center; min-height: var(--hd-size-touch-target); }
.hd-slider.is-disabled { opacity: var(--hd-opacity-disabled); }
.hd-slider__input { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 999px; margin: 0; cursor: pointer;
  background: linear-gradient(to right, var(--hd-accent) var(--hd-slider-pct), var(--hd-c-divider) var(--hd-slider-pct)); }
.hd-slider__input::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; border-radius: 50%; background: #fff; border: 1px solid var(--hd-c-button-border); box-shadow: 0 1px 3px rgba(0,0,0,.3); }
.hd-slider__input::-moz-range-thumb { width: 28px; height: 28px; border-radius: 50%; background: #fff; border: 1px solid var(--hd-c-button-border); }
.hd-slider__input:focus-visible { outline: 2px solid var(--hd-c-focus); outline-offset: 6px; }
.hd-slider__bubble { margin-left: var(--hd-space-xlarge); min-width: 3ch; font: var(--hd-font-weight-bold) var(--hd-font-size-small)/1 var(--hd-font-family-base); font-variant-numeric: tabular-nums; }
.hd-slider__bubble.is-floating { position: absolute; bottom: 100%; left: var(--hd-slider-pct); transform: translateX(-50%); margin: 0; padding: 6px 10px; border-radius: 6px; background: var(--hd-c-fg); color: var(--hd-c-bg); }
</style>
