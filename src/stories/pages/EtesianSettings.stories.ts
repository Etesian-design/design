import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdIcon from '../../components/HdIcon.vue';
import HdSwitch from '../../components/HdSwitch.vue';

/* Etesian settings, as the phone has them (launcher SettingsActivity.kt, 2026-11-20): a main page of rows, one per sub
 * page, then each sub page as N9 lists. Additions the N9 did not have are switches, off by default (a fresh phone is the
 * pure N9); choices that differ from the N9 name the N9 one with “(N9)”. Frame 360 × 640, the N9 light Settings look. */
const meta: Meta = {
  title: 'OS/Etesian settings',
  tags: ['autodocs'],
  excludeStories: ['SECTIONS', 'PAGES'],
  parameters: { layout: 'centered', docs: { description: { component: 'Everything Etesian adds to Settings, page by page, as on the phone. **Main page**: one row per sub page (icon, title, what is inside). Each sub page: grouped N9 rows; a **switch** is an addition (off by default, so a new phone is the pure N9), a **value** is a choice (the N9 choice is marked “(N9)”). Applications, Events and notifications, Status menu, Open applications, Lock screen, Emergency information and Sharing start with a **live preview** (a dark miniature of what the page changes, redrawn as a setting changes; drawn here at the defaults); Gestures has one for Single hand mode. Greyed rows wait for the switch they depend on. See Guide / N9 and the port for why each difference exists.' } } },
};
export default meta;

type Row = { t: string; s?: string; on?: boolean; v?: string; link?: boolean; sl?: number; off?: boolean; pv?: string };
type Page = { key: string; icon: string; title: string; summary: string; groups: [string | null, Row[]][] };
/* Values read from SettingsActivity.kt / Prefs.kt / SettingsPreview.kt: a fresh phone (ROM build, Glance installed,
 * every Extras switch off). `pv` is the live preview row (SettingsPreview), `off` a row greyed by its dependency. */
