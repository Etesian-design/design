<script setup lang="ts">
/** Keyboard shortcut hint, e.g. <XKey :keys="['Super', 'Left']" />. Small key caps; never essential information. */
import { computed } from 'vue';
const props = defineProps<{ keys: string[] | string; label?: string }>();
const SYM: Record<string, string> = { Left: '←', Right: '→', Up: '↑', Down: '↓', Enter: '↵', Shift: '⇧', Tab: '⇥' };
const list = computed(() => (Array.isArray(props.keys) ? props.keys : props.keys.split('+')).map((k) => SYM[k] ?? k));
</script>
<template>
  <span class="x-key" :aria-label="label ?? `Shortcut ${list.join(' plus ')}`" role="note">
    <template v-for="(k, i) in list" :key="i"><kbd>{{ k }}</kbd><span v-if="i < list.length - 1" aria-hidden="true">+</span></template>
  </span>
</template>
<style>
.x-key { display: inline-flex; align-items: center; gap: 2px; font: 400 11px/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); white-space: nowrap; }
.x-key kbd {
  display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px;
  border: 1px solid var(--hd-c-divider); border-bottom-width: 2px; border-radius: 4px; font: 700 10px/1 var(--hd-font-family-base);
  color: var(--hd-c-fg); background: color-mix(in srgb, var(--hd-c-fg) 6%, transparent);
}
</style>
