<script setup lang="ts">
/** Switch. N9-original: pill track, knob slides (min/max knob X 6..30 n9px), accent when on. role=switch. */
withDefaults(defineProps<{ modelValue?: boolean; label?: string; disabled?: boolean; ariaLabel?: string }>(), {});
defineEmits<{ 'update:modelValue': [v: boolean] }>();
</script>
<template>
  <label class="hd-switch" :class="{ 'is-disabled': disabled }">
    <span v-if="label" class="hd-switch__label">{{ label }}</span>
    <button type="button" role="switch" class="hd-switch__track hd-focusable" :aria-checked="modelValue ? 'true' : 'false'"
      :aria-label="label ? undefined : (ariaLabel ?? 'Toggle')" :disabled="disabled" @click="$emit('update:modelValue', !modelValue)">
      <span class="hd-switch__knob"></span>
    </button>
  </label>
</template>
<style>
.hd-switch { display: inline-flex; align-items: center; gap: var(--hd-space-xlarge); cursor: pointer; }
.hd-switch.is-disabled { opacity: var(--hd-opacity-disabled); cursor: default; }
.hd-switch__track { position: relative; width: 52px; height: 28px; padding: 0; border-radius: 999px; border: 1px solid var(--hd-c-button-border); background: var(--hd-c-divider); cursor: inherit; transition: background var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-switch__knob { position: absolute; top: 2px; left: 2px; width: 22px; height: 22px; border-radius: 999px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.3); transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-switch__track[aria-checked='true'] { background: var(--hd-accent); border-color: transparent; }
.hd-switch__track[aria-checked='true'] .hd-switch__knob { transform: translateX(24px); }
</style>
