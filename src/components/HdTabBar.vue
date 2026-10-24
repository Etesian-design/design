<script setup lang="ts">
/**
 * TabBar. Segmented text tabs (N9 ButtonRow/TabBarLayout) or icon tabs inside the ToolBar.
 * Keyboard (extrapolated, WAI-ARIA tabs): Left/Right/Home/End move and select.
 */
import { ref } from 'vue';
import HdTabButton from './HdTabButton.vue';
export interface HdTab { id: string; label: string; icon?: string }
const props = withDefaults(defineProps<{ tabs: HdTab[]; modelValue: string; label?: string; idPrefix?: string; vertical?: boolean }>(), { label: 'Tabs', idPrefix: 'hd-tab', vertical: false });
const emit = defineEmits<{ 'update:modelValue': [id: string] }>();
const bar = ref<HTMLElement>();
function onKey(e: KeyboardEvent) {
  const i = props.tabs.findIndex((t) => t.id === props.modelValue);
  let n = i;
  const next = props.vertical ? 'ArrowDown' : 'ArrowRight', prev = props.vertical ? 'ArrowUp' : 'ArrowLeft';
  if (e.key === next) n = (i + 1) % props.tabs.length;
  else if (e.key === prev) n = (i - 1 + props.tabs.length) % props.tabs.length;
  else if (e.key === 'Home') n = 0;
  else if (e.key === 'End') n = props.tabs.length - 1;
  else return;
  e.preventDefault();
  emit('update:modelValue', props.tabs[n].id);
  requestAnimationFrame(() => (bar.value?.querySelectorAll<HTMLElement>('[role=tab]')[n])?.focus());
}
</script>
<template>
  <div ref="bar" class="hd-tab-bar" :class="{ 'hd-tab-bar--segments hd-btn-group-lit': !tabs.some((t) => t.icon), 'hd-tab-bar--vertical': vertical }" role="tablist" :aria-label="label" :aria-orientation="vertical ? 'vertical' : undefined" @keydown="onKey">
    <HdTabButton v-for="t in tabs" :key="t.id" :id="`${idPrefix}-${t.id}`" :controls="`${idPrefix}-${t.id}-panel`"
      :label="t.label" :icon="t.icon" :selected="t.id === modelValue" @click="emit('update:modelValue', t.id)" />
  </div>
</template>
<style>
.hd-tab-bar { display: flex; align-items: stretch; }
.hd-tab-bar--vertical { flex-direction: column; }
.hd-tab-bar--segments { display: flex; }
</style>
