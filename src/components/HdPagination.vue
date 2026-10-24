<script setup lang="ts">
/** Pagination (extrapolated, web). Prev / numbered pages / Next; compact (prev · n of m · next) below 600px. */
import { computed } from 'vue';
import HdIcon from './HdIcon.vue';
const props = withDefaults(defineProps<{ page: number; total: number; label?: string }>(), { label: 'Pagination' });
const emit = defineEmits<{ 'update:page': [p: number] }>();
const pages = computed(() => {
  const out: (number | '…')[] = [];
  for (let p = 1; p <= props.total; p++) {
    if (p === 1 || p === props.total || Math.abs(p - props.page) <= 1) out.push(p);
    else if (out[out.length - 1] !== '…') out.push('…');
  }
  return out;
});
const go = (p: number) => p >= 1 && p <= props.total && p !== props.page && emit('update:page', p);
</script>
<template>
  <nav class="hd-pagination" :aria-label="label">
    <button type="button" class="hd-pagination__btn hd-focusable" :disabled="page <= 1" aria-label="Previous page" @click="go(page - 1)"><HdIcon name="back" :size="20" /></button>
    <ul class="hd-pagination__list">
      <li v-for="(p, i) in pages" :key="i">
        <span v-if="p === '…'" class="hd-pagination__gap" aria-hidden="true">…</span>
        <button v-else type="button" class="hd-pagination__btn hd-focusable" :class="{ 'is-current': p === page }" :aria-current="p === page ? 'page' : undefined" :aria-label="`Page ${p}`" @click="go(p)">{{ p }}</button>
      </li>
    </ul>
    <span class="hd-pagination__compact" aria-hidden="true">{{ page }} / {{ total }}</span>
    <button type="button" class="hd-pagination__btn hd-focusable" :disabled="page >= total" aria-label="Next page" @click="go(page + 1)"><HdIcon name="chevron-right" :size="20" /></button>
  </nav>
</template>
<style>
.hd-pagination { display: flex; align-items: center; gap: 4px; }
.hd-pagination__list { display: flex; gap: 4px; list-style: none; margin: 0; padding: 0; }
.hd-pagination__btn { min-width: 40px; height: 40px; padding: 0 8px; border: 0; border-radius: var(--hd-radius-control); background: transparent; color: var(--hd-c-fg); font: var(--hd-font-weight-regular) var(--hd-font-size-default)/1 var(--hd-font-family-base); font-variant-numeric: tabular-nums; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.hd-pagination__btn:hover:not(:disabled) { background: var(--hd-c-pressed); }
.hd-pagination__btn.is-current { background: var(--hd-accent); color: #fff; font-weight: 700; }
.hd-pagination__btn:disabled { opacity: var(--hd-opacity-disabled); cursor: default; }
.hd-pagination__gap { padding: 0 4px; color: var(--hd-c-fg-secondary); }
.hd-pagination__compact { display: none; padding: 0 8px; color: var(--hd-c-fg-secondary); }
@media (max-width: 599.98px) { .hd-pagination__list { display: none; } .hd-pagination__compact { display: inline; } }
</style>
