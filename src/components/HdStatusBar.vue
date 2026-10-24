<script setup lang="ts">
/** StatusBar. N9-original: 36 n9px black bar, small white glyphs; time centred-right; tap opens status menu. Decorative in web contexts. */
import HdIcon from './HdIcon.vue';
withDefaults(defineProps<{ time?: string; battery?: number; signal?: number; operator?: string; transparent?: boolean }>(), { time: '12:45', battery: 80, signal: 4, operator: '' });
</script>
<template>
  <div class="hd-status-bar hd-on-home" :class="{ 'hd-status-bar--transparent': transparent }" role="status" :aria-label="`Time ${time}, battery ${battery}%`">
    <span class="hd-status-bar__signal" aria-hidden="true"><i v-for="i in 5" :key="i" :class="{ on: i <= signal }" :style="{ height: `${3 + i * 2}px` }"></i></span>
    <span v-if="operator" aria-hidden="true">{{ operator }}</span>
    <span class="hd-status-bar__spacer"></span>
    <HdIcon name="wifi" :size="14" />
    <HdIcon name="battery" :size="16" />
    <span class="hd-status-bar__time" aria-hidden="true">{{ time }}</span>
  </div>
</template>
<style>
.hd-status-bar { display: flex; align-items: center; gap: 6px; height: var(--hd-size-status-bar); padding: 0 var(--hd-space-double); background: var(--hd-surface-home); color: var(--hd-c-fg); font: 400 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); font-variant-numeric: tabular-nums; }
.hd-status-bar--transparent { background: transparent; }
.hd-status-bar__spacer { flex: 1; }
.hd-status-bar__signal { display: inline-flex; align-items: flex-end; gap: 1px; height: 13px; }
.hd-status-bar__signal i { width: 3px; background: currentColor; opacity: .35; }
.hd-status-bar__signal i.on { opacity: 1; }
</style>
