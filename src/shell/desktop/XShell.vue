<script setup lang="ts">
/**
 * The Etesian desktop (docs/21-desktop.md), shared by the website and cloud-companion: they bring their apps and what goes
 * in each window; the desktop is the same everywhere.
 *
 *  - Menu bar: the focused app's name, the host's menus, then View and Window; on the right the host's indicators, the
 *    Events count, the status menu and the clock (the clock opens Events too).
 *  - Dock (XShellDock): Overview | pinned and running apps | recycle bin, on any edge, with hover cards; right-click for
 *    Edit dock and its settings. Kept on the device.
 *  - Windows (XWindow + windowManager.ts): the app's actions in the header, overlapping, resizable from any edge; dragged to
 *    a side edge they snap to that half, to the top edge they show the snap layouts; double-click the bar maximises.
 *    Kept on the device under `storageKey`.
 *  - Overview (the dock button, View): Events | the open windows themselves, as cards | the apps, type to search.
 *    Search (View): the compact version. Windows switcher (View > Windows): arrows or Tab, Enter, Escape.
 *  - Events (the count or the clock) and the status menu: panels the host fills.
 *  - Widgets on the wallpaper (the host's `widgets` slot), Edit desktop moves the windows aside.
 *  - Right-click menus on the desktop, a title bar, a dock icon and the dock. Inside a window it belongs to the app.
 * No Super or Ctrl+Alt shortcuts: in a browser the operating system takes them first (see createDesktopKeys).
 *
 * Slots: window { id } (the app inside), actions { id } (its header buttons), events { embedded, close }, status { close },
 * widgets { editing, done }, mark (the logo before the app name), indicators (left of the Events count), card { id } (a line
 * in the dock's hover card), preview { id } (the dock's live preview, with dockPreview).
 */
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount, provide, useSlots } from 'vue';
import HdIcon from '../../components/HdIcon.vue';
import HdAppIcon from '../../components/HdAppIcon.vue';
import HdSquircle from '../../components/HdSquircle.vue';
import HdCountBubble from '../../components/HdCountBubble.vue';
import XContextMenu from '../parts/XContextMenu.vue';
import XLayoutPicker from './XLayoutPicker.vue';
import XDockSettings from './XDockSettings.vue';
import XWindow from './XWindow.vue';
import XShellDock, { type ShellDockItem } from './XShellDock.vue';
/* the dock, menu bar and switcher look lives with these parts; registering them brings their CSS wherever XShell goes */
import XDock from './XDock.vue';
import XMenuBar from './XMenuBar.vue';
import XWindows from './XWindows.vue';
defineOptions({ components: { XDock, XMenuBar, XWindows } });
import { createWindowManager, createDesktopKeys, HALF_LEFT, HALF_RIGHT, LAYOUT_IDS, type Snap, type WmWin } from './windowManager';
import { windowCards, CARD_TITLE } from './cards';
import { GAP, LAYOUTS, ZOOM_LEVELS, dockThickness, zoneRects, zoomStep, type DockPos, type LayoutId, type Rect, type ZoomLevel } from './geometry';
import type { XMenuItem } from '../parts/types';
import type { IconTone } from '../../lighting';
import { SHELL, type ShellApp, type ShellMenu } from './shell';

const props = withDefaults(defineProps<{
  apps: ShellApp[];
  /** shown in the menu bar when no window is focused */
  name?: string;
  /** the host's menus, before View and Window; picking an item emits `menu` with its id */
  menus?: ShellMenu[];
  /** keep the windows and the dock on this device under this key */
  storageKey?: string;
  /** where a newly opened window goes (defaults to a cascade) */
  place?: (id: string, n: number, area: Rect) => Partial<Rect>;
  /** the Events count in the menu bar (hidden when undefined) */
  eventsCount?: number;
  /** per app: Back in the header, or a view menu */
  meta?: Record<string, { back?: boolean; views?: string[] }>;
  dockPreview?: boolean;
}>(), { name: 'Etesian', menus: () => [], meta: () => ({}) });
const emit = defineEmits<{ open: [id: string]; close: [id: string]; menu: [id: string]; back: [id: string]; view: [id: string, view: string] }>();
const slots = useSlots();
const byId = computed(() => Object.fromEntries(props.apps.map((a) => [a.id, a])));

/* ---------- the area and the dock ---------- */
const areaEl = ref<HTMLElement>();
const size = reactive({ w: 1440, h: 860 });
const dockKey = props.storageKey ? `${props.storageKey}:dock` : undefined;
const dock = reactive<{ pos: DockPos; size: number; vis: 'always' | 'autohide' | 'dodge'; panel: boolean; launcher: boolean; trash: boolean; previews: boolean; removed: string[] }>(
  { pos: 'left', size: 44, vis: 'always', panel: false, launcher: true, trash: true, previews: !!props.dockPreview, removed: [] });
