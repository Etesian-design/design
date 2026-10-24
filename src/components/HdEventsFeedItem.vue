<script setup lang="ts">
/** Events view item (canon, measured from the ROM): 48dp lit squircle icon or photo, title 16sp BOLD, summary 14sp regular, time 12sp grey. Sizes in rem so they follow the OS font size. */
import HdSquircle from './HdSquircle.vue';
import HdIcon from './HdIcon.vue';
withDefaults(defineProps<{ title: string; body?: string; time: string; icon?: string; image?: string; accent?: string; lighting?: 'lit' | 'flat'; href?: string }>(), { lighting: 'lit' });
defineEmits<{ click: [] }>();
</script>
<template>
  <component :is="href ? 'a' : 'button'" :href="href" :type="href ? undefined : 'button'" class="hd-event hd-focusable" @click="$emit('click')">
    <HdSquircle :size="48" :src="image" :color="image ? undefined : (accent ?? 'var(--hd-accent)')" :lighting="lighting"><HdIcon :name="icon ?? 'message'" :size="24" :lit="lighting === 'lit' && !image" /></HdSquircle>
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
.hd-event__title { font: 700 1rem/1.3 var(--hd-font-family-base); }
.hd-event__body { font: 400 .875rem/1.35 var(--hd-font-family-base); color: var(--hd-c-fg); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.hd-event__time { font: 400 .75rem/1.3 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); margin-top: 4px; }
</style>
