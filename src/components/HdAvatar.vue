<script setup lang="ts">
/** Avatar / contact photo. Squircle rule (canon): never a circle. Falls back to initials on an accent colour. */
import { computed } from 'vue';
import HdSquircle from './HdSquircle.vue';
import type { IconLighting } from '../lighting';
const props = withDefaults(defineProps<{ name: string; src?: string; size?: number; color?: string; lighting?: IconLighting }>(), { size: 43, lighting: 'lit' });
const initials = computed(() => props.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join(''));
const palette = ['#007DC9', '#09A7CC', '#62B700', '#821DDE', '#CC09BA', '#EF5500', '#ED9507', '#0067BC'];
const bg = computed(() => props.color ?? palette[[...props.name].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length]);
</script>
<template>
  <HdSquircle class="hd-avatar" :size="size" :src="src" :alt="name" :color="src ? undefined : bg" :lighting="lighting">
    <span aria-hidden="true" :style="{ fontSize: `${Math.round(size * 0.38)}px` }">{{ initials }}</span>
  </HdSquircle>
</template>
<style>
.hd-avatar span { font-family: var(--hd-font-family-light); font-weight: 300; color: #fff; }
</style>
