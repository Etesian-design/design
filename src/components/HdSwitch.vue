<script setup lang="ts">
/** Switch. Measured on the N9 (PR1.3 camera settings, 2026-11-19), CSS px = n9px x 2/3: track 66 x 41 n9px (44 x 27) with
 *  squircle-half ends; off flat #2D2E2D with a darker rim, on the accent with a short light top that settles
 *  by a third into the flat accent, barely darker at the bottom (the N9: #4195DE, then #1885DE down), the rim barely darker; knob a white squircle 30 n9px (20),
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
.hd-switch__track { position: relative; width: 44px; height: 26px; padding: 0; border: 0; border-radius: 0; --hd-sw-fill: #2D2E2D; background: #181818; cursor: inherit;
  -webkit-mask: var(--hd-sq-cap-l) left center / auto 100% no-repeat, var(--hd-sq-cap-r) right center / auto 100% no-repeat; -webkit-mask-composite: source-in;
  mask: var(--hd-sq-cap-l) left center / auto 100% no-repeat, var(--hd-sq-cap-r) right center / auto 100% no-repeat; mask-composite: intersect;
  transition: background var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
/* The rim follows the squircle ends: the track is the rim, the fill a 1px smaller copy of the shape (an inset shadow
   would be a rectangle, cut away at the ends by the mask). */
.hd-switch__track::before { content: ''; position: absolute; inset: 1px; background: var(--hd-sw-fill); -webkit-mask: var(--hd-sq-cap-l) left center / auto 100% no-repeat, var(--hd-sq-cap-r) right center / auto 100% no-repeat; -webkit-mask-composite: source-in;
  mask: var(--hd-sq-cap-l) left center / auto 100% no-repeat, var(--hd-sq-cap-r) right center / auto 100% no-repeat; mask-composite: intersect; }
.hd-switch__knob { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: #fff;
  -webkit-mask: var(--hd-squircle-mask) center / 100% 100% no-repeat; mask: var(--hd-squircle-mask) center / 100% 100% no-repeat;
  transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-switch__track[aria-checked='true'] { background: color-mix(in srgb, var(--hd-accent) 90%, #000); --hd-sw-fill: linear-gradient(color-mix(in srgb, var(--hd-accent) 82%, #fff), var(--hd-accent) 35%, color-mix(in srgb, var(--hd-accent) 95%, #000)); }
.hd-switch__track[aria-checked='true'] .hd-switch__knob { transform: translateX(18px); }
</style>
