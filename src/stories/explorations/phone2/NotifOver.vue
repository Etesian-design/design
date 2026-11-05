<script setup lang="ts">
/**
 * Notifications over apps, four styles (Settings → Events and notifications → Over apps). Each slides in from the top;
 * the lock screen is never affected (there a notification only joins the card stack).
 * - n9: as measured on the N9 (2026-11-05): the app's icon appears in the status bar next to the time, then ONE line
 *   slides down over the status bar and scrolls until the whole text has been seen, then slides away; the item is in
 *   Events afterwards. System notices (Charging…) are an inset dark banner with a thin light edge under the status bar.
 * - belle: as Symbian Belle: a black strip across the full width at the top, over the status bar; its transparency is a setting.
 * - card: the lock-screen card floating under the status bar (what the ROM has today).
 * - android: Android's own heads-up (with its buttons), for whoever wants it.
 * - colour: a bubble in the app's colour with squircle-half ends (n = 2.8), the sender's picture a squircle.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdSquircle from '../../../components/HdSquircle.vue';
import HdLockScreenNotificationCard from '../../../components/HdLockScreenNotificationCard.vue';

export type OverStyle = 'n9' | 'belle' | 'card' | 'colour' | 'android';
export type BelleShade = 'light' | 'medium' | 'dark' | 'solid';
/** Colour style: the app's own colour (default), Android's system accent, or a fixed colour (any CSS colour). */
export type BubbleColour = 'app' | 'system' | string;
const props = withDefaults(defineProps<{ look?: OverStyle; shade?: BelleShade; colour?: BubbleColour; kind?: 'message' | 'system'; loop?: boolean; replay?: number }>(),
  { look: 'n9', shade: 'medium', colour: 'app', kind: 'message', loop: true, replay: 0 });
/** Android's system accent (Material You), as a stand-in colour here */
const SYSTEM_ACCENT = '#6750A4';
const bubble = computed(() => props.colour === 'app' ? msg.value.accent : props.colour === 'system' ? SYSTEM_ACCENT : props.colour);

const SHADE: Record<BelleShade, number> = { light: 0.55, medium: 0.72, dark: 0.86, solid: 1 };
const msg = computed(() => props.kind === 'system'
  ? { icon: 'battery', from: 'Charging', text: '', accent: '#3FA34D' }
  : { icon: 'message', from: 'Anna Virtanen', text: 'Are we still on for lunch? I can be there by one, or later if that suits you better.', accent: '#09A7CC' });

/** phase: idle → icon (status bar icon only, N9) → in (shown) → out */
const phase = ref<'idle' | 'icon' | 'in' | 'out'>('idle');
const iconShown = ref(false);
const scroll = ref(0);            // px the N9 ticker has scrolled
const tickerText = ref<HTMLElement>();
const tickerBox = ref<HTMLElement>();
let timers: ReturnType<typeof setTimeout>[] = [];
const at = (ms: number, f: () => void) => timers.push(setTimeout(f, ms));
const clear = () => { timers.forEach(clearTimeout); timers = []; };

function run() {
  clear(); phase.value = 'idle'; iconShown.value = false; scroll.value = 0;
  const n9Ticker = props.look === 'n9' && props.kind === 'message';
  let t = 600;
  if (n9Ticker) { at(t, () => { iconShown.value = true; phase.value = 'icon'; }); t += 700; }
  at(t, () => { phase.value = 'in'; });
  const leave = (ms: number) => {
    at(ms, () => { phase.value = 'out'; });
    at(ms + 400, () => { phase.value = 'idle'; if (props.loop) at(1400, run); });
  };
  if (n9Ticker) {
    // slide down (250ms), a moment to read, then scroll at 60px/s until the end of the text is in view, hold, away
    at(t + 900, () => {
      const box = tickerBox.value?.querySelector('.no-tick__clip') as HTMLElement | null;
      scroll.value = Math.max(0, (tickerText.value?.scrollWidth ?? 0) - (box?.clientWidth ?? 0));
      leave(scrollMs.value + 1200);
    });
  } else leave(t + 3500);
}
const scrollMs = computed(() => Math.round((scroll.value / 60) * 1000));
onMounted(run);
onBeforeUnmount(clear);
watch(() => [props.look, props.kind, props.replay], run);
const shown = computed(() => phase.value === 'in');
</script>

