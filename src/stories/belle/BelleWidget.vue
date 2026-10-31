<script setup lang="ts">
/**
 * Belle home-screen widget mocks, matched to the ROM launcher (BelleClassic*.kt, bc_*.xml / belle_*.xml).
 * dp → px 1:1. Grid: 4 columns, cell = width / 4 (90px on a 360px screen), 6px gap round each widget.
 * Classic (bc_*): lit glass / metal / paper bodies. Modern (belle_*): one translucent black panel, 12px corners.
 * editing: the launcher's edit chrome (2px accent outline at 14px corners, red ✕ squircle 30px top-right, resize handle).
 */
import { computed, ref } from 'vue';
import HdIcon from '../../components/HdIcon.vue';
import HdSquircle from '../../components/HdSquircle.vue';
export type BelleKind = 'switch' | 'wifi' | 'fm' | 'toggles' | 'data' | 'notes' | 'today' | 'agenda' | 'bigclock' | 'gearclock' | 'analog'
  | 'flipclock' | 'lcdclock' | 'wordclock' | 'web' | 'contact' | 'weather' | 'rss' | 'mail' | 'stackmail' | 'music' | 'music-large' | 'm-clock' | 'm-analog' | 'm-calendar'
  | 'm-feeds' | 'm-music' | 'm-weather' | 'm-shortcuts';
const props = withDefaults(defineProps<{ kind: BelleKind; cols?: number; rows?: number; on?: boolean; glyph?: string; word?: string; editing?: boolean; cell?: number; art?: string; title?: string; out?: string }>(), { cell: 90 });
/* default grid size per widget (targetCellWidth / Height in the appwidget-provider xml) */
const SIZE: Record<BelleKind, [number, number]> = {
  switch: [1, 1], wifi: [2, 1], fm: [2, 1], toggles: [4, 1], data: [1, 1], notes: [4, 2], today: [4, 1], agenda: [4, 3], bigclock: [4, 3],
  gearclock: [4, 3], analog: [2, 2], flipclock: [4, 2], lcdclock: [4, 2], wordclock: [4, 2], web: [2, 2], contact: [2, 2], weather: [4, 2],
  rss: [4, 3], mail: [4, 3], stackmail: [4, 2], music: [4, 1.5], 'music-large': [4, 3], 'm-clock': [4, 2], 'm-analog': [2, 2], 'm-calendar': [4, 2], 'm-feeds': [4, 2], 'm-music': [4, 2], 'm-weather': [4, 1], 'm-shortcuts': [4, 1],
};
/** sample posts and mails: more than fit, as the Belle list widgets scroll (they hold up to 20) */
const POSTS = ['City opens new tram line to the harbour', 'Northern lights expected again tonight', 'Local team wins the winter cup', 'Library extends its weekend hours',
  'Ferry timetable changes for the winter season', 'New cycle lanes along the lake shore', 'Museum night returns this Saturday', 'Snow expected by the end of the week',
  'Market square gets a skating rink', 'University opens its observatory to visitors', 'Bakery on Hämeenkatu wins best rye bread', 'Concert hall announces the spring programme'];
const MAILS: [string, string, string, boolean][] = [['Mikko Lahti', 'Photos from the weekend', '10:02', true], ['Travel desk', 'Your booking is confirmed', '09:41', true],
  ['Anna Virtanen', 'Re: Lunch on Friday?', '08:15', true], ['Library', 'Your loan is due next week', 'Yesterday', false], ['Sauna club', 'Winter evenings are back', 'Yesterday', false],
  ['Electricity company', 'Your October bill', 'Mon', false], ['Jussi K', 'Slides for Thursday', 'Mon', false], ['Cycling club', 'Last ride of the season', 'Sun', false],
  ['Bookshop', 'New in: winter reading', 'Sat', false], ['Mikko Lahti', 'Re: Cabin dates', 'Fri', false]];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const EVENTS: [string, string][][] = [[['Team stand-up', '@Anna Virtanen'], ['Lunch with Mikko', '@Mikko Laine'], ['Design review', '14:00'], ['Dentist', '16:30'], ['Sauna evening', '19:00']], [['Gym', '07:30']], []];
