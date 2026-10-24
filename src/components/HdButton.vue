<script setup lang="ts">
/**
 * Button. N9-original: bold 22px label (FONT_BUTTON), fixed 322 n9px width in dialogs,
 * white blanco button with black text, pressed text #8C8C8C, disabled opacity.
 * Variants accent/negative come from Qt Components extras (Positive/NegativeButtonStyle).
 * Lighting (default lit): top-lit gradient + bright top rim like the icon tiles, corners ~21% of the height; lighting="flat" opts out.
 */
import HdIcon from './HdIcon.vue';
const props = withDefaults(defineProps<{
  variant?: 'default' | 'accent' | 'negative' | 'plain';
  disabled?: boolean; icon?: string; block?: boolean; fixedWidth?: boolean;
  type?: 'button' | 'submit' | 'reset'; href?: string; checked?: boolean; lighting?: 'lit' | 'flat';
}>(), { variant: 'default', type: 'button', lighting: 'lit' });
defineEmits<{ click: [e: MouseEvent] }>();
</script>
<template>
  <component :is="href ? 'a' : 'button'" class="hd-button hd-focusable"
    :class="[`hd-button--${variant}`, { 'hd-button--block': block, 'hd-button--fixed': fixedWidth, 'hd-button--checked': checked, 'hd-button--flat': lighting === 'flat', 'hd-button--icon-only hd-sq': icon && !$slots.default }]"
    :type="href ? undefined : type" :href="href && !disabled ? href : undefined"
    :disabled="href ? undefined : disabled" :aria-disabled="disabled ? 'true' : undefined"
    :aria-pressed="checked === undefined ? undefined : String(checked)"
    @click="(e: MouseEvent) => !disabled && $emit('click', e)">
    <HdIcon v-if="icon" :name="icon" :size="20" />
    <span v-if="$slots.default" class="hd-button__label"><slot /></span>
  </component>
</template>
<style>
.hd-button {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--hd-space-double);
  min-height: var(--hd-size-button); padding: 0 var(--hd-space-xxlarge);
  font: var(--hd-font-weight-bold) var(--hd-font-size-button)/1 var(--hd-font-family-base);
  border-radius: var(--hd-radius-control); border: 1px solid var(--hd-c-button-border);
  background: var(--hd-c-button-bg); color: var(--hd-c-button-fg);
  text-decoration: none; cursor: pointer; user-select: none;
  transition: background var(--hd-motion-duration-instant) var(--hd-motion-easing-out), color var(--hd-motion-duration-instant), filter var(--hd-motion-duration-instant);
}
.hd-button:hover:not(:disabled) { filter: brightness(0.96); }
.hd-button:active:not(:disabled) { color: var(--hd-color-palette-button-secondary-foreground); }
.hd-button--accent, .hd-button--checked { background: var(--hd-accent); border-color: transparent; color: #fff; }
.hd-button--negative { background: var(--hd-color-palette-warning); border-color: transparent; color: #fff; }
.hd-button--accent:active:not(:disabled), .hd-button--negative:active:not(:disabled) { color: rgba(255,255,255,.7); }
.hd-button--plain { background: transparent; border-color: transparent; color: var(--hd-c-link); }
.hd-button--block { display: flex; width: 100%; }
.hd-button--fixed { width: var(--hd-size-button-width); }
.hd-button--icon-only { padding: 0; width: var(--hd-size-button); --hd-sq-size: var(--hd-size-button); --hd-sq-fill: var(--hd-c-button-bg); --hd-sq-ring: var(--hd-c-button-border); }
.hd-button--icon-only.hd-button--accent, .hd-button--icon-only.hd-button--checked { --hd-sq-fill: var(--hd-accent); --hd-sq-ring: transparent; }
.hd-button--icon-only.hd-button--negative { --hd-sq-fill: var(--hd-color-palette-warning); --hd-sq-ring: transparent; }
.hd-button--icon-only.hd-button--plain { --hd-sq-fill: transparent; --hd-sq-ring: transparent; }
.hd-button--icon-only.hd-button--plain:hover:not(:disabled) { --hd-sq-fill: var(--hd-c-pressed); }
.hd-button { --hd-btn-base: var(--hd-c-button-bg); border-radius: calc(var(--hd-size-button) * .21); }
.hd-button--accent, .hd-button--checked { --hd-btn-base: var(--hd-accent); }
.hd-button--negative { --hd-btn-base: var(--hd-color-palette-warning); }
.hd-button:not(.hd-button--plain):not(.hd-button--flat):not(.hd-sq) { background: var(--hd-lit-fill); border-color: var(--hd-btn-rim); box-shadow: inset 0 1px 0 var(--hd-btn-rim-top); }
.hd-button--icon-only:not(.hd-button--plain):not(.hd-button--flat) { --hd-sq-fill: var(--hd-lit-fill); --hd-sq-ring: var(--hd-btn-rim); }
.hd-button:active:not(:disabled):not(.hd-button--plain):not(.hd-button--flat):not(.hd-sq) { background: linear-gradient(var(--hd-btn-bot), var(--hd-btn-base)); }
.hd-button:disabled, .hd-button[aria-disabled='true'] { opacity: var(--hd-opacity-disabled); cursor: default; }
</style>
