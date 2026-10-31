<script setup lang="ts">
/**
 * Phone v2: the Android 16 gap proposals (vendor/etesian/docs/android-feature-gap.md) as N9 phone mocks, 360 × 640,
 * app window top corners 7px. Mockups only, not library API. Faithful first: the status menu is the real N9 one
 * (screenshots/review/n9-status-menu.png: drawn on black over the dimmed app grid, Profile segmented bar, flat magenta
 * Volume bar, rows of lit squircle tile + bold title + grey state, no switch widgets); sheets are the N9 toolbar menu;
 * dialogs are N9 query / selection dialogs; lock music as n9-lock-music.png. Every non-N9 addition names its switch in
 * Etesian settings → Android extras (state "extras").
 */
import { ref, computed } from 'vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdSquircle from '../../../components/HdSquircle.vue';
import HdSwitch from '../../../components/HdSwitch.vue';
import HdButton from '../../../components/HdButton.vue';
import HdToolBar from '../../../components/HdToolBar.vue';
import HdToolIcon from '../../../components/HdToolIcon.vue';
import HdEventsHeader from '../../../components/HdEventsHeader.vue';
import HdSectionHeader from '../../../components/HdSectionHeader.vue';
import HdEventsFeedItem from '../../../components/HdEventsFeedItem.vue';
import HdLockScreenNotificationCard from '../../../components/HdLockScreenNotificationCard.vue';
import '../../../components/HdNotificationBanner.vue';
import HdSearchField from '../../../components/HdSearchField.vue';
import BelleWidget from '../../belle/BelleWidget.vue';
import N9Keyboard from '../../parts/N9Keyboard.vue';
import HdTaskEditBar from '../../../components/HdTaskEditBar.vue';
import { STATES, CORE, SMALL, type P2State } from './states';
const props = defineProps<{ state: P2State }>();
const info = computed(() => STATES[props.state]);
const is = (...s: string[]) => s.includes(props.state);
/* inline reply family; hw = Pro1-X hardware keyboard out (no on-screen keys, only the white strip); land = landscape 640 × 360 */
const reply = computed(() => is('events-reply', 'events-reply-hw', 'events-reply-hw-land', 'dictionary-tracker', 'dictionary-list', 'dictionary-hwkb'));
const hw = computed(() => is('events-reply-hw', 'events-reply-hw-land', 'dictionary-hwkb'));
const land = computed(() => is('events-reply-hw-land', 'dictionary-hwkb'));
const dict = computed(() => is('dictionary-tracker', 'dictionary-list', 'dictionary-hwkb'));
const G = { prev: 'M6 6h2v12H6zm3.5 6 8.5 6V6z', next: 'M16 6h2v12h-2zM6 18l8.5-6L6 6z', pause: 'M6 5h4v14H6zm8 0h4v14h-4z' };
type Row = [icon: string, title: string, state: string, on: boolean];
/* the N9 rows: network name / Bluetooth / Transfers */
const base: Row[] = [['wifi', 'HomeNet', 'Connected', true], ['bluetooth', 'Bluetooth', 'Off', false]];
const rows: Row[] = [...base, ['info', 'Transfers', '2 failed transfers', true], ['phone', 'Mobile network', 'Operator · 4G', true], ['battery', 'Battery', '78% · saver off', true], ['hotspot', 'Hotspot', 'Off', false]];
/* customised states (pure N9 = no strip, all rows): strip placement, 3 visible rows + handle / swipe */
const custom = computed(() => is('status-more', 'status-ring-low', 'status-brightness', 'status-more-open', 'status-two-rows', 'status-no-strip'));
const pos = computed(() => (is('status-more', 'status-ring-low', 'status-brightness', 'status-two-rows') ? 'volume' : is('status-more-open') ? 'profile' : is('status-edit') ? 'rows' : ''));
const shown = computed(() => (is('status-more', 'status-ring-low', 'status-brightness', 'status-two-rows', 'status-no-strip') ? rows.slice(0, is('status-brightness') ? 2 : 3) : rows));
/* added sliders: flat N9 bars like Volume; [fill, value]. Brightness = N9 Settings blue, Media = Volume magenta, Alarm = Clock orange */
const sliders: Record<string, [string, number]> = { Volume: ['#C800B4', 66], Brightness: ['#2A86D8', 55], 'Media volume': ['#C800B4', 70], 'Alarm volume': ['#F77219', 85] };
import { SQUIRCLE_PATH_100 as SQ } from '../../../squircle';
const blocks = ['Profile', 'Brightness', 'Volume', 'Toggles', 'HomeNet', 'Bluetooth', 'Transfers'];
const extraToggles: [string, string, boolean][] = [['moon', 'Do Not Disturb', false], ['hotspot', 'Hotspot', false], ['battery', 'Battery saver', false], ['lock', 'VPN switch', true]];
const strip = computed(() => (is('status-two-rows') ? [...toggles.value, ...extraToggles] : toggles.value));
const toggles = ref<[string, string, boolean][]>([['flight', 'Flight mode', false], ['torch', 'Flashlight', false], ['restart', 'Auto-rotate', true], ['location', 'Location', true], ['data', 'Mobile data', true], ['record', 'Screen recorder', false]]);
const ringer = ref(2); // Silent | Beep | Ringing
const ringVol = computed(() => (is('status-ring-low') ? 25 : 60)); // the Ringing segment IS the ringer volume slider: its blue fill runs into the grey remainder in proportion to ring volume
const mode = ref(1); // Off | Do Not Disturb | Sleeping | Driving
// share targets: generic apps, solid brand colours (lit squircles); [name, icon, colour]
const TARGETS: [string, string, string][] = [['Messages', 'message', '#09A7CC'], ['Mail', 'mail', '#1F7FD8'], ['Bluetooth', 'bluetooth', '#2A86D8'], ['Nearby', 'wifi', '#3BA55C'], ['Notes', 'edit', '#E8B800'], ['Files', 'folder', '#E07B00'],
  ['Cloud drive', 'globe', '#2E9BD6'], ['Chat', 'message', '#6CB33F'], ['Social', 'person', '#3B5FA8'], ['Calendar', 'calendar', '#D2161E'], ['Gallery album', 'photo', '#821DDE'], ['Print', 'list', '#5A5A5E'], ['Copy to clipboard', 'attach', '#5A5A5E'], ['Set as wallpaper', 'home', '#0067BC']];
const PINNED = ['Messages', 'Cloud drive'];
const shareQ = ref('');
const shareList = computed(() => { const q = (is('share-filter') ? 'n' : shareQ.value).toLowerCase(); return TARGETS.filter((t) => (q ? t[0].toLowerCase().split(/\s+/).some((w) => w.startsWith(q)) : !PINNED.includes(t[0]))); });
const extrasOn = ref<Record<string, boolean>>({});
const extras = computed(() => [...new Set([...CORE, ...SMALL].map((s) => STATES[s].extra).filter(Boolean) as string[])]);
const statusGlyphs = computed(() => [...(is('profiles') ? ['moon'] : []), ...(is('privacy') ? ['camera-dot'] : []), ...(is('recording') ? ['rec-dot'] : [])]);
const art = 'linear-gradient(135deg,#d24b6a,#3b1d5a)';
const photo = (a: string, b: string) => `linear-gradient(135deg,${a},${b})`;
const apps: [string, string, string][] = [['Phone', 'phone', '#62B700'], ['Messages', 'message', '#09A7CC'], ['Mail', 'mail', '#0067BC'], ['Music', 'music', '#CC09BA'],
  ['Calendar', 'calendar', '#EF5500'], ['Gallery', 'photo', '#821DDE'], ['Clock', 'clock', '#F77219'], ['Settings', 'settings', '#4A4A4A']];
