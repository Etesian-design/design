<script setup lang="ts">
/**
 * Desktop v2 dock: a KDE Plasma-style panel. Left and vertical by default; can sit on any edge, change size, auto-hide.
 * Holds applets (launcher that opens the overview, clock, trash) and pinned apps with running indicators.
 * thumbs: running windows show as squircle live thumbnails (N9 Open apps) instead of icons.
 * editing: "Edit dock" mode with move / resize handles, remove badges and an Add widgets slot.
 */
import { computed } from 'vue';
import HdSquircle from '../../../components/HdSquircle.vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdTooltip from '../../../components/HdTooltip.vue';
import XKey from '../parts/XKey.vue';
import XFit from '../parts/XFit.vue';
import XMiniApp from '../parts/XMiniApp.vue';
import { app as appOf } from '../parts/data';
import { GAP, dockThickness, type DockPos } from './geometry';
const props = withDefaults(defineProps<{
  position?: DockPos; size?: number; autoHide?: boolean; revealed?: boolean; editing?: boolean; thumbs?: boolean; hints?: boolean;
  pinned?: string[]; running?: string[]; active?: string; launcherActive?: boolean; peekThumb?: string;
}>(), { position: 'left', size: 44, hints: true, pinned: () => ['Browser', 'Mail', 'Messages', 'Calendar', 'Music', 'Notes'], running: () => ['Mail', 'Browser', 'Messages'] });
const emit = defineEmits<{ launcher: []; open: [name: string]; settings: [] }>();
const vertical = computed(() => props.position === 'left' || props.position === 'right');
const hidden = computed(() => props.autoHide && !props.revealed);
const t = computed(() => dockThickness(props.size));
const style = computed(() => {
  const s: Record<string, string> = { '--x-dock-t': `${t.value}px`, '--x-dock-i': `${props.size}px` };
  s[props.position] = `${GAP}px`;
  if (vertical.value) { s.top = `${GAP}px`; s.bottom = `${GAP}px`; } else { s.left = `${GAP}px`; s.right = `${GAP}px`; }
  return s;
});
const tipPlace = computed(() => (props.position === 'top' ? 'bottom' : 'top') as 'top' | 'bottom');
const items = computed(() => [...props.pinned, ...props.running.filter((r) => !props.pinned.includes(r))]);
const isThumb = (n: string) => props.thumbs && props.running.includes(n);
</script>
<template>
  <nav class="x-dock hd-on-home" :class="[`x-dock--${position}`, { 'is-vertical': vertical, 'is-hidden': hidden, 'is-autohide': autoHide, 'is-editing': editing }]" :style="style" aria-label="Dock">
    <!-- applet: launcher (opens the overview) -->
    <span class="x-dock__slot">
      <HdTooltip text="Overview (Super)" :placement="tipPlace">
        <button type="button" class="x-dock__launcher hd-sq hd-focusable" :class="{ 'is-active': launcherActive }" aria-label="Overview" @click="emit('launcher')"><HdIcon name="grid" :size="Math.round(size * 0.5)" /></button>
      </HdTooltip>
      <span v-if="editing" class="x-dock__rm hd-sq" aria-hidden="true">×</span>
    </span>
    <XKey v-if="hints && !editing" keys="Super" class="x-dock__key" />
    <span class="x-dock__div" aria-hidden="true"></span>
    <span v-for="n in items" :key="n" class="x-dock__slot" :class="{ 'is-running': running.includes(n), 'is-active': active === n, 'is-thumb': isThumb(n) }">
      <HdTooltip :text="running.includes(n) ? `${n} · running` : n" :placement="tipPlace">
        <button type="button" class="x-dock__item hd-sq hd-focusable" :aria-label="n" @click="emit('open', n)">
          <span v-if="isThumb(n)" class="x-dock__thumb hd-squircle" :style="{ width: `${size}px`, height: `${size}px` }">
            <XFit :w="560" :h="560" :initial="size / 560"><div class="x-dock__live" inert><XMiniApp :name="n" chrome="none" density="pointer" :hints="false" :id-prefix="`xdt-${n}`" /></div></XFit>
            <HdSquircle class="x-dock__badge" :size="Math.round(size * 0.42)" :color="appOf(n).color" lighting="lit" :tone="appOf(n).tone"><HdIcon :name="appOf(n).icon" :size="Math.round(size * 0.24)" :lit="true" /></HdSquircle>
          </span>
          <HdSquircle v-else :size="size" :color="appOf(n).color" lighting="lit" :tone="appOf(n).tone"><HdIcon :name="appOf(n).icon" :size="Math.round(size * 0.5)" :lit="appOf(n).tone === 'light' ? 'dark' : true" /></HdSquircle>
        </button>
      </HdTooltip>
      <span v-if="running.includes(n)" class="x-dock__run" aria-hidden="true"></span>
      <span v-if="editing" class="x-dock__rm hd-sq" aria-hidden="true">×</span>
      <div v-if="peekThumb === n" class="x-dock__peek hd-on-overlay" role="tooltip">
        <div class="x-dock__peekwin hd-squircle"><XFit :w="640" :h="640" :initial="220 / 640"><div class="x-dock__live" inert><XMiniApp :name="n" chrome="none" density="pointer" :hints="false" id-prefix="xdp" /></div></XFit></div>
        <b>{{ n }}</b><span>2 windows · click to focus, scroll to cycle</span>
      </div>
    </span>
    <span class="x-dock__sp"></span>
    <button v-if="editing" type="button" class="x-dock__add hd-sq hd-focusable" aria-label="Add widgets"><HdIcon name="add" :size="22" /></button>
    <!-- applets: trash + clock -->
    <span class="x-dock__slot">
      <HdTooltip text="Trash · 3 items" :placement="tipPlace"><button type="button" class="x-dock__applet hd-sq hd-focusable" aria-label="Trash"><HdIcon name="delete" :size="Math.round(size * 0.5)" /></button></HdTooltip>
      <span v-if="editing" class="x-dock__rm hd-sq" aria-hidden="true">×</span>
    </span>
    <span class="x-dock__slot">
      <span class="x-dock__clock" aria-label="Clock applet, 12:45"><b>12</b><b>45</b><small>Sat 24</small></span>
      <span v-if="editing" class="x-dock__rm hd-sq" aria-hidden="true">×</span>
    </span>
    <template v-if="editing">
      <span class="x-dock__move" title="Drag to any screen edge" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="x-dock__resize" title="Drag to resize" aria-hidden="true"></span>
      <button type="button" class="x-dock__gear hd-sq hd-focusable" aria-label="Dock settings" @click="emit('settings')"><HdIcon name="settings" :size="18" /></button>
    </template>
  </nav>
  <span v-if="autoHide && hidden" class="x-dock-edge" :class="`x-dock-edge--${position}`" aria-hidden="true"></span>
