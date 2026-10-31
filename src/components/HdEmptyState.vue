<script setup lang="ts">
/**
 * EmptyState (N9, n9-messaging-empty.png): the whole app area, no header or toolbar. Dark charcoal #1A1A1C with faint
 * diagonal stripes that strengthen towards the bottom; a huge thin LIGHT text (56 n9px ≈ 37px), grey #8A8A8A, centred,
 * about three lines; the actions are stacked dark lit buttons (320 × 50 n9px ≈ 213 × 33px, 14 n9px ≈ 9px apart) in the
 * lower third. Use it for the first run of an app that has nothing to show yet.
 */
withDefaults(defineProps<{ text: string; actions?: string[] }>(), { actions: () => [] });
defineEmits<{ action: [label: string] }>();
</script>
<template>
  <section class="hd-empty-state">
    <p class="hd-empty-state__text">{{ text }}</p>
    <div v-if="actions.length || $slots.default" class="hd-empty-state__actions">
      <slot><button v-for="a in actions" :key="a" type="button" class="hd-empty-state__btn hd-focusable" @click="$emit('action', a)">{{ a }}</button></slot>
    </div>
  </section>
</template>
<style>
.hd-empty-state { position: relative; flex: 1; min-height: 0; height: 100%; display: flex; flex-direction: column; align-items: center; color: #8A8A8A;
  background: repeating-linear-gradient(-60deg, rgba(255,255,255,0) 0 5px, rgba(255,255,255,.035) 5px 7px), #1A1A1C; }
.hd-empty-state::before { content: ''; position: absolute; inset: 0; background: linear-gradient(#1A1A1C 25%, rgba(26,26,28,0) 100%); pointer-events: none; }
.hd-empty-state__text { position: relative; flex: 1.6; display: flex; align-items: center; margin: 0; padding: 0 4px; text-align: center; font: 200 37px/1.2 var(--hd-font-family-light); }
.hd-empty-state__actions { position: relative; flex: 1; display: flex; flex-direction: column; gap: 9px; justify-content: flex-start; width: 67%; }
.hd-empty-state__btn { height: 33px; border-radius: calc(33px * .21); border: 1px solid #393839; background: linear-gradient(#2A2A2B, #161617 50%, #0C0C0C); box-shadow: inset 0 1px 0 rgba(255,255,255,.09);
  color: #fff; font: 700 var(--hd-font-size-button)/1 var(--hd-font-family-base); cursor: pointer; }
.hd-empty-state__btn:active { background: linear-gradient(#080808, #0C0C0C); color: #8C8C8C; }
</style>
