<script setup lang="ts">
/** Launcher (tap Super): a compact search field over the windows with the app grid; typing filters. Separate from the Windows view. */
import HdSearchField from '../../../components/HdSearchField.vue';
import XAppsView from '../parts/XAppsView.vue';
import XKey from '../parts/XKey.vue';
withDefaults(defineProps<{ query?: string }>(), { query: '' });
const emit = defineEmits<{ 'update:query': [q: string]; open: [name: string] }>();
</script>
<template>
  <section class="x-launch hd-on-overlay" role="dialog" aria-label="Launcher">
    <HdSearchField :model-value="query" placeholder="Type to search apps, people, mail and files" label="Search" @update:model-value="(v: string) => emit('update:query', v)" />
    <p class="x-launch__sub"><template v-if="query">Apps matching “{{ query }}” · <XKey keys="Enter" /> opens the first</template><template v-else>All applications · <XKey keys="Super+Tab" /> shows open windows</template></p>
    <XAppsView :columns="6" :size="64" :query="query" @open="(n: string) => emit('open', n)" />
  </section>
</template>
<style>
.x-launch { position: absolute; z-index: 46; top: 90px; left: 50%; transform: translateX(-50%); width: 760px; padding: 20px 20px 8px; border-radius: var(--hd-radius-card); background: color-mix(in srgb, var(--hd-surface-overlay) 96%, transparent); color: var(--hd-c-fg); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px); }
.x-launch__sub { display: flex; align-items: center; gap: 6px; margin: 12px 4px 0; font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-launch .x-apps__grid { padding-top: 16px; row-gap: 20px; }
</style>