export const SECTIONS: Page[] = [
  { key: 'home', icon: 'home', title: 'Home screen', summary: 'Views, indicator dots', groups: [['Home screen views', [
    { t: 'Events', s: 'Notifications feed, left of Applications', on: true }, { t: 'Widgets', s: 'Widgets, left of Events', on: false },
    { t: 'News', s: 'Glance\'s news, furthest left: top stories, then picked for you', on: false }, { t: 'Widgets layout', v: 'One scrolling list' },
    { t: 'Widget screens', v: '1', off: true }, { t: 'View indicator dots', v: 'Hidden' }]]] },
  { key: 'apps', icon: 'grid', title: 'Applications', summary: 'Grid, icons, search, private space', groups: [
    [null, [{ t: '', pv: 'apps' }]],
    ['Appearance', [{ t: 'Icon shape', v: 'N9 (squircle)' }, { t: 'Icon pack', v: 'Meeye' }, { t: 'N9 lighting', s: 'Light every icon from above, as on the N9: a bright top rim, raised glyphs and their shadow', on: false },
      { t: 'Meeye icons by YeyeBBC', s: 'The preinstalled Harmattan-style icon pack, CC BY-NC 4.0. Tap to see their work' }]],
    ['App grid', [{ t: 'Columns', v: '4' }, { t: 'Rows per screen', v: 'Auto' }, { t: 'Icon size', v: 'Medium' }]],
    ['Search', [{ t: 'Pull down to search', s: 'Pull the Applications view down from the top to show a search bar', on: false }, { t: 'Search bar position', v: 'Top', off: true },
      { t: 'Open keyboard automatically', s: 'Otherwise tap the search bar to start typing', on: true, off: true },
      { t: 'Search everything', s: 'Below the applications: contacts, messages, notifications, shortcuts, files, settings, news and the web, from Glance', on: true, off: true }]],
    ['Private space', [{ t: 'Private space', s: 'Android\'s private space as a locked folder at the end of the grid', on: false }]]] },
  { key: 'events', icon: 'list', title: 'Events and notifications', summary: 'Feeds, weather, notifications', groups: [
    [null, [{ t: '', pv: 'events' }]],
    ['Events view', [{ t: 'Feeds', s: 'RSS and Atom feeds shown under Feed (the Feeds app)', link: true }, { t: 'Weather', s: 'Current weather next to the date (Open-Meteo, uses your approximate location)', on: true },
      { t: 'Weather location', v: 'Your location' }, { t: 'Temperature', v: 'Celsius' }, { t: 'Notifications layout', v: 'Grouped per app' }, { t: 'Feed layout', v: 'Grouped per app' },
      { t: 'Low priority layout', v: 'Grouped per app' },
      { t: 'Sorting notifications', s: 'Long-press in the Events view to start tidying: swipe entries away to dismiss them, or tap one to show that app (or only that kind of its notifications) under Notifications, Calendar, Feed or Low priority. Tap the date to finish.' }]],
    ['Notifications', [{ t: 'Actions and snooze', s: 'Long-press a notification: Mark as read, Snooze, Dismiss', on: false }, { t: 'Inline reply', s: 'Reply to a message from Events', on: false }, { t: 'Live updates', s: 'Ongoing progress pinned under Notifications', on: false },
      { t: 'Priority people', s: 'A person\'s messages, mail and calls first, grouped under them', link: true }, { t: 'Dismissed notifications', s: 'Keep dismissed notifications as faded rows', link: true }, { t: 'Feeds', s: 'How often feeds update; notifications shown as feeds', link: true }]],
    ['Today', [{ t: 'Today in Events', s: 'One-line items above Notifications', on: false }, { t: 'Items', s: 'Screen time, All-day events, Birthdays, Upcoming events' }]],
    ['Over apps', [{ t: 'Notifications over apps', v: 'Discreet (N9)' }, { t: '“Copied” bubble', s: 'A short bubble when something is copied, instead of the clipboard overlay', on: false }]]] },
  { key: 'status', icon: 'settings', title: 'Status menu', summary: 'Toggles, sliders, music, modes', groups: [[null, [{ t: '', pv: 'status' },
    { t: 'Your own layout', s: 'A toggle strip, sliders and fewer rows; edit with the pencil', on: false }, { t: 'Visible rows', v: 'All' }, { t: 'Reveal hidden rows', v: 'Both' },
    { t: 'Music', s: 'The small music player at the top', on: false }, { t: 'Do Not Disturb and Modes', s: 'A Mode strip under Profile', on: false }, { t: 'Privacy indicators', s: 'Camera and microphone in use, in the status bar', on: false }]]] },
  { key: 'open', icon: 'window', title: 'Open applications', summary: 'Arranging, carousel, split screen', groups: [
    [null, [{ t: '', pv: 'open' }]],
    ['Arranging', [{ t: 'Auto-arrange', s: 'The last opened application moves to the top', on: true }]],
    ['Carousel', [{ t: 'Actions under the card', s: 'Split view, Pop-up, Screenshot and App info', on: false }, { t: 'App pinning', s: 'Pin under the card keeps one app on screen', on: false }]],
    ['Split screen', [{ t: 'Two-finger merge', s: 'In edit mode, pull two cards together with two fingers; pull a pair apart to separate', on: false }]]] },
  { key: 'wallpapers', icon: 'photo', title: 'Wallpapers & backgrounds', summary: 'Home wallpapers, app and menu backgrounds', groups: [
    ['Backgrounds', [{ t: 'Apps (light on the N9)', v: 'N9 light' }, { t: 'Black screens (home, menus)', v: 'Black' }]],
    ['Home wallpaper', [{ t: 'Home screen', v: 'Same as black screens' }]]] },
  { key: 'gestures', icon: 'drag', title: 'Gestures', summary: 'Swipes, back', groups: [
    ['Gestures', [{ t: 'Gesture system', v: 'N9 swipe' }, { t: 'Swipe distance to leave an app', v: '50% of the screen (N9)' }, { t: 'Back by swiping in', v: 'Disabled' }]],
    ['Single hand mode', [{ t: '', pv: 'singlehand' }, { t: 'Size', s: 'The small screen\'s width; it always sits in a corner, and a tap moves it to the nearest one', sl: 0.5 }]],
    // "Only from …" (2026-11-22): the edge's view leaves the row of home views and comes in only from that edge; for a
    // view (not Open applications), the bottom and one side only, so the row always keeps views to swipe between.
    ['After swiping an app away', [{ t: 'From the left side', v: 'Open applications (N9)' }, { t: 'Only from the left side', s: 'For a view: Applications, Events, Widgets or News', on: false, off: true },
      { t: 'From the right side', v: 'Open applications (N9)' }, { t: 'Only from the right side', s: 'For a view: Applications, Events, Widgets or News', on: false, off: true },
      { t: 'From the bottom', v: 'Applications' }, { t: 'Only from the bottom', s: 'Takes this view out of the home screen\'s views; it comes in from this edge', on: true }]]] },
  { key: 'sidesense', icon: 'menu', title: 'Breeze', summary: 'The edge bar or floating button: taps, flicks, its menu', groups: [
    [null, [{ t: 'Breeze', s: 'A handle on the screen edge, or a floating button. Long-press it and drag it to move it', on: false }, { t: 'Place', v: 'Right edge' }, { t: 'Theme', v: 'Same as the toolbar' },
      { t: 'Handle thickness', s: '12 dp', sl: 6 / 22 }, { t: 'Handle height', s: '140 dp', sl: 0.35 }, { t: 'Floating button size', s: '56 dp', sl: 0.05 }]],
    ['Gestures', [{ t: 'Tap', v: 'Breeze menu' }, { t: 'Double tap', v: 'Back' }, { t: 'Flick inwards', v: 'Back' }, { t: 'Flick up', v: 'Open applications' }, { t: 'Flick down', v: 'Nothing' }]],
    ['Menu buttons', [{ t: 'Back', s: 'Presses Back' }, { t: 'Home', s: 'Presses Home' }, { t: 'Open applications', s: 'Presses Recent apps' },
      { t: 'Add and arrange buttons', s: 'Drag buttons onto Breeze, along it, or off it', link: true }]],
    ['Menu widgets', [{ t: 'Add widget', s: 'Widgets show under the buttons, and scroll when there are many', link: true }]]] },
  { key: 'lock', icon: 'lock', title: 'Lock screen', summary: 'Notifications, glance line, weather', groups: [
    [null, [{ t: '', pv: 'lock' }]],
    ['Standby screen', [{ t: 'Standby screen', s: 'The clock, notifications and your own lines while locked, moving every minute', link: true }]],
    ['Notifications on the lock screen', [{ t: 'More notifications', v: 'Stacked cards, slide up to see all' }, { t: 'Notifications shown in full', v: '3 (N9)' }]],
    ['Under the clock', [{ t: 'Glance line', s: 'Next alarm and event under the date', on: false }, { t: 'Weather', s: 'Current weather under the date (from the Events weather)', on: false }, { t: 'Emergency information', s: 'Owner and medical essentials beside the clock', link: true }]]] },
  { key: 'emergency', icon: 'info', title: 'Emergency information', summary: 'Medical details for first responders', groups: [
    [null, [{ t: '', pv: 'emergency' }, { t: 'Show on the lock screen', s: 'Owner and essentials beside the clock; tap for the full card', on: false }, { t: 'Shown beside the clock', s: 'Name, Blood type, Allergies' }]],
    ['Medical details', [{ t: 'Name', s: 'Not set' }, { t: 'Blood type', s: 'Not set' }, { t: 'Allergies', s: 'Not set' }, { t: 'Medication', s: 'Not set' }, { t: 'Medical notes', s: 'Not set' }, { t: 'Organ donor', s: 'Not set' }]],
    ['Emergency contacts', [{ t: 'Contacts', s: 'Not set' }]]] },
  { key: 'sharing', icon: 'share', title: 'Sharing', summary: 'Share sheet, sharing a network', groups: [
    [null, [{ t: '', pv: 'sharing' }]],
    ['Share sheet', [{ t: 'N9 share sheet', s: 'With a filter and pinned apps, instead of Android\'s', on: false }, { t: 'Suggested people', s: 'A row of people at the top of the sheet', on: false }]],
    ['Networks', [{ t: 'Share network', s: 'On the main settings page: a QR code and the password of your Wi-Fi', on: false }]]] },
  { key: 'toolbar', icon: 'wrench', title: 'Toolbar', summary: 'The N9 bar under every app', groups: [['Bottom toolbar', [
    { t: 'N9 toolbar', s: 'The N9 bar under every app: Back, your shortcuts, or the app\'s own buttons', on: true }, { t: 'Back button', v: 'Left' },
    { t: 'Toolbar theme', v: 'N9 light' }, { t: 'Toolbar buttons', s: 'Your shortcuts and macros, for all apps or per app', link: true }]]] },
  { key: 'system', icon: 'settings', title: 'System', summary: 'Permissions, default home app', groups: [['System', [
    { t: 'Notification access', s: 'Lets the Events view show your notifications', link: true },
    { t: 'Default home app', s: 'Choose Etesian as your home screen', link: true }]]] },
];

