<script setup lang="ts">
/** Events home view: notifications and feeds, grouped by source, squircle thumbnails, photo previews shown as is (square). 1 or 2 columns. */
import HdEventsFeedItem from '../../../components/HdEventsFeedItem.vue';
import HdSectionHeader from '../../../components/HdSectionHeader.vue';
import { photo } from './data';
withDefaults(defineProps<{ columns?: 1 | 2; title?: boolean; previews?: boolean; thumb?: number }>(), { columns: 1, title: true, previews: true, thumb: 64 });
</script>
<template>
  <div class="x-events" :class="`x-events--${columns}`">
    <h2 v-if="title" class="x-events__title">Events</h2>
    <div class="x-events__cols">
      <div class="x-events__col">
        <HdSectionHeader title="Messages" />
        <HdEventsFeedItem title="Anna Virtanen" body="Are we still on for lunch? I can be there by 12:30." time="5 min ago" accent="#09A7CC" />
        <HdEventsFeedItem title="Liisa Niemi" body="Sent you a voice note (0:42)" time="40 min ago" accent="#09A7CC" />
        <HdSectionHeader title="Mail" />
        <HdEventsFeedItem title="Design weekly" body="Why squircles feel softer than rounded rectangles" time="1 h ago" icon="mail" accent="#0067BC" />
        <HdSectionHeader title="Calendar" />
        <HdEventsFeedItem title="Design review" body="Today 14:00, Room Etesian" time="in 2 h" icon="calendar" accent="#EF5500" />
      </div>
      <div class="x-events__col">
        <HdSectionHeader title="Gallery" />
        <HdEventsFeedItem title="Mikko Laine" body="Posted 6 new photos from Lapland" time="Yesterday" :image="photo(3)" />
        <div v-if="previews" class="x-events__previews" aria-label="Photo previews">
          <img v-for="i in 4" :key="i" class="x-events__photo" :src="photo(i + 3)" :alt="`Photo ${i}`" :width="thumb" :height="thumb" />
          <span class="x-events__more">+2</span>
        </div>
        <HdSectionHeader title="Feeds" />
        <HdEventsFeedItem title="Etesian journal" body="A tablet for the swipe generation: what the N9 got right" time="2 h ago" :image="photo(0)" />
        <div v-if="previews" class="x-events__previews">
          <img class="x-events__photo" :src="photo(9)" alt="Article image" :width="thumb" :height="thumb" />
          <p class="x-events__excerpt">“One screen, one gesture, no buttons: the edge swipe is still the best idea in mobile UI.”</p>
        </div>
        <HdEventsFeedItem title="Sara Koski" body="Shared a link: Superellipse calculator" time="3 h ago" icon="share" accent="#FF8500" />
      </div>
    </div>
  </div>
</template>
<style>
.x-events { color: var(--hd-c-fg); }
/* in a clipped column, fade the last item out so it reads as a scrolling list, not a cut-off */
.x-events--1 { height: 100%; -webkit-mask-image: linear-gradient(#000 calc(100% - 64px), transparent); mask-image: linear-gradient(#000 calc(100% - 64px), transparent); }
.x-events__title { margin: 0; padding: 18px 16px 6px; font: var(--hd-font-weight-light) var(--hd-font-size-xxlarge)/1 var(--hd-font-family-light); }
.x-events__cols { display: grid; gap: 0 28px; }
.x-events--2 .x-events__cols { grid-template-columns: 1fr 1fr; }
.x-events__col { min-width: 0; }
.x-events__photo { flex: none; display: block; object-fit: cover; }
.x-events__previews { display: flex; gap: 8px; align-items: center; padding: 0 16px 10px 70px; }
.x-events__more { font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); padding-left: 4px; }
.x-events__excerpt { margin: 0; font: var(--hd-font-weight-light) var(--hd-font-size-small)/1.4 var(--hd-font-family-light); color: var(--hd-c-fg-secondary); }
</style>
