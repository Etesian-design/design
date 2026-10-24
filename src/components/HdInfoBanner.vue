<script setup lang="ts">
/** InfoBanner (com.nokia.extras). N9-original: dark translucent rounded box near the top, optional icon, auto-hides after 3000ms, scales in 200ms OutQuad. role=status. */
import { onBeforeUnmount, watch } from 'vue';
import HdIcon from './HdIcon.vue';
const props = withDefaults(defineProps<{ open: boolean; text: string; icon?: string; timeout?: number; inline?: boolean }>(), { timeout: 3000 });
const emit = defineEmits<{ 'update:open': [v: boolean] }>();
let t: ReturnType<typeof setTimeout> | undefined;
watch(() => props.open, (v) => { clearTimeout(t); if (v && props.timeout > 0) t = setTimeout(() => emit('update:open', false), props.timeout); }, { immediate: true });
onBeforeUnmount(() => clearTimeout(t));
</script>
<template>
  <div class="hd-info-banner-region" :class="{ 'is-inline': inline }" role="status" aria-live="polite">
    <Transition name="hd-info">
      <div v-if="open" class="hd-info-banner" @click="emit('update:open', false)">
        <HdIcon v-if="icon" :name="icon" :size="24" />
        <span>{{ text }}</span>
      </div>
    </Transition>
  </div>
</template>
<style>
.hd-info-banner-region { position: fixed; top: 32px; left: 8px; right: 8px; z-index: var(--hd-z-banner); display: flex; justify-content: center; pointer-events: none; }
.hd-info-banner-region.is-inline { position: relative; top: 0; left: 0; right: 0; }
.hd-info-banner { pointer-events: auto; display: flex; align-items: center; gap: var(--hd-space-xlarge); max-width: 460px; width: 100%; padding: var(--hd-space-xlarge) var(--hd-space-xxlarge); border-radius: var(--hd-radius-card); background: rgba(30,30,30,.92); color: #fff; font-size: var(--hd-font-size-default); box-shadow: var(--hd-shadow-overlay); }
.hd-info-enter-active { transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out), opacity var(--hd-motion-duration-default); }
.hd-info-leave-active { transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-in), opacity var(--hd-motion-duration-default); }
.hd-info-enter-from, .hd-info-leave-to { transform: scale(0); opacity: 0; }
</style>
