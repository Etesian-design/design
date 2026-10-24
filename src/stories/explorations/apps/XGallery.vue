<script setup lang="ts">
/** Gallery mock: media surface, grid of squircle photo thumbnails. */
import XAppShell from '../parts/XAppShell.vue';
import HdSquircle from '../../../components/HdSquircle.vue';
import { photo } from '../parts/data';
import { shellProps, type XAppProps } from '../parts/types';
const props = withDefaults(defineProps<XAppProps & { thumb?: number }>(), { hints: true, thumb: 112 });
</script>
<template>
  <XAppShell title="Gallery" v-bind="shellProps(props)" media :actions="[{ icon: 'share', label: 'Share' }, { icon: 'delete', label: 'Delete', keys: 'Del' }]">
    <div class="x-gallery">
      <h2 class="x-gallery__title">Lapland · 24 photos</h2>
      <div class="x-gallery__grid" :style="{ gridTemplateColumns: `repeat(auto-fill, ${thumb}px)` }">
        <HdSquircle v-for="i in 24" :key="i" :size="thumb" :src="photo(i)" :alt="`Photo ${i}`" />
      </div>
    </div>
  </XAppShell>
</template>
<style>
.x-gallery { flex: 1; min-height: 0; overflow: hidden; padding: 12px 16px; background: var(--hd-surface-media); color: var(--hd-c-fg); }
.x-gallery__title { margin: 0 0 12px; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1.2 var(--hd-font-family-light); }
.x-gallery__grid { display: grid; gap: 10px; justify-content: start; }
</style>
