<script setup lang="ts">
/** Internal base for N9 dialogs: always inverted (black, translucent), content centred, buttons stacked at the bottom (fixed 322 n9px width). */
import { ref, toRef } from 'vue';
import { useModal, useId } from '../composables/useModal';
const props = withDefaults(defineProps<{ open: boolean; title?: string; role?: 'dialog' | 'alertdialog'; inline?: boolean }>(), { role: 'dialog' });
const emit = defineEmits<{ close: [] }>();
const panel = ref<HTMLElement>();
const id = useId('hd-dlg');
useModal(toRef(props, 'open'), panel, () => emit('close'));
</script>
<template>
  <Transition name="hd-dialog">
    <div v-if="open" class="hd-dialog hd-inverted" :class="{ 'hd-dialog--inline': inline }" @click.self="emit('close')">
      <div ref="panel" class="hd-dialog__panel" :role="role" aria-modal="true" :aria-labelledby="title ? `${id}-t` : undefined" :aria-describedby="`${id}-b`" tabindex="-1">
        <slot name="icon" />
        <h2 v-if="title" :id="`${id}-t`" class="hd-dialog__title">{{ title }}</h2>
        <div :id="`${id}-b`" class="hd-dialog__body"><slot /></div>
        <div v-if="$slots.buttons" class="hd-dialog__buttons"><slot name="buttons" /></div>
      </div>
    </div>
  </Transition>
</template>
<style>
.hd-dialog { position: fixed; inset: 0; z-index: var(--hd-z-overlay); display: flex; align-items: center; justify-content: center; padding: var(--hd-space-xxlarge); background: rgba(0,0,0,.88); color: #fff; }
.hd-dialog--inline { position: absolute; }
.hd-dialog__panel { width: 100%; max-width: 420px; display: flex; flex-direction: column; align-items: center; gap: var(--hd-space-xxlarge); text-align: center; outline: none; }
.hd-dialog__title { margin: 0; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1.2 var(--hd-font-family-light); }
.hd-dialog__body { width: 100%; font-size: var(--hd-font-size-default); color: var(--hd-c-fg-secondary); }
.hd-dialog__buttons { display: flex; flex-direction: column; gap: var(--hd-space-double); align-items: center; width: 100%; }
.hd-dialog .hd-button:not(.hd-button--accent):not(.hd-button--negative) { background: #fff; color: #000; }
.hd-dialog-enter-active, .hd-dialog-leave-active { transition: opacity var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-dialog-enter-active .hd-dialog__panel { transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-dialog-enter-from, .hd-dialog-leave-to { opacity: 0; }
.hd-dialog-enter-from .hd-dialog__panel { transform: scale(.9); }
</style>
