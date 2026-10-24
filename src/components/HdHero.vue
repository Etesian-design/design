<script setup lang="ts">
/** Hero (extrapolated, web). Big light type, lots of whitespace, one accent action. Optional accent fill. */
import HdContainer from './HdContainer.vue';
withDefaults(defineProps<{ title: string; lead?: string; eyebrow?: string; colored?: boolean; accent?: string }>(), {});
</script>
<template>
  <section class="hd-hero" :class="{ 'hd-hero--colored': colored }" :style="accent ? { '--hd-accent': accent } : undefined">
    <HdContainer class="hd-hero__inner">
      <div class="hd-hero__text">
        <p v-if="eyebrow" class="hd-hero__eyebrow">{{ eyebrow }}</p>
        <h1 class="hd-hero__title">{{ title }}</h1>
        <p v-if="lead" class="hd-hero__lead">{{ lead }}</p>
        <div v-if="$slots.actions" class="hd-hero__actions"><slot name="actions" /></div>
      </div>
      <div v-if="$slots.media" class="hd-hero__media"><slot name="media" /></div>
    </HdContainer>
  </section>
</template>
<style>
.hd-hero { container: hd-hero / inline-size; padding: 48px 0; }
@container hd-hero (min-width: 960px) { .hd-hero__inner { padding-block: 48px; } }
.hd-hero--colored { background: var(--hd-accent); color: #fff; }
.hd-hero__inner { display: grid; gap: 32px; align-items: center; }
.hd-hero__media { min-width: 0; max-width: 100%; }
/* Two columns only when the hero itself is wide enough, not the window. */
@container hd-hero (min-width: 960px) { .hd-hero__inner { grid-template-columns: 1.2fr 1fr; } }
.hd-hero__eyebrow { margin: 0 0 8px; font: var(--hd-font-weight-bold) var(--hd-font-size-small)/1 var(--hd-font-family-base); text-transform: uppercase; letter-spacing: .06em; color: var(--hd-c-accent-text); }
.hd-hero--colored .hd-hero__eyebrow { color: rgba(255,255,255,.85); }
.hd-hero__title { margin: 0; font: var(--hd-font-weight-light) clamp(32px, 6cqi, 64px)/1.05 var(--hd-font-family-light); letter-spacing: -0.01em; }
.hd-hero__lead { margin: 16px 0 0; max-width: 36ch; font-size: var(--hd-font-size-large); line-height: 1.45; color: var(--hd-c-fg-secondary); }
.hd-hero--colored .hd-hero__lead { color: rgba(255,255,255,.9); }
.hd-hero__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
</style>
