<script setup lang="ts">
/**
 * TaskCard (Open applications view, canon). Live app thumbnail with app name.
 * Edit mode (long-press), measured from the N9: the preview dims to exactly 50% (black at 50% alpha, no tint) and a red
 * lit squircle close button (n = 2.8, #F78673 → #EF2C10, thick white rounded ✕) sits at the TOP-RIGHT, ~0.28 × card width,
 * its right edge ~1/8 of its size past the card and slightly above the top. Cap the size with --hd-task-card-close-max.
 */
withDefaults(defineProps<{ title: string; editing?: boolean; accent?: string }>(), {});
defineEmits<{ open: []; close: [] }>();
</script>
<template>
  <div class="hd-task-card" :class="{ 'is-editing': editing }">
    <button type="button" class="hd-task-card__body hd-focusable" :aria-label="`Switch to ${title}`" @click="$emit('open')">
      <span class="hd-task-card__preview" :style="accent ? { '--hd-accent': accent } : undefined"><slot><span class="hd-task-card__placeholder"></span></slot></span>
      <span class="hd-task-card__title">{{ title }}</span>
    </button>
    <button v-if="editing" type="button" class="hd-task-card__close hd-sq hd-focusable" :aria-label="`Close ${title}`" @click="$emit('close')">
      <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M31 31L69 69M69 31L31 69" stroke="#fff" stroke-width="13" stroke-linecap="round" fill="none" /></svg>
    </button>
  </div>
</template>
<style>
.hd-task-card { position: relative; container-type: inline-size; }
.hd-task-card__body { display: flex; flex-direction: column; gap: 6px; width: 100%; padding: 0; border: 0; background: none; color: inherit; cursor: pointer; font: inherit; text-align: left; border-radius: 6px; }
.hd-task-card__preview { position: relative; display: block; width: 100%; aspect-ratio: 480 / 854; border-radius: 6px; overflow: hidden; background: var(--hd-c-bg); color: var(--hd-c-fg); transition: transform var(--hd-motion-duration-fast) var(--hd-motion-easing-out); }
.hd-task-card__body:hover .hd-task-card__preview { transform: scale(1.02); }
.hd-task-card__body:active .hd-task-card__preview { transform: scale(.97); }
.hd-task-card__placeholder { display: block; height: 18%; background: var(--hd-accent); }
.hd-task-card__title { font: 400 .875rem/1.2 var(--hd-font-family-base); text-align: center; color: inherit; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* edit mode: preview at exactly 50% brightness */
.hd-task-card.is-editing .hd-task-card__preview::after { content: ''; position: absolute; inset: 0; z-index: 1; background: rgba(0, 0, 0, .5); pointer-events: none; }
.hd-task-card.is-editing .hd-task-card__body:hover .hd-task-card__preview { transform: none; }
.hd-task-card__close {
  --s: min(28cqw, var(--hd-task-card-close-max, 999px));
  position: absolute; z-index: 2; top: calc(var(--s) * -0.15); right: calc(var(--s) * -0.125); width: var(--s); height: var(--s); padding: 0; border: 0;
  --hd-sq-size: var(--s); --hd-sq-fill: linear-gradient(#F78673, #EF2C10); display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
}
.hd-task-card__close svg { width: 100%; height: 100%; }
</style>
