<script setup lang="ts">
/**
 * Status menu: drops from the status icons (Wi-Fi, Bluetooth, battery) in the menu bar. Separate from Events.
 * Connectivity toggles, Silent and Focus, volume and brightness, battery (the N9 status menu, desktop sized).
 */
import { ref } from 'vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdSlider from '../../../components/HdSlider.vue';
import HdButton from '../../../components/HdButton.vue';
const toggles = ref([{ id: 'wifi', label: 'Wi-Fi', sub: 'Home', icon: 'wifi', on: true }, { id: 'bt', label: 'Bluetooth', sub: 'Keyboard', icon: 'bluetooth', on: true },
  { id: 'silent', label: 'Silent', sub: 'Off', icon: 'lock', on: false }, { id: 'dnd', label: 'Focus', sub: 'Until 14:00', icon: 'clock', on: false }]);
const vol = ref(60);
const bright = ref(75);
</script>
<template>
  <section class="x-stat hd-on-overlay" role="dialog" aria-label="Status menu">
    <div class="x-stat__toggles">
      <button v-for="t in toggles" :key="t.id" type="button" class="x-stat__tg hd-focusable" :class="{ 'is-on': t.on }" :aria-pressed="t.on ? 'true' : 'false'" @click="t.on = !t.on">
        <span class="x-stat__tgi hd-sq"><HdIcon :name="t.icon" :size="18" /></span>
        <span class="x-stat__tgt"><b>{{ t.label }}</b><small>{{ t.on ? t.sub : 'Off' }}</small></span>
      </button>
    </div>
    <div class="x-stat__row"><HdIcon name="music" :size="18" label="Volume" /><HdSlider v-model="vol" label="Volume" /></div>
    <div class="x-stat__row"><HdIcon name="star" :size="18" label="Brightness" /><HdSlider v-model="bright" label="Brightness" /></div>
    <footer class="x-stat__foot">
      <span class="x-stat__batt"><HdIcon name="battery" :size="18" />82% · 5 h 10 min left</span>
      <HdButton icon="settings">Settings</HdButton>
    </footer>
  </section>
</template>
<style>
.x-stat { position: absolute; z-index: 47; top: 6px; right: 120px; width: 360px; padding: 14px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); }
.x-stat__toggles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.x-stat__tg { display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 10px; border: 0; border-radius: 8px; background: color-mix(in srgb, var(--hd-c-fg) 7%, transparent); color: inherit; text-align: left; cursor: pointer; }
.x-stat__tg:hover { background: var(--hd-c-pressed); }
.x-stat__tgi { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; --hd-sq-size: 34px; --hd-sq-fill: color-mix(in srgb, var(--hd-c-fg) 14%, transparent); }
.x-stat__tg.is-on .x-stat__tgi { --hd-sq-fill: linear-gradient(color-mix(in srgb, var(--hd-accent) 75%, #fff), var(--hd-accent)); color: #fff; }
.x-stat__tgt { display: flex; flex-direction: column; gap: 3px; font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); }
.x-stat__tgt b { font-size: var(--hd-font-size-small); }
.x-stat__tgt small { color: var(--hd-c-fg-secondary); }
.x-stat__row { display: flex; align-items: center; gap: 12px; padding: 10px 6px 0; }
.x-stat__row .hd-slider { flex: 1; }
.x-stat__foot { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--hd-c-divider); }
.x-stat__batt { display: inline-flex; align-items: center; gap: 6px; font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
</style>
