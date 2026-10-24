<script setup lang="ts">
/**
 * Sheet. N9-original: full-screen modal that slides up from the bottom, header bar with
 * Reject (left, plain) and Accept (right, accent) buttons, content below. Used for "new item" flows.
 */
import { ref, toRef } from 'vue';
import { useModal, useId } from '../composables/useModal';
import HdButton from './HdButton.vue';
const props = withDefaults(defineProps<{ open: boolean; title?: string; acceptLabel?: string; rejectLabel?: string; acceptDisabled?: boolean; inline?: boolean }>(), {
  acceptLabel: 'Done', rejectLabel: 'Cancel',
});
const emit = defineEmits<{ accept: []; reject: []; 'update:open': [v: boolean] }>();
const panel = ref<HTMLElement>();
const id = useId('hd-sheet');
function reject() { emit('reject'); emit('update:open', false); }
function accept() { emit('accept'); emit('update:open', false); }
useModal(toRef(props, 'open'), panel, reject);
</script>
<template>
  <Transition name="hd-sheet">
    <div v-if="open" class="hd-sheet" :class="{ 'hd-sheet--inline': inline }">
      <div ref="panel" class="hd-sheet__panel" role="dialog" aria-modal="true" :aria-labelledby="title ? `${id}-t` : undefined" tabindex="-1">
        <div class="hd-sheet__bar">
          <HdButton @click="reject">{{ rejectLabel }}</HdButton>
          <h2 v-if="title" :id="`${id}-t`" class="hd-sheet__title">{{ title }}</h2>
          <HdButton variant="accent" :disabled="acceptDisabled" @click="accept">{{ acceptLabel }}</HdButton>
        </div>
        <div class="hd-sheet__content"><slot /></div>
      </div>
    </div>
  </Transition>
</template>
<style>
.hd-sheet { position: fixed; inset: 0; z-index: var(--hd-z-overlay); background: var(--hd-c-overlay); display: flex; align-items: flex-end; justify-content: center; }
.hd-sheet--inline { position: absolute; }
.hd-sheet__panel { width: 100%; max-width: 720px; height: calc(100% - 24px); background: var(--hd-c-bg); color: var(--hd-c-fg); display: flex; flex-direction: column; box-shadow: var(--hd-shadow-overlay); outline: none; }
@media (min-width: 600px) { .hd-sheet { align-items: center; } .hd-sheet__panel { height: auto; max-height: 85vh; border-radius: var(--hd-radius-card); overflow: hidden; } }
.hd-sheet__bar { display: flex; align-items: center; justify-content: space-between; gap: var(--hd-space-double); padding: var(--hd-space-double) var(--hd-space-xlarge); background: var(--hd-c-surface-raised); border-bottom: 1px solid var(--hd-c-divider); }
.hd-sheet__title { margin: 0; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1.2 var(--hd-font-family-light); text-align: center; flex: 1; }
.hd-sheet__content { padding: var(--hd-space-xlarge); overflow: auto; }
.hd-sheet-enter-active, .hd-sheet-leave-active { transition: background var(--hd-motion-duration-slow) var(--hd-motion-easing-out); }
.hd-sheet-enter-active .hd-sheet__panel, .hd-sheet-leave-active .hd-sheet__panel { transition: transform var(--hd-motion-duration-slow) var(--hd-motion-easing-out); }
.hd-sheet-enter-from, .hd-sheet-leave-to { background: transparent; }
.hd-sheet-enter-from .hd-sheet__panel, .hd-sheet-leave-to .hd-sheet__panel { transform: translateY(100%); }
</style>
