<script setup lang="ts">
/** Container (extrapolated, web). Centred max-width column with responsive page gutters. */
withDefaults(defineProps<{ size?: 'prose' | 'default' | 'wide' | 'full'; tag?: string }>(), { size: 'default', tag: 'div' });
</script>
<template><component :is="tag" class="hd-container" :class="`hd-container--${size}`"><slot /></component></template>
<style>
.hd-container { width: 100%; margin-inline: auto; padding-inline: var(--hd-space-page); }
@media (min-width: 600px) { .hd-container { padding-inline: 24px; } }
@media (min-width: 960px) { .hd-container { padding-inline: 32px; } }
.hd-container--prose { max-width: calc(var(--hd-container-prose) + 64px); }
.hd-container--default { max-width: calc(var(--hd-container-default) + 64px); }
.hd-container--wide { max-width: calc(var(--hd-container-wide) + 64px); }
</style>
