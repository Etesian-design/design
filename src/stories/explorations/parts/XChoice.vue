<script setup lang="ts">
/**
 * State switcher for exploration stories: the N9 tab bar while it fits, a labelled drop-down once it does not.
 * A hidden copy of the tab bar is measured against the available width, so it adapts to any canvas size.
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import HdTabBar, { type HdTab } from '../../../components/HdTabBar.vue';
const props = withDefaults(defineProps<{ tabs: HdTab[]; modelValue: string; label?: string; idPrefix?: string }>(), { label: 'Tabs', idPrefix: 'x-choice' });
const emit = defineEmits<{ 'update:modelValue': [id: string] }>();
const root = ref<HTMLElement>();
const probe = ref<HTMLElement>();
const compact = ref(false);
function measure() {
  if (!root.value || !probe.value) return;
  const avail = root.value.parentElement?.clientWidth ?? root.value.clientWidth;
  compact.value = probe.value.scrollWidth > avail;
}
let ro: ResizeObserver | undefined;
onMounted(() => {
  measure();
  if (typeof ResizeObserver !== 'undefined' && root.value?.parentElement) { ro = new ResizeObserver(measure); ro.observe(root.value.parentElement); }
});
onBeforeUnmount(() => ro?.disconnect());
watch(() => props.tabs, () => nextTick(measure));
</script>
<template>
  <div ref="root" class="x-choice" :class="{ 'x-choice--compact': compact }">
    <div ref="probe" class="x-choice__probe" aria-hidden="true" inert><HdTabBar :tabs="tabs" :model-value="modelValue" :id-prefix="`${idPrefix}-probe`" /></div>
    <label v-if="compact" class="x-choice__select">
      <span class="x-choice__label">{{ label }}</span>
      <select :id="`${idPrefix}-select`" :value="tabs.some((t) => t.id === modelValue) ? modelValue : ''" @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
        <option v-if="!tabs.some((t) => t.id === modelValue)" value="" disabled>Choose…</option>
        <option v-for="t in tabs" :key="t.id" :value="t.id">{{ t.label }}</option>
      </select>
    </label>
    <HdTabBar v-else :tabs="tabs" :model-value="modelValue" :label="label" :id-prefix="idPrefix" @update:model-value="emit('update:modelValue', $event)" />
  </div>
</template>
<style>
.x-choice { position: relative; min-width: 0; max-width: 100%; }
.x-choice__probe { position: absolute; visibility: hidden; pointer-events: none; height: 0; overflow: hidden; width: max-content; }
.x-choice__probe .hd-tab-button { flex: 0 0 auto; white-space: nowrap; min-height: 30px; padding: 0 12px; }
.x-choice__select { display: flex; align-items: center; gap: 8px; font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); max-width: 100%; }
.x-choice__select select { min-width: 0; max-width: 100%; min-height: 32px; padding: 0 28px 0 10px; border-radius: 8px; border: 1px solid var(--hd-c-border, #888); background: var(--hd-c-bg); color: var(--hd-c-fg); font: inherit; font-size: var(--hd-font-size-small); }
</style>