/* The live preview (SettingsPreview.kt) at its defaults: a dark miniature, 172 / 236 / 262 dp tall less 8 dp above and below. */
const PV_H: Record<string, number> = { apps: 236, events: 236, status: 236, singlehand: 236, open: 262 };
const PREVIEW = `<div class="pv" :style="{ height: ((PV_H[k] || 172) - 16) + 'px' }" :aria-label="'Preview: ' + k">
  <template v-if="k === 'apps'"><div class="pv-grid"><div v-for="(a, i) in ['Phone','Messages','Music','Maps','Store','Clock','Calendar','Mail']"><i class="pv-tile" :style="{ background: ['#2A86D8','#35B34A','#E6007E','#F07D00','#8E44AD','#16A085','#E0352B','#2A86D8'][i] }" />{{ a }}</div></div></template>
  <template v-else-if="k === 'events'"><div class="pv-ev"><b class="pv-big">Events</b><p class="pv-h">Notifications</p>
    <div class="pv-card"><i style="background:#35B34A" /><div><b>Anna</b><small>Are we still on for lunch?</small></div></div>
    <div class="pv-card"><i style="background:#E6007E" /><div><b>Mail</b><small>Your order has shipped</small></div></div></div>
    <div class="pv-app"><div class="pv-app-sb">Anna&nbsp; Are we still on for lu</div><small>In an app</small></div></template>
  <template v-else-if="k === 'status'"><div class="pv-sb"><b>12:45</b><span><i /><i /></span></div>
    <div class="pv-prof"><small>Profile</small><span><i /></span></div>
    <div v-for="r in ['Internet connection','Bluetooth','Mobile network','Battery','Screen rotation','Location']" class="pv-srow">{{ r }}</div></template>
  <template v-else-if="k === 'open'"><div class="pv-cards"><div v-for="(a, i) in ['Messages','Music','Mail','Maps']"><i :style="{ background: ['#F2F2F2','#262626','#F2F2F2','#1C2A3A'][i] }" /><b>{{ a }}</b></div></div>
    <p class="pv-foot">Carousel: no actions under the card (N9)</p></template>
  <template v-else-if="k === 'lock' || k === 'emergency'"><div class="pv-sb"><b>12:45</b><span><i /><i /></span></div>
    <div class="pv-clock" :class="{ em: k === 'emergency' }"><span>12:45</span><small>Friday 20 November</small></div>
    <div v-if="k === 'emergency'" class="pv-em"><b>✚ Owner</b><small>Blood –</small><small>Allergy –</small><em>Emergency info ›</em></div>
    <p v-if="k === 'emergency'" class="pv-foot">Off: not on the lock screen</p>
    <div v-else class="pv-card pv-lockcard"><i style="background:#2A86D8" /><div><b>Anna</b><small>See you at eight</small></div></div></template>
  <template v-else-if="k === 'sharing'"><b class="pv-share">Share</b><small class="pv-off">Off: Android's own share sheet</small>
    <div class="pv-shl"><div v-for="(a, i) in ['Messages','Mail','Bluetooth']" class="pv-sh"><i :style="{ background: ['#35B34A','#E6007E','#2A86D8'][i] }" /><b>{{ a }}</b></div></div></template>
  <template v-else-if="k === 'singlehand'"><div class="pv-sh1"><small>70% of the screen</small><div class="pv-phone"><div class="pv-small"><i v-for="n in 16" :style="{ background: ['#2F7FD8','#E8483F','#3DA35A','#F2A20C','#7A4FD1','#09A7CC'][(n - 1) % 6] }" /></div></div></div></template>
</div>`;

