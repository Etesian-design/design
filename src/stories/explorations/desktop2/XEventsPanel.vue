<script setup lang="ts">
/** Events panel (Super+N): slides in from the right under the menu bar. N9 status-menu toggles on top, then the Events feed. */
import { ref } from 'vue';
import HdIcon from '../../../components/HdIcon.vue';
import HdButton from '../../../components/HdButton.vue';
import HdSlider from '../../../components/HdSlider.vue';
import XEvents from '../parts/XEvents.vue';
import XKey from '../parts/XKey.vue';
withDefaults(defineProps<{ hints?: boolean }>(), { hints: true });
const emit = defineEmits<{ close: [] }>();
const toggles = ref([{ id: 'wifi', label: 'Wi-Fi', sub: 'Home', icon: 'wifi', on: true }, { id: 'bt', label: 'Bluetooth', sub: 'Keyboard', icon: 'bluetooth', on: true },
  { id: 'silent', label: 'Silent', sub: 'Off', icon: 'lock', on: false }, { id: 'dnd', label: 'Focus', sub: 'Until 14:00', icon: 'clock', on: false }]);
const vol = ref(60);
</script>
<template>
  <aside class="x-epanel2 hd-on-home" aria-label="Events">
    <header class="x-epanel2__head">
      <h2>Events</h2>
      <XKey v-if="hints" keys="Esc" />
      <HdButton variant="plain" @click="emit('close')">Clear all</HdButton>
    </header>
    <div class="x-epanel2__toggles">
      <button v-for="t in toggles" :key="t.id" type="button" class="x-epanel2__tg hd-focusable" :class="{ 'is-on': t.on }" :aria-pressed="t.on ? 'true' : 'false'" @click="t.on = !t.on">
        <span class="x-epanel2__tgi hd-sq"><HdIcon :name="t.icon" :size="18" /></span>
        <span class="x-epanel2__tgt"><b>{{ t.label }}</b><small>{{ t.sub }}</small></span>
      </button>
    </div>
    <div class="x-epanel2__vol"><HdIcon name="music" :size="18" label="Volume" /><HdSlider v-model="vol" label="Volume" /></div>
    <div class="x-epanel2__feed"><XEvents :columns="1" :title="false" :thumb="44" /></div>
  </aside>
</template>
<style>
.x-epanel2 { position: absolute; top: 0; right: 0; bottom: 0; z-index: 45; width: 460px; display: flex; flex-direction: column; background: color-mix(in srgb, var(--hd-surface-home) 97%, transparent); color: var(--hd-c-fg);
  box-shadow: -14px 0 44px rgba(0,0,0,.45), -1px 0 0 var(--hd-c-divider); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px); }
.x-epanel2__head { display: flex; align-items: center; gap: 10px; padding: 18px 12px 8px 20px; }
.x-epanel2__head h2 { flex: 1; margin: 0; font: var(--hd-font-weight-light) 44px/1 var(--hd-font-family-light); }
.x-epanel2__toggles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 8px 16px; }
.x-epanel2__tg { display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 10px; border: 0; border-radius: 8px; background: color-mix(in srgb, var(--hd-c-fg) 7%, transparent); color: inherit; text-align: left; cursor: pointer; }
.x-epanel2__tgi { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; --hd-sq-size: 34px; --hd-sq-fill: color-mix(in srgb, var(--hd-c-fg) 14%, transparent); }
.x-epanel2__tg.is-on .x-epanel2__tgi { --hd-sq-fill: var(--hd-accent); color: #fff; }
.x-epanel2__tgt { display: flex; flex-direction: column; gap: 3px; font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); }
.x-epanel2__tgt b { font-size: var(--hd-font-size-small); }
.x-epanel2__tgt small { color: var(--hd-c-fg-secondary); }
.x-epanel2__vol { display: flex; align-items: center; gap: 12px; padding: 6px 22px 10px; border-bottom: 1px solid var(--hd-c-divider); }
.x-epanel2__vol .hd-slider { flex: 1; }
.x-epanel2__feed { flex: 1; min-height: 0; overflow: hidden; }
</style>
