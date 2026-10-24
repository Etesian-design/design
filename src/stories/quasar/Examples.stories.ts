import type { Meta } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import { qs } from './q';
import HdTimePicker from '../../components/HdTimePicker.vue';
const meta: Meta = {
  title: 'Quasar/Examples',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Complete apps built from Quasar components with the Harmattan theme, following docs/20-phone.md: plain page headers with the title in large LIGHT type over a thin divider, pull-down search, the light HdToolBar look for QFooter (dark only where the N9 app is dark: Music, Gallery photo view), lit squircle Back, titles bold and body regular. Every example works in Hybrid, Dark and Light; see Examples/All colour modes.' } },
  },
};
export default meta;

/* ---- shared pieces ---- */
const phone = (inner: string, opts = '') => `<q-layout view="hHh lpR fFf" container class="hd-q-app" style="height:680px;width:360px;flex:none${opts}">${inner}</q-layout>`;
const head = (title: string, extra = '') => `<q-header class="hd-plain"><div class="hd-q-head">${title}${extra}</div></q-header>`;
const pull = `<div class="hd-q-pull"><q-icon :name="ic('arrow-down')" size="16px" />Pull down to search</div>`;
const back = `<q-btn flat class="hd-sq hd-q-back" :icon="ic('arrow-left')" aria-label="Back" />`;
const row = (...panels: string[]) => `<div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start">${panels.join('')}</div>`;
const tool = (icon: string, label: string) => `<q-btn flat round :icon="ic('${icon}')" aria-label="${label}" />`;
const more = `<q-btn flat round :icon="ic('more')" aria-label="App menu" />`;
const footer = (tools: string, opts: { dark?: boolean; menu?: boolean; back?: boolean } = {}) =>
  `<q-footer${opts.dark ? ' class="hd-dark"' : ''}><q-toolbar>${opts.back === false ? '<div style="width:52px"></div>' : back}<q-space /><div class="row no-wrap" style="gap:24px">${tools}</div><q-space /><div style="width:52px;display:flex;justify-content:flex-end">${opts.menu ? more : ''}</div></q-toolbar></q-footer>`;
const art = (a: string, b: string) => `background:linear-gradient(135deg,${a},${b})`;
const CSS = `<component is="style">
.hd-q-app .hd-q-rail { position:absolute; right:2px; top:8px; bottom:8px; display:flex; flex-direction:column; justify-content:space-between; font:700 10px/1 var(--hd-font-family-base); color:var(--hd-c-fg-secondary); z-index:2; }
.hd-q-app .hd-q-letter { position:sticky; top:0; z-index:1; padding:6px 16px 4px; background:var(--hd-c-bg); font:700 .8125rem/1 var(--hd-font-family-base); color:var(--hd-c-fg-secondary); display:flex; align-items:center; gap:10px; }
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
export const EmailApp = qs(CSS + phone(`${head('Inbox', ' <q-badge color="primary" :label="2" aria-label="2 unread" />')}
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
const people = ['Aino Mäkinen', 'Anna Virtanen', 'Antti Salo', 'Elina Koivisto', 'Heikki Lahti', 'Jussi Heikkinen', 'Kaisa Rinne', 'Liisa Niemi', 'Mikko Laine', 'Sara Koski', 'Timo Nurmi'];
const colours = ['primary', 'positive', 'orange', 'purple', 'teal', 'red', 'indigo'];
export const ContactsApp = qs(CSS + row(
  phone(`${head('Contacts', ' <small>{{ people.length }}</small>')}
  ${footer(tool('add', 'New contact') + tool('search', 'Search'), { back: false, menu: true })}
  <q-page-container><q-page style="position:relative">${pull}
    <nav class="hd-q-rail" aria-label="Fast scroll"><span v-for="l in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" :key="l">{{ l }}</span></nav>
    <template v-for="g in groups" :key="g[0]"><div class="hd-q-letter">{{ g[0] }}</div>
      <q-list><q-item v-for="(p, i) in g[1]" :key="p" clickable><q-item-section avatar><q-avatar :color="colours[(p.length + i) % colours.length]" text-color="white">{{ initials(p) }}</q-avatar></q-item-section><q-item-section><q-item-label class="hd-q-t">{{ p }}</q-item-label></q-item-section></q-item></q-list></template>
  </q-page></q-page-container>`),
  phone(`${footer(tool('edit', 'Edit') + tool('star', 'Favourite') + tool('share', 'Share'), { menu: true })}
  <q-page-container><q-page class="q-pa-md">
    <div class="column items-center q-pt-md" style="gap:12px">
      <div class="hd-q-sqart" style="width:148px;height:148px;${art('#7fb0d8', '#2a5b8a')};display:grid;place-items:center;color:#fff;font:300 56px/1 var(--hd-font-family-light)" role="img" aria-label="Photo of Anna Virtanen">AV</div>
      <div class="hd-q-big">Anna Virtanen</div><div class="hd-q-sub">Designer, Harmattan Oy</div>
      <div class="row" style="gap:12px"><q-btn unelevated color="positive" :icon="ic('phone')" label="Call" /><q-btn unelevated :icon="ic('message')" label="Message" /></div>
    </div>
    <q-list class="q-mt-md">
      <q-item-label header>Phone</q-item-label>
      <q-item clickable><q-item-section><q-item-label class="hd-q-t">+358 40 123 4567</q-item-label><q-item-label caption>Mobile</q-item-label></q-item-section><q-item-section side><q-icon :name="ic('message')" /></q-item-section></q-item>
      <q-item-label header>Email</q-item-label>
      <q-item clickable><q-item-section><q-item-label class="hd-q-t">anna@example.com</q-item-label><q-item-label caption>Work</q-item-label></q-item-section></q-item>
    </q-list>
  </q-page></q-page-container>`)),
() => ({ people, colours, initials, groups: Object.entries(people.reduce<Record<string, string[]>>((a, p) => ((a[p[0]] ??= []).push(p), a), {})) }), { name: 'Contacts app' });

