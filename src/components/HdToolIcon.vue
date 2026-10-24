<script setup lang="ts">
/** ToolIcon: icon-only button for the ToolBar. N9-original: ~32 n9px icons, no frame, pressed highlight.
 *  The hover/pressed/active highlight is a squircle (n = 2.8), never a rounded square. `active` marks the current view. */
import HdIcon from './HdIcon.vue';
withDefaults(defineProps<{ icon: string; label: string; disabled?: boolean; badge?: number; active?: boolean }>(), {});
defineEmits<{ click: [e: MouseEvent] }>();
</script>
<template>
  <button type="button" class="hd-tool-icon hd-sq hd-focusable" :class="{ 'is-active': active }" :aria-label="label" :aria-pressed="active ? 'true' : undefined" :title="label" :disabled="disabled"
    @click="(e: MouseEvent) => $emit('click', e)">
    <HdIcon :name="icon" :size="24" />
    <span v-if="badge" class="hd-tool-icon__badge" aria-hidden="true">{{ badge }}</span>
  </button>
</template>
<style>
.hd-tool-icon {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  width: var(--hd-size-touch-target); height: var(--hd-size-touch-target);
  border: 0; color: inherit; cursor: pointer; --hd-sq-size: 40px;
}
.hd-tool-icon:hover:not(:disabled), .hd-tool-icon.is-active { --hd-sq-fill: var(--hd-c-pressed); }
.hd-tool-icon:active:not(:disabled) { --hd-sq-fill: var(--hd-c-pressed); opacity: .7; }
.hd-tool-icon:disabled { opacity: var(--hd-opacity-disabled); cursor: default; }
.hd-tool-icon__badge {
  position: absolute; top: 4px; right: 2px; min-width: 16px; height: 16px; padding: 0 4px;
  border-radius: 999px; background: var(--hd-accent); color: #fff; font: 700 11px/16px var(--hd-font-family-base);
}
</style>
