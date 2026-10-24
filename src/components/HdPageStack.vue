<script setup lang="ts">
/**
 * PageStack / drill-down navigation (N9-original pattern, web extrapolation). One level visible at a
 * time, no breadcrumbs: deeper pages slide in from the right, Back slides them out. The way back is
 * always the Back button (bottom-left on mobile, in the header on desktop) and the browser back.
 */
import { computed, ref, watch } from 'vue';
import HdPageHeader from './HdPageHeader.vue';
import HdToolBar from './HdToolBar.vue';
const props = withDefaults(defineProps<{ titles: string[]; toolbar?: boolean; accent?: string }>(), { toolbar: true });
const emit = defineEmits<{ back: [] }>();
const depth = computed(() => props.titles.length);
const dir = ref<'push' | 'pop'>('push');
watch(depth, (n, o) => (dir.value = n >= o ? 'push' : 'pop'));
</script>
<template>
  <div class="hd-page-stack">
    <Transition :name="`hd-stack-${dir}`" mode="out-in">
      <section :key="depth" class="hd-page-stack__page" :aria-label="titles[titles.length - 1]">
        <HdPageHeader :title="titles[titles.length - 1] ?? ''" :accent="accent" :colored="!!accent" />
        <div class="hd-page-stack__content"><slot :depth="depth" /></div>
      </section>
    </Transition>
    <HdToolBar v-if="toolbar" :back="depth > 1" @back="emit('back')"><slot name="tools" /></HdToolBar>
  </div>
</template>
<style>
.hd-page-stack { display: flex; flex-direction: column; overflow: hidden; background: var(--hd-c-bg); color: var(--hd-c-fg); min-height: 100%; }
.hd-page-stack__page { flex: 1; }
.hd-page-stack__content { padding-bottom: var(--hd-space-xxlarge); }
.hd-stack-push-enter-active, .hd-stack-push-leave-active, .hd-stack-pop-enter-active, .hd-stack-pop-leave-active { transition: transform var(--hd-motion-duration-slow) var(--hd-motion-easing-out), opacity var(--hd-motion-duration-slow); }
.hd-stack-push-enter-from, .hd-stack-pop-leave-to { transform: translateX(100%); }
.hd-stack-push-leave-to, .hd-stack-pop-enter-from { transform: translateX(-30%); opacity: 0; }
</style>
