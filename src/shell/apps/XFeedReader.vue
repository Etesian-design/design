<script setup lang="ts">
/**
 * One post (the phone's Feeds app, reader): the title in large light type, the feed and the time, a divider, then the
 * post's content, its links orange. The host makes the HTML safe; the reader never follows a link itself: every click on
 * one emits `link`, and the actions (Open in browser, Share, Star, Mark as unread) are the host's toolbar.
 */
import type { FeedPost } from './feeds';
defineProps<{ post: FeedPost }>();
const emit = defineEmits<{ link: [url: string] }>();
function onClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a');
  if (!a) return;
  e.preventDefault();
  emit('link', a.href);
}
</script>
<template>
  <article class="x-fr">
    <h1 class="x-fr__title">{{ post.title }}</h1>
    <p class="x-fr__meta"><span v-if="post.feed">{{ post.feed }}</span><span v-if="post.when">{{ post.when }}</span></p>
    <!-- eslint-disable-next-line vue/no-v-html -- the host gives sanitised HTML (FeedPost.html) -->
    <div v-if="post.html" class="x-fr__body" @click="onClick" v-html="post.html"></div>
    <p v-else-if="post.link" class="x-fr__body"><a :href="post.link" @click.prevent="emit('link', post.link)">{{ post.link }}</a></p>
  </article>
</template>
<style>
.x-fr { padding: 12px 16px 24px; background: var(--hd-c-bg); color: var(--hd-c-fg); }
.x-fr__title { margin: 0; font: var(--hd-font-weight-light) 1.25rem/1.35 var(--hd-font-family-light); }
.x-fr__meta { display: flex; flex-direction: column; gap: 4px; margin: 10px 0 0; padding-bottom: 12px; border-bottom: 1px solid var(--hd-c-divider); color: var(--hd-c-fg-secondary); font: 400 .8125rem/1.3 var(--hd-font-family-base); }
.x-fr__body { margin-top: 12px; font: 400 .9375rem/1.5 var(--hd-font-family-base); overflow-wrap: anywhere; }
.x-fr__body a { color: #FF8500; }
.x-fr__body img { max-width: 100%; height: auto; }
</style>
