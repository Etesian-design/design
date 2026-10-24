<script setup lang="ts">
/** Events view item (canon): squircle thumbnail, title, body, time; groups by source. */
import HdSquircle from './HdSquircle.vue';
import HdIcon from './HdIcon.vue';
defineProps<{ title: string; body?: string; time: string; icon?: string; image?: string; accent?: string; href?: string }>();
defineEmits<{ click: [] }>();
</script>
<template>
  <component :is="href ? 'a' : 'button'" :href="href" :type="href ? undefined : 'button'" class="hd-event hd-focusable" @click="$emit('click')">
    <HdSquircle :size="43" :src="image" :color="image ? undefined : (accent ?? 'var(--hd-accent)')"><HdIcon :name="icon ?? 'message'" :size="22" /></HdSquircle>
    <span class="hd-event__text">
      <span class="hd-event__title">{{ title }}</span>
      <span v-if="body" class="hd-event__body">{{ body }}</span>
      <time class="hd-event__time">{{ time }}</time>
    </span>
  </component>
</template>
<style>
.hd-event { display: flex; gap: var(--hd-space-xlarge); align-items: flex-start; width: 100%; padding: var(--hd-space-double) var(--hd-space-xlarge); border: 0; background: none; color: inherit; font: inherit; text-align: left; text-decoration: none; cursor: pointer; }
.hd-event:hover { background: var(--hd-c-pressed); }
.hd-event__text { display: flex; flex-direction: column; min-width: 0; }
.hd-event__title { font: var(--hd-font-weight-regular) var(--hd-font-size-default)/1.25 var(--hd-font-family-base); }
.hd-event__body { font-size: var(--hd-font-size-default); color: var(--hd-c-fg); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.hd-event__time { font-size: var(--hd-font-size-xsmall); color: var(--hd-c-fg-secondary); margin-top: 2px; }
</style>