/* ---- Messaging ---- */
const threads = [
  { who: 'Anna Virtanen', last: 'See you soon!', time: '12:31', n: 2, c: 'primary' },
  { who: 'Mikko Laine', last: 'The pop-up window is my favourite', time: '11:02', n: 0, c: 'positive' },
  { who: 'Sara Koski', last: 'Photo', time: 'Yesterday', n: 0, c: 'purple' },
  { who: 'Liisa Niemi', last: 'Thanks!', time: 'Mon', n: 0, c: 'orange' },
];
export const MessagingApp = qs(CSS + row(
  phone(`${head('Messages')}
  ${footer(tool('edit', 'New message') + tool('search', 'Search'), { back: false, menu: true })}
  <q-page-container><q-page>${pull}<q-list separator>
    <q-item v-for="t in threads" :key="t.who" clickable :class="{ 'hd-q-unread': t.n }"><q-item-section avatar><q-avatar :color="t.c" text-color="white">{{ initials(t.who) }}</q-avatar></q-item-section>
      <q-item-section><q-item-label class="hd-q-t hd-q-from">{{ t.who }}<span v-if="t.n" class="hd-q-sub"> ({{ t.n }})</span></q-item-label><q-item-label caption lines="1">{{ t.last }}</q-item-label></q-item-section>
      <q-item-section side top><q-item-label caption>{{ t.time }}</q-item-label></q-item-section></q-item>
  </q-list></q-page></q-page-container>`),
  phone(`${head('Anna Virtanen')}
  <q-footer><q-toolbar style="gap:8px;padding:8px">${back.replace('hd-q-back', 'hd-q-back hd-q-back--page')}<q-input v-model="draft" dense outlined class="col" placeholder="Write a message" aria-label="Message" /><q-btn unelevated color="primary" :icon="ic('message')" aria-label="Send" /></q-toolbar></q-footer>
  <q-page-container><q-page class="q-pa-md">
    <q-chat-message name="Anna" :text="['Are we still on for lunch?']" stamp="12:02" />
    <q-chat-message name="me" :text="['Yes! 12:30 at the usual place?']" stamp="12:05" sent />
    <q-chat-message name="Anna" :text="['Perfect. Bring the tablet mockups, I want to see the split view.']" stamp="12:20" />
    <q-chat-message name="me" :text="['Will do.']" stamp="12:21" sent />
    <q-chat-message name="Anna" :text="['See you soon!']" stamp="12:31" />
  </q-page></q-page-container>`)),
() => ({ threads, initials, draft: ref('') }), { name: 'Messaging app' });

