<script setup lang="ts">
/**
 * The browser's frame: one row under the window header with Back, Forward, Reload, the address field (the site's state as a
 * lock or a warning, squircle-half ends) and ⋯ for zoom, other devices and the rest. The tabs are XBrowserTabs, in the
 * window header. In a narrow window (container under 560 px) the row moves to the bottom, as on the phone.
 */
import HdIcon from '../../components/HdIcon.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
withDefaults(defineProps<{ address?: string; secure?: boolean; back?: boolean; forward?: boolean; loading?: number }>(), { address: 'journal.example/tablet-swipe', secure: true, back: true, forward: false });
defineEmits<{ go: [address: string]; back: []; forward: []; reload: []; more: [] }>();
</script>
<template>
  <div class="x-bf">
    <div class="x-bf__row hd-on-chrome" role="toolbar" aria-label="Navigation">
      <HdToolIcon icon="back" label="Back" :disabled="!back" @click="$emit('back')" />
      <HdToolIcon icon="back" label="Forward" class="x-bf__fwd" :disabled="!forward" @click="$emit('forward')" />
      <HdToolIcon icon="refresh" label="Reload" @click="$emit('reload')" />
      <label class="x-bf__addr hd-focusable">
        <HdIcon :name="secure ? 'lock' : 'warning'" :size="16" :class="{ 'is-warn': !secure }" :aria-label="secure ? 'Secure connection' : 'Not secure'" />
        <input :value="address" aria-label="Address" spellcheck="false" @keydown.enter="$emit('go', ($event.target as HTMLInputElement).value)" />
        <HdIcon name="star" :size="16" aria-label="Bookmark" />
      </label>
      <HdToolIcon icon="more-vert" label="More: zoom, other devices, find in page" @click="$emit('more')" />
      <span v-if="loading !== undefined" class="x-bf__load" :style="{ width: `${loading}%` }" aria-hidden="true"></span>
    </div>
    <div class="x-bf__page"><slot /></div>
  </div>
</template>
<style>
.x-bf { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; background: var(--hd-c-bg); }
.x-bf__row { position: relative; flex: none; min-width: 0; display: flex; align-items: center; gap: 2px; height: 46px; padding: 0 6px; background: var(--hd-surface-chrome); color: var(--hd-c-fg); border-bottom: 1px solid var(--hd-c-divider); }
.x-bf__row .hd-tool-icon { flex: none; width: 38px; height: 40px; --hd-sq-size: 32px; }
.x-bf__row .hd-tool-icon svg { width: 20px; height: 20px; }
.x-bf__fwd svg { transform: scaleX(-1); }
.x-bf__addr { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; height: 32px; margin: 0 6px; padding: 0 14px; border-radius: 16px; background: color-mix(in srgb, var(--hd-c-fg) 10%, transparent); color: var(--hd-c-fg-secondary); }
.x-bf__addr input { flex: 1; min-width: 0; border: 0; background: none; color: var(--hd-c-fg); font: 400 var(--hd-font-size-small)/1 var(--hd-font-family-base); outline: none; }
.x-bf__addr .is-warn { color: var(--hd-color-palette-warning); }
.x-bf__load { position: absolute; left: 0; bottom: -1px; height: 2px; background: var(--hd-accent); }
.x-bf .x-web__bar { display: none; }
.x-bf__page { flex: 1; min-width: 0; min-height: 0; overflow: auto; display: flex; }
@container (max-width: 559px) { .x-bf__row { order: 2; border-bottom: 0; border-top: 1px solid var(--hd-c-divider); } }
</style>
