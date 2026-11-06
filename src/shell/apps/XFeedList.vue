<script setup lang="ts">
/**
 * The feeds (the phone's Feeds app, main page): "All posts" with the unread count first, then each feed with its squircle
 * icon (the initial on the feed's colour), its unread count or why it could not update, and when it last did. An unread
 * feed has the orange bar at its left edge. Tapping emits `open` with the feed's id, or "all".
 */
import HdIcon from '../../components/HdIcon.vue';
import type { FeedSource } from './feeds';
const props = withDefaults(defineProps<{ feeds: FeedSource[]; current?: string }>(), {});
defineEmits<{ open: [id: string] }>();
const total = () => props.feeds.reduce((n, f) => n + (f.unread ?? 0), 0);
const unreadText = (n: number) => (n ? `${n} unread post${n === 1 ? '' : 's'}` : 'No unread posts');
</script>
<template>
  <div class="x-fl" role="list" aria-label="Feeds">
    <button type="button" role="listitem" class="x-fl__row" :class="{ 'is-current': current === 'all' }" data-feed="all" @click="$emit('open', 'all')">
      <span class="x-fl__icon hd-sq x-fl__icon--all"><HdIcon name="rss" :size="26" /></span>
      <span class="x-fl__text"><b>All posts</b><small>{{ unreadText(total()) }}</small></span>
      <HdIcon name="chevron-right" :size="20" class="x-fl__go" />
    </button>
    <button v-for="f in feeds" :key="f.id" type="button" role="listitem" class="x-fl__row" :class="{ 'is-unread': !!f.unread, 'is-current': current === f.id }" :data-feed="f.id" @click="$emit('open', f.id)">
      <span class="x-fl__icon hd-sq" :style="{ '--hd-sq-fill': f.icon ? `center/cover url(${f.icon})` : (f.color ?? '#FF6600') }">{{ f.icon ? '' : f.title.trim().charAt(0).toUpperCase() }}</span>
      <span class="x-fl__text"><b>{{ f.title }}</b><small :class="{ 'is-error': !!f.error }">{{ f.error ?? unreadText(f.unread ?? 0) }}</small></span>
      <span class="x-fl__side"><i v-if="f.error" class="x-fl__warn hd-sqm" aria-hidden="true">!</i><time v-if="f.updated">{{ f.updated }}</time></span>
    </button>
  </div>
</template>
<style>
.x-fl { display: flex; flex-direction: column; padding: 0 12px; background: var(--hd-c-bg); color: var(--hd-c-fg); }
.x-fl__row { position: relative; display: flex; align-items: center; gap: 14px; min-height: 66px; padding: 6px 4px 6px 4px; border: 0; border-bottom: 1px solid var(--hd-c-divider); background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.x-fl__row.is-unread::before { content: ''; position: absolute; left: -8px; top: 8px; bottom: 8px; width: 3px; border-radius: 2px; background: #FF8500; }
.x-fl__row.is-current { background: color-mix(in srgb, var(--hd-c-fg) 6%, transparent); }
.x-fl__icon { flex: none; display: grid; place-items: center; width: 44px; height: 44px; --hd-sq-size: 44px; color: #fff; font: var(--hd-font-weight-light) 1.75rem/1 var(--hd-font-family-light); }
.x-fl__icon--all { --hd-sq-fill: color-mix(in srgb, var(--hd-c-fg) 12%, var(--hd-c-bg)); color: var(--hd-c-fg); }
.x-fl__icon--all path { stroke-width: 3; }
.x-fl__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.x-fl__text b { font: var(--hd-font-weight-bold) 1rem/1.2 var(--hd-font-family-base); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.x-fl__text small { font: 400 .875rem/1.2 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-fl__text small.is-error { color: #D6222A; }
.x-fl__side { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; color: var(--hd-c-fg-secondary); font: 400 .875rem/1 var(--hd-font-family-base); }
.x-fl__warn { display: grid; place-items: center; width: 18px; height: 18px; background: #fff; color: #D6222A; font: 700 .75rem/1 var(--hd-font-family-base); font-style: normal; box-shadow: inset 0 0 0 1px rgba(0,0,0,.15); }
.x-fl__go { color: var(--hd-c-fg); }
</style>