</script>
<template>
  <div class="p2 hd-theme-dark" :class="{ 'p2--land': land }" :data-state="state">
    <!-- status bar: square, full width -->
    <span class="p2-tags" :class="{ 'p2-tags--banner': is('banner') }"><span v-if="info.proposal" class="p2__proposal">Proposal · unverified (?)</span><span v-if="info.extra" class="p2-extra" :title="info.extra">Optional · Android extras</span></span>
    <div class="p2-sb" :class="{ 'p2-sb--clear': is('lock-music', 'lock-glance', 'medical', 'medical-bar', 'medical-card', 'medical-a1', 'medical-a2', 'medical-a3') }">
      <HdIcon name="battery" :size="15" /><span class="p2-sb__sig"><i v-for="i in 4" :key="i" :style="{ height: `${3 + i * 2}px` }" /></span><HdIcon name="wifi" :size="13" />
      <template v-for="g in statusGlyphs" :key="g">
        <span v-if="g === 'camera-dot'" class="p2-sb__priv hd-sq" title="Camera in use"><HdIcon name="camera" :size="10" /></span>
        <span v-else-if="g === 'rec-dot'" class="p2-sb__rec" title="Recording, tap to stop" />
        <HdIcon v-else :name="g" :size="13" />
      </template>
      <span class="p2-sb__sp" /><span class="p2-sb__t">14:20</span>
    </div>
    <div v-if="is('banner')" class="p2-banner"><HdLockScreenNotificationCard message="Are we still on for lunch?" source="Anna Virtanen" time="14:12" icon="message" accent="#09A7CC" /></div>

    <div class="p2__app">
      <!-- ================= status menu (n9-status-menu.png) ================= -->
      <template v-if="is('status-edit', 'status-edit-empty')">
        <div class="p2-sm p2-sm--edit" role="dialog" aria-label="Arrange the status menu">
          <div v-for="b in blocks" :key="b" class="p2-blk" :class="{ 'p2-blk--drag': b === 'Brightness' }">
            <HdIcon name="drag" :size="20" class="p2-handle" aria-label="Drag to reorder" />
            <div class="p2-blk__body">
              <template v-if="b === 'Profile'"><div class="p2-sm__label">Profile</div><div class="p2-seg" role="group" aria-label="Profile"><span v-for="(n, i) in ['Silent', 'Beep']" :key="n" :class="{ sel: i === ringer }" @click="ringer = i">{{ n }}</span><span class="p2-seg__ring" :class="{ sel: ringer === 2 }" role="slider" aria-label="Ringing volume" :aria-valuenow="ringVol" aria-valuemin="0" aria-valuemax="100" :style="{ '--ring': ringVol + '%' }" @click="ringer = 2">Ringing</span></div></template>
              <template v-else-if="sliders[b]"><div class="p2-sm__label">{{ b }}</div><div class="p2-fill"><i :style="{ width: sliders[b][1] + '%', background: sliders[b][0] }" /></div></template>
              <div v-else-if="b === 'Toggles' && is('status-edit-empty')" class="p2-tg-empty" role="note"><svg v-for="i in 6" :key="i" viewBox="0 0 100 100" width="34" height="34" aria-hidden="true"><path :d="SQ" fill="none" stroke="#5A5A5E" stroke-width="3" stroke-dasharray="8 7" /></svg><span>No toggles — tap ✎ to add</span></div>
              <div v-else-if="b === 'Toggles'" class="p2-tgblk"><div class="p2-tg"><span v-for="t in toggles" :key="t[1]" class="p2-tg__t"><HdSquircle :size="34" :color="t[2] ? '#1C6BC8' : '#3A3A3A'" lighting="lit"><HdIcon :name="t[0]" :size="18" lit /></HdSquircle></span></div></div>
              <div v-else class="p2-row p2-row--mini"><HdSquircle :size="34" :color="b === 'Transfers' ? '#F4F4F4' : '#3A3A3A'" lighting="lit"><b v-if="b === 'Transfers'" class="p2-bang">!</b><HdIcon v-else :name="b === 'HomeNet' ? 'wifi' : 'bluetooth'" :size="20" lit /></HdSquircle><span><b>{{ b }}</b></span></div>
            </div>
            <HdSquircle v-if="b === 'Toggles'" :size="26" class="p2-x p2-pen" color="linear-gradient(#FFFFFF, #ECECEE 50%, #CFCFD3)" role="button" aria-label="Edit toggles"><svg class="p2-x__g" viewBox="0 0 30 30" width="26" height="26" aria-hidden="true"><path d="M9 21l1.2-4.6L18.6 8l3.4 3.4-8.4 8.4z" fill="#2A2A2C" /><path d="M9 21l4.6-1.2" stroke="#2A2A2C" stroke-width="2" stroke-linecap="round" /></svg></HdSquircle>
            <HdSquircle v-else :size="26" class="p2-x" color="linear-gradient(#F78673, #EF2C10)" role="button" :aria-label="'Remove ' + b"><svg class="p2-x__g" viewBox="0 0 30 30" width="26" height="26" aria-hidden="true"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle>
          </div>
          <div class="p2-sm__label">Add</div>
          <div v-for="a in [['Media volume', 'slider'], ['Alarm volume', 'slider'], ['Mode strip', 'strip'], ['Battery', 'row']]" :key="a[0]" class="p2-add"><span class="p2-add__plus hd-sq"><HdIcon name="add" :size="14" /></span><b>{{ a[0] }}</b><small>{{ a[1] }}</small></div>
        </div>
        <HdTaskEditBar class="p2-bottom" done-label="Done" close-all-label="Add item" />
      </template>
       <template v-else-if="is('status-more', 'status-ring-low', 'status-brightness', 'status-more-open', 'status-two-rows', 'status-no-strip', 'status-music', 'status-music-output', 'privacy', 'profiles', 'volume-row', 'recording')">
        <div class="p2-dimmed" aria-hidden="true"><span v-for="(a, i) in [...apps, ...apps]" :key="a[0] + i" class="p2-grid__i"><HdSquircle :size="54" :color="a[2]" lighting="lit"><HdIcon :name="a[1]" :size="28" lit /></HdSquircle><small>{{ a[0] }}</small></span></div>
        <div class="p2-sm" :class="{ 'p2-sm--pull': is('status-more-open') }" role="dialog" aria-label="Status menu">
          <div class="p2-sm__label">Profile</div>
          <div class="p2-seg" role="group" aria-label="Profile"><span v-for="(n, i) in ['Silent', 'Beep']" :key="n" :class="{ sel: i === ringer }" @click="ringer = i">{{ n }}</span><span class="p2-seg__ring" :class="{ sel: ringer === 2 }" role="slider" aria-label="Ringing volume" :aria-valuenow="ringVol" aria-valuemin="0" aria-valuemax="100" :style="{ '--ring': ringVol + '%' }" @click="ringer = 2">Ringing</span></div>
          <div v-if="pos === 'profile'" class="p2-tg" :class="{ 'p2-tg--edit': is('status-edit') }" role="group" aria-label="Toggles"><span v-for="(t, i) in strip" :key="t[1]" class="p2-tg__t" :class="{ on: t[2] }" role="switch" :aria-checked="!!t[2]" :aria-label="t[1]" @click="t[2] = !t[2]"><HdSquircle :size="26" class="p2-x" color="linear-gradient(#F78673, #EF2C10)" v-if="is('status-edit')"><svg class="p2-x__g" viewBox="0 0 30 30" width="26" height="26" aria-hidden="true"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle><HdSquircle :size="44" :color="t[2] ? '#1C6BC8' : '#3A3A3A'" lighting="lit"><HdIcon :name="t[0]" :size="24" lit /></HdSquircle></span></div>
          <template v-if="is('profiles')"><div class="p2-sm__label">Mode</div>
            <div class="p2-seg p2-seg--4"><span v-for="(n, i) in ['Off', 'Do Not Disturb', 'Sleeping', 'Driving']" :key="n" :class="{ sel: i === mode }" @click="mode = i">{{ n }}</span></div></template>
          <div class="p2-sm__label">{{ is('volume-row') ? 'Media' : 'Volume' }}</div><div class="p2-fill"><i style="width:66%" /></div>
          <template v-if="is('status-brightness')"><div class="p2-sm__label">Brightness</div><div class="p2-fill" role="slider" aria-label="Brightness" aria-valuenow="55"><i style="width:55%;background:#2A86D8" /></div></template>
          <template v-if="is('volume-row')"><template v-for="v in [['Alarm', 85], ['Call', 50]]" :key="v[0]"><div class="p2-sm__label">{{ v[0] }}</div><div class="p2-fill"><i :style="{ width: v[1] + '%' }" /></div></template></template>
          <div v-if="pos === 'volume'" class="p2-tg" :class="{ 'p2-tg--edit': is('status-edit') }" role="group" aria-label="Toggles"><span v-for="(t, i) in strip" :key="t[1]" class="p2-tg__t" :class="{ on: t[2] }" role="switch" :aria-checked="!!t[2]" :aria-label="t[1]" @click="t[2] = !t[2]"><HdSquircle :size="26" class="p2-x" color="linear-gradient(#F78673, #EF2C10)" v-if="is('status-edit')"><svg class="p2-x__g" viewBox="0 0 30 30" width="26" height="26" aria-hidden="true"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle><HdSquircle :size="44" :color="t[2] ? '#1C6BC8' : '#3A3A3A'" lighting="lit"><HdIcon :name="t[0]" :size="24" lit /></HdSquircle></span></div>
          <div class="p2-sm__rows" :class="{ 'p2-sm__rows--pull': is('status-more-open') }">
            <div v-if="is('privacy')" class="p2-row"><HdSquircle :size="46" color="#2E9E44" lighting="lit"><HdIcon name="camera" :size="26" lit /></HdSquircle><span><b>Camera in use</b><small>Scanner · tap to stop</small></span></div>
            <div v-if="is('recording')" class="p2-row"><HdSquircle :size="46" color="#C7302A" lighting="lit"><HdIcon name="record" :size="26" lit /></HdSquircle><span><b>Recording the screen</b><small>01:24 · tap to stop</small></span></div>
            
            <div v-if="is('status-music', 'status-music-output')" class="p2-mu-large" aria-label="Now playing"><BelleWidget kind="music" :cell="88" art="linear-gradient(135deg,#d24b6a,#3b1d5a)" title="Polar night · The Swipes" out="Headset" on /></div>
            <div v-for="(r, i) in shown" :key="r[1]" class="p2-row" :class="{ off: !r[3], 'p2-row--pulled': is('status-more-open') && i >= 3 }"><HdSquircle :size="46" :color="r[1] === 'Transfers' ? '#F4F4F4' : '#3A3A3A'" lighting="lit"><b v-if="r[1] === 'Transfers'" class="p2-bang">!</b><HdIcon v-else :name="r[0]" :size="26" lit /></HdSquircle><span><b>{{ r[1] }}</b><small>{{ r[2] }}</small></span></div>
          </div>
          <button v-if="custom" type="button" class="p2-handle-line" :aria-label="is('status-more-open') ? 'Hide rows' : `Show ${rows.length - shown.length} more rows`" :aria-expanded="is('status-more-open')"><i /><HdIcon name="chevron-down" :size="16" :style="{ transform: is('status-more-open') ? 'rotate(180deg)' : '' }" /><i /></button>
          <div v-if="pos === 'rows'" class="p2-tg" :class="{ 'p2-tg--edit': is('status-edit') }" role="group" aria-label="Toggles"><span v-for="(t, i) in strip" :key="t[1]" class="p2-tg__t" :class="{ on: t[2] }" role="switch" :aria-checked="!!t[2]" :aria-label="t[1]" @click="t[2] = !t[2]"><HdSquircle :size="26" class="p2-x" color="linear-gradient(#F78673, #EF2C10)" v-if="is('status-edit')"><svg class="p2-x__g" viewBox="0 0 30 30" width="26" height="26" aria-hidden="true"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle><HdSquircle :size="44" :color="t[2] ? '#1C6BC8' : '#3A3A3A'" lighting="lit"><HdIcon :name="t[0]" :size="24" lit /></HdSquircle></span></div>
          <div v-if="is('status-edit')" class="p2-sm__label">Available</div>
          <div v-if="is('status-edit')" class="p2-tg p2-tg--avail"><span v-for="t in ['qr', 'cast', 'moon', 'lock']" :key="t" class="p2-tg__t"><HdSquircle :size="44" color="#3A3A3A" lighting="lit"><HdIcon :name="t" :size="24" lit /></HdSquircle></span></div>
        </div>
        <HdTaskEditBar v-if="is('status-edit')" class="p2-bottom" done-label="Done" close-all-label="Add toggle" />
        <div v-if="is('status-music-output')" class="p2-sel" role="dialog" aria-label="Play on"><h3>Play on</h3>
          <div v-for="o in [['speaker', 'This phone'], ['headset', 'Headset'], ['cast', 'Living room speaker']]" :key="o[1]" class="p2-sel__r" :class="{ on: o[1] === 'Headset' }"><HdIcon :name="o[0]" :size="22" />{{ o[1] }}</div></div>
      </template>

      <!-- ================= Events ================= -->
      <template v-else-if="is('events-sheet', 'events-reply', 'events-reply-hw', 'events-reply-hw-land', 'dictionary-tracker', 'dictionary-list', 'dictionary-hwkb', 'history-ghost', 'priority', 'screen-time', 'live-update')">
        <div class="p2-ev">
          <HdEventsHeader day="Monday" date="26 October" city="Athens" temperature="16°C" weather="rain" />
          <template v-if="is('screen-time')"><HdSectionHeader title="Today" align="start" large />
            <div v-for="t in [['clock', '#3A3A3A', '2 h 14 min screen time · Messages 1 h 4 min'], ['star', '#C2185B', 'Mikko Laine’s birthday'], ['calendar', '#EF5500', '14:00 Design review']]" :key="t[2]" class="p2-today"><HdSquircle :size="22" :color="t[1]" lighting="lit"><HdIcon :name="t[0]" :size="13" lit /></HdSquircle><span>{{ t[2] }}</span></div></template>
          <HdSectionHeader title="Notifications" align="start" large><template #action><HdButton variant="default" class="hd-events-btn">Clear</HdButton></template></HdSectionHeader>
          <HdEventsFeedItem v-if="is('live-update')" class="p2-live" title="Timer" body="04:12 left" time="Ongoing" icon="clock" accent="#F77219"><i class="p2-prog" role="progressbar" aria-label="Timer progress" aria-valuenow="62"><i style="width:62%" /></i></HdEventsFeedItem>
          <div v-if="is('priority')" class="p2-row p2-row--ev p2-pri"><HdSquircle :size="48" :color="photo('#7fb0d8', '#2a5b8a')"><b style="color:#fff">AV</b></HdSquircle><span class="p2-pri__txt"><b>Anna Virtanen <HdIcon name="star" :size="12" style="color:#F2B111" /></b>
            <small v-for="m in [['message', '#09A7CC', 'Are we still on for lunch?', '2 min'], ['mail', '#0067BC', 'Trip to Lapland: tickets attached', '20 min'], ['phone', '#3F9C35', 'Missed call', '1 h']]" :key="m[2]" class="p2-pri__l"><HdSquircle :size="16" :color="m[1]" lighting="lit"><HdIcon :name="m[0]" :size="10" lit /></HdSquircle><span>{{ m[2] }}</span><em>{{ m[3] }}</em></small></span></div>
          <div :class="{ 'p2-pressed': is('events-sheet') }"><HdEventsFeedItem title="Mikko Laine" body="Band practice moved to Thursday?" time="2 min" icon="message" accent="#09A7CC" /></div>
          <HdEventsFeedItem title="Design weekly" body="Why squircles feel softer" time="1 h" icon="mail" accent="#0067BC" />
          <HdEventsFeedItem title="Calendar" body="Design review 14:00" time="in 2 h" icon="calendar" accent="#EF5500" />
          <template v-if="is('history-ghost')"><div v-for="t in [['message', '#09A7CC', 'Sara Koski: Photos from Saturday', '09:12'], ['mail', '#0067BC', 'Store: your receipt', '08:40']]" :key="t[2]" class="p2-today p2-ghost"><HdSquircle :size="22" :color="t[1]" lighting="lit"><HdIcon :name="t[0]" :size="13" lit /></HdSquircle><span class="p2-ghost__t">{{ t[2] }}</span><em>{{ t[3] }}</em></div></template>
          <HdSectionHeader title="Feed" align="start" large><template #action><HdButton variant="default" class="hd-events-btn">Refresh</HdButton></template></HdSectionHeader>
            <HdEventsFeedItem title="Tech news: Front page" body="Show HN: a squircle calculator for the Etesian design language" time="01:23" icon="globe" accent="#FF8500" />
        </div>
        <div v-if="is('events-sheet')" class="p2-menu" role="dialog" aria-label="Notification actions"><div class="p2-menu__card">
          <div v-for="a in ['Reply', 'Mark as read', 'Snooze', 'Dismiss']" :key="a" class="p2-menu__r">{{ a }}<small v-if="a === 'Snooze'">15 minutes, 1 hour or tomorrow</small></div></div></div>
        <div v-if="reply" class="p2-reply"><div class="p2-reply__q"><b>Mikko Laine</b> · Band practice moved to Thursday?</div>
          <div class="p2-reply__f"><HdSquircle :size="22" color="#09A7CC" lighting="lit"><HdIcon name="message" :size="13" lit /></HdSquircle>
            <span v-if="dict" class="p2-field">Running 5 min <span class="p2-wordwrap"><u class="p2-cur">lste</u><span v-if="is('dictionary-tracker')" class="p2-wt" role="button" aria-label="Correction: late">late</span></span></span>
            <span v-else class="p2-field"><u>Running 5 min late</u></span></div>
          <div class="p2-kstrip" aria-label="Keyboard strip"><HdSquircle :size="28" color="#F4F4F5" lighting="lit" tone="light"><HdIcon name="smile" :size="18" style="color:#222" /></HdSquircle>
            <span v-if="is('dictionary-hwkb')" class="p2-sugg" aria-label="Suggestions (proposal)"><b>late</b><span>list</span><span>lose</span></span>
            <span class="p2-kstrip__sp" /><span class="p2-count">137<small>(1)</small></span><button type="button" class="p2-send">Send</button></div>
          <N9Keyboard v-if="!hw" /></div>
        <div v-if="is('dictionary-list')" class="p2-sel p2-wl" role="dialog" aria-label="Candidates"><div v-for="(c, i) in ['late', 'list', 'lose', 'lste']" :key="c" class="p2-wl__r" :class="{ on: i === 0 }">{{ c }}</div></div>
      </template>

      <!-- ================= lock screen (n9-lock-music.png) ================= -->
      <template v-else-if="is('lock-music', 'lock-glance', 'medical', 'medical-bar', 'medical-card', 'medical-a1', 'medical-a2', 'medical-a3')">
        <div class="p2-lock">
          <template v-if="is('lock-music')"><div class="p2-lock__song">Polar night</div><div class="p2-lock__artist">The Swipes</div>
            <div class="p2-lock__ctl"><svg v-for="g in [G.prev, G.pause, G.next]" :key="g" viewBox="0 0 24 24" width="26" height="26"><path :d="g" fill="currentColor" /></svg></div></template>
          <template v-else><div class="p2-lock__top">
            <!-- A1: a red lit squircle with the cross, label under it -->
            <button v-if="is('medical-a1')" type="button" class="p2-ma p2-ma--sq" aria-label="Emergency information"><HdSquircle :size="44" color="#C9201B" lighting="lit"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z" fill="#fff" /></svg></HdSquircle><small>Emergency</small></button>
            <!-- A2: the owner's essentials in small type, a red rule on the left -->
            <button v-if="is('medical-a2')" type="button" class="p2-ma p2-ma--card" aria-label="Emergency information"><b><svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z" fill="#E8463F" /></svg> Anna Virtanen</b><span>Blood A+ · Penicillin</span><span class="p2-ma__more">Emergency info ›</span></button>
            <!-- A3: the Star of Life, quiet white, no label until pressed -->
            <button v-if="is('medical-a3')" type="button" class="p2-ma p2-ma--star" aria-label="Emergency information"><svg viewBox="-12 -12 24 24" width="40" height="40" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"><rect v-for="r in [0, 60, 120]" :key="r" x="-2.6" y="-11" width="5.2" height="22" :transform="`rotate(${r})`" /></g><path d="M0 -7v14M-1.6 -5c3 1 3 2 0 3s-3 2 0 3 3 2 0 3" stroke="#fff" stroke-width="1" fill="none" /></svg><small>Emergency</small></button>
            <div class="p2-lock__clock">14:20</div></div><div class="p2-lock__date">Monday, 26 October 2026</div>
            <div v-if="is('lock-glance')" class="p2-lock__glance">Alarm 07:00 · Design review 14:00</div>
            <!-- A: a small medical mark at the end of the date block, always in the same place -->
            <button v-if="is('medical')" type="button" class="p2-med" aria-label="Emergency information"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z" fill="#fff" /></svg>Emergency info</button></template>
          <div class="p2-lock__cards">
            <HdLockScreenNotificationCard message="Running 10 minutes late, sorry!" source="Mikko Laine" time="26/10/2026 | 14:12" icon="message" accent="#09A7CC" />
            <HdLockScreenNotificationCard message="Missed call" source="Anna Virtanen" time="26/10/2026 | 13:58" icon="phone" accent="#62B700" />
          </div>
          <!-- B: an owner line on the bottom edge, below the cards: not a card, not a button -->
          <button v-if="is('medical-bar')" type="button" class="p2-medbar" aria-label="Emergency information"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z" fill="#fff" /></svg><span>Emergency info · Anna Virtanen</span><HdIcon name="chevron-right" :size="14" /></button>
          <!-- what both open: a full-screen card over the lock screen; dialling lives here, not on the lock screen -->
          <div v-if="is('medical-card')" class="p2-medcard" role="dialog" aria-label="Emergency information">
            <div class="p2-medcard__h"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z" fill="#fff" /></svg>Emergency information</div>
            <div class="p2-medcard__name">Anna Virtanen</div>
            <dl><template v-for="r in [['Blood type', 'A+'], ['Allergies', 'Penicillin'], ['Medication', 'None'], ['Notes', 'Asthma, inhaler in the bag'], ['Organ donor', 'Yes']]" :key="r[0]"><dt>{{ r[0] }}</dt><dd>{{ r[1] }}</dd></template></dl>
            <div class="p2-medcard__sec">Emergency contacts</div>
            <div v-for="c in [['Mikko Laine', 'Partner'], ['Sara Koski', 'Sister']]" :key="c[0]" class="p2-medcard__c"><span><b>{{ c[0] }}</b><small>{{ c[1] }}</small></span><HdIcon name="phone" :size="20" /></div>
            <div class="p2-medcard__act"><HdButton variant="negative">Emergency call</HdButton><HdButton variant="dark">Close</HdButton></div>
          </div>
        </div>
      </template>

      <!-- ================= Etesian settings → Android extras ================= -->
      <template v-else-if="is('extras')">
        <div class="p2-ev hd-theme-dark"><div class="p2-plain">Android extras</div>
          <p class="p2-note">Things the N9 did not have. All off = the pure N9.</p>
          <div v-for="e in extras" :key="e" class="p2-set"><span>{{ e }}</span><HdSwitch v-model="extrasOn[e]" :aria-label="e" /></div></div>
        <HdToolBar variant="dark" back label="Settings toolbar" />
      </template>

      <!-- ================= toggles editor ================= -->
      <template v-else-if="is('toggles-editor')">
        <div class="p2-ev hd-theme-dark"><div class="p2-plain">Toggles</div>
          <div v-for="t in toggles" :key="t[1]" class="p2-set p2-set--tile"><HdIcon name="drag" :size="20" class="p2-handle" aria-label="Drag to reorder" /><HdSquircle :size="36" color="#3A3A3A" lighting="lit"><HdIcon :name="t[0]" :size="20" lit /></HdSquircle><b>{{ t[1] }}</b>
            <HdSquircle :size="26" class="p2-x" color="linear-gradient(#F78673, #EF2C10)" role="button" :aria-label="'Remove ' + t[1]"><svg class="p2-x__g" viewBox="0 0 30 30" width="26" height="26" aria-hidden="true"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle></div>
          <div class="p2-sec">Available</div>
          <div v-for="t in extraToggles" :key="t[1]" class="p2-set p2-set--tile p2-set--avail"><span class="p2-add__plus hd-sq"><HdIcon name="add" :size="14" /></span><HdSquircle :size="36" color="#3A3A3A" lighting="lit"><HdIcon :name="t[0]" :size="20" lit /></HdSquircle><b>{{ t[1] }}<small v-if="t[1] === 'VPN switch'"> · from an app</small></b></div></div>
        <HdTaskEditBar class="p2-bottom" done-label="Done" close-all-label="Reset" />
      </template>

      <!-- ================= Etesian settings → Status menu ================= -->
      <template v-else-if="is('status-settings')">
        <div class="p2-ev hd-theme-dark"><div class="p2-plain">Status menu</div>
          <div class="p2-set"><span>Toggle strip<small>N9 default: off</small></span><HdSwitch :model-value="true" aria-label="Toggle strip" /></div>
          <div class="p2-sec">Sliders</div>
          <div v-for="(sl, i) in ['Volume', 'Brightness']" :key="sl" class="p2-set"><HdIcon name="drag" :size="20" class="p2-handle" aria-label="Drag to reorder" /><span class="p2-sw-fill" :style="{ background: sliders[sl][0] }" />{{ sl }}<small v-if="i === 0">N9 default</small><HdSquircle v-if="i > 0" :size="26" class="p2-x" color="linear-gradient(#F78673, #EF2C10)" role="button" :aria-label="'Remove ' + sl"><svg class="p2-x__g" viewBox="0 0 30 30" width="26" height="26" aria-hidden="true"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle></div>
          <div class="p2-set p2-set--add"><span class="p2-add__plus hd-sq"><HdIcon name="add" :size="14" /></span>Add slider<small>Media volume · Alarm volume</small></div>
          <div class="p2-sec">Toggles and rows</div>
          <div v-for="r in [['Strip position', 'Below Volume', 'Below Profile · Below Volume · Below the rows'], ['Toggles', 'Flight mode, Flashlight, Auto-rotate +3', 'Opens the toggles editor'], ['Visible rows', '3', '3 · 4 · 5 · All (N9 default: All)'], ['Reveal hidden rows', 'Both', 'Button · Swipe down · Both']]" :key="r[0]" class="p2-row p2-row--set"><span><b>{{ r[0] }}</b><small class="p2-val">{{ r[1] }}</small><small>{{ r[2] }}</small></span><HdIcon :name="r[0] === 'Toggles' ? 'chevron-right' : 'chevron-down'" :size="22" /></div></div>
        <HdToolBar variant="dark" back label="Settings toolbar" />
      </template>

      <!-- ================= a mode's page ================= -->
      <template v-else-if="is('mode-detail')">
        <div class="p2-ev hd-theme-dark"><div class="p2-plain">Sleeping</div>
          <div v-for="r in [['Schedule', '22:00 – 07:00, every day'], ['People', 'Starred contacts may call'], ['Apps', 'Clock, Calendar']]" :key="r[0]" class="p2-row p2-row--set"><span><b>{{ r[0] }}</b><small>{{ r[1] }}</small></span><HdIcon name="chevron-right" :size="22" /></div>
          <div class="p2-set"><span>Dim the screen</span><HdSwitch :model-value="true" aria-label="Dim the screen" /></div></div>
        <HdToolBar variant="dark" back label="Mode toolbar" />
      </template>

      <!-- ================= over an app ================= -->
      <template v-else>
        <div class="p2-appbg">
          <div class="p2-app__h" :style="{ background: is('share', 'share-filter', 'share-people', 'screenshot') ? '#821DDE' : is('permission') ? '#62B700' : is('wifi-qr') ? 'transparent' : '#0067BC', color: is('wifi-qr') ? '#111' : '#fff' }">{{ is('share', 'share-filter', 'share-people', 'screenshot') ? 'Gallery' : is('permission') ? 'Maps' : is('wifi-qr') ? 'Wi-Fi' : is('pinning') ? 'Kiosk' : 'Inbox' }}</div>
          <div v-if="is('share', 'share-filter', 'share-people', 'screenshot')" class="p2-gal"><i v-for="i in 9" :key="i" :style="{ background: photo(['#7fb0d8', '#d38ab0', '#a8c84a'][i % 3], '#222') }" /></div>
          <div v-else-if="is('wifi-qr')"><div class="p2-row p2-row--light"><span><b>HomeNet</b><small>Connected · tap for Share network</small></span><HdIcon name="chevron-right" :size="22" /></div><div class="p2-row p2-row--light"><span><b>Cafe</b><small>Open</small></span></div></div>
          <div v-else><div v-for="m in [['Anna Virtanen', 'Trip to Lapland'], ['Mikko Laine', 'Re: band practice'], ['Store', 'Your receipt'], ['Sara Koski', 'Photos']]" :key="m[1]" class="p2-row p2-row--light"><span><b>{{ m[0] }}</b><small>{{ m[1] }}</small></span><small>10:45</small></div></div>
        </div>
        <HdToolBar v-if="!is('power')" back label="App toolbar" :class="{ 'p2-longpress': is('pinning') }">
          <HdToolIcon v-if="is('privacy')" icon="accessibility" label="Accessibility" /><HdToolIcon icon="share" label="Share" /><HdToolIcon v-if="is('share', 'share-filter', 'share-people', 'screenshot')" icon="edit" label="Edit" />
        </HdToolBar>
        <div v-if="is('copied', 'pinning')" class="p2-banner"><HdLockScreenNotificationCard :message="is('pinning') ? 'App pinned' : 'Copied'" :source="is('pinning') ? 'Long-press Back to unpin' : 'Text copied to clipboard'" time="" :icon="is('pinning') ? 'lock' : 'check'" :accent="is('pinning') ? '#0067BC' : '#3BA55C'" /></div>
        <div v-if="is('screenshot')" class="p2-banner"><HdLockScreenNotificationCard message="Screenshot saved" source="Tap to view · Share · Edit" time="14:20"><template #media><span class="p2-info__thumb" :style="{ background: photo('#7fb0d8', '#222') }" role="img" aria-label="Screenshot" /></template></HdLockScreenNotificationCard></div>
        <div v-if="is('share', 'share-filter', 'share-people')" class="p2-menu p2-menu--share" role="dialog" aria-label="Share"><div class="p2-menu__card">
          <div class="p2-share__f hd-theme-light"><HdSearchField :model-value="is('share-filter') ? 'n' : shareQ" placeholder="Filter" label="Filter share targets" @update:model-value="(v: string) => (shareQ = v)" /></div>
          <div class="p2-share__l">
          <template v-if="is('share-people')"><div class="p2-share__sec">Suggested people<button class="p2-share__hide" aria-label="Hide suggested people">Hide</button></div>
            <div class="p2-menu__people"><span v-for="p in [['AV', '#7fb0d8', 'Anna'], ['ML', '#a8c84a', 'Mikko'], ['SK', '#d38ab0', 'Sara'], ['JH', '#e0a04a', 'Jussi']]" :key="p[0]"><HdSquircle :size="48" :color="photo(p[1], '#333')"><b style="color:#fff">{{ p[0] }}</b></HdSquircle><small>{{ p[2] }}</small></span></div></template>
          <template v-if="!is('share-filter')"><div class="p2-share__sec">Pinned</div>
            <div v-for="t in TARGETS.filter((x) => PINNED.includes(x[0]))" :key="t[0]" class="p2-menu__r p2-share__r"><HdSquircle :size="32" :color="t[2]" lighting="lit"><HdIcon :name="t[1]" :size="18" lit /></HdSquircle>{{ t[0] }}<HdIcon class="p2-share__pin" name="star" :size="14" /></div>
            <div class="p2-share__sec">All apps</div></template>
          <div v-for="t in shareList" :key="t[0]" class="p2-menu__r p2-share__r"><HdSquircle :size="32" :color="t[2]" lighting="lit"><HdIcon :name="t[1]" :size="18" lit /></HdSquircle>{{ t[0] }}</div>
          <p v-if="!is('share-filter')" class="p2-share__hint">Long-press an app to pin it</p></div></div></div>
        <div v-if="is('power')" class="p2-dim"><div class="p2-power"><HdButton v-for="p in ['Power off', 'Restart', 'Lock now', 'Emergency call']" :key="p" variant="dark" fixed-width>{{ p }}</HdButton></div></div>
        <div v-if="is('permission')" class="p2-dim p2-query" role="dialog" aria-label="Permission"><HdSquircle :size="64" color="#62B700" lighting="lit"><HdIcon name="location" :size="32" lit /></HdSquircle>
          <h3>Allow Maps to use your location?</h3><HdButton fixed-width variant="accent">Allow</HdButton><HdButton fixed-width>Only this time</HdButton><HdButton fixed-width>Don’t allow</HdButton></div>
        <div v-if="is('wifi-qr')" class="p2-dim p2-query" role="dialog" aria-label="Share network"><h3>Share network</h3>
          <svg class="p2-qr" viewBox="0 0 21 21" width="150" height="150" aria-label="QR code"><rect width="21" height="21" fill="#fff" /><path fill="#111" d="M0 0h7v7H0zM14 0h7v7h-7zM0 14h7v7H0zM9 1h2v2H9zM9 5h3v2H9zM8 9h4v2H8zM14 9h2v3h-2zM9 13h2v4H9zM13 14h3v2h-3zM17 17h3v3h-3zM12 18h2v2h-2zM18 9h3v2h-3z" /><path fill="#fff" d="M2 2h3v3H2zM16 2h3v3h-3zM2 16h3v3H2z" /></svg>
          <p>HomeNet · lapland-2026</p><HdButton fixed-width>Close</HdButton></div>
        <div v-if="is('edit-shortcuts', 'split-drag', 'split-merge', 'share-open-apps', 'private-space')" class="p2-over">
          <div v-if="is('edit-shortcuts', 'private-space')" class="p2-grid"><span v-for="a in apps.slice(0, 6)" :key="a[0]" class="p2-grid__i"><HdSquircle :size="52" :color="a[2]" lighting="lit"><HdIcon :name="a[1]" :size="28" lit /></HdSquircle><small>{{ a[0] }}</small></span>
            <span v-if="is('private-space')" class="p2-grid__i"><HdSquircle :size="52" color="#3a3a3c" lighting="lit"><HdIcon name="lock" :size="26" lit /></HdSquircle><small>Private</small></span></div>
          <div v-if="is('share-open-apps')" class="p2-cards"><span v-for="c in [['Mail', 'mail', '#0067BC'], ['Calendar', 'calendar', '#EF5500']]" :key="c[0]" class="p2-card" :class="{ 'p2-card--drag': is('split-drag') && c[0] === 'Mail', 'p2-card--target': is('split-drag') && c[0] === 'Calendar' }"><span class="p2-card__thumb"><HdSquircle :size="44" :color="c[2]" lighting="lit"><HdIcon :name="c[1]" :size="24" lit /></HdSquircle><em v-if="is('split-drag') && c[0] === 'Calendar'">Drop to split</em></span><small>{{ c[0] }}</small></span></div>
          <div v-if="is('split-drag', 'split-merge')" class="p2-oa" :class="{ 'p2-oa--merge': is('split-merge') }">
            <span v-for="(c, i) in [['Mail', 'mail', '#0067BC'], ['Calendar', 'calendar', '#EF5500'], ['Music', 'music', '#C000C0'], ['Messages', 'message', '#09A7CC']]" :key="c[0]" class="p2-oa__c" :class="{ 'p2-oa__c--lift': is('split-drag') && i === 3, 'p2-oa__c--gap': is('split-drag') && i === 0, 'p2-oa__c--l': is('split-merge') && i === 0, 'p2-oa__c--r': is('split-merge') && i === 1 }">
              <span class="p2-oa__t"><HdSquircle v-if="!(is('split-drag') && i === 0)" :size="40" :color="c[2]" lighting="lit"><HdIcon :name="c[1]" :size="22" lit /></HdSquircle><i v-if="is('split-merge') && i < 2" class="p2-oa__f" /></span>
              <small>{{ is('split-drag') && i === 0 ? '' : c[0] }}</small></span>
            <span v-if="is('split-merge')" class="p2-oa__hint">Release to split · spread to cancel</span>
          </div>
          <HdTaskEditBar v-if="is('share-open-apps')" class="p2-bottom" :actions="['Split view', 'Pop-up', 'Screenshot', 'Share', 'App info']" />
          <HdTaskEditBar v-if="is('edit-shortcuts', 'split-drag', 'split-merge')" class="p2-bottom" :close-all-label="is('edit-shortcuts') ? 'Add widget' : 'Close all'" />
          <div v-if="is('edit-shortcuts')" class="p2-menu" style="bottom:48px" role="dialog" aria-label="Music shortcuts"><div class="p2-menu__card"><div v-for="s in ['Shuffle all', 'Last played', 'App info', 'Uninstall']" :key="s" class="p2-menu__r">{{ s }}</div></div></div>
          <div v-if="is('private-space')" class="p2-dim p2-query"><h3>Private</h3><p>Enter the security code</p><div class="p2-code"><i v-for="i in 4" :key="i" :class="{ on: i < 3 }" /></div></div>
        </div>
      </template>
    </div>
  </div>
