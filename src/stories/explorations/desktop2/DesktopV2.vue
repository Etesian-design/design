<script setup lang="ts">
/**
 * Desktop v2 (merges v1 A + B, D's dock only): overlapping windows with integrated N9 header bars, snapping by keyboard
 * or drag, a Plasma-style dock (left by default), a global menu bar, a horizontal three-view overview and an Events panel.
 * Live keys: Super = overview, Super+N = Events, Super+Z = layouts, Super+Left/Right = snap, Left/Right = flick views, Esc.
 */
import { ref, computed, watch } from 'vue';
import XDesktop from '../desktop/XDesktop.vue';
import XHints from '../desktop/XHints.vue';
import XCursor from '../desktop/XCursor.vue';
import XKey from '../parts/XKey.vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdToolIcon from '../../../components/HdToolIcon.vue';
import XMenuBar from './XMenuBar.vue';
import XDock from './XDock.vue';
import XDockSettings from './XDockSettings.vue';
import XWin from './XWin.vue';
import XZones from './XZones.vue';
import XLayoutPicker from './XLayoutPicker.vue';
import XOverview2 from './XOverview2.vue';
import XEventsPanel from './XEventsPanel.vue';
import { useDesktopKeys } from '../desktop/useDesktopKeys';
import { workArea, zoneRects, dockThickness, GAP, type DockPos, type LayoutId, type Rect } from './geometry';
import { STATES, type V2State } from './states';
const props = withDefaults(defineProps<{ state?: V2State; query?: string }>(), { state: 'desktop', query: '' });
const st = ref<V2State>(props.state);
watch(() => props.state, (v) => (st.value = v));
const q = ref(props.query);
const page = ref(props.state === 'overview-search' ? 2 : 1);
watch(st, (v) => { if (v === 'overview-search') { page.value = 2; if (!q.value) q.value = 'mu'; } else if (v === 'overview') page.value = 1; });
if (props.state === 'overview-search' && !q.value) q.value = 'mu';
const focused = ref('Mail');
const picker = ref(props.state === 'drag');
const snap = ref<Record<string, number>>({});

const dockPos = computed<DockPos>(() => (st.value === 'dock-bottom' ? 'bottom' : 'left'));
const autoHide = computed(() => st.value === 'dock-autohide');
const area = computed(() => workArea(dockPos.value, 44, autoHide.value));
const overview = computed(() => st.value === 'overview' || st.value === 'overview-search' || st.value === 'idea-gestures');
const events = computed(() => st.value === 'events');

interface W { app: string; x: number; y: number; w: number; h: number; z: number; tiled?: boolean }
const FLOAT: W[] = [
  { app: 'Browser', x: 120, y: 34, w: 960, h: 650, z: 1 },
  { app: 'Mail', x: 430, y: 112, w: 1120, h: 760, z: 3 },
  { app: 'Messages', x: 1420, y: 290, w: 460, h: 640, z: 2 },
];
function inArea(r: Rect, a: Rect): Rect { return { x: a.x + Math.min(r.x, a.w - r.w - GAP), y: a.y + Math.min(r.y, a.h - r.h - GAP), w: Math.min(r.w, a.w - 2 * GAP), h: Math.min(r.h, a.h - 2 * GAP) }; }
const wins = computed<W[]>(() => {
  const a = area.value;
  if (st.value === 'snapped') {
    const z = zoneRects('thirds', a);
    return ['Mail', 'Calendar', 'Messages'].map((app, i) => ({ app, ...z[i]!, z: 1, tiled: true }));
  }
  if (st.value === 'dock-autohide') return [{ app: 'Browser', x: GAP, y: GAP, w: a.w - 2 * GAP, h: a.h - 2 * GAP, z: 1, tiled: true }];
  const list = FLOAT.map((w) => {
    const i = snap.value[w.app];
    if (i !== undefined) return { app: w.app, ...zoneRects('halves', a)[i]!, z: w.z, tiled: true };
    const r = st.value === 'dock-bottom' ? { ...w, x: w.x - 40, y: w.y - 20, h: Math.min(w.h, 720) } : w;
    return { app: w.app, ...inArea({ x: r.x - 72, y: r.y, w: r.w, h: r.h }, a), z: w.z };
  });
  if (st.value === 'drag') { const m = list.find((w) => w.app === 'Mail')!; Object.assign(m, { x: 760, y: 26, w: 900, h: 640 }); }
  return list;
});
const dragApp = computed(() => (st.value === 'drag' ? 'Mail' : null));
const closing = computed(() => (st.value === 'idea-close' ? 0.55 : 0));
const barApp = computed(() => (overview.value ? '' : st.value === 'snapped' ? 'Calendar' : focused.value));
const barLabel = computed(() => (overview.value ? 'Overview' : ''));

