<script setup lang="ts">
/**
 * Menu / ContextMenu. N9-original: app Menu slides up from the toolbar (full width, inverted, items
 * stacked, large text); ContextMenu (long-press) is the same panel. Web: anchored popover at >= 600px.
 * ARIA menu pattern: Up/Down/Home/End, Escape closes.
 */
import { ref, toRef, nextTick, watch } from 'vue';
import { useModal } from '../composables/useModal';
export interface HdMenuItem { id: string; label: string; disabled?: boolean; destructive?: boolean }
const props = withDefaults(defineProps<{ open: boolean; items: HdMenuItem[]; label?: string; inline?: boolean; title?: string }>(), { label: 'Menu' });
const emit = defineEmits<{ select: [id: string]; 'update:open': [v: boolean] }>();
const panel = ref<HTMLElement>();
useModal(toRef(props, 'open'), panel, () => emit('update:open', false));
function focusAt(i: number) { const els = [...(panel.value?.querySelectorAll<HTMLElement>('[role=menuitem]:not([disabled])') ?? [])]; els[(i + els.length) % els.length]?.focus(); }
function onKey(e: KeyboardEvent) {
  const els = [...(panel.value?.querySelectorAll<HTMLElement>('[role=menuitem]:not([disabled])') ?? [])];
  const i = els.indexOf(document.activeElement as HTMLElement);
  const map: Record<string, number> = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: els.length - 1 };
  if (e.key in map) { e.preventDefault(); focusAt(map[e.key]!); }
}
watch(() => props.open, async (v) => { if (v) { await nextTick(); focusAt(0); } });
function pick(it: HdMenuItem) { if (it.disabled) return; emit('select', it.id); emit('update:open', false); }
</script>
<template>
  <Transition name="hd-menu">
    <div v-if="open" class="hd-menu" :class="{ 'hd-menu--inline': inline }" @click.self="emit('update:open', false)">
      <div ref="panel" class="hd-menu__panel hd-inverted" role="menu" :aria-label="label" @keydown="onKey">
        <p v-if="title" class="hd-menu__title">{{ title }}</p>
        <button v-for="it in items" :key="it.id" type="button" role="menuitem" class="hd-menu__item hd-focusable" :class="{ 'is-destructive': it.destructive }"
          :disabled="it.disabled" tabindex="-1" @click="pick(it)">{{ it.label }}</button>
      </div>
    </div>
  </Transition>
</template>
<style>
.hd-menu { position: fixed; inset: 0; z-index: var(--hd-z-overlay); background: rgba(0,0,0,.4); display: flex; align-items: flex-end; justify-content: center; }
.hd-menu--inline { position: absolute; }
.hd-menu__panel { width: 100%; max-width: 480px; padding: var(--hd-space-double) 0 var(--hd-space-xxlarge); background: rgba(20,20,20,.97); color: #fff; border-radius: var(--hd-radius-card) var(--hd-radius-card) 0 0; box-shadow: var(--hd-shadow-overlay); }
.hd-menu__title { margin: 0; padding: var(--hd-space-double) var(--hd-space-xxlarge); color: var(--hd-c-fg-secondary); font-size: var(--hd-font-size-small); }
.hd-menu__item { display: block; width: 100%; min-height: var(--hd-size-list-item-small); padding: 0 var(--hd-space-xxlarge); border: 0; background: none; color: inherit; text-align: left;
  font: var(--hd-font-weight-light) var(--hd-font-size-large)/1.2 var(--hd-font-family-light); cursor: pointer; }
.hd-menu__item:hover:not(:disabled), .hd-menu__item:focus-visible { background: rgba(255,255,255,.1); outline-offset: -2px; }
.hd-menu__item:disabled { opacity: var(--hd-opacity-disabled); cursor: default; }
.hd-menu__item.is-destructive { color: #ff6b69; }
.hd-menu-enter-active, .hd-menu-leave-active { transition: opacity var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-menu-enter-active .hd-menu__panel, .hd-menu-leave-active .hd-menu__panel { transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out); }
.hd-menu-enter-from, .hd-menu-leave-to { opacity: 0; }
.hd-menu-enter-from .hd-menu__panel, .hd-menu-leave-to .hd-menu__panel { transform: translateY(40px); }
</style>
