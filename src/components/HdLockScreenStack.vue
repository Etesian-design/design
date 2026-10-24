<script setup lang="ts">
/**
 * Lock-screen notifications (canon). Default variant "stack" (iPhone-style stacked carousel): the newest `visible` notifications
 * (default 3, setting 1–10) as full N9 lock cards at the bottom, the rest as stacked strips under them, each strip narrower
 * and fainter. Sliding up moves the cards over the clock like a carousel. Variant "more": the N9 style, cards then a "More" label.
 */
import { computed } from 'vue';
import HdLockScreenNotificationCard from './HdLockScreenNotificationCard.vue';
export interface HdLockItem { message: string; source: string; time: string; icon?: string; image?: string; accent?: string; more?: number }
const props = withDefaults(defineProps<{ items: HdLockItem[]; visible?: number; variant?: 'stack' | 'more' }>(), { visible: 3, variant: 'stack' });
const n = computed(() => Math.min(10, Math.max(1, props.visible)));
const shown = computed(() => props.items.slice(0, n.value));
const rest = computed(() => props.items.length - shown.value.length);
const strips = computed(() => Math.min(3, rest.value));
</script>
<template>
  <section class="hd-lock-stack" :class="`hd-lock-stack--${variant}`" aria-label="Notifications">
    <HdLockScreenNotificationCard v-for="(it, i) in shown" :key="i" v-bind="it" />
    <template v-if="rest > 0">
      <div v-if="variant === 'stack'" class="hd-lock-stack__strips" :aria-label="`${rest} more notifications`">
        <span v-for="s in strips" :key="s" class="hd-lock-stack__strip" :style="{ width: `${100 - s * 7}%`, opacity: String(1 - s * 0.22) }"></span>
      </div>
      <p v-else class="hd-lock-stack__more">More <span>({{ rest }})</span></p>
    </template>
  </section>
</template>
<style>
.hd-lock-stack { display: flex; flex-direction: column; gap: 8px; }
.hd-lock-stack__strips { display: flex; flex-direction: column; align-items: center; margin-top: -8px; }
.hd-lock-stack__strip { display: block; height: 9px; border-radius: 0 0 8px 8px; background: rgba(12, 15, 18, .62); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
.hd-lock-stack__more { margin: 2px 4px 0; text-align: right; font: 700 .875rem/1 var(--hd-font-family-base); color: rgba(255,255,255,.85); }
.hd-lock-stack__more span { color: rgba(255,255,255,.55); }
</style>
