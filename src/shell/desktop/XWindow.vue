<script setup lang="ts">
/**
 * A desktop window: the app's toolbar IS the header bar (docs/21-desktop.md). From the left: Back (when the app has
 * navigation) or the app's lit squircle; the title, or a view menu when the app has views; the app's own actions (the
 * `actions` slot: real buttons, as many as the app needs); a divider; minimise, maximise and close (44 px targets).
 * No second app bar inside. Inactive windows show their header at half strength.
 *
 * Moving and resizing belong to the desktop (windowManager.ts): the window reports a press on its bar (`grab`) or on one of
 * its edges and corners (`resize`), and a double-click on the bar maximises. While anything moves, `busy` lays a shield over
 * the content so a page (an iframe, a canvas) cannot take the pointer. In the Windows switcher the window itself becomes the
 * card (`card`: scaled in place), so the card is always the live window, never a copy.
 */
import { ref, watch, computed } from 'vue';
import HdSquircle from '../../components/HdSquircle.vue';
import HdIcon from '../../components/HdIcon.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import HdTooltip from '../../components/HdTooltip.vue';
import HdToolBar from '../../components/HdToolBar.vue';
import type { IconTone } from '../../lighting';
import type { XAction } from '../parts/types';

export interface WindowCard { x: number; y: number; s: number; z: number; side: boolean }
const props = withDefaults(defineProps<{
  title: string; icon: string; color: string; tone?: IconTone;
  x?: number; y?: number; w?: number; h?: number; z?: number;
  focused?: boolean; tiled?: boolean; maximised?: boolean; dragging?: boolean; busy?: boolean;
  /** show Back instead of the app icon */
  back?: boolean;
  /** the app's views: the title becomes a menu of them (Alt+V) */
  views?: string[]; view?: string;
  card?: WindowCard | null;
  /** resizable from its edges (a floating window) */
  resizable?: boolean;
  /** the view menu starts open (Storybook) */
  menuOpen?: boolean;
  /**
   * The app's actions in priority order (instead of the `actions` slot). The header shows as many as fit, from the first;
   * the rest go into ⋯ at the right end. Below `narrowAt` px the window takes the phone pattern: Back and the first three
   * actions move to a bottom toolbar, the rest into its ⋯; the header keeps the title and the window controls. Nothing is
   * ever cut off, and minimise, maximise and close never move.
   */
  tools?: XAction[]; narrowAt?: number;
  /** ⋯ starts open (Storybook) */
  moreOpen?: boolean;
}>(), { x: 0, y: 0, w: 900, h: 600, z: 1, card: null, resizable: true, menuOpen: false, narrowAt: 560, moreOpen: false });
const emit = defineEmits<{
  close: []; minimise: []; maximise: []; focus: []; back: []; 'update:view': [view: string];
  grab: [e: PointerEvent]; resize: [handle: string, e: PointerEvent]; tool: [label: string];
}>();
const more = ref(props.moreOpen);
watch(() => props.moreOpen, (v) => (more.value = v));
watch(() => props.focused, (f) => { if (!f) more.value = false; });
const narrow = computed(() => !!props.tools && props.w < props.narrowAt);
/** header room for actions: the width less the lead, the title, the drag gap, ⋯, the divider and the window controls */
const fits = computed(() => {
  const t = props.tools ?? [];
  const title = (props.views?.length ? (props.view ?? props.views[0] ?? '') : props.title).length * 11 + (props.views?.length ? 44 : 16);
  const room = props.w - 6 - 40 - title - 48 - 5 - 132;
  const n = Math.max(0, Math.floor(room / 40));
  return n >= t.length ? t.length : Math.max(0, Math.floor((room - 40) / 40));
});
const BOTTOM = 3;
const shown = computed(() => (props.tools ?? []).slice(0, narrow.value ? 0 : fits.value));
const below = computed(() => (props.tools ?? []).slice(0, BOTTOM));
const folded = computed(() => (props.tools ?? []).slice(narrow.value ? BOTTOM : fits.value));
function tool(label: string) { more.value = false; emit('tool', label); }
const HANDLES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

