<script setup lang="ts">
/**
 * Desktop v2 dock. Default: a light floating strip (v1 D's peek dock), centred on its edge and hugging its icons — Unity's
 * left position, the macOS dock's shape. Order: launcher | separator | pinned and running apps | separator | trash (always last).
 * Running apps get a small dot. Left by default; any edge.
 * Options (Edit dock): panel = full-height KDE Plasma-style panel; clock widget; size; auto-hide; previews.
 * previews (optional): items stay squircle app icons; hovering a running app shows its live window preview in the window's
 * exact aspect ratio (peekThumb forces it open for the mockup).
 * editing: "Edit dock" mode with a move handle and remove badges.
 */
import { computed } from 'vue';
import HdSquircle from '../../../components/HdSquircle.vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdTooltip from '../../../components/HdTooltip.vue';
import XMiniApp from '../parts/XMiniApp.vue';
import { app as appOf } from '../parts/data';
import { GAP, OPEN_WINDOWS, fitInto, type DockPos } from './geometry';
const props = withDefaults(defineProps<{
  position?: DockPos; size?: number; autoHide?: boolean; revealed?: boolean; editing?: boolean; previews?: boolean;
  panel?: boolean; launcher?: boolean; trash?: boolean; clock?: boolean;
  pinned?: string[]; running?: string[]; active?: string; launcherActive?: boolean; peekThumb?: string;
}>(), { position: 'left', size: 44, launcher: true, trash: true, pinned: () => ['Browser', 'Mail', 'Messages', 'Calendar', 'Music', 'Notes'], running: () => ['Mail', 'Browser', 'Messages'] });
const emit = defineEmits<{ launcher: []; open: [name: string]; settings: [] }>();
const vertical = computed(() => props.position === 'left' || props.position === 'right');
const hidden = computed(() => props.autoHide && !props.revealed);
const style = computed(() => {
  const s: Record<string, string> = { '--x-dock-i': `${props.size}px` };
  s[props.position] = `${GAP}px`;
  if (props.panel) { if (vertical.value) { s.top = `${GAP}px`; s.bottom = `${GAP}px`; } else { s.left = `${GAP}px`; s.right = `${GAP}px`; } }
  return s;
});
const tipPlace = computed(() => (props.position === 'top' ? 'bottom' : 'top') as 'top' | 'bottom');
const items = computed(() => [...props.pinned, ...props.running.filter((r) => !props.pinned.includes(r))]);
const shape = (n: string) => OPEN_WINDOWS.find((o) => o.app === n) ?? { app: n, w: 900, h: 600 };
/** thumbnail box: the window's exact aspect ratio fitted into a square box */
const thumb = (n: string, box = props.size + 8) => { const o = shape(n); return { ...fitInto(o.w, o.h, box, box), ow: o.w, oh: o.h }; };
</script>
<template>
  <nav class="x-dock hd-on-home" :class="[`x-dock--${position}`, { 'is-vertical': vertical, 'is-panel': panel, 'is-hidden': hidden, 'is-autohide': autoHide, 'is-editing': editing }]" :style="style" aria-label="Dock">
    <template v-if="launcher">
      <span class="x-dock__slot">
        <HdTooltip text="Overview (Super)" :placement="tipPlace">
          <button type="button" class="x-dock__launcher hd-sq hd-focusable" :class="{ 'is-active': launcherActive }" aria-label="Overview" @click="emit('launcher')"><HdIcon name="grid" :size="Math.round(size * 0.5)" /></button>
        </HdTooltip>
        <span v-if="editing" class="x-dock__rm hd-sq" aria-hidden="true">×</span>
      </span>
      <span class="x-dock__div" aria-hidden="true"></span>
    </template>
    <span v-for="n in items" :key="n" class="x-dock__slot" :class="{ 'is-running': running.includes(n), 'is-active': active === n }">
      <HdTooltip :text="running.includes(n) ? `${n} · running` : n" :placement="tipPlace">
        <button type="button" class="x-dock__item hd-sq hd-focusable" :aria-label="n" @click="emit('open', n)">
          <HdSquircle :size="size" :color="appOf(n).color" lighting="lit" :tone="appOf(n).tone"><HdIcon :name="appOf(n).icon" :size="Math.round(size * 0.5)" :lit="appOf(n).tone === 'light' ? 'dark' : true" /></HdSquircle>
        </button>
      </HdTooltip>
      <span v-if="running.includes(n)" class="x-dock__run" aria-hidden="true"></span>
      <span v-if="editing" class="x-dock__rm hd-sq" aria-hidden="true">×</span>
      <div v-if="previews && peekThumb === n && running.includes(n)" class="x-dock__peek hd-on-overlay" role="tooltip">
        <div class="x-dock__peekwin" :style="{ width: `${thumb(n, 280).w}px`, height: `${thumb(n, 280).h}px` }">
          <span class="x-dock__live" inert :style="{ width: `${thumb(n).ow}px`, height: `${thumb(n).oh}px`, transform: `scale(${thumb(n, 280).s})` }"><XMiniApp :name="n" chrome="none" density="pointer" :hints="false" id-prefix="xdp" /></span>
        </div>
        <b>{{ n }}</b><span>{{ shape(n).w }} × {{ shape(n).h }} · click to focus, scroll to cycle</span>
      </div>
    </span>
    <span v-if="panel" class="x-dock__sp"></span>
    <span v-if="clock" class="x-dock__slot">
      <span class="x-dock__clock" aria-label="Clock widget, 12:45"><b>12</b><b>45</b><small>Sat 24</small></span>
      <span v-if="editing" class="x-dock__rm hd-sq" aria-hidden="true">×</span>
    </span>
    <template v-if="trash">
      <span class="x-dock__div" aria-hidden="true"></span>
      <span class="x-dock__slot x-dock__trash">
        <HdTooltip text="Recycle bin · 3 items" :placement="tipPlace"><button type="button" class="x-dock__applet hd-sq hd-focusable" aria-label="Trash"><HdIcon name="delete" :size="Math.round(size * 0.5)" /></button></HdTooltip>
        <span v-if="editing" class="x-dock__rm hd-sq" aria-hidden="true">×</span>
      </span>
    </template>
    <template v-if="editing">
      <span class="x-dock__move" title="Drag to any screen edge" aria-hidden="true"><i></i><i></i><i></i></span>
      <button type="button" class="x-dock__gear hd-sq hd-focusable" aria-label="Dock settings" @click="emit('settings')"><HdIcon name="settings" :size="16" /></button>
    </template>
  </nav>
  <span v-if="autoHide && hidden" class="x-dock-edge" :class="`x-dock-edge--${position}`" aria-hidden="true"></span>