function snapFocused(i: number) { snap.value = { ...snap.value, [focused.value]: i }; }
useDesktopKeys((e) => {
  const k = e.key;
  if ((k === 'Meta' || k === 'OS') && !e.ctrlKey) { st.value = overview.value ? 'desktop' : 'overview'; return; }
  if (e.metaKey && (k === 'n' || k === 'N')) { st.value = events.value ? 'desktop' : 'events'; return; }
  if (e.metaKey && (k === 'z' || k === 'Z')) { picker.value = !picker.value; return; }
  if (k === 'Escape') { picker.value = false; q.value = ''; st.value = 'desktop'; return; }
  if (overview.value) {
    if (k === 'ArrowLeft') page.value = Math.max(0, page.value - 1);
    else if (k === 'ArrowRight') page.value = Math.min(2, page.value + 1);
    else if (k === 'Backspace') q.value = q.value.slice(0, -1);
    else if (k.length === 1 && !e.metaKey && !(e.target instanceof HTMLInputElement)) { q.value += k; page.value = 2; }
    return;
  }
  if (e.metaKey && k === 'ArrowLeft') snapFocused(0);
  else if (e.metaKey && k === 'ArrowRight') snapFocused(1);
  else if (e.metaKey && k === 'ArrowDown') { const s = { ...snap.value }; delete s[focused.value]; snap.value = s; }
});
function pickLayout(_l: LayoutId, z: number) { picker.value = false; snapFocused(Math.min(z, 1)); }
const dockT = dockThickness(44) + GAP;
const info = computed(() => STATES[st.value]);
const hints = computed<[string, string][]>(() => {
  switch (st.value) {
    case 'desktop': case 'idea-thumbs': return [['Super', 'Overview'], ['Super+N', 'Events'], ['Super+Z', 'Snap layouts'], ['Super+Left', 'Snap left'], ['Super+Right', 'Snap right'], ['Super+Up', 'Maximise'], ['Alt', 'Menus'], ['Alt+Tab', 'Switch']];
    case 'drag': return [['Shift', 'Show zones while dragging'], ['Super+Z', 'Layouts'], ['Ctrl', 'Span two zones'], ['Esc', 'Cancel']];
    case 'snapped': return [['Super+Left', 'Move to left zone'], ['Super+Right', 'Move to right zone'], ['Super+Up', 'Maximise'], ['Super+Down', 'Float again'], ['Alt+Tab', 'Next window']];
    case 'events': return [['Super+N', 'Close Events'], ['Esc', 'Close'], ['Delete', 'Dismiss event']];
    case 'dock-edit': return [['Esc', 'Done'], ['Delete', 'Remove item']];
    case 'idea-viewmenu': return [['Alt+V', 'View menu'], ['Up+Down', 'Choose'], ['Enter', 'Switch view']];
    case 'idea-close': return [['Ctrl+W', 'Close window'], ['Ctrl+Z', 'Undo close (5 s)']];
    default: return [];
  }
});
</script>
<template>
  <XDesktop :label="info.title">
    <XMenuBar :app="barApp" :label="barLabel" :active="events ? 'events' : null" :open-menu="st === 'desktop' ? null : null" @events="st = events ? 'desktop' : 'events'" />
    <div class="x-desktop__area x-v2" :class="`x-v2--${st}`">
      <!-- windows -->
      <template v-if="st !== 'decor'">
        <XWin v-for="w in wins" :key="st + w.app" :app="w.app" :x="w.x" :y="w.y" :w="w.w" :h="w.h" :tiled="w.tiled"
          :focused="st === 'snapped' ? w.app === 'Calendar' : focused === w.app" :z="w.app === focused ? 9 : w.z"
          :dragging="dragApp === w.app" :closing="w.app === 'Mail' ? closing : 0" :view-menu="st === 'idea-viewmenu' && w.app === 'Mail'" :hints="st === 'idea-viewmenu'"
          :id-prefix="`v2-${st}-${w.app}`" @focus="focused = w.app" @close="st = 'desktop'" @maximise="snapFocused(0)" />
      </template>

      <!-- 2: drag to snap -->
      <template v-if="st === 'drag'">
        <XZones layout="thirds" :area="area" :hot="2" app="Mail" />
        <XLayoutPicker v-if="picker" layout="thirds" :zone="2" style="left: 640px; top: 10px" @pick="pickLayout" />
        <XCursor :x="1180" :y="44" />
      </template>
      <XLayoutPicker v-else-if="picker && !overview" style="left: 640px; top: 10px" @pick="pickLayout" />

      <!-- 7: decorations close-up -->
      <div v-if="st === 'decor'" class="x-decor">
        <section class="x-decor__anat hd-on-chrome" aria-label="Header bar anatomy">
          <div class="x-decor__g"><div class="x-decor__p"><HdToolIcon icon="back" label="Back" /></div><span>Back<br /><XKey keys="Alt+Left" /></span></div>
          <div class="x-decor__g"><div class="x-decor__p x-decor__t">Inbox <HdIcon name="chevron-down" :size="18" /></div><span>Title = view menu<br /><XKey keys="Alt+V" /></span></div>
          <div class="x-decor__g x-decor__grow"><div class="x-decor__p x-decor__drag"></div><span>Drag area (double-click maximises, drag down closes)</span></div>
          <div class="x-decor__g"><div class="x-decor__p"><HdToolIcon icon="add" label="Compose" /><HdToolIcon icon="search" label="Search" /><HdToolIcon icon="refresh" label="Refresh" /></div><span>App actions<br /><XKey keys="Ctrl+N" /> <XKey keys="Ctrl+F" /> <XKey keys="F5" /></span></div>
          <div class="x-decor__g"><div class="x-decor__p"><HdToolIcon icon="more" label="Menu" /></div><span>App menu<br /><XKey keys="Alt" /></span></div>
          <div class="x-decor__g"><div class="x-decor__p"><span class="x-decor__sep"></span></div><span>Divider</span></div>
          <div class="x-decor__g"><div class="x-decor__p x-decor__ctl"><HdToolIcon icon="minimize" label="Minimise" /><HdToolIcon icon="maximize" label="Maximise" /><HdToolIcon icon="close" label="Close" class="x-decor__close" /></div><span>Window controls<br /><XKey keys="Super+Down" /> <XKey keys="Super+Up" /> <XKey keys="Ctrl+W" /></span></div>
        </section>
        <div class="x-decor__rows">
          <p class="x-decor__cap">Mail · active · reading a message (Back shown)</p>
          <div class="x-decor__win"><XWin app="Mail" :w="1200" :h="150" focused back id-prefix="dc1" /></div>
          <p class="x-decor__cap">Mail · inactive</p>
          <div class="x-decor__win"><XWin app="Mail" :w="1200" :h="150" id-prefix="dc2" /></div>
          <p class="x-decor__cap">Plain app (Notes, no app actions) · active</p>
          <div class="x-decor__win"><XWin app="Notes" plain :w="1200" :h="150" focused id-prefix="dc3" /></div>
          <p class="x-decor__cap">Plain app · inactive</p>
          <div class="x-decor__win"><XWin app="Notes" plain :w="1200" :h="150" id-prefix="dc4" /></div>
        </div>
        <aside class="x-decor__notes hd-on-page">
          <h3>Rules</h3>
          <p>One row of chrome per window, 44px, chrome surface.</p>
          <p>Back sits top-left only when the app has navigation; otherwise the lit app squircle.</p>
          <p>Title in light type; a chevron means it opens the view menu.</p>
          <p>Every icon button and its hover/pressed highlight is a squircle; close turns red on hover.</p>
          <p>Inactive: header content at 50%, smaller shadow.</p>
        </aside>
      </div>

      <!-- 4: overview / idea: gestures (mid-flick) -->
      <XOverview2 v-if="overview" v-model:page="page" v-model:query="q" :left="dockPos === 'left' ? dockT : 0" :offset="st === 'idea-gestures' ? -0.42 : 0" :hints="st !== 'idea-gestures'" @open="(n: string) => { focused = n; st = 'desktop'; }" />
      <div v-if="st === 'idea-gestures'" class="x-gest hd-on-overlay" aria-label="Touchpad gestures">
        <svg width="200" height="130" viewBox="0 0 200 130" aria-hidden="true">
          <rect x="4" y="4" width="192" height="122" rx="14" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="2" />
          <g fill="var(--hd-accent)"><circle cx="78" cy="60" r="9" /><circle cx="100" cy="54" r="9" /><circle cx="122" cy="60" r="9" /></g>
          <path d="M150 92H50m0 0l12-9m-12 9l12 9" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" />
        </svg>
        <div class="x-gest__txt">
          <b>Swipe with three fingers</b>
          <span><i>↑</i> overview · <i>← →</i> flick Events / Windows / Applications · <i>↓</i> back to the desktop</span>
          <span><i>4 fingers ← →</i> switch workspaces</span>
        </div>
      </div>

      <!-- 5: events panel -->
      <Transition name="x-slide"><XEventsPanel v-if="events" @close="st = 'desktop'" /></Transition>

      <!-- idea: drag-down close -->
      <template v-if="st === 'idea-close'">
        <div class="x-closezone"><span>Release to close Mail</span><XKey keys="Ctrl+Z" label="Undo" /> undo</div>
        <XCursor :x="1010" :y="610" />
      </template>

      <!-- dock -->
      <XDock v-if="st !== 'decor'" :position="dockPos" :auto-hide="autoHide" :revealed="autoHide" :editing="st === 'dock-edit'" :thumbs="st === 'idea-thumbs'" :peek-thumb="st === 'idea-thumbs' ? 'Mail' : undefined"
        :active="overview ? undefined : focused" :launcher-active="overview" :hints="!overview" @launcher="st = overview ? 'desktop' : 'overview'" />
      <template v-if="st === 'dock-edit'">
        <div class="x-editbanner hd-on-overlay"><HdIcon name="edit" :size="18" /><b>Edit dock</b><span>Drag the handle to any screen edge · drag the side to resize · × removes</span><XKey keys="Esc" /> Done</div>
        <XDockSettings style="left: 104px; top: 260px" />
      </template>
      <XCursor v-if="st === 'dock-autohide'" :x="6" :y="520" />
      <div v-if="st === 'dock-autohide'" class="x-chip hd-on-overlay" style="left: 110px; bottom: 24px">Pointer at the left edge, or <XKey keys="Super" />, slides the dock in · it hides again when you leave</div>
      <XCursor v-if="st === 'idea-thumbs'" :x="44" :y="200" />

      <XHints v-if="hints.length && !events" :corner="dockPos === 'bottom' ? 'br' : 'br'" :items="hints" :style="dockPos === 'bottom' ? 'bottom: 96px' : undefined" />
    </div>
  </XDesktop>
