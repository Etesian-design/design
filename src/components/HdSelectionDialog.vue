<script setup lang="ts">
/** SelectionDialog. N9-original: title then a list of options; selected one highlighted in accent; tapping selects and closes. */
import { ref } from 'vue';
import HdDialog from './HdDialog.vue';
const props = withDefaults(defineProps<{ open: boolean; title: string; options: string[]; modelValue?: number; inline?: boolean }>(), { modelValue: -1 });
const emit = defineEmits<{ 'update:modelValue': [i: number]; 'update:open': [v: boolean] }>();
const list = ref<HTMLElement>();
function pick(i: number) { emit('update:modelValue', i); emit('update:open', false); }
function onKey(e: KeyboardEvent) {
  const items = [...(list.value?.querySelectorAll<HTMLElement>('[role=option]') ?? [])];
  const i = items.indexOf(document.activeElement as HTMLElement);
  if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(i + 1, items.length - 1)]?.focus(); }
  if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(i - 1, 0)]?.focus(); }
}
</script>
<template>
  <HdDialog :open="open" :title="title" :inline="inline" @close="emit('update:open', false)">
    <ul ref="list" class="hd-selection" role="listbox" :aria-label="title" @keydown="onKey">
      <li v-for="(o, i) in options" :key="o" role="option" :aria-selected="i === props.modelValue ? 'true' : 'false'" :tabindex="(i === props.modelValue || (props.modelValue < 0 && i === 0)) ? 0 : -1"
        class="hd-selection__item hd-focusable" :class="{ 'is-selected': i === props.modelValue }" @click="pick(i)" @keydown.enter.prevent="pick(i)" @keydown.space.prevent="pick(i)">{{ o }}</li>
    </ul>
  </HdDialog>
</template>
<style>
.hd-selection { list-style: none; margin: 0; padding: 0; text-align: left; max-height: 60vh; overflow: auto; }
.hd-selection__item { min-height: var(--hd-size-list-item-small); display: flex; align-items: center; padding: 0 var(--hd-space-xlarge); color: var(--hd-c-fg); font: var(--hd-font-weight-light) var(--hd-font-size-large)/1.2 var(--hd-font-family-light); border-radius: var(--hd-radius-control); cursor: pointer; }
.hd-selection__item:hover { background: var(--hd-c-pressed); }
.hd-selection__item.is-selected { background: var(--hd-accent); }
</style>
