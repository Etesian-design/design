<script setup lang="ts">
/**
 * Desktop v2 window with client-side decorations in the N9 style: the app's toolbar IS the title bar.
 * Order: Back (when there is navigation) or the app squircle, title (a view-menu button when the app has views),
 * app actions, app menu, then minimise / maximise / close. No extra app bar inside the window.
 */
import { ref, computed, watch } from 'vue';
import HdSquircle from '../../components/HdSquircle.vue';
import HdIcon from '../../components/HdIcon.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import HdTooltip from '../../components/HdTooltip.vue';
import XKey from '../parts/XKey.vue';
import XMiniApp from '../parts/XMiniApp.vue';
import { app as appOf } from '../parts/data';
import { chromeOf } from './chrome';
const props = withDefaults(defineProps<{
  app: string; title?: string; x?: number; y?: number; w?: number; h?: number; z?: number; focused?: boolean; tiled?: boolean;
  plain?: boolean; back?: boolean; hints?: boolean; viewMenu?: boolean; dragging?: boolean; idPrefix?: string;
}>(), { x: 0, y: 0, w: 900, h: 600, z: 1, hints: false, viewMenu: false, back: undefined });
const emit = defineEmits<{ close: []; minimise: []; maximise: []; focus: []; back: []; view: [name: string] }>();
const a = computed(() => appOf(props.app));
const c = computed(() => chromeOf(props.app));
const showBack = computed(() => !props.plain && (props.back ?? !!c.value.back));
const actions = computed(() => (props.plain ? [] : c.value.actions));
const views = computed(() => (props.plain ? undefined : c.value.views));
const menu = ref(props.viewMenu);
watch(() => props.viewMenu, (v) => (menu.value = v));
const view = ref(views.value?.[0] ?? '');
const shownTitle = computed(() => props.title ?? (views.value ? view.value : c.value.title));
function pick(v: string) { view.value = v; menu.value = false; emit('view', v); }
const style = computed(() => ({ left: `${props.x}px`, top: `${props.y}px`, width: `${props.w}px`, height: `${props.h}px`, zIndex: props.z }));
</script>
<template>
  <section class="x-win" :class="{ 'is-focused': focused, 'is-tiled': tiled, 'is-dragging': dragging }" :aria-label="`${shownTitle} – ${app} window`" :style="style" @mousedown="emit('focus')">
    <header class="x-win__bar hd-on-chrome">
      <span class="x-win__lead">
        <HdTooltip v-if="showBack" text="Back (Alt+Left)" placement="bottom"><HdToolIcon icon="back" label="Back" @click="emit('back')" /></HdTooltip>
        <HdSquircle v-else :size="22" :color="a.color" lighting="lit" :tone="a.tone" class="x-win__appicon"><HdIcon :name="a.icon" :size="13" :lit="a.tone === 'light' ? 'dark' : true" /></HdSquircle>
      </span>
      <button v-if="views" type="button" class="x-win__title x-win__title--menu hd-focusable" :aria-expanded="menu ? 'true' : 'false'" aria-haspopup="listbox" @click.stop="menu = !menu">
        <span>{{ shownTitle }}</span><HdIcon name="chevron-down" :size="16" />
      </button>
      <div v-else-if="c.address && !plain" class="x-win__address" role="textbox" aria-label="Address"><HdIcon name="globe" :size="14" /><span>{{ c.address }}</span></div>
      <h2 v-else class="x-win__title">{{ shownTitle }}</h2>
      <XKey v-if="hints && views" keys="Alt+V" />
      <span class="x-win__drag" aria-hidden="true"></span>
      <span v-if="actions.length" class="x-win__actions">
        <HdTooltip v-for="ac in actions" :key="ac.label" :text="ac.keys ? `${ac.label} (${ac.keys})` : ac.label" placement="bottom"><HdToolIcon :icon="ac.icon" :label="ac.label" /></HdTooltip>
        <HdTooltip text="Menu (Alt)" placement="bottom"><HdToolIcon icon="more" label="Menu" /></HdTooltip>
      </span>
      <span class="x-win__sep" aria-hidden="true"></span>
      <span class="x-win__ctl">
        <HdToolIcon icon="minimize" label="Minimise" @click="emit('minimise')" />
        <HdToolIcon icon="maximize" label="Maximise" @click="emit('maximise')" />
        <HdToolIcon icon="close" label="Close" class="x-win__close" @click="emit('close')" />
      </span>
    </header>
    <div class="x-win__body hd-on-page">
      <slot><XMiniApp :name="app" chrome="none" density="pointer" :hints="false" :id-prefix="idPrefix ?? `xw-${app}`" /></slot>
    </div>
    <div v-if="menu && views" class="x-viewmenu hd-on-overlay" role="listbox" :aria-label="`${app} views`">
      <button v-for="v in views" :key="v" type="button" role="option" class="x-viewmenu__item hd-focusable" :aria-selected="v === view ? 'true' : 'false'" @click="pick(v)">
        <span class="x-viewmenu__mark hd-sq" :class="{ 'is-on': v === view }"><HdIcon v-if="v === view" name="check" :size="14" /></span>
        <span>{{ v }}</span>
      </button>
    </div>
  </section>
