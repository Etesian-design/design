<script setup lang="ts">
/** Open applications edit-mode toolbar (N9): bottom dark bar with "Done" and "Close all", dark rounded buttons, large bold white text. */
withDefaults(defineProps<{ doneLabel?: string; closeAllLabel?: string }>(), { doneLabel: 'Done', closeAllLabel: 'Close all' });
defineEmits<{ done: []; closeAll: [] }>();
</script>
<template>
  <div class="hd-task-edit-bar" role="toolbar" aria-label="Open applications edit mode">
    <button type="button" class="hd-task-edit-bar__btn hd-focusable" @click="$emit('done')">{{ doneLabel }}</button>
    <button type="button" class="hd-task-edit-bar__btn hd-focusable" @click="$emit('closeAll')">{{ closeAllLabel }}</button>
  </div>
</template>
<style>
.hd-task-edit-bar { display: flex; gap: 12px; justify-content: center; padding: 10px 16px; background: #000; }
.hd-task-edit-bar__btn { flex: 1 1 0; max-width: 220px; height: 48px; padding: 0 16px; border: 1px solid #393839; border-top-color: #4a494a; border-radius: calc(48px * .21); background: linear-gradient(#1C1C1C, #101010 50%, #080808); box-shadow: inset 0 1px 0 rgba(255,255,255,.08); color: #fff; font: 700 var(--hd-font-size-large)/1 var(--hd-font-family-base); cursor: pointer; }
.hd-task-edit-bar__btn:active { background: #111; }
</style>
