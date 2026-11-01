<script setup lang="ts">
/**
 * XWindow dressed as one of the mock apps (parts/data.ts, chrome.ts) for Storybook and the website's demo windows: the app's
 * icon, title or view menu, address field and toolbar actions, with its mini app inside. The real window is XWindow.vue.
 */
import { ref, computed, watch } from 'vue';
import HdIcon from '../../components/HdIcon.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import HdTooltip from '../../components/HdTooltip.vue';
import XMiniApp from '../parts/XMiniApp.vue';
import XWindow, { type WindowCard } from './XWindow.vue';
import { app as appOf } from '../parts/data';
import { chromeOf } from './chrome';
const props = withDefaults(defineProps<{
  app: string; title?: string; x?: number; y?: number; w?: number; h?: number; z?: number; focused?: boolean; tiled?: boolean; maximised?: boolean;
  plain?: boolean; back?: boolean; viewMenu?: boolean; hints?: boolean; dragging?: boolean; busy?: boolean; card?: WindowCard | null; resizable?: boolean; idPrefix?: string;
}>(), { x: 0, y: 0, w: 900, h: 600, z: 1, viewMenu: false, back: undefined, card: null, resizable: true });
const emit = defineEmits<{ close: []; minimise: []; maximise: []; focus: []; back: []; view: [name: string]; grab: [e: PointerEvent]; resize: [handle: string, e: PointerEvent] }>();
const a = computed(() => appOf(props.app));
const c = computed(() => chromeOf(props.app));
const views = computed(() => (props.plain ? undefined : c.value.views));
const view = ref(views.value?.[0]);
watch(view, (v) => v && emit('view', v));
</script>
<template>
  <XWindow v-model:view="view" :title="title ?? c.title" :icon="a.icon" :color="a.color" :tone="a.tone" :x="x" :y="y" :w="w" :h="h" :z="z" :focused="focused"
    :tiled="tiled" :maximised="maximised" :dragging="dragging" :busy="busy" :card="card" :resizable="resizable" :back="!plain && (back ?? !!c.back)" :views="views"
    :menu-open="viewMenu" @close="emit('close')" @minimise="emit('minimise')" @maximise="emit('maximise')" @focus="emit('focus')" @back="emit('back')"
    @grab="(e) => emit('grab', e)" @resize="(hd, e) => emit('resize', hd, e)">
    <template v-if="c.address && !plain" #title><div class="x-win__address" role="textbox" aria-label="Address"><HdIcon name="globe" :size="14" /><span>{{ c.address }}</span></div></template>
    <template v-if="!plain && c.actions.length" #actions>
      <HdTooltip v-for="ac in c.actions" :key="ac.label" :text="ac.keys ? `${ac.label} (${ac.keys})` : ac.label" placement="bottom"><HdToolIcon :icon="ac.icon" :label="ac.label" /></HdTooltip>
      <HdTooltip text="Menu (Alt)" placement="bottom"><HdToolIcon icon="more" label="Menu" /></HdTooltip>
    </template>
    <XMiniApp :name="app" chrome="none" density="pointer" :hints="false" :id-prefix="idPrefix ?? `xw-${app}`" />
  </XWindow>
</template>
<style>
.x-win__address { flex: 0 1 520px; min-width: 0; display: flex; align-items: center; gap: 8px; height: 30px; margin: 0 6px; padding: 0 12px; border-radius: 15px; background: color-mix(in srgb, var(--hd-c-fg) 10%, transparent); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); white-space: nowrap; overflow: hidden; }
/* the window owns the title: no second app bar inside the mock apps */
.x-win__body .x-mail .hd-page-header, .x-win__body .x-mail__search, .x-win__body .x-msg__head, .x-win__body .x-web__bar, .x-win__body .x-cal__title { display: none; }
</style>
