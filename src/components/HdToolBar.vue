<script setup lang="ts">
/**
 * ToolBar (N9, measured from the ROM). Bottom bar, 72 n9px portrait / 56 landscape.
 * Default LIGHT: grey gradient #D6D6D8 → #ADADB0 with a dark edge line on top, dark icons. variant="dark" is the per-app
 * variant (Settings, Gallery). Back sits on the left as a lit squircle BUTTON (top-lit gradient, 1px rim), never a bare chevron.
 * Actions/tabs are icon cells; a selected tab is a lighter full-height cell with square edges across the tab's width. Apps may hide the bar entirely, and it
 * hides while the keyboard is up. `menu` is kept for compatibility but the phone has no menu button.
 * Layout (N9, measured at 480 n9px): the first and last buttons' centres sit 44 n9px (29.33px) from the bar edges whatever
 * the number of items (Back's squircle starts ~18 n9px in); the items between are evenly spaced (space-between with that
 * edge inset), NOT equal-width slots. No left / centre / right groups. A lone button sits at its side at the same position:
 * align="start" (Back, +) or "end" (≡). Real tabs (TabBar inside the bar) still fill the bar in equal full-height cells.
 * Action buttons (Back, ToolIcons) are icon-sized squircles: that squircle is their whole visible, hit and pressed area,
 * never the slot. Only real tabs (TabBar inside the bar) fill their slot with the full-height selected cell.
 * owner: a page owned by another app (e.g. Accounts opened from Messaging, n9-add-account.png) shows that app's small
 * squircle icon bottom-left instead of Back; tapping it goes to the owning app. Behaviour unconfirmed on the device.
 */
import { BACK_ARROW_PATH } from './backArrow';
import { computed, useSlots } from 'vue';
import HdSquircle from './HdSquircle.vue';
import HdIcon from './HdIcon.vue';
import HdToolIcon from './HdToolIcon.vue';
const props = withDefaults(defineProps<{ back?: boolean; align?: 'start' | 'end'; owner?: { icon: string; color?: string; label: string }; menu?: boolean; label?: string; landscape?: boolean; fixed?: boolean; variant?: 'light' | 'dark' }>(), {
  label: 'Toolbar', variant: 'light',
});
defineEmits<{ back: []; menu: []; owner: [] }>();
const slots = useSlots();
const BACK_ARROW = BACK_ARROW_PATH;
/** a lone Back / owner icon sits left without asking */
const lone = computed(() => !slots.default && !slots.left && !slots.right && !props.menu && (props.back || !!props.owner));
const side = computed(() => props.align ?? (lone.value ? 'start' : undefined));
</script>
<template>
  <nav class="hd-toolbar" :class="[`hd-toolbar--${variant}`, side && `hd-toolbar--${side}`, { 'hd-toolbar--landscape': landscape, 'hd-toolbar--fixed': fixed }]" :aria-label="label">
    <div class="hd-toolbar__side">
      <button v-if="back" type="button" class="hd-toolbar__back hd-sq hd-focusable" aria-label="Back" title="Back" @click="$emit('back')"><svg class="hd-toolbar__arrow" width="33" height="33" viewBox="0 0 24 24" aria-hidden="true"><path :d="BACK_ARROW" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
      <button v-if="owner && !back" type="button" class="hd-toolbar__owner hd-focusable" :aria-label="owner.label" :title="owner.label" @click="$emit('owner')"><HdSquircle :size="22" :color="owner.color ?? '#1C6FD1'" lighting="lit"><HdIcon :name="owner.icon" :size="14" lit /></HdSquircle></button>
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
  /* every item is a 40px-wide box; centre at 44 n9px = 29.33px from each edge → inset 29.33 − 20 */
  --hd-toolbar-inset: calc(88px / 3 - 20px);
  display: flex; justify-content: space-between; align-items: center; height: var(--hd-size-toolbar); padding: 0 var(--hd-toolbar-inset);
}
/* the groups dissolve, every button / tab is its own item */
.hd-toolbar__side, .hd-toolbar__center, .hd-toolbar .hd-tab-bar { display: contents; }
.hd-toolbar--start { justify-content: flex-start; }
.hd-toolbar--end { justify-content: flex-end; }
/* real tabs: equal full-height cells across the whole bar */
.hd-toolbar:has(.hd-tab-button--icon) { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); justify-items: center; padding: 0; }
.hd-toolbar__back { margin: 0 3px; }
/* action buttons: the squircle is the whole button (hit + pressed area), never the slot */
.hd-toolbar .hd-tool-icon { width: 40px; height: 40px; }
.hd-toolbar .hd-tab-button--icon { justify-self: stretch; align-self: stretch; }
.hd-toolbar--light { background: linear-gradient(#D6D6D8, #ADADB0); box-shadow: inset 0 1px 0 #6E6E72; color: #1A1A1A; --hd-c-pressed: rgba(255,255,255,.55); }
.hd-toolbar--dark { background: linear-gradient(#2A2A2C, #0E0E10); box-shadow: inset 0 1px 0 #48484C; color: #fff; --hd-c-pressed: rgba(255,255,255,.16); }
.hd-toolbar--landscape { height: var(--hd-size-toolbar-landscape); }
/* landscape: icons fit the 56 n9px bar (the squircle highlight shrinks with it) instead of overflowing */
.hd-toolbar--landscape .hd-tool-icon { width: 34px; height: 34px; --hd-sq-size: 34px; }
.hd-toolbar--landscape .hd-tab-button--icon { height: var(--hd-size-toolbar-landscape); min-height: 0; }
.hd-toolbar--fixed { position: fixed; left: 0; right: 0; bottom: 0; z-index: var(--hd-z-toolbar); }
/* Back: a lit squircle button, 51×49 n9px inside the 72 n9px bar (11 above, 12 below), measured on the N9 */
.hd-toolbar__back { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 33px; padding: 0; border: 0; cursor: pointer; color: inherit; --hd-sq-size: 33px; }
.hd-toolbar--light .hd-toolbar__back { --hd-sq-fill: linear-gradient(#F7F7F8, #E6E6E8 50%, #D4D4D7); --hd-sq-ring: rgba(0,0,0,.18); color: #1A1A1A; }
.hd-toolbar--dark .hd-toolbar__back { --hd-sq-fill: linear-gradient(#3A3A3C, #262628 50%, #161618); --hd-sq-ring: rgba(255,255,255,.1); color: #EDEDED; }
.hd-toolbar__back:active { filter: brightness(.9); }
.hd-toolbar__back .hd-toolbar__arrow { position: relative; z-index: 1; }
.hd-toolbar__owner { display: inline-flex; padding: 0; border: 0; background: none; cursor: pointer; }
/* selected tab (N9): a lighter full-height cell, square edges, the tab's width */
.hd-toolbar--light { --hd-tab-selected: linear-gradient(#F4F4F5, #D2D2D5); }
.hd-toolbar--dark { --hd-tab-selected: linear-gradient(#4A4A4E, #2A2A2D); }
.hd-toolbar--light .hd-tool-icon.is-active { --hd-sq-fill: rgba(255,255,255,.6); }
.hd-toolbar--dark .hd-tool-icon.is-active { --hd-sq-fill: rgba(255,255,255,.18); }
</style>
