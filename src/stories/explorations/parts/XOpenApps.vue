<script setup lang="ts">
/**
 * Open applications home view: live cards (each card renders the real app, scaled down) in a cols x rows grid.
 * hoverClose: the close button (squircle) appears on hover instead of only in long-press edit mode (desktop).
 */
import { ref } from 'vue';
import HdTaskCard from '../../../components/HdTaskCard.vue';
import XFit from './XFit.vue';
import XMiniApp from './XMiniApp.vue';
const props = withDefaults(defineProps<{ apps: string[]; cols?: number; w?: number; h?: number; hoverClose?: boolean; editing?: boolean; chrome?: 'toolbar' | 'headerbar' | 'none'; focus?: number; gap?: number; forceHover?: number }>(),
  { cols: 3, w: 1280, h: 800, chrome: 'toolbar', gap: 28 });
const emit = defineEmits<{ open: [name: string]; close: [name: string] }>();
const hover = ref<number | null>(props.forceHover ?? null);
</script>
<template>
  <ul class="x-open" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: `${gap}px` }" aria-label="Open applications">
    <li v-for="(a, i) in apps" :key="a + i" class="x-open__item" :class="{ 'is-hover-close': hoverClose && hover === i, 'is-focus': focus === i }"
      @mouseenter="hover = i" @mouseleave="hover = null">
      <HdTaskCard :title="a" :editing="editing || (hoverClose && hover === i)" @open="emit('open', a)" @close="emit('close', a)">
        <XFit :w="w" :h="h" :initial="0.2"><div class="x-open__live" inert><XMiniApp :name="a" :chrome="chrome" landscape :hints="false" :id-prefix="`x-open-${i}`" /></div></XFit>
      </HdTaskCard>
    </li>
  </ul>
</template>
<style>
.x-open { list-style: none; margin: 0; padding: 0; display: grid; align-content: start; }
.x-open__item { min-width: 0; }
.x-open .hd-task-card__preview { aspect-ratio: auto; height: auto; box-shadow: 0 0 0 1px var(--hd-c-divider), 0 4px 14px rgba(0,0,0,.3); }
.x-open__live { width: 100%; height: 100%; pointer-events: none; }
.x-open .hd-task-card__title { font-size: var(--hd-font-size-small); color: var(--hd-c-fg); }
.x-open__item.is-hover-close .hd-task-card__preview { animation: none; }
.x-open__item.is-focus .hd-task-card__preview { outline: 2px solid var(--hd-c-focus); outline-offset: 3px; }
</style>
