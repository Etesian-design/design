<script setup lang="ts">
/** Notes mock: a light page with a note. */
import XAppShell from '../parts/XAppShell.vue';
import HdPageHeader from '../../../components/HdPageHeader.vue';
import { shellProps, type XAppProps } from '../parts/types';
const props = withDefaults(defineProps<XAppProps>(), { hints: true });
</script>
<template>
  <XAppShell title="Notes" v-bind="shellProps(props)" :actions="[{ icon: 'add', label: 'New note', keys: 'Ctrl+N' }, { icon: 'share', label: 'Share' }]">
    <div class="x-notes" style="--hd-accent: #F2B111">
      <HdPageHeader title="Tablet ideas" subtitle="Edited 10 min ago" />
      <div class="x-notes__body">
        <p>• Events beside the app grid in landscape, opt-in.</p>
        <p>• Toolbar stays at the bottom: Back bottom-left, like the phone.</p>
        <p>• Sheets become centred panels instead of covering the whole screen.</p>
        <p>• Split view: 1/2 + 1/2 or 2/3 + 1/3, drag the divider.</p>
        <p>• Pop-up window for quick replies, with a mini-toolbar.</p>
      </div>
    </div>
  </XAppShell>
</template>
<style>
.x-notes { flex: 1; min-height: 0; background: var(--hd-c-bg); }
.x-notes__body { padding: 8px 16px; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1.5 var(--hd-font-family-light); }
.x-notes__body p { margin: 0 0 6px; }
</style>
