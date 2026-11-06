<script setup lang="ts">
/**
 * The posts of all feeds or of one (the phone's Feeds app, posts page): the page title with the unread count in an orange
 * badge, then each post's title (bold, up to three lines), its feed and its date. Unread posts have the orange bar at the
 * left and an orange date. Tapping a post emits `open` with its id: the host shows it in XFeedReader, not the web page.
 */
import type { FeedPost } from './feeds';
const props = withDefaults(defineProps<{ title?: string; posts: FeedPost[]; showFeed?: boolean; empty?: string }>(), { title: 'All posts', showFeed: true, empty: 'No posts yet' });
defineEmits<{ open: [id: string] }>();
const unread = () => props.posts.filter((p) => p.unread).length;
</script>
<template>
  <div class="x-fp">
    <header class="x-fp__head"><h2>{{ title }}</h2><b v-if="unread()" class="x-fp__count hd-sqm" :aria-label="`${unread()} unread`">{{ unread() }}</b></header>
    <p v-if="!posts.length" class="x-fp__none">{{ empty }}</p>
    <div role="list" :aria-label="title">
      <button v-for="p in posts" :key="p.id" type="button" role="listitem" class="x-fp__row" :class="{ 'is-unread': p.unread }" :data-post="p.id" @click="$emit('open', p.id)">
        <b>{{ p.title }}</b><small v-if="showFeed && p.feed">{{ p.feed }}</small><time v-if="p.when">{{ p.when }}</time>
      </button>
    </div>
  </div>
</template>
<style>
.x-fp { display: flex; flex-direction: column; padding: 0 12px; background: var(--hd-c-bg); color: var(--hd-c-fg); }
.x-fp__head { display: flex; align-items: center; justify-content: space-between; min-height: 56px; border-bottom: 1px solid var(--hd-c-divider); }
.x-fp__head h2 { margin: 0; font: var(--hd-font-weight-light) 1.375rem/1.1 var(--hd-font-family-light); }
.x-fp__count { min-width: 28px; padding: 4px 7px; background: #FF8500; color: #fff; text-align: center; font: 400 1rem/1 var(--hd-font-family-base); }
.x-fp__none { margin: 24px 4px; color: var(--hd-c-fg-secondary); }
.x-fp__row { position: relative; display: flex; flex-direction: column; gap: 4px; width: 100%; padding: 12px 4px 12px 14px; border: 0; border-bottom: 1px solid var(--hd-c-divider); background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.x-fp__row.is-unread::before { content: ''; position: absolute; left: 0; top: 10px; bottom: 10px; width: 3px; border-radius: 2px; background: #FF8500; }
.x-fp__row b { font: var(--hd-font-weight-bold) 1rem/1.35 var(--hd-font-family-base); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.x-fp__row small { font: 400 .875rem/1.2 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-fp__row time { font: 400 .8125rem/1.2 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-fp__row.is-unread time { color: #FF8500; }
</style>