/* ---- Music (dark, like the N9 app) ---- */
const songs = [['A Matterapat', 'Dr. Lonnie Smith', '6:46'], ['Call On Me', 'Colette', '6:16'], ['Colors', 'The Pass', '4:44'], ['Harmattan wind', 'The Swipes', '3:57'], ['Northern lights', 'The Swipes', '5:02'], ['Polar night', 'The Swipes', '3:18']];
export const MusicApp = qs(CSS + row(
  phone(`${footer(tool('star', 'Favourite') + tool('share', 'Share'), { dark: true, menu: true })}
  <q-page-container><q-page class="q-pa-md column items-center" style="gap:14px">
    <div class="hd-q-sqart q-mt-md" style="width:260px;height:260px;${art('#d38ab0', '#3b1d3e')}" role="img" aria-label="Album art: Harmattan wind"></div>
    <div class="text-center"><div class="hd-q-t" style="font-size:1.25rem">Harmattan wind</div><div class="hd-q-sub">The Swipes · Polar night</div></div>
    <div class="full-width"><q-slider v-model="pos" :min="0" :max="237" aria-label="Position" /><div class="row justify-between hd-q-sub"><span>{{ fmt(pos) }}</span><span>3:57</span></div></div>
    <div class="row items-center" style="gap:16px"><q-btn unelevated round :icon="ic('first')" aria-label="Previous" /><q-btn unelevated round size="lg" color="primary" :icon="ic('play')" aria-label="Play" /><q-btn unelevated round :icon="ic('last')" aria-label="Next" /></div>
  </q-page></q-page-container>`),
  phone(`${head('Songs')}
  ${footer('', { dark: true })}
  <q-page-container><q-page style="position:relative">${pull}
    <nav class="hd-q-rail" aria-label="Fast scroll"><span v-for="l in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" :key="l">{{ l }}</span></nav>
    <q-item clickable><q-item-section avatar><q-icon :name="ic('refresh')" /></q-item-section><q-item-section><q-item-label class="hd-q-t" style="font-size:1.125rem">Shuffle</q-item-label></q-item-section></q-item>
    <q-list separator><q-item v-for="s in songs" :key="s[0]" clickable :active="s[0] === 'Harmattan wind'"><q-item-section><q-item-label class="hd-q-t">{{ s[0] }}</q-item-label><q-item-label caption>{{ s[1] }}</q-item-label></q-item-section><q-item-section side style="padding-right:12px"><q-item-label caption>{{ s[2] }}</q-item-label></q-item-section></q-item></q-list>
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
() => ({ day: ref('2026/10/24'), events: [['Lunch with Anna', '12:30 – 13:30', '#09A7CC'], ['Design review', '14:00 – 15:00 · Room Harmattan', '#EF5500'], ['Gym', '18:00 – 19:00', '#62B700']], title: ref('Sauna evening'), where: ref('Lahti'), allDay: ref(false), start: ref('19:00'), remind: ref(true) }),
{ name: 'Calendar app' }, { HdTimePicker });

/* ---- Gallery ---- */
const tints = [['#f6b26b', '#8e3b1f'], ['#6fa8dc', '#1c3d63'], ['#93c47d', '#2c4d1f'], ['#c27ba0', '#4c1830'], ['#ffd966', '#7f6000'], ['#76a5af', '#1b3a40'], ['#e06666', '#5a1414'], ['#8e7cc3', '#2c2050'], ['#b6d7a8', '#38512d'], ['#f9cb9c', '#7a4214'], ['#a4c2f4', '#203a6b'], ['#d5a6bd', '#5c2a42']];
export const GalleryApp = qs(CSS + row(
  phone(`${head('Gallery', ' <small>{{ tints.length }} photos</small>')}
  ${footer(tool('photo', 'Albums') + tool('share', 'Share'), { back: false, menu: true })}
  <q-page-container><q-page class="q-pa-sm"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
    <div v-for="(t, i) in tints" :key="i" class="hd-q-sqart" role="img" :aria-label="'Photo ' + (i + 1)" style="aspect-ratio:1" :style="{ background: 'linear-gradient(135deg,' + t[0] + ',' + t[1] + ')' }"></div>
  </div></q-page></q-page-container>`),
  phone(`${footer(tool('share', 'Share') + tool('edit', 'Edit') + tool('delete', 'Delete'), { dark: true, menu: true })}
  <q-page-container><q-page style="background:#000 !important;display:grid;place-items:center"><div role="img" aria-label="Photo 2, full screen" style="width:100%;aspect-ratio:4/3;${art('#6fa8dc', '#1c3d63')}"></div></q-page></q-page-container>`)),
() => ({ tints }), { name: 'Gallery app' });

/* ---- Store ---- */
export const StoreApp = qs(CSS + phone(`${footer(tool('share', 'Share'), { menu: true })}
  <q-page-container><q-page class="q-pa-md column" style="gap:14px">
    <div class="row no-wrap items-center" style="gap:16px"><q-avatar size="72px" color="orange" text-color="white" :icon="ic('globe')" /><div class="col"><div class="hd-q-big" style="font-size:1.75rem">Feeds</div><div class="hd-q-sub">Harmattan Labs · News</div>
      <div class="row items-center" style="gap:6px"><q-rating :model-value="4.5" readonly size="18px" color="primary" :icon="ic('star')" aria-label="Rated 4.5 of 5" /><span class="hd-q-sub">4.5 (1 284)</span></div></div></div>
    <q-btn unelevated color="primary" label="Install" class="full-width" />
    <q-carousel v-model="slide" animated swipeable navigation arrows height="280px" style="border-radius:8px">
      <q-carousel-slide v-for="(t, i) in shots" :key="i" :name="i" :style="{ background: 'linear-gradient(160deg,' + t[0] + ',' + t[1] + ')' }" :aria-label="'Screenshot ' + (i + 1)" />
    </q-carousel>
    <div><div class="hd-q-t">About</div><p class="hd-q-sub q-mb-none">Read your favourite sites in the Events view. Pull down to refresh, swipe to the next story.</p></div>
  </q-page></q-page-container>`, ';height:760px;margin:0 auto'), () => ({ slide: ref(0), shots: [['#ff8500', '#3b1d00'], ['#09a7cc', '#06303b'], ['#821dde', '#250a40']] }), { name: 'Store app details' });

/* ---- Clock ---- */
export const ClockApp = qs(CSS + row(
  phone(`${footer(tool('clock', 'Clock') + tool('calendar', 'World clock'), { back: false, menu: true })}
  <q-page-container><q-page>
    <div class="column items-center q-py-lg" style="gap:4px"><div style="font:200 4rem/1 var(--hd-font-family-light)">12:45</div><div class="hd-q-sub">Saturday 24 October</div></div>
    <div class="hd-q-head" style="justify-content:space-between;align-items:center">Alarms <q-btn unelevated round size="sm" :icon="ic('add')" aria-label="New alarm" /></div>
    <q-list separator><q-item v-for="a in alarms" :key="a.t" tag="label"><q-item-section side><q-toggle v-model="a.on" :aria-label="'Alarm ' + a.t" /></q-item-section>
      <q-item-section><q-item-label style="font:300 1.75rem/1.1 var(--hd-font-family-light)">{{ a.t }}</q-item-label><q-item-label caption>{{ a.label }}</q-item-label></q-item-section><q-item-section side><q-icon :name="ic('chevron-right')" /></q-item-section></q-item></q-list>
  </q-page></q-page-container>`),
  phone(`${head('New alarm')}
  ${footer('')}
  <q-page-container><q-page class="q-pa-md column" style="gap:12px">
    <HdTimePicker v-model="t" title="Alarm time" hour24 />
    <q-input v-model="label" outlined label="Title" />
    <div class="hd-q-sub">Repeat</div>
    <q-btn-toggle v-model="rep" spread :options="[{label:'Once',value:'once'},{label:'Weekdays',value:'wd'},{label:'Daily',value:'day'}]" />
    <q-toggle v-model="snooze" label="Snooze 10 minutes" />
    <q-btn unelevated color="primary" label="Save" />
  </q-page></q-page-container>`, ';height:860px')),
() => ({ alarms: ref([{ t: '07:00', label: 'Weekdays', on: true }, { t: '08:30', label: 'Saturday · Gym', on: false }, { t: '11:08', label: 'Once', on: false }]), t: ref('06:45'), label: ref('Alarm'), rep: ref('wd'), snooze: ref(true) }),
{ name: 'Clock app' }, { HdTimePicker });

/* ---- Feeds ---- */
export const FeedsApp = qs(CSS + phone(`${head('Feeds', ' <small>updated {{ updated }}</small>')}
  ${footer(tool('refresh', 'Refresh') + tool('add', 'Add feed'), { back: false, menu: true })}
  <q-page-container><q-page><q-pull-to-refresh @refresh="refresh" :icon="ic('refresh')">
    <div class="hd-q-pull"><q-icon :name="ic('arrow-down')" size="16px" />Pull down to refresh</div>
    <q-list separator><q-item v-for="f in feeds" :key="f[1]" clickable><q-item-section avatar top><q-avatar color="orange" text-color="white" :icon="ic('globe')" /></q-item-section>
      <q-item-section><q-item-label class="hd-q-t">{{ f[0] }}</q-item-label><q-item-label lines="3" class="hd-q-body">{{ f[1] }}</q-item-label><q-item-label caption>{{ f[2] }}</q-item-label></q-item-section></q-item></q-list>
  </q-pull-to-refresh></q-page></q-page-container>`, ';margin:0 auto'),
() => {
  const updated = ref('12:18');
  return { updated, feeds: [['Brain Pickings', 'Ursula K. Le Guin on the meaning of life: we are the survivors of immense and minute events.', '12:18'], ['IEEE Spectrum', 'Why engineers should brave Capitol Hill', '11:51'], ['Design weekly', 'Why squircles feel softer than rounded rectangles', '10:53'], ['Hacker News', 'Show HN: a squircle calculator for the Harmattan design language', '09:30']],
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
