<script setup lang="ts" generic="T extends Record<string, any>">
/**
 * Table (extrapolated, web). Calm, no zebra, hairline rows, list-item height rows, tabular numbers,
 * sortable headers (aria-sort). Below 600px each row reflows into an N9 list item (label: value).
 */
import { computed, ref } from 'vue';
export interface HdColumn { key: string; label: string; numeric?: boolean; sortable?: boolean }
const props = withDefaults(defineProps<{ columns: HdColumn[]; rows: T[]; caption?: string; rowKey?: string }>(), { rowKey: 'id' });
const sortKey = ref<string>(); const asc = ref(true);
function sort(c: HdColumn) { if (!c.sortable) return; if (sortKey.value === c.key) asc.value = !asc.value; else { sortKey.value = c.key; asc.value = true; } }
const sorted = computed(() => {
  if (!sortKey.value) return props.rows;
  const k = sortKey.value;
  return [...props.rows].sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * (asc.value ? 1 : -1));
});
</script>
<template>
  <div class="hd-table-wrap">
    <table class="hd-table">
      <caption v-if="caption">{{ caption }}</caption>
      <thead><tr>
        <th v-for="c in columns" :key="c.key" scope="col" :class="{ 'is-num': c.numeric }"
          :aria-sort="sortKey === c.key ? (asc ? 'ascending' : 'descending') : c.sortable ? 'none' : undefined">
          <button v-if="c.sortable" type="button" class="hd-table__sort hd-focusable" @click="sort(c)">{{ c.label }}<span aria-hidden="true">{{ sortKey === c.key ? (asc ? ' ▲' : ' ▼') : '' }}</span></button>
          <template v-else>{{ c.label }}</template>
        </th>
      </tr></thead>
      <tbody>
        <tr v-for="(r, i) in sorted" :key="r[rowKey] ?? i">
          <td v-for="c in columns" :key="c.key" :data-label="c.label" :class="{ 'is-num': c.numeric }"><slot :name="`cell-${c.key}`" :row="r">{{ r[c.key] }}</slot></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style>
.hd-table-wrap { overflow-x: auto; }
.hd-table { width: 100%; border-collapse: collapse; font-size: var(--hd-font-size-default); }
.hd-table caption { text-align: left; padding: 0 0 8px; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1.2 var(--hd-font-family-light); }
.hd-table th { text-align: left; padding: 8px 12px; font: var(--hd-font-weight-bold) var(--hd-font-size-xsmall)/1.2 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); text-transform: uppercase; letter-spacing: .04em; border-bottom: 1px solid var(--hd-c-fg-secondary); }
.hd-table td { padding: 0 12px; height: var(--hd-size-list-item-small); border-bottom: 1px solid var(--hd-c-divider); }
.hd-table tbody tr:hover { background: var(--hd-c-pressed); }
.hd-table .is-num { text-align: right; font-variant-numeric: tabular-nums; }
.hd-table__sort { all: unset; cursor: pointer; border-radius: 2px; }
.hd-table__sort:focus-visible { outline: 2px solid var(--hd-c-focus); }
@media (max-width: 599.98px) {
  .hd-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .hd-table tr { display: block; padding: 8px 0; border-bottom: 1px solid var(--hd-c-divider); }
  .hd-table td { display: flex; justify-content: space-between; gap: 16px; height: auto; padding: 4px 16px; border: 0; }
  .hd-table td::before { content: attr(data-label); color: var(--hd-c-fg-secondary); font-size: var(--hd-font-size-small); }
  .hd-table td:first-child { font-size: var(--hd-font-size-large); }
  .hd-table td:first-child::before { display: none; }
}
</style>