</template>
<style>
.x-dock { position: absolute; z-index: 40; display: flex; align-items: center; gap: 6px; padding: 8px; border-radius: var(--hd-radius-card);
  background: color-mix(in srgb, var(--hd-surface-home) 94%, transparent); color: var(--hd-c-fg); box-shadow: 0 0 0 1px var(--hd-c-divider), 0 8px 30px rgba(0,0,0,.35);
  -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.x-dock.is-vertical { flex-direction: column; width: var(--x-dock-t); padding: 10px 0; }
.x-dock:not(.is-vertical) { height: var(--x-dock-t); padding: 0 10px; }
.x-dock--left.is-hidden { transform: translateX(calc(-100% - 12px)); }
.x-dock--right.is-hidden { transform: translateX(calc(100% + 12px)); }
.x-dock--bottom.is-hidden { transform: translateY(calc(100% + 12px)); }
.x-dock--top.is-hidden { transform: translateY(calc(-100% - 12px)); }
.x-dock.is-autohide:not(.is-hidden) { box-shadow: 0 0 0 1px var(--hd-c-divider), 0 12px 48px rgba(0,0,0,.6); }
.x-dock.is-editing { outline: 2px dashed var(--hd-accent); outline-offset: 4px; }
.x-dock__slot { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.x-dock__item, .x-dock__launcher, .x-dock__applet, .x-dock__add, .x-dock__gear { display: inline-flex; align-items: center; justify-content: center; width: calc(var(--x-dock-i) + 10px); height: calc(var(--x-dock-i) + 10px); padding: 0; border: 0; color: inherit; cursor: pointer; --hd-sq-size: calc(var(--x-dock-i) + 10px); }
.x-dock__item:hover, .x-dock__applet:hover, .x-dock__slot.is-active .x-dock__item { --hd-sq-fill: var(--hd-c-pressed); }
.x-dock__launcher { --hd-sq-size: var(--x-dock-i); --hd-sq-fill: var(--hd-accent); color: #fff; }
.x-dock__launcher:hover, .x-dock__launcher.is-active { --hd-sq-fill: color-mix(in srgb, var(--hd-accent) 75%, #fff); --hd-sq-ring: #fff; --hd-sq-ring-width: 2px; --hd-sq-ring-offset: 3px; }
.x-dock__applet { --hd-sq-size: var(--x-dock-i); --hd-sq-fill: color-mix(in srgb, var(--hd-c-fg) 10%, transparent); }
.x-dock__key { font-size: 10px; }
.x-dock__div { flex: none; width: 60%; height: 1px; background: var(--hd-c-divider); }
.x-dock:not(.is-vertical) .x-dock__div { width: 1px; height: 60%; }
.x-dock__sp { flex: 1; }
.x-dock__run { position: absolute; border-radius: 2px; background: var(--hd-c-fg-secondary); }
.x-dock.is-vertical .x-dock__run { left: -7px; top: 50%; width: 3px; height: 12px; transform: translateY(-50%); }
.x-dock--right .x-dock__run { left: auto; right: -7px; }
.x-dock:not(.is-vertical) .x-dock__run { bottom: -7px; left: 50%; width: 12px; height: 3px; transform: translateX(-50%); }
.x-dock--top .x-dock__run { bottom: auto; top: -7px; }
.x-dock__slot.is-active .x-dock__run { background: var(--hd-accent); }
.x-dock.is-vertical .x-dock__slot.is-active .x-dock__run { height: 22px; }
.x-dock:not(.is-vertical) .x-dock__slot.is-active .x-dock__run { width: 22px; }
.x-dock__thumb { position: relative; display: block; overflow: hidden; background: var(--hd-c-bg); }
.x-dock__thumb .x-fit { position: absolute; inset: 0; }
.x-dock__live { width: 100%; height: 100%; display: flex; }
.x-dock__badge { position: absolute !important; right: -1px; bottom: -1px; box-shadow: 0 0 0 2px var(--hd-surface-home); }
.x-dock__clock { display: inline-flex; flex-direction: column; align-items: center; gap: 1px; font: var(--hd-font-weight-light) 20px/1 var(--hd-font-family-light); font-variant-numeric: tabular-nums; }
.x-dock__clock small { margin-top: 4px; font: 400 10px/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-dock:not(.is-vertical) .x-dock__clock { flex-direction: row; gap: 0; padding: 0 6px; }
.x-dock:not(.is-vertical) .x-dock__clock b + b::before { content: ':'; }
.x-dock:not(.is-vertical) .x-dock__clock small { margin: 0 0 0 8px; }
.x-dock__rm { position: absolute; top: -4px; right: -4px; z-index: 2; display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; --hd-sq-size: 18px; --hd-sq-fill: var(--hd-color-palette-warning); color: #fff; font: 700 13px/1 var(--hd-font-family-base); }
.x-dock__add { --hd-sq-size: var(--x-dock-i); --hd-sq-ring: var(--hd-c-fg-secondary); --hd-sq-ring-width: 2px; color: var(--hd-c-fg-secondary); }
.x-dock__move { position: absolute; display: flex; gap: 3px; padding: 6px; border-radius: 6px; background: var(--hd-accent); cursor: grab; }
.x-dock__move i { width: 4px; height: 4px; border-radius: 1px; background: #fff; }
.x-dock.is-vertical .x-dock__move { top: -14px; left: 50%; transform: translateX(-50%); }
.x-dock:not(.is-vertical) .x-dock__move { left: -14px; top: 50%; transform: translateY(-50%); flex-direction: column; }
.x-dock__resize { position: absolute; background: var(--hd-accent); border-radius: 3px; }
.x-dock--left .x-dock__resize { right: -9px; top: 50%; width: 6px; height: 64px; transform: translateY(-50%); cursor: ew-resize; }
.x-dock--right .x-dock__resize { left: -9px; top: 50%; width: 6px; height: 64px; transform: translateY(-50%); cursor: ew-resize; }
.x-dock--bottom .x-dock__resize { top: -9px; left: 50%; height: 6px; width: 64px; transform: translateX(-50%); cursor: ns-resize; }
.x-dock--top .x-dock__resize { bottom: -9px; left: 50%; height: 6px; width: 64px; transform: translateX(-50%); cursor: ns-resize; }
.x-dock__gear { --hd-sq-size: 34px; --hd-sq-fill: var(--hd-accent); color: #fff; width: 40px; height: 40px; }
.x-dock__peek { position: absolute; left: calc(100% + 18px); top: 50%; transform: translateY(-50%); z-index: 3; display: flex; flex-direction: column; gap: 4px; width: 252px; padding: 16px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); font: 400 var(--hd-font-size-xsmall)/1.3 var(--hd-font-family-base); }
.x-dock__peek b { margin-top: 6px; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1 var(--hd-font-family-light); }
.x-dock__peek span { color: var(--hd-c-fg-secondary); }
.x-dock__peekwin { position: relative; width: 220px; height: 220px; overflow: hidden; background: var(--hd-c-bg); }
.x-dock-edge { position: absolute; z-index: 39; background: linear-gradient(var(--hd-accent), var(--hd-accent)); opacity: .55; border-radius: 3px; }
.x-dock-edge--left { left: 0; top: 30%; bottom: 30%; width: 3px; }
.x-dock-edge--right { right: 0; top: 30%; bottom: 30%; width: 3px; }
.x-dock-edge--bottom { bottom: 0; left: 30%; right: 30%; height: 3px; }
.x-dock-edge--top { top: 0; left: 30%; right: 30%; height: 3px; }
</style>
