<script setup lang="ts">
/**
 * The desktop's dock (docs/21-desktop.md): a light floating strip on any edge, as long as its icons.
 * Overview button | separator | pinned and running apps | separator | recycle bin (always last). A running app has a dot on
 * the edge side, the focused one a longer bar. Hovering a running app shows its card: its state ("In front · Left half",
 * "Minimised"), the app's own line (the `card` slot: what is playing, how much mail is unread), Show or Minimise, and Close;
 * with `preview` it also shows the live window (the `preview` slot). Auto-hidden, it slides off its edge and comes back
 * when the pointer reaches that edge. Editing (Edit dock): a dashed outline, × on each item, a handle that drags the dock
 * to the nearest edge, and the settings gear.
 */
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import HdSquircle from '../../components/HdSquircle.vue';
import HdIcon from '../../components/HdIcon.vue';
import HdTooltip from '../../components/HdTooltip.vue';
import { GAP, dockThickness, type DockPos } from './geometry';
import type { IconTone } from '../../lighting';

export interface ShellDockItem { id: string; title: string; icon: string; color: string; tone?: IconTone; running: boolean; active: boolean; min: boolean; state: string }
const props = withDefaults(defineProps<{
  items: ShellDockItem[]; overviewOpen?: boolean; position?: DockPos; size?: number; autoHide?: boolean; panel?: boolean; editing?: boolean;
  launcher?: boolean; trash?: boolean; preview?: boolean;
}>(), { position: 'left', size: 44, launcher: true, trash: true, preview: false });
const emit = defineEmits<{ overview: []; item: [id: string]; minimise: [id: string]; close: [id: string]; settings: []; remove: [id: string]; move: [pos: DockPos] }>();
const vertical = computed(() => props.position === 'left' || props.position === 'right');
const nav = ref<HTMLElement>();

/* auto-hide: revealed, it stays until the pointer is further from its edge than the dock reaches */
const revealed = ref(false);
function away(e: PointerEvent) {
  const a = nav.value?.offsetParent?.getBoundingClientRect(); if (!a) return;
  const d = { left: e.clientX - a.left, right: a.right - e.clientX, top: e.clientY - a.top, bottom: a.bottom - e.clientY }[props.position];
  if (d > dockThickness(props.size) + 2 * GAP && !card.value) revealed.value = false;
}
watch(revealed, (on) => (on ? window.addEventListener('pointermove', away) : window.removeEventListener('pointermove', away)));
const hidden = computed(() => props.autoHide && !props.editing && !revealed.value);
const style = computed(() => {
  const s: Record<string, string> = { '--x-dock-i': `${props.size}px`, [props.position]: `${GAP}px` };
  if (props.panel) Object.assign(s, vertical.value ? { top: `${GAP}px`, bottom: `${GAP}px` } : { left: `${GAP}px`, right: `${GAP}px` });
  return s;
});
const tip = computed(() => (props.position === 'top' ? 'bottom' : 'top') as 'top' | 'bottom');

/* the hover card of a running app: beside the dock, level with the icon; a short delay on leave keeps it through the gaps */
const card = ref<{ id: string; style: Record<string, string> } | null>(null);
let t = 0;
function enter(it: ShellDockItem, e: PointerEvent) {
  window.clearTimeout(t);
  if (!it.running || props.editing) { card.value = null; return; }
  const slot = (e.currentTarget as HTMLElement).getBoundingClientRect(), area = nav.value?.offsetParent?.getBoundingClientRect(); if (!area) return;
  const off = `${dockThickness(props.size) + GAP + 12}px`, cx = `${slot.left + slot.width / 2 - area.left}px`, cy = `${slot.top - area.top}px`;
  const st: Record<string, string> = props.position === 'left' ? { left: off, top: cy } : props.position === 'right' ? { right: off, top: cy }
    : props.position === 'top' ? { top: off, left: cx, transform: 'translateX(-50%)' } : { bottom: off, left: cx, transform: 'translateX(-50%)' };
  t = window.setTimeout(() => (card.value = { id: it.id, style: st }), card.value ? 0 : 400);
}
function leave() { window.clearTimeout(t); t = window.setTimeout(() => (card.value = null), 250); }
function keep() { window.clearTimeout(t); }
const carded = computed(() => props.items.find((i) => i.id === card.value?.id));
function act(f: () => void) { f(); card.value = null; }
onBeforeUnmount(() => { window.removeEventListener('pointermove', away); window.clearTimeout(t); });