<template>
  <div class="no" :aria-label="`Notification over an app, ${look} style`">
    <!-- status bar -->
    <div class="no-sb">
      <HdIcon name="battery" :size="15" /><span class="no-sb__sig"><i v-for="i in 4" :key="i" :style="{ height: `${3 + i * 2}px` }" /></span><HdIcon name="wifi" :size="13" />
      <span class="no-sb__sp" />
      <Transition name="no-fade"><span v-if="iconShown" class="no-sb__app"><HdIcon :name="msg.icon" :size="13" /></span></Transition>
      <span class="no-sb__t">14:20</span>
    </div>

    <!-- the app underneath: a light page with colour, so the transparency shows -->
    <div class="no-app">
      <div class="no-app__head" style="background: #E8742A">Gallery</div>
      <div class="no-app__grid"><i v-for="i in 18" :key="i" :style="{ background: `hsl(${(i * 47) % 360} 55% ${45 + (i % 3) * 10}%)` }" /></div>
    </div>

    <!-- N9: one line over the status bar, scrolling -->
    <Transition name="no-drop">
      <div v-if="look === 'n9' && kind === 'message' && shown" ref="tickerBox" class="no-tick" role="status">
        <HdIcon :name="msg.icon" :size="13" class="no-tick__i" />
        <span class="no-tick__clip"><span ref="tickerText" class="no-tick__run" :style="{ transform: `translateX(${-scroll}px)`, transitionDuration: `${scrollMs}ms` }"><b>{{ msg.from }}</b>&nbsp; {{ msg.text }}</span></span>
      </div>
    </Transition>
    <!-- N9 system notice: inset dark banner with a thin light edge -->
    <Transition name="no-drop">
      <div v-if="look === 'n9' && kind === 'system' && shown" class="no-sys" role="status"><HdIcon :name="msg.icon" :size="20" /><span>{{ msg.from }}</span></div>
    </Transition>
    <!-- Belle: full-width strip at the top -->
    <Transition name="no-drop">
      <div v-if="look === 'belle' && shown" class="no-belle" role="status" :style="{ background: `rgba(0,0,0,${SHADE[shade]})` }">
        <HdSquircle :size="36" :color="msg.accent" lighting="lit"><HdIcon :name="msg.icon" :size="20" lit /></HdSquircle>
        <span class="no-belle__t"><b>{{ msg.from }}</b><span v-if="msg.text">{{ msg.text }}</span></span>
      </div>
    </Transition>
    <!-- Card: the lock-screen card under the status bar -->
    <Transition name="no-drop">
      <div v-if="look === 'card' && shown" class="no-card" role="status">
        <HdLockScreenNotificationCard :message="msg.text || msg.from" :source="msg.text ? msg.from : 'System'" time="14:20" :icon="msg.icon" :accent="msg.accent" />
      </div>
    </Transition>
    <!-- Android: the stock heads-up -->
    <Transition name="no-drop">
      <div v-if="look === 'android' && shown" class="no-and" role="status">
        <div class="no-and__top"><HdIcon :name="msg.icon" :size="14" /><span>{{ msg.text ? 'Messages' : 'System' }} · now</span></div>
        <b>{{ msg.from }}</b><span v-if="msg.text">{{ msg.text }}</span>
        <div v-if="msg.text" class="no-and__acts"><span>Reply</span><span>Mark as read</span></div>
      </div>
    </Transition>
    <!-- Colour: a squircle bubble in the app's colour -->
    <Transition name="no-drop">
      <div v-if="look === 'colour' && shown" class="no-col" role="status" :style="{ '--no-acc': bubble }">
        <HdSquircle :size="40" :color="'rgba(255,255,255,.22)'" lighting="flat"><HdIcon :name="msg.icon" :size="22" /></HdSquircle>
        <span class="no-col__t"><b>{{ msg.from }}</b><span v-if="msg.text">{{ msg.text }}</span></span>
      </div>
    </Transition>
  </div>
</template>

