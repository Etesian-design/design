<script setup lang="ts">
/** Tooltip (extrapolated, web: the N9 had no hover). Shows on hover AND keyboard focus after 400ms; Escape hides; never holds essential info. */
import { ref } from 'vue';
import { useId } from '../composables/useModal';
withDefaults(defineProps<{ text: string; placement?: 'top' | 'bottom' }>(), { placement: 'top' });
const show = ref(false); const id = useId('hd-tip');
let t: ReturnType<typeof setTimeout> | undefined;
const on = () => { clearTimeout(t); t = setTimeout(() => (show.value = true), 400); };
const off = () => { clearTimeout(t); show.value = false; };
</script>
<template>
  <span class="hd-tooltip" @mouseenter="on" @mouseleave="off" @focusin="on" @focusout="off" @keydown.esc="off" :aria-describedby="id">
    <slot />
    <span :id="id" role="tooltip" class="hd-tooltip__bubble" :class="[`is-${placement}`, { 'is-shown': show }]">{{ text }}</span>
  </span>
</template>
<style>
.hd-tooltip { position: relative; display: inline-flex; }
.hd-tooltip__bubble { position: absolute; left: 50%; z-index: var(--hd-z-banner); padding: 6px 10px; border-radius: 6px; background: rgba(20,20,20,.94); color: #fff; font: 400 var(--hd-font-size-small)/1.3 var(--hd-font-family-base); white-space: nowrap; pointer-events: none;
  opacity: 0; transform: translate(-50%, 4px); transition: opacity var(--hd-motion-duration-instant), transform var(--hd-motion-duration-instant) var(--hd-motion-easing-out); }
.hd-tooltip__bubble.is-top { bottom: calc(100% + 6px); }
.hd-tooltip__bubble.is-bottom { top: calc(100% + 6px); }
.hd-tooltip__bubble.is-shown { opacity: 1; transform: translate(-50%, 0); }
</style>