</template>
<style>
.p2 { position: relative; width: 360px; height: 640px; flex: none; display: flex; flex-direction: column; overflow: hidden; background: #000; color: #fff; font-family: var(--hd-font-family-base); }
.p2-tags { position: absolute; z-index: 12; left: 50%; top: 4px; display: flex; gap: 4px; transform: translateX(-50%); white-space: nowrap; } /* dev tags live in the status bar: never over content */
.p2-tags.p2-tags--banner { top: auto; bottom: 72px; left: auto; right: 8px; transform: none; } /* empty content area above the toolbar: covers no card, no toolbar button */
.p2__proposal { padding: 1px 5px; border-radius: 3px; background: #E07A12; color: #fff; font: 700 9px/1.3 var(--hd-font-family-base); }
.p2-extra { margin: 0; padding: 1px 5px; border-radius: 3px; background: rgba(28,107,200,.95); color: #fff; font: 700 9px/1.3 var(--hd-font-family-base); }
.p2-sb { flex: none; position: relative; z-index: 6; height: 22px; display: flex; align-items: center; gap: 5px; padding: 0 6px; background: #000; color: #fff; font-size: 13px; }
.p2-sb--clear { background: transparent; position: absolute; left: 0; right: 0; }
.p2-sb__sig { display: inline-flex; align-items: flex-end; gap: 1px; height: 11px; } .p2-sb__sig i { width: 3px; background: currentColor; }
.p2-sb__sp { flex: 1; } .p2-sb__t { font-variant-numeric: tabular-nums; }
.p2-sb__priv { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; --hd-sq-size: 15px; --hd-sq-fill: #3FB950; color: #000; }
.p2-sb__rec { width: 9px; height: 9px; border-radius: 50%; background: #E5322B; }
.p2-banner { position: absolute; z-index: 9; top: 30px; left: 12px; right: 12px; animation: p2-banner 1.2s ease-out both; } /* a floating bubble: the lock-screen card itself, same inset as .p2-lock (12px), below a visible status bar, over the header while shown (transient); app shows all round */
.p2-banner .hd-lock-card { background: rgba(12, 15, 18, .92); box-shadow: 0 6px 18px rgba(0,0,0,.45); } /* same tint as the lock card; .70 is unreadable over a white app, so denser here */
/* banner = the lock-screen notification card (same component), dropped in over the status bar, inset like the lock cards */
.p2__app { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; border-radius: 7px 7px 0 0; background: #000; }
.p2-note { margin: 4px 16px 8px; font-size: 13px; line-height: 1.35; color: var(--hd-c-fg-secondary); }
/* status menu, n9-status-menu.png × .75: no panel or card, plain black over the dimmed app grid; labels 15 regular;
   Profile segments 16 high (selected #4A9BFF bold white, others #23436E grey label, rest #3A3A3A); flat magenta Volume;
   rows 60 high, 46px lit squircle, title 18 bold, state 15 #A0A0A0; no switch widgets */
.p2-dimmed { position: absolute; inset: 180px 0 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px 0; padding: 0 6px; justify-items: center; opacity: .35; }
.p2-sm { position: absolute; z-index: 5; inset: 0 0 auto; padding: 8px 5px 0; background: #000; }
.p2-sm__label { padding: 10px 0 4px; font: 400 15px/1 var(--hd-font-family-base); }
.p2-seg { display: flex; gap: 4px; height: 17px; } .p2-seg > span { white-space: nowrap; display: flex; align-items: center; padding: 0 30px 0 3px; background: #23436E; color: #8A9BB4; font: 700 11px/1 var(--hd-font-family-base); cursor: pointer; }
.p2-seg > span.sel { padding-right: 74px; background: #4A9BFF; color: #fff; } .p2-seg > i { flex: 1; background: #3A3A3A; }
.p2-seg > span.p2-seg__ring { flex: 1; padding-right: 3px; background: linear-gradient(90deg, #23436E var(--ring), #3A3A3A var(--ring)); } .p2-seg > span.p2-seg__ring.sel { background: linear-gradient(90deg, #4A9BFF var(--ring), #3A3A3A var(--ring)); } /* Ringing = ringer volume slider: fill width = ring level, grey = the rest */
.p2-seg--4 > span { flex: 1 1 auto; padding-right: 8px; } .p2-seg--4 > span.sel { padding-right: 18px; } /* Mode has no volume: 4 segments fill the width, no remainder */
.p2-fill { height: 17px; background: #3A3A3A; } .p2-fill i { display: block; height: 100%; background: #C800B4; }
.p2-sm__rows { padding: 16px 0 4px 8px; }
.p2-row { position: relative; display: flex; align-items: center; gap: 14px; min-height: 60px; }
.p2-row > span:not(.hd-squircle):not(.hd-icon-lit-shadow):not(.p2-art) { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.p2-row b { font: 700 18px/1.1 var(--hd-font-family-base); } .p2-row small { font: 400 15px/1.15 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.p2-row.off .hd-squircle { filter: brightness(.7); } .p2-row.off .hd-icon { opacity: .55; }
.p2-bang { color: #D2161E; font-size: 28px; }
.p2-row--edit { animation: p2-wob .3s ease-in-out infinite alternate; }
.p2-x, .p2-set span.p2-x { flex: none; margin-left: auto; } /* the red lit squircle WITH its white ✕, far right of the row, in flow */
.p2-handle { flex: none; color: var(--hd-c-fg-secondary); }
.p2-art { flex: none; width: 46px; height: 46px; }
.p2-bottom { position: absolute; z-index: 6; left: 0; right: 0; bottom: 0; }
/* sheets: the N9 toolbar menu (n9-toolbar-menu.png) */
.p2-menu { position: absolute; z-index: 8; inset: 0; display: flex; align-items: flex-end; padding: 0 11px 11px; background: rgba(0,0,0,.45); }
.p2-menu__card { position: relative; z-index: 1; } /* the N9 menu panel: square light-grey band, card 16 n9px in */
.p2-menu__card::before { content: ''; position: absolute; z-index: -2; inset: -12px; background: #DCDADE; }
.p2-menu__card::after { content: ''; position: absolute; z-index: -1; inset: 0; border: 1px solid #C9C7CC; border-radius: 8px; background: #F7F5F8; box-shadow: 0 1px 2px rgba(0,0,0,.12); }
.p2-menu__card { width: 100%; border-radius: 8px; color: #222; }
.p2-menu__r { display: flex; flex-direction: column; justify-content: center; min-height: 53px; padding: 0 16px; font: 700 17px/1.2 var(--hd-font-family-base); }
.p2-menu__r + .p2-menu__r { border-top: 1px solid #D6D4D8; } .p2-menu__r small { font: 400 14px/1.2 var(--hd-font-family-base); color: #777; }
.p2-menu__r--icon { flex-direction: row; align-items: center; justify-content: flex-start; gap: 10px; } .p2-menu__r--hint { font: 400 13px/1.2 var(--hd-font-family-base); color: #777; }
.p2-menu--share { padding-top: 64px; background: linear-gradient(transparent 52px, rgba(0,0,0,.45) 52px); } /* dim below the header only: the Gallery title stays white on purple */
.p2-menu--share .p2-menu__card { display: flex; flex-direction: column; max-height: 100%; }
.p2-share__f { padding: 10px 12px 6px; } .p2-share__f .hd-search .hd-field__box { border-radius: var(--hd-radius-control); background: #fff; box-shadow: inset 0 1px 2px rgba(0,0,0,.18); } /* N9 text field, not a pill */ .p2-share__l { overflow-y: auto; min-height: 0; scrollbar-width: none; }
.p2-share__sec { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px 2px; font: 700 13px/1.2 var(--hd-font-family-base); color: #5A5A5E; }
.p2-share__hide { border: 0; background: none; padding: 0; font: 400 13px/1 var(--hd-font-family-base); color: #0067BC; cursor: pointer; }
.p2-menu__r.p2-share__r { flex-direction: row; align-items: center; justify-content: flex-start; gap: 12px; min-height: 48px; }
.p2-share__pin { margin-left: auto; color: #5A5A5E; } .p2-share__hint { margin: 0; padding: 8px 16px 12px; font-size: 13px; color: #5A5A5E; }
.p2-menu__people { display: flex; gap: 16px; padding: 12px 16px; border-bottom: 1px solid #D6D4D8; } .p2-menu__people span { display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 12px; }
/* N9 selection / query dialogs: dimmed full screen, light title, rows or stacked buttons */
.p2-sel { position: absolute; z-index: 9; inset: 0; padding: 60px 16px 0; background: rgba(0,0,0,.96); }
.p2-sel h3 { margin: 0 0 12px; font: 300 26px/1 var(--hd-font-family-light); }
.p2-sel__r { display: flex; align-items: center; gap: 14px; min-height: 56px; font: 700 18px/1 var(--hd-font-family-base); } .p2-sel__r.on { margin: 0 -16px; padding: 0 16px; background: #2A86D8; }
.p2-dim { position: absolute; z-index: 9; inset: 0; background: rgba(0,0,0,.9); }
.p2-query { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 0 20px; text-align: center; }
.p2-query h3 { margin: 6px 0 10px; font: 300 24px/1.2 var(--hd-font-family-light); } .p2-query p { margin: 0 0 8px; color: var(--hd-c-fg-secondary); }
.p2-power { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
.p2-code { display: flex; gap: 10px; } .p2-code i { width: 14px; height: 14px; border-radius: 50%; border: 2px solid #888; } .p2-code i.on { background: #fff; border-color: #fff; }
.p2-qr { display: block; }
/* events */
.p2-ev { flex: 1; min-height: 0; overflow: hidden; background: #000; }
/* Events = the real pane on the Pro1-X (screenshots/review/phone-events.png, 1080 px -> 360): small day/date, small centred weather, small grey section labels */
.p2-ev .hd-events-header { padding: 16px 12px 8px; } .p2-ev .hd-events-header__day { font-size: 26px; } .p2-ev .hd-events-header__date { font: 400 15px/1.2 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.p2-ev .hd-events-header__wx { min-width: 118px; } .p2-ev .hd-events-header__city { font-size: 14px; } .p2-ev .hd-events-header__temp { font-size: 24px; }
.p2-ev .hd-section-header { padding: 14px 12px 6px; font: 700 14px/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); } .p2-ev .hd-section-header .hd-button { height: 26px; min-height: 26px; padding: 0 14px; font: 400 13px/1 var(--hd-font-family-base); }
.p2-ev .hd-event { padding: 8px 12px; gap: 12px; } .p2-ev .hd-event__title { font-size: 14px; } .p2-ev .hd-event__body { font-size: 13px; } .p2-ev .hd-event__time { font-size: 11px; }
.p2-ev__h { margin: 0; padding: 14px 16px 6px; font: 300 26px/1 var(--hd-font-family-light); }
.p2-plain { margin: 0 16px; padding: 14px 0 10px; border-bottom: 1px solid rgba(255,255,255,.3); font: 300 26px/1 var(--hd-font-family-light); }
.p2-sec { display: flex; align-items: center; gap: 10px; padding: 8px 16px 4px; font: 700 13px/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); flex-direction: row-reverse; } .p2-sec::after { content: ''; flex: 1; height: 1px; background: #4A4A4A; }
.p2-row--ev { min-height: 64px; padding: 6px 16px; gap: 16px; } .p2-row--ev b { font-size: 16px; } .p2-row--ev small { font-size: 14px; color: #fff; }
.p2-row--set { padding: 8px 16px; min-height: 64px; } .p2-row--set b { font-size: 18px; }
.p2-set { display: flex; align-items: center; gap: 12px; min-height: 52px; padding: 0 16px; font: 700 16px/1.2 var(--hd-font-family-base); } .p2-set span { flex: 1; }
.p2-pressed { background: rgba(255,255,255,.16); }
.p2-live .hd-event__text { flex: 1; } /* live update = a pinned Events item, never in the status bar */
.p2-prog { display: block; height: 4px; margin-top: 4px; background: #3A3A3A; } .p2-prog i { display: block; height: 100%; background: #F77219; }
.p2-reply { position: absolute; z-index: 8; inset: auto 0 0; background: #fff; color: #111; }
.p2-reply__q { padding: 10px 12px 6px; font-size: 14px; color: #555; } .p2-reply__f { display: flex; align-items: center; gap: 10px; padding: 0 10px 8px; }
.p2-field { flex: 1; padding: 6px 2px; font-size: 16px; }
.p2-kstrip { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 10px; background: #fff; border-top: 1px solid #E2E2E4; } .p2-kstrip__sp { flex: 1; } .p2-count { font: 700 16px/1 var(--hd-font-family-base); color: #444; } .p2-count small { font-weight: 400; font-size: 14px; }
.p2-send { height: 27px; padding: 0 12px; border: 1px solid #393839; border-radius: 6px; background: linear-gradient(#1C1C1C, #101010 50%, #080808); color: #fff; font: 700 15px/1 var(--hd-font-family-base); }
/* lock (n9-lock-music.png) */
.p2-lock { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 30px 12px 10px; background: radial-gradient(circle at 30% 30%, #3c6e78, #12262c 70%); }
.p2-lock__song { align-self: flex-end; font: 700 38px/1.1 var(--hd-font-family-base); } .p2-lock__artist { align-self: flex-end; font-size: 17px; }
.p2-lock__ctl { align-self: flex-end; display: flex; gap: 42px; margin-top: 14px; padding-right: 4px; }
.p2-lock__clock { align-self: flex-end; margin-top: 14px; font: 200 66px/1 var(--hd-font-family-light); } .p2-lock__date { align-self: flex-end; margin-top: 8px; font-size: 17px; color: #fff; } /* = the real lock screen (pro1x-lock-notifications.png): huge thin clock and date right-aligned */
.p2-lock__glance { align-self: flex-end; margin-top: 6px; font-size: 14px; color: var(--hd-c-fg-secondary); }
.p2-lock__cards { margin-top: auto; display: grid; gap: 8px; margin-bottom: 18px; }
.p2-lock__sos { display: flex; justify-content: center; margin-bottom: 14px; }
/* app background */
.p2-appbg { flex: 1; min-height: 0; overflow: hidden; background: #fff; color: #111; }
.p2-app__h { padding: 16px 16px 12px; font: 300 26px/1 var(--hd-font-family-light); }
.p2-row--light { min-height: 64px; padding: 0 16px; } .p2-row--light b { font-size: 17px; } .p2-row--light small { font-size: 14px; color: #777; }
.p2-gal { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; } .p2-gal i { aspect-ratio: 1; display: block; }
.p2-longpress .hd-toolbar__back { filter: brightness(.85); }
.p2-info { position: absolute; z-index: 9; top: 10px; left: 8px; right: 8px; }
.p2-info__thumb { flex: none; width: 44px; height: 44px; } /* screenshot thumbnail as is (square), in the bubble's icon slot */
.p2-over { position: absolute; inset: 0; z-index: 7; background: #000; }
.p2-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 0; padding: 24px 6px; justify-items: center; } .p2-grid__i { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; color: var(--hd-c-fg-secondary); }
.p2-cards { display: flex; gap: 14px; padding: 40px 18px; } .p2-card { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 13px; color: #fff; } /* N9 Open apps thumbnails: grey card, app icon, title under it */
.p2-card__thumb { position: relative; align-self: stretch; height: 200px; display: grid; place-items: center; background: #2E2E30; border: 1px solid #444; } .p2-card__thumb em { position: absolute; bottom: 10px; font: 700 12px/1 var(--hd-font-family-base); font-style: normal; color: #6CB6FF; }
.p2-card--drag { position: relative; transform: translate(40px, 30px) scale(.92); z-index: 2; opacity: .92; } .p2-card--drag .p2-card__thumb { box-shadow: 0 10px 24px rgba(0,0,0,.7); } .p2-card--target .p2-card__thumb { border: 2px solid #2A86D8; background: #20324A; } /* dragged card lifts (no tilt); target lights up */
.p2-sm--pull { animation: p2-pull 1.6s ease-out both; }
.p2-row--pulled { animation: p2-rows 1.6s ease-out both; }
.p2-tg { display: grid; grid-template-columns: repeat(6, auto); justify-content: space-between; row-gap: 10px; padding: 12px 0 2px; } /* edge to edge; > 6 wraps to more rows */
.p2-tg-empty { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; row-gap: 4px; padding: 6px 0 2px; } .p2-tg-empty span { width: 100%; font: 400 13px/1.2 var(--hd-font-family-base); color: var(--hd-c-fg-tertiary); }
.p2-tgblk { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; } .p2-tgblk .p2-tg { width: 100%; }
.p2-set--tile { gap: 12px; min-height: 46px; } .p2-set--tile > span:not(.p2-x) { flex: none; } .p2-set--tile b { flex: 1; font: 700 16px/1.2 var(--hd-font-family-base); } .p2-set--tile small { color: var(--hd-c-fg-secondary); font-weight: 400; }
.p2-tg--avail { opacity: .7; } .p2-tg .p2-x { position: absolute !important; right: -6px; top: -6px; z-index: 2; margin: 0; }
/* the "more" handle: a thin line with a small chevron, clearly not a row */
.p2-handle-line { display: flex; align-items: center; gap: 8px; width: 100%; height: 22px; padding: 0 40px; border: 0; background: none; color: var(--hd-c-fg-secondary); cursor: pointer; } .p2-handle-line i { flex: 1; height: 1px; background: #4A4A4A; }
.p2-val { color: #2A86D8 !important; } .p2-set span small { display: block; font: 400 13px/1.2 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
@keyframes p2-pull { 0% { transform: translateY(0); } 40% { transform: translateY(24px); } 70%, 100% { transform: translateY(0); } }
@keyframes p2-rows { 0%, 20% { opacity: 0; transform: translateY(-30px); } 70%, 100% { opacity: 1; transform: none; } }
.p2-sm--edit { padding: 6px 5px 0 10px; }
.p2-blk { position: relative; display: flex; align-items: center; gap: 8px; padding: 2px 6px 4px 0; animation: p2-wob .3s ease-in-out infinite alternate; }
.p2-blk__body { flex: 1; min-width: 0; } .p2-blk .p2-handle, .p2-set .p2-handle { margin: 0 2px 0 0; }
.p2-blk--drag { z-index: 2; background: #1A1A1A; box-shadow: 0 6px 14px rgba(0,0,0,.8); transform: translate(4px, -2px); animation: none; }
.p2-blk .p2-tg { padding: 6px 0 2px; } .p2-row--mini { min-height: 38px; } .p2-row--mini b { font-size: 15px; } .p2-row--mini .p2-bang { font-size: 20px; }
.p2-add { display: flex; align-items: baseline; gap: 10px; padding: 5px 0 5px 14px; } .p2-add b { font: 700 15px/1 var(--hd-font-family-base); } .p2-add small { color: var(--hd-c-fg-secondary); font-size: 13px; }
.p2-add__plus { display: inline-flex; align-self: center; align-items: center; justify-content: center; width: 20px; height: 20px; --hd-sq-size: 20px; --hd-sq-fill: linear-gradient(#7CC24A, #3E8E1C); color: #fff; }
.p2-sw-fill { flex: 0 0 26px !important; height: 10px; } .p2-set small { flex: 1; color: var(--hd-c-fg-secondary); font: 400 13px/1 var(--hd-font-family-base); } .p2-set--add { font-weight: 400; } .p2-set .p2-add__plus { flex: none; }
.p2--land { width: 640px; height: 360px; }
/* N9 word tracker (libmeego-keyboard MImWordTrackerStyle): #F7F7F7 bubble, 15 n9px corners, no pointer, 6/6 n9px off the cursor, #282828 text */
.p2-field { position: relative; } .p2-cur { text-decoration-color: #1A8BE0; }
.p2-wt { position: absolute; left: 50%; transform: translateX(-50%); bottom: calc(100% + 4px); white-space: nowrap; padding: 4px 12px; border-radius: 10px; background: #F7F7F7; box-shadow: 0 1px 4px rgba(0,0,0,.35); color: #282828; font: 400 17px/1.2 var(--hd-font-family-base); }
/* candidate list (MImWordList): plain rows, large bold, white on the dark dialog; selected row #3D3D3D */
.p2-wl { padding-top: 120px; } .p2-wl__r { min-height: 56px; display: flex; align-items: center; margin: 0 -16px; padding: 0 16px; font: 700 22px/1 var(--hd-font-family-base); } .p2-wl__r.on { background: #3D3D3D; color: #4A9BFF; }
.p2-sugg { display: flex; gap: 14px; margin-left: 8px; font: 400 16px/1 var(--hd-font-family-base); color: #444; } .p2-sugg b { color: #1A8BE0; }
.p2-mu-large { display: flex; justify-content: center; margin: 8px 6px 10px 0; }
.p2-wordwrap { position: relative; }
@keyframes p2-wob { from { transform: rotate(-.6deg); } to { transform: rotate(.6deg); } }
@keyframes p2-banner { 0% { transform: translateY(-140%); opacity: 0; } 100% { transform: translateY(0); } } /* drops in and holds; hides after the timeout (not animated here) */
@media (prefers-reduced-motion: reduce) { .p2-banner, .p2-row--edit, .p2-blk, .p2-sm--pull, .p2-row--pulled, .p2-tg--edit .p2-tg__t { animation: none; } }
.p2-today { display: flex; align-items: center; gap: 10px; min-height: 30px; padding: 0 16px; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.p2-oa { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 18px 16px; padding: 36px 26px; }
.p2-oa__c { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 13px; color: #fff; transition: transform .2s; }
.p2-oa__t { position: relative; align-self: stretch; height: 170px; display: grid; place-items: center; background: #2E2E30; border: 1px solid #444; }
.p2-oa__c--gap .p2-oa__t { background: none; border: 2px dashed #2A86D8; } /* where the dragged card will land */
.p2-oa__c--lift { transform: translate(-90px, -150px) scale(1.04); z-index: 2; } .p2-oa__c--lift .p2-oa__t { box-shadow: 0 12px 28px rgba(0,0,0,.8); }
.p2-oa--merge .p2-oa__c--l { transform: translateX(14px); } .p2-oa--merge .p2-oa__c--r { transform: translateX(-14px); }
.p2-oa--merge .p2-oa__c--l .p2-oa__t, .p2-oa--merge .p2-oa__c--r .p2-oa__t { border: 2px solid #2A86D8; background: #20324A; }
.p2-oa__f { position: absolute; width: 34px; height: 34px; clip-path: circle(50%); background: radial-gradient(circle, rgba(255,255,255,.35) 60%, rgba(255,255,255,.85) 62%); top: 56%; } /* finger touch points (not icons: a circle) */
.p2-oa__hint { grid-column: 1 / -1; text-align: center; font-size: 13px; color: #6CB6FF; margin-top: -6px; }
.p2-pri { align-items: flex-start; padding-left: 12px; } .p2-pri__txt { flex: 1; min-width: 0; } .p2-pri__l { display: flex; align-items: center; gap: 6px; white-space: nowrap; overflow: hidden; } .p2-pri__l > :not(em):not(.hd-squircle) { overflow: hidden; text-overflow: ellipsis; } .p2-pri__l em { flex: none; margin-left: auto; padding-left: 8px; font-style: normal; color: var(--hd-c-fg-tertiary, #A0A0A0); }
.p2-ghost { opacity: .4; } .p2-ghost__t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; } .p2-ghost em { font-style: normal; font-size: 13px; }
.p2-med { align-self: flex-end; margin-top: 8px; display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 6px; border: 0; background: #C21A17; color: #fff; font: 700 13px/1.4 var(--hd-font-family-base); } /* a red label (like a medical tag), not a card, not a button row */
.p2-medbar { display: flex; align-items: center; gap: 8px; width: 100%; margin-bottom: 8px; padding: 8px 4px; border: 0; border-top: 1px solid rgba(255,255,255,.18); background: none; color: #fff; font: 600 14px/1.2 var(--hd-font-family-base); text-align: left; }
.p2-medbar > svg:first-child { flex: none; padding: 3px; background: #C21A17; box-sizing: content-box; } .p2-medbar span { flex: 1; }
.p2-medcard { position: absolute; inset: 24px 0 0; z-index: 8; display: flex; flex-direction: column; background: #0E0E0E; color: #fff; }
.p2-medcard__h { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: #C21A17; font: 700 17px/1.2 var(--hd-font-family-base); }
.p2-medcard__name { padding: 14px 16px 6px; font: 300 30px/1.2 var(--hd-font-family-light); }
.p2-medcard dl { display: grid; grid-template-columns: auto 1fr; gap: 6px 16px; margin: 0; padding: 6px 16px 10px; font-size: 15px; } .p2-medcard dt { color: #A0A0A0; } .p2-medcard dd { margin: 0; font-weight: 700; }
.p2-medcard__sec { padding: 10px 16px 4px; color: #A0A0A0; font-size: 14px; border-top: 1px solid #333; }
.p2-medcard__c { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; } .p2-medcard__c span { display: flex; flex-direction: column; } .p2-medcard__c small { color: #A0A0A0; }
.p2-medcard__act { margin-top: auto; display: flex; gap: 10px; justify-content: center; padding: 14px; }
.p2-lock__top { display: flex; align-items: center; justify-content: space-between; gap: 12px; } .p2-lock__top .p2-lock__clock { margin-left: auto; }
.p2-ma { align-self: center; margin-top: 14px; border: 0; background: none; color: #fff; padding: 0; text-align: left; font: inherit; }
.p2-ma--sq, .p2-ma--star { display: flex; flex-direction: column; align-items: center; gap: 4px; } .p2-ma small { font-size: 11px; font-weight: 700; letter-spacing: .02em; }
.p2-ma--star { opacity: .85; }
.p2-ma--card { display: flex; flex-direction: column; gap: 1px; padding-left: 8px; border-left: 3px solid #E8463F; font-size: 12px; line-height: 1.35; max-width: 120px; } .p2-ma--card b { font-size: 13px; white-space: nowrap; } .p2-ma__more { color: #FF8A84; font-weight: 700; }
</style>
