<script setup lang="ts">
/**
 * ToolBar (N9, measured from the ROM). Bottom bar, 72 n9px portrait / 56 landscape.
 * Default LIGHT: grey gradient #D6D6D8 → #ADADB0 with a dark edge line on top, dark icons. variant="dark" is the per-app
 * variant (Settings, Gallery). Back sits on the left as a lit squircle BUTTON (top-lit gradient, 1px rim), never a bare chevron.
 * Actions/tabs are icon cells; a selected tab is a lighter squircle behind its icon. Apps may hide the bar entirely, and it
 * hides while the keyboard is up. `menu` is kept for compatibility but the phone has no menu button.
 */
import HdToolIcon from './HdToolIcon.vue';
withDefaults(defineProps<{ back?: boolean; menu?: boolean; label?: string; landscape?: boolean; fixed?: boolean; variant?: 'light' | 'dark' }>(), {
  label: 'Toolbar', variant: 'light',
});
defineEmits<{ back: []; menu: [] }>();
</script>
<template>
  <nav class="hd-toolbar" :class="[`hd-toolbar--${variant}`, { 'hd-toolbar--landscape': landscape, 'hd-toolbar--fixed': fixed }]" :aria-label="label">
    <div class="hd-toolbar__side">
      <button v-if="back" type="button" class="hd-toolbar__back hd-sq hd-focusable" aria-label="Back" title="Back" @click="$emit('back')"><svg class="hd-toolbar__arrow" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10H10.5l3.6-3.6L12.6 5 6 11.6v.8l6.6 6.6 1.5-1.4-3.6-3.6H20z" fill="currentColor" /></svg></button>
      <slot name="left" />
    </div>
    <div class="hd-toolbar__center"><slot /></div>
    <div class="hd-toolbar__side hd-toolbar__side--end">
      <slot name="right" />
      <HdToolIcon v-if="menu" icon="more" label="Menu" aria-haspopup="menu" @click="$emit('menu')" />
    </div>
  </nav>
</template>
<style>
.hd-toolbar {
  display: flex; align-items: center; height: var(--hd-size-toolbar); padding: 0 var(--hd-space-medium);
}
.hd-toolbar--light { background: linear-gradient(#D6D6D8, #ADADB0); box-shadow: inset 0 1px 0 #6E6E72; color: #1A1A1A; --hd-c-pressed: rgba(255,255,255,.55); }
.hd-toolbar--dark { background: linear-gradient(#2A2A2C, #0E0E10); box-shadow: inset 0 1px 0 #48484C; color: #fff; --hd-c-pressed: rgba(255,255,255,.16); }
.hd-toolbar--landscape { height: var(--hd-size-toolbar-landscape); }
/* landscape: icons fit the 56 n9px bar (the squircle highlight shrinks with it) instead of overflowing */
.hd-toolbar--landscape .hd-tool-icon, .hd-toolbar--landscape .hd-tab-button--icon { height: var(--hd-size-toolbar-landscape); min-height: 0; }
.hd-toolbar--fixed { position: fixed; left: 0; right: 0; bottom: 0; z-index: var(--hd-z-toolbar); }
.hd-toolbar__side { flex: 1 1 0; display: flex; align-items: center; min-width: var(--hd-size-touch-target); }
.hd-toolbar__side--end { justify-content: flex-end; }
.hd-toolbar__center { flex: 0 1 auto; display: flex; align-items: center; gap: var(--hd-space-xxlarge); }
/* Back: a lit squircle button */
.hd-toolbar__back { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 48px; padding: 0; border: 0; cursor: pointer; color: inherit; --hd-sq-size: 46px; }
.hd-toolbar--light .hd-toolbar__back { --hd-sq-fill: linear-gradient(#F7F7F8, #E6E6E8 50%, #D4D4D7); --hd-sq-ring: #8E8E93; color: #141414; }
.hd-toolbar--dark .hd-toolbar__back { --hd-sq-fill: linear-gradient(#3A3A3C, #232325 50%, #161618); --hd-sq-ring: #5A5A5E; color: #fff; }
.hd-toolbar__back:active { filter: brightness(.9); }
.hd-toolbar__back .hd-toolbar__arrow { position: relative; z-index: 1; }
/* selected tab: a lighter squircle behind the icon */
.hd-toolbar--light .hd-tab-button--icon.is-selected, .hd-toolbar--light .hd-tool-icon.is-active { --hd-sq-fill: rgba(255,255,255,.6); }
.hd-toolbar--dark .hd-tab-button--icon.is-selected, .hd-toolbar--dark .hd-tool-icon.is-active { --hd-sq-fill: rgba(255,255,255,.18); }
</style>
