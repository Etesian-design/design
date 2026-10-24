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
  <nav class="hd-toolbar hd-inverted" :class="{ 'hd-toolbar--landscape': landscape, 'hd-toolbar--fixed': fixed }" :aria-label="label">
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
  background: linear-gradient(var(--hd-c-toolbar-from), var(--hd-c-toolbar-to)); color: #fff;
}
.hd-toolbar--landscape { height: var(--hd-size-toolbar-landscape); }
.hd-toolbar--fixed { position: fixed; left: 0; right: 0; bottom: 0; z-index: var(--hd-z-toolbar); }
.hd-toolbar__side { flex: 1 1 0; display: flex; align-items: center; min-width: var(--hd-size-touch-target); }
.hd-toolbar__side--end { justify-content: flex-end; }
.hd-toolbar__center { flex: 0 1 auto; display: flex; align-items: center; gap: var(--hd-space-xxlarge); }
</style>
