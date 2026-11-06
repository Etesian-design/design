<script setup lang="ts">
/** The browser's tabs, in the window header (XWindow's title slot): squircle-half tabs, the current one lit, + for a new tab. */
import HdIcon from '../../components/HdIcon.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
defineProps<{ tabs: { id: string; title: string; icon?: string }[]; current: string; max?: number }>();
defineEmits<{ pick: [id: string]; close: [id: string]; add: [] }>();
</script>
<template>
  <div class="x-bt" role="tablist" aria-label="Tabs">
    <div v-for="t in tabs" :key="t.id" class="x-bt__tab" :class="{ 'is-on': t.id === current }" role="tab" :aria-selected="t.id === current ? 'true' : 'false'" tabindex="0" @click="$emit('pick', t.id)">
      <HdIcon :name="t.icon ?? 'globe'" :size="14" /><span class="x-bt__label">{{ t.title }}</span>
      <button type="button" class="x-bt__x" :aria-label="`Close ${t.title}`" @click.stop="$emit('close', t.id)"><HdIcon name="close" :size="12" /></button>
    </div>
    <HdToolIcon icon="add" label="New tab" :disabled="max !== undefined && tabs.length >= max" @click="$emit('add')" />
  </div>
</template>
<style>
.x-bt { flex: 0 1 auto; min-width: 0; display: flex; align-items: center; gap: 4px; margin: 0 4px; overflow: hidden; }
.x-bt__tab { flex: 0 1 200px; min-width: 64px; display: flex; align-items: center; gap: 8px; height: 32px; padding: 0 6px 0 12px; border-radius: 16px; color: var(--hd-c-fg-secondary); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); cursor: default; }
.x-bt__tab:hover { background: var(--hd-c-pressed); }
.x-bt__tab.is-on { background: color-mix(in srgb, var(--hd-c-fg) 14%, transparent); color: var(--hd-c-fg); }
.x-bt__label { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x-bt__x { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border: 0; border-radius: 11px; background: none; color: inherit; cursor: pointer; }
.x-bt__x:hover { background: var(--hd-c-pressed); }
</style>
