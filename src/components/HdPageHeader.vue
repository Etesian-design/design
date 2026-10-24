<script setup lang="ts">
/**
 * PageHeader. N9-original: 72 n9px header; either plain (title in large light type on the page bg)
 * or coloured with the app accent and white text. Optional drop-down indicator (header menu).
 */
import HdIcon from './HdIcon.vue';
const props = withDefaults(defineProps<{ title: string; subtitle?: string; colored?: boolean; accent?: string; level?: 1 | 2 | 3; dropdown?: boolean }>(), { level: 1 });
defineEmits<{ select: [] }>();
</script>
<template>
  <header class="hd-page-header" :class="{ 'hd-page-header--colored': colored }"
    :style="accent ? { '--hd-accent': accent } : undefined">
    <component :is="`h${level}`" class="hd-page-header__title">
      <button v-if="dropdown" type="button" class="hd-page-header__drop hd-focusable" aria-haspopup="listbox" @click="$emit('select')">
        {{ title }} <HdIcon name="chevron-down" :size="20" />
      </button>
      <template v-else>{{ title }}</template>
    </component>
    <p v-if="subtitle" class="hd-page-header__subtitle">{{ subtitle }}</p>
    <div v-if="$slots.default" class="hd-page-header__extra"><slot /></div>
  </header>
</template>
<style>
.hd-page-header {
  min-height: var(--hd-size-header); padding: 13px var(--hd-space-xlarge);
  display: flex; flex-wrap: wrap; align-items: center; gap: 0 var(--hd-space-double);
  border-bottom: 1px solid var(--hd-c-divider);
}
.hd-page-header--colored { background: var(--hd-accent); color: #fff; border-bottom: 0; }
.hd-page-header__title {
  flex: 1 1 auto; margin: 0; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/var(--hd-font-line-height-tight) var(--hd-font-family-light);
}
.hd-page-header__drop { all: unset; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; border-radius: 4px; }
.hd-page-header__drop:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
.hd-page-header__subtitle { flex-basis: 100%; margin: 2px 0 0; font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); }
.hd-page-header--colored .hd-page-header__subtitle { color: rgba(255,255,255,.85); }
</style>
