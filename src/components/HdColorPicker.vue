<script setup lang="ts">
/**
 * ColorPicker in the N9 spirit: a dark dialog with the N9 accent colours as squircle swatches, a simple shade area
 * (saturation x brightness) over a hue strip, a squircle preview with the hex value, and lit Done / Cancel buttons.
 * v-model: "#RRGGBB".
 */
import { ref, computed, watch } from 'vue';
const props = withDefaults(defineProps<{ modelValue?: string; title?: string; palette?: string[]; doneLabel?: string; cancelLabel?: string }>(), {
  modelValue: '#4591FF', title: 'Pick colour', doneLabel: 'Done', cancelLabel: 'Cancel',
  /* the N9 application accent colours (tokens: --hd-color-accent-*) */
  palette: () => ['#4591FF', '#62B700', '#3D890C', '#09A7CC', '#007DC9', '#0067BC', '#1C51AF', '#821DDE', '#870CBA', '#CC09BA', '#E800A1', '#EF5500', '#EA650A', '#F77219', '#FF8500', '#ED9507', '#F2B111'],
});
const emit = defineEmits<{ 'update:modelValue': [v: string]; done: [v: string]; cancel: [] }>();

function hexToHsv(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim()); const n = m ? parseInt(m[1]!, 16) : 0x4591ff;
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
}
function hsvToHex(h: number, s: number, v: number): string {
  const f = (k: number) => { const x = (k + h / 60) % 6; return v - v * s * Math.max(0, Math.min(x, 4 - x, 1)); };
  return '#' + [f(5), f(3), f(1)].map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}
const hsv = ref(hexToHsv(props.modelValue));
watch(() => props.modelValue, (v) => { if (v.toUpperCase() !== hex.value) hsv.value = hexToHsv(v); });
const hex = computed(() => hsvToHex(hsv.value.h, hsv.value.s, hsv.value.v));
const hueHex = computed(() => hsvToHex(hsv.value.h, 1, 1));
function set(p: Partial<typeof hsv.value>) { hsv.value = { ...hsv.value, ...p }; emit('update:modelValue', hex.value); }
function pick(c: string) { hsv.value = hexToHsv(c); emit('update:modelValue', hex.value); }
const clamp = (x: number) => Math.min(1, Math.max(0, x));
function track(e: PointerEvent, fn: (x: number, y: number) => void) {
  const el = e.currentTarget as HTMLElement; el.setPointerCapture?.(e.pointerId);
  const go = (ev: PointerEvent) => { const r = el.getBoundingClientRect(); fn(clamp((ev.clientX - r.left) / (r.width || 1)), clamp((ev.clientY - r.top) / (r.height || 1))); };
  go(e);
  const mv = (ev: PointerEvent) => go(ev);
  const upf = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', upf); };
  el.addEventListener('pointermove', mv); el.addEventListener('pointerup', upf);
}
function areaKey(e: KeyboardEvent) {
  const s = 0.05; const k = e.key;
  if (k === 'ArrowRight') set({ s: clamp(hsv.value.s + s) }); else if (k === 'ArrowLeft') set({ s: clamp(hsv.value.s - s) });
  else if (k === 'ArrowUp') set({ v: clamp(hsv.value.v + s) }); else if (k === 'ArrowDown') set({ v: clamp(hsv.value.v - s) }); else return;
  e.preventDefault();
}
function hueKey(e: KeyboardEvent) {
  const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 6 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -6 : 0;
  if (!d) return; e.preventDefault(); set({ h: (hsv.value.h + d + 360) % 360 });
}
</script>
<template>
  <section class="hd-colorpicker" role="dialog" :aria-label="title">
    <h2 class="hd-colorpicker__title">{{ title }}</h2>
    <div class="hd-colorpicker__palette" role="listbox" aria-label="Accent colours">
      <button v-for="c in palette" :key="c" type="button" role="option" class="hd-colorpicker__sw hd-sq hd-focusable" :class="{ 'is-on': c.toUpperCase() === hex }"
        :aria-selected="c.toUpperCase() === hex ? 'true' : 'false'" :aria-label="c" :style="{ '--hd-sq-fill': `linear-gradient(color-mix(in srgb, ${c} 86%, #fff), ${c} 55%, color-mix(in srgb, ${c} 86%, #000))` }" @click="pick(c)"></button>
    </div>
    <div class="hd-colorpicker__body">
      <div class="hd-colorpicker__pick">
        <div class="hd-colorpicker__area hd-focusable" role="slider" tabindex="0" aria-label="Shade" :aria-valuetext="`saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`"
          :style="{ background: `linear-gradient(transparent, #000), linear-gradient(90deg, #fff, ${hueHex})` }" @pointerdown="track($event, (x, y) => set({ s: x, v: 1 - y }))" @keydown="areaKey">
          <span class="hd-colorpicker__mark hd-sq" :style="{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }"></span>
        </div>
        <div class="hd-colorpicker__hue hd-focusable" role="slider" tabindex="0" aria-label="Hue" :aria-valuenow="Math.round(hsv.h)" aria-valuemin="0" aria-valuemax="360"
          @pointerdown="track($event, (x) => set({ h: Math.min(359.9, x * 360) }))" @keydown="hueKey">
          <span class="hd-colorpicker__hmark" :style="{ left: `${(hsv.h / 360) * 100}%` }"></span>
        </div>
      </div>
      <div class="hd-colorpicker__preview">
        <span class="hd-colorpicker__big hd-sq" :style="{ '--hd-sq-fill': `linear-gradient(color-mix(in srgb, ${hex} 86%, #fff), ${hex} 55%, color-mix(in srgb, ${hex} 86%, #000))` }" aria-hidden="true"></span>
        <output class="hd-colorpicker__hex">{{ hex }}</output>
      </div>
    </div>
    <footer class="hd-colorpicker__buttons">
      <button type="button" class="hd-dark-btn hd-focusable" @click="emit('done', hex)">{{ doneLabel }}</button>
      <button type="button" class="hd-dark-btn hd-focusable" @click="emit('cancel')">{{ cancelLabel }}</button>
    </footer>
  </section>
