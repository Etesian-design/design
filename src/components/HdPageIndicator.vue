<script setup lang="ts">
/** PageIndicator (com.nokia.extras): dots for horizontal views (e.g. Home: Events / Apps / Open apps). */
withDefaults(defineProps<{ total: number; current: number; interactive?: boolean; label?: string }>(), { label: 'Pages' });
defineEmits<{ select: [index: number] }>();
</script>
<template>
  <div v-if="interactive" class="hd-page-indicator" role="tablist" :aria-label="label">
    <button v-for="i in total" :key="i" type="button" role="tab" class="hd-page-indicator__dot hd-focusable" :class="{ 'is-current': i - 1 === current }"
      :aria-selected="i - 1 === current ? 'true' : 'false'" :aria-label="`Page ${i} of ${total}`" @click="$emit('select', i - 1)"></button>
  </div>
  <div v-else class="hd-page-indicator" role="img" :aria-label="`${label}: ${current + 1} of ${total}`">
    <span v-for="i in total" :key="i" class="hd-page-indicator__dot" :class="{ 'is-current': i - 1 === current }"></span>
  </div>
</template>
<style>
.hd-page-indicator { display: inline-flex; gap: 8px; align-items: center; }
.hd-page-indicator__dot { width: 8px; height: 8px; padding: 0; border: 0; border-radius: 999px; background: currentColor; opacity: .3; transition: opacity var(--hd-motion-duration-default); }
button.hd-page-indicator__dot { cursor: pointer; box-sizing: content-box; background-clip: content-box; padding: 6px; margin: -6px; }
.hd-page-indicator__dot.is-current { opacity: 1; }
</style>
