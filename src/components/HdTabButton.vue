<script setup lang="ts">
/** TabButton: one tab in a TabBar (role=tab). N9-original: icon tab in the toolbar, or text segment (ButtonRow). */
import HdIcon from './HdIcon.vue';
defineProps<{ label: string; icon?: string; selected?: boolean; controls?: string; id?: string }>();
defineEmits<{ click: [] }>();
</script>
<template>
  <button type="button" role="tab" class="hd-tab-button hd-focusable" :id="id" :class="{ 'is-selected': selected, 'hd-tab-button--icon': icon }"
    :aria-selected="selected ? 'true' : 'false'" :aria-controls="controls" :tabindex="selected ? 0 : -1"
    :aria-label="icon ? label : undefined" :title="icon ? label : undefined" @click="$emit('click')">
    <HdIcon v-if="icon" :name="icon" :size="24" /><span v-else>{{ label }}</span>
  </button>
</template>
<style>
.hd-tab-button {
  flex: 1 1 0; min-height: 36px; min-width: var(--hd-size-touch-target); padding: 0 var(--hd-space-xlarge);
  border: 1px solid var(--hd-c-button-border); margin-left: -1px; background: var(--hd-c-button-bg); color: var(--hd-c-button-fg);
  font: var(--hd-font-weight-bold) var(--hd-font-size-small)/1 var(--hd-font-family-base); cursor: pointer;
}
.hd-tab-button:first-child { border-radius: var(--hd-radius-control) 0 0 var(--hd-radius-control); margin-left: 0; }
.hd-tab-button:last-child { border-radius: 0 var(--hd-radius-control) var(--hd-radius-control) 0; }
.hd-tab-button.is-selected { background: var(--hd-accent); color: #fff; border-color: transparent; }
.hd-tab-button--icon { background: transparent; border: 0; border-radius: var(--hd-radius-control) !important; color: inherit; opacity: .6; }
.hd-tab-button--icon.is-selected { background: var(--hd-c-pressed); color: inherit; opacity: 1; }
</style>
