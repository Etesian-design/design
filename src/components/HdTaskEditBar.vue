<script setup lang="ts">
/**
 * Open applications edit-mode bar (N9, measured): black bar with lit dark "Done" and "Close all" buttons
 * (#1C1C1C → #101010 → #080808, 1px #393839 rim, radius ~21% of the height), large bold white text.
 * actions: the carousel's single shared action row for the centred card (e.g. Split view, Pop-up, Screenshot, App info),
 * shown once above the bar, never repeated per card.
 */
import HdButton from './HdButton.vue';
withDefaults(defineProps<{ doneLabel?: string; closeAllLabel?: string; actions?: string[] }>(), { doneLabel: 'Done', closeAllLabel: 'Close all' });
defineEmits<{ done: []; closeAll: []; action: [name: string] }>();
</script>
<template>
  <div class="hd-task-edit-bar-wrap">
    <div v-if="actions?.length" class="hd-task-edit-bar__actions" role="toolbar" aria-label="Actions for the centred app">
      <button v-for="a in actions" :key="a" type="button" class="hd-task-edit-bar__act hd-focusable" @click="$emit('action', a)">{{ a }}</button>
    </div>
    <div class="hd-task-edit-bar" role="toolbar" aria-label="Open applications edit mode">
      <!-- both are the one N9 edit-bar button: HdButton dark / bar, identical size, font and rim -->
      <HdButton variant="dark" size="bar" class="hd-task-edit-bar__btn" @click="$emit('done')">{{ doneLabel }}</HdButton>
      <HdButton variant="dark" size="bar" class="hd-task-edit-bar__btn" @click="$emit('closeAll')">{{ closeAllLabel }}</HdButton>
    </div>
  </div>
</template>
<style>
.hd-task-edit-bar { display: flex; gap: 5px; justify-content: center; align-items: center; height: var(--hd-size-toolbar); padding: 0 16px; background: linear-gradient(#141414, #000); box-shadow: inset 0 1px 0 #2A2A2A; }
.hd-task-edit-bar__actions { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; padding: 8px 12px; }
/* 180×41 n9px, 8 n9px apart, centred in the 72 n9px bar (n9-grid-edit.png) */
.hd-task-edit-bar__btn.hd-button--bar { flex: 0 1 120px; font: 700 var(--hd-font-size-button)/1 var(--hd-font-family-base); }
.hd-task-edit-bar__act { border: 1px solid #393839; background: linear-gradient(#1C1C1C, #101010 50%, #080808); color: #fff; font-weight: 700; cursor: pointer; flex: 0 0 auto; height: 36px; padding: 0 10px; border-radius: calc(36px * .21); font-size: .875rem; }
</style>