const menu = ref(props.menuOpen);
watch(() => props.menuOpen, (v) => (menu.value = v));
watch(() => props.focused, (f) => { if (!f) menu.value = false; });
function pick(v: string) { menu.value = false; emit('update:view', v); }
function barDown(e: PointerEvent) {
  if (e.button !== 0 || (e.target as Element).closest('button, a, input, select, textarea, [role=textbox]')) return;
  emit('grab', e);
}
function barDbl(e: MouseEvent) { if (!(e.target as Element).closest('button, a, input')) emit('maximise'); }
function onKey(e: KeyboardEvent) { if (e.altKey && (e.key === 'v' || e.key === 'V') && props.views?.length) { e.preventDefault(); menu.value = !menu.value; } }

const style = computed(() => {
  const c = props.card;
  if (c) return { left: `${c.x}px`, top: `${c.y}px`, width: `${props.w}px`, height: `${props.h}px`, zIndex: c.z, transform: `scale(${c.s})`, transformOrigin: '0 0', opacity: c.side ? 0.5 : 1 };
  return { left: `${props.x}px`, top: `${props.y}px`, width: `${props.w}px`, height: `${props.h}px`, zIndex: props.z };
});
</script>
<template>
  <section class="x-win" :class="{ 'is-focused': focused, 'is-tiled': tiled, 'is-dragging': dragging, 'is-card': !!card }" :style="style" role="region"
    :aria-label="`${title} window`" @pointerdown.capture="emit('focus')" @keydown="onKey">
    <header class="x-win__bar hd-on-chrome" @pointerdown="barDown" @dblclick="barDbl">
      <span class="x-win__lead">
        <HdTooltip v-if="back && !narrow" text="Back (Alt+Left)" placement="bottom"><HdToolIcon icon="back" label="Back" @click="emit('back')" /></HdTooltip>
        <HdSquircle v-else :size="26" :color="color" lighting="lit" :tone="tone" class="x-win__appicon"><HdIcon :name="icon" :size="15" :lit="tone === 'light' ? 'dark' : true" /></HdSquircle>
      </span>
      <button v-if="views?.length" type="button" class="x-win__title x-win__title--menu hd-focusable" :aria-expanded="menu ? 'true' : 'false'" aria-haspopup="listbox"
        title="Views (Alt+V)" @click.stop="menu = !menu">
        <span>{{ view ?? views[0] }}</span><HdIcon name="chevron-down" :size="16" />
      </button>
      <slot v-else-if="$slots.title" name="title" />
      <h2 v-else class="x-win__title">{{ title }}</h2>
      <span class="x-win__drag" aria-hidden="true"></span>
      <span v-if="tools && !narrow" class="x-win__actions" role="toolbar" :aria-label="`${title} actions`">
        <HdTooltip v-for="t in shown" :key="t.label" :text="t.label" placement="bottom"><HdToolIcon :icon="t.icon" :label="t.label" @click="tool(t.label)" /></HdTooltip>
        <HdToolIcon v-if="folded.length" icon="more-vert" label="More" :aria-expanded="more ? 'true' : 'false'" class="x-win__more" @click.stop="more = !more" />
      </span>
      <span v-else-if="$slots.actions" class="x-win__actions"><slot name="actions" /></span>
      <span class="x-win__sep" aria-hidden="true"></span>
      <span class="x-win__ctl">
        <HdToolIcon icon="minimize" label="Minimise" @click="emit('minimise')" />
        <HdToolIcon icon="maximize" :label="maximised ? 'Restore' : 'Maximise'" @click="emit('maximise')" />
        <HdToolIcon icon="close" label="Close" class="x-win__close" @click="emit('close')" />
      </span>
    </header>
    <div class="x-win__body hd-on-page">
      <slot />
      <div v-if="busy || card" class="x-win__shield" aria-hidden="true"></div>
    </div>
    <HdToolBar v-if="narrow" class="x-win__bottom" :back="back" :label="`${title} toolbar`" @back="emit('back')">
      <HdToolIcon v-for="t in below" :key="t.label" :icon="t.icon" :label="t.label" @click="tool(t.label)" />
      <template v-if="folded.length" #right><HdToolIcon icon="more-vert" label="More" :aria-expanded="more ? 'true' : 'false'" class="x-win__more" @click.stop="more = !more" /></template>
    </HdToolBar>
    <div v-if="more && folded.length" class="x-moremenu hd-on-overlay" :class="{ 'is-below': narrow }" role="menu" :aria-label="`${title} more actions`">
      <button v-for="t in folded" :key="t.label" type="button" role="menuitem" class="x-viewmenu__item hd-focusable" @click="tool(t.label)">
        <HdIcon :name="t.icon" :size="20" /><span>{{ t.label }}</span>
      </button>
    </div>
    <div v-if="menu && views?.length" class="x-viewmenu hd-on-overlay" role="listbox" :aria-label="`${title} views`">
      <button v-for="v in views" :key="v" type="button" role="option" class="x-viewmenu__item hd-focusable" :aria-selected="v === (view ?? views[0]) ? 'true' : 'false'" @click="pick(v)">
        <span class="x-viewmenu__mark hd-sq" :class="{ 'is-on': v === (view ?? views[0]) }"><HdIcon v-if="v === (view ?? views[0])" name="check" :size="14" /></span>
        <span>{{ v }}</span>
      </button>
    </div>
    <template v-if="resizable && !tiled && !card">
      <span v-for="hd in HANDLES" :key="hd" class="x-win__rz" :class="`is-${hd}`" aria-hidden="true" @pointerdown.stop="emit('resize', hd, $event)"></span>
    </template>
  </section>
