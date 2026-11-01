<script setup lang="ts">
/**
 * Desktop context / overflow menu (exploration): anchored popover on the overlay surface (dark in Hybrid),
 * 32px pointer rows, icon + label + shortcut hint. Up/Down move, Enter picks, Escape closes.
 */
import { ref, watch, nextTick } from 'vue';
import HdIcon from '../../components/HdIcon.vue';
import XKey from './XKey.vue';
import type { XMenuItem } from './types';
const props = withDefaults(defineProps<{ open: boolean; items: XMenuItem[]; x?: number; y?: number; label?: string; origin?: 'top-left' | 'top-right' }>(), { x: 0, y: 0, label: 'Menu', origin: 'top-left' });
const emit = defineEmits<{ select: [id: string]; 'update:open': [v: boolean] }>();
const panel = ref<HTMLElement>();
const menuEls = () => [...(panel.value?.querySelectorAll<HTMLElement>('[role=menuitem]:not([disabled])') ?? [])];
function onKey(e: KeyboardEvent) {
  const els = menuEls(); const i = els.indexOf(document.activeElement as HTMLElement);
  if (e.key === 'ArrowDown') { e.preventDefault(); els[(i + 1) % els.length]?.focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); els[(i - 1 + els.length) % els.length]?.focus(); }
  else if (e.key === 'Escape') { e.preventDefault(); emit('update:open', false); }
}
watch(() => props.open, async (v) => { if (v) { await nextTick(); menuEls()[0]?.focus({ preventScroll: true }); } });
function pick(it: XMenuItem) { if (it.disabled) return; emit('select', it.id); emit('update:open', false); }
</script>
<template>
  <div v-if="open" class="x-cmenu-scrim" @click="emit('update:open', false)" @contextmenu.prevent="emit('update:open', false)"></div>
  <div v-if="open" ref="panel" class="x-cmenu hd-on-overlay" :class="`x-cmenu--${origin}`" role="menu" :aria-label="label"
    :style="{ left: `${x}px`, top: `${y}px` }" @keydown="onKey">
    <template v-for="it in items" :key="it.id">
      <div v-if="it.divider" class="x-cmenu__div" role="separator"></div>
      <button type="button" role="menuitem" tabindex="-1" class="x-cmenu__item hd-focusable" :class="{ 'is-destructive': it.destructive }" :disabled="it.disabled" @click="pick(it)">
        <HdIcon v-if="it.icon" :name="it.icon" :size="16" /><span v-else class="x-cmenu__noicon"></span>
        <span class="x-cmenu__label">{{ it.label }}</span>
        <XKey v-if="it.keys" :keys="it.keys" />
      </button>
    </template>
  </div>
</template>
<style>
.x-cmenu-scrim { position: absolute; inset: 0; z-index: 40; }
.x-cmenu { position: absolute; z-index: 41; min-width: 220px; padding: 4px 0; background: var(--hd-surface-overlay); color: var(--hd-c-fg); border-radius: var(--hd-radius-card); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); }
.x-cmenu--top-right { transform: translateX(-100%); }
.x-cmenu__item { display: flex; align-items: center; gap: 10px; width: 100%; height: 32px; padding: 0 12px; border: 0; background: none; color: inherit; text-align: left; font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); cursor: pointer; }
.x-cmenu__item:hover:not(:disabled), .x-cmenu__item:focus-visible { background: var(--hd-c-pressed); outline: none; }
.x-cmenu__item:disabled { opacity: var(--hd-opacity-disabled); cursor: default; }
.x-cmenu__item.is-destructive { color: #ff6b69; }
.x-cmenu__noicon { width: 16px; }
.x-cmenu__label { flex: 1; }
.x-cmenu__div { height: 1px; margin: 4px 0; background: var(--hd-c-divider); }
</style>