<style>
.no { position: relative; width: 360px; height: 640px; flex: none; display: flex; flex-direction: column; overflow: hidden; background: #000; color: #fff; font-family: var(--hd-font-family-base); }
.no-sb { flex: none; position: relative; z-index: 6; height: 22px; display: flex; align-items: center; gap: 5px; padding: 0 6px; background: #000; color: #fff; font-size: 13px; }
.no-sb__sig { display: inline-flex; align-items: flex-end; gap: 1px; height: 11px; } .no-sb__sig i { width: 3px; background: currentColor; }
.no-sb__sp { flex: 1; } .no-sb__t { font-variant-numeric: tabular-nums; }
.no-sb__app { display: inline-flex; color: #5BB8FF; }
.no-app { flex: 1; display: flex; flex-direction: column; background: #F2F2F2; border-radius: 7px 7px 0 0; overflow: hidden; }
.no-app__head { height: 72px; flex: none; display: flex; align-items: center; padding: 0 16px; color: #fff; font-size: 26px; }
.no-app__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; padding: 3px; }
.no-app__grid i { aspect-ratio: 1; }

/* N9 ticker: exactly the status bar's line, over it */
.no-tick { position: absolute; z-index: 8; top: 0; left: 0; right: 0; height: 22px; display: flex; align-items: center; gap: 6px; padding: 0 8px; background: #000; color: #fff; font-size: 13px; }
.no-tick__i { flex: none; color: #5BB8FF; }
.no-tick__clip { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; }
.no-tick__run { display: inline-block; transition-property: transform; transition-timing-function: linear; }
/* N9 system notice */
.no-sys { position: absolute; z-index: 8; top: 26px; left: 8px; right: 8px; display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1px solid rgba(255,255,255,.28);
  border-radius: var(--hd-radius-card, 8px); background: rgba(16,16,16,.86); color: #fff; font-size: 17px; }
/* Belle strip */
.no-belle { position: absolute; z-index: 8; top: 0; left: 0; right: 0; min-height: 64px; display: flex; align-items: center; gap: 12px; padding: 8px 12px; color: #fff; }
.no-belle__t, .no-col__t { display: flex; flex-direction: column; min-width: 0; font-size: 15px; line-height: 1.3; }
.no-belle__t span, .no-col__t span { font-size: 13px; opacity: .85; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* Card */
.no-card { position: absolute; z-index: 8; top: 30px; left: 12px; right: 12px; }
.no-card .hd-lock-card { background: rgba(12, 15, 18, .92); box-shadow: 0 6px 18px rgba(0,0,0,.45); -webkit-backdrop-filter: none; backdrop-filter: none; }
/* Android heads-up (stock look: a card) */
.no-and { position: absolute; z-index: 8; top: 30px; left: 8px; right: 8px; display: flex; flex-direction: column; gap: 2px; padding: 12px 16px; border-radius: var(--hd-radius-card, 8px);
  background: #F3EDF7; color: #1D1B20; font-size: 14px; box-shadow: 0 4px 14px rgba(0,0,0,.35); }
.no-and__top { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #49454F; }
.no-and span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.no-and__acts { display: flex; gap: 20px; margin-top: 6px; color: #6750A4; font-weight: 700; font-size: 13px; }
/* Colour: squircle-half ends (the caps scale with the height) */
.no-col { position: absolute; z-index: 8; top: 30px; left: 10px; right: 10px; height: 64px; display: flex; align-items: center; gap: 12px; padding: 0 22px 0 14px; color: #fff;
  background: linear-gradient(color-mix(in srgb, var(--no-acc) 82%, #fff), var(--no-acc) 50%, color-mix(in srgb, var(--no-acc) 82%, #000));
  -webkit-mask: var(--hd-sq-cap-l) left center / auto 100% no-repeat, var(--hd-sq-cap-r) right center / auto 100% no-repeat; -webkit-mask-composite: source-in;
  mask: var(--hd-sq-cap-l) left center / auto 100% no-repeat, var(--hd-sq-cap-r) right center / auto 100% no-repeat; mask-composite: intersect; }

/* every style slides in from the top */
.no-drop-enter-active, .no-drop-leave-active { transition: transform 250ms var(--hd-motion-easing-out, ease-out), opacity 250ms; }
.no-drop-enter-from, .no-drop-leave-to { transform: translateY(calc(-100% - 30px)); opacity: 0; }
.no-tick.no-drop-enter-from, .no-tick.no-drop-leave-to { transform: translateY(-100%); opacity: 1; }
.no-fade-enter-active { transition: opacity 200ms; } .no-fade-enter-from { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .no-drop-enter-active, .no-drop-leave-active, .no-tick__run { transition: none; } }
</style>
