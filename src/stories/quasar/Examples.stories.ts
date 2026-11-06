import { BACK_ARROW_PATH } from '../../components/backArrow';
import type { Meta } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import { qs } from './q';
import HdTimePicker from '../../components/HdTimePicker.vue';
import HdSwitch from '../../components/HdSwitch.vue';
import HdTimeDial from '../../components/HdTimeDial.vue';
import HdFastScroll from '../../components/HdFastScroll.vue';
const meta: Meta = {
  title: 'Quasar/Examples',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Complete apps built from Quasar components with the Etesian theme, following docs/20-phone.md: plain page headers with the title in large LIGHT type over a thin divider, pull-down search, the light HdToolBar look for QFooter (dark only where the N9 app is dark: Music, Gallery photo view), lit squircle Back, titles bold and body regular. Every example works in Hybrid, Dark and Light; see Examples/All colour modes.' } },
  },
};
export default meta;

/* ---- shared pieces ---- */
// phone frame: rounded display corners (--hd-q-screen-radius)
const phone = (inner: string, opts = '') => `<q-layout view="hHh lpR fFf" container class="hd-q-app" style="height:680px;width:360px;flex:none;border-radius:var(--hd-q-screen-radius) var(--hd-q-screen-radius) 0 0;overflow:hidden${opts}">${inner}</q-layout>`;
/** half resolution (240 × 427 N9 px → 240 × 453 here): same layout, thumbnail-sized photo */
const phoneSmall = (inner: string) => `<q-layout view="hHh lpR fFf" container class="hd-q-app hd-q-small" style="height:453px;width:240px;flex:none;border-radius:var(--hd-q-screen-radius) var(--hd-q-screen-radius) 0 0;overflow:hidden">${inner}</q-layout>`;
// main page: the app's brand colour (set per app, not taken from the icon); sub pages: plain
const head = (title: string, extra = '', brand?: string) => brand
  ? `<q-header class="hd-q-brand" style="background:${brand} !important;color:#fff;--hd-c-fg-secondary:rgba(255,255,255,.85)"><div class="hd-q-head">${title}${extra}</div></q-header>`
  : `<q-header class="hd-plain"><div class="hd-q-head">${title}${extra}</div></q-header>`;
const pull = `<div class="hd-q-pull"><q-icon :name="ic('arrow-down')" size="16px" />Pull down to search</div>`;
const back = `<q-btn flat class="hd-sq hd-q-back" aria-label="Back"><svg width="33" height="33" viewBox="0 0 24 24" aria-hidden="true"><path d="${BACK_ARROW_PATH}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg></q-btn>`;
const row = (...panels: string[]) => `<div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start">${panels.join('')}</div>`;
const tool = (icon: string, label: string) => `<q-btn flat round :icon="ic('${icon}')" aria-label="${label}" />`;
const more = `<q-btn flat round :icon="ic('more')" aria-label="App menu" />`;
/** bottom bar: several buttons → first / last centres 44 n9px from the edges, the rest evenly spaced; a single one goes left (Back, +) or right (≡) per `align` */
const footer = (tools: string, opts: { dark?: boolean; menu?: boolean; back?: boolean; align?: 'start' | 'end' } = {}) =>
  `<q-footer${opts.dark ? ' class="hd-dark"' : ''}><q-toolbar${(opts.align ?? (!tools && !opts.menu ? 'start' : !tools && opts.back === false ? 'end' : '')) ? ` class="hd-q-bar--${opts.align ?? (!opts.menu ? 'start' : 'end')}"` : ''}>${opts.back === false ? '' : back}${tools}${opts.menu ? more : ''}</q-toolbar></q-footer>`; // equal slots across the bar
const art = (a: string, b: string) => `background:linear-gradient(135deg,${a},${b})`;
const CSS = `<component is="style">
.hd-q-story { --hd-q-screen-radius: 7px; } /* N9: 10 n9px, top corners of the app window only; the toolbar edge is square */
.hd-q-app .hd-q-letter { position:sticky; top:0; z-index:1; padding:6px 16px 4px; flex-direction:row-reverse; background:var(--hd-c-bg); font:700 .8125rem/1 var(--hd-font-family-base); color:var(--hd-c-fg-secondary); display:flex; align-items:center; gap:10px; }
.hd-q-app .hd-q-letter::after { content:''; flex:1; height:1px; background:var(--hd-c-divider); }
.hd-q-app .hd-q-sqart { -webkit-mask:var(--hd-squircle-mask) center/100% 100% no-repeat; mask:var(--hd-squircle-mask) center/100% 100% no-repeat; flex:none; }
.hd-q-app .hd-q-big { font:300 2.25rem/1.1 var(--hd-font-family-light); }
.hd-q-app .hd-q-sub { font:400 .875rem/1.3 var(--hd-font-family-base); color:var(--hd-c-fg-secondary); }
.hd-q-app .q-item__label:not(.q-item__label--caption):not(.q-item__label--header) { font:400 1rem/1.3 var(--hd-font-family-base); }
.hd-q-app .q-item__label.hd-q-body { font-size:.875rem; }
.hd-q-app .hd-q-t, .hd-q-app .q-item__label.hd-q-t:not(.q-item__label--caption):not(.q-item__label--header) { font:700 1rem/1.25 var(--hd-font-family-base); }
.hd-q-app.hd-q-dark-app, .hd-q-app.hd-q-dark-app .q-page-container, .hd-q-app.hd-q-dark-app .q-page, .hd-q-app.hd-q-dark-app .q-header { background:#000 !important; color:#fff; --hd-c-fg:#fff; --hd-c-fg-secondary:#9a9a9a; --hd-c-divider:rgba(255,255,255,.16); --hd-c-bg:#000; --hd-c-surface:#161616; }
</component>`;
const initials = (n: string) => n.split(' ').map((w) => w[0]).join('').slice(0, 2);