try { if (dockKey) Object.assign(dock, JSON.parse(localStorage.getItem(dockKey) || '{}')); } catch { /* the defaults */ }
if (dockKey) watch(dock, () => { try { localStorage.setItem(dockKey, JSON.stringify(dock)); } catch { /* not kept */ } }, { deep: true });
const dockEdit = ref(false), dockSettings = ref(false);
/** the free area beside a dock that is always shown */
const work = computed<Rect>(() => {
  const t = dock.vis === 'always' ? dockThickness(dock.size) + GAP : 0;
  const l = dock.pos === 'left' ? t : 0, r = dock.pos === 'right' ? t : 0, tp = dock.pos === 'top' ? t : 0, b = dock.pos === 'bottom' ? t : 0;
  return { x: l, y: tp, w: size.w - l - r, h: size.h - tp - b };
});

/* ---------- windows ---------- */
const wm = createWindowManager({ area: work, place: props.place, storageKey: props.storageKey });
const known = (w: WmWin) => !!byId.value[w.id];
function open(id: string) { closeOverlays(); if (!wm.get(id)) emit('open', id); wm.open(id); }
function close(id: string) { wm.close(id); emit('close', id); focusControls(); }
function minimise(id: string) { wm.minimise(id); focusControls(); }
/** after a window goes, the keyboard goes to the next one (or the desktop) instead of being lost */
function focusControls() { nextTick(() => (document.querySelector<HTMLElement>(wm.focused.value ? `[data-win="${wm.focused.value}"] .x-win__ctl button` : '.x-shell__area') ?? undefined)?.focus()); }
provide(SHELL, { open, close, wm });

/* ---------- overlays ---------- */
const overview = ref(false), launcher = ref(false), events = ref(false), status = ref(false);
const picker = ref<{ layout: LayoutId | null; drag: boolean } | null>(null);
const query = ref('');
const ctx = ref<{ x: number; y: number; label: string; items: XMenuItem[]; act: (id: string) => void } | null>(null);
const editWidgets = ref(false);
function closeOverlays(): boolean {
  const any = overview.value || launcher.value || events.value || status.value || !!picker.value || !!ctx.value || dockSettings.value || dockEdit.value || editWidgets.value;
  overview.value = launcher.value = events.value = status.value = false; picker.value = null; ctx.value = null; dockSettings.value = dockEdit.value = false; editWidgets.value = false; query.value = '';
  return any;
}
const PANELS = { overview, launcher, events, status };
function toggle(name: keyof typeof PANELS) { const r = PANELS[name], was = r.value; closeOverlays(); r.value = !was; }
const searchEl = ref<HTMLInputElement>();
watch([overview, launcher], ([o, l]) => { if (o || l) nextTick(() => searchEl.value?.focus()); });
const found = computed(() => { const q = query.value.trim().toLowerCase(); return props.apps.filter((a) => !q || a.title.toLowerCase().includes(q)); });
function openFirst() { if (found.value[0]) open(found.value[0].id); }
/* editing the desktop moves the windows out of the way (as Show desktop), Done brings them back */
watch(editWidgets, (on) => { if (on === wm.shown.value.length > 0) wm.showDesktop(); });

/* ---------- the switcher and the Overview: the windows themselves become the cards ---------- */
const OV_SIDE = 380;
const cardBox = computed<Rect>(() => overview.value
  ? { x: OV_SIDE + 24, y: 24, w: size.w - 2 * OV_SIDE - 48, h: size.h - 48 - CARD_TITLE }
  : { x: work.value.x + 40, y: 76, w: work.value.w - 80, h: size.h - 76 - 40 - CARD_TITLE });
const ovLevel = computed<ZoomLevel>(() => { const n = wm.wins.length; return n <= 1 ? 1 : n <= 4 ? 2 : 3; });
const cardIds = computed(() => (wm.switcher.value ? wm.switcher.value.list : overview.value ? wm.recent.value.map((w) => w.id) : []).filter((id) => byId.value[id]));
const cards = computed(() => {
  const ids = cardIds.value; if (!ids.length) return {} as Record<string, ReturnType<typeof windowCards>[number]>;
  const sw = wm.switcher.value, sizes = ids.map((id) => { const r = wm.rectOf(wm.get(id)!); return { w: r.w, h: r.h }; });
  const cs = windowCards(sizes, sw ? sw.level : ovLevel.value, sw ? sw.i : 0, cardBox.value);
  return Object.fromEntries(ids.map((id, i) => [id, cs[i]!]));
});
const drawn = computed(() => wm.wins.filter((w) => known(w) && (cardIds.value.length ? cardIds.value.includes(w.id) : !w.min) && !editWidgets.value));
const LEVEL: Record<ZoomLevel, string> = { 1: 'One at a time', 2: '2 per row', 3: '3 per row', 4: '4 per row' };
function onCardsWheel(e: WheelEvent) {
  const sw = wm.switcher.value; if (!sw) return;
  if (e.ctrlKey) { e.preventDefault(); wm.switchLevel(zoomStep(sw.level, e.deltaY)); }
  else if (sw.level === 1 && e.deltaY) wm.switchMove(e.deltaY > 0 ? 1 : -1);
}
function pickCard(id: string) { if (wm.switcher.value) { wm.switcher.value.i = wm.switcher.value.list.indexOf(id); wm.switchEnd(true); } else open(id); }

