<script setup lang="ts">
/** Tablet screen: 1280x800 landscape or 800x1280 portrait, N9 status bar on top, content below. */
import XDevice from '../../../shell/parts/XDevice.vue';
import HdStatusBar from '../../../components/HdStatusBar.vue';
withDefaults(defineProps<{ orientation?: 'landscape' | 'portrait'; label?: string; statusBar?: boolean }>(), { orientation: 'landscape', statusBar: true });
</script>
<template>
  <XDevice :w="orientation === 'landscape' ? 1280 : 800" :h="orientation === 'landscape' ? 800 : 1280" :label="label ?? (orientation === 'landscape' ? 'Landscape' : 'Portrait')">
    <div class="x-tablet" :class="`x-tablet--${orientation}`">
      <HdStatusBar v-if="statusBar" operator="Etesian" time="12:45" :signal="4" />
      <div class="x-tablet__content"><slot /></div>
    </div>
  </XDevice>
</template>
<style>
.x-tablet { display: flex; flex-direction: column; width: 100%; height: 100%; }
.x-tablet__content { position: relative; flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
</style>