/* ---- Settings (main page: no toolbar, like the phone) ---- */
export const SettingsApp = qs(CSS + phone(`${head('Settings')}
  <q-page-container><q-page>${pull}
    <q-list>
      <q-item-label header>Connectivity</q-item-label>
      <q-item tag="label"><q-item-section avatar><q-avatar color="primary" text-color="white" :icon="ic('wifi')" /></q-item-section><q-item-section><q-item-label>Wi-Fi</q-item-label><q-item-label caption>HomeNet</q-item-label></q-item-section><q-item-section side><q-toggle v-model="wifi" aria-label="Wi-Fi" /></q-item-section></q-item>
      <q-item tag="label"><q-item-section avatar><q-avatar color="accent" text-color="white" :icon="ic('bluetooth')" /></q-item-section><q-item-section><q-item-label>Bluetooth</q-item-label><q-item-label caption>Off</q-item-label></q-item-section><q-item-section side><q-toggle v-model="bt" aria-label="Bluetooth" /></q-item-section></q-item>
      <q-item clickable><q-item-section avatar><q-avatar color="positive" text-color="white" :icon="ic('phone')" /></q-item-section><q-item-section><q-item-label>Calls</q-item-label><q-item-label caption>Call waiting, voicemail</q-item-label></q-item-section><q-item-section side><q-icon :name="ic('chevron-right')" /></q-item-section></q-item>
      <q-item-label header>Device</q-item-label>
      <q-item clickable><q-item-section avatar><q-avatar color="orange" text-color="white" :icon="ic('battery')" /></q-item-section><q-item-section><q-item-label>Battery</q-item-label><q-item-label caption>82%, power save off</q-item-label></q-item-section><q-item-section side><q-icon :name="ic('chevron-right')" /></q-item-section></q-item>
      <q-item><q-item-section avatar><q-avatar color="purple" text-color="white" :icon="ic('photo')" /></q-item-section><q-item-section><q-item-label>Brightness</q-item-label><q-slider v-model="bright" :min="0" :max="100" aria-label="Brightness" /></q-item-section></q-item>
      <q-item clickable><q-item-section avatar><q-avatar color="grey-8" text-color="white" :icon="ic('lock')" /></q-item-section><q-item-section><q-item-label>Security</q-item-label><q-item-label caption>Lock code, SIM PIN</q-item-label></q-item-section><q-item-section side><q-icon :name="ic('chevron-right')" /></q-item-section></q-item>
    </q-list>
  </q-page></q-page-container>`, ';margin:0 auto'), () => ({ wifi: ref(true), bt: ref(false), bright: ref(60) }), { name: 'Settings app' });

/* ---- Email ---- */
const mails = [
  { from: 'Anna Virtanen', subject: 'Trip to Lapland', snippet: 'I booked the cabin for the second week of...', time: '10:45', unread: true, c: 'primary' },
  { from: 'Mikko Laine', subject: 'Re: band practice', snippet: 'Thursday works for me, bring the...', time: '09:12', unread: true, c: 'positive' },
  { from: 'Store', subject: 'Your receipt', snippet: 'Thank you for your purchase of...', time: 'Yesterday', unread: false, c: 'orange' },
  { from: 'Sara Koski', subject: 'Photos', snippet: 'Here are the photos from Saturday', time: 'Mon', unread: false, c: 'purple' },
  { from: 'Jussi Heikkinen', subject: 'Bluetooth keyboard', snippet: 'Did the pairing work in the end?', time: 'Sun', unread: false, c: 'teal' },
];
export const EmailApp = qs(CSS + phone(`${head('Inbox', ' <q-badge color="white" text-color="primary" :label="2" aria-label="2 unread" />', '#0067BC')}
  ${footer(tool('refresh', 'Refresh') + tool('edit', 'Compose'), { menu: true })}
  <q-page-container><q-page>${pull}
    <q-list separator>
      <q-slide-item v-for="m in mails" :key="m.subject" right-color="negative"><template #right>Delete</template>
        <q-item clickable :class="{ 'hd-q-unread': m.unread }" :aria-label="(m.unread ? 'Unread, ' : '') + m.from + ': ' + m.subject"><q-item-section avatar><q-avatar :color="m.c" text-color="white">{{ initials(m.from) }}</q-avatar></q-item-section>
          <q-item-section><q-item-label class="hd-q-t hd-q-from">{{ m.from }}</q-item-label><q-item-label>{{ m.subject }}</q-item-label><q-item-label caption lines="1">{{ m.snippet }}</q-item-label></q-item-section>
          <q-item-section side top><q-item-label caption>{{ m.time }}</q-item-label></q-item-section></q-item>
      </q-slide-item>
    </q-list>
  </q-page></q-page-container>`, ';margin:0 auto'), () => ({ mails, initials }), { name: 'Email app' });

/* ---- Contacts ---- */
/** N9 Contacts main page (n9-contacts-fastscroll*.png): brand header, rounded search, dark squircle avatars with white
 * bold initials (a photo sits in the same squircle), each section opens with a thin rule up to the fast-scroll band;
 * light toolbar with + left and ≡ right, no Back. */
