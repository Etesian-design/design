<script setup lang="ts">
/**
 * The desktop's dock (docs/21-desktop.md): a light floating strip on any edge, as long as its icons.
 * Overview button | separator | pinned and running apps | separator | recycle bin (always last). A running app has a dot on
 * the edge side, the focused one a longer bar. Hovering a running app shows its card: its state ("In front · Left half",
 * "Minimised"), the app's own line (the `card` slot: what is playing, how much mail is unread), Show or Minimise, and Close;
 * with `preview` it also shows the window: the host's `preview` slot, or else a scaled copy of the open window as it is now. Auto-hidden, it slides off its edge and comes back
 * when the pointer reaches that edge. Editing (Edit dock): a dashed outline, × on each item, a handle that drags the dock
 * to the nearest edge, and the settings gear.
 */
import { ref, computed, watch, nextTick, onBeforeUnmount, useSlots } from 'vue';
import HdSquircle from '../../components/HdSquircle.vue';
import HdIcon from '../../components/HdIcon.vue';
import HdTooltip from '../../components/HdTooltip.vue';
import { GAP, dockThickness, type DockPos } from './geometry';
import type { IconTone } from '../../lighting';

export interface ShellDockItem { id: string; title: string; icon: string; color: string; tone?: IconTone; running: boolean; active: boolean; min: boolean; state: string }
const props = withDefaults(defineProps<{
  items: ShellDockItem[]; overviewOpen?: boolean; position?: DockPos; size?: number; autoHide?: boolean; panel?: boolean; editing?: boolean;
  launcher?: boolean; trash?: boolean; preview?: boolean;
  /** how many items are in the recycle bin: 0 shows it empty, more shows it full with the count */
  binCount?: number;
}>(), { position: 'left', size: 44, launcher: true, trash: true, preview: false, binCount: 0 });
const emit = defineEmits<{ overview: []; bin: []; item: [id: string]; minimise: [id: string]; close: [id: string]; settings: []; remove: [id: string]; move: [pos: DockPos] }>();
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

/* the preview without a host slot: a copy of the window (canvases copied as pixels), scaled to the card; none when minimised */
const slots = useSlots();
const PREV_W = 280, PREV_H = 170;
const shot = ref<HTMLElement>();
const hasShot = ref(false);
watch(() => (props.preview ? carded.value?.id : undefined), async (id) => {
  hasShot.value = false;
  if (!id || slots.preview) return;
  const win = document.querySelector<HTMLElement>(`[data-win="${CSS.escape(id)}"]`);
  if (!win || !win.offsetWidth) return;
  hasShot.value = true;
  await nextTick();
  if (!shot.value) return;
  const copy = win.cloneNode(true) as HTMLElement;
  const from = win.querySelectorAll('canvas'), to = copy.querySelectorAll('canvas');
  from.forEach((c, i) => { const t = to[i]!; t.width = c.width; t.height = c.height; try { t.getContext('2d')?.drawImage(c, 0, 0); } catch { /* a canvas it cannot read */ } });
  copy.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
  copy.removeAttribute('data-win');
  const k = Math.min(PREV_W / win.offsetWidth, PREV_H / win.offsetHeight);
  Object.assign(copy.style, { position: 'absolute', left: `${(PREV_W - win.offsetWidth * k) / 2}px`, top: `${(PREV_H - win.offsetHeight * k) / 2}px`, width: `${win.offsetWidth}px`, height: `${win.offsetHeight}px`, transform: `scale(${k})`, transformOrigin: '0 0', zIndex: 'auto' });
  shot.value.replaceChildren(copy);
});
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
      <HdTooltip text="Overview" :placement="tip"><button type="button" class="x-dock__item x-shell-dock__overview hd-focusable" :class="{ 'is-active': overviewOpen }" aria-label="Overview" @click="emit('overview')">
        <HdSquircle :size="size" color="#E9EAEC" lighting="lit" tone="light"><HdIcon name="grid" :size="Math.round(size / 2)" lit="dark" /></HdSquircle></button></HdTooltip>
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
    <span v-if="trash" class="x-dock__slot"><HdTooltip :text="binCount ? `Recycle bin · ${binCount} item${binCount === 1 ? '' : 's'}` : 'Recycle bin · empty'" :placement="tip">
      <button type="button" class="x-dock__item x-shell-dock__bin hd-focusable" :class="{ 'is-full': binCount > 0 }" :aria-label="binCount ? `Recycle bin, ${binCount} item${binCount === 1 ? '' : 's'}` : 'Recycle bin, empty'" @click="emit('bin')">
        <HdSquircle :size="size" :color="binCount ? '#8C9199' : '#5E636B'" lighting="lit"><HdIcon name="delete" :size="Math.round(size / 2)" lit /></HdSquircle>
        <b v-if="binCount" class="x-shell-dock__count hd-sqm" aria-hidden="true">{{ binCount > 99 ? '99+' : binCount }}</b></button></HdTooltip>
      <button v-if="editing" type="button" class="x-dock__rm hd-sq x-shell-dock__rm" aria-label="Remove the recycle bin" @click="emit('remove', 'trash')">×</button></span>
    <template v-if="editing">
      <span class="x-dock__move" title="Drag to any screen edge" role="button" aria-label="Move the dock: drag to any screen edge" @pointerdown="moveDown" @pointerup="moveUp" @pointercancel="moveUp"><i></i><i></i><i></i></span>
      <button type="button" class="x-dock__gear hd-sq hd-focusable" aria-label="Dock settings" @click="emit('settings')"><HdIcon name="settings" :size="16" /></button>
    </template>
  </nav>
  <div v-if="carded" class="x-shell-hcard hd-on-overlay" role="dialog" :aria-label="carded.title" :style="card!.style" @pointerenter="keep" @pointerleave="leave">
    <div v-if="preview && $slots.preview" class="x-shell-hcard__prev" inert><slot name="preview" :id="carded.id" /></div>
    <div v-else-if="preview && hasShot" ref="shot" class="x-shell-hcard__prev x-shell-hcard__shot" inert data-test="dock-preview"></div>
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
/* a dock that is always shown sits under the windows: a floating window can be dragged over it (a maximised one stops at its edge,
   the work area); an auto-hiding dock comes up over them */
