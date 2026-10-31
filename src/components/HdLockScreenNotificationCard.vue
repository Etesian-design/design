<script setup lang="ts">
/**
 * Lock-screen notification card (canon, measured from the ROM): dark translucent tile #B30C0F12 (70% of #0C0F12), 8dp radius,
 * 44dp lit squircle app icon or contact photo, the message in large bold type, the sender on the next line
 * ("Sender · N more" for a collapsed group), the time on its own line beneath. No buttons.
 */
import { computed } from 'vue';
import HdSquircle from './HdSquircle.vue';
import HdIcon from './HdIcon.vue';
const props = withDefaults(defineProps<{ message: string; source: string; time: string; icon?: string; image?: string; accent?: string; lighting?: 'lit' | 'flat'; count?: number; more?: number }>(), { lighting: 'lit' });
/** `more` = hidden notifications in the group; legacy `count` = group size */
const extra = computed(() => props.more ?? (props.count && props.count > 1 ? props.count - 1 : 0));
</script>
<template>
  <article class="hd-lock-card" :aria-label="`${source}: ${message}, ${time}${extra ? `, ${extra} more` : ''}`">
    <slot name="media"><HdSquircle :size="44" :src="image" :color="image ? undefined : (accent ?? 'var(--hd-accent)')" :lighting="lighting"><HdIcon :name="icon ?? 'message'" :size="24" :lit="lighting === 'lit' && !image" /></HdSquircle></slot>
    <div class="hd-lock-card__text">
      <p class="hd-lock-card__msg">{{ message }}</p>
      <p class="hd-lock-card__from">{{ source }}<span v-if="extra"> · {{ extra }} more</span></p>
      <p v-if="time" class="hd-lock-card__time"><time>{{ time }}</time></p>
    </div>
  </article>
</template>
<style>
.hd-lock-card { display: flex; gap: 18px; align-items: center; padding: 14px 16px; border-radius: 8px; background: rgba(12, 15, 18, .70); color: #fff; -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
.hd-lock-card__text { min-width: 0; }
.hd-lock-card__text p { margin: 0; }
.hd-lock-card__msg { font: 400 1.125rem/1.3 var(--hd-font-family-base); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.hd-lock-card__from { margin-top: 2px !important; font: 400 .875rem/1.3 var(--hd-font-family-base); color: rgba(255,255,255,.8); }
.hd-lock-card__time { font: 400 .875rem/1.4 var(--hd-font-family-base); color: rgba(255,255,255,.6); }
</style>
