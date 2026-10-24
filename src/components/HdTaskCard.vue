<script setup lang="ts">
/** TaskCard (Open applications view, canon). Live app thumbnail with app name; close button appears in "edit" (long-press) mode. */
import HdIcon from './HdIcon.vue';
withDefaults(defineProps<{ title: string; editing?: boolean; accent?: string }>(), {});
defineEmits<{ open: []; close: [] }>();
</script>
<template>
  <div class="hd-task-card" :class="{ 'is-editing': editing }">
    <button type="button" class="hd-task-card__body hd-focusable" :aria-label="`Switch to ${title}`" @click="$emit('open')">
      <span class="hd-task-card__preview" :style="accent ? { '--hd-accent': accent } : undefined"><slot><span class="hd-task-card__placeholder"></span></slot></span>
      <span class="hd-task-card__title">{{ title }}</span>
    </button>
    <button v-if="editing" type="button" class="hd-task-card__close hd-sq hd-focusable" :aria-label="`Close ${title}`" @click="$emit('close')"><HdIcon name="close" :size="16" /></button>
  </div>
</template>
<style>
.hd-task-card { position: relative; }
.hd-task-card__body { display: flex; flex-direction: column; gap: 6px; width: 100%; padding: 0; border: 0; background: none; color: inherit; cursor: pointer; font: inherit; text-align: left; border-radius: 6px; }
.hd-task-card__preview { display: block; width: 100%; aspect-ratio: 480 / 854; border-radius: 6px; overflow: hidden; background: var(--hd-c-bg); color: var(--hd-c-fg); transition: transform var(--hd-motion-duration-fast) var(--hd-motion-easing-out); }
.hd-task-card__body:hover .hd-task-card__preview { transform: scale(1.02); }
.hd-task-card__body:active .hd-task-card__preview { transform: scale(.97); }
.hd-task-card__placeholder { display: block; height: 18%; background: var(--hd-accent); }
.hd-task-card__title { font-size: var(--hd-font-size-xsmall); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hd-task-card.is-editing .hd-task-card__preview { animation: hd-wobble .3s ease-in-out infinite alternate; }
.hd-task-card__close { position: absolute; top: -8px; left: -8px; width: 28px; height: 28px; border: 0; --hd-sq-size: 28px; --hd-sq-fill: var(--hd-color-palette-warning); color: #fff; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
@keyframes hd-wobble { from { transform: rotate(-.6deg); } to { transform: rotate(.6deg); } }
</style>
