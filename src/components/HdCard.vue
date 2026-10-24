<script setup lang="ts">
/** Card (extrapolated, web). Flat surface, no shadow (canon: shadows only on overlays), squircle media optional. Whole card is a link when href is set. */
import HdSquircle from './HdSquircle.vue';
import HdIcon from './HdIcon.vue';
withDefaults(defineProps<{ title?: string; text?: string; href?: string; icon?: string; accent?: string; image?: string; level?: 2 | 3 | 4; lighting?: 'lit' | 'flat' }>(), { level: 3, lighting: 'lit' });
</script>
<template>
  <article class="hd-card" :class="{ 'hd-card--link': href }" :style="accent ? { '--hd-accent': accent } : undefined">
    <img v-if="image" class="hd-card__image" :src="image" alt="" />
    <HdSquircle v-if="icon" :size="43" :color="accent ?? 'var(--hd-accent)'" :lighting="lighting"><HdIcon :name="icon" :size="22" :lit="lighting === 'lit'" /></HdSquircle>
    <component :is="`h${level}`" v-if="title" class="hd-card__title">
      <a v-if="href" :href="href" class="hd-card__link">{{ title }}</a><template v-else>{{ title }}</template>
    </component>
    <p v-if="text" class="hd-card__text">{{ text }}</p>
    <slot />
    <div v-if="$slots.actions" class="hd-card__actions"><slot name="actions" /></div>
  </article>
</template>
<style>
.hd-card { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: var(--hd-space-double); padding: var(--hd-space-xxlarge); background: var(--hd-c-surface); border: 1px solid var(--hd-c-divider); border-radius: var(--hd-radius-card); transition: border-color var(--hd-motion-duration-instant), transform var(--hd-motion-duration-fast) var(--hd-motion-easing-out); }
.hd-card__image { width: calc(100% + 32px); margin: -16px -16px 4px; aspect-ratio: 16/9; object-fit: cover; border-radius: var(--hd-radius-card) var(--hd-radius-card) 0 0; }
.hd-card__title { margin: 0; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1.2 var(--hd-font-family-light); }
.hd-card__text { margin: 0; color: var(--hd-c-fg-secondary); line-height: var(--hd-font-line-height-prose); }
.hd-card__actions { display: flex; gap: var(--hd-space-double); margin-top: auto; padding-top: var(--hd-space-double); }
.hd-card__link { color: inherit; text-decoration: none; }
.hd-card__link::after { content: ''; position: absolute; inset: 0; border-radius: inherit; }
.hd-card__link:focus-visible { outline: none; }
.hd-card--link:focus-within { outline: 2px solid var(--hd-c-focus); outline-offset: 2px; }
.hd-card--link:hover { border-color: var(--hd-accent); transform: translateY(-2px); }
</style>
