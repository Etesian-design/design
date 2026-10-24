<script setup lang="ts">
/** Base squircle shape (|x|^2.8+|y|^2.8=1). Used by Avatar, AppIcon, Thumbnail. */
import { computed } from 'vue';
const props = withDefaults(defineProps<{ size?: number | string; src?: string; alt?: string; color?: string; tag?: string }>(), { size: 43, tag: 'span' });
const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size));
</script>
<template>
  <component :is="tag" class="hd-squircle hd-squircle-box" :style="{ width: px, height: px, background: color }"
    :role="src || alt ? 'img' : undefined" :aria-label="!src ? alt : undefined">
    <img v-if="src" :src="src" :alt="alt ?? ''" />
    <slot v-else />
  </component>
</template>
<style>
.hd-squircle-box { position: relative; display: inline-flex; align-items: center; justify-content: center; flex: none; overflow: hidden; background: var(--hd-c-surface-raised); color: #fff; }
.hd-squircle-box img { width: 100%; height: 100%; object-fit: cover; display: block; }
</style>
