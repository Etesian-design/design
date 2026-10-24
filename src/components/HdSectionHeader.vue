<script setup lang="ts">
/** SectionHeader. N9-original: small bold secondary label, right-aligned, with a hairline to its left.
 *  align="start" (Events): label left, hairline, then an optional #action slot (a lit "Clear" / "Refresh" button). */
withDefaults(defineProps<{ title: string; align?: 'end' | 'start'; level?: 2 | 3 | 4; large?: boolean }>(), { align: 'end', level: 2 });
</script>
<template>
  <component :is="`h${level}`" class="hd-section-header" :class="[`hd-section-header--${align}`, { 'hd-section-header--large': large }]">
    <template v-if="align === 'start'"><span>{{ title }}</span><span class="hd-section-header__line" aria-hidden="true"></span><slot name="action" /></template>
    <template v-else><span class="hd-section-header__line" aria-hidden="true"></span><span>{{ title }}</span></template>
  </component>
</template>
<style>
.hd-section-header {
  display: flex; align-items: center; gap: var(--hd-space-double); margin: 0; padding: var(--hd-space-double) var(--hd-space-xlarge);
  font: var(--hd-font-weight-bold) var(--hd-font-size-xsmall)/1.2 var(--hd-font-family-base); color: var(--hd-c-fg-secondary);
}
.hd-section-header__line { flex: 1; height: 1px; background: var(--hd-c-divider); }
.hd-section-header--large { font-size: 1rem; padding-top: var(--hd-space-xlarge); }
.hd-section-header--start .hd-section-header__line { margin-right: var(--hd-space-double); }
</style>
<style>
.hd-section-header .hd-button { flex: none; min-height: 34px; height: 34px; padding: 0 18px; font-size: .875rem; color: var(--hd-c-fg); }
</style>
