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
  parameters: { layout: 'centered', docs: { description: { component: 'Everything Etesian adds to Settings, page by page, as on the phone. **Main page**: one row per sub page (icon, title, what is inside). Each sub page: grouped N9 rows; a **switch** is an addition (off by default, so a new phone is the pure N9), a **value** is a choice (the N9 choice is marked “(N9)”). Every sub page starts with a live preview on the phone (not drawn here). See Guide / N9 and the port for why each difference exists.' } } },
};
export default meta;

type Row = { t: string; s?: string; on?: boolean; v?: string; link?: boolean };
type Page = { key: string; icon: string; title: string; summary: string; groups: [string | null, Row[]][] };
export const SECTIONS: Page[] = [
  { key: 'home', icon: 'home', title: 'Home screen', summary: 'Views, indicator dots', groups: [['Home screen views', [
    { t: 'Events', s: 'Notifications feed, left of Applications', on: true }, { t: 'Widgets', s: 'Widgets, left of Events', on: false },
    { t: 'News', s: 'Stories from your feeds, as pictures', on: false }, { t: 'Widgets layout', v: 'Fixed screens (no scrolling)' },
    { t: 'Widget screens', v: '2' }, { t: 'View indicator dots', v: 'Hidden' }]]] },
  { key: 'apps', icon: 'grid', title: 'Applications', summary: 'Grid, icons, search, private space', groups: [
    ['Appearance', [{ t: 'Icon shape', v: 'N9 (squircle)' }, { t: 'Icon pack', v: 'Meeye icons by YeyeBBC' }, { t: 'N9 lighting', s: 'Icons lit from above, like the N9', on: true }]],
    ['App grid', [{ t: 'Columns', v: '4' }, { t: 'Rows per screen', v: 'One scrolling list' }, { t: 'Icon size', v: 'Medium' }]],
    ['Search', [{ t: 'Pull down to search', on: true }, { t: 'Search bar position', v: 'Top' }, { t: 'Open keyboard automatically', s: 'Otherwise tap the search bar to start typing', on: false }, { t: 'Search everything', s: 'Contacts, settings, news and the web too', on: false }]],
    ['Private space', [{ t: 'Private space', s: 'Android\'s private space as a locked folder at the end of the grid', on: false }]]] },
  { key: 'events', icon: 'list', title: 'Events and notifications', summary: 'Feeds, weather, notifications', groups: [
    ['Events view', [{ t: 'Feeds', s: 'RSS and Atom feeds shown under Feed (the Feeds app)', link: true }, { t: 'Weather', s: 'Current weather next to the date', on: true }, { t: 'Weather location', v: 'Your location' }, { t: 'Temperature', v: 'Celsius' }, { t: 'Sorting notifications', v: 'Newest first' }]],
    ['Notifications', [{ t: 'Actions and snooze', s: 'Long-press a notification: Mark as read, Snooze, Dismiss', on: false }, { t: 'Inline reply', s: 'Reply to a message from Events', on: false }, { t: 'Live updates', s: 'Ongoing progress pinned under Notifications', on: false },
      { t: 'Priority people', s: 'A person\'s messages, mail and calls first, grouped under them', link: true }, { t: 'Dismissed notifications', s: 'Keep dismissed notifications as faded rows', link: true }, { t: 'Feeds', s: 'How often feeds update; notifications shown as feeds', link: true }]],
    ['Today', [{ t: 'Today in Events', s: 'One-line items above Notifications', on: false }]],
    ['Over apps', [{ t: 'Notifications over apps', v: 'Discreet (N9)' }, { t: '“Copied” bubble', s: 'A short bubble when something is copied', on: false }]]] },
  { key: 'status', icon: 'settings', title: 'Status menu', summary: 'Toggles, sliders, music, modes', groups: [[null, [
    { t: 'Your own layout', s: 'A toggle strip, sliders and fewer rows; edit with the pencil', on: false }, { t: 'Visible rows', v: 'All (N9)' }, { t: 'Reveal hidden rows', v: 'Button' },
    { t: 'Music', s: 'The small music player at the top', on: false }, { t: 'Do Not Disturb and Modes', s: 'A Mode strip under Profile (Silent | Beep | Ringing)', on: false }, { t: 'Privacy indicators', s: 'Camera and microphone in use, in the status bar', on: false }]]] },
  { key: 'open', icon: 'window', title: 'Open applications', summary: 'Arranging, carousel, split screen', groups: [
    ['Arranging', [{ t: 'Auto-arrange', s: 'The last opened application moves to the top', on: true }]],
    ['Carousel', [{ t: 'Actions under the card', s: 'Split view, Pop-up, Screenshot and App info', on: false }, { t: 'App pinning', s: 'Pin under the card keeps one app on screen', on: false }]],
    ['Split screen', [{ t: 'Two-finger merge', s: 'In edit mode, pull two cards together with two fingers', on: false }]]] },
  { key: 'wallpapers', icon: 'photo', title: 'Wallpapers & backgrounds', summary: 'Home wallpapers, app and menu backgrounds', groups: [
    ['Backgrounds', [{ t: 'Apps (light on the N9)', v: 'N9 light' }, { t: 'Black screens (home, menus)', v: 'Black' }, { t: 'Wallpaper effect', v: 'Ambience (blurred and darkened, like Silica)' }]],
    ['Home wallpaper', [{ t: 'Wallpaper', v: 'One wallpaper, scrolling with the views' }]]] },
  { key: 'gestures', icon: 'drag', title: 'Gestures', summary: 'Swipes, back', groups: [
    ['Gestures', [{ t: 'Gesture system', v: 'N9 swipe' }, { t: 'Swipe distance to leave an app', v: '50% of the screen (N9)' }, { t: 'Back by swiping in', v: 'Disabled' }]],
    ['Single hand mode', [{ t: 'Size', s: 'The small screen\'s width; it always sits in a corner', v: '70%' }]],
    ['After swiping an app away', [{ t: 'From the left side', v: 'Open applications (N9)' }, { t: 'From the right side', v: 'Open applications (N9)' }, { t: 'From the bottom', v: 'Open applications (N9)' }]]] },
  { key: 'sidesense', icon: 'menu', title: 'Breeze', summary: 'The edge bar or floating button: taps, flicks, its menu', groups: [
    [null, [{ t: 'Breeze', s: 'A handle on the screen edge, or a floating button', on: false }, { t: 'Place', v: 'Right edge' }, { t: 'Theme', v: 'Same as the toolbar' }, { t: 'Handle thickness', v: '12 dp' }, { t: 'Handle height', v: '140 dp' }, { t: 'Floating button size', v: '56 dp' }]],
    ['Gestures', [{ t: 'Tap', v: 'Breeze menu' }, { t: 'Double tap', v: 'Back' }, { t: 'Flick inwards', v: 'Back' }, { t: 'Flick up', v: 'Open applications' }, { t: 'Flick down', v: 'Nothing' }]],
    ['Menu buttons', [{ t: 'Add and arrange buttons', s: 'Drag buttons onto Breeze, along it, or off it', link: true }]],
    ['Menu widgets', [{ t: 'Add widget', link: true }]]] },
  { key: 'lock', icon: 'lock', title: 'Lock screen', summary: 'Notifications, glance line, weather', groups: [
    ['Standby screen', [{ t: 'Standby screen', s: 'The clock, notifications and your own lines while locked', link: true }]],
    ['Notifications on the lock screen', [{ t: 'More notifications', v: 'Stacked cards, slide up to see all' }, { t: 'Notifications shown in full', v: '3 (N9)' }]],
    ['Under the clock', [{ t: 'Glance line', s: 'Next alarm and event under the date', on: false }, { t: 'Weather', s: 'Current weather under the date', on: false }, { t: 'Emergency information', s: 'Owner and medical essentials beside the clock', link: true }]]] },
  { key: 'emergency', icon: 'info', title: 'Emergency information', summary: 'Medical details for first responders', groups: [
    [null, [{ t: 'Show on the lock screen', s: 'Owner and essentials beside the clock; tap for the full card', on: false }, { t: 'Shown beside the clock', v: 'Name, Blood type' }]],
    ['Medical details', [{ t: 'Name', v: 'Not set' }, { t: 'Blood type', v: 'Not set' }, { t: 'Allergies', v: 'Not set' }, { t: 'Medication', v: 'Not set' }, { t: 'Medical notes', v: 'Not set' }, { t: 'Organ donor', v: 'Not set' }]],
    ['Emergency contacts', [{ t: 'Add a person', link: true }]]] },
  { key: 'sharing', icon: 'share', title: 'Sharing', summary: 'Share sheet, sharing a network', groups: [
    ['Share sheet', [{ t: 'N9 share sheet', s: 'With a filter and pinned apps, instead of Android\'s', on: false }, { t: 'Suggested people', s: 'A row of people at the top of the sheet', on: false }]],
    ['Networks', [{ t: 'Share network', s: 'On the main settings page: a QR code and the password of your Wi-Fi', on: false }]]] },
  { key: 'toolbar', icon: 'wrench', title: 'Toolbar', summary: 'The N9 bar under every app', groups: [[null, [
    { t: 'N9 toolbar', s: 'The N9 bar under every app: Back, your shortcuts, or the app\'s own buttons', on: true }, { t: 'Back button', v: 'Left' },
    { t: 'Toolbar theme', v: 'N9 light' }, { t: 'Toolbar buttons', s: 'Your shortcuts and macros, for all apps or per app', link: true }]]] },
  { key: 'system', icon: 'settings', title: 'System', summary: 'Permissions, default home app', groups: [[null, [
    { t: 'Swipe gestures & live previews', s: 'Enable “Etesian swipe gestures” in Accessibility', link: true }, { t: 'Notification access', s: 'Lets the Events view show your notifications', link: true },
    { t: 'Default home app', s: 'Choose Etesian as your home screen', link: true }]]] },
];

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
.es-tb { height: 56px; flex: none; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; background: #F2F2F2; border-top: 1px solid #D8D8D8; }
</component>`;
const ROWS = `<div v-for="r in rows" class="es-row"><div><b>{{ r.t }}</b><small v-if="r.s">{{ r.s }}</small><small v-if="r.v" class="es-v">{{ r.v }}</small></div>
  <HdSwitch v-if="r.on !== undefined" :model-value="r.on" :aria-label="r.t" /><span v-else-if="r.link" class="es-chev">›</span></div>`;

const page = (p: Page): StoryObj => ({
  name: p.title,
  parameters: { docs: { description: { story: `Etesian settings → ${p.title}: ${p.summary}.` } } },
  render: () => ({
    components: { HdIcon, HdSwitch },
    setup: () => ({ p }),
    template: `${CSS}<div class="es"><div class="es-sb">09:41</div><div class="es-body"><h3>{{ p.title }}</h3>
      <template v-for="g in p.groups"><h4 v-if="g[0]">{{ g[0] }}</h4><template v-for="rows in [g[1]]">${ROWS}</template></template></div>
      <div class="es-tb"><HdIcon name="back" :size="32" /><span /></div></div>`,
  }),
});

export const Main: StoryObj = {
  name: 'Main page',
  parameters: { docs: { description: { story: 'Etesian settings: one row per sub page, N9 style (icon, title, what is inside). Gestures, Lock screen and Toolbar only show when Etesian is built into the ROM.' } } },
  render: () => ({
    components: { HdIcon },
    setup: () => ({ S: SECTIONS }),
    template: `${CSS}<div class="es"><div class="es-sb">09:41</div><div class="es-body"><h3>Etesian settings</h3>
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
