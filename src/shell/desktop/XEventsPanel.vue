<script setup lang="ts">
/**
 * Events panel (Super+N): exactly the phone's Events view, sliding in from the right under the menu bar.
 * Order: day and date, the time, the weather (city, temperature, icon); then Notifications, Calendar (today), Feeds.
 * No toggles or volume here: they live in the status menu (XStatusPanel).
 * month: tapping the date expands it into a month calendar; the selected day's entries are listed one line each below.
 */
import { ref, computed, watch } from 'vue';
import HdEventsFeedItem from '../../components/HdEventsFeedItem.vue';
import HdSectionHeader from '../../components/HdSectionHeader.vue';
import HdIcon from '../../components/HdIcon.vue';
import XKey from '../parts/XKey.vue';
import { photo } from '../parts/data';
const props = withDefaults(defineProps<{ hints?: boolean; month?: boolean; day?: number }>(), { hints: true, month: false, day: 24 });
const emit = defineEmits<{ close: []; 'update:month': [on: boolean] }>();
const open = ref(props.month);
watch(() => props.month, (v) => (open.value = v));
const sel = ref(props.day);
function toggle() { open.value = !open.value; emit('update:month', open.value); }
/** October 2026: the 1st is a Thursday; weeks start on Monday */
const TODAY = 24, DAYS = 31, FIRST = 3;
const ENTRIES: Record<number, [string, string][]> = {
  20: [['09:30', 'Dentist']],
  22: [['13:00', 'Lunch with Sara']],
  24: [['10:00', 'Stand-up'], ['14:00', 'Design review · Room Etesian'], ['18:30', 'Sauna with Mikko']],
  26: [['09:00', 'Sprint planning'], ['16:00', 'Swipe UI workshop']],
  29: [['All day', 'Anna’s birthday']],
};
const cells = computed(() => [...Array(FIRST).fill(0), ...Array.from({ length: DAYS }, (_, i) => i + 1)]);
const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayName = (d: number) => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][(FIRST + d - 1) % 7]!;
const selEntries = computed(() => ENTRIES[sel.value] ?? []);
</script>
<template>
  <aside class="x-ev hd-on-home" aria-label="Events">
    <header class="x-ev__top">
      <button type="button" class="x-ev__date hd-focusable" :aria-expanded="open ? 'true' : 'false'" aria-label="Saturday 24 October 2026, show month" @click="toggle">
        <span class="x-ev__day">Saturday</span>
        <span class="x-ev__dmy">24 October 2026 <HdIcon :name="open ? 'chevron-down' : 'chevron-right'" :size="16" /></span>
      </button>
      <XKey v-if="hints" keys="Esc" class="x-ev__esc" />
    </header>
    <div class="x-ev__now">
      <span class="x-ev__time">12:45</span>
      <span class="x-ev__wx" aria-label="Helsinki, 4 degrees, partly cloudy">
        <svg class="x-ev__wxi" width="44" height="36" viewBox="0 0 44 36" aria-hidden="true">
          <circle cx="15" cy="13" r="8" fill="#FFC21A" />
          <g stroke="#FFC21A" stroke-width="2.4" stroke-linecap="round"><path d="M15 1v2.5M3 13h2.5M6.5 4.5l1.8 1.8M23.5 4.5l-1.8 1.8" /></g>
          <path d="M14 33h21a7 7 0 0 0 .6-14 9 9 0 0 0-17.2 2.6A5.7 5.7 0 0 0 14 33z" fill="currentColor" fill-opacity=".85" />
        </svg>
        <span class="x-ev__temp">4°</span>
        <span class="x-ev__city">Helsinki<small>Partly cloudy</small></span>
      </span>
    </div>

    <section v-if="open" class="x-ev__month" aria-label="October 2026">
      <div class="x-ev__mhead"><b>October 2026</b></div>
      <div class="x-ev__grid" role="grid">
        <span v-for="w in WEEK" :key="w" class="x-ev__wd" role="columnheader">{{ w }}</span>
        <template v-for="(d, i) in cells" :key="i">
          <span v-if="!d" class="x-ev__cell is-empty"></span>
          <button v-else type="button" role="gridcell" class="x-ev__cell hd-focusable" :class="{ 'is-today': d === TODAY, 'is-sel': d === sel }" :aria-selected="d === sel ? 'true' : 'false'" :aria-label="`${d} October`" @click="sel = d">
            <span class="x-ev__cn hd-sq">{{ d }}</span><i v-if="ENTRIES[d]" class="x-ev__dot" aria-hidden="true"></i>
          </button>
        </template>
      </div>
      <h3 class="x-ev__selh">{{ dayName(sel) }} {{ sel }} October</h3>
      <ul class="x-ev__lines">
        <li v-for="[t, s] in selEntries" :key="t + s"><b>{{ t }}</b><span>{{ s }}</span></li>
        <li v-if="!selEntries.length" class="is-none"><span>No entries</span></li>
      </ul>
    </section>

    <div class="x-ev__feed">
      <HdSectionHeader title="Notifications" />
      <HdEventsFeedItem title="Anna Virtanen" body="Are we still on for lunch? I can be there by 12:30." time="5 min ago" accent="#09A7CC" />
      <HdEventsFeedItem title="Liisa Niemi" body="Sent you a voice note (0:42)" time="40 min ago" accent="#09A7CC" />
      <HdEventsFeedItem title="Design weekly" body="Why squircles feel softer than rounded rectangles" time="1 h ago" icon="mail" accent="#0067BC" />
      <HdSectionHeader title="Calendar" />
      <HdEventsFeedItem v-for="[t, s] in ENTRIES[TODAY]" :key="t" :title="s" :body="t === '14:00' ? 'Today 14:00, Room Etesian' : `Today ${t}`" :time="t" icon="calendar" accent="#EF5500" />
      <HdSectionHeader title="Feeds" />
      <HdEventsFeedItem title="Etesian journal" body="A tablet for the swipe generation: what the N9 got right" time="2 h ago" :image="photo(0)" />
      <HdEventsFeedItem title="Mikko Laine" body="Posted 6 new photos from Lapland" time="Yesterday" :image="photo(3)" />
    </div>
  </aside>
