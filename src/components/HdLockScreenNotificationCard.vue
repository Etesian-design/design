<script setup lang="ts">
/** Lock-screen notification tile (canon): dark translucent, squircle icon/photo left, message in large type, sender/app and time below, no buttons. */
import HdSquircle from './HdSquircle.vue';
import HdIcon from './HdIcon.vue';
defineProps<{ message: string; source: string; time: string; icon?: string; image?: string; accent?: string; count?: number }>();
</script>
<template>
  <article class="hd-lock-card" :aria-label="`${source}: ${message}, ${time}`">
    <HdSquircle :size="43" :src="image" :color="image ? undefined : (accent ?? 'var(--hd-accent)')"><HdIcon :name="icon ?? 'message'" :size="22" /></HdSquircle>
    <div class="hd-lock-card__text">
      <p class="hd-lock-card__msg">{{ message }}</p>
      <p class="hd-lock-card__meta">{{ source }}<span v-if="count && count > 1"> · {{ count }}</span> · <time>{{ time }}</time></p>
    </div>
  </article>
</template>
<style>
.hd-lock-card { display: flex; gap: var(--hd-space-xlarge); align-items: flex-start; padding: var(--hd-space-xlarge); border-radius: var(--hd-radius-card); background: rgba(0,0,0,.55); color: #fff; -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
.hd-lock-card__text { min-width: 0; }
.hd-lock-card__msg { margin: 0; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1.25 var(--hd-font-family-light); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.hd-lock-card__meta { margin: 4px 0 0; font-size: var(--hd-font-size-small); color: #c8c8c8; }
</style>