</template>
<style>
.x-win { position: absolute; display: flex; flex-direction: column; overflow: visible; border-radius: var(--hd-radius-card); background: var(--hd-c-bg);
  box-shadow: 0 0 0 1px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.28); transition: box-shadow var(--hd-motion-duration-fast); }
.x-win.is-focused { box-shadow: 0 0 0 1px rgba(0,0,0,.45), 0 20px 56px rgba(0,0,0,.5); }
.x-win.is-tiled { border-radius: 6px; }
.x-win.is-dragging { opacity: .9; box-shadow: 0 0 0 2px var(--hd-accent), 0 30px 70px rgba(0,0,0,.55); }
.x-win.is-card { transition: left var(--hd-motion-duration-default) var(--hd-motion-easing-out), top var(--hd-motion-duration-default) var(--hd-motion-easing-out),
  transform var(--hd-motion-duration-default) var(--hd-motion-easing-out), opacity var(--hd-motion-duration-default); }
.x-win__bar { flex: none; display: flex; align-items: center; gap: 4px; height: 44px; padding: 0 0 0 6px; border-radius: var(--hd-radius-card) var(--hd-radius-card) 0 0;
  background: var(--hd-surface-chrome); color: var(--hd-c-fg); cursor: default; user-select: none; touch-action: none; }
