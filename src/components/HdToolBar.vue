<script setup lang="ts">
/**
 * ToolBar. N9-original: bottom bar, 72 n9px portrait / 56 landscape, dark gradient,
 * Back at the far left, menu at the far right, actions/tabs centred.
 */
import HdToolIcon from './HdToolIcon.vue';
withDefaults(defineProps<{ back?: boolean; menu?: boolean; label?: string; landscape?: boolean; fixed?: boolean }>(), {
  label: 'Toolbar',
});
defineEmits<{ back: []; menu: [] }>();
</script>
<template>
  <nav class="hd-toolbar hd-on-chrome" :class="{ 'hd-toolbar--landscape': landscape, 'hd-toolbar--fixed': fixed }" :aria-label="label">
    <div class="hd-toolbar__side">
      <HdToolIcon v-if="back" icon="back" label="Back" @click="$emit('back')" />
      <slot name="left" />
    </div>
    <div class="hd-toolbar__center"><slot /></div>
    <div class="hd-toolbar__side hd-toolbar__side--end">
      <slot name="right" />
      <HdToolIcon v-if="menu" icon="menu" label="Menu" aria-haspopup="menu" @click="$emit('menu')" />
    </div>
  </nav>
</template>
<style>
.hd-toolbar {
  display: flex; align-items: center; height: var(--hd-size-toolbar); padding: 0 var(--hd-space-medium);
  background: var(--hd-surface-chrome); color: var(--hd-c-fg);
}
.hd-toolbar--landscape { height: var(--hd-size-toolbar-landscape); }
/* landscape: icons fit the 56 n9px bar (the squircle highlight shrinks with it) instead of overflowing */
.hd-toolbar--landscape .hd-tool-icon, .hd-toolbar--landscape .hd-tab-button--icon { height: var(--hd-size-toolbar-landscape); min-height: 0; }
.hd-toolbar--fixed { position: fixed; left: 0; right: 0; bottom: 0; z-index: var(--hd-z-toolbar); }
.hd-toolbar__side { flex: 1 1 0; display: flex; align-items: center; min-width: var(--hd-size-touch-target); }
.hd-toolbar__side--end { justify-content: flex-end; }
.hd-toolbar__center { flex: 0 1 auto; display: flex; align-items: center; gap: var(--hd-space-xxlarge); }
</style>