</template>
<style>
.x-dock { position: absolute; z-index: 40; display: flex; align-items: center; gap: 4px; padding: 8px; border-radius: 14px;
  background: color-mix(in srgb, var(--hd-surface-overlay) 90%, transparent); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider);
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.x-dock.is-vertical { flex-direction: column; }
/* default: a floating strip centred on its edge, only as long as its icons */
.x-dock.is-vertical:not(.is-panel) { top: 50%; transform: translateY(-50%); }
.x-dock:not(.is-vertical):not(.is-panel) { left: 50%; transform: translateX(-50%); }
.x-dock--left.is-hidden { transform: translate(calc(-100% - 12px), -50%); }
.x-dock--right.is-hidden { transform: translate(calc(100% + 12px), -50%); }
.x-dock--bottom.is-hidden { transform: translate(-50%, calc(100% + 12px)); }
.x-dock--top.is-hidden { transform: translate(-50%, calc(-100% - 12px)); }
/* option: full-height panel (KDE Plasma style) */
.x-dock.is-panel { gap: 6px; border-radius: var(--hd-radius-card); background: color-mix(in srgb, var(--hd-surface-home) 94%, transparent); box-shadow: 0 0 0 1px var(--hd-c-divider), 0 8px 30px rgba(0,0,0,.35); }
.x-dock.is-panel.is-vertical { width: calc(var(--x-dock-i) + 20px); padding: 10px 0; }
.x-dock.is-panel:not(.is-vertical) { height: calc(var(--x-dock-i) + 20px); padding: 0 10px; }
.x-dock.is-autohide:not(.is-hidden) { box-shadow: 0 0 0 1px var(--hd-c-divider), 0 12px 48px rgba(0,0,0,.6); }
.x-dock.is-editing { outline: 2px dashed var(--hd-accent); outline-offset: 5px; }
.x-dock__slot { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.x-dock__item, .x-dock__launcher, .x-dock__applet { display: inline-flex; align-items: center; justify-content: center; width: calc(var(--x-dock-i) + 8px); height: calc(var(--x-dock-i) + 8px); padding: 0; border: 0; color: inherit; cursor: pointer; --hd-sq-size: calc(var(--x-dock-i) + 8px); }
.x-dock__item:hover, .x-dock__applet:hover, .x-dock__slot.is-active .x-dock__item { --hd-sq-fill: var(--hd-c-pressed); }
.x-dock__item:hover .hd-icon-lit-shadow { transform: translateY(-1px); }
.x-dock__launcher { --hd-sq-size: var(--x-dock-i); --hd-sq-fill: var(--hd-accent); color: #fff; }
.x-dock__launcher:hover, .x-dock__launcher.is-active { --hd-sq-fill: color-mix(in srgb, var(--hd-accent) 75%, #fff); }
.x-dock__applet { --hd-sq-size: var(--x-dock-i); --hd-sq-fill: color-mix(in srgb, var(--hd-c-fg) 10%, transparent); }
.x-dock__div { flex: none; width: 70%; height: 1px; margin: 4px 0; background: var(--hd-c-divider); }
.x-dock:not(.is-vertical) .x-dock__div { width: 1px; height: 70%; margin: 0 4px; }
.x-dock__sp { flex: 1; }
/* running indicator: a small dot on the screen-edge side */
.x-dock__run { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: var(--hd-c-fg-secondary); }
.x-dock--left .x-dock__run { left: -6px; top: 50%; transform: translateY(-50%); }
.x-dock--right .x-dock__run { right: -6px; top: 50%; transform: translateY(-50%); }
.x-dock--bottom .x-dock__run { bottom: -6px; left: 50%; transform: translateX(-50%); }
.x-dock--top .x-dock__run { top: -6px; left: 50%; transform: translateX(-50%); }
.x-dock.is-panel.x-dock--left .x-dock__run { left: -8px; }
.x-dock.is-panel.x-dock--right .x-dock__run { right: -8px; }
.x-dock__slot.is-active .x-dock__run { width: 5px; height: 5px; background: var(--hd-accent); }
.x-dock__live { position: absolute; left: 0; top: 0; display: flex; transform-origin: 0 0; pointer-events: none; background: var(--hd-c-bg); color: var(--hd-c-fg); }
.x-dock__clock { display: inline-flex; flex-direction: column; align-items: center; gap: 1px; font: var(--hd-font-weight-light) 20px/1 var(--hd-font-family-light); font-variant-numeric: tabular-nums; }
.x-dock__clock small { margin-top: 4px; font: 400 10px/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-dock:not(.is-vertical) .x-dock__clock { flex-direction: row; gap: 0; padding: 0 6px; }
.x-dock:not(.is-vertical) .x-dock__clock b + b::before { content: ':'; }
.x-dock:not(.is-vertical) .x-dock__clock small { margin: 0 0 0 8px; }
.x-dock__rm { position: absolute; top: -4px; right: -4px; z-index: 2; display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; --hd-sq-size: 18px; --hd-sq-fill: var(--hd-color-palette-warning); color: #fff; font: 700 13px/1 var(--hd-font-family-base); }
.x-dock__move { position: absolute; display: flex; gap: 3px; padding: 6px; border-radius: 6px; background: var(--hd-accent); cursor: grab; }
.x-dock__move i { width: 4px; height: 4px; border-radius: 1px; background: #fff; }
.x-dock.is-vertical .x-dock__move { top: -24px; left: 50%; transform: translateX(-50%); }
.x-dock:not(.is-vertical) .x-dock__move { left: -24px; top: 50%; transform: translateY(-50%); flex-direction: column; }
.x-dock__gear { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; padding: 0; border: 0; cursor: pointer; --hd-sq-size: 32px; --hd-sq-fill: var(--hd-accent); color: #fff; }
.x-dock__peek { position: absolute; left: calc(100% + 24px); top: 50%; transform: translateY(-50%); z-index: 3; display: flex; flex-direction: column; gap: 4px; padding: 14px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); font: 400 var(--hd-font-size-xsmall)/1.3 var(--hd-font-family-base); white-space: nowrap; }
.x-dock__peek b { margin-top: 6px; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1 var(--hd-font-family-light); }
.x-dock__peek span { color: var(--hd-c-fg-secondary); }
.x-dock__peekwin { position: relative; overflow: hidden; border-radius: var(--hd-radius-card); background: var(--hd-c-bg); box-shadow: 0 0 0 1px var(--hd-c-divider); }
.x-dock-edge { position: absolute; z-index: 39; background: var(--hd-accent); opacity: .55; border-radius: 3px; }
.x-dock-edge--left { left: 0; top: 35%; bottom: 35%; width: 3px; }
.x-dock-edge--right { right: 0; top: 35%; bottom: 35%; width: 3px; }
.x-dock-edge--bottom { bottom: 0; left: 35%; right: 35%; height: 3px; }
.x-dock-edge--top { top: 0; left: 35%; right: 35%; height: 3px; }
</style>