const ROW = 64, SEC = 28;
const contactsList = (fs: string, shift = 'at') => phone(`${head('Contacts', '', '#0A7FD6')}
  <q-footer><q-toolbar>${tool('add', 'New contact')}${tool('lines', 'Menu')}</q-toolbar></q-footer>
  <q-page-container><q-page>
    <div class="hd-q-csearch"><q-input rounded outlined dense placeholder="Search" aria-label="Search contacts"><template #append><q-icon :name="ic('search')" /></template></q-input></div>
    <div class="hd-q-clist">${fs}<div class="hd-q-cinner" :style="{ transform: 'translateY(' + -(${shift}) + 'px)' }">
      <template v-for="g in groups" :key="g[0]"><div class="hd-q-crule" aria-hidden="true"></div>
        <div v-for="(p, i) in g[1]" :key="p" class="hd-q-crow" role="button" tabindex="0">
          <span class="hd-q-sqart hd-q-cav" :style="i === 1 && g[0] === 'K' ? 'background:linear-gradient(135deg,#d9a06b,#5b3a24)' : ''" :aria-label="i === 1 && g[0] === 'K' ? 'Photo of ' + p : undefined" :role="i === 1 && g[0] === 'K' ? 'img' : undefined">{{ i === 1 && g[0] === 'K' ? '' : initials(p) }}</span>
          <b>{{ p }}</b></div></template>
    </div></div>
  </q-page></q-page-container>
  <component is="style">
    .hd-q-csearch { padding: 12px 10px; border-bottom: 1px solid var(--hd-c-divider); }
    .hd-q-clist { position: relative; height: 545px; overflow: hidden; } .hd-q-cinner { transition: transform .12s; }
    .hd-q-crule { height: ${SEC}px; margin-right: 47px; display: flex; align-items: center; } .hd-q-crule::after { content: ''; flex: 1; height: 1px; margin-left: 10px; background: rgba(0,0,0,.14); }
    .hd-q-crow { height: ${ROW}px; display: flex; align-items: center; gap: 12px; padding: 0 10px; margin-right: 47px; font: 700 1.0625rem/1 var(--hd-font-family-base); }
    .hd-q-cav { width: 43px; height: 43px; display: grid; place-items: center; background: linear-gradient(#3a3a3a, #0a0a0a); color: #fff; font: 700 1.125rem/1 var(--hd-font-family-base); }
  </component>`);
const cPeople = ['Aino Mäkinen', 'Anna Virtanen', 'Antti Salo', 'Elina Koivisto', 'Heikki Lahti', 'Jussi Heikkinen', 'Kaisa Rinne', 'Kalle Mäki', 'Katja Lind', 'Kimmo Aalto', 'Liisa Niemi', 'Lotta Saari', 'Mikko Laine', 'Sara Koski', 'Timo Nurmi'];
const cGroups = Object.entries(cPeople.reduce<Record<string, string[]>>((a, p) => ((a[p[0]] ??= []).push(p), a), {}));
let cTop = 0;
const cSecs = cGroups.map(([letter, ps]) => { const top = cTop + SEC / 2; cTop += SEC + ps.length * ROW; return { letter, top }; });
export const ContactsApp = qs(CSS + row(
  contactsList('<HdFastScroll :position="0.3" :sections="secs" label="Fast scroll (drag: snaps section by section)" @jump="(i) => (at = secs[i].top - 14)" />'),
  contactsList('<HdFastScroll :position="0.16" active letter="K" :sections="secs.map((x) => ({ ...x, top: x.top - kTop }))" label="Fast scroll (finger on the bar)" />', 'kTop'),
  phone(`${footer(tool('edit', 'Edit') + tool('star', 'Favourite') + tool('share', 'Share'), { menu: true })}
  <q-page-container><q-page class="q-pa-md">
    <div class="column items-center q-pt-md" style="gap:12px">
      <div class="hd-q-sqart" style="width:148px;height:148px;${art('#7fb0d8', '#2a5b8a')};display:grid;place-items:center;color:#fff;font:300 56px/1 var(--hd-font-family-light)" role="img" aria-label="Photo of Anna Virtanen">AV</div>
      <div class="hd-q-big">Anna Virtanen</div><div class="hd-q-sub">Designer, Etesian Oy</div>
      <div class="row" style="gap:12px"><q-btn unelevated color="positive" :icon="ic('phone')" label="Call" /><q-btn unelevated :icon="ic('message')" label="Message" /></div>
    </div>
    <q-list class="q-mt-md">
      <q-item-label header>Phone</q-item-label>
      <q-item clickable><q-item-section><q-item-label class="hd-q-t">+358 40 123 4567</q-item-label><q-item-label caption>Mobile</q-item-label></q-item-section><q-item-section side><q-icon :name="ic('message')" /></q-item-section></q-item>
      <q-item-label header>Email</q-item-label>
      <q-item clickable><q-item-section><q-item-label class="hd-q-t">anna@example.com</q-item-label><q-item-label caption>Work</q-item-label></q-item-section></q-item>
    </q-list>
  </q-page></q-page-container>`)), () => ({ initials, groups: cGroups, secs: cSecs, at: ref(0), kTop: cSecs.find((x) => x.letter === 'K')!.top - SEC / 2 }), { name: 'Contacts app (fast scroll idle / finger on the bar, detail)' }, { HdFastScroll });
