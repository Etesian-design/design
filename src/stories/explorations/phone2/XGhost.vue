<script setup lang="ts">
/**
 * Interactive: dismissed notifications linger as faded "ghost rows" at the end of Notifications (Android extra, off by default).
 * - Size: small (one line, icon shrunk to the line, like Today) or big (like the other notifications).
 * - Show: 0.5 (big only), 1, 1.5, 2, 2.5 or 3 rows; a half row is cut in half and almost fully faded, so the fade is gradual.
 * - The rows act as ONE item: tapping opens the Earlier page; swiping it away expires them all (as if their time ran out).
 * - Keep for: hours, or forever.
 * - Dismissing (swipe a notification): it collapses out of the list and drops in as the top ghost row; the oldest one fades out.
 */
import { computed, reactive, ref } from 'vue';
import HdSquircle from '../../../components/HdSquircle.vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdEventsFeedItem from '../../../components/HdEventsFeedItem.vue';
import HdSectionHeader from '../../../components/HdSectionHeader.vue';
import HdButton from '../../../components/HdButton.vue';
import HdToolBar from '../../../components/HdToolBar.vue';

export type GhostSize = 'small' | 'big';
const props = withDefaults(defineProps<{ size?: GhostSize; amount?: number; page?: boolean }>(), { size: 'small', amount: 2.5, page: false });
type N = { id: number; title: string; body: string; time: string; icon: string; accent: string };
let seq = 0;
const mk = (title: string, body: string, time: string, icon: string, accent: string): N => ({ id: ++seq, title, body, time, icon, accent });
const live = ref<N[]>([
  mk('Mikko Laine', 'Band practice moved to Thursday?', '2 min', 'message', '#09A7CC'),
  mk('Design weekly', 'Why squircles feel softer', '1 h', 'mail', '#0067BC'),
  mk('Calendar', 'Design review 14:00', 'in 2 h', 'calendar', '#EF5500'),
]);
const ghosts = ref<N[]>([ // newest first
  mk('Sara Koski', 'Photos from Saturday', '09:12', 'message', '#09A7CC'),
  mk('Store', 'Your receipt', '08:40', 'mail', '#0067BC'),
  mk('Clock', 'Alarm 07:00 dismissed', '07:00', 'clock', '#5A5A5A'),
  mk('Weather', 'Rain from 16:00', '06:30', 'globe', '#2A86D8'),
]);
const openEarlier = ref(props.page);
const st = reactive({ size: props.size, amount: props.amount });
defineExpose({ live, ghosts, openEarlier, st, dismiss, expireAll });

/** the visible ghost rows: whole rows, then an optional half row */
const rows = computed(() => {
  const amt = st.amount > 0 && st.amount < 1 && st.size === 'small' ? 1 : st.amount; // 0.5 only exists for big rows
  const whole = Math.floor(amt), half = amt % 1 !== 0;
  return ghosts.value.slice(0, whole + (half ? 1 : 0)).map((n, i) => ({ n, half: half && i === whole, o: 0.5 - i * 0.05 }));
});

function dismiss(id: number) {
  const i = live.value.findIndex((n) => n.id === id); if (i < 0) return;
  const [n] = live.value.splice(i, 1);
  ghosts.value.unshift(n!); // drops in as the top ghost row; the list keeps every dismissed one for the Earlier page
}
function expireAll() { ghosts.value = []; }