</template>
<style>
.hd-colorpicker { display: inline-flex; flex-direction: column; width: 400px; max-width: 100%; padding: 16px 16px 14px; border-radius: var(--hd-radius-card); background: #000; color: #fff; box-shadow: 0 0 0 1px #262626; }
.hd-colorpicker__title { margin: 4px 4px 14px; font: 700 24px/1.1 var(--hd-font-family-base); color: var(--hd-accent); }
.hd-colorpicker__palette { display: grid; grid-template-columns: repeat(9, 1fr); gap: 6px; }
.hd-colorpicker__sw { position: relative; aspect-ratio: 1; width: 100%; padding: 0; border: 0; cursor: pointer; --hd-sq-size: 34px; }
.hd-colorpicker__sw.is-on { --hd-sq-ring: #fff; --hd-sq-ring-width: 2px; --hd-sq-ring-offset: 2px; }
.hd-colorpicker__body { display: flex; gap: 14px; margin-top: 16px; }
.hd-colorpicker__pick { flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.hd-colorpicker__area { position: relative; height: 150px; border-radius: var(--hd-radius-card); cursor: crosshair; touch-action: none; }
.hd-colorpicker__mark { position: absolute; width: 22px; height: 22px; transform: translate(-50%, -50%); --hd-sq-size: 22px; --hd-sq-ring: #fff; --hd-sq-ring-width: 3px; pointer-events: none; filter: drop-shadow(0 1px 2px rgba(0,0,0,.6)); }
.hd-colorpicker__hue { position: relative; height: 20px; border-radius: 10px; background: linear-gradient(90deg, #f00, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00); cursor: pointer; touch-action: none; }
.hd-colorpicker__hmark { position: absolute; top: -4px; width: 8px; height: 28px; transform: translateX(-50%); border-radius: 4px; background: #fff; box-shadow: 0 0 0 1px rgba(0,0,0,.5), 0 1px 3px rgba(0,0,0,.5); pointer-events: none; }
.hd-colorpicker__preview { flex: none; display: flex; flex-direction: column; align-items: center; gap: 10px; width: 96px; }
.hd-colorpicker__big { position: relative; display: block; width: 88px; height: 88px; --hd-sq-size: 88px; }
.hd-colorpicker__hex { font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); font-variant-numeric: tabular-nums; color: #ccc; }
.hd-colorpicker__buttons { display: flex; gap: 6px; margin-top: 16px; }
</style>
