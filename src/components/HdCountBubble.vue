<script setup lang="ts">
/** CountBubble (com.nokia.extras). Pill with a number; `large` variant for list items. */
withDefaults(defineProps<{ value: number; large?: boolean; label?: string }>(), {});
</script>
<template>
  <span class="hd-count" :class="{ 'hd-count--large': large }" role="status" :aria-label="label ?? `${value} new`">{{ value > 999 ? '999+' : value }}</span>
</template>
<style>
.hd-count { display: inline-flex; align-items: center; justify-content: center; min-width: 21px; height: 21px; padding: 0 6px; border-radius: 999px; background: var(--hd-accent); color: #fff; font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); }
.hd-count--large { min-width: 27px; height: 27px; font-size: var(--hd-font-size-small); }
</style>
