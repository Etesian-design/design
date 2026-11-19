<script setup lang="ts">
/** Switch. Measured on the N9 (PR1.3 camera settings, 2026-11-19), CSS px = n9px x 2/3: track 66 x 41 n9px (44 x 27) with
 *  squircle-half ends; off flat #2D2E2D with a darker rim, on the accent lit from above; knob a white squircle 30 n9px (20),
 *  inset 5 n9px (3), no border. The same switch on the phone, for every app (EtesianSwitchLook in the framework). role=switch. */
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
.hd-switch__track { position: relative; width: 44px; height: 27px; padding: 0; border: 0; border-radius: 0; background: #2D2E2D; box-shadow: inset 0 0 0 1px #181818; cursor: inherit;
  -webkit-mask: var(--hd-sq-cap-l) left center / auto 100% no-repeat, var(--hd-sq-cap-r) right center / auto 100% no-repeat; -webkit-mask-composite: source-in;
  mask: var(--hd-sq-cap-l) left center / auto 100% no-repeat, var(--hd-sq-cap-r) right center / auto 100% no-repeat; mask-composite: intersect;
  transition: background var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-switch__knob { position: absolute; top: 3.5px; left: 3px; width: 20px; height: 20px; background: #fff;
  -webkit-mask: var(--hd-squircle-mask) center / 100% 100% no-repeat; mask: var(--hd-squircle-mask) center / 100% 100% no-repeat;
  transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-switch__track[aria-checked='true'] { background: linear-gradient(rgba(255,255,255,.18), rgba(0,0,0,.08)), var(--hd-accent); box-shadow: inset 0 0 0 1px rgba(0,0,0,.25); }
.hd-switch__track[aria-checked='true'] .hd-switch__knob { transform: translateX(18px); }
</style>