.x-dock.x-shell-dock:not(.is-autohide) { z-index: 1; } /* above the widgets (0), under the windows (2 and up: XShell draws them at z + 1) */
.x-dock.x-shell-dock.is-autohide { z-index: 7500; }
.x-dock.x-shell-dock { -webkit-backdrop-filter: none; backdrop-filter: none; }
/* glass, as the N9's: a dark tinted pane lit from above, a bright top edge, a soft reflection across its upper half and a dark
   lower edge; gradients only (blur bleeds on GPUs). The icons sit 6 px from every edge. */
.x-dock.x-shell-dock { gap: 6px; padding: 6px; border-radius: calc(var(--x-dock-i) * .36 + 6px); color: #fff;
  background: linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,.05) 48%, rgba(255,255,255,0) 52%, rgba(255,255,255,.04)), rgba(14,16,20,.62);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.32), inset 0 0 0 1px rgba(255,255,255,.1), inset 0 -1px 0 rgba(0,0,0,.45), 0 10px 32px rgba(0,0,0,.5); }
.x-dock.x-shell-dock::before { content: ''; position: absolute; inset: 1px 1px 50% 1px; border-radius: inherit; border-bottom-left-radius: 40% 12px; border-bottom-right-radius: 40% 12px;
  background: linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.03)); pointer-events: none; }
.x-dock.x-shell-dock:not(.is-vertical)::before { inset: 1px 1px 52% 1px; }
.x-dock.x-shell-dock.is-panel { border-radius: var(--hd-radius-card); }
.x-shell-dock .x-dock__item { position: relative; width: var(--x-dock-i); height: var(--x-dock-i); border-radius: calc(var(--x-dock-i) * .3); background: none; --hd-sq-size: var(--x-dock-i); }
.x-shell-dock .x-dock__item:hover, .x-shell-dock .x-dock__slot.is-active .x-dock__item, .x-shell-dock__overview.is-active { --hd-sq-fill: transparent; filter: brightness(1.12); }
.x-shell-dock .x-dock__div { width: 60%; margin: 1px 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent); }
.x-dock.x-shell-dock:not(.is-vertical) .x-dock__div { width: 1px; height: 60%; margin: 0 1px; background: linear-gradient(transparent, rgba(255,255,255,.22), transparent); }
.x-shell-dock .x-dock__run { background: rgba(255,255,255,.75); }
.x-shell-dock__count { position: absolute; top: -4px; right: -6px; min-width: 18px; height: 18px; padding: 0 4px; box-sizing: border-box; display: grid; place-items: center;
  background: #FF8500; color: #fff; font: 700 11px/1 var(--hd-font-family-base); box-shadow: 0 1px 3px rgba(0,0,0,.5); } /* blur bleeds on GPUs: none on the web */ .x-dock-edge.x-shell-dock-edge { z-index: 7499; }
.x-shell-hcard { position: absolute; z-index: 7600; min-width: 240px; max-width: 320px; padding: 12px 12px 6px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg);
  box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); font: 400 var(--hd-font-size-small)/1.4 var(--hd-font-family-base); }
.x-shell-hcard header { display: flex; align-items: center; gap: 10px; font-size: var(--hd-font-size-medium); }
.x-shell-hcard__state { margin: 6px 0 0; color: var(--hd-c-fg-secondary); }
.x-shell-hcard p { margin: 4px 0 0; }
.x-shell-hcard footer { display: flex; justify-content: flex-end; gap: 4px; margin-top: 6px; }
.x-shell-hcard__btn { min-width: 44px; height: 36px; padding: 0 12px; border: 0; border-radius: 6px; background: none; color: var(--hd-c-accent-text); font: 700 var(--hd-font-size-small)/1 var(--hd-font-family-base); cursor: pointer; }
.x-shell-hcard__btn:hover { background: var(--hd-c-pressed); }
.x-shell-hcard__btn--close { color: var(--hd-color-palette-warning); }
.x-shell-hcard__shot { position: relative; }
.x-shell-hcard__prev { width: 280px; height: 170px; margin: -4px 0 10px; overflow: hidden; border-radius: 6px; pointer-events: none; }
</style>
