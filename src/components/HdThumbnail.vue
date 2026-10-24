<script setup lang="ts">
/** Thumbnail: squircle image / file icon (SIZE_THUMBNAIL 6.4mm = 64 n9px). */
import HdSquircle from './HdSquircle.vue';
import HdIcon from './HdIcon.vue';
withDefaults(defineProps<{ src?: string; alt?: string; icon?: string; size?: number; color?: string }>(), { size: 43, icon: 'photo' });
</script>
<template>
  <HdSquircle class="hd-thumbnail" :size="size" :src="src" :alt="alt" :color="src ? undefined : (color ?? 'var(--hd-c-surface-raised)')">
    <HdIcon :name="icon" :size="Math.round(size * 0.5)" />
  </HdSquircle>
</template>
<style>
.hd-thumbnail { color: var(--hd-c-fg-secondary); }
</style>
