<script setup lang="ts">
/**
 * Desktop v2 (merges v1 A + B, D's peek dock): overlapping windows with integrated N9 header bars, snapping by keyboard
 * or drag, a light floating dock (left by default; a full-height panel is an option), a global menu bar, a Windows view
 * (Super+Tab, Super + wheel zooms like the phone's Open apps), a launcher (Super), the Events panel (Super+N) and a status menu.
 * Live keys: Super, Super+Tab, Tab, Super+N, Super+Z, Super+Left/Right/Down, typing in the launcher, Esc.
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
import XWindows from './XWindows.vue';
import XLauncher from './XLauncher.vue';
import XEventsPanel from './XEventsPanel.vue';
import XStatusPanel from './XStatusPanel.vue';
import { useDesktopKeys } from '../desktop/useDesktopKeys';
import { workArea, zoneRects, dockThickness, GAP, OPEN_WINDOWS, type DockPos, type LayoutId, type Rect, type ZoomLevel } from './geometry';
import { STATES, type V2State } from './states';
const props = withDefaults(defineProps<{ state?: V2State; query?: string }>(), { state: 'desktop', query: '' });
const st = ref<V2State>(props.state);
watch(() => props.state, (v) => (st.value = v));
const q = ref(props.query || (props.state === 'search' ? 'mu' : ''));
const LEVEL: Partial<Record<V2State, ZoomLevel>> = { windows: 3, 'windows-carousel': 1, 'windows-4': 4, 'idea-gestures': 2 };
const level = ref<ZoomLevel>(LEVEL[props.state] ?? 3);
const sel = ref(props.state === 'windows-carousel' ? 1 : 0);
watch(st, (v) => { if (LEVEL[v]) level.value = LEVEL[v]!; });
const focused = ref('Mail');
const picker = ref(props.state === 'drag');
const snap = ref<Record<string, number>>({});

const dockPos = computed<DockPos>(() => (st.value === 'dock-bottom' ? 'bottom' : 'left'));
const panel = computed(() => st.value === 'dock-panel');
const autoHide = computed(() => st.value === 'dock-autohide');
const area = computed(() => workArea(dockPos.value, 44, autoHide.value));
const winView = computed(() => st.value in LEVEL);
const launcher = computed(() => st.value === 'search');
const events = computed(() => st.value === 'events' || st.value === 'events-month');
const status = computed(() => st.value === 'status');
const RUNNING = OPEN_WINDOWS.map((o) => o.app);

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
const barApp = computed(() => (winView.value || launcher.value ? '' : st.value === 'snapped' ? 'Calendar' : focused.value));
const barLabel = computed(() => (winView.value ? 'Windows' : launcher.value ? 'Launcher' : ''));
function open(n: string) { focused.value = n; q.value = ''; st.value = 'desktop'; }

function snapFocused(i: number) { snap.value = { ...snap.value, [focused.value]: i }; }
useDesktopKeys((e) => {
  const k = e.key;
  if (e.metaKey && k === 'Tab') { e.preventDefault(); if (winView.value) sel.value = (sel.value + 1) % RUNNING.length; else st.value = 'windows'; return; }
  if ((k === 'Meta' || k === 'OS') && !e.ctrlKey) { st.value = launcher.value ? 'desktop' : 'search'; return; }
  if (e.metaKey && (k === 'n' || k === 'N')) { st.value = events.value ? 'desktop' : 'events'; return; }
  if (e.metaKey && (k === 'z' || k === 'Z')) { picker.value = !picker.value; return; }
  if (k === 'Escape') { picker.value = false; q.value = ''; st.value = 'desktop'; return; }
  if (winView.value) {
    if (k === 'Tab' || k === 'ArrowRight') { e.preventDefault(); sel.value = (sel.value + 1) % RUNNING.length; }
    else if (k === 'ArrowLeft') sel.value = (sel.value + RUNNING.length - 1) % RUNNING.length;
    else if (k === 'Enter') open(RUNNING[sel.value]!);
    return;
  }
  if (launcher.value) {
    if (k === 'Backspace') q.value = q.value.slice(0, -1);
    else if (k.length === 1 && !e.metaKey && !(e.target instanceof HTMLInputElement)) q.value += k;
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
    case 'desktop': case 'idea-thumbs': case 'dock-panel': case 'dock-bottom': return [['Super+Tab', 'Windows'], ['Super+Wheel', 'Zoom windows'], ['Super', 'Launcher'], ['Super+N', 'Events'], ['Super+Z', 'Snap layouts'], ['Super+Left', 'Snap left'], ['Super+Right', 'Snap right'], ['Super+Up', 'Maximise'], ['Alt', 'Menus']];
    case 'drag': return [['Shift', 'Show zones while dragging'], ['Super+Z', 'Layouts'], ['Ctrl', 'Span two zones'], ['Esc', 'Cancel']];
    case 'snapped': return [['Super+Left', 'Move to left zone'], ['Super+Right', 'Move to right zone'], ['Super+Up', 'Maximise'], ['Super+Down', 'Float again'], ['Super+Tab', 'Windows']];
    case 'windows': case 'windows-carousel': case 'windows-4': return [['Super+Tab', 'Next window'], ['Super+Wheel', 'Zoom: 1 · 2 · 3 · 4 per row'], ['Ctrl+Pinch', 'Zoom (touchpad)'], ['Left+Right', 'Move'], ['Enter', 'Switch'], ['Esc', 'Back']];
    case 'search': return [['Super', 'Close launcher'], ['Enter', 'Open first'], ['Super+Tab', 'Windows'], ['Esc', 'Close']];
    case 'dock-edit': return [['Esc', 'Done'], ['Delete', 'Remove item']];
    case 'idea-viewmenu': return [['Alt+V', 'View menu'], ['Up+Down', 'Choose'], ['Enter', 'Switch view']];
    default: return [];
  }
});
</script>
<template>
  <XDesktop :label="info.title">
    <XMenuBar :app="barApp" :label="barLabel" :active="events ? 'events' : status ? 'status' : null" @events="st = events ? 'desktop' : 'events'" @status="st = status ? 'desktop' : 'status'" />
    <div class="x-desktop__area x-v2" :class="`x-v2--${st}`">
      <!-- windows -->
      <template v-if="st !== 'decor'">
        <XWin v-for="w in wins" :key="st + w.app" :app="w.app" :x="w.x" :y="w.y" :w="w.w" :h="w.h" :tiled="w.tiled"
          :focused="st === 'snapped' ? w.app === 'Calendar' : focused === w.app" :z="w.app === focused ? 9 : w.z"
          :dragging="dragApp === w.app" :view-menu="st === 'idea-viewmenu' && w.app === 'Mail'" :hints="st === 'idea-viewmenu'"
          :id-prefix="`v2-${st}-${w.app}`" @focus="focused = w.app" @close="st = 'desktop'" @maximise="snapFocused(0)" />
      </template>

      <!-- 2: drag to snap -->
      <template v-if="st === 'drag'">
        <XZones layout="thirds" :area="area" :hot="2" app="Mail" />
        <XLayoutPicker v-if="picker" layout="thirds" :zone="2" style="left: 640px; top: 10px" @pick="pickLayout" />
        <XCursor :x="1180" :y="44" />
      </template>
      <XLayoutPicker v-else-if="picker && !winView" style="left: 640px; top: 10px" @pick="pickLayout" />

      <!-- 7: decorations close-up -->
      <div v-if="st === 'decor'" class="x-decor">
        <section class="x-decor__anat hd-on-chrome" aria-label="Header bar anatomy">
          <div class="x-decor__g"><div class="x-decor__p"><HdToolIcon icon="back" label="Back" /></div><span>Back<br /><XKey keys="Alt+Left" /></span></div>
          <div class="x-decor__g"><div class="x-decor__p x-decor__t">Inbox <HdIcon name="chevron-down" :size="18" /></div><span>Title = view menu<br /><XKey keys="Alt+V" /></span></div>
          <div class="x-decor__g x-decor__grow"><div class="x-decor__p x-decor__drag"></div><span>Drag area (double-click maximises)</span></div>
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

      <!-- 4: Windows view (Super+Tab) / idea: touchpad -->
      <XWindows v-if="winView" v-model:level="level" v-model:selected="sel" :left="dockPos === 'left' ? dockT : 0" @open="open" />
      <div v-if="st === 'idea-gestures'" class="x-gest hd-on-overlay" aria-label="Touchpad gestures">
        <svg width="200" height="130" viewBox="0 0 200 130" aria-hidden="true">
          <rect x="4" y="4" width="192" height="122" rx="14" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="2" />
          <g fill="var(--hd-accent)"><circle cx="70" cy="80" r="9" /><circle cx="92" cy="74" r="9" /><circle cx="114" cy="80" r="9" /></g>
          <path d="M92 58V20m0 0l-9 12m9-12l9 12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" />
          <g fill="none" stroke="var(--hd-accent)" stroke-width="2.5"><circle cx="150" cy="60" r="7" /><circle cx="176" cy="92" r="7" /></g>
          <path d="M140 50l-8-8m44 58l8 8" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        </svg>
        <div class="x-gest__txt">
          <b>Swipe and pinch on the touchpad</b>
          <span><i>3 fingers ↑</i> Windows · <i>↓</i> back to the desktop</span>
          <span><i>Pinch</i> zoom: one at a time · 2 · 3 · 4 per row (same as <i>Super + wheel</i>)</span>
        </div>
      </div>

      <!-- 5: launcher (Super) -->
      <XLauncher v-if="launcher" v-model:query="q" @open="open" />

      <!-- 6: events panel / 7: status menu -->
      <Transition name="x-slide"><XEventsPanel v-if="events" :month="st === 'events-month'" :day="st === 'events-month' ? 26 : 24" @close="st = 'desktop'" /></Transition>
      <XStatusPanel v-if="status" />

      <!-- dock -->
      <XDock v-if="st !== 'decor'" :position="dockPos" :panel="panel" :launcher="panel" :trash="panel" :clock="panel" :auto-hide="autoHide" :revealed="autoHide"
        :editing="st === 'dock-edit'" :thumbs="st === 'idea-thumbs'" :peek-thumb="st === 'idea-thumbs' ? 'Mail' : undefined" :running="RUNNING"
        :active="winView || launcher ? undefined : st === 'snapped' ? 'Calendar' : focused" :launcher-active="launcher" @launcher="st = launcher ? 'desktop' : 'search'" @open="open" />
      <template v-if="st === 'dock-edit'">
        <div class="x-editbanner hd-on-overlay"><HdIcon name="edit" :size="18" /><b>Edit dock</b><span>Drag the handle to any screen edge · × removes · everything else is in the settings</span><XKey keys="Esc" /> Done</div>
        <XDockSettings style="left: 104px; top: 150px" />
      </template>
      <XCursor v-if="st === 'dock-autohide'" :x="6" :y="520" />
      <div v-if="st === 'dock-autohide'" class="x-chip hd-on-overlay" style="left: 110px; bottom: 24px">Pointer at the left edge, or <XKey keys="Super" />, slides the dock in · it hides again when you leave</div>
      <XCursor v-if="st === 'idea-thumbs'" :x="52" :y="440" />

      <XHints v-if="hints.length && !events" corner="br" :items="hints" :style="dockPos === 'bottom' ? 'bottom: 96px' : undefined" />
    </div>
  </XDesktop>
</template>
<style>
.x-v2 { overflow: hidden; }
.x-v2--dock-edit .x-win { filter: saturate(.6) brightness(.8); }
.x-editbanner { position: absolute; z-index: 46; top: 12px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 2px var(--hd-accent); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); }
.x-editbanner span { color: var(--hd-c-fg-secondary); }
.x-chip { position: absolute; z-index: 46; display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); }
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
