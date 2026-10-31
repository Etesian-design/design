<script setup lang="ts">
/**
 * Idea: Belle widgets on the desktop. They live on the wallpaper, under every window: seen when the windows are minimised or
 * moved away (Super+D shows the desktop). View → Edit widgets (no long-press, no new right-click menu) turns on the phone's
 * edit chrome: accent outline, red ✕ squircle, resize handle, a faint 90 px grid to snap to, and the "Add widgets" sheet.
 * Kinds: the Belle clocks, Mail (new: unread count + latest senders), Agenda, Chats and Feeds (RSS).
 */
import BelleWidget from '../../belle/BelleWidget.vue';
import HdSquircle from '../../../components/HdSquircle.vue';
withDefaults(defineProps<{ editing?: boolean; left?: number }>(), { left: 0 });

const MAIL = [
  { from: 'Aino Virtanen', subject: 'Tickets for Saturday', when: '12:31' },
  { from: 'Hub calendar', subject: 'Reminder: dentist at 15:00', when: '11:02' },
  { from: 'Mikko', subject: 'Photos from the lake', when: '09:47' },
];
const CHATS = [
  { from: 'Aino', text: 'See you at 7!', when: '12:40' },
  { from: 'Mum', text: 'Call me when you can', when: '10:15' },
];
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

    <!-- Mail: new widget, Belle panel style, the section's lit squircle + unread count -->
    <div class="x-wg__at" style="left: 470px; top: 40px">
      <div class="bw bw--mail" :class="{ 'bw--editing': editing }" style="width: 360px; height: 270px" data-cells="4x3">
        <div class="bw-panel x-wmail">
          <header class="x-wmail__head">
            <HdSquircle :size="34" color="#2F7FD6" lighting="lit"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 6h16v12H4z M4 7l8 6 8-6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" /></svg></HdSquircle>
            <b>Mail</b><span class="x-wmail__count">3 unread</span>
          </header>
          <ul>
            <li v-for="m in MAIL" :key="m.subject"><span class="x-wmail__from">{{ m.from }}</span><span class="bw-sec">{{ m.when }}</span><span class="x-wmail__subj bw-sec">{{ m.subject }}</span></li>
          </ul>
        </div>
        <template v-if="editing"><i class="bw-outline" /><HdSquircle :size="30" class="bw-close" color="linear-gradient(#F78673, #EF2C10)" role="button" aria-label="Remove widget"><svg viewBox="0 0 30 30" width="30" height="30"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle><i class="bw-resize" /></template>
      </div>
    </div>

    <!-- Chats: same panel, conversation rows -->
    <div class="x-wg__at" style="left: 470px; top: 340px">
      <div class="bw bw--chats" :class="{ 'bw--editing': editing }" style="width: 360px; height: 180px" data-cells="4x2">
        <div class="bw-panel x-wmail">
          <header class="x-wmail__head">
            <HdSquircle :size="34" color="#1BA548" lighting="lit"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" /></svg></HdSquircle>
            <b>Chats</b>
          </header>
          <ul>
            <li v-for="c in CHATS" :key="c.from"><span class="x-wmail__from">{{ c.from }}</span><span class="bw-sec">{{ c.when }}</span><span class="x-wmail__subj bw-sec">{{ c.text }}</span></li>
          </ul>
        </div>
        <template v-if="editing"><i class="bw-outline" /><HdSquircle :size="30" class="bw-close" color="linear-gradient(#F78673, #EF2C10)" role="button" aria-label="Remove widget"><svg viewBox="0 0 30 30" width="30" height="30"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle><i class="bw-resize" /></template>
      </div>
    </div>

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
.x-wmail { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; color: #fff; }
.x-wmail__head { display: flex; align-items: center; gap: 10px; font-size: 18px; }
.x-wmail__count { margin-left: auto; padding: 2px 10px; border-radius: 12px; background: #2F7FD6; font-size: 13px; font-weight: 700; }
.x-wmail ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.x-wmail li { display: grid; grid-template-columns: 1fr auto; column-gap: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.12); }
.x-wmail__from { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x-wmail__subj { grid-column: 1 / -1; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x-wg__sheet { position: absolute; top: 16px; right: 16px; bottom: 16px; width: 320px; overflow: auto; padding: 18px; border-radius: 14px;
  background: var(--hd-surface-overlay, #141414); color: var(--hd-c-fg, #fff); box-shadow: 0 8px 30px rgba(0,0,0,.5); font-family: var(--hd-font-family-base); }
.x-wg__sheet h3 { margin: 0 0 10px; font-weight: 300; font-size: 24px; }
.x-wg__sheet h4 { margin: 14px 0 4px; font-size: 13px; color: var(--hd-c-fg-secondary, #8C8C8C); font-weight: 700; }
.x-wg__item { display: flex; justify-content: space-between; width: 100%; padding: 9px 10px; border: 0; border-radius: 8px; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.x-wg__item:hover { background: rgba(255,255,255,.1); }
.x-wg__item span { color: var(--hd-accent, #2F7FD6); font-weight: 700; }
.x-wg__done { margin-top: 18px; width: 100%; padding: 10px; border: 0; border-radius: 8px; background: var(--hd-accent, #2F7FD6); color: #fff; font: 700 15px var(--hd-font-family-base); cursor: pointer; }
</style>
