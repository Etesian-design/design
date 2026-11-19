<script setup lang="ts">
/**
 * A news story, as in a news feed (Glance on the phone): the picture edge to edge at 16:9, then the headline, then
 * where it is from (source · age · how many outlets cover it). Every story has a picture: when the story has none, a
 * tile in the outlet's own colour (the same colour every time) with its name stands in, so the feed keeps its rhythm.
 * The whole card is the button (opens the reader); a long press opens the menu sheet (Fewer like this, Share, Open in
 * browser). No buttons on the card.
 */
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  title: string; source: string; age?: string; outlets?: number;
  /** A picture URL, or a CSS background (gradient) for mock-ups; omitted: the outlet tile. */
  image?: string;
  /** The first story of a section: a larger headline. */
  lead?: boolean;
}>(), { age: '', outlets: 1, lead: false });
defineEmits<{ open: []; menu: [] }>();

/** The outlet's colour: a hue from its name, so it is the same on every story and every visit. */
const tile = computed(() => {
  let h = 0;
  for (const c of props.source || props.title || '') h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const hue = h % 360;
  return `linear-gradient(135deg, hsl(${hue} 50% 38%), hsl(${(hue + 40) % 360} 60% 20%))`;
});
const picture = computed(() => !props.image ? tile.value
  : /^(https?:|data:|\/)/.test(props.image) ? `center / cover no-repeat url("${props.image}")` : props.image);
const meta = computed(() => [props.source, props.age, props.outlets > 1 ? `${props.outlets} outlets` : '']
  .filter(Boolean).join(' · '));
</script>
<template>
  <article class="hd-story" :class="{ 'hd-story--lead': lead }" role="button" tabindex="0" :aria-label="`story: ${title}`"
    @click="$emit('open')" @keydown.enter="$emit('open')" @contextmenu.prevent="$emit('menu')">
    <div class="hd-story__picture" :style="{ background: picture }" aria-hidden="true">
      <span v-if="!image" class="hd-story__outlet">{{ source || title }}</span>
    </div>
    <h3 class="hd-story__title">{{ title }}</h3>
    <p class="hd-story__meta">{{ meta }}</p>
  </article>
</template>
<style>
.hd-story { display: block; padding: 6px 0 14px; color: var(--hd-color-text, #F2F2F2); cursor: pointer; outline: none; }
.hd-story:focus-visible { box-shadow: inset 0 0 0 2px var(--hd-color-accent, #2A86D8); }
.hd-story:active { background: rgba(255, 255, 255, .06); }
.hd-story__picture { position: relative; aspect-ratio: 16 / 9; width: 100%; margin-bottom: 12px; display: grid; place-items: center; overflow: hidden; }
.hd-story__outlet { max-width: calc(100% - 48px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: rgba(255, 255, 255, .9); font: 700 26px/1.1 var(--hd-font-family-base); }
.hd-story__title { margin: 0; padding: 0 16px; font: 700 18px/1.25 var(--hd-font-family-base); display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.hd-story--lead .hd-story__title { font-size: 21px; }
.hd-story__meta { margin: 6px 0 0; padding: 0 16px; font: 400 13px/1.3 var(--hd-font-family-base); color: var(--hd-color-text-secondary, #9A9A9A); }
</style>
