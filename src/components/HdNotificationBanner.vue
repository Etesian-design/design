<script setup lang="ts">
/** NotificationBanner. Canon: incoming notifications slide down from the top edge over the status bar; squircle icon/photo, title, body; tap opens; auto-dismiss. */
import { onBeforeUnmount, watch } from 'vue';
import HdSquircle from './HdSquircle.vue';
import HdIcon from './HdIcon.vue';
const props = withDefaults(defineProps<{ open: boolean; title: string; body?: string; icon?: string; image?: string; accent?: string; lighting?: 'lit' | 'flat'; timeout?: number; inline?: boolean }>(), { timeout: 5000, icon: 'message', lighting: 'lit' });
const emit = defineEmits<{ 'update:open': [v: boolean]; activate: [] }>();
let t: ReturnType<typeof setTimeout> | undefined;
watch(() => props.open, (v) => { clearTimeout(t); if (v && props.timeout > 0) t = setTimeout(() => emit('update:open', false), props.timeout); }, { immediate: true });
onBeforeUnmount(() => clearTimeout(t));
</script>
<template>
  <div class="hd-notif-region" :class="{ 'is-inline': inline }" aria-live="polite">
    <Transition name="hd-notif">
      <button v-if="open" type="button" class="hd-notif hd-on-banner hd-focusable" @click="emit('activate'); emit('update:open', false)">
        <HdSquircle :size="40" :src="image" :color="image ? undefined : (accent ?? 'var(--hd-accent)')" :lighting="lighting"><HdIcon :name="icon" :size="20" :lit="lighting === 'lit' && !image" /></HdSquircle>
        <span class="hd-notif__text"><strong>{{ title }}</strong><span v-if="body">{{ body }}</span></span>
      </button>
    </Transition>
  </div>
</template>
<style>
.hd-notif-region { position: fixed; top: 0; left: 0; right: 0; z-index: var(--hd-z-banner); }
.hd-notif-region.is-inline { position: relative; }
.hd-notif { display: flex; align-items: center; gap: var(--hd-space-xlarge); width: 100%; padding: var(--hd-space-double) var(--hd-space-xlarge); border: 0; text-align: left; cursor: pointer;
  background: var(--hd-surface-banner); color: var(--hd-c-fg); font: inherit; box-shadow: var(--hd-shadow-overlay); }
.hd-notif__text { display: flex; flex-direction: column; min-width: 0; }
.hd-notif__text strong { font: var(--hd-font-weight-regular) var(--hd-font-size-default)/1.25 var(--hd-font-family-base); }
.hd-notif__text span { font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hd-notif-enter-active, .hd-notif-leave-active { transition: transform var(--hd-motion-duration-slow) var(--hd-motion-easing-out); }
.hd-notif-enter-from, .hd-notif-leave-to { transform: translateY(-100%); }
</style>
