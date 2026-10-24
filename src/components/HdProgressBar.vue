<script setup lang="ts">
/** ProgressBar. N9-original: thin track, accent fill; indeterminate stripes. */
import { computed } from 'vue';
const props = withDefaults(defineProps<{ value?: number; min?: number; max?: number; indeterminate?: boolean; label?: string }>(), { value: 0, min: 0, max: 100, label: 'Progress' });
const pct = computed(() => Math.max(0, Math.min(100, ((props.value - props.min) / (props.max - props.min)) * 100)));
</script>
<template>
  <div class="hd-progress" :class="{ 'hd-progress--indeterminate': indeterminate }" role="progressbar" :aria-label="label"
    :aria-valuemin="indeterminate ? undefined : min" :aria-valuemax="indeterminate ? undefined : max" :aria-valuenow="indeterminate ? undefined : value">
    <div class="hd-progress__fill" :style="indeterminate ? undefined : { width: `${pct}%` }"></div>
  </div>
</template>
<style>
.hd-progress { height: 6px; border-radius: 999px; background: var(--hd-c-divider); overflow: hidden; }
.hd-progress__fill { height: 100%; background: var(--hd-accent); border-radius: inherit; transition: width var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-progress--indeterminate .hd-progress__fill { width: 100%; background: repeating-linear-gradient(-45deg, var(--hd-accent) 0 8px, color-mix(in srgb, var(--hd-accent) 55%, transparent) 8px 16px); background-size: 22.6px 100%; animation: hd-progress-move .6s linear infinite; }
@keyframes hd-progress-move { to { background-position: 22.6px 0; } }
</style>
