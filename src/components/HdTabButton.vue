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
/* inside a segmented group: square inner edges, one 1px divider, the group owns the rim and lighting */
.hd-tab-bar--segments > .hd-tab-button { margin: 0; border: 0; border-radius: 0; background: var(--hd-lit-fill); }
.hd-tab-bar--vertical > .hd-tab-button + .hd-tab-button { border-left: 0; border-top: 1px solid var(--hd-btn-rim); }
.hd-tab-bar--segments > .hd-tab-button.is-selected { background: linear-gradient(color-mix(in srgb, var(--hd-accent) 88%, #fff), var(--hd-accent) 50%, color-mix(in srgb, var(--hd-accent) 88%, #000)); box-shadow: inset 0 1px 0 rgba(255,255,255,.3); color: #fff; }
.hd-tab-bar--segments > .hd-tab-button:hover:not(.is-selected) { background: linear-gradient(color-mix(in srgb, var(--hd-c-fg) 6%, transparent) 0 0), var(--hd-lit-fill); }
/* Icon tab (toolbar, N9): the selected tab is a lighter FULL-HEIGHT cell with square edges across the tab's width,
   not a shape behind the icon. */
.hd-tab-button--icon { align-self: stretch; min-width: 64px; height: auto; border: 0; border-radius: 0; background: transparent; color: inherit; opacity: .6; }
.hd-tab-button--icon:hover { background: color-mix(in srgb, var(--hd-c-pressed) 50%, transparent); }
/* the N9 bottom bar's selected cell: square, the full cell (as the Quasar footer tabs) */
.hd-tab-button--icon, .hd-tab-button--icon:first-child, .hd-tab-button--icon:last-child { border-radius: 0; }
.hd-tab-button--icon.is-selected { background: var(--hd-tab-selected, linear-gradient(rgba(255,255,255,.22), rgba(255,255,255,.08))); color: inherit; opacity: 1; }
</style>
