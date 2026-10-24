<script setup lang="ts">
/** Toast (extrapolated, web sibling of InfoBanner). Bottom-centred (above the bottom toolbar on mobile), optional single action, auto-dismiss 5s, pauses on hover/focus. */
import { onBeforeUnmount, ref, watch } from 'vue';
const props = withDefaults(defineProps<{ open: boolean; text: string; action?: string; timeout?: number; inline?: boolean; tone?: 'default' | 'warning' | 'success' }>(), { timeout: 5000, tone: 'default' });
const emit = defineEmits<{ 'update:open': [v: boolean]; action: [] }>();
let t: ReturnType<typeof setTimeout> | undefined;
const paused = ref(false);
const arm = () => { clearTimeout(t); if (props.open && props.timeout > 0 && !paused.value) t = setTimeout(() => emit('update:open', false), props.timeout); };
watch(() => props.open, arm, { immediate: true });
watch(paused, arm);
onBeforeUnmount(() => clearTimeout(t));
</script>
<template>
  <div class="hd-toast-region" :class="{ 'is-inline': inline }" :role="tone === 'warning' ? 'alert' : 'status'" aria-live="polite">
    <Transition name="hd-toast">
      <div v-if="open" class="hd-toast" :class="`hd-toast--${tone}`" @mouseenter="paused = true" @mouseleave="paused = false" @focusin="paused = true" @focusout="paused = false">
        <span class="hd-toast__text">{{ text }}</span>
        <button v-if="action" type="button" class="hd-toast__action hd-focusable" @click="emit('action'); emit('update:open', false)">{{ action }}</button>
      </div>
    </Transition>
  </div>
</template>
<style>
.hd-toast-region { position: fixed; left: 16px; right: 16px; bottom: calc(var(--hd-size-toolbar) + 16px); z-index: var(--hd-z-banner); display: flex; justify-content: center; pointer-events: none; }
@media (min-width: 600px) { .hd-toast-region { bottom: 24px; } }
.hd-toast-region.is-inline { position: relative; inset: auto; }
.hd-toast { pointer-events: auto; display: flex; align-items: center; gap: 16px; min-width: min(320px, 100%); max-width: 560px; padding: 12px 16px; border-radius: var(--hd-radius-card); background: rgba(30,30,30,.95); color: #fff; box-shadow: var(--hd-shadow-overlay); border-left: 4px solid transparent; }
.hd-toast--warning { border-left-color: var(--hd-color-palette-warning); }
.hd-toast--success { border-left-color: var(--hd-color-palette-notification); }
.hd-toast__text { flex: 1; }
.hd-toast__action { border: 0; background: none; color: #7fb0ff; font: 700 var(--hd-font-size-default)/1 var(--hd-font-family-base); cursor: pointer; padding: 8px; border-radius: 4px; }
.hd-toast-enter-active, .hd-toast-leave-active { transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out), opacity var(--hd-motion-duration-default); }
.hd-toast-enter-from, .hd-toast-leave-to { transform: translateY(16px); opacity: 0; }
</style>