export const ContactsCompact = qs(CSS + row(
  phone(`${footer(tool('edit', 'Edit') + tool('star', 'Favourite') + tool('share', 'Share'), { menu: true })}
  <q-page-container><q-page class="q-pa-md">
    <div class="column items-center q-pt-md" style="gap:12px">
      <div class="hd-q-sqart" style="width:148px;height:148px;${art('#7fb0d8', '#2a5b8a')};display:grid;place-items:center;color:#fff;font:300 56px/1 var(--hd-font-family-light)" role="img" aria-label="Photo of Anna Virtanen">AV</div>
      <div class="hd-q-big">Anna Virtanen</div><div class="hd-q-sub">Designer, Etesian Oy</div>
      <div class="row" style="gap:12px"><q-btn unelevated color="positive" :icon="ic('phone')" label="Call" /><q-btn unelevated :icon="ic('message')" label="Message" /></div>
    </div>
    <q-list class="q-mt-md">
      <q-item-label header>Phone</q-item-label>
      <q-item clickable><q-item-section><q-item-label class="hd-q-t">+358 40 123 4567</q-item-label><q-item-label caption>Mobile</q-item-label></q-item-section><q-item-section side><q-icon :name="ic('message')" /></q-item-section></q-item>
      <q-item-label header>Email</q-item-label>
      <q-item clickable><q-item-section><q-item-label class="hd-q-t">anna@example.com</q-item-label><q-item-label caption>Work</q-item-label></q-item-section></q-item>
    </q-list>
  </q-page></q-page-container>`),
  phoneSmall(`${footer(tool('edit', 'Edit') + tool('share', 'Share'), { menu: true })}
  <q-page-container><q-page class="q-pa-sm">
    <div class="row items-center no-wrap q-pa-sm" style="gap:10px">
      <div class="hd-q-sqart" style="width:43px;height:43px;${art('#7fb0d8', '#2a5b8a')};display:grid;place-items:center;color:#fff;font:300 18px/1 var(--hd-font-family-light)" role="img" aria-label="Photo of Anna Virtanen">AV</div>
      <div style="min-width:0"><div class="hd-q-t ellipsis">Anna Virtanen</div><div class="hd-q-sub ellipsis">Designer, Etesian Oy</div></div></div>
    <div class="row no-wrap q-px-sm" style="gap:8px"><q-btn unelevated dense color="positive" :icon="ic('phone')" label="Call" style="flex:1" /><q-btn unelevated dense no-wrap :icon="ic('message')" label="Text" style="flex:1" /></div>
    <q-list dense class="q-mt-sm">
      <q-item-label header>Phone</q-item-label>
      <q-item clickable><q-item-section><q-item-label class="hd-q-t">+358 40 123 4567</q-item-label><q-item-label caption>Mobile</q-item-label></q-item-section></q-item>
      <q-item-label header>Email</q-item-label>
      <q-item clickable><q-item-section><q-item-label class="hd-q-t ellipsis">anna@example.com</q-item-label><q-item-label caption>Work</q-item-label></q-item-section></q-item>
    </q-list>
  </q-page></q-page-container>`)), () => ({}), { name: 'Contacts detail: full vs. half resolution (compact)' });

/* ---- Messaging ---- */
const threads = [
  { who: 'Anna Virtanen', last: 'See you soon!', time: '12:31', n: 2, c: 'primary' },
  { who: 'Mikko Laine', last: 'The pop-up window is my favourite', time: '11:02', n: 0, c: 'positive' },
  { who: 'Sara Koski', last: 'Photo', time: 'Yesterday', n: 0, c: 'purple' },
  { who: 'Liisa Niemi', last: 'Thanks!', time: 'Mon', n: 0, c: 'orange' },
];
export const MessagingApp = qs(CSS + row(
  phone(`${head('Messages', '', '#09A7CC')}
  ${footer(tool('edit', 'New message') + tool('search', 'Search'), { back: false, menu: true })}
  <q-page-container><q-page>${pull}<q-list separator>
    <q-item v-for="t in threads" :key="t.who" clickable :class="{ 'hd-q-unread': t.n }"><q-item-section avatar><q-avatar :color="t.c" text-color="white">{{ initials(t.who) }}</q-avatar></q-item-section>
      <q-item-section><q-item-label class="hd-q-t hd-q-from">{{ t.who }}<span v-if="t.n" class="hd-q-sub"> ({{ t.n }})</span></q-item-label><q-item-label caption lines="1">{{ t.last }}</q-item-label></q-item-section>
      <q-item-section side top><q-item-label caption>{{ t.time }}</q-item-label></q-item-section></q-item>
  </q-list></q-page></q-page-container>`),
  phone(`${head('Anna Virtanen')}
  <q-footer><q-toolbar class="hd-q-free" style="gap:8px;padding:8px">${back.replace('hd-q-back', 'hd-q-back hd-q-back--page')}<q-input v-model="draft" dense outlined class="col" placeholder="Write a message" aria-label="Message" /><q-btn unelevated color="primary" :icon="ic('message')" aria-label="Send" /></q-toolbar></q-footer>
  <q-page-container><q-page class="q-pa-md">
    <q-chat-message name="Anna" :text="['Are we still on for lunch?']" stamp="12:02" />
    <q-chat-message name="me" :text="['Yes! 12:30 at the usual place?']" stamp="12:05" sent />
    <q-chat-message name="Anna" :text="['Perfect. Bring the tablet mockups, I want to see the split view.']" stamp="12:20" />
    <q-chat-message name="me" :text="['Will do.']" stamp="12:21" sent />
    <q-chat-message name="Anna" :text="['See you soon!']" stamp="12:31" />
  </q-page></q-page-container>`)),
() => ({ threads, initials, draft: ref('') }), { name: 'Messaging app' });

/* ---- Music (dark, like the N9 app; n9-music-*.png) ----
 * Album art is content: shown whole, square and edge to edge, never squircled (photos in Gallery too; contact photos
 * in lists are squircles). An album without art gets the N9's generated cover: its name in heavy caps, then the name
 * repeated without spaces in a dark shade of the same colour, every line justified, on black. One colour per album
 * (unknown albums are always purple); the playing item in a list takes the magenta highlight. */
const songs = [['A Matterapat', 'Dr. Lonnie Smith', '6:46'], ['Call On Me', 'Colette', '6:16'], ['Colors', 'The Pass', '4:44'], ['Etesian wind', 'The Swipes', '3:57'], ['Northern lights', 'The Swipes', '5:02'], ['Polar night', 'The Swipes', '3:18']];
const MAGENTA = '#C4008F';
/** The generated cover: [size] px square, [color] bright, the repeat at a third of its brightness. */
const genArt = (name: string, color: string, size: number) => {
  const fill = (name.replace(/\s+/g, '').toUpperCase() + ' ').repeat(12);
  return `<div role="img" aria-label="Album art: ${name}" style="width:${size}px;height:${size}px;flex:none;overflow:hidden;background:#000;` +
    `font:900 ${Math.round(size * 0.17)}px/0.98 var(--hd-font-family-base);text-transform:uppercase;text-align:justify;text-align-last:justify;` +
    `word-break:break-all;padding:0 ${Math.round(size * 0.01)}px;color:color-mix(in srgb, ${color} 33%, #000)">` +
    `<span style="color:${color};word-break:normal">${name.toUpperCase()}</span> ${fill}</div>`;
};
const photoArt = (a: string, b: string, size: number | string, label: string) =>
  `<div role="img" aria-label="Album art: ${label}" style="width:${size};aspect-ratio:1;flex:none;${art(a, b)}"></div>`;
