<script setup lang="ts">
/**
 * Open applications edit-mode bar (N9, measured): black bar with lit dark "Done" and "Close all" buttons
 * (#1C1C1C → #101010 → #080808, 1px #393839 rim, radius ~21% of the height), large bold white text.
 * actions: the carousel's single shared action row for the centred card (e.g. Split view, Pop-up, Screenshot, App info),
 * shown once above the bar, never repeated per card.
 */
withDefaults(defineProps<{ doneLabel?: string; closeAllLabel?: string; actions?: string[] }>(), { doneLabel: 'Done', closeAllLabel: 'Close all' });
defineEmits<{ done: []; closeAll: []; action: [name: string] }>();
</script>
<template>
  <div class="hd-task-edit-bar-wrap">
    <div v-if="actions?.length" class="hd-task-edit-bar__actions" role="toolbar" aria-label="Actions for the centred app">
      <button v-for="a in actions" :key="a" type="button" class="hd-task-edit-bar__btn hd-task-edit-bar__btn--small hd-focusable" @click="$emit('action', a)">{{ a }}</button>
    </div>
    <div class="hd-task-edit-bar" role="toolbar" aria-label="Open applications edit mode">
      <button type="button" class="hd-task-edit-bar__btn hd-focusable" @click="$emit('done')">{{ doneLabel }}</button>
      <button type="button" class="hd-task-edit-bar__btn hd-focusable" @click="$emit('closeAll')">{{ closeAllLabel }}</button>
    </div>
  </div>
</template>
<style>
.hd-task-edit-bar { display: flex; gap: 12px; justify-content: center; padding: 10px 16px; background: #000; }
.hd-task-edit-bar__actions { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; padding: 8px 12px; }
.hd-task-edit-bar__btn { flex: 1 1 0; max-width: 220px; height: 48px; padding: 0 16px; border: 1px solid #393839; border-top-color: #4a494a; border-radius: calc(48px * .21); background: linear-gradient(#1C1C1C, #101010 50%, #080808); box-shadow: inset 0 1px 0 rgba(255,255,255,.08); color: #fff; font: 700 var(--hd-font-size-large)/1 var(--hd-font-family-base); cursor: pointer; }
.hd-task-edit-bar__btn--small { flex: 0 0 auto; height: 36px; padding: 0 10px; border-radius: calc(36px * .21); font-size: .875rem; }
.hd-task-edit-bar__btn:active { background: #111; }
</style>