.x-win.is-dragging .x-win__bar { cursor: grabbing; }
.x-win.is-tiled .x-win__bar { border-radius: 6px 6px 0 0; }
.x-win__bar .hd-tool-icon { width: 40px; height: 44px; --hd-sq-size: 34px; }
.x-win__bar .hd-tool-icon svg { width: 20px; height: 20px; }
.x-win__lead { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: 40px; }
.x-win__appicon { margin: 0 4px; }
.x-win__title { flex: 0 1 auto; min-width: 0; margin: 0 6px; padding: 0; border: 0; background: none; color: inherit; font: var(--hd-font-weight-light) 21px/1 var(--hd-font-family-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x-win__title--menu { display: inline-flex; align-items: center; gap: 4px; height: 34px; padding: 0 8px; margin: 0 2px; border-radius: 6px; cursor: pointer; }
.x-win__title--menu:hover, .x-win__title--menu[aria-expanded=true] { background: var(--hd-c-pressed); }
.x-win__drag { flex: 1; align-self: stretch; }
.x-win__actions, .x-win__ctl { flex: none; display: inline-flex; align-items: center; }
.x-win__sep { flex: none; width: 1px; height: 22px; margin: 0 2px; background: var(--hd-c-divider); }
/* the window controls: 44 px targets, the squircle highlight smaller inside them */
.x-win__ctl .hd-tool-icon { width: 44px; height: 44px; --hd-sq-size: 32px; }
.x-win__ctl .hd-tool-icon svg { width: 16px; height: 16px; }
.x-win__close:hover, .x-win__close:focus-visible { --hd-sq-fill: var(--hd-color-palette-warning) !important; color: #fff; }
.x-win:not(.is-focused) .x-win__bar { background: color-mix(in srgb, var(--hd-surface-chrome) 88%, var(--hd-c-bg)); }
.x-win:not(.is-focused) .x-win__bar > * { opacity: .5; }
.x-win__body { position: relative; flex: 1; min-height: 0; display: flex; overflow: hidden; border-radius: 0 0 var(--hd-radius-card) var(--hd-radius-card);
  background: var(--hd-c-bg); color: var(--hd-c-fg); container-type: size; }
.x-win.is-tiled .x-win__body { border-radius: 0 0 6px 6px; }
.x-win__shield { position: absolute; inset: 0; z-index: 10; }
.x-viewmenu { position: absolute; z-index: 5; top: 42px; left: 40px; min-width: 240px; padding: 6px 0; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); }
.x-viewmenu__item { display: flex; align-items: center; gap: 12px; width: 100%; height: 44px; padding: 0 16px 0 12px; border: 0; background: none; color: inherit; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1 var(--hd-font-family-light); text-align: left; cursor: pointer; }
.x-viewmenu__item:hover { background: var(--hd-c-pressed); }
.x-viewmenu__mark { position: relative; flex: none; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; --hd-sq-size: 22px; --hd-sq-ring: var(--hd-c-divider); color: #fff; }
.x-viewmenu__mark.is-on { --hd-sq-fill: var(--hd-accent); --hd-sq-ring: transparent; }
.x-viewmenu__mark .hd-icon { position: relative; z-index: 1; }
/* resize handles: invisible strips along the edges, larger at the corners */
.x-win__rz { position: absolute; z-index: 20; }
.x-win__rz.is-n, .x-win__rz.is-s { left: 12px; right: 12px; height: 8px; cursor: ns-resize; }
.x-win__rz.is-n { top: -4px; } .x-win__rz.is-s { bottom: -4px; }
.x-win__rz.is-e, .x-win__rz.is-w { top: 12px; bottom: 12px; width: 8px; cursor: ew-resize; }
.x-win__rz.is-e { right: -4px; } .x-win__rz.is-w { left: -4px; }
.x-win__rz.is-ne, .x-win__rz.is-nw, .x-win__rz.is-se, .x-win__rz.is-sw { width: 16px; height: 16px; }
.x-win__rz.is-ne { top: -4px; right: -4px; cursor: nesw-resize; } .x-win__rz.is-sw { bottom: -4px; left: -4px; cursor: nesw-resize; }
.x-win__rz.is-nw { top: -4px; left: -4px; cursor: nwse-resize; } .x-win__rz.is-se { bottom: -4px; right: -4px; cursor: nwse-resize; }
.x-moremenu { position: absolute; z-index: 5; top: 42px; right: 140px; min-width: 220px; padding: 6px 0; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); }
.x-moremenu.is-below { top: auto; bottom: 60px; right: 8px; }
.x-win__bottom { flex: none; border-radius: 0 0 var(--hd-radius-card) var(--hd-radius-card); }
.x-win:has(.x-win__bottom) .x-win__body { border-radius: 0; }
@media (prefers-reduced-motion: reduce) { .x-win, .x-win.is-card { transition: none; } }
</style>