const day = ref(0);
const dayEvents = computed(() => EVENTS[((day.value % 3) + 3) % 3]);
const stack = ref(0);
const c = computed(() => props.cols ?? SIZE[props.kind][0]);
const r = computed(() => props.rows ?? SIZE[props.kind][1]);
const box = computed(() => ({ width: `${c.value * props.cell - 12}px`, height: `${r.value * props.cell - 12}px` }));
const G: Record<string, string> = {
  power: 'M11 3h2v9h-2zM7.05 5.64l1.41 1.42A6 6 0 1 0 15.54 7l1.41-1.41A8 8 0 1 1 7.05 5.64z',
  flight: 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z',
  silent: 'M3.3 2.3 2 3.6 6.4 8H3v8h4l5 5v-7.6l4.2 4.2a7 7 0 0 1-2.2 1.2v2a9 9 0 0 0 3.6-1.8l2 2 1.3-1.3zM12 3 9.9 5.1 12 7.2z',
  data: 'M7 3 3 7h3v7h2V7h3zm10 18 4-4h-3v-7h-2v7h-3z',
  prev: 'M6 6h2v12H6zm3.5 6 8.5 6V6z', next: 'M16 6h2v12h-2zM6 18l8.5-6L6 6z', pause: 'M6 5h4v14H6zm8 0h4v14h-4z', play: 'M8 5v14l11-7z',
  people: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 2c-3 0-7 1.5-7 4.5V20h14v-2.5C16 14.5 12 13 9 13zm7-2a3 3 0 1 0-1-5.8 5.5 5.5 0 0 1 0 5.6c.3.1.6.2 1 .2zm1.7 2.1c1.4 1 2.3 2.4 2.3 4.4V20h3v-2.5c0-2.4-3-3.9-5.3-4.4z',
  up: 'M7 14l5-5 5 5z', down: 'M7 10l5 5 5-5z', left: 'M14 7l-5 5 5 5z', right: 'M10 7l5 5-5 5z',
};
const now = { h: 10, m: 8 };
const hand = (deg: number) => ({ transform: `rotate(${deg}deg)` });
const hourDeg = (now.h % 12) * 30 + now.m / 2, minDeg = now.m * 6;
</script>
<template>
  <div class="bw" :class="[`bw--${kind}`, { 'bw--editing': editing }]" :style="box" :data-cells="`${c}x${r}`">
    <!-- ---- 1×1 switch: brushed squircle, blue glow under the rim when on; a glyph or embossed word ---- -->
    <div v-if="kind === 'switch'" class="bw-sw" :class="{ on }" role="switch" :aria-checked="!!on" :aria-label="word ?? glyph">
      <span v-if="word" class="bw-sw__word">{{ word }}</span>
      <svg v-else-if="G[glyph ?? '']" class="bw-sw__glyph" viewBox="0 0 24 24" width="34" height="34"><path :d="G[glyph!]" fill="currentColor" /></svg>
      <HdIcon v-else :name="glyph ?? 'wifi'" :size="34" class="bw-sw__glyph" />
    </div>
    <!-- ---- 2×1 Wi-Fi / FM switch: dark lit pill, power squircle (grey off, green on) ---- -->
    <div v-else-if="kind === 'wifi' || kind === 'fm'" class="bw-pill">
      <span class="bw-power" :class="{ on }"><svg viewBox="0 0 24 24" width="30" height="30"><path :d="G.power" fill="currentColor" /></svg></span>
      <span v-if="kind === 'wifi'" class="bw-pill__side"><HdIcon name="wifi" :size="34" /><b v-if="on" class="bw-badge">4</b></span>
      <span v-else class="bw-pill__freq" :class="{ on }">{{ on ? '98.40 MHz' : 'FM Radio' }}</span>
    </div>
    <!-- ---- 4×1 switches: four dark squircles, blue lit rim when on ---- -->
    <div v-else-if="kind === 'toggles'" class="bw-panel bw-toggles">
      <span v-for="(t, i) in [['wifi', 'Wi-Fi'], ['bluetooth', 'Bluetooth'], ['data', 'Data'], ['silent', 'Silent']]" :key="t[0]" class="bw-tg">
        <span class="bw-tg__face" :class="{ on: i < 2 }"><svg v-if="G[t[0]]" viewBox="0 0 24 24" width="30" height="30"><path :d="G[t[0]]" fill="currentColor" /></svg><HdIcon v-else :name="t[0]" :size="30" /></span>
        <span class="bw-tg__label">{{ t[1] }}</span></span>
    </div>
    <!-- ---- 1×1 data tracker: dark disc, blue ring from 12 o'clock ---- -->
    <div v-else-if="kind === 'data'" class="bw-data"><svg viewBox="0 0 78 78" width="78" height="78" aria-hidden="true"><defs><linearGradient id="bw-disc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#55565A" /><stop offset="1" stop-color="#1A1A1C" /></linearGradient></defs>
      <circle cx="39" cy="39" r="39" fill="url(#bw-disc)" /><circle cx="39" cy="39" r="35.1" fill="#050506" /><circle cx="39" cy="39" r="31.5" fill="none" stroke="#0F2A47" stroke-width="7" />
      <circle cx="39" cy="39" r="31.5" fill="none" stroke="#2F8BEA" stroke-width="7" stroke-linecap="round" :stroke-dasharray="`${0.62 * 197.9} 197.9`" transform="rotate(-90 39 39)" /></svg>
      <span class="bw-data__l"><span class="bw-data__n">620</span><span class="bw-data__u">MB used</span></span></div>
    <!-- ---- Notes: yellow paper, dark bar with ▲ ▼ + 🗑 ---- -->
    <div v-else-if="kind === 'notes'" class="bw-notes">
      <div class="bw-notes__paper"><div class="bw-notes__head"><b>Notes</b><span>Today 09:41</span></div>
        <p>Buy coffee filters, call the garage about the winter tyres, return library books.</p></div>
      <div class="bw-notes__bar"><svg v-for="g in ['up', 'down']" :key="g" viewBox="0 0 24 24" width="20" height="20" :class="{ dim: g === 'up' }"><path :d="G[g]" fill="currentColor" /></svg><HdIcon name="add" :size="22" /><HdIcon name="delete" :size="22" /></div>
    </div>
    <!-- ---- Today (4×1): white paper, binder rings, next event ---- -->
    <div v-else-if="kind === 'today'" class="bw-paperwrap"><i class="bw-ring" style="left:44px" /><i class="bw-ring" style="right:44px" />
      <div class="bw-paper"><div class="bw-paper__day">Today</div><div class="bw-paper__ev"><b>14:00</b><i class="bw-cyan" /><span>Design review</span></div></div></div>
    <!-- ---- Agenda (4×3): day header with arrows, event rows, light "Create new event" button ---- -->
    <div v-else-if="kind === 'agenda'" class="bw-paperwrap"><i class="bw-ring" style="left:44px" /><i class="bw-ring" style="right:44px" />
      <div class="bw-paper bw-agenda">
        <!-- ◀ ▶ step through the days (Belle agenda PrevDay / NextDay); the day's events scroll -->
        <div class="bw-agenda__head"><button type="button" class="bw-agenda__nav" aria-label="Previous day" @click="day--"><svg viewBox="0 0 24 24" width="30" height="30"><path :d="G.left" fill="currentColor" /></svg></button>
          <span data-test="agenda-day">{{ DAYS[(day % 7 + 7) % 7] }} | {{ 1 + ((day % 30) + 30) % 30 }} Oct</span>
          <button type="button" class="bw-agenda__nav" aria-label="Next day" @click="day++"><svg viewBox="0 0 24 24" width="30" height="30"><path :d="G.right" fill="currentColor" /></svg></button></div>
        <div class="bw-agenda__list bw-scroll" tabindex="0" aria-label="Events">
          <p v-if="!dayEvents.length" class="bw-agenda__none">No events</p>
          <div v-for="e in dayEvents" :key="e[0]" class="bw-agenda__row">
            <svg viewBox="0 0 24 24" width="26" height="26" style="color:#77777B"><path :d="G.people" fill="currentColor" /></svg><i class="bw-cyan" /><span><b>{{ e[0] }}</b><small>{{ e[1] }}</small></span></div>
        </div>
        <div class="bw-agenda__foot"><span class="bw-lightpill"><HdIcon name="add" :size="18" /> Create new event</span></div>
      </div></div>
    <!-- ---- clocks ---- -->
    <div v-else-if="kind === 'analog' || kind === 'bigclock'" class="bw-sqdial" :class="{ big: kind === 'bigclock' }">
      <svg class="bw-marks" viewBox="0 0 100 100"><path stroke="#EDEDED" stroke-width="2.6" stroke-linecap="round" d="M50,9V16M50,84V91M9,50H14M86,50H91" /><path stroke="#9A9A9E" stroke-width="1.6" stroke-linecap="round" d="M70.5,14.5L68.5,18M85.5,29.5L82,31.5M85.5,70.5L82,68.5M70.5,85.5L68.5,82M29.5,85.5L31.5,82M14.5,70.5L18,68.5M14.5,29.5L18,31.5M29.5,14.5L31.5,18" /></svg>
      <i class="bw-hand bw-hand--h" :style="hand(hourDeg)" /><i class="bw-hand bw-hand--m" :style="hand(minDeg)" /><i v-if="kind === 'bigclock'" class="bw-hand bw-hand--s" :style="hand(200)" /><i class="bw-cap" />
      <span v-if="kind === 'bigclock'" class="bw-dayname">Mon</span><span class="bw-datebub">25</span>
    </div>
    <div v-else-if="kind === 'gearclock'" class="bw-gear">
      <i v-for="(g, i) in [[66, 31, 42], [31, 66, 38], [50, 50, 36], [69, 65, 22]]" :key="i" class="bw-gear__g" :style="{ left: `${g[0]}%`, top: `${g[1]}%`, width: `${g[2] * 2}%`, height: `${g[2] * 2}%` }" />
      <svg class="bw-marks" viewBox="0 0 100 100"><path stroke="#8E8F94" stroke-width="1.2" stroke-linecap="round" d="M50,6V12M50,88V94M6,50H12M88,50H94" /></svg>
      <i class="bw-hand bw-hand--h" :style="hand(hourDeg)" /><i class="bw-hand bw-hand--m" :style="hand(minDeg)" /><i class="bw-hand bw-hand--s" :style="hand(200)" /><i class="bw-cap" />
      <span class="bw-dayname">Mon</span><span class="bw-datebub">25</span>
    </div>
    <div v-else-if="kind === 'flipclock'" class="bw-flip">
      <div v-for="(t, i) in ['10', '08']" :key="i" class="bw-flip__tile"><span class="bw-flip__n">{{ t }}</span><i class="bw-flip__hinge" /><i class="bw-pin" style="left:0" /><i class="bw-pin" style="right:0" /><small v-if="i" class="bw-flip__date">Mon Oct 25</small></div>
    </div>
    <div v-else-if="kind === 'lcdclock'" class="bw-lcd"><div class="bw-lcd__glass"><span class="bw-lcd__t">10</span><span class="bw-lcd__c">:</span><span class="bw-lcd__t">08</span><span class="bw-lcd__d">25/10/2026</span></div></div>
    <div v-else-if="kind === 'wordclock'" class="bw-word"><span class="bw-word__h">Ten</span><span class="bw-word__m">Eight</span><span class="bw-word__d">25/10/2026</span></div>
    <!-- ---- web / contact shortcut (2×2): picture shown as is, name on a dark strip ---- -->
    <div v-else-if="kind === 'web' || kind === 'contact'" class="bw-photo" :role="'img'" :aria-label="kind === 'web' ? 'Website thumbnail' : 'Contact photo'">
      <div v-if="kind === 'web'" class="bw-web"><i style="height:14px;background:#2a6fb5" /><i style="height:42px;background:#dfe6ee" /><i style="width:70%" /><i /><i style="width:85%" /><i style="width:60%" /></div>
      <div v-else class="bw-contact" :style="{ background: art ?? 'linear-gradient(160deg,#c9a27a,#6b4a33)' }" />
      <span class="bw-strip">{{ kind === 'web' ? 'example.org' : 'Anna Virtanen' }}</span>
    </div>
    <!-- ---- Weather (4×2): grey glass, icon breaking out above, big temp, place tab, two forecast days ---- -->
    <div v-else-if="kind === 'weather'" class="bw-weather">
      <div class="bw-glass bw-weather__body"><div class="bw-weather__now"><div class="bw-weather__t"><span>12°</span><small>14° / 6°</small></div><span class="bw-label bw-weather__place">Tampere</span></div>
        <div v-for="d in [['Tue', '13° / 5°', 'rain'], ['Wed', '15° / 7°', 'sun']]" :key="d[0]" class="bw-weather__day"><svg viewBox="0 0 40 40" width="40" height="40"><use :href="`#bw-wx-${d[2]}`" /></svg><span>{{ d[1] }}</span><span>{{ d[0] }}</span></div></div>
      <svg class="bw-weather__icon" viewBox="0 0 40 40" width="84" height="84"><use href="#bw-wx-cloudsun" /></svg>
      <svg width="0" height="0" style="position:absolute"><defs>
        <radialGradient id="bw-sun" cx=".4" cy=".35"><stop offset="0" stop-color="#FFE36A" /><stop offset="1" stop-color="#F59A10" /></radialGradient>
        <linearGradient id="bw-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" /><stop offset="1" stop-color="#B9C2CC" /></linearGradient>
        <g id="bw-wx-sun"><circle cx="20" cy="20" r="10" fill="url(#bw-sun)" /></g>
        <g id="bw-wx-cloudsun"><circle cx="24" cy="15" r="9" fill="url(#bw-sun)" /><path d="M10 32a7 7 0 0 1 1-14 9 9 0 0 1 17 3 5.5 5.5 0 0 1 0 11z" fill="url(#bw-cloud)" /></g>
        <g id="bw-wx-rain"><path d="M9 26a6.5 6.5 0 0 1 1-13 8.5 8.5 0 0 1 16 3 5 5 0 0 1 0 10z" fill="url(#bw-cloud)" /><path d="M13 30l-2 5M20 30l-2 5M27 30l-2 5" stroke="#5AA9F0" stroke-width="2" stroke-linecap="round" /></g>
      </defs></svg>
    </div>
    <!-- ---- RSS for one site (4×3): orange header, white rows with orange dots ---- -->
    <div v-else-if="kind === 'rss'" class="bw-rss">
      <div class="bw-rss__head"><span><b>Example News</b><small>Updated 09:30</small></span><HdIcon name="refresh" :size="26" /></div>
      <!-- up to 20 posts that scroll, titles up to three lines (Belle rsswidget3: scrollablebox, feed1..feed20, max-line-amount 3) -->
      <div class="bw-rss__body bw-scroll" tabindex="0" aria-label="Posts"><div v-for="(t, i) in POSTS" :key="t" class="bw-rss__row"><i class="bw-dot" :class="{ read: i > 3 }" /><span>{{ t }}</span></div></div>
    </div>
    <!-- ---- Music classic (4×2): grey glass, square art shown as is, round lit buttons ---- -->
    <!-- small music (Belle, belle-music-widget-small.jpg): dark glossy panel; square art on the left rising above the top edge;
         title on the right above prev / bigger play / next in a recessed groove (squircles by our rule) -->
    <!-- Mail (Belle Mail widget 4.5): the account and unread count in the blue header, then up to 20 mails that scroll -->
    <div v-else-if="kind === 'mail'" class="bw-mail">
      <div class="bw-mail__head"><span>anna@example.org</span><b class="bw-mail__count">{{ MAILS.filter((m) => m[3]).length }}</b></div>
      <div class="bw-mail__body bw-scroll" tabindex="0" aria-label="Mails"><div v-for="m in MAILS" :key="m[1]" class="bw-mail__row"><i class="bw-mail__dot" :class="{ read: !m[3] }" /><span><b>{{ m[0] }}</b><small>{{ m[1] }}</small></span><time>{{ m[2] }}</time></div></div>
    </div>
    <!-- Latest mail (Belle stackemail): one mail at a time; ▲ ▼ step through, disabled at the ends -->
    <div v-else-if="kind === 'stackmail'" class="bw-mail bw-stack">
      <div class="bw-mail__head"><span>Latest mail</span></div>
      <div class="bw-stack__body">
        <span class="bw-stack__mail"><b>{{ MAILS[stack][0] }}</b><small>{{ MAILS[stack][2] }} · {{ stack + 1 }} / {{ MAILS.length }}</small><span>{{ MAILS[stack][1] }}</span></span>
        <span class="bw-stack__nav"><button type="button" aria-label="Newer mail" :disabled="stack === 0" @click="stack--"><HdIcon name="chevron-up" :size="22" /></button>
          <button type="button" aria-label="Older mail" :disabled="stack === MAILS.length - 1" @click="stack++"><HdIcon name="chevron-down" :size="22" /></button></span>
      </div>
    </div>
    <div v-else-if="kind === 'music'" class="bw-music">
      <div class="bw-music__panel" />
      <div class="bw-music__art" :style="{ background: art ?? 'radial-gradient(circle at 50% 40%, #2F5FD0, #0D2A82 70%, #061650)' }" role="img" aria-label="Album art"><svg v-if="!art" viewBox="0 0 24 24" width="40" height="40" aria-hidden="true"><path d="M9 17.5V5.5l11-2.5v12" fill="none" stroke="#050508" stroke-width="2" /><ellipse cx="6.5" cy="17.5" rx="3" ry="2.4" fill="#050508" /><ellipse cx="17.5" cy="15" rx="3" ry="2.4" fill="#050508" /></svg></div>
      <div class="bw-music__side"><span class="bw-music__title">{{ art ? (title ?? 'Polar night · The Swipes') : 'Go to Music library' }}</span><u v-if="art && out" class="bw-music__out">{{ out }}</u>
        <div class="bw-music__ctl"><HdSquircle v-for="(g, i) in [G.prev, on && art ? G.pause : G.play, G.next]" :key="i" :size="i === 1 ? 38 : 30" color="#1E1E21" lighting="lit" role="button" :aria-label="['Previous', on && art ? 'Pause' : 'Play', 'Next'][i]" :class="{ 'is-dim': !art }"><svg viewBox="0 0 24 24" :width="i === 1 ? 22 : 15" :height="i === 1 ? 22 : 15"><path :d="g" fill="currentColor" /></svg></HdSquircle></div></div>
    </div>
    <!-- large music (Belle, belle-music-widget-large.jpg): the square art stands up out of a glossy black tray;
         the tray's lower part holds prev / big play / next (dark glossy; squircles by our rule). Empty: blue tile, note, "Go to Music library". -->
    <div v-else-if="kind === 'music-large'" class="bw-mlarge">
      <div class="bw-mlarge__tray" />
      <div v-if="art" class="bw-mlarge__art" :style="{ background: art }" role="img" aria-label="Album art" />
      <div v-else class="bw-mlarge__art bw-mlarge__art--empty" role="button" aria-label="Go to Music library"><svg viewBox="0 0 24 24" width="84" height="84" aria-hidden="true"><path d="M9 17.5V5.5l11-2.5v12" fill="none" stroke="#0B0B10" stroke-width="2" /><ellipse cx="6.5" cy="17.5" rx="3" ry="2.4" fill="#0B0B10" /><ellipse cx="17.5" cy="15" rx="3" ry="2.4" fill="#0B0B10" /></svg><span>Go to Music library</span></div>
      <div v-if="art && title" class="bw-mlarge__t"><b>{{ title }}</b><u v-if="out">{{ out }}</u></div>
      <div class="bw-mlarge__ctl"><HdSquircle v-for="(g, i) in [G.prev, on && art ? G.pause : G.play, G.next]" :key="i" :size="i === 1 ? 50 : 38" color="#1E1E21" lighting="lit" role="button" :aria-label="['Previous', on && art ? 'Pause' : 'Play', 'Next'][i]" :class="{ 'is-dim': !art }"><svg viewBox="0 0 24 24" :width="i === 1 ? 28 : 18" :height="i === 1 ? 28 : 18"><path :d="g" fill="currentColor" /></svg></HdSquircle></div>
    </div>
    <!-- ---- modern (belle_*): one translucent black panel ---- -->
    <div v-else-if="kind === 'm-clock'" class="bw-mclock"><span class="bw-mclock__t">10:08</span><span class="bw-sec">Monday 25 October</span></div>
    <div v-else-if="kind === 'm-analog'" class="bw-manalog"><div class="bw-mdial"><svg class="bw-marks" style="inset:0;width:100%;height:100%" viewBox="0 0 120 120"><path stroke="#fff" stroke-width="3" d="M60,8v10M112,60h-10M60,112v-10M8,60h10" /><path stroke="rgba(255,255,255,.6)" stroke-width="1.5" d="M86,15l-3,5.2M105,34l-5.2,3M105,86l-5.2,-3M86,105l-3,-5.2M34,105l3,-5.2M15,86l5.2,-3M15,34l5.2,3M34,15l3,5.2" /></svg><i class="bw-hand bw-hand--h" :style="hand(hourDeg)" /><i class="bw-hand bw-hand--m" :style="hand(minDeg)" /><i class="bw-cap" /></div><span class="bw-sec" style="font-size:13px">Mon 25 Oct</span></div>
    <div v-else-if="kind === 'm-calendar' || kind === 'm-feeds'" class="bw-panel bw-mlist">
      <div class="bw-mlist__head"><HdIcon :name="kind === 'm-calendar' ? 'calendar' : 'globe'" :size="16" />{{ kind === 'm-calendar' ? 'Calendar' : 'Feeds' }}</div>
      <div v-for="e in (kind === 'm-calendar' ? [['Design review', 'Today 14:00'], ['Dentist', 'Tomorrow 09:30'], ['Sauna evening', 'Fri 18:00']] : [['Tram line opens to the harbour', 'Example News · 1 h'], ['Northern lights tonight', 'Sky Weekly · 2 h'], ['Winter cup final', 'Sports Daily · 3 h']])" :key="e[0]" class="bw-mlist__row"><span>{{ e[0] }}</span><small>{{ e[1] }}</small></div>
    </div>
    <div v-else-if="kind === 'm-music'" class="bw-panel bw-mmusic">
      <div v-if="art" class="bw-mmusic__art" :style="{ background: art }" role="img" aria-label="Album art" />
      <HdSquircle v-else :size="64" color="rgba(255,255,255,.08)" class="bw-mmusic__ph"><HdIcon name="music" :size="36" /></HdSquircle>
      <div class="bw-mmusic__side"><span class="bw-mmusic__t">{{ art ? 'Polar night' : 'Music' }}</span><span class="bw-sec" style="font-size:12px">{{ art ? 'The Swipes' : 'Nothing playing' }}</span>
        <div class="bw-mmusic__ctl"><svg viewBox="0 0 24 24" width="20" height="20"><path :d="G.prev" fill="currentColor" /></svg><svg viewBox="0 0 24 24" width="24" height="24"><path :d="G.play" fill="currentColor" /></svg><svg viewBox="0 0 24 24" width="20" height="20"><path :d="G.next" fill="currentColor" /></svg></div></div>
    </div>
    <div v-else-if="kind === 'm-weather'" class="bw-panel bw-mweather"><svg viewBox="0 0 40 40" width="56" height="56"><circle cx="20" cy="20" r="10" fill="#F5B21F" /></svg><span class="bw-mweather__p"><span>Tampere</span><small class="bw-sec">Sunny</small></span><span class="bw-mweather__t">12°</span></div>
    <div v-else-if="kind === 'm-shortcuts'" class="bw-panel bw-mshort">
      <span v-for="a in [['Phone', 'phone', '#62B700'], ['Messages', 'message', '#09A7CC'], ['Camera', 'photo', '#821DDE'], ['', 'add', '']]" :key="a[1]" class="bw-slot">
        <HdSquircle v-if="a[2]" :size="40" :color="a[2]" lighting="lit"><HdIcon :name="a[1]" :size="22" lit /></HdSquircle><HdIcon v-else name="add" :size="32" style="opacity:.6" />
        <span>{{ a[0] }}</span></span>
    </div>
    <!-- ---- edit chrome ---- -->
    <template v-if="editing"><i class="bw-outline" /><HdSquircle :size="30" class="bw-close" color="linear-gradient(#F78673, #EF2C10)" role="button" aria-label="Remove widget"><svg viewBox="0 0 30 30" width="30" height="30"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle><i class="bw-resize" /></template>
  </div>
