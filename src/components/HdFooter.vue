<script setup lang="ts">
/** Footer (extrapolated, web). Quiet, inverted, columns of links, small secondary text. */
import HdContainer from './HdContainer.vue';
export interface HdFooterColumn { title: string; links: { label: string; href: string }[] }
withDefaults(defineProps<{ columns?: HdFooterColumn[]; note?: string }>(), { columns: () => [] });
</script>
<template>
  <footer class="hd-footer hd-inverted">
    <HdContainer>
      <div class="hd-footer__cols">
        <slot name="brand" />
        <nav v-for="c in columns" :key="c.title" :aria-label="c.title" class="hd-footer__col">
          <h2 class="hd-footer__title">{{ c.title }}</h2>
          <ul><li v-for="l in c.links" :key="l.href"><a :href="l.href" class="hd-focusable">{{ l.label }}</a></li></ul>
        </nav>
      </div>
      <p v-if="note" class="hd-footer__note">{{ note }}</p>
    </HdContainer>
  </footer>
</template>
<style>
.hd-footer { background: var(--hd-c-bg); color: var(--hd-c-fg); padding: 48px 0 calc(48px + var(--hd-size-toolbar)); font-size: var(--hd-font-size-small); }
@media (min-width: 600px) { .hd-footer { padding-bottom: 48px; } }
.hd-footer__cols { display: grid; gap: 32px; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
.hd-footer__title { margin: 0 0 12px; font: var(--hd-font-weight-bold) var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); text-transform: uppercase; color: var(--hd-c-fg-secondary); letter-spacing: .05em; }
.hd-footer ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.hd-footer a { color: var(--hd-c-fg); text-decoration: none; border-radius: 2px; }
.hd-footer a:hover { text-decoration: underline; }
.hd-footer__note { margin: 32px 0 0; padding-top: 16px; border-top: 1px solid var(--hd-c-divider); color: var(--hd-c-fg-secondary); }
</style>
