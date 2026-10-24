<script setup lang="ts">
/** Music mock: media surface (black in Hybrid and Dark, light grey in Light), square-edged cover art, squircle track thumbnails. */
import XAppShell from '../parts/XAppShell.vue';
import HdListItem from '../../../components/HdListItem.vue';
import HdThumbnail from '../../../components/HdThumbnail.vue';
import HdSlider from '../../../components/HdSlider.vue';
import HdToolIcon from '../../../components/HdToolIcon.vue';
import { photo } from '../parts/data';
import { shellProps, type XAppProps } from '../parts/types';
const props = withDefaults(defineProps<XAppProps>(), { hints: true });
const tracks = ['Polar night', 'Harmattan wind', 'Swipe', 'Northern lights', 'Pure'];
</script>
<template>
  <XAppShell title="Now playing" v-bind="shellProps(props)" media :actions="[{ icon: 'share', label: 'Share' }]">
    <div class="x-music" style="--hd-accent: #CC09BA">
      <div class="x-music__now">
        <img class="x-music__art" :src="photo(6)" alt="Album cover" />
        <h2 class="x-music__track">Harmattan wind</h2>
        <p class="x-music__artist">The Swipes · Polar night</p>
        <HdSlider :model-value="38" label="Position" />
        <div class="x-music__ctl"><HdToolIcon icon="back" label="Previous" /><HdToolIcon icon="play" label="Play" active /><HdToolIcon icon="chevron-right" label="Next" /></div>
      </div>
      <div class="x-music__list">
        <HdListItem v-for="(t, i) in tracks" :key="t" :title="t" :subtitle="`The Swipes · 3:${10 + i * 7}`" clickable :selected="i === 1">
          <template #leading><HdThumbnail :src="photo(6 + i)" alt="" :size="density === 'pointer' ? 22 : 43" /></template>
        </HdListItem>
      </div>
    </div>
  </XAppShell>
</template>
<style>
.x-music { flex: 1; min-height: 0; display: flex; gap: 16px; padding: 16px; background: var(--hd-surface-media); color: var(--hd-c-fg); }
.x-music__now { flex: 0 1 42%; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.x-music__art { width: 100%; max-width: 320px; aspect-ratio: 1; object-fit: cover; display: block; }
.x-music__track { margin: 6px 0 0; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1.2 var(--hd-font-family-light); }
.x-music__artist { margin: 0; font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); }
.x-music__ctl { display: flex; gap: 12px; }
.x-music__list { flex: 1 1 auto; min-width: 0; overflow: hidden; }
@container (max-width: 560px) { .x-music { flex-direction: column; } .x-music__art { max-width: 200px; } }
</style>