</template>
<style>
.bw { position: relative; flex: none; box-sizing: border-box; color: #fff; font: 400 15px/1.2 var(--hd-font-family-base); }
.bw > :first-child:not(.bw-outline) { width: 100%; height: 100%; box-sizing: border-box; }
.bw-sec { color: #8C8C8C; }
/* modern panel: #B3000000, 12px corners, 1px #26FFFFFF rim, a faint top-light */
.bw-panel { border-radius: 12px; border: 1px solid rgba(255,255,255,.15); background: linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 50%), rgba(0,0,0,.7); }
/* classic glass (music, weather): grey glass, 14px corners, top sheen */
.bw-glass { border-radius: 14px; border: 1px solid #0A0A0B; background: linear-gradient(rgba(255,255,255,.15), rgba(255,255,255,0) 30px), linear-gradient(rgba(80,81,85,.9), rgba(42,43,46,.9) 50%, rgba(20,20,22,.9)); }
.bw-label { border-radius: 4px; border: 1px solid rgba(255,255,255,.25); background: linear-gradient(rgba(64,65,68,.88), rgba(21,21,23,.88)); }
/* 1×1 switch, 76×80 */
.bw--switch { display: grid; place-items: center; }
.bw-sw { width: 76px !important; height: 80px !important; display: grid; place-items: center; padding-bottom: 6px; border-radius: 24px; color: #6E7075;
  background: linear-gradient(#C4C6CB, #9C9EA3 50%, #7E8085) padding-box, linear-gradient(#6C6E73, #2E2F33) border-box; border: 4px solid transparent; border-bottom-width: 8px;
  box-shadow: 0 2px 0 rgba(0,0,0,.6), inset 0 0 0 1px #DADCE0; }
.bw-sw.on { color: #2F7FD6; box-shadow: 0 0 0 2px #2F7FD6, 0 3px 6px rgba(111,184,255,.8), inset 0 0 0 1px #DADCE0; }
.bw-sw__word { font: 700 24px/1 var(--hd-font-family-base); text-shadow: 0 1.5px .5px #E6E7EA; }
.bw-sw__glyph { filter: drop-shadow(0 1.5px 0 #E6E7EA); }
/* 2×1 pill + power squircle */
.bw-pill { display: flex; align-items: center; gap: 0; padding: 5px; border-radius: 16px; border: 1.5px solid #050506; background: linear-gradient(#4C4D52, #26272A 50%, #101012); }
.bw-power { position: relative; flex: none; display: grid; place-items: center; width: 56px; height: 56px; border-radius: 14px; border: 1px solid #2A2A2C; color: #2a2a2c; background: linear-gradient(#A9AAAE, #707175 50%, #45464A); }
.bw-power.on { border-color: #2F5A08; color: #fff; background: linear-gradient(rgba(255,255,255,.4), rgba(255,255,255,0) 40%), linear-gradient(#D3EE7A, #8CC43A 50%, #4F8A14); }
.bw-pill__side { position: relative; flex: 1; display: grid; place-items: center; height: 100%; color: #fff; }
.bw-badge { position: absolute; top: 2px; right: 6px; width: 22px; height: 22px; border-radius: 50%; box-sizing: border-box; border: 1.5px solid #fff; background: linear-gradient(#9AD24A, #4F8A14); font: 700 11px/19px var(--hd-font-family-base); text-align: center; }
.bw-pill__freq { flex: 1; text-align: center; font-size: 17px; color: #8E8F94; }
.bw-pill__freq.on { color: #fff; }
/* 4×1 toggles: 60×56 dark squircles */
.bw-toggles { display: flex; align-items: center; padding: 4px; }
.bw-tg { flex: 1; display: flex; flex-direction: column; align-items: center; min-width: 0; }
.bw-tg__face { display: grid; place-items: center; width: 60px; height: 56px; box-sizing: border-box; border-radius: 20px; border: 3px solid #0C0C0D; border-bottom-width: 5px; color: #8E8F94; background: linear-gradient(#3E3F43, #222325); }
.bw-tg__face.on { border-color: #3A86D8; border-top-color: #8EC4F6; border-bottom-color: #1A4F96; color: #fff; background: linear-gradient(#55575C, #26272A); }
.bw-tg__label { margin-top: 2px; font-size: 13px; }
/* data ring 78 */
.bw--data { display: grid; place-items: center; }
.bw-data { position: relative; width: 78px !important; height: 78px !important; }
.bw-data__l { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.bw-data__n { font-size: 19px; } .bw-data__u { font-size: 8px; color: #B0B1B5; }
/* notes */
.bw-notes { display: flex; flex-direction: column; }
.bw-notes__paper { flex: 1; padding: 12px; border-radius: 4px 4px 0 0; border: 1px solid #D9C46E; background: linear-gradient(#FBF3C4, #F0DC8A); color: #3A3A3A; overflow: hidden; }
.bw-notes__head { display: flex; justify-content: space-between; align-items: baseline; color: #1A1A1A; }
.bw-notes__head b { font-size: 22px; } .bw-notes__head span { font-size: 15px; color: #E07A12; }
.bw-notes__paper p { margin: 6px 0 0; font-size: 18px; line-height: 1.3; }
.bw-notes__bar { display: flex; justify-content: space-around; align-items: center; height: 40px; margin: 0 8px; border-radius: 0 0 12px 12px; background: linear-gradient(#3A3B3F, #121214); color: #fff; }
.bw-notes__bar .dim { color: #6A6B70; }
/* paper cards */
.bw-paperwrap { position: relative; padding-top: 5px; }
.bw-ring { position: absolute; top: 0; z-index: 1; width: 8px; height: 14px; border-radius: 4px; border: 1px solid #6A6B70; box-sizing: border-box; background: linear-gradient(90deg, #8E8F94, #F4F4F6, #8E8F94); }
.bw-paper { height: 100%; box-sizing: border-box; display: flex; flex-direction: column; border-radius: 12px; border: 1px solid #BDBDC0; background: linear-gradient(#fff, #E6E6E8); color: #1A1A1A; box-shadow: 0 6px 0 -1px rgba(18,18,18,.94); }
.bw-paper__day { padding: 4px 0 3px; text-align: center; font-size: 17px; border-bottom: 1px solid #C9C9CC; }
.bw-paper__ev { flex: 1; display: flex; align-items: center; padding: 0 14px; font-size: 17px; }
.bw-paper__ev b { font-size: 15px; }
.bw-cyan { flex: none; width: 3px; height: 26px; margin: 0 10px; background: #19D3E6; }
.bw-agenda__head { display: flex; align-items: center; justify-content: space-between; height: 44px; padding: 0 13px; font-size: 17px; border-bottom: 1px solid #C9C9CC; }
.bw-agenda__row { flex: none; height: 60px; box-sizing: border-box; display: flex; align-items: center; padding: 0 12px; border-bottom: 1px solid #DADADD; }
.bw-agenda__list { flex: 1; min-height: 0; } .bw-agenda__none { margin: 0; padding: 24px 0; text-align: center; color: #6E6E73; }
.bw-agenda__nav { display: grid; place-items: center; padding: 0; border: 0; background: none; color: #1A1A1A; cursor: pointer; } .bw-agenda__nav:first-child { color: #8E8E92; }
.bw-stack__body { flex: 1; display: flex; gap: 8px; padding: 10px 6px 10px 14px; border-radius: 0 0 10px 10px; background: linear-gradient(#fff, #E9E9EB); color: #1A1A1A; }
.bw-stack__mail { flex: 1; min-width: 0; display: flex; flex-direction: column; } .bw-stack__mail b { font-size: 17px; } .bw-stack__mail small { font-size: 13px; color: #1C8FD8; }
.bw-stack__mail span { margin-top: 4px; font-size: 15px; color: #444; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.bw-stack__nav { display: flex; flex-direction: column; justify-content: space-between; }
.bw-stack__nav button { display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 0; color: #0E5E9E; background: linear-gradient(#F6F6F7, #D8D8DB); cursor: pointer; -webkit-mask: var(--hd-squircle-mask) center / contain no-repeat; mask: var(--hd-squircle-mask) center / contain no-repeat; }
.bw-stack__nav button:disabled { opacity: .35; cursor: default; }
.bw-agenda__row .bw-cyan { width: 4px; height: 70%; }
.bw-agenda__row span { display: flex; flex-direction: column; min-width: 0; } .bw-agenda__row b { font-weight: 400; font-size: 17px; } .bw-agenda__row small { font-size: 15px; color: #6E6E73; }
.bw-agenda__foot { padding: 10px 0; display: grid; place-items: center; }
.bw-lightpill { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 22px; border-radius: 18px; border: 1px solid #B5B5B8; background: linear-gradient(#F6F6F7, #D8D8DB); font-size: 16px; }
/* square dial 120 (2×2) / 220 (4×3) */
.bw--analog, .bw--bigclock, .bw--gearclock { display: grid; place-items: center; }
.bw-sqdial, .bw-gear { position: relative; width: 120px !important; height: 120px !important; }
.bw-sqdial { border-radius: 34px; border: 2px solid #0A0A0B; background: linear-gradient(#55565B, #141416); box-shadow: inset 0 0 0 4px rgba(0,0,0,0); }
.bw-sqdial::before { content: ''; position: absolute; inset: 4px; border-radius: 28px; background: linear-gradient(#2E2F33, #0E0E10); }
.bw-sqdial.big, .bw-gear { width: 220px !important; height: 220px !important; }
.bw-sqdial.big { border-radius: 62px; } .bw-sqdial.big::before { inset: 9px; border-radius: 52px; }
.bw-marks { position: absolute; inset: 6px; width: calc(100% - 12px); height: calc(100% - 12px); fill: none; }
.bw-hand { position: absolute; left: 50%; bottom: 50%; transform-origin: 50% 100%; border-radius: 2px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.6); }
.bw-hand--h { width: 5%; height: 26%; margin-left: -2.5%; } .bw-hand--m { width: 3.4%; height: 38%; margin-left: -1.7%; }
.bw-hand--s { width: .8%; height: 46%; margin-left: -.4%; background: #3D8FE0; }
.bw-cap { position: absolute; left: 50%; top: 50%; width: 7%; height: 7%; transform: translate(-50%, -50%); border-radius: 50%; background: #fff; box-shadow: inset 0 0 0 2px #3D8FE0; }
.bw-datebub { position: absolute; left: 79%; top: 50%; width: 12%; height: 12%; transform: translate(-50%, -50%); border-radius: 22%; box-sizing: border-box; border: 1px solid #46474B; background: linear-gradient(#2C2D31, #141416); font-size: 11px; display: grid; place-items: center; z-index: 1; }
.big .bw-datebub { font-size: 14px; }
.bw-dayname { position: absolute; left: 24.5%; top: 50%; transform: translate(-50%, -50%); font-size: 14px; color: #B4B5B9; z-index: 1; }
/* Gear clock (belle-ref11): the day low on the left, a round date at 3 o'clock. */
.bw-gear .bw-dayname { left: 31%; top: 72%; font-size: 13px; }
.bw-gear .bw-datebub { left: 87%; width: 11%; height: 11%; border-radius: 50%; border-color: #77787C; background: linear-gradient(#3A3B3F, #1A1A1C); font-size: 13px; }
.bw-gear { border-radius: 50%; overflow: hidden; background: radial-gradient(circle at 50% 40%, #4A4B4F, #141416 70%); box-shadow: inset 0 0 0 2px #050506; }
.bw-gear__g { position: absolute; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(#1A1B1E 30%, #2E2F33 31% 80%, transparent 81%), repeating-conic-gradient(#2E2F33 0 12deg, transparent 12deg 26deg); opacity: .9; }
/* flip clock 4×2: two black tiles, 16px corners, hinge + pins */
.bw-flip { display: flex; gap: 6px; padding: 2px; }
.bw-flip__tile { position: relative; flex: 1; display: grid; place-items: center; border-radius: 16px; border: 1.5px solid #000; background: linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 40%), linear-gradient(#2C2D31, #111214 50%, #000); box-shadow: 0 3px 0 rgba(0,0,0,.4); }
.bw-flip__n { font: 700 84px/1 var(--hd-font-family-base); text-shadow: 0 2px 2px rgba(0,0,0,.67); }
.bw-flip__hinge { position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: #6A6B70; }
.bw-pin { position: absolute; top: calc(50% - 6px); width: 4px; height: 12px; border-radius: 2px; background: linear-gradient(90deg, #5A5B60, #C8C9CE, #5A5B60); }
.bw-flip__date { position: absolute; bottom: 10px; font-size: 15px; color: #9A9BA0; }
/* LCD 4×2: dark metal frame, black glass, #23B14D digits */
.bw-lcd { width: fit-content !important; height: fit-content !important; margin: auto; padding: 8px; border-radius: 14px; border: 1px solid #000; background: linear-gradient(#5A5B60, #2A2B2E 50%, #0E0E10); }
.bw-lcd__glass { height: 100%; box-sizing: border-box; display: flex; align-items: center; padding: 10px 10px 10px 14px; border-radius: 8px; border: 1px solid #46474B; background: linear-gradient(#2A2B2E, #050506); color: #23B14D; font-family: ui-monospace, monospace; }
.bw-lcd__t { align-self: stretch; display: grid; place-items: center; padding: 0 8px; border-radius: 6px; border: 1px solid #050506; background: linear-gradient(#1E1F22, #111214 50%, #1A1B1D); font-size: 56px; text-shadow: 0 0 6px rgba(35,177,77,.5); }
.bw-lcd__c { padding: 0 3px; font-size: 30px; } .bw-lcd__d { align-self: flex-end; margin-left: 10px; padding: 2px 5px; border-radius: 3px; border: 1px solid #1E3A24; background: #0B140D; font-size: 14px; }
/* word clock 4×2 */
.bw-word { display: flex; flex-direction: column; justify-content: center; padding-left: 16px; }
.bw-word__h { font-size: 72px; line-height: 1; } .bw-word__m { font-size: 40px; line-height: 1; color: #E0287A; } .bw-word__d { margin-top: 10px; font-size: 26px; }
/* picture shortcut: content as is, 6px frame corners */
.bw-photo { position: relative; overflow: hidden; border-radius: 6px; background: #3A3A3C; }
.bw-web, .bw-contact { position: absolute; inset: 0; } .bw-web { display: flex; flex-direction: column; gap: 6px; background: #fff; }
.bw-web i { display: block; height: 6px; margin: 0 10px; background: #c8ccd2; border-radius: 2px; } .bw-web i:nth-child(-n+2) { margin: 0; border-radius: 0; }
.bw-strip { position: absolute; left: 0; right: 0; bottom: 0; padding: 6px 10px 7px; background: rgba(0,0,0,.65); font-size: 18px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* weather: glass starts 30px down, the 84px icon breaks out above it */
.bw-weather { position: relative; }
.bw-weather__body { position: absolute; inset: 30px 0 0; display: flex; }
.bw-weather__now { flex: 1.25; display: flex; flex-direction: column; min-width: 0; }
.bw-weather__t { flex: 1; display: flex; align-items: flex-end; gap: 10px; padding-left: 12px; }
.bw-weather__t span { font-size: 46px; line-height: 1; } .bw-weather__t small { margin-bottom: 4px; font-size: 16px; color: #B4B5B9; }
.bw-weather__place { height: 34px; margin: 6px; display: grid; place-items: center; font-size: 16px; }
.bw-weather__day { flex: .75; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 15px; }
.bw-weather__icon { position: absolute; top: 0; left: 60px; filter: drop-shadow(0 3px 3px rgba(0,0,0,.5)); }
/* rss: orange header 52px, white rows */
.bw-rss { display: flex; flex-direction: column; filter: drop-shadow(0 2px 3px rgba(0,0,0,.5)); }
.bw-rss__head { display: flex; align-items: center; height: 52px; padding: 0 12px 0 14px; border-radius: 10px 10px 0 0; background: linear-gradient(#F7A13A, #E5620F); }
.bw-rss__head span { flex: 1; display: flex; flex-direction: column; } .bw-rss__head b { font-size: 18px; text-shadow: 0 1px 1px rgba(0,0,0,.4); } .bw-rss__head small { font-size: 13px; opacity: .9; }
.bw-rss__body { flex: 1; min-height: 0; display: flex; flex-direction: column; padding-bottom: 4px; border-radius: 0 0 10px 10px; background: linear-gradient(#fff, #E9E9EB); color: #1A1A1A; }
.bw-rss__row { flex: none; min-height: 52px; padding: 8px 0; box-sizing: border-box; display: flex; align-items: center; gap: 12px; margin: 0 14px; font-size: 15px; }
.bw-rss__row span { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.bw-dot.read { visibility: hidden; }
/* the Belle list widgets scroll (Mail, feeds): a thin scrollbar that is always shown, so there is clearly more */
.bw-scroll { overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: rgba(128,128,133,.5) transparent; }
.bw-scroll::-webkit-scrollbar { width: 3px; } .bw-scroll::-webkit-scrollbar-thumb { background: rgba(128,128,133,.5); border-radius: 2px; }
/* mail: blue header with the account centred and the unread count in a white disc; white rows, two lines each */
.bw-mail { display: flex; flex-direction: column; filter: drop-shadow(0 2px 3px rgba(0,0,0,.5)); }
.bw-mail__head { position: relative; display: flex; align-items: center; justify-content: center; height: 40px; border-radius: 10px 10px 0 0; background: linear-gradient(#4DB2F0, #0E6CB8); font-size: 18px; text-shadow: 0 1px 1px rgba(0,0,0,.5); }
.bw-mail__count { position: absolute; right: 6px; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(#fff, #D6E6F2); color: #0E5E9E; font-size: 15px; text-shadow: none; }
.bw-mail__body { flex: 1; min-height: 0; border-radius: 0 0 10px 10px; background: linear-gradient(#fff, #E9E9EB); color: #1A1A1A; }
.bw-mail__row { display: flex; align-items: center; gap: 9px; height: 58px; padding: 0 12px 0 10px; box-sizing: border-box; } .bw-mail__row + .bw-mail__row { border-top: 1px solid #DADADD; }
.bw-mail__row span { flex: 1; min-width: 0; display: flex; flex-direction: column; } .bw-mail__row b, .bw-mail__row small { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.bw-mail__row b { font-size: 16px; } .bw-mail__row small { font-size: 14px; color: #6E6E73; } .bw-mail__row time { align-self: flex-start; margin-top: 9px; font-size: 14px; color: #1C8FD8; }
.bw-mail__dot { flex: none; width: 9px; height: 9px; border-radius: 50%; background: linear-gradient(#4DB2F0, #1C8FD8); } .bw-mail__dot.read { visibility: hidden; } .bw-rss__row + .bw-rss__row { border-top: 1px solid #DADADD; }
.bw-dot { flex: none; width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(#F79A3A, #D9560C); }
/* large music: art 50% of the width centred, rising above the tray (tray starts at ~2/3 of the art) */
.bw-mlarge { position: relative; display: flex; flex-direction: column; align-items: center; }
.bw-mlarge__tray { position: absolute; left: 0; right: 0; bottom: 0; height: 52%; border-radius: 14px; border: 1px solid #000; background: linear-gradient(#3C3C40, #18181A 18%, #0B0B0C 60%, #1A1A1C); box-shadow: inset 0 1px 0 rgba(255,255,255,.25); }
.bw-mlarge__art { position: relative; width: 52%; aspect-ratio: 1; box-shadow: 0 2px 6px rgba(0,0,0,.6); }
.bw-mlarge__art--empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: radial-gradient(circle at 50% 40%, #2F5FD0, #0D2A82 70%, #061650); color: #fff; font-size: 15px; } .bw-mlarge__art--empty svg path, .bw-mlarge__art--empty svg ellipse { stroke: #000; }
.bw-mlarge__art--empty svg { filter: drop-shadow(0 1px 1px rgba(255,255,255,.5)); } .bw-mlarge__art--empty svg path { stroke: #050508; } .bw-mlarge__art--empty svg ellipse { fill: #050508; }
.bw-mlarge__t { position: relative; display: flex; gap: 10px; align-items: baseline; margin-top: 4px; font-size: 14px; color: #fff; } .bw-mlarge__t u { color: #4A9BFF; font-size: 13px; }
.bw-mlarge__ctl { position: relative; margin-top: auto; margin-bottom: 10px; display: flex; align-items: center; gap: 18px; color: #fff; } .bw-mlarge__ctl .is-dim { opacity: .55; }
/* small music: panel below a 10px lip so the art can rise above it; groove = recessed dark rounded channel */
.bw-music { position: relative; display: flex; align-items: flex-end; gap: 12px; padding: 0 10px 10px; }
.bw-music__panel { position: absolute; left: 0; right: 0; bottom: 0; top: 10px; border-radius: 12px; border: 1px solid #000; background: linear-gradient(#3C3C40, #18181A 22%, #0B0B0C 70%, #1A1A1C); box-shadow: inset 0 1px 0 rgba(255,255,255,.25); }
.bw-music__art { position: relative; flex: none; align-self: flex-start; width: 92px; height: 92px; display: grid; place-items: center; box-shadow: 0 2px 6px rgba(0,0,0,.6); } /* album art as is: square */
.bw-music__side { position: relative; flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.bw-music__title { max-width: 100%; font-size: 14px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .bw-music__out { margin-top: -3px; font-size: 12px; color: #4A9BFF; }
.bw-music__ctl .is-dim { opacity: .55; }
.bw-music__ctl { display: flex; align-items: center; justify-content: space-around; width: 100%; height: 46px; padding: 0 6px; border-radius: 12px; background: linear-gradient(#050506, #141416); box-shadow: inset 0 2px 4px rgba(0,0,0,.9), 0 1px 0 rgba(255,255,255,.12); color: #fff; }
.bw-round { display: grid; place-items: center; width: 44px; height: 44px; box-sizing: border-box; border-radius: 50%; border: 1px solid #55565A; background: linear-gradient(#3E3F43, #0E0E10); }
.bw-round--big { width: 58px; height: 58px; }
/* modern */
.bw-mclock { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; }
.bw-mclock, .bw-manalog { text-shadow: 0 1px 3px rgba(0,0,0,.6); }
.bw-mclock__t { font: 300 56px/1 var(--hd-font-family-light); } .bw-mclock .bw-sec { margin-top: 2px; font-size: 15px; }
.bw-manalog { display: flex; flex-direction: column; align-items: center; padding: 8px; }
.bw-mdial { position: relative; flex: 1; aspect-ratio: 1; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.25); background: rgba(20,20,20,.9); }
.bw-mlist { display: flex; flex-direction: column; padding: 8px 14px; }
.bw-mlist__head { display: flex; align-items: center; gap: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,.2); font-size: 12px; color: #8C8C8C; }
.bw-mlist__row { flex: 1; display: flex; flex-direction: column; justify-content: center; font-size: 14px; } .bw-mlist__row small { font-size: 12px; color: #8C8C8C; }
.bw-mmusic { display: flex; align-items: center; gap: 12px; padding: 10px; }
.bw-mmusic__art { flex: none; width: 64px; height: 64px; }
.bw-mmusic__ph { flex: none; color: rgba(255,255,255,.7); }
.bw-mmusic__side { flex: 1; display: flex; flex-direction: column; min-width: 0; } .bw-mmusic__t { font-size: 15px; }
.bw-mmusic__ctl { display: flex; justify-content: space-around; align-items: center; height: 36px; margin-top: 4px; }
.bw-mweather { display: flex; align-items: center; gap: 14px; padding: 0 16px; }
.bw-mweather__p { flex: 1; display: flex; flex-direction: column; font-size: 17px; } .bw-mweather__p small { font-size: 13px; }
.bw-mweather__t { font: 300 44px/1 var(--hd-font-family-light); }
.bw-mshort { display: flex; padding: 6px; }
.bw-slot { flex: 1; margin: 3px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 8px; background: rgba(255,255,255,.08); font-size: 11px; }
.bw-slot span { margin-top: 2px; }
/* edit chrome (WidgetsPage.kt) */
.bw-outline { position: absolute; inset: 0; border: 2px solid var(--hd-accent, #2E8BE6); border-radius: 14px; pointer-events: none; }
.bw-close { position: absolute !important; top: 0; right: 0; z-index: 2; }
.bw-close > * , .bw-close { display: grid; place-items: center; }
.bw-resize { position: absolute; right: -4px; bottom: -4px; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--hd-accent, #2E8BE6); background: #fff; }
</style>