</template>
<style>
.x-win { position: absolute; display: flex; flex-direction: column; overflow: visible; border-radius: var(--hd-radius-card); background: var(--hd-c-bg);
  box-shadow: 0 0 0 1px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.28); transition: box-shadow var(--hd-motion-duration-fast); }
.x-win.is-focused { box-shadow: 0 0 0 1px rgba(0,0,0,.45), 0 20px 56px rgba(0,0,0,.5); }
.x-win.is-tiled { border-radius: 6px; }
.x-win.is-dragging { opacity: .9; box-shadow: 0 0 0 2px var(--hd-accent), 0 30px 70px rgba(0,0,0,.55); }
.x-win__bar { flex: none; display: flex; align-items: center; gap: 4px; height: 44px; padding: 0 4px 0 6px; border-radius: var(--hd-radius-card) var(--hd-radius-card) 0 0; background: var(--hd-surface-chrome); color: var(--hd-c-fg); cursor: default; }
.x-win.is-tiled .x-win__bar { border-radius: 6px 6px 0 0; }
.x-win__bar .hd-tool-icon { width: 34px; height: 34px; --hd-sq-size: 32px; }
.x-win__bar .hd-tool-icon svg { width: 20px; height: 20px; }
.x-win__lead { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: 34px; }
.x-win__appicon { margin: 0 4px; }
.x-win__title { flex: 0 1 auto; min-width: 0; margin: 0 6px; padding: 0; border: 0; background: none; color: inherit; font: var(--hd-font-weight-light) 21px/1 var(--hd-font-family-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x-win__title--menu { display: inline-flex; align-items: center; gap: 4px; height: 34px; padding: 0 8px; margin: 0 2px; border-radius: 6px; cursor: pointer; }
.x-win__title--menu:hover, .x-win__title--menu[aria-expanded=true] { background: var(--hd-c-pressed); }
.x-win__address { flex: 0 1 520px; min-width: 0; display: flex; align-items: center; gap: 8px; height: 30px; margin: 0 6px; padding: 0 12px; border-radius: 15px; background: color-mix(in srgb, var(--hd-c-fg) 10%, transparent); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); white-space: nowrap; overflow: hidden; }
.x-win__drag { flex: 1; align-self: stretch; }
.x-win__actions, .x-win__ctl { flex: none; display: inline-flex; align-items: center; }
.x-win__sep { flex: none; width: 1px; height: 22px; margin: 0 4px; background: var(--hd-c-divider); }
.x-win__ctl .hd-tool-icon { width: 30px; height: 30px; --hd-sq-size: 26px; }
.x-win__ctl .hd-tool-icon svg { width: 15px; height: 15px; }
.x-win__close:hover { --hd-sq-fill: var(--hd-color-palette-warning) !important; color: #fff; }
.x-win:not(.is-focused) .x-win__bar { background: color-mix(in srgb, var(--hd-surface-chrome) 88%, var(--hd-c-bg)); }
.x-win:not(.is-focused) .x-win__bar > * { opacity: .5; }
.x-win__body { flex: 1; min-height: 0; display: flex; overflow: hidden; border-radius: 0 0 var(--hd-radius-card) var(--hd-radius-card); background: var(--hd-c-bg); color: var(--hd-c-fg); }
.x-win.is-tiled .x-win__body { border-radius: 0 0 6px 6px; }
/* the window owns the title: no second app bar inside */
.x-win__body .x-mail .hd-page-header, .x-win__body .x-mail__search, .x-win__body .x-msg__head, .x-win__body .x-web__bar, .x-win__body .x-cal__title { display: none; }
.x-viewmenu { position: absolute; z-index: 5; top: 42px; left: 40px; min-width: 240px; padding: 6px 0; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); }
.x-viewmenu__item { display: flex; align-items: center; gap: 12px; width: 100%; height: 40px; padding: 0 16px 0 12px; border: 0; background: none; color: inherit; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1 var(--hd-font-family-light); text-align: left; cursor: pointer; }
.x-viewmenu__item:hover { background: var(--hd-c-pressed); }
.x-viewmenu__mark { position: relative; flex: none; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; --hd-sq-size: 22px; --hd-sq-ring: var(--hd-c-divider); color: #fff; }
.x-viewmenu__mark.is-on { --hd-sq-fill: var(--hd-accent); --hd-sq-ring: transparent; }
.x-viewmenu__mark .hd-icon { position: relative; z-index: 1; }
</style>
