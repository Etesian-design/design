<script setup lang="ts">
/** CheckBox. N9-original: 42 n9px box, accent fill with white tick when checked. Native input for a11y. */
withDefaults(defineProps<{ modelValue?: boolean; label?: string; disabled?: boolean; name?: string; value?: string }>(), {});
defineEmits<{ 'update:modelValue': [v: boolean] }>();
</script>
<template>
  <label class="hd-check" :class="{ 'is-disabled': disabled }">
    <input type="checkbox" class="hd-check__input" :checked="modelValue" :disabled="disabled" :name="name" :value="value"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)" />
    <span class="hd-check__box" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
    <span v-if="label" class="hd-check__label">{{ label }}</span>
  </label>
</template>
<style>
.hd-check { display: inline-flex; align-items: center; gap: var(--hd-space-xlarge); cursor: pointer; min-height: var(--hd-size-touch-target); }
.hd-check.is-disabled { opacity: var(--hd-opacity-disabled); cursor: default; }
.hd-check__input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.hd-check__box { width: var(--hd-size-checkbox); height: var(--hd-size-checkbox); border-radius: 5px; border: 2px solid var(--hd-c-fg-secondary); background: var(--hd-c-surface); display: inline-flex; transition: background var(--hd-motion-duration-instant); }
.hd-check__box svg { width: 100%; height: 100%; opacity: 0; transform: scale(.6); transition: all var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-check__input:checked + .hd-check__box { background: var(--hd-accent); border-color: var(--hd-accent); }
.hd-check__input:checked + .hd-check__box svg { opacity: 1; transform: none; }
.hd-check__input:focus-visible + .hd-check__box { outline: 2px solid var(--hd-c-focus); outline-offset: 2px; }
</style>
