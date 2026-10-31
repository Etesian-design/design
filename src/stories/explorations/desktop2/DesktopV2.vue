<script setup lang="ts">
/**
 * Desktop v2 EXTENDS Desktop v1 (it keeps everything v1 has and adds to it): v1's Overview stays the main menu (Super: Events,
 * open windows and apps, full screen). v2 adds overlapping windows with integrated N9 header bars, snapping by keyboard or drag,
 * a light floating dock (left by default; a full-height panel is an option), a global menu bar, a Windows view (Super+Tab,
 * Super + wheel zooms like the phone's Open apps), the spotlight search (Super+Space), the Events panel (Super+N) and a status menu.
 * Live keys: Super, Super+Space, Super+Tab, Tab, Super+N, Super+Z, Super+Left/Right/Down, typing, Esc.
 */
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import XDesktop from '../desktop/XDesktop.vue';
import XHints from '../desktop/XHints.vue';
import XCursor from '../desktop/XCursor.vue';
import XKey from '../parts/XKey.vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdToolIcon from '../../../components/HdToolIcon.vue';
import HdSwitch from '../../../components/HdSwitch.vue';
import XMenuBar from './XMenuBar.vue';
import XDock from './XDock.vue';
import XDockSettings from './XDockSettings.vue';
import XWin from './XWin.vue';
import XZones from './XZones.vue';
import XLayoutPicker from './XLayoutPicker.vue';
import XWindows from './XWindows.vue';
import XLauncher from './XLauncher.vue';
import XOverview from '../parts/XOverview.vue';
import XEventsPanel from './XEventsPanel.vue';
import XStatusPanel from './XStatusPanel.vue';
import XWidgets from './XWidgets.vue';
import { useDesktopKeys } from '../desktop/useDesktopKeys';
import { workArea, zoneRects, dockThickness, GAP, OPEN_WINDOWS, type DockPos, type LayoutId, type Rect, type ZoomLevel } from './geometry';
import { STATES, type V2State } from './states';
const props = withDefaults(defineProps<{ state?: V2State; query?: string }>(), { state: 'desktop', query: '' });
const st = ref<V2State>(props.state);
watch(() => props.state, (v) => (st.value = v));
const q = ref(props.query || (props.state === 'search' ? 'mu' : ''));
const LEVEL: Partial<Record<V2State, ZoomLevel>> = { switch: 1, windows: 3, 'windows-carousel': 1, 'windows-4': 4 };
const level = ref<ZoomLevel>(LEVEL[props.state] ?? 3);
const sel = ref(props.state === 'windows-carousel' || props.state === 'switch' ? 1 : 0);
/** Super+Tab: held = Super is down and the quick switcher is open; locked = the wheel/pinch turned it into a task viewer */
const held = ref(props.state === 'switch');
const locked = ref(props.state in LEVEL && props.state !== 'switch');
let metaDown = false, metaUsed = false;
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
const overview = computed(() => st.value === 'overview');
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
const widgets = computed(() => st.value === 'idea-widgets' || st.value === 'idea-widgets-edit');
const wins = computed<W[]>(() => {
  const a = area.value;
  if (widgets.value) return []; // the windows are minimised: the desktop shows
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
const barApp = computed(() => (winView.value || launcher.value || overview.value ? '' : st.value === 'snapped' ? 'Calendar' : focused.value));
const barLabel = computed(() => (winView.value ? 'Windows' : overview.value ? 'Overview' : launcher.value ? 'Search' : ''));
function open(n: string) { focused.value = n; q.value = ''; held.value = false; locked.value = false; st.value = 'desktop'; }

function snapFocused(i: number) { snap.value = { ...snap.value, [focused.value]: i }; }
const N = RUNNING.length;
function step(d: number) { sel.value = (sel.value + d + N) % N; }
useDesktopKeys((e) => {
  const k = e.key;
  if (k === 'Meta' || k === 'OS') { metaDown = true; metaUsed = false; return; }
  if (e.metaKey) metaUsed = true;
  if (e.metaKey && k === 'Tab') {
    e.preventDefault();
    if (winView.value) step(e.shiftKey ? -1 : 1);
    else { level.value = 1; locked.value = false; held.value = true; sel.value = (RUNNING.indexOf(focused.value) + (e.shiftKey ? N - 1 : 1)) % N; st.value = 'switch'; }
    return;
  }
  if (e.metaKey && k === ' ') { e.preventDefault(); st.value = launcher.value ? 'desktop' : 'search'; return; }
  if (e.metaKey && (k === 'n' || k === 'N')) { st.value = events.value ? 'desktop' : 'events'; return; }
  if (e.metaKey && (k === 'z' || k === 'Z')) { picker.value = !picker.value; return; }
  if (k === 'Escape') { picker.value = false; q.value = ''; st.value = 'desktop'; return; }
  if (winView.value) {
    if (k === 'Tab') { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
    else if (k === 'ArrowRight') step(1);
    else if (k === 'ArrowLeft') step(-1);
    else if (k === 'Enter') open(RUNNING[sel.value]!);
    return;
  }
  if (launcher.value || overview.value) {
    if (k === 'Backspace') q.value = q.value.slice(0, -1);
    else if (k.length === 1 && !e.metaKey && !(e.target instanceof HTMLInputElement)) q.value += k;
    return;
  }
  if (e.metaKey && k === 'ArrowLeft') snapFocused(0);
  else if (e.metaKey && k === 'ArrowRight') snapFocused(1);
  else if (e.metaKey && k === 'ArrowDown') { const s = { ...snap.value }; delete s[focused.value]; snap.value = s; }
});
/** Super released: a tap alone opens or closes the Overview; after Super+Tab it switches, unless the wheel locked the viewer */
function onKeyUp(e: KeyboardEvent) {
  if (e.key !== 'Meta' && e.key !== 'OS') return;
  const used = metaUsed; metaDown = false; metaUsed = false;
  if (held.value) { held.value = false; if (winView.value && !locked.value) open(RUNNING[sel.value]!); return; }
  if (!used && !e.ctrlKey) st.value = overview.value ? 'desktop' : 'overview';
}
function onZoom() { locked.value = true; }
onMounted(() => window.addEventListener('keyup', onKeyUp));
onBeforeUnmount(() => window.removeEventListener('keyup', onKeyUp));
void metaDown;
function pickLayout(_l: LayoutId, z: number) { picker.value = false; snapFocused(Math.min(z, 1)); }
const dockT = dockThickness(44) + GAP;
/** three-finger swipe down to close: a setting, OFF by default */
const swipeClose = ref(false);
const GESTURES = [
  { k: 'side', t: '3 fingers sideways', d: 'Minimise to the desktop; keep swiping to switch windows' },
  { k: 'down', t: '3 fingers down', d: 'Close the window (N9 swipe-down). Optional: off by default so nobody is surprised' },
  { k: 'pinch', t: 'Pinch', d: 'Zoom the Windows view: carousel · 2 · 3 · 4 per row' },
];
const info = computed(() => STATES[st.value]);
const hints = computed<[string, string][]>(() => {
  switch (st.value) {
    case 'desktop': case 'dock-previews': case 'dock-panel': case 'dock-bottom': return [['Super+Tab', 'Switch'], ['Super+Wheel', 'Task viewer'], ['Super', 'Overview'], ['Super+Space', 'Search'], ['Super+N', 'Events'], ['Super+Z', 'Snap layouts'], ['Super+Left', 'Snap left'], ['Super+Right', 'Snap right'], ['Alt', 'Menus'], ['3 fingers ←→', 'Minimise / switch'], ['Pinch', 'Zoom windows']];
    case 'gestures': return [['3 fingers ←→', 'Minimise / switch'], ['Pinch', 'Zoom windows'], ['3 fingers ↓', 'Close (setting, off by default)']];
    case 'switch': return [];
    case 'drag': return [['Shift', 'Show zones while dragging'], ['Super+Z', 'Layouts'], ['Ctrl', 'Span two zones'], ['Esc', 'Cancel']];
    case 'snapped': return [['Super+Left', 'Move to left zone'], ['Super+Right', 'Move to right zone'], ['Super+Up', 'Maximise'], ['Super+Down', 'Float again'], ['Super+Tab', 'Windows']];
    case 'windows': case 'windows-carousel': case 'windows-4': return [['Tab', 'Next window'], ['Shift+Tab', 'Previous'], ['Super+Wheel', 'Zoom: 1 · 2 · 3 · 4 per row'], ['Pinch', 'Zoom (touchpad)'], ['Enter', 'Switch'], ['Esc', 'Close viewer']];
    case 'search': return [['Super+Space', 'Close'], ['Enter', 'Open first'], ['Super', 'Overview'], ['Esc', 'Close']];
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
      <!-- idea: widgets on the wallpaper, under the windows -->
      <XWidgets v-if="widgets" :editing="st === 'idea-widgets-edit'" :left="area.x" />
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
          <div class="x-decor__win"><XWin app="Mail" :w="1200" :h="112" focused back id-prefix="dc1" /></div>
          <p class="x-decor__cap">Mail · inactive</p>
          <div class="x-decor__win"><XWin app="Mail" :w="1200" :h="112" id-prefix="dc2" /></div>
          <p class="x-decor__cap">Plain app (Notes, no app actions) · active</p>
          <div class="x-decor__win"><XWin app="Notes" plain :w="1200" :h="112" focused id-prefix="dc3" /></div>
          <p class="x-decor__cap">Plain app · inactive</p>
          <div class="x-decor__win"><XWin app="Notes" plain :w="1200" :h="112" id-prefix="dc4" /></div>
          <!-- KDE apps (KXmlGui) keep a toolbar under the title bar; the Etesian decoration reads the app's exported menu and
               moves the toolbar's actions into the header, then the app's own toolbar is hidden: one row of chrome, as above. -->
          <div class="x-decor__pair"><div>
          <p class="x-decor__cap">KDE app (Kate) · before: its own toolbar row</p>
          <div class="x-decor__win x-kde hd-on-chrome">
            <div class="x-kde__bar"><span class="x-kde__icon" /><span class="x-kde__title">README.md — Kate</span><span class="x-kde__grow" /><span class="x-decor__sep" /><HdToolIcon icon="minimize" label="Minimise" /><HdToolIcon icon="maximize" label="Maximise" /><HdToolIcon icon="close" label="Close" /></div>
            <div class="x-kde__tools"><span v-for="t in ['New', 'Open', 'Save', 'Save As', 'Undo', 'Redo']" :key="t">{{ t }}</span></div>
            <div class="x-kde__page hd-on-page">The second row only repeats the File and Edit menus.</div>
          </div></div><div>
          <p class="x-decor__cap">after: its actions in the header, toolbar hidden</p>
          <div class="x-decor__win x-kde hd-on-chrome">
            <div class="x-kde__bar"><span class="x-kde__icon" /><span class="x-kde__title">README.md</span><span class="x-kde__grow" />
              <HdToolIcon icon="add" label="New (Ctrl+N)" /><HdToolIcon icon="folder" label="Open (Ctrl+O)" /><HdToolIcon icon="save" label="Save (Ctrl+S)" /><HdToolIcon icon="undo" label="Undo (Ctrl+Z)" /><HdToolIcon icon="redo" label="Redo (Ctrl+Shift+Z)" /><HdToolIcon icon="more" label="Menu" />
              <span class="x-decor__sep" /><HdToolIcon icon="minimize" label="Minimise" /><HdToolIcon icon="maximize" label="Maximise" /><HdToolIcon icon="close" label="Close" /></div>
            <div class="x-kde__page hd-on-page">One row of chrome; menus stay in the menu bar (Alt).</div>
          </div></div></div>
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
      <XWindows v-if="winView" v-model:level="level" v-model:selected="sel" :left="dockPos === 'left' ? dockT : 0" @open="open" @zoom="onZoom" />
      <div v-if="winView && held && !locked" class="x-switchhint hd-on-overlay" role="status"><XKey keys="Super" /> held · <b>Release Super to switch</b> · <XKey keys="Tab" /> next · <XKey keys="Shift+Tab" /> back · <b>Scroll to keep open</b></div>
      <div v-else-if="winView && locked" class="x-switchhint x-switchhint--locked hd-on-overlay" role="status"><HdIcon name="lock" :size="14" /> Viewer kept open · pick a window or <XKey keys="Esc" /></div>
      <div v-if="st === 'gestures'" class="x-gest hd-on-overlay" aria-label="Touchpad gestures">
        <div v-for="g in GESTURES" :key="g.k" class="x-gest__g">
          <svg width="120" height="84" viewBox="0 0 120 84" aria-hidden="true">
            <rect x="3" y="3" width="114" height="78" rx="10" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="2" />
            <g v-if="g.k !== 'pinch'" fill="var(--hd-accent)"><circle cx="44" cy="44" r="7" /><circle cx="60" cy="40" r="7" /><circle cx="76" cy="44" r="7" /></g>
            <path v-if="g.k === 'side'" d="M30 66h60m0 0l-8-6m8 6l-8 6M30 66l8-6m-8 6l8 6" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <path v-if="g.k === 'down'" d="M60 14v18m0 0l-6-7m6 7l6-7" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <template v-if="g.k === 'pinch'"><g fill="var(--hd-accent)"><circle cx="40" cy="30" r="7" /><circle cx="80" cy="56" r="7" /></g><path d="M50 38l8 8m4 0l8 8M30 20l-6-6m66 50l6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></template>
          </svg>
          <b>{{ g.t }}</b><span>{{ g.d }}</span>
          <label v-if="g.k === 'down'" class="x-gest__opt"><HdSwitch v-model="swipeClose" aria-label="Three-finger swipe down closes windows" /> Swipe down to close · Off</label>
        </div>
      </div>

      <!-- 5: the Overview (Super), v1's main menu / 5b: the spotlight (Super+Space), a v2 addition -->
      <Transition name="x-ov"><XOverview v-if="overview" v-model:query="q" :apps="RUNNING" spotlight @open="open" /></Transition>
      <XLauncher v-if="launcher" v-model:query="q" @open="open" />

      <!-- 6: events panel / 7: status menu -->
      <Transition name="x-slide"><XEventsPanel v-if="events" :month="st === 'events-month'" :day="st === 'events-month' ? 26 : 24" @close="st = 'desktop'" /></Transition>
      <XStatusPanel v-if="status" />

      <!-- dock -->
      <XDock v-if="st !== 'decor'" :position="dockPos" :panel="panel" :clock="panel" :auto-hide="autoHide" :revealed="autoHide"
        :editing="st === 'dock-edit'" :previews="st === 'dock-previews'" :peek-thumb="st === 'dock-previews' ? 'Mail' : undefined" :running="RUNNING"
        :active="winView || launcher || overview ? undefined : st === 'snapped' ? 'Calendar' : focused" :launcher-active="overview" @launcher="st = overview ? 'desktop' : 'overview'" @open="open" />
      <template v-if="st === 'dock-edit'">
        <div class="x-editbanner hd-on-overlay"><HdIcon name="edit" :size="18" /><b>Edit dock</b><span>Drag the handle to any screen edge · × removes · everything else is in the settings</span><XKey keys="Esc" /> Done</div>
        <XDockSettings style="left: 104px; top: 150px" />
      </template>
      <XCursor v-if="st === 'dock-autohide'" :x="6" :y="520" />
      <div v-if="st === 'dock-autohide'" class="x-chip hd-on-overlay" style="left: 110px; bottom: 24px">Pointer at the left edge, or <XKey keys="Super" />, slides the dock in · it hides again when you leave</div>
      <XCursor v-if="st === 'dock-previews'" :x="52" :y="440" />

      <XHints v-if="hints.length && !events && !overview" corner="br" :items="hints" :style="dockPos === 'bottom' ? 'bottom: 96px' : undefined" />
    </div>
  </XDesktop>
</template>
<style>
.x-v2 { overflow: hidden; }
.x-v2--dock-edit .x-win { filter: saturate(.6) brightness(.8); }
.x-editbanner { position: absolute; z-index: 46; top: 12px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 2px var(--hd-accent); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); }
.x-editbanner span { color: var(--hd-c-fg-secondary); }
.x-chip { position: absolute; z-index: 46; display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); }
.x-gest { position: absolute; z-index: 50; left: 50%; bottom: 120px; transform: translateX(-50%); display: flex; gap: 28px; padding: 20px 26px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); }
.x-gest__g { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 230px; text-align: center; font: 400 var(--hd-font-size-small)/1.3 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-gest__g b { font: var(--hd-font-weight-light) var(--hd-font-size-large)/1.1 var(--hd-font-family-light); color: var(--hd-c-fg); }
.x-gest__opt { white-space: nowrap; display: inline-flex; align-items: center; gap: 8px; margin-top: 6px; padding: 6px 10px; border-radius: 8px; background: color-mix(in srgb, var(--hd-c-fg) 7%, transparent); color: var(--hd-c-fg); font-size: var(--hd-font-size-xsmall); }
.x-switchhint { position: absolute; z-index: 50; left: 50%; bottom: 22px; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg-secondary); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); white-space: nowrap; }
.x-switchhint b { color: var(--hd-c-fg); }
.x-switchhint--locked { color: var(--hd-c-fg); }
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
.x-kde { border-radius: var(--hd-radius-card); overflow: hidden; background: var(--hd-surface-chrome); color: var(--hd-c-fg); }
.x-kde__bar { display: flex; align-items: center; gap: 4px; height: 44px; padding: 0 6px; }
.x-kde__icon { width: 22px; height: 22px; margin: 0 4px; --hd-sq-size: 22px; background: linear-gradient(#F9B233, #E07B00); clip-path: url(#hd-squircle-clip); border-radius: 30%; }
.x-kde__title { font: var(--hd-font-weight-light) 21px/1 var(--hd-font-family-light); }
.x-kde__grow { flex: 1; }
.x-kde__tools { display: flex; gap: 18px; height: 34px; align-items: center; padding: 0 14px; border-top: 1px solid var(--hd-c-divider); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-kde__page { padding: 10px 14px; background: var(--hd-c-bg); color: var(--hd-c-fg); font-size: var(--hd-font-size-small); }
.x-decor__sep { width: 1px; height: 30px; background: var(--hd-c-divider); }
.x-decor__ctl .hd-tool-icon { width: 44px; height: 44px; --hd-sq-size: 40px; }
.x-decor__ctl .hd-tool-icon svg { width: 22px; height: 22px; }
.x-decor__close { --hd-sq-fill: var(--hd-color-palette-warning) !important; color: #fff; }
.x-decor__rows { display: flex; flex-direction: column; gap: 6px; }
.x-decor__cap { margin: 8px 0 2px; font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-decor__win { position: relative; height: 112px; }
.x-decor__pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.x-decor__win.x-kde { height: auto; }
.x-kde__bar .hd-tool-icon { width: 34px; height: 34px; --hd-sq-size: 32px; }
.x-kde__bar .hd-tool-icon svg { width: 20px; height: 20px; }
.x-decor__win .x-win { position: relative; left: auto !important; top: auto !important; width: 100% !important; }
.x-decor__notes { align-self: start; padding: 18px 22px; border-radius: var(--hd-radius-card); background: var(--hd-c-bg); color: var(--hd-c-fg); font-size: var(--hd-font-size-small); line-height: 1.45; box-shadow: 0 0 0 1px var(--hd-c-divider); }
.x-decor__notes h3 { margin: 0 0 8px; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1 var(--hd-font-family-light); }
.x-decor__notes p { margin: 0 0 8px; }
.x-slide-enter-active, .x-slide-leave-active { transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.x-slide-enter-from, .x-slide-leave-to { transform: translateX(100%); }
</style>
