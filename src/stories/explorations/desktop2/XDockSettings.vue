<script setup lang="ts">
/** "Edit dock" settings popover, Harmattan look. Defaults = the light floating strip (icons only); every extra is opt-in:
 * full-height panel, launcher / thumbnails / trash / clock / battery widgets, icon size, auto-hide, position. */
import { ref } from 'vue';
import HdSlider from '../../../components/HdSlider.vue';
import HdSwitch from '../../../components/HdSwitch.vue';
import HdButton from '../../../components/HdButton.vue';
import HdIcon from '../../../components/HdIcon.vue';
import type { DockPos } from './geometry';
const props = withDefaults(defineProps<{ position?: DockPos; size?: number; visibility?: 'always' | 'autohide' | 'dodge'; panel?: boolean }>(), { position: 'left', size: 44, visibility: 'always', panel: false });
const emit = defineEmits<{ done: []; 'update:position': [p: DockPos]; 'update:panel': [on: boolean] }>();
const style = ref(props.panel ? 'panel' : 'strip');
const STYLES = [{ id: 'strip', label: 'Floating strip' }, { id: 'panel', label: 'Full-height panel' }] as const;
function setStyle(v: 'strip' | 'panel') { style.value = v; emit('update:panel', v === 'panel'); }
const pos = ref<DockPos>(props.position);
const size = ref(props.size);
const vis = ref(props.visibility);
const POS: DockPos[] = ['left', 'bottom', 'right', 'top'];
const VIS = [{ id: 'always', label: 'Always visible' }, { id: 'autohide', label: 'Auto-hide' }, { id: 'dodge', label: 'Dodge windows' }] as const;
const widgets = ref([
  { id: 'launcher', label: 'Launcher button', icon: 'grid', on: props.panel },
  { id: 'thumbs', label: 'Running windows as thumbnails', icon: 'window', on: false },
  { id: 'trash', label: 'Trash', icon: 'delete', on: props.panel },
  { id: 'clock', label: 'Clock', icon: 'clock', on: props.panel },
  { id: 'battery', label: 'Battery', icon: 'battery', on: false },
]);
function setPos(p: DockPos) { pos.value = p; emit('update:position', p); }
</script>
<template>
  <section class="x-dset hd-on-overlay" role="dialog" aria-label="Dock settings">
    <h2 class="x-dset__h">Dock</h2>
    <h3 class="x-dset__sh">Style</h3>
    <div class="x-dset__seg" role="radiogroup" aria-label="Style">
      <button v-for="v in STYLES" :key="v.id" type="button" role="radio" class="x-dset__segbtn hd-focusable" :class="{ 'is-on': style === v.id }" :aria-checked="style === v.id ? 'true' : 'false'" @click="setStyle(v.id)">{{ v.label }}</button>
    </div>
    <h3 class="x-dset__sh">Position</h3>
    <div class="x-dset__pos" role="radiogroup" aria-label="Position">
      <button v-for="p in POS" :key="p" type="button" role="radio" class="x-dset__posbtn hd-focusable" :class="{ 'is-on': pos === p }" :aria-checked="pos === p ? 'true' : 'false'" @click="setPos(p)">
        <span class="x-dset__mini" :class="`is-${p}`"><i></i></span><span>{{ p[0]!.toUpperCase() + p.slice(1) }}</span>
      </button>
    </div>
    <h3 class="x-dset__sh">Size · {{ size }} px icons</h3>
    <HdSlider v-model="size" :min="32" :max="72" :step="4" label="Icon size" />
    <h3 class="x-dset__sh">Visibility</h3>
    <div class="x-dset__seg" role="radiogroup" aria-label="Visibility">
      <button v-for="v in VIS" :key="v.id" type="button" role="radio" class="x-dset__segbtn hd-focusable" :class="{ 'is-on': vis === v.id }" :aria-checked="vis === v.id ? 'true' : 'false'" @click="vis = v.id">{{ v.label }}</button>
    </div>
    <h3 class="x-dset__sh">Widgets · off by default</h3>
    <ul class="x-dset__list">
      <li v-for="w in widgets" :key="w.id"><span class="x-dset__wi hd-sq"><HdIcon :name="w.icon" :size="16" /></span><span class="x-dset__wl">{{ w.label }}</span><HdSwitch v-model="w.on" :aria-label="w.label" /></li>
    </ul>
    <footer class="x-dset__foot"><HdButton variant="plain" icon="add">Add widgets…</HdButton><HdButton variant="accent" @click="emit('done')">Done</HdButton></footer>
  </section>
</template>
<style>
.x-dset { position: absolute; z-index: 45; width: 380px; padding: 18px 20px 14px; border-radius: var(--hd-radius-card); background: var(--hd-surface-overlay); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); font: 400 var(--hd-font-size-small)/1.2 var(--hd-font-family-base); }
.x-dset__h { margin: 0 0 6px; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1 var(--hd-font-family-light); }
.x-dset__sh { margin: 14px 0 8px; font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); text-transform: uppercase; letter-spacing: .04em; }
.x-dset__pos { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.x-dset__posbtn { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0; border: 1px solid var(--hd-c-divider); border-radius: 6px; background: none; color: inherit; font: inherit; font-size: var(--hd-font-size-xsmall); cursor: pointer; }
.x-dset__posbtn.is-on { border-color: var(--hd-accent); background: color-mix(in srgb, var(--hd-accent) 18%, transparent); }
.x-dset__mini { position: relative; width: 52px; height: 32px; border-radius: 3px; background: color-mix(in srgb, var(--hd-c-fg) 14%, transparent); }
.x-dset__mini i { position: absolute; background: var(--hd-c-fg-secondary); border-radius: 2px; }
.x-dset__posbtn.is-on .x-dset__mini i { background: var(--hd-accent); }
.x-dset__mini.is-left i { left: 3px; top: 4px; bottom: 4px; width: 6px; }
.x-dset__mini.is-right i { right: 3px; top: 4px; bottom: 4px; width: 6px; }
.x-dset__mini.is-bottom i { bottom: 3px; left: 4px; right: 4px; height: 6px; }
.x-dset__mini.is-top i { top: 3px; left: 4px; right: 4px; height: 6px; }
.x-dset__seg { display: flex; border: 1px solid var(--hd-c-divider); border-radius: 6px; overflow: hidden; }
.x-dset__segbtn { flex: 1; height: 34px; border: 0; background: none; color: inherit; font: inherit; font-size: var(--hd-font-size-xsmall); cursor: pointer; }
.x-dset__segbtn + .x-dset__segbtn { border-left: 1px solid var(--hd-c-divider); }
.x-dset__segbtn.is-on { background: linear-gradient(color-mix(in srgb, var(--hd-accent) 78%, #fff), var(--hd-accent)); box-shadow: inset 0 1px 0 rgba(255,255,255,.35); color: #fff; font-weight: 700; }
.x-dset__list { list-style: none; margin: 0; padding: 0; }
.x-dset__list li { display: flex; align-items: center; gap: 10px; height: 40px; }
.x-dset__wi { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; --hd-sq-size: 28px; --hd-sq-fill: color-mix(in srgb, var(--hd-c-fg) 12%, transparent); }
.x-dset__wl { flex: 1; }
.x-dset__list .hd-switch__track { transform: scale(.85); }
.x-dset__foot { display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--hd-c-divider); }
</style>
