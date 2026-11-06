<script setup lang="ts">
/**
 * ToastStack: the toasts of a whole app, one above the other, bottom-centred as Toast (above the bottom toolbar on mobile).
 * The host keeps the list; each toast closes itself after its `timeout` (paused while hovered or focused) or by its ×,
 * and its action (Undo) closes it too. `close` says which one and whether the action was pressed.
 */
import { onBeforeUnmount, watch } from 'vue';
import HdIcon from './HdIcon.vue';
export interface StackToast { id: string | number; text: string; action?: string; timeout?: number; tone?: 'default' | 'warning' | 'success' }
const props = withDefaults(defineProps<{ toasts?: StackToast[]; inline?: boolean }>(), { toasts: () => [], inline: false });
const emit = defineEmits<{ close: [id: string | number, acted: boolean] }>();
const timers = new Map<string | number, ReturnType<typeof setTimeout>>();
function arm(t: StackToast) { clearTimeout(timers.get(t.id)); if ((t.timeout ?? 4000) > 0) timers.set(t.id, setTimeout(() => close(t.id, false), t.timeout ?? 4000)); }
function pause(t: StackToast) { clearTimeout(timers.get(t.id)); }
function close(id: string | number, acted: boolean) { clearTimeout(timers.get(id)); timers.delete(id); emit('close', id, acted); }
watch(() => props.toasts.map((t) => t.id), () => {
  for (const t of props.toasts) if (!timers.has(t.id)) arm(t);
  for (const id of [...timers.keys()]) if (!props.toasts.some((t) => t.id === id)) { clearTimeout(timers.get(id)); timers.delete(id); }
}, { immediate: true });
onBeforeUnmount(() => timers.forEach((t) => clearTimeout(t)));
</script>
<template>
  <div class="hd-toast-region hd-toast-stack" :class="{ 'is-inline': inline }" role="status" aria-live="polite">
    <TransitionGroup name="hd-toast">
      <div v-for="t in toasts" :key="t.id" class="hd-toast hd-on-banner" :class="`hd-toast--${t.tone ?? 'default'}`" data-test="toast"
           @mouseenter="pause(t)" @mouseleave="arm(t)" @focusin="pause(t)" @focusout="arm(t)">
        <span class="hd-toast__text">{{ t.text }}</span>
        <button v-if="t.action" type="button" class="hd-toast__action hd-focusable" data-test="toast-action" @click="close(t.id, true)">{{ t.action }}</button>
        <button type="button" class="hd-toast__x hd-sqh hd-focusable" aria-label="Dismiss" @click="close(t.id, false)"><HdIcon name="close" :size="18" /></button>
      </div>
    </TransitionGroup>
  </div>
</template>
<style>
.hd-toast-stack { flex-direction: column; align-items: center; gap: 8px; }
.hd-toast__x { display: flex; margin: -8px -8px -8px -8px; padding: 8px; border: 0; background: none; color: var(--hd-c-fg-secondary); cursor: pointer; }
</style>