const CSS = `<component is="style">
.es { width: 360px; height: 640px; display: flex; flex-direction: column; background: #fff; color: #191919; font-family: var(--hd-font-family-base); overflow: hidden; }
.es-sb { height: 24px; background: #000; color: #fff; font-size: 13px; display: flex; justify-content: flex-end; align-items: center; padding: 0 10px; flex: none; }
.es-body { flex: 1; overflow: auto; padding: 0 16px; }
.es h3 { font: 300 26px/1.2 var(--hd-font-family-light); margin: 14px 0 8px; }
.es h4 { font-size: 13px; color: #8C8C8C; margin: 16px 0 2px; font-weight: 400; border-bottom: 1px solid #D8D8D8; padding-bottom: 4px; }
.es-row { display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 6px 0; }
.es-row > div { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.es-row b { font-weight: 600; font-size: 17px; }
.es-row small { font-size: 14px; color: #8C8C8C; line-height: 1.3; }
.es-row .es-v { color: #2A86D8; }
.es-chev { color: #8C8C8C; font-size: 22px; }
.es-ic { width: 40px; height: 40px; border-radius: 30%; background: #F2F2F2; display: grid; place-items: center; flex: none; }
.es-row.off { opacity: .45; }
.es-sl { height: 4px; border-radius: 2px; background: #D8D8D8; margin-top: 6px; position: relative; }
.es-sl i { position: absolute; left: 0; top: 0; bottom: 0; background: #2A86D8; border-radius: 2px; }
.es-sl i::after { content: ''; position: absolute; right: -8px; top: -6px; width: 16px; height: 16px; border-radius: 50%; background: #2A86D8; }
.pv { position: relative; margin: 8px 0; background: #0A0A0A; border: 1px solid #393839; border-radius: 10px; overflow: hidden; color: #fff; font-size: 11px; }
.pv small { color: #8C8C8C; font-size: 10px; }
.pv-grid { display: grid; grid-template-columns: repeat(4, 48px); gap: 22px 14px; justify-content: center; padding-top: 12px; text-align: center; font-size: 9px; }
.pv-tile, .pv-card i, .pv-sh i, .pv-small i { display: block; border-radius: 30%; }
.pv-tile { width: 48px; height: 48px; margin-bottom: 4px; }
.pv-ev { position: absolute; left: 12px; top: 6px; right: 12px; }
.pv-big { font: 300 20px var(--hd-font-family-light); display: block; margin-bottom: 8px; }
.pv-h { margin: 4px 0; color: #8C8C8C; font-size: 10px; font-weight: 700; display: flex; gap: 6px; align-items: center; }
.pv-h::after { content: ''; flex: 1; height: 1px; background: #3A3A3A; }
.pv-card { display: flex; gap: 8px; align-items: center; height: 40px; }
.pv-card i { width: 28px; height: 28px; flex: none; }
.pv-card div { display: flex; flex-direction: column; }
.pv-card b { font-size: 11px; }
.pv-app { position: absolute; left: 52%; width: 45%; top: 6px; height: 80px; background: #F2F2F2; border-radius: 6px; overflow: hidden; }
.pv-app-sb { background: #000; height: 9px; font: 700 7px/9px sans-serif; padding-left: 4px; white-space: nowrap; overflow: hidden; }
.pv-app small { display: block; padding: 8px 8px 0; font-size: 9px; }
.pv-sb { display: flex; justify-content: space-between; padding: 4px 10px; font-size: 10px; }
.pv-sb span { display: flex; gap: 6px; } .pv-sb i { width: 17px; height: 7px; background: #BDBDBD; border-radius: 2px; margin-top: 3px; }
.pv-prof { display: flex; align-items: center; padding: 3px 12px; gap: 14px; } .pv-prof span { flex: 1; height: 14px; border-radius: 7px; background: #262626; overflow: hidden; } .pv-prof span i { display: block; width: 33%; height: 100%; background: #2A86D8; }
.pv-srow { margin: 0 12px; height: 22px; line-height: 20px; font-weight: 700; border-bottom: 1px solid #262626; }
.pv-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; padding: 12px 10px 0; }
.pv-cards i { display: block; height: 62px; border-radius: 4px; } .pv-cards b { display: block; font-size: 10px; height: 24px; line-height: 18px; }
.pv-foot { position: absolute; bottom: 4px; left: 0; right: 0; text-align: center; margin: 0; color: #8C8C8C; font-size: 10px; }
.pv-clock { text-align: center; margin-top: 18px; } .pv-clock.em { padding-left: 80px; }
.pv-clock span { display: block; font: 300 44px/1 var(--hd-font-family-light); } .pv-clock small { color: #BDBDBD; font-size: 11px; }
.pv-em { position: absolute; left: 14px; top: 40px; border-left: 2px solid #5A2A28; padding-left: 8px; height: 70px; display: flex; flex-direction: column; gap: 1px; font-size: 10px; }
.pv-em em { font-style: normal; color: #E0352B; font-size: 9px; }
.pv-lockcard { position: absolute; left: 12px; bottom: 6px; opacity: .8; }
.pv-share { position: absolute; left: 12px; top: 8px; font: 300 16px var(--hd-font-family-light); }
.pv-off { position: absolute; right: 12px; top: 14px; font-size: 9px !important; }
.pv-shl { position: absolute; left: 12px; top: 34px; } .pv-sh { display: flex; align-items: center; gap: 8px; height: 24px; } .pv-sh i { width: 18px; height: 18px; }
.pv-sh1 { display: flex; justify-content: center; align-items: center; gap: 12px; height: 100%; } .pv-sh1 small { color: #BDBDBD; font-size: 12px; }
.pv-phone { position: relative; height: calc(100% - 16px); aspect-ratio: 9 / 16; background: #1E1E1E; border: 1px solid #6E6E6E; border-radius: 8px; }
.pv-small { position: absolute; right: 0; bottom: 6px; width: 70%; height: 70%; background: #000; border: 1px solid #6E6E6E; border-radius: 4px; display: grid; grid-template-columns: repeat(4, 1fr); align-content: start; gap: 4px; padding: 6px 3px; box-sizing: border-box; overflow: hidden; }
.pv-small i { width: 62%; aspect-ratio: 1; margin: auto; }
.es-tb { height: 56px; flex: none; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; background: #F2F2F2; border-top: 1px solid #D8D8D8; }
</component>`;
const ROWS = `<template v-for="r in rows"><template v-if="r.pv"><template v-for="k in [r.pv]">${PREVIEW}</template></template><div v-else class="es-row" :class="{ off: r.off }"><div><b>{{ r.t }}</b><small v-if="r.s">{{ r.s }}</small><small v-if="r.v" class="es-v">{{ r.v }}</small><div v-if="r.sl !== undefined" class="es-sl"><i :style="{ width: r.sl * 100 + '%' }" /></div></div>
  <HdSwitch v-if="r.on !== undefined" :model-value="r.on" :aria-label="r.t" /><span v-else-if="r.link" class="es-chev">›</span></div></template>`;

