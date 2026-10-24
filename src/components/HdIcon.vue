<script setup lang="ts">
import { computed } from 'vue';
import { icons } from './icons';
const props = withDefaults(defineProps<{ name: string; size?: number | string; label?: string }>(), { size: 24 });
const d = computed(() => icons[props.name] ?? icons.info);
const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size));
</script>
<template>
  <svg class="hd-icon" viewBox="0 0 24 24" :width="px" :height="px" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    :role="label ? 'img' : undefined" :aria-label="label" :aria-hidden="label ? undefined : 'true'" focusable="false">
    <path :d="d" />
  </svg>
</template>
<style>
.hd-icon { display: inline-block; flex: none; vertical-align: middle; }
</style>