/** Now Playing: the art, title + position, artist / album with the round "•••", bare transport glyphs, thin magenta bar. */
const nowPlaying = (cover: string, title: string, artist: string, album: string, at: string, len: string, pct: number, pos: string) => `
  <q-footer class="hd-dark hd-q-music-bar"><q-toolbar>${back}<q-btn flat round :icon="ic('star')" aria-label="Favourite" />
    <q-btn flat round :icon="ic('shuffle')" aria-label="Shuffle" style="opacity:.35" /><q-btn flat round :icon="ic('repeat')" aria-label="Repeat" />
    <q-btn flat round :icon="ic('lines')" aria-label="Menu" /></q-toolbar></q-footer>
  <q-page-container><q-page class="column">
    ${cover}
    <div class="row items-baseline no-wrap q-px-md" style="margin-top:14px"><div class="hd-q-t ellipsis" style="flex:1;font-size:1.0625rem">${title}</div><div class="hd-q-sub" style="margin-left:12px">${pos}</div></div>
    <div class="row items-center no-wrap q-px-md" style="margin-top:12px"><div style="flex:1;min-width:0"><div class="hd-q-sub ellipsis" style="font-size:1rem;line-height:1.6">${artist}</div><div class="hd-q-sub ellipsis" style="font-size:1rem;line-height:1.6">${album}</div></div>
      <div aria-label="More about this song" role="button" class="hd-sqm" style="width:26px;height:26px;background:#fff;color:#000;display:grid;place-items:center;font:900 14px/1 var(--hd-font-family-base);letter-spacing:1px">•••</div></div>
    <div class="row justify-between items-center q-px-md" style="margin-top:16px"><q-btn flat dense round :icon="ic('first')" aria-label="Previous" /><q-btn flat dense round :icon="ic('pause')" aria-label="Pause" /><q-btn flat dense round :icon="ic('last')" aria-label="Next" /></div>
    <div class="q-px-md" style="margin-top:22px"><div style="position:relative;height:5px;background:#3a3a3c;border-radius:3px"><div style="position:absolute;inset:0 ${100 - pct}% 0 0;background:${MAGENTA};border-radius:3px"></div><div style="position:absolute;top:0;left:calc(${pct}% - 2px);width:4px;height:5px;background:#fff"></div></div>
      <div class="row justify-between hd-q-sub" style="margin-top:8px;font-size:.9375rem"><span>${at}</span><span>${len}</span></div></div>
  </q-page></q-page-container>`;