</template>
<style>
.x-v2 { overflow: hidden; }
.x-v2--dock-edit .x-win { filter: saturate(.6) brightness(.8); }
.x-editbanner { position: absolute; z-index: 46; top: 12px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 2px var(--hd-accent); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); }
.x-editbanner span { color: var(--hd-c-fg-secondary); }
.x-chip { position: absolute; z-index: 46; display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); }
.x-closezone { position: absolute; z-index: 20; left: 72px; right: 0; bottom: 0; height: 110px; display: flex; align-items: flex-end; justify-content: center; gap: 8px; padding-bottom: 22px; color: #fff; font: 700 var(--hd-font-size-default)/1 var(--hd-font-family-base);
  background: linear-gradient(transparent, color-mix(in srgb, var(--hd-color-palette-warning) 55%, transparent)); }
.x-closezone .x-key { color: #fff; }
.x-gest { position: absolute; z-index: 50; left: 50%; bottom: 40px; transform: translateX(-50%); display: flex; align-items: center; gap: 24px; padding: 18px 26px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); }
.x-gest__txt { display: flex; flex-direction: column; gap: 8px; font: 400 var(--hd-font-size-small)/1.3 var(--hd-font-family-base); }
.x-gest__txt b { font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1 var(--hd-font-family-light); }
.x-gest__txt i { font-style: normal; font-weight: 700; color: var(--hd-accent); }
/* decorations close-up */
.x-decor { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 380px; grid-template-rows: auto 1fr; gap: 24px 32px; padding: 28px 40px; }
.x-decor__anat { grid-column: 1 / -1; display: flex; align-items: flex-start; gap: 6px; padding: 14px 18px 12px; border-radius: var(--hd-radius-card); background: var(--hd-surface-chrome); color: var(--hd-c-fg); }
.x-decor__g { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; font: 400 var(--hd-font-size-xsmall)/1.5 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-decor__grow { flex: 1; }
.x-decor__p { display: flex; align-items: center; height: 64px; padding: 0 8px; border-radius: 8px; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--hd-accent) 70%, transparent); color: var(--hd-c-fg); }
.x-decor__p .hd-tool-icon { width: 54px; height: 54px; --hd-sq-size: 50px; }
.x-decor__p .hd-tool-icon svg { width: 30px; height: 30px; }
.x-decor__p .hd-tool-icon:first-child { --hd-sq-fill: var(--hd-c-pressed); }
.x-decor__t { gap: 6px; font: var(--hd-font-weight-light) 32px/1 var(--hd-font-family-light); }
.x-decor__drag { align-self: stretch; background: repeating-linear-gradient(45deg, transparent 0 8px, color-mix(in srgb, var(--hd-c-fg) 8%, transparent) 8px 16px); }
.x-decor__sep { width: 1px; height: 30px; background: var(--hd-c-divider); }
.x-decor__ctl .hd-tool-icon { width: 44px; height: 44px; --hd-sq-size: 40px; }
.x-decor__ctl .hd-tool-icon svg { width: 22px; height: 22px; }
.x-decor__close { --hd-sq-fill: var(--hd-color-palette-warning) !important; color: #fff; }
.x-decor__rows { display: flex; flex-direction: column; gap: 6px; }
.x-decor__cap { margin: 8px 0 2px; font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-decor__win { position: relative; height: 150px; }
.x-decor__win .x-win { position: relative; left: auto !important; top: auto !important; width: 100% !important; }
.x-decor__notes { align-self: start; padding: 18px 22px; border-radius: var(--hd-radius-card); background: var(--hd-c-bg); color: var(--hd-c-fg); font-size: var(--hd-font-size-small); line-height: 1.45; box-shadow: 0 0 0 1px var(--hd-c-divider); }
.x-decor__notes h3 { margin: 0 0 8px; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1 var(--hd-font-family-light); }
.x-decor__notes p { margin: 0 0 8px; }
.x-slide-enter-active, .x-slide-leave-active { transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.x-slide-enter-from, .x-slide-leave-to { transform: translateX(100%); }
</style>
