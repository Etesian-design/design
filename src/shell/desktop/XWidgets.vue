<script setup lang="ts">
/**
 * Belle widgets on the desktop. They live on the wallpaper, under every window: seen when the windows are minimised or
 * moved away (Super+D shows the desktop). View → Edit widgets (no long-press, no new right-click menu) turns on the phone's
 * edit chrome: accent outline, red ✕ squircle, resize handle, a faint 90 px grid to snap to, and the "Add widgets" sheet.
 * Kinds: the Belle clocks, Mail (new: unread count + latest senders), Agenda, Chats and Feeds (RSS).
 */
import BelleWidget from '../widgets/BelleWidget.vue';
import XMailWidget from './XMailWidget.vue';
import XChatsWidget from './XChatsWidget.vue';
withDefaults(defineProps<{ editing?: boolean; left?: number }>(), { left: 0 });

/** the Add widgets sheet: groups as in the phone's widget picker */
const CATALOGUE = [
  { group: 'Clocks', items: ['Analog', 'Big clock', 'Flip clock', 'Word clock', 'LCD clock'] },
  { group: 'Mail', items: ['Unread mail'] },
  { group: 'Calendar', items: ['Agenda', 'Today'] },
  { group: 'Chats', items: ['Latest chats'] },
  { group: 'Feeds', items: ['RSS feed'] },
];
</script>

<template>
  <div class="x-wg" :class="{ 'x-wg--edit': editing }" :style="{ left: left + 'px' }" aria-label="Desktop widgets">
    <div class="x-wg__at" style="left: 60px; top: 40px"><BelleWidget kind="flipclock" :editing="editing" /></div>
    <div class="x-wg__at" style="left: 60px; top: 250px"><BelleWidget kind="agenda" :editing="editing" /></div>

    <div class="x-wg__at" style="left: 470px; top: 40px"><XMailWidget :editing="editing" /></div>

    <div class="x-wg__at" style="left: 470px; top: 340px"><XChatsWidget :editing="editing" /></div>

    <div class="x-wg__at" style="left: 880px; top: 40px"><BelleWidget kind="rss" :editing="editing" /></div>
    <div class="x-wg__at" style="left: 880px; top: 340px"><BelleWidget kind="analog" :editing="editing" /></div>

    <!-- edit mode: the Add widgets sheet on the right, Done ends editing -->
    <aside v-if="editing" class="x-wg__sheet hd-on-overlay" aria-label="Add widgets">
      <h3>Add widgets</h3>
      <section v-for="g in CATALOGUE" :key="g.group">
        <h4>{{ g.group }}</h4>
        <button v-for="i in g.items" :key="i" type="button" class="x-wg__item">{{ i }}<span aria-hidden="true">+</span></button>
      </section>
      <button type="button" class="x-wg__done">Done</button>
    </aside>
  </div>
</template>

<style>
.x-wg { position: absolute; top: 0; right: 0; bottom: 0; z-index: 0; }
.x-wg--edit { background-image: linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px); background-size: 90px 90px; }
.x-wg__at { position: absolute; }
.x-wg__sheet { position: absolute; top: 16px; right: 16px; bottom: 16px; width: 320px; overflow: auto; padding: 18px; border-radius: 14px;
  background: var(--hd-surface-overlay, #141414); color: var(--hd-c-fg, #fff); box-shadow: 0 8px 30px rgba(0,0,0,.5); font-family: var(--hd-font-family-base); }
.x-wg__sheet h3 { margin: 0 0 10px; font-weight: 300; font-size: 24px; }
.x-wg__sheet h4 { margin: 14px 0 4px; font-size: 13px; color: var(--hd-c-fg-secondary, #8C8C8C); font-weight: 700; }
.x-wg__item { display: flex; justify-content: space-between; width: 100%; padding: 9px 10px; border: 0; border-radius: 8px; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.x-wg__item:hover { background: rgba(255,255,255,.1); }
.x-wg__item span { color: var(--hd-accent, #2F7FD6); font-weight: 700; }
.x-wg__done { margin-top: 18px; width: 100%; padding: 10px; border: 0; border-radius: 8px; background: var(--hd-accent, #2F7FD6); color: #fff; font: 700 15px var(--hd-font-family-base); cursor: pointer; }
</style>
