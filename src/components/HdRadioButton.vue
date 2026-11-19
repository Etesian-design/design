<script setup lang="ts">
/** RadioButton. N9-original: round radio with accent dot (exception to the squircle rule: controls, not thumbnails). */
const props = defineProps<{ modelValue?: string; value: string; label?: string; name: string; disabled?: boolean }>();
defineEmits<{ 'update:modelValue': [v: string] }>();
</script>
<template>
  <label class="hd-radio" :class="{ 'is-disabled': disabled }">
    <input type="radio" class="hd-radio__input" :name="name" :value="value" :checked="modelValue === value" :disabled="disabled"
      @change="$emit('update:modelValue', props.value)" />
    <span class="hd-radio__dot" aria-hidden="true"><span class="hd-radio__mark"></span></span>
    <span v-if="label">{{ label }}</span>
  </label>
</template>
<style>
.hd-radio { display: inline-flex; align-items: center; gap: var(--hd-space-xlarge); cursor: pointer; min-height: var(--hd-size-touch-target); }
.hd-radio.is-disabled { opacity: var(--hd-opacity-disabled); cursor: default; }
.hd-radio__input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.hd-radio__dot { position: relative; width: var(--hd-size-checkbox); height: var(--hd-size-checkbox); display: inline-flex; flex: none; align-items: center; justify-content: center;
  --hd-rd-rim: var(--hd-c-fg-secondary); }
/* The checkbox's squircle (rim following the curve, see HdCheckBox) with a squircle mark in it. */
.hd-radio__dot::before, .hd-radio__dot::after { content: ''; position: absolute; -webkit-mask: var(--hd-squircle-mask) center / 100% 100% no-repeat; mask: var(--hd-squircle-mask) center / 100% 100% no-repeat; }
.hd-radio__dot::before { inset: 0; background: var(--hd-rd-rim); }
.hd-radio__dot::after { inset: 2px; background: var(--hd-c-surface); }
.hd-radio__mark { position: relative; z-index: 1; width: 12px; height: 12px; background: var(--hd-accent); -webkit-mask: var(--hd-squircle-mask) center / 100% 100% no-repeat; mask: var(--hd-squircle-mask) center / 100% 100% no-repeat; transform: scale(0); transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-radio__input:checked + .hd-radio__dot { --hd-rd-rim: var(--hd-accent); }
.hd-radio__input:checked + .hd-radio__dot .hd-radio__mark { transform: scale(1); }
.hd-radio__input:focus-visible + .hd-radio__dot { outline: 2px solid var(--hd-c-focus); outline-offset: 2px; }
</style>
