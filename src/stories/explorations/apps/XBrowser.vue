<script setup lang="ts">
/** Browser mock: address field and a calm web page. */
import XAppShell from '../parts/XAppShell.vue';
import HdTextField from '../../../components/HdTextField.vue';
import HdButton from '../../../components/HdButton.vue';
import HdSquircle from '../../../components/HdSquircle.vue';
import { photo } from '../parts/data';
import { shellProps, type XAppProps } from '../parts/types';
const props = withDefaults(defineProps<XAppProps>(), { hints: true });
</script>
<template>
  <XAppShell title="Harmattan journal" v-bind="shellProps(props)" :actions="[{ icon: 'refresh', label: 'Reload', keys: 'Ctrl+R' }, { icon: 'star', label: 'Bookmark', keys: 'Ctrl+D' }]">
    <div class="x-web" style="--hd-accent: #2EA8C7">
      <div class="x-web__bar"><HdTextField model-value="journal.example/tablet-swipe" aria-label="Address" icon="globe" /></div>
      <article class="x-web__page">
        <p class="x-web__kicker">Design · 6 min read</p>
        <h1 class="x-web__h1">A tablet for the swipe generation</h1>
        <div class="x-web__by"><HdSquircle :size="32" :src="photo(2)" alt="Author" /><span>Sara Koski · 24 October 2026</span></div>
        <p>The N9 had no home button. One swipe from any edge took you out of an app, and three calm home views did the rest. What would that look like on a 10-inch screen, with a keyboard, or with a mouse?</p>
        <p>The answer is mostly: keep the rules, add room. Bigger grids, two panes, a second app beside the first.</p>
        <HdButton variant="accent">Read more</HdButton>
      </article>
    </div>
  </XAppShell>
</template>
<style>
.x-web { flex: 1; min-height: 0; overflow: hidden; background: var(--hd-c-bg); }
.x-web__bar { padding: 8px 16px; border-bottom: 1px solid var(--hd-c-divider); }
.x-web__page { max-width: 680px; margin: 0 auto; padding: 16px 24px; font-size: var(--hd-font-size-default); line-height: 1.55; }
.x-web__kicker { margin: 0; color: var(--hd-c-accent-text); font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); text-transform: uppercase; }
.x-web__h1 { margin: 6px 0 10px; font: var(--hd-font-weight-light) 32px/1.15 var(--hd-font-family-light); }
.x-web__by { display: flex; gap: 8px; align-items: center; font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); }
</style>