const page = (p: Page): StoryObj => ({
  name: p.title,
  parameters: { docs: { description: { story: `Etesian settings → ${p.title}: ${p.summary}.` } } },
  render: () => ({
    components: { HdIcon, HdSwitch },
    setup: () => ({ p, PV_H }),
    template: `${CSS}<div class="es"><div class="es-sb">09:41</div><div class="es-body"><h3>{{ p.title }}</h3>
      <template v-for="g in p.groups"><h4 v-if="g[0]">{{ g[0] }}</h4><template v-for="rows in [g[1]]">${ROWS}</template></template></div>
      <div class="es-tb"><HdIcon name="back" :size="32" /><span /></div></div>`,
  }),
});

export const Main: StoryObj = {
  name: 'Main page',
  parameters: { docs: { description: { story: 'Etesian settings: N9 quick rows on top (pinned settings, Flight mode, Internet connection, Mobile network, Brightness), then one row per sub page, N9 style (icon, title, what is inside). Gestures, Lock screen and Toolbar only show when Etesian is built into the ROM; without the ROM, System also gets “Swipe gestures & live previews”.' } } },
  render: () => ({
    components: { HdIcon, HdSwitch },
    setup: () => ({ S: SECTIONS }),
    template: `${CSS}<div class="es"><div class="es-sb">09:41</div><div class="es-body"><h3>Etesian settings</h3>
      <div class="es-row"><div><b>Flight mode</b></div><HdSwitch :model-value="false" aria-label="Flight mode" /></div>
      <div class="es-row"><div><b>Internet connection</b></div><span class="es-chev">›</span></div>
      <div class="es-row"><div><b>Mobile network</b></div><span class="es-chev">›</span></div>
      <div class="es-row"><div><div class="es-sl"><i style="width: 50%" /></div></div></div>
      <div v-for="s in S" class="es-row"><span class="es-ic"><HdIcon :name="s.icon" :size="24" /></span><div><b>{{ s.title }}</b><small>{{ s.summary }}</small></div><span class="es-chev">›</span></div></div>
      <div class="es-tb"><HdIcon name="back" :size="32" /><span /></div></div>`,
  }),
};
export const PAGES = Object.fromEntries(SECTIONS.map((s) => [s.key, page(s)]));
export const Home = PAGES.home!;
export const Applications = PAGES.apps!;
export const EventsAndNotifications = PAGES.events!;
export const StatusMenu = PAGES.status!;
export const OpenApplications = PAGES.open!;
export const Wallpapers = PAGES.wallpapers!;
export const Gestures = PAGES.gestures!;
export const BreezeSettings = PAGES.sidesense!;
export const LockScreen = PAGES.lock!;
export const Emergency = PAGES.emergency!;
export const Sharing = PAGES.sharing!;
export const Toolbar = PAGES.toolbar!;
export const System = PAGES.system!;