export const MusicApp = qs(CSS + `<component is="style">
.hd-q-music-main .hd-q-menu { display:flex; align-items:center; justify-content:space-between; padding:0 16px; height:49px; font:700 1.0625rem/1 var(--hd-font-family-base); }
</component>` + row(
  phone(nowPlaying(photoArt('#d38ab0', '#3b1d3e', '100%', 'Polar night'), 'Etesian wind', 'The Swipes', 'Polar night', '1:24', '3:57', 35, '4/6')),
  phone(nowPlaying(genArt('Unknown album', '#8E10C4', 360), 'Episode293', 'Unknown artist', 'Unknown album', '1:16', '24:58', 5, '4/20')),
  phone(`<q-page-container><q-page class="hd-q-music-main">
    <div style="display:grid;grid-template-columns:repeat(3,120px);grid-template-rows:repeat(3,120px)">
      <div style="grid-column:1/3;grid-row:1/3;position:relative">${genArt('In Search Of Sunrise 5', '#FF5A00', 240)}
        <div class="hd-sqm" style="position:absolute;left:4px;right:4px;bottom:4px;height:17px;background:${MAGENTA};color:#fff;display:flex;align-items:center;gap:8px;padding:0 10px;font:700 .75rem/1 var(--hd-font-family-base)"><span>▶</span><span class="ellipsis">In Search Of Sunrise 5 (CD 1)</span></div></div>
      ${genArt('Unknown album', '#8E10C4', 120)}
      ${photoArt('#6d5a4a', '#2b211b', '120px', 'Podcast')}
      ${photoArt('#a8c84a', '#3d6b1f', '120px', 'Every Direction Is North')}${photoArt('#e0a04a', '#5a2b10', '120px', 'Rocks')}${photoArt('#f6a5d0', '#9b2f6d', '120px', 'Call On Me')}
    </div>
    <div style="margin-top:10px">
      <div v-for="m in ['Artists','Albums','Songs','Playlists']" :key="m" class="hd-q-menu" role="link"><span>{{ m }}</span><q-icon :name="ic('chevron-right')" size="22px" /></div>
      <div class="hd-q-menu" role="link"><span>Music Store</span><q-icon :name="ic('store')" size="20px" /></div>
    </div>
  </q-page></q-page-container>`)).replace(/class="hd-q-app"/g, 'class="hd-q-app hd-q-dark-app"'),
() => ({ songs, pos: ref(84), fmt: (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` }), { name: 'Music player' });

/* ---- Calendar ---- */
export const CalendarApp = qs(CSS + row(
  phone(`${footer(tool('add', 'New event') + tool('calendar', 'Month') + tool('clock', 'Agenda'), { back: false, menu: true })}
  <q-page-container><q-page>
    <q-date v-model="day" minimal flat class="full-width" style="max-width:none" aria-label="October 2026" />
    <div class="hd-q-letter">Saturday 24 October</div>
    <q-list><q-item v-for="e in events" :key="e[0]"><q-item-section avatar style="min-width:0"><span style="width:4px;height:36px;display:block" :style="{ background: e[2] }"></span></q-item-section><q-item-section><q-item-label class="hd-q-t">{{ e[0] }}</q-item-label><q-item-label caption>{{ e[1] }}</q-item-label></q-item-section></q-item></q-list>
  </q-page></q-page-container>`),
  phone(`${head('New event')}
  ${footer('')}
  <q-page-container><q-page class="q-pa-md column" style="gap:12px">
    <q-input v-model="title" outlined label="Title" />
    <q-input v-model="where" outlined label="Location" />
    <q-toggle v-model="allDay" label="All day" />
    <HdTimePicker v-if="!allDay" v-model="start" title="Start time" hour24 />
    <q-toggle v-model="remind" label="Reminder 15 minutes before" />
    <q-btn unelevated color="primary" label="Save" />
  </q-page></q-page-container>`, ';height:920px')),
() => ({ day: ref('2026/10/24'), events: [['Lunch with Anna', '12:30 – 13:30', '#09A7CC'], ['Design review', '14:00 – 15:00 · Room Etesian', '#EF5500'], ['Gym', '18:00 – 19:00', '#62B700']], title: ref('Sauna evening'), where: ref('Lahti'), allDay: ref(false), start: ref('19:00'), remind: ref(true) }),
{ name: 'Calendar app' }, { HdTimePicker });

/* ---- Gallery ---- */
const tints = [['#f6b26b', '#8e3b1f'], ['#6fa8dc', '#1c3d63'], ['#93c47d', '#2c4d1f'], ['#c27ba0', '#4c1830'], ['#ffd966', '#7f6000'], ['#76a5af', '#1b3a40'], ['#e06666', '#5a1414'], ['#8e7cc3', '#2c2050'], ['#b6d7a8', '#38512d'], ['#f9cb9c', '#7a4214'], ['#a4c2f4', '#203a6b'], ['#d5a6bd', '#5c2a42']];
export const GalleryApp = qs(CSS + row(
  phone(`${head('Gallery', ' <small>{{ tints.length }} photos</small>', '#821DDE')}
  ${footer(tool('photo', 'Albums') + tool('share', 'Share'), { back: false, menu: true })}
  <q-page-container><q-page class="q-pa-sm"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
    <div v-for="(t, i) in tints" :key="i" role="img" :aria-label="'Photo ' + (i + 1)" style="aspect-ratio:1" :style="{ background: 'linear-gradient(135deg,' + t[0] + ',' + t[1] + ')' }"></div>
  </div></q-page></q-page-container>`),
  phone(`${footer(tool('share', 'Share') + tool('edit', 'Edit') + tool('delete', 'Delete'), { dark: true, menu: true })}
  <q-page-container><q-page style="background:#000 !important;display:grid;place-items:center"><div role="img" aria-label="Photo 2, full screen" style="width:100%;aspect-ratio:4/3;${art('#6fa8dc', '#1c3d63')}"></div></q-page></q-page-container>`)),
() => ({ tints }), { name: 'Gallery app' });

/* ---- Store ---- */
export const StoreApp = qs(CSS + phone(`${footer(tool('share', 'Share'), { menu: true })}
  <q-page-container><q-page class="q-pa-md column" style="gap:14px">
    <div class="row no-wrap items-center" style="gap:16px"><q-avatar size="72px" color="orange" text-color="white" :icon="ic('globe')" /><div class="col"><div class="hd-q-big" style="font-size:1.75rem">Feeds</div><div class="hd-q-sub">Etesian Labs · News</div>
      <div class="row items-center" style="gap:6px"><q-rating :model-value="4.5" readonly size="18px" color="primary" :icon="ic('star')" aria-label="Rated 4.5 of 5" /><span class="hd-q-sub">4.5 (1 284)</span></div></div></div>
    <q-btn unelevated color="primary" label="Install" class="full-width" />
    <q-carousel v-model="slide" animated swipeable navigation arrows height="280px" style="border-radius:8px">
      <q-carousel-slide v-for="(t, i) in shots" :key="i" :name="i" :style="{ background: 'linear-gradient(160deg,' + t[0] + ',' + t[1] + ')' }" :aria-label="'Screenshot ' + (i + 1)" />
    </q-carousel>
    <div><div class="hd-q-t">About</div><p class="hd-q-sub q-mb-none">Read your favourite sites in the Events view. Pull down to refresh, swipe to the next story.</p></div>
  </q-page></q-page-container>`, ';height:760px;margin:0 auto'), () => ({ slide: ref(0), shots: [['#ff8500', '#3b1d00'], ['#09a7cc', '#06303b'], ['#821dde', '#250a40']] }), { name: 'Store app details' });

/* ---- Clock (the phone's DeskClock, after the N9 Clock): the clock in a light panel, digital or analog, over the alarms ---- */
const CLOCK_CSS = `<component is="style">
.hd-q-clock .ck-face { display:flex; flex-direction:column; align-items:center; height:382px; box-sizing:border-box; padding:24px 16px 0; background:#EEF2F6; }
.hd-q-clock .ck-city { font:400 .8125rem/1 var(--hd-font-family-base); color:#555; }
.hd-q-clock .ck-digital { margin-top:122px; font:200 5.2rem/1 var(--hd-font-family-light); letter-spacing:-1px; color:#111; }
.hd-q-clock .ck-digital b { font-weight:inherit; color:#F26B1D; }
.hd-q-clock .ck-rule { align-self:stretch; height:1px; margin:18px 8px 0; background:#bfc3c5; }
.hd-q-clock .ck-date { align-self:flex-start; margin:22px 0 0 10px; font:300 1.125rem/1 var(--hd-font-family-light); color:#444; }
/* recessed and lit from the top: brighter at the top, slightly darker going down, a narrow shadow under the top edge */
.hd-q-clock .ck-dial { position:relative; width:285px; height:285px; margin-top:18px; border-radius:50%; background:linear-gradient(#e7e7e7, #c5c5c5); box-shadow:inset 0 2px 3px rgba(0,0,0,.3), 0 1px 0 rgba(255,255,255,.9); }
.hd-q-clock .ck-day { position:absolute; left:33px; top:126px; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; font:400 .75rem/1 var(--hd-font-family-base); color:#666; }
.hd-q-clock .ck-day b { margin-top:8px; font:200 2.25rem/1 var(--hd-font-family-light); color:#222; }
/* hands start at the centre, rounded ends, a soft shadow below; the hour hand is the thick short one */
.hd-q-clock .ck-hand { position:absolute; left:50%; top:50%; border-radius:99px; background:#fff; box-shadow:0 2px 3px rgba(0,0,0,.25); }
.hd-q-clock .ck-sec { position:absolute; left:50%; top:50%; width:142px; height:2px; margin-top:-1px; background:#F26B1D; transform-origin:0 50%; }
.hd-q-app .q-page.hd-q-clock { background:#E5E6E7; }
.hd-q-clock .ck-head { display:flex; align-items:center; justify-content:space-between; padding:20px 12px 14px 16px; border-top:1px solid #cfd1d2; font:300 1.75rem/1 var(--hd-font-family-light); }
.hd-q-app .hd-q-clock .q-btn.ck-add { width:32px; height:32px; min-width:0; min-height:0; padding:0; border-radius:0 !important; --hd-sq-size:32px; --hd-sq-fill:linear-gradient(#F7F7F8, #E6E6E8 50%, #D4D4D7); --hd-sq-ring:rgba(0,0,0,.18); color:#000; }
.hd-q-clock .ck-row { display:flex; align-items:center; gap:16px; padding:12px 12px 12px 14px; border-top:1px solid #d3d4d5; }
.hd-q-clock .ck-row:first-child { border-top:0; }
.hd-q-clock .ck-t { font:700 1.375rem/1.15 var(--hd-font-family-base); color:#222; }
.hd-q-clock .ck-l { font:400 .9375rem/1.3 var(--hd-font-family-base); color:#666; } .hd-q-clock .ck-l small { margin-left:6px; color:#999; font-size:.8125rem; }
.hd-q-clock .ck-edit { background:#DEE2E6; box-sizing:border-box; min-height:680px; padding:0 14px 10px; display:flex; flex-direction:column; align-items:center; }
.hd-q-clock .ck-bar { display:flex; justify-content:space-between; align-self:stretch; margin:0 -14px; padding:7px 14px; background:linear-gradient(#e5e5e5, #d4d4d4); border-bottom:1px solid #c4c4c6; }
.hd-q-app .bg-ck-grey { background-color:#d8d8da !important; color:#111 !important; }
.hd-q-clock .ck-btn { min-width:110px; height:38px; font:700 1rem/1 var(--hd-font-family-base); }
.hd-q-app .bg-ck-orange { background-color:#F26B1D !important; color:#fff !important; }
.hd-q-clock .ck-title { align-self:stretch; height:34px; margin-top:8px; padding:0 14px; display:flex; align-items:center; background:#fff; color:#999; font:400 1rem/1 var(--hd-font-family-base); }
.hd-q-clock .ck-more { align-self:stretch; display:flex; justify-content:space-between; align-items:center; margin-top:24px; padding:22px 2px; font:700 1.25rem/1 var(--hd-font-family-base); color:#222; }
.hd-q-clock .ck-more svg path, .hd-q-clock .ck-row svg path, .hd-q-clock .ck-add svg path { stroke-width:3.2 !important; }
</component>`;
const hand = (len: number, thick: number, deg: number) => `<span class="ck-hand" style="width:${len + thick / 2}px;height:${thick}px;margin:${-thick / 2}px 0 0 ${-thick / 2}px;transform-origin:${thick / 2}px 50%;transform:rotate(${deg - 90}deg)"></span>`;
const alarmList = `<div class="ck-alarms">
      <div class="ck-head">Alarms <q-btn flat class="hd-sq ck-add" :icon="ic('add')" aria-label="New alarm" /></div>
      <div v-for="a in alarms" :key="a.t" class="ck-row"><HdSwitch v-model="a.on" :aria-label="'Alarm ' + a.t" />
        <div style="flex:1"><div class="ck-t">{{ a.t }}</div><div class="ck-l">{{ a.label }}<small>{{ a.days }}</small></div></div><q-icon :name="ic('chevron-right')" size="26px" /></div>
    </div>`;
const clockBar = footer(tool('alarm', 'Alarms') + tool('globe', 'World clock') + tool('hourglass', 'Timer') + tool('stopwatch', 'Stopwatch') + tool('settings', 'Settings'));
export const ClockApp = qs(CSS + CLOCK_CSS + row(
  phone(`${clockBar}<q-page-container><q-page class="hd-q-clock">
    <div class="ck-face"><span class="ck-city">London GMT+0:00</span><div class="ck-digital">15:12<b>:31</b></div><div class="ck-rule"></div><div class="ck-date">6 Nov 2026</div></div>
    ${alarmList}</q-page></q-page-container>`),
  phone(`${clockBar}<q-page-container><q-page class="hd-q-clock">
    <div class="ck-face"><span class="ck-city">London GMT+0:00</span>
      <div class="ck-dial" role="img" aria-label="15:15"><span class="ck-day">FRI<b>06</b></span><span class="ck-sec" style="transform:rotate(-2deg)"></span>${hand(124, 6, 91)}${hand(113, 12, 97)}</div></div>
    ${alarmList}</q-page></q-page-container>`),
  // set alarm: a sheet, Cancel and Save on top, the time on two rings: minutes outside (dark knob), hours inside (light knob)
  phone(`<q-page-container><q-page class="hd-q-clock"><div class="ck-edit">
    <div class="ck-bar"><q-btn unelevated no-caps class="ck-btn bg-ck-grey" label="Cancel" /><q-btn unelevated no-caps class="ck-btn bg-ck-orange" label="Save" /></div>
    <div class="ck-title hd-sqh">Alarm title</div>
    <HdTimeDial v-model="t" :size="298" label="Alarm time" class="q-mt-sm" />
    <div class="ck-more">More options <q-icon :name="ic('chevron-right')" size="26px" /></div>
  </div></q-page></q-page-container>`)),
() => ({ t: ref('08:25'), alarms: ref([{ t: '8:00', label: 'Alarm', days: 'Mon, Tue, Wed, Thu, Fri', on: false }, { t: '11:08', label: 'Alarm', days: '', on: false }]) }),
{ name: 'Clock app' }, { HdSwitch, HdTimeDial });

/* ---- Feeds ---- */
export const FeedsApp = qs(CSS + phone(`${head('Feeds', ' <small>updated {{ updated }}</small>', '#FF8500')}
  ${footer(tool('refresh', 'Refresh') + tool('add', 'Add feed'), { back: false, menu: true })}
  <q-page-container><q-page><q-pull-to-refresh @refresh="refresh" :icon="ic('refresh')">
    <div class="hd-q-pull"><q-icon :name="ic('arrow-down')" size="16px" />Pull down to refresh</div>
    <q-list separator><q-item v-for="f in feeds" :key="f[1]" clickable><q-item-section avatar top><q-avatar color="orange" text-color="white" :icon="ic('globe')" /></q-item-section>
      <q-item-section><q-item-label class="hd-q-t">{{ f[0] }}</q-item-label><q-item-label lines="3" class="hd-q-body">{{ f[1] }}</q-item-label><q-item-label caption>{{ f[2] }}</q-item-label></q-item-section></q-item></q-list>
  </q-pull-to-refresh></q-page></q-page-container>`, ';margin:0 auto'),
() => {
  const updated = ref('12:18');
  return { updated, feeds: [['Brain Pickings', 'Ursula K. Le Guin on the meaning of life: we are the survivors of immense and minute events.', '12:18'], ['IEEE Spectrum', 'Why engineers should brave Capitol Hill', '11:51'], ['Design weekly', 'Why squircles feel softer than rounded rectangles', '10:53'], ['Hacker News', 'Show HN: a squircle calculator for the Etesian design language', '09:30']],
    refresh: (done: () => void) => setTimeout(() => { updated.value = 'now'; done(); }, 600) };
}, { name: 'Feeds reader' });

/* ---- Web admin dashboard ---- */
const orders = [
  { id: 1041, customer: 'Anna Virtanen', item: 'Pro1-X', total: 849, status: 'Shipped' },
  { id: 1042, customer: 'Mikko Laine', item: 'Squircle case', total: 29, status: 'Paid' },
  { id: 1043, customer: 'Sara Koski', item: 'Keyboard cover', total: 79, status: 'Pending' },
  { id: 1044, customer: 'Liisa Niemi', item: 'Pro1-X', total: 849, status: 'Paid' },
  { id: 1045, customer: 'Jussi Heikkinen', item: 'Charger', total: 19, status: 'Refunded' },
];
export const AdminDashboard = qs(CSS + `<div class="hd-q-app" style="max-width:980px;margin:0 auto;display:flex;flex-direction:column;gap:16px">
  <div class="row items-center no-wrap" style="gap:16px;border-bottom:1px solid var(--hd-c-divider)"><div class="hd-q-head" style="padding-left:0">Shop admin</div><q-space />
    <q-tabs v-model="tab" dense no-caps><q-tab name="overview" label="Overview" /><q-tab name="orders" label="Orders" /><q-tab name="customers" label="Customers" /></q-tabs></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">
    <q-card v-for="s in stats" :key="s[0]" flat bordered><q-card-section><div class="hd-q-sub">{{ s[0] }}</div><div class="hd-q-big">{{ s[1] }}</div><div class="hd-q-sub">{{ s[2] }} this week</div></q-card-section></q-card>
  </div>
  <q-table title="Recent orders" :rows="orders" :columns="cols" row-key="id" flat bordered hide-bottom :rows-per-page-options="[0]">
    <template #body-cell-actions="p"><q-td :props="p"><q-btn unelevated size="sm" label="Refund" @click="sel = p.row; dlg = true" /></q-td></template>
  </q-table>
  <q-dialog v-model="dlg"><q-card style="min-width:320px"><q-card-section><div class="hd-q-t" style="font-size:1.125rem">Refund order {{ sel && sel.id }}?</div><div class="hd-q-sub q-mt-sm">{{ sel && sel.customer }} will get {{ sel && sel.total }} € back.</div></q-card-section>
    <q-card-actions align="right"><q-btn unelevated label="Cancel" @click="dlg = false" /><q-btn unelevated color="negative" label="Refund" @click="dlg = false" /></q-card-actions></q-card></q-dialog>
</div>`, () => ({ tab: ref('overview'), dlg: ref(false), sel: ref(null), orders, stats: [['Revenue', '12 480 €', '+8%'], ['Orders', '342', '+12%'], ['Customers', '1 104', '+3%'], ['Refunds', '6', '-2']],
  cols: computed(() => [
    { name: 'id', label: 'Order', field: 'id', align: 'left', sortable: true }, { name: 'customer', label: 'Customer', field: 'customer', align: 'left', sortable: true },
    { name: 'item', label: 'Item', field: 'item', align: 'left' }, { name: 'total', label: 'Total', field: 'total', format: (v: number) => `${v} €`, sortable: true },
    { name: 'status', label: 'Status', field: 'status', align: 'left' }, { name: 'actions', label: '', field: 'id' }]) }), { name: 'Web: admin dashboard' });
