<script setup lang="ts">
/** Calendar mock: month grid on a light page with the N9 calendar shade greys, agenda for the selected day. */
import { ref } from 'vue';
import XAppShell from '../parts/XAppShell.vue';
import HdListItem from '../../components/HdListItem.vue';
import HdSectionHeader from '../../components/HdSectionHeader.vue';
import { shellProps, type XAppProps } from '../parts/types';
const props = withDefaults(defineProps<XAppProps>(), { hints: true });
const day = ref(24);
const busy = new Set([3, 7, 12, 14, 18, 24, 27]);
const tabs = [{ id: 'month', label: 'Month', icon: 'calendar' }, { id: 'agenda', label: 'Agenda', icon: 'clock' }];
</script>
<template>
  <XAppShell title="October 2026" v-bind="shellProps(props)" :tabs="tabs" :actions="[{ icon: 'add', label: 'New event', keys: 'Ctrl+N' }]">
    <div class="x-cal" style="--hd-accent: #EF5500">
      <div class="x-cal__month">
        <h2 class="x-cal__title">October 2026</h2>
        <div class="x-cal__grid" role="grid" aria-label="October 2026">
          <span v-for="(d, i) in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="`d${i}`" class="x-cal__dow">{{ d }}</span>
          <span v-for="n in 3" :key="`p${n}`" class="x-cal__day is-out">{{ 27 + n }}</span>
          <button v-for="n in 31" :key="n" type="button" class="x-cal__day hd-focusable" :class="{ 'is-sel': n === day, 'is-busy': busy.has(n) }" @click="day = n">{{ n }}</button>
          <span v-for="n in 8" :key="`n${n}`" class="x-cal__day is-out">{{ n }}</span>
        </div>
      </div>
      <div class="x-cal__agenda">
        <HdSectionHeader :title="`Saturday ${day} October`" />
        <HdListItem title="Design review" subtitle="14:00 – 15:00 · Room Etesian" />
        <HdListItem title="Lunch with Anna" subtitle="12:30 – 13:30" />
        <HdListItem title="Gym" subtitle="18:00 – 19:00" />
      </div>
    </div>
  </XAppShell>
</template>
<style>
.x-cal { flex: 1; min-height: 0; display: flex; gap: 0; background: var(--hd-c-bg); }
.x-cal__month { flex: 1 1 60%; min-width: 0; padding: 12px 16px; }
.x-cal__title { margin: 0 0 10px; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1.2 var(--hd-font-family-light); }
.x-cal__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--hd-c-divider); border: 1px solid var(--hd-c-divider); }
.x-cal__dow { padding: 4px; background: var(--hd-c-bg); font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); text-align: center; }
.x-cal__day { position: relative; aspect-ratio: 1.5; padding: 4px 6px; border: 0; background: var(--hd-surface-card); color: var(--hd-surface-card-fg); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); text-align: left; vertical-align: top; cursor: pointer; display: block; }
.x-cal__day.is-out { color: var(--hd-c-fg-disabled); background: var(--hd-c-bg); }
.x-cal__day.is-busy::after { content: ''; position: absolute; left: 6px; right: 6px; bottom: 5px; height: 3px; background: var(--hd-accent); }
.x-cal__day.is-sel { background: var(--hd-accent); color: #fff; }
.x-cal__day.is-sel::after { background: #fff; }
.x-cal__agenda { flex: 1 1 40%; min-width: 0; border-left: 1px solid var(--hd-c-divider); }
@container (max-width: 640px) { .x-cal { flex-direction: column; } .x-cal__agenda { border-left: 0; } }
</style>
