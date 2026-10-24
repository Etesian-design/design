<script setup lang="ts">
/**
 * T4: two apps side by side (1/2 + 1/2 or 2/3 + 1/3; stacked in portrait), each keeps its own N9 toolbar,
 * plus a pop-up floating window with a small mini-toolbar (drag handle, expand to split, full screen, close).
 */
import { computed, ref } from 'vue';
import XMiniApp from '../parts/XMiniApp.vue';
import HdToolIcon from '../../../components/HdToolIcon.vue';
const props = withDefaults(defineProps<{ orientation?: 'landscape' | 'portrait'; ratio?: '1/2' | '1/3'; popup?: boolean }>(), { orientation: 'landscape', ratio: '1/2', popup: false });
const land = computed(() => props.orientation === 'landscape');
const pop = ref(props.popup);
const tpl = computed(() => (props.ratio === '1/2' ? '1fr 1fr' : '2fr 1fr'));
</script>
<template>
  <div class="x-split" :class="{ 'x-split--portrait': !land }" :style="land ? { gridTemplateColumns: tpl } : { gridTemplateRows: tpl }">
    <div class="x-split__pane"><XMiniApp name="Mail" :landscape="land" id-prefix="x-split-a" /></div>
    <div class="x-split__pane"><XMiniApp :name="ratio === '1/3' ? 'Messages' : 'Calendar'" :landscape="land" id-prefix="x-split-b" /></div>
    <div class="x-split__divider" :class="{ 'is-h': !land }" :style="land ? { left: ratio === '1/2' ? '50%' : '66.666%' } : { top: ratio === '1/2' ? '50%' : '66.666%' }" role="separator" aria-label="Drag to resize" tabindex="0"><span></span></div>
    <div v-if="pop" class="x-pop hd-on-home" role="dialog" aria-label="Notes (pop-up window)">
      <div class="x-pop__bar hd-on-chrome">
        <span class="x-pop__grab" aria-hidden="true"></span>
        <span class="x-pop__title">Notes</span>
        <HdToolIcon icon="split" label="Move to split view" />
        <HdToolIcon icon="maximize" label="Full screen" />
        <HdToolIcon icon="close" label="Close pop-up" @click="pop = false" />
      </div>
      <div class="x-pop__body"><XMiniApp name="Notes" chrome="none" /></div>
    </div>
    <button v-else type="button" class="x-split__reopen hd-focusable" @click="pop = true">Open Notes as pop-up</button>
  </div>
</template>
<style>
.x-split { position: relative; flex: 1; min-height: 0; display: grid; gap: 6px; background: var(--hd-surface-home); }
.x-split__pane { min-width: 0; min-height: 0; display: flex; overflow: hidden; }
.x-split__divider { position: absolute; top: 0; bottom: 0; width: 24px; transform: translateX(-50%); display: flex; align-items: center; justify-content: center; cursor: col-resize; z-index: 5; }
.x-split__divider span { width: 5px; height: 48px; border-radius: 999px; background: var(--hd-surface-home-fg); opacity: .7; }
.x-split__divider.is-h { top: auto; bottom: auto; left: 0; right: 0; width: auto; height: 24px; transform: translateY(-50%); cursor: row-resize; }
.x-split__divider.is-h span { width: 48px; height: 5px; }
.x-pop { position: absolute; right: 48px; top: 64px; width: 380px; height: 460px; z-index: 20; display: flex; flex-direction: column; border-radius: var(--hd-radius-card); overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,.45), 0 0 0 1px var(--hd-c-divider); }
.x-split--portrait .x-pop { right: 40px; top: 120px; }
.x-pop__bar { display: flex; align-items: center; gap: 0; height: 32px; padding: 0 4px 0 10px; background: var(--hd-surface-chrome); color: var(--hd-c-fg); cursor: grab; }
.x-pop__bar .hd-tool-icon { width: 30px; height: 30px; --hd-sq-size: 26px; }
.x-pop__bar .hd-tool-icon svg { width: 16px; height: 16px; }
.x-pop__grab { width: 28px; height: 4px; border-radius: 999px; background: currentColor; opacity: .5; margin-right: 8px; }
.x-pop__title { flex: 1; font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); }
.x-pop__body { flex: 1; min-height: 0; display: flex; }
.x-split__reopen { position: absolute; right: 24px; top: 16px; z-index: 6; padding: 6px 12px; border: 0; border-radius: 999px; background: var(--hd-surface-banner); color: var(--hd-surface-banner-fg); font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); cursor: pointer; }
</style>