</template>
<style>
.x-ev { position: absolute; top: 0; right: 0; bottom: 0; z-index: 45; width: 460px; display: flex; flex-direction: column; background: color-mix(in srgb, var(--hd-surface-home) 97%, transparent); color: var(--hd-c-fg);
  box-shadow: -14px 0 44px rgba(0,0,0,.45), -1px 0 0 var(--hd-c-divider); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px); }
.x-ev__top { display: flex; align-items: flex-start; padding: 18px 16px 0 14px; }
.x-ev__date { flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 6px 8px; border: 0; border-radius: 8px; background: none; color: inherit; text-align: left; cursor: pointer; }
.x-ev__date:hover { background: var(--hd-c-pressed); }
.x-ev__day { font: 700 var(--hd-font-size-default)/1 var(--hd-font-family-base); }
.x-ev__dmy { display: inline-flex; align-items: center; gap: 6px; font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-ev__esc { margin-top: 8px; }
.x-ev__now { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 6px 22px 14px; } /* no rule here: the section header below draws the only line */
.x-ev__time { font: var(--hd-font-weight-light) 64px/1 var(--hd-font-family-light); font-variant-numeric: tabular-nums; letter-spacing: -.01em; }
.x-ev__wx { display: inline-flex; align-items: center; gap: 10px; }
.x-ev__temp { font: var(--hd-font-weight-light) 36px/1 var(--hd-font-family-light); }
.x-ev__city { display: flex; flex-direction: column; gap: 4px; font: 700 var(--hd-font-size-small)/1 var(--hd-font-family-base); }
.x-ev__city small { font-weight: 400; font-size: var(--hd-font-size-xsmall); color: var(--hd-c-fg-secondary); }
.x-ev__month { padding: 10px 18px 12px; }
.x-ev__mhead { padding: 0 4px 8px; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1 var(--hd-font-family-light); }
.x-ev__mhead b { font-weight: inherit; }
.x-ev__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.x-ev__wd { padding: 4px 0 6px; text-align: center; font: 700 11px/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-ev__cell { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 40px; padding: 0; border: 0; background: none; color: inherit; font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); font-variant-numeric: tabular-nums; cursor: pointer; }
.x-ev__cn { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; --hd-sq-size: 34px; }
.x-ev__cell:hover .x-ev__cn { --hd-sq-fill: var(--hd-c-pressed); }
.x-ev__cell.is-today .x-ev__cn { --hd-sq-ring: var(--hd-accent); --hd-sq-ring-width: 2px; font-weight: 700; }
.x-ev__cell.is-sel .x-ev__cn { --hd-sq-fill: var(--hd-accent); color: #fff; font-weight: 700; }
.x-ev__dot { position: absolute; bottom: 0; width: 4px; height: 4px; border-radius: 50%; background: var(--hd-accent); }
.x-ev__selh { margin: 10px 4px 6px; font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-ev__lines { list-style: none; margin: 0; padding: 0 4px; }
.x-ev__lines li { display: flex; gap: 12px; height: 28px; align-items: center; font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); white-space: nowrap; overflow: hidden; }
.x-ev__lines b { flex: none; width: 56px; font-variant-numeric: tabular-nums; }
.x-ev__lines span { overflow: hidden; text-overflow: ellipsis; }
.x-ev__lines .is-none { color: var(--hd-c-fg-secondary); }
.x-ev__feed { flex: 1; min-height: 0; overflow: hidden; -webkit-mask-image: linear-gradient(#000 calc(100% - 56px), transparent); mask-image: linear-gradient(#000 calc(100% - 56px), transparent); }
</style>