/* the move handle: drag, and on release the dock goes to the screen edge nearest the pointer */
const moving = ref(false);
function moveDown(e: PointerEvent) { moving.value = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }
function moveUp(e: PointerEvent) {
  if (!moving.value) return; moving.value = false;
  const a = nav.value?.offsetParent?.getBoundingClientRect(); if (!a) return;
  const d = { left: e.clientX - a.left, right: a.right - e.clientX, top: e.clientY - a.top, bottom: a.bottom - e.clientY };
  emit('move', (Object.keys(d) as DockPos[]).reduce((m, k) => (d[k] < d[m] ? k : m)));
}
</script>
<template>
  <span v-if="hidden" class="x-dock-edge x-shell-dock-edge" :class="`x-dock-edge--${position}`" aria-hidden="true" @pointerenter="revealed = true"></span>
  <nav ref="nav" class="x-dock hd-on-home x-shell-dock" :class="[`x-dock--${position}`, { 'is-vertical': vertical, 'is-panel': panel, 'is-hidden': hidden, 'is-autohide': autoHide, 'is-editing': editing }]"
    :style="style" aria-label="Dock">
    <span v-if="launcher" class="x-dock__slot">
      <HdTooltip text="Overview (Super)" :placement="tip"><button type="button" class="x-dock__launcher hd-sq hd-focusable" :class="{ 'is-active': overviewOpen }" aria-label="Overview" @click="emit('overview')"><HdIcon name="grid" :size="Math.round(size / 2)" /></button></HdTooltip>
      <button v-if="editing" type="button" class="x-dock__rm hd-sq x-shell-dock__rm" aria-label="Remove the Overview button" @click="emit('remove', 'launcher')">×</button>
    </span>
    <span v-if="items.length && launcher" class="x-dock__div" aria-hidden="true"></span>
    <span v-for="i in items" :key="i.id" class="x-dock__slot" :class="{ 'is-running': i.running, 'is-active': i.active }" @pointerenter="enter(i, $event)" @pointerleave="leave">
      <button type="button" class="x-dock__item hd-sq hd-focusable" :aria-label="i.running ? `${i.title}, ${i.state}` : i.title" :title="i.running ? undefined : i.title" @click="emit('item', i.id)">
        <HdSquircle :size="size" :color="i.color" lighting="lit" :tone="i.tone"><HdIcon :name="i.icon" :size="Math.round(size / 2)" :lit="i.tone === 'light' ? 'dark' : true" /></HdSquircle></button>
      <span v-if="i.running" class="x-dock__run" aria-hidden="true"></span>
      <button v-if="editing" type="button" class="x-dock__rm hd-sq x-shell-dock__rm" :aria-label="`Remove ${i.title}`" @click="emit('remove', i.id)">×</button>
    </span>
    <span v-if="trash" class="x-dock__div" aria-hidden="true"></span>
    <span v-if="trash" class="x-dock__slot"><HdTooltip text="Recycle bin" :placement="tip"><button type="button" class="x-dock__applet hd-sq hd-focusable" aria-label="Recycle bin"><HdIcon name="delete" :size="Math.round(size / 2)" /></button></HdTooltip>
      <button v-if="editing" type="button" class="x-dock__rm hd-sq x-shell-dock__rm" aria-label="Remove the recycle bin" @click="emit('remove', 'trash')">×</button></span>
    <template v-if="editing">
      <span class="x-dock__move" title="Drag to any screen edge" role="button" aria-label="Move the dock: drag to any screen edge" @pointerdown="moveDown" @pointerup="moveUp" @pointercancel="moveUp"><i></i><i></i><i></i></span>
      <button type="button" class="x-dock__gear hd-sq hd-focusable" aria-label="Dock settings" @click="emit('settings')"><HdIcon name="settings" :size="16" /></button>
    </template>
  </nav>
  <div v-if="carded" class="x-shell-hcard hd-on-overlay" role="dialog" :aria-label="carded.title" :style="card!.style" @pointerenter="keep" @pointerleave="leave">
    <div v-if="preview && $slots.preview" class="x-shell-hcard__prev" inert><slot name="preview" :id="carded.id" /></div>
    <header><HdSquircle :size="28" :color="carded.color" lighting="lit" :tone="carded.tone"><HdIcon :name="carded.icon" :size="16" :lit="carded.tone === 'light' ? 'dark' : true" /></HdSquircle><b>{{ carded.title }}</b></header>
    <p class="x-shell-hcard__state">{{ carded.state }}</p>
    <slot name="card" :id="carded.id" />
    <footer>
      <button type="button" class="x-shell-hcard__btn hd-focusable" @click="act(() => (carded!.min ? emit('item', carded!.id) : emit('minimise', carded!.id)))">{{ carded.min ? 'Show' : 'Minimise' }}</button>
      <button type="button" class="x-shell-hcard__btn x-shell-hcard__btn--close hd-focusable" @click="act(() => emit('close', carded!.id))">Close</button>
    </footer>
  </div>
</template>
<style>
.x-shell-dock-edge { pointer-events: auto; width: 10px; } .x-shell-dock-edge.x-dock-edge--bottom, .x-shell-dock-edge.x-dock-edge--top { width: auto; height: 10px; }
.x-shell-dock__rm { padding: 0; border: 0; cursor: pointer; font: 700 13px/1 var(--hd-font-family-base); }
.x-shell-dock .x-dock__move { touch-action: none; }
/* above the windows (their z stays under 1000), under the switcher and the Overview */
.x-dock.x-shell-dock { z-index: 7500; -webkit-backdrop-filter: none; backdrop-filter: none; } /* blur bleeds on GPUs: none on the web */ .x-dock-edge.x-shell-dock-edge { z-index: 7499; }
.x-shell-hcard { position: absolute; z-index: 7600; min-width: 240px; max-width: 320px; padding: 12px 12px 6px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg);
  box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); font: 400 var(--hd-font-size-small)/1.4 var(--hd-font-family-base); }
.x-shell-hcard header { display: flex; align-items: center; gap: 10px; font-size: var(--hd-font-size-medium); }
.x-shell-hcard__state { margin: 6px 0 0; color: var(--hd-c-fg-secondary); }
.x-shell-hcard p { margin: 4px 0 0; }
.x-shell-hcard footer { display: flex; justify-content: flex-end; gap: 4px; margin-top: 6px; }
.x-shell-hcard__btn { min-width: 44px; height: 36px; padding: 0 12px; border: 0; border-radius: 6px; background: none; color: var(--hd-c-accent-text); font: 700 var(--hd-font-size-small)/1 var(--hd-font-family-base); cursor: pointer; }
.x-shell-hcard__btn:hover { background: var(--hd-c-pressed); }
.x-shell-hcard__btn--close { color: var(--hd-color-palette-warning); }
.x-shell-hcard__prev { width: 280px; height: 170px; margin: -4px 0 10px; overflow: hidden; border-radius: 6px; pointer-events: none; }
</style>