/* ---------- moving and resizing: pointer captured by the area; the edges snap, the top edge shows the layouts ---------- */
const op = ref<{ kind: 'move' | 'resize'; id: string; pid: number; hot: Snap } | null>(null);
const local = (e: PointerEvent) => { const r = areaEl.value!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
function grab(id: string, e: PointerEvent) {
  const p = local(e); wm.moveStart(id, p.x, p.y);
  op.value = { kind: 'move', id, pid: e.pointerId, hot: null }; // captured once it really moves, so a double-click still reaches the bar
}
function resize(id: string, h: string, e: PointerEvent) {
  const p = local(e); wm.resizeStart(id, h, p.x, p.y);
  op.value = { kind: 'resize', id, pid: e.pointerId, hot: null };
  areaEl.value!.setPointerCapture(e.pointerId); noSelect(true);
}
/** the picker zone under the pointer: XLayoutPicker labels each zone "<layout label>, zone <n>" */
function pickerZone(e: PointerEvent): Snap {
  const m = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest('.x-lpick__z')?.getAttribute('aria-label')?.match(/^(.*), zone (\d+)$/);
  const id = m && LAYOUT_IDS.find((l) => LAYOUTS[l].label === m[1]);
  return id ? { layout: id, zone: Number(m![2]) - 1 } : null;
}
function onMove(e: PointerEvent) {
  const o = op.value; if (!o || o.pid !== e.pointerId) return;
  const p = local(e);
  if (o.kind === 'resize') { wm.resizeTo(p.x, p.y); return; }
  if (!wm.moveTo(p.x, p.y)) return;
  if (!areaEl.value!.hasPointerCapture(e.pointerId)) { areaEl.value!.setPointerCapture(e.pointerId); noSelect(true); }
  if (p.y < 6 && !picker.value) picker.value = { layout: null, drag: true };
  else if (picker.value?.drag && p.y > 220) picker.value = null;
  const W = work.value;
  o.hot = picker.value?.drag ? pickerZone(e) ?? (p.y < 6 ? 'max' : null)
    : p.x < W.x + 16 ? HALF_LEFT : p.x > W.x + W.w - 16 ? HALF_RIGHT : null;
}
function onUp(e: PointerEvent) {
  const o = op.value; if (!o || o.pid !== e.pointerId) return;
  if (o.kind === 'move') wm.moveEnd(o.hot); else wm.resizeEnd();
  if (picker.value?.drag) picker.value = null;
  op.value = null; noSelect(false);
}
/** while a window is held nothing on the page gets selected */
function refuse(e: Event) { if (op.value) e.preventDefault(); }
function noSelect(on: boolean) { document.documentElement.classList.toggle('x-shell-grab', on); if (on) window.getSelection()?.removeAllRanges(); }
const hotRect = computed<Rect | null>(() => {
  const h = op.value?.hot; if (!h) return null;
  const W = work.value;
  return h === 'max' ? { x: W.x + GAP, y: W.y + GAP, w: W.w - 2 * GAP, h: W.h - 2 * GAP } : zoneRects(h.layout, W)[h.zone] ?? null;
});
function pickLayout(l: LayoutId, z: number) { const w = wm.focusedWin.value; picker.value = null; if (w) wm.snap(w.id, { layout: l, zone: z }); }

/* ---------- keyboard ---------- */
const keys = createDesktopKeys(wm, {
  closeAll: closeOverlays,
  pickerDigit: (n) => {
    const p = picker.value; if (!p || p.drag) return false;
    if (!p.layout) { if (LAYOUT_IDS[n]) p.layout = LAYOUT_IDS[n]!; } else if (n < LAYOUTS[p.layout].zones.length) pickLayout(p.layout, n);
    return true;
  },
});
function onKeyDown(e: KeyboardEvent) {
  if (keys.down(e)) return;
  /* the Overview and Search: typing anywhere goes into the search */
  if ((overview.value || launcher.value) && document.activeElement !== searchEl.value && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { searchEl.value?.focus(); }
}

/* ---------- menu bar ---------- */
const now = ref(new Date());
const time = computed(() => now.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
const date = computed(() => now.value.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }));
const barApp = computed(() => (overview.value ? 'Overview' : wm.switcher.value ? 'Windows' : launcher.value ? 'Search' : wm.focusedWin.value ? byId.value[wm.focusedWin.value.id]?.title ?? props.name : props.name));
const winItems = (w?: WmWin): XMenuItem[] => [
  { id: 'w:minimise', label: w?.min ? 'Show' : 'Minimise', icon: 'minimize', disabled: !w }, { id: 'w:maximise', label: w?.snap === 'max' ? 'Restore' : 'Maximise', icon: 'maximize', disabled: !w },
  { id: 'w:left', label: 'Snap left', disabled: !w }, { id: 'w:right', label: 'Snap right', disabled: !w },
  { id: 'w:layouts', label: 'Snap layouts…', icon: 'split', disabled: !w }, { id: 'w:close', label: 'Close window', icon: 'close', divider: true, destructive: true, disabled: !w }];
const menus = computed<ShellMenu[]>(() => [
  ...props.menus,
  { label: 'View', items: [{ id: 'v:overview', label: 'Overview', icon: 'grid' }, { id: 'v:windows', label: 'Windows', icon: 'window' },
    { id: 'v:search', label: 'Search', icon: 'search' }, { id: 'v:events', label: 'Events', icon: 'calendar' },
    { id: 'v:desktop', label: 'Show the desktop', icon: 'home', divider: true }, ...(slots.widgets ? [{ id: 'v:widgets', label: 'Edit desktop', icon: 'edit' }] : [])] },
  { label: 'Window', items: [...winItems(wm.focusedWin.value), ...wm.recent.value.filter(known).map((w, i) => ({ id: `w:show:${w.id}`, label: byId.value[w.id]!.title + (w.min ? ' (minimised)' : ''), divider: i === 0 }))] },
]);
const openMenu = ref<string | null>(null);
function winAct(id: string, w?: WmWin) {
  if (!w) return;
  if (id === 'w:minimise') { if (w.min) open(w.id); else minimise(w.id); } else if (id === 'w:maximise') wm.toggleMax(w.id); else if (id === 'w:close') close(w.id);
  else if (id === 'w:left') wm.snap(w.id, HALF_LEFT); else if (id === 'w:right') wm.snap(w.id, HALF_RIGHT);
  else if (id === 'w:layouts') { wm.focus(w.id); picker.value = { layout: null, drag: false }; }
}
function onMenu(id: string) {
  openMenu.value = null;
  if (id.startsWith('w:show:')) open(id.slice(7));
  else if (id.startsWith('w:')) winAct(id, wm.focusedWin.value);
  else if (id === 'v:overview') toggle('overview'); else if (id === 'v:windows') wm.switchStep(false, false); else if (id === 'v:search') toggle('launcher');
  else if (id === 'v:events') toggle('events'); else if (id === 'v:desktop') { closeOverlays(); wm.showDesktop(); } else if (id === 'v:widgets') { closeOverlays(); editWidgets.value = true; }
  else emit('menu', id);
}

/* ---------- dock ---------- */
const STATE: Record<string, string> = { max: 'Maximised', float: 'Open' };
function stateOf(w: WmWin) {
  if (w.min) return 'Minimised';
  const where = w.snap === 'max' ? STATE.max : !w.snap ? STATE.float : w.snap.layout === 'halves' ? (w.snap.zone ? 'Right half' : 'Left half') : 'In a snap layout';
  return (wm.focused.value === w.id ? 'In front · ' : '') + where;
}
const dockItems = computed<ShellDockItem[]>(() => {
  const pinned = props.apps.filter((a) => a.pinned !== false && !dock.removed.includes(a.id));
  const running = wm.wins.filter((w) => known(w) && !pinned.some((a) => a.id === w.id)).map((w) => byId.value[w.id]!);
  return [...pinned, ...running].map((a) => { const w = wm.get(a.id); return { id: a.id, title: a.title, icon: a.icon, color: a.color, tone: a.tone, running: !!w, active: !!w && !w.min && wm.focused.value === a.id, min: !!w?.min, state: w ? stateOf(w) : '' }; });
});
function dockRemove(id: string) { if (id === 'launcher' || id === 'trash') dock[id] = false; else if (wm.get(id)) close(id); else dock.removed.push(id); }

/* ---------- right-click ---------- */
function onContext(e: MouseEvent) {
  const t = e.target as HTMLElement;
  if (t.closest('.x-cmenu, .x-dset, .x-shell-hcard, .x-shell-ov, .x-shell-panel') || (t.closest('[data-win]') && !t.closest('.x-win__bar'))) return; // inside an app: its own menu
  e.preventDefault();
  const a = areaEl.value!.getBoundingClientRect();
  const at = (label: string, items: XMenuItem[], act: (id: string) => void) => {
    ctx.value = { x: Math.min(e.clientX - a.left, size.w - 260), y: Math.min(e.clientY - a.top, size.h - 40 - items.length * 36), label, items, act };
  };
  const winId = t.closest('.x-win__bar') ? t.closest<HTMLElement>('[data-win]')?.dataset.win : undefined;
  const slot = t.closest<HTMLElement>('.x-dock__slot');
  const dockId = slot ? dockItems.value.find((d) => slot.querySelector(`[aria-label^="${CSS.escape(d.title)}"]`))?.id : undefined;
  if (winId) at('Window', winItems(wm.get(winId)), (id) => winAct(id, wm.get(winId)));
  else if (dockId && wm.get(dockId)) at('Dock item', [...winItems(wm.get(dockId)), { id: 'dock', label: 'Edit dock…', icon: 'settings', divider: true }], (id) => (id === 'dock' ? (dockEdit.value = true) : winAct(id, wm.get(dockId))));
  else if (dockId) at('Dock item', [{ id: 'open', label: `Open ${byId.value[dockId]!.title}`, icon: byId.value[dockId]!.icon }, { id: 'unpin', label: 'Remove from the dock', icon: 'close' }, { id: 'dock', label: 'Edit dock…', icon: 'settings', divider: true }],
    (id) => (id === 'open' ? open(dockId) : id === 'unpin' ? dock.removed.push(dockId) : (dockEdit.value = true)));
  else if (t.closest('nav.x-dock')) at('Dock', [{ id: 'edit', label: 'Edit dock…', icon: 'settings' }, { id: 'overview', label: 'Overview', icon: 'grid' }], (id) => (id === 'edit' ? (dockEdit.value = true) : toggle('overview')));
  else at('Desktop', [
    ...(slots.widgets ? [{ id: 'widgets', label: 'Edit desktop', icon: 'edit' }] : []), { id: 'dock', label: 'Edit dock…', icon: 'settings' },
    { id: 'desktop', label: 'Show the desktop', icon: 'home', divider: true }, { id: 'overview', label: 'Overview', icon: 'grid' },
  ], (id) => { if (id === 'widgets') { closeOverlays(); editWidgets.value = true; } else if (id === 'dock') dockEdit.value = true; else if (id === 'desktop') wm.showDesktop(); else toggle('overview'); });
}
function ctxPick(id: string) { const c = ctx.value; ctx.value = null; c?.act(id); }

let ro: ResizeObserver | undefined, clock = 0;
function measure() { if (areaEl.value) { size.w = areaEl.value.clientWidth; size.h = areaEl.value.clientHeight; } }
onMounted(() => {
  measure(); ro = new ResizeObserver(measure); if (areaEl.value) ro.observe(areaEl.value);
  window.addEventListener('keydown', onKeyDown);
  document.addEventListener('selectstart', refuse);
  clock = window.setInterval(() => (now.value = new Date()), 15000);
  if (!wm.focused.value) wm.focusTopmost();
});
onBeforeUnmount(() => {
  ro?.disconnect(); window.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('selectstart', refuse); window.clearInterval(clock); noSelect(false);
});
defineExpose({ open, close, wm });
const app = (id: string) => byId.value[id]!;
const tone = (id: string): IconTone | undefined => byId.value[id]?.tone;
</script>
<template>
  <div class="x-desktop x-desk hd-on-home" :class="`x-shell--dock-${dock.pos}`">
    <a href="#x-shell-area" class="x-shell__skip" @click.prevent="focusControls">Skip to the windows</a>
    <!-- menu bar -->
    <header class="x-mbar hd-on-home x-shell__mbar" role="menubar" :aria-label="`${barApp} menu bar`">
      <span v-if="$slots.mark" class="x-shell__mark"><slot name="mark" /></span>
      <span class="x-mbar__app">{{ barApp }}</span>
      <span v-for="m in menus" :key="m.label" class="x-mbar__m">
        <button type="button" role="menuitem" class="x-mbar__menu hd-focusable" :class="{ 'is-open': openMenu === m.label }" :aria-expanded="openMenu === m.label ? 'true' : 'false'" aria-haspopup="menu"
          @click="openMenu = openMenu === m.label ? null : m.label" @mouseenter="openMenu && (openMenu = m.label)">{{ m.label }}</button>
        <span v-if="openMenu === m.label" class="x-mbar__drop x-shell__drop"><XContextMenu :open="true" :items="m.items" :label="m.label" @select="onMenu" @update:open="openMenu = null" /></span>
      </span>
      <span class="x-mbar__sp"></span>
      <span class="x-mbar__status" aria-label="Status">
        <slot name="indicators" />
        <button v-if="eventsCount !== undefined" type="button" class="x-mbar__events hd-focusable" :class="{ 'is-active': events }" :aria-label="`Events: ${eventsCount} new`" title="Events" @click="toggle('events')"><HdCountBubble :value="eventsCount" /></button>
        <button v-if="$slots.status" type="button" class="x-mbar__sicons hd-focusable" :class="{ 'is-active': status }" aria-label="Status menu" :aria-expanded="status ? 'true' : 'false'" @click="toggle('status')">
          <slot name="status-icons"><HdIcon name="wifi" :size="15" /><HdIcon name="bluetooth" :size="15" /><HdIcon name="battery" :size="17" /></slot>
        </button>
        <button type="button" class="x-mbar__clock x-shell__clock hd-focusable" :class="{ 'is-active': events }" :aria-label="`${date}, ${time}, Events`" :aria-expanded="events ? 'true' : 'false'" title="Events" @click="toggle('events')">
          <span>{{ date }}</span><b>{{ time }}</b></button>
      </span>
    </header>
    <div v-if="openMenu" class="x-shell__scrim" @pointerdown="openMenu = null"></div>

    <div id="x-shell-area" ref="areaEl" tabindex="-1" class="x-desktop__area x-v2 x-shell__area" :class="{ 'x-v2--dock-edit': dockEdit }"
      @contextmenu="onContext" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp">
      <!-- widgets on the wallpaper, under the windows -->
      <slot name="widgets" :editing="editWidgets" :done="() => (editWidgets = false)" />

      <!-- the Overview's backdrop and side columns; its middle column is the windows themselves -->
      <div v-if="overview" class="x-shell-ov hd-on-home" role="dialog" aria-label="Overview" @pointerdown.self="overview = false">
        <section class="x-shell-ov__events" aria-label="Events"><slot name="events" :embedded="true" :close="() => (overview = false)" /></section>
        <p v-if="!cardIds.length" class="x-shell-ov__none">No open windows</p>
        <section class="x-shell-ov__apps" aria-label="Apps">
          <label class="x-shell-search"><HdIcon name="search" :size="20" /><input ref="searchEl" v-model="query" type="search" placeholder="Type to search" aria-label="Search apps" @keydown.enter="openFirst" /></label>
          <div class="x-shell-grid">
            <HdAppIcon v-for="a in found" :key="a.id" :label="a.title" :icon="a.icon" :color="a.color" :tone="a.tone" lighting="lit" :size="54" @click="open(a.id)" />
            <p v-if="!found.length" class="x-shell-none">Nothing matches “{{ query }}”.</p>
          </div>
        </section>
      </div>
      <!-- the Windows switcher's backdrop -->
      <div v-if="wm.switcher.value" class="x-wins hd-on-home x-shell-wins" role="listbox" aria-label="Windows" @wheel="onCardsWheel" @pointerdown.self="wm.switchEnd(false)">
        <header class="x-wins__head" :style="{ left: `${work.x + 40}px`, right: '40px' }">
          <h2 class="x-wins__h">Windows</h2>
          <span class="x-wins__n">{{ wm.switcher.value.list.length }} open · {{ LEVEL[wm.switcher.value.level] }}</span>
          <span class="x-wins__zoom" role="radiogroup" aria-label="Zoom (Ctrl + wheel)">
            <button v-for="l in ZOOM_LEVELS" :key="l" type="button" role="radio" class="x-wins__z hd-sq hd-focusable" :class="{ 'is-on': l === wm.switcher.value.level }" :aria-checked="l === wm.switcher.value.level ? 'true' : 'false'"
              :aria-label="LEVEL[l]" @click="wm.switchLevel(l)">
              <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><rect v-for="k in l" :key="k" :x="l === 1 ? 4 : (k - 1) * (20 / l) + 0.5" :y="l === 1 ? 1 : 3" :width="l === 1 ? 12 : 20 / l - 1.5" :height="l === 1 ? 12 : 8" rx="1.5" fill="currentColor" /></svg>
            </button>
          </span>
        </header>
      </div>

      <!-- windows (in the switcher and the Overview: scaled into their cards) -->
      <XWindow v-for="w in drawn" :key="w.id" :data-win="w.id" :title="app(w.id).title" :icon="app(w.id).icon" :color="app(w.id).color" :tone="tone(w.id)"
        v-bind="wm.rectOf(w)" :z="w.z" :focused="wm.focused.value === w.id && !cardIds.length" :tiled="w.snap !== null" :maximised="w.snap === 'max'" :dragging="op?.kind === 'move' && wm.moving() === w.id"
        :busy="!!op" :card="cards[w.id] ?? null" :back="meta[w.id]?.back" :views="meta[w.id]?.views"
        @focus="wm.focus(w.id)" @close="close(w.id)" @minimise="minimise(w.id)" @maximise="wm.toggleMax(w.id)" @back="emit('back', w.id)" @update:view="(v) => emit('view', w.id, v)"
        @grab="(e) => grab(w.id, e)" @resize="(h, e) => resize(w.id, h, e)">
        <template v-if="$slots.actions" #actions><slot name="actions" :id="w.id" /></template>
        <slot name="window" :id="w.id" />
      </XWindow>
      <!-- a button over each card: picks it (the window under it does not take the pointer) -->
      <template v-if="cardIds.length">
        <button v-for="id in cardIds" :key="`c-${id}`" type="button" class="x-shell-card hd-focusable" role="option" :class="{ 'is-sel': wm.switcher.value && wm.switcher.value.list[wm.switcher.value.i] === id }"
          :aria-selected="!!wm.switcher.value && wm.switcher.value.list[wm.switcher.value.i] === id" :aria-label="app(id).title"
          :style="{ left: `${cards[id]!.x}px`, top: `${cards[id]!.y}px`, width: `${wm.rectOf(wm.get(id)!).w * cards[id]!.s}px`, height: `${wm.rectOf(wm.get(id)!).h * cards[id]!.s + CARD_TITLE}px`, zIndex: 9500 }"
          @click="pickCard(id)">
          <span class="x-shell-card__t"><HdSquircle :size="20" :color="app(id).color" lighting="lit" :tone="tone(id)"><HdIcon :name="app(id).icon" :size="12" :lit="tone(id) === 'light' ? 'dark' : true" /></HdSquircle>{{ app(id).title }}</span>
        </button>
      </template>

      <!-- where a dragged window will go -->
      <div v-if="hotRect" class="x-shell-zone" :style="{ left: `${hotRect.x}px`, top: `${hotRect.y}px`, width: `${hotRect.w}px`, height: `${hotRect.h}px` }" aria-hidden="true"></div>
      <div v-if="picker" class="x-shell-picker"><XLayoutPicker :layout="picker.layout ?? undefined" :zone="op?.hot && op.hot !== 'max' ? op.hot.zone : -1" :hints="!picker.drag" @pick="pickLayout" /></div>

      <!-- Search -->
      <div v-if="launcher" class="x-shell-scrim" @pointerdown.self="launcher = false">
        <div class="x-shell-search-panel hd-on-overlay" role="dialog" aria-label="Search">
          <label class="x-shell-search"><HdIcon name="search" :size="20" /><input ref="searchEl" v-model="query" type="search" placeholder="Type to search" aria-label="Search apps" @keydown.enter="openFirst" /></label>
          <div class="x-shell-grid">
            <HdAppIcon v-for="a in found" :key="a.id" :label="a.title" :icon="a.icon" :color="a.color" :tone="a.tone" lighting="lit" :size="54" @click="open(a.id)" />
            <p v-if="!found.length" class="x-shell-none">Nothing matches “{{ query }}”.</p>
          </div>
        </div>
      </div>
      <!-- Events and the status menu: the host's panels at the right edge -->
      <aside v-if="events" class="x-shell-panel x-shell-panel--events hd-on-home" aria-label="Events"><slot name="events" :embedded="false" :close="() => (events = false)" /></aside>
      <aside v-if="status" class="x-shell-panel x-shell-panel--status hd-on-overlay" aria-label="Status menu"><slot name="status" :close="() => (status = false)" /></aside>

      <XContextMenu v-if="ctx" :open="true" :items="ctx.items" :label="ctx.label" :x="ctx.x" :y="ctx.y" @select="ctxPick" @update:open="ctx = null" />
      <div v-if="dockSettings" class="x-shell-dset" :style="{ [dock.pos === 'right' ? 'right' : 'left']: `${dockThickness(dock.size) + 5 * GAP}px`, top: '24px' }">
        <XDockSettings v-model:position="dock.pos" v-model:size="dock.size" v-model:visibility="dock.vis" v-model:panel="dock.panel" :launcher="dock.launcher" :trash="dock.trash" :previews="dock.previews"
          @widget="(id, on) => { if (id === 'launcher' || id === 'trash' || id === 'previews') dock[id] = on; }" @done="dockSettings = false; dockEdit = false" />
      </div>

      <XShellDock :items="dockItems" :overview-open="overview" :position="dock.pos" :size="dock.size" :auto-hide="dock.vis !== 'always'" :panel="dock.panel" :editing="dockEdit"
        :launcher="dock.launcher" :trash="dock.trash" :preview="dock.previews" @overview="toggle('overview')" @item="(id) => (wm.get(id) ? wm.activate(id) : open(id))" @minimise="minimise" @close="close"
        @settings="dockSettings = true" @remove="dockRemove" @move="(p) => (dock.pos = p)">
        <template v-if="$slots.card" #card="{ id }"><slot name="card" :id="id" /></template>
        <template v-if="$slots.preview" #preview="{ id }"><slot name="preview" :id="id" /></template>
      </XShellDock>
    </div>
  </div>
</template>
<style>
.x-desk { position: relative; display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; }
.x-shell__area { position: relative; flex: 1; min-height: 0; outline: none; }
.x-shell__skip { position: absolute; z-index: 100; left: 8px; top: -60px; padding: 8px 12px; border-radius: 6px; background: var(--hd-surface-overlay); color: var(--hd-c-fg); }
.x-shell__skip:focus { top: 34px; }
.x-shell__mark { display: inline-flex; margin-right: 8px; }
.x-shell__clock { border: 0; background: none; color: inherit; font: inherit; cursor: pointer; border-radius: 4px; }
.x-shell__clock.is-active, .x-shell__clock:hover { background: var(--hd-c-pressed); }
.x-shell__scrim { position: fixed; inset: 0; z-index: 59; }
.x-shell__drop { z-index: 61; }
html.x-shell-grab, html.x-shell-grab * { user-select: none !important; -webkit-user-select: none !important; }
/* the Overview: Events | the windows (as cards) | the apps */
.x-shell-ov { position: absolute; inset: 0; z-index: 8000; display: grid; grid-template-columns: 380px 1fr 380px; background: var(--hd-surface-home); }
.x-shell-ov__events { position: relative; grid-column: 1; overflow: hidden; border-right: 1px solid var(--hd-c-divider); }
/* a panel made to stand at the screen edge fills this column instead */
.x-shell-ov__events > * { position: absolute; inset: 0; width: auto; }
.x-shell-ov__apps { grid-column: 3; display: flex; flex-direction: column; overflow: auto; padding: 16px; border-left: 1px solid var(--hd-c-divider); }
.x-shell-ov__none { grid-column: 2; align-self: center; text-align: center; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1 var(--hd-font-family-light); color: var(--hd-c-fg-secondary); }
.x-shell-search { display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 8px; border-bottom: 1px solid var(--hd-c-divider); color: var(--hd-c-fg-secondary); }
.x-shell-search input { flex: 1; min-width: 0; height: 40px; border: 0; background: none; color: var(--hd-c-fg); font: var(--hd-font-weight-light) var(--hd-font-size-large)/1 var(--hd-font-family-light); outline: none; }
.x-shell-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: 16px 8px; padding: 16px 0; }
.x-shell-none { grid-column: 1 / -1; color: var(--hd-c-fg-secondary); }
.x-shell-wins { z-index: 8000; background: var(--hd-surface-home); -webkit-backdrop-filter: none; backdrop-filter: none; } /* no blur on the web: opaque instead */
.x-shell-card { position: absolute; padding: 0; border: 0; border-radius: var(--hd-radius-card); background: none; cursor: pointer; }
.x-shell-card.is-sel, .x-shell-card:hover { box-shadow: 0 0 0 3px var(--hd-accent); }
.x-shell-card__t { position: absolute; left: 0; right: 0; bottom: 0; height: 34px; display: flex; align-items: center; justify-content: center; gap: 8px; color: #fff; font: 400 var(--hd-font-size-medium)/1 var(--hd-font-family-base); }
.x-shell-zone { position: absolute; z-index: 7000; border-radius: var(--hd-radius-card); background: color-mix(in srgb, var(--hd-accent) 22%, transparent); box-shadow: inset 0 0 0 2px var(--hd-accent); pointer-events: none; }
.x-shell-picker { position: absolute; z-index: 9800; top: 8px; left: 50%; transform: translateX(-50%); }
.x-shell-scrim { position: absolute; inset: 0; z-index: 9700; display: flex; justify-content: center; align-items: flex-start; padding-top: 12vh; background: rgba(0,0,0,.4); }
.x-shell-search-panel { width: min(640px, 90%); padding: 8px 16px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); box-shadow: var(--hd-shadow-overlay); }
.x-shell-panel { position: absolute; z-index: 9600; top: 0; right: 0; bottom: 0; width: 400px; overflow: auto; box-shadow: var(--hd-shadow-overlay); }
.x-shell-panel--events { background: var(--hd-c-bg); }
.x-shell-panel--status { bottom: auto; max-height: 100%; width: 360px; border-radius: 0 0 0 var(--hd-radius-card); background: var(--hd-surface-overlay); }
.x-shell-dset { position: absolute; z-index: 9650; }
@media (prefers-reduced-motion: reduce) { .x-desk * { transition-duration: 1ms !important; animation-duration: 1ms !important; } }
</style>