/** horizontal swipe on a row: past 30% of the width it goes */
const drag = reactive({ id: -1, x0: 0, dx: 0, w: 1 });
function pdown(id: number, e: PointerEvent) { drag.id = id; drag.x0 = e.clientX; drag.dx = 0; drag.w = (e.currentTarget as HTMLElement).offsetWidth || 360; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); }
function pmove(e: PointerEvent) { if (drag.id !== -1) drag.dx = e.clientX - drag.x0; }
function pup(onTap: () => void) {
  const id = drag.id, far = Math.abs(drag.dx) > drag.w * 0.3, moved = Math.abs(drag.dx) > 6;
  drag.id = -1; drag.dx = 0;
  if (far) { if (id === 0) expireAll(); else dismiss(id); } else if (!moved) onTap();
}
const dragStyle = (id: number) => (drag.id === id ? { transform: `translateX(${drag.dx}px)`, opacity: String(1 - Math.min(0.7, Math.abs(drag.dx) / drag.w)), transition: 'none' } : {});
</script>
<template>
  <div class="xg hd-theme-dark">
    <template v-if="!openEarlier">
      <HdSectionHeader title="Notifications" align="start" large><template #action><HdButton variant="default" class="hd-events-btn" @click="live = []; expireAll()">Clear</HdButton></template></HdSectionHeader>
      <TransitionGroup name="xg-n" tag="div" class="xg__list">
        <div v-for="n in live" :key="n.id" class="xg__row" :style="dragStyle(n.id)" @pointerdown="pdown(n.id, $event)" @pointermove="pmove" @pointerup="pup(() => {})">
          <HdEventsFeedItem :title="n.title" :body="n.body" :time="n.time" :icon="n.icon" :accent="n.accent" />
        </div>
      </TransitionGroup>
      <!-- the ghost rows: one item (tap = Earlier page, swipe = expire them all) -->
      <div v-if="rows.length" class="xg__ghosts" :class="'xg__ghosts--' + st.size" role="button" :aria-label="`Earlier notifications (${ghosts.length})`" :style="dragStyle(0)"
        @pointerdown="pdown(0, $event)" @pointermove="pmove" @pointerup="pup(() => (openEarlier = true))">
        <TransitionGroup name="xg-g">
          <div v-for="r in rows" :key="r.n.id" class="xg__g" :class="{ 'xg__g--half': r.half }" :style="{ opacity: r.o }">
            <template v-if="st.size === 'small'"><HdSquircle :size="22" :color="r.n.accent" lighting="lit"><HdIcon :name="r.n.icon" :size="13" lit /></HdSquircle><span class="xg__t">{{ r.n.title }}: {{ r.n.body }}</span><em>{{ r.n.time }}</em></template>
            <HdEventsFeedItem v-else tabindex="-1" :title="r.n.title" :body="r.n.body" :time="r.n.time" :icon="r.n.icon" :accent="r.n.accent" />
          </div>
        </TransitionGroup>
      </div>
      <HdSectionHeader title="Feed" align="start" large><template #action><HdButton variant="default" class="hd-events-btn">Refresh</HdButton></template></HdSectionHeader>
      <HdEventsFeedItem title="Tech news: Front page" body="Show HN: a squircle calculator for the Etesian design language" time="01:23" icon="globe" accent="#FF8500" />
    </template>
    <template v-else>
      <h2 class="xg__h">Earlier</h2>
      <HdEventsFeedItem v-for="n in ghosts" :key="n.id" :title="n.title" :body="n.body" :time="n.time" :icon="n.icon" :accent="n.accent" />
      <p v-if="!ghosts.length" class="xg__empty">Nothing dismissed</p>
      <HdToolBar class="xg__bar" variant="dark" back label="Earlier toolbar" @back="openEarlier = false" @click="openEarlier = false" />
    </template>
  </div>
</template>
<style>
.xg { position: relative; width: 360px; min-height: 560px; padding-bottom: 56px; background: #000; color: #fff; user-select: none; touch-action: pan-y; }
.xg__row { touch-action: pan-y; }
.xg__ghosts { cursor: pointer; touch-action: pan-y; }
.xg__g { overflow: hidden; transition: opacity .35s; }
.xg__ghosts--small .xg__g { display: flex; align-items: center; gap: 10px; min-height: 30px; padding: 0 16px; font-size: 15px; white-space: nowrap; }
.xg__ghosts--small .xg__g--half { height: 16px; min-height: 0; align-items: flex-start; padding-top: 4px; }
.xg__ghosts--big .xg__g--half { height: 40px; }
/* the half row slips under the Feed header: cut, and faded only where the header covers it (no empty band) */
.xg__g--half { -webkit-mask-image: linear-gradient(#000 20%, transparent); mask-image: linear-gradient(#000 20%, transparent); }
.xg__ghosts:has(.xg__g--half) + .hd-section-header { margin-top: -10px; position: relative; }
.xg__t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.xg__g em { font-style: normal; font-size: 13px; }
.xg__h { margin: 0; padding: 20px 16px 12px; font: 300 32px/1.2 var(--hd-font-family-light); border-bottom: 1px solid #333; }
.xg__empty { padding: 24px 16px; color: #A0A0A0; }
.xg__bar { position: absolute; left: 0; right: 0; bottom: 0; }
/* dismiss: the notification folds out of the list (its height closes), and drops in as the top ghost row */
.xg-n-leave-active { transition: opacity .25s ease-in, transform .25s ease-in, max-height .3s ease-in .1s; max-height: 120px; overflow: hidden; }
.xg-n-leave-to { opacity: 0; transform: translateY(24px) scale(.96); max-height: 0; }
.xg-n-move, .xg-g-move { transition: transform .3s ease-out; }
.xg-g-enter-active { transition: opacity .4s ease-out .2s, transform .4s cubic-bezier(.2, 1.3, .4, 1) .2s; }
.xg-g-enter-from { opacity: .9 !important; transform: translateY(-28px) scale(1.03); }
.xg-g-leave-active { transition: opacity .3s; position: absolute; }
.xg-g-leave-to { opacity: 0 !important; }
</style>
